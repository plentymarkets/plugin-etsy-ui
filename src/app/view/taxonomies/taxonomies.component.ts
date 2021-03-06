import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import { TerraMultiSplitViewInterface } from '@plentymarkets/terra-components';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import { Observable } from 'rxjs/Observable';
import { TaxonomiesSplitConfig } from './config/taxonomies-split.config';
import { TaxonomiesListModule } from './view/taxonomies-list/taxonomies-list.module';
import { TaxonomiesService } from "../../core/rest/markets/etsy/taxonomies/taxonomies.service";
import { CategoriesService } from '../../core/rest/markets/etsy/categories/categories.service';
import { TaxonomyCorrelationInterface } from '../../core/rest/markets/etsy/taxonomies/data/taxonomy-correlation.interface';

@Component({
    selector: 'taxonomies',
    template: require('./taxonomies.component.html'),
    styles:   [require('./taxonomies.component.scss').toString()]
})
export class TaxonomiesComponent extends Translation implements OnInit
{
    @Input() public splitViewInstance:TerraMultiSplitViewInterface;

    private _isLoading:boolean;

    private _taxonomyCorrelations:Array<TaxonomyCorrelationInterface>;
    
    private _lastUiId:number;

    constructor(private _taxonomiesService:TaxonomiesService,
                private _categoriesService:CategoriesService,
                public translation:TranslationService,
                private _editSplitViewConfig:TaxonomiesSplitConfig,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._isLoading = false;

        this._taxonomyCorrelations = [];

        this._lastUiId = 0;
    }

    ngOnInit()
    {
        this.initData();
    }

    private initData()
    {
        this._isLoading = true; 
        
        this._loadingConfig.callLoadingEvent(true);

        Observable.combineLatest(
            this._taxonomiesService.getTaxonomies(),
            this._categoriesService.getCategories(),
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
                data.taxonomyCorrelations.forEach((taxonomyCorrelation:TaxonomyCorrelationInterface) => {
                    this._lastUiId++;

                    this._taxonomyCorrelations.push({
                        uiId: this._lastUiId,
                        taxonomy: taxonomyCorrelation.taxonomy,
                        category: taxonomyCorrelation.category
                    });
                });
                
                this._editSplitViewConfig.addView({
                    module:                TaxonomiesListModule.forRoot(),
                    defaultWidth:          'col-xs-12 col-md-4 col-lg-3',
                    focusedWidth:          'col-xs-12 col-md-12 col-lg-12',
                    name:                  this.translation.translate('taxonomies.splitViewNames.correlations'),
                    mainComponentName:     TaxonomiesListModule.getMainComponent(),
                    isBackgroundColorGrey: true,
                    inputs:                [
                        {
                            name: 'taxonomies',
                            value: data.taxonomies
                        },
                        {
                            name: 'categories',
                            value: data.categories
                        },
                        {
                            name:  'taxonomyCorrelations',
                            value: this._taxonomyCorrelations
                        }
                    ]
                }, this.splitViewInstance);

                this._isLoading = false;

                this._loadingConfig.callLoadingEvent(false);
            },
            (error:any) =>
            {
                this._loadingConfig.callLoadingEvent(false);

                this._isLoading = false;

                let message:any = error.json();

                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }
    
    private addCorrelation()
    {
        this._lastUiId++;
        
        this._taxonomyCorrelations.push({
            uiId: this._lastUiId,
            taxonomy: {
                id: null,
                name: null,
                isLeaf: true,
                parentId: null,
                level: 0,
                children: [],
                path: [],
            },
            category: {
                id: null,
                name: null,
                isLeaf: true,
                parentId: null,
                level: 0,
                children: [],
                path: []
            }
        })
    }
    
    private onSaveBtnClicked()
    {
        this.saveCorrelations();
    }
    
    private saveCorrelations()
    {
        this._loadingConfig.callLoadingEvent(true);

        this._taxonomiesService.saveCorrelations(this._taxonomyCorrelations).subscribe(
            result =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('taxonomies.alerts.correlationsSaved'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('taxonomies.alerts.correlationsNotSaved') + ' ' + error.statusText,
                    'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        )
    }
}