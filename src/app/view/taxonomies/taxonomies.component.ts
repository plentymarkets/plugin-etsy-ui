import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    TerraTreeComponent,
    TerraOverlayComponent,
    TerraLeafInterface,
    TerraOverlayButtonInterface,
} from '@plentymarkets/terra-components';
import { TaxonomiesService } from "../../core/rest/markets/etsy/taxonomies/taxonomies.service";
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import { Observable } from 'rxjs/Observable';
import { TaxonomyCorrelationInterface } from '../../core/rest/markets/etsy/taxonomies/data/taxonomy-correlation.interface';
import { TaxonomyInterface } from '../../core/rest/markets/etsy/taxonomies/data/taxonomy.interface';
import { TaxonomyCorrelationComponent } from './view/taxonomy-correlation/taxonomy-correlation.component';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'taxonomies',
    template: require('./taxonomies.component.html'),
    styles:   [require('./taxonomies.component.scss')]
})
export class TaxonomiesComponent extends Translation implements OnInit
{
    @ViewChild('correlationOverlay') public correlationOverlay:TerraOverlayComponent;
    @ViewChild('taxonomyCorrelation') public taxonomyCorrelation:TaxonomyCorrelationComponent;

    private _applyButtonInterface:TerraOverlayButtonInterface;

    private _taxonomiesTree:Array<TerraLeafInterface>;
    private _taxonomiesNameList:Array<any>;

    private _taxonomyCorrelationInOverlay:TaxonomyCorrelationInterface;

    private _categoryValueList:Array<TerraLeafInterface>;
    private _taxonomyCorrelations:Array<TaxonomyCorrelationInterface>;

    constructor(private _taxonomiesService:TaxonomiesService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._taxonomiesTree = [];
        this._taxonomiesNameList = [];
    }

    ngOnInit()
    {
        this._applyButtonInterface = {
            icon:          null,
            caption:       'Apply',
            clickFunction: () => this.applyCorrelation(this.taxonomyCorrelation)
        };
        
        this.initData();
    }

    private initData()
    {
        this._loadingConfig.callLoadingEvent(true);

        Observable.combineLatest(
            this._taxonomiesService.getTaxonomies(),
            this._taxonomiesService.getCategories(),
            this._taxonomiesService.getCorrelations(),

            (taxonomies, categories, taxonomyCorrelations) =>
            {
                return {
                    taxonomies:           taxonomies,
                    categories:           categories,
                    taxonomyCorrelations: taxonomyCorrelations
                }
            }
        ).subscribe(
            (data:any) =>
            {
                this._taxonomyCorrelations = data.taxonomyCorrelations;

                this.createTaxonomiesTree(data.taxonomies);
                // this.createCategoriesList(data.categories);

                this._loadingConfig.callLoadingEvent(false);
            },
            (error:any) =>
            {
                this._loadingConfig.callLoadingEvent(false);

                let message:any = error.json();

                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }

    private createTaxonomiesTree(taxonomies:Array<TaxonomyInterface>):void
    {
        taxonomies.forEach((item) =>
        {
            this._taxonomiesNameList[item.id] = item.name;

            this._taxonomiesTree.push(this.getLeaf(item));
        });
    }

    private getLeaf(item):TerraLeafInterface
    {
        let leafData = {
            caption:     item.name,
            id:          item.id,
            icon:        null,
            subLeafList: null
        };

        this._taxonomiesNameList[item.id] = item.name;

        if(item.children.length > 0)
        {
            leafData.icon = 'icon-folder';
            leafData.subLeafList = [];

            item.children.forEach((child) =>
            {
                leafData.subLeafList.push(this.getLeaf(child));
            });
        }

        return leafData;
    }


    private getTaxonomyName(taxonomyId):string
    {
        if(this._taxonomiesNameList[taxonomyId])
        {
            return this._taxonomiesNameList[taxonomyId];
        }

        return ' ';
    }

    private editCorrelation(taxonomyCorrelation:TaxonomyCorrelationInterface)
    {
        this._taxonomyCorrelationInOverlay = taxonomyCorrelation;
        this.correlationOverlay.showOverlay();
    }

    public applyCorrelation(taxonomyCorrelationComponent:TaxonomyCorrelationComponent)
    {
        if(!isNullOrUndefined(taxonomyCorrelationComponent.taxonomiesTreeElement.getSelectedLeaf()))
        {
            this._taxonomyCorrelationInOverlay.taxonomyId = taxonomyCorrelationComponent.taxonomiesTreeElement.getSelectedLeaf().id;    
        }
        
        this.correlationOverlay.hideOverlay();
    }
    
    /*
    private openTaxonomiesOverlay(row)
    {
        this.rowInOverlay = row;

        this.viewTaxonomiesOverlay.showOverlay();
    }
    */

    /*
    private updateTaxonomy()
    {
        let leaf:TerraLeafInterface = this.tree.getSelectedLeaf();

        if(leaf != null)
        {
            this.rowInOverlay.taxonomyId = leaf.id;
            this.rowInOverlay.taxonomyName = this.getTaxonomyName(leaf.id);
            this.viewTaxonomiesOverlay.hideOverlay();
        }
    }


    private saveCorrelations()
    {
        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;

        this.categories.forEach((categoryData) =>
        {
            this.updateOrAddCorrelation(categoryData);
        });


        this.taxonomyService.saveCorrelations({correlations: this.correlations}).subscribe(
            result =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('successSaveTaxonomyCorrelations'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },

            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorSaveTaxonomyCorrelations') + ': ' + error.statusText,
                    'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        )
    }

    private updateOrAddCorrelation(categoryData)
    {
        let isUpdate = false;

        this.correlations.forEach((correlationData, key) =>
        {
            if(correlationData.categoryId == categoryData.categoryId)
            {
                isUpdate = true;
                if(categoryData.taxonomyId)
                {
                    this.correlations[key].taxonomyId = categoryData.taxonomyId
                }
                else
                {
                    this.correlations[key].taxonomyId = null;
                }
            }
        });

        if(isUpdate == false && categoryData.taxonomyId)
        {
            this.correlations.push({
                taxonomyId: categoryData.taxonomyId,
                categoryId: categoryData.categoryId
            })
        }
    }

    private calculatePagingData(response, perPage, currentPage):void
    {
        this.pagingData.totalsCount = response.totalsCount;
        this.pagingData.page = currentPage;
        this.pagingData.itemsPerPage = perPage;
        this.pagingData.lastPageNumber = Math.ceil(response.totalsCount / perPage);

        let from = perPage * (currentPage - 1);
        this.pagingData.firstOnPage = (from <= 0) ? 1 : from;

        let to = (this.pagingData.firstOnPage <= 1) ? perPage : (this.pagingData.firstOnPage + perPage);
        this.pagingData.lastOnPage = (to > this.pagingData.totalsCount) ? this.pagingData.totalsCount : to;
    }

    private reload()
    {
        location.reload();
    }
    */
}