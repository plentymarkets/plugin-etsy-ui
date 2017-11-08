import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    TerraLeafInterface,
    TerraSplitViewComponentInterface,
    TerraMultiSplitViewInterface,
} from '@plentymarkets/terra-components';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { TaxonomiesService } from '../../../../core/rest/markets/etsy/taxonomies/taxonomies.service';
import { LoadingConfig } from '../../../../core/config/loading.config';
import { AlertConfig } from '../../../../core/config/alert.config';
import { TaxonomiesSplitConfig } from '../../config/taxonomies-split.config';
import { TaxonomyCorrelationInterface } from '../../../../core/rest/markets/etsy/taxonomies/data/taxonomy-correlation.interface';
import { Observable } from 'rxjs/Observable';
import { TaxonomyInterface } from '../../../../core/rest/markets/etsy/taxonomies/data/taxonomy.interface';
import { isNullOrUndefined } from 'util';
import { CategoriesService } from '../../../../core/rest/markets/etsy/categories/categories.service';
import { CategoryInterface } from '../../../../core/rest/markets/etsy/categories/data/category.interface';

@Component({
    selector: 'taxonomy-correlation',
    template: require('./taxonomy-correlation.component.html'),
    styles:   [require('./taxonomy-correlation.component.scss')]
})
export class TaxonomyCorrelationComponent extends Translation implements OnInit, TerraSplitViewComponentInterface
{
    @Input() public splitViewInstance:TerraMultiSplitViewInterface;
    @Input() public parameter:any;
    @Input() public taxonomies:Array<TaxonomyInterface>;
    @Input() public categories:Array<CategoryInterface>;
    @Input() public taxonomyCorrelation:TaxonomyCorrelationInterface;

    private _taxonomiesTree:Array<TerraLeafInterface>;
    private _categoriesTree:Array<TerraLeafInterface>;

    constructor(private _editSplitViewConfig:TaxonomiesSplitConfig,
                public translation:TranslationService,
                private _taxonomiesService:TaxonomiesService,
                private _categoriesService:CategoriesService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._taxonomiesTree = [];
        this._categoriesTree = [];
    }

    ngOnInit()
    {
        this.initTaxonomiesTree();
    }

    private initTaxonomiesTree()
    {
        this.createTaxonomiesTree(this.taxonomies, this.taxonomyCorrelation.taxonomy);
        this.createCategoriesTree(this.categories, this.taxonomyCorrelation.category);
    }

    private createTaxonomiesTree(taxonomies:Array<TaxonomyInterface>, currentTaxonomy:TaxonomyInterface)
    {
        this._taxonomiesTree = [];

        taxonomies.forEach((taxonomy) =>
        {
            this._taxonomiesTree.push(this.getTaxonomyChildren(taxonomy, currentTaxonomy.path));
        });
    }

    private getTaxonomyChildren(taxonomy:TaxonomyInterface, taxonomyPath:Array<TaxonomyInterface>):TerraLeafInterface
    {
        let leafData:TerraLeafInterface = {
            caption:       taxonomy.name,
            id:            taxonomy.id,
            icon:          null,
            subLeafList:   null,
            isOpen:        false,
            isActive:      taxonomy.id === this.taxonomyCorrelation.taxonomy.id,
            clickFunction: () =>
                           {
                               Observable.combineLatest(
                                   this._taxonomiesService.getTaxonomy(taxonomy.id),
                                   (taxonomy) =>
                                   {
                                       return {
                                           taxonomy: taxonomy
                                       }
                                   }
                               ).subscribe(
                                   (data:any) =>
                                   {
                                       this.taxonomyCorrelation.taxonomy = data.taxonomy;
                                       
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

        };

        if(!isNullOrUndefined(taxonomyPath) && taxonomyPath.length)
        {
            taxonomyPath.forEach((taxonomyPathElement:TaxonomyInterface) =>
            {
                if(taxonomyPathElement.id === taxonomy.id)
                {
                    leafData.isOpen = true;
                }
            });
        }

        if(!isNullOrUndefined(taxonomy.children) && taxonomy.children.length > 0)
        {
            leafData.icon = 'icon-folder';
            leafData.subLeafList = [];

            taxonomy.children.forEach((child) =>
            {
                leafData.subLeafList.push(this.getTaxonomyChildren(child, taxonomyPath));
            });
        }

        return leafData;
    }

    private createCategoriesTree(categories:Array<CategoryInterface>, currentCategory:CategoryInterface)
    {
        this._categoriesTree = [];

        categories.forEach((category) =>
        {
            this._categoriesTree.push(this.getCategoryChildren(category, currentCategory.path));
        });
    }

    private getCategoryChildren(category:CategoryInterface, categoryPath:Array<CategoryInterface>):TerraLeafInterface
    {
        let leafData:TerraLeafInterface = {
            caption:       category.name,
            id:            category.id,
            icon:          null,
            subLeafList:   null,
            isOpen:        false,
            isActive:      category.id === this.taxonomyCorrelation.category.id,
            clickFunction: () =>
                           {
                               Observable.combineLatest(
                                   this._categoriesService.getCategory(category.id),
                                   (category) =>
                                   {
                                       return {
                                           category: category
                                       }
                                   }
                               ).subscribe(
                                   (data:any) =>
                                   {
                                       this.taxonomyCorrelation.category = data.category;

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
        };

        if(!isNullOrUndefined(categoryPath) && categoryPath.length)
        {
            categoryPath.forEach((categoryPathElement:CategoryInterface) =>
            {
                if(categoryPathElement.id === category.id)
                {
                    leafData.isOpen = true;
                }
            });
        }

        if(!isNullOrUndefined(category.children) && category.children.length > 0)
        {
            leafData.icon = 'icon-folder';
            leafData.subLeafList = [];

            category.children.forEach((child) =>
            {
                leafData.subLeafList.push(this.getCategoryChildren(child, categoryPath));
            });
        }

        return leafData;
    }
}