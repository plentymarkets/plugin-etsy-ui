import {
    Component,
    DoCheck,
    Input,
    OnInit
} from '@angular/core';
import {
    TerraSplitViewComponentInterface,
    TerraMultiSplitViewInterface,
} from '@plentymarkets/terra-components';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { TaxonomyCorrelationInterface } from '../../../../core/rest/markets/etsy/taxonomies/data/taxonomy-correlation.interface';
import { TaxonomiesService } from '../../../../core/rest/markets/etsy/taxonomies/taxonomies.service';
import { LoadingConfig } from '../../../../core/config/loading.config';
import { AlertConfig } from '../../../../core/config/alert.config';
import { TaxonomiesSplitConfig } from '../../config/taxonomies-split.config';
import { TaxonomyInterface } from '../../../../core/rest/markets/etsy/taxonomies/data/taxonomy.interface';
import { isNullOrUndefined } from 'util';
import { TaxonomyCorrelationModule } from '../taxonomy-correlation/taxonomy-correlation.module';
import { CategoryInterface } from '../../../../core/rest/markets/etsy/categories/data/category.interface';

@Component({
    selector: 'taxonomies-list',
    template: require('./taxonomies-list.component.html'),
    styles:   [require('./taxonomies-list.component.scss').toString()]
})
export class TaxonomiesListComponent extends Translation implements OnInit, TerraSplitViewComponentInterface, DoCheck
{
    @Input() public splitViewInstance:TerraMultiSplitViewInterface;
    @Input() public parameter:any;
    @Input() public taxonomies:Array<TaxonomyInterface>;
    @Input() public categories:Array<CategoryInterface>;
    @Input() public taxonomyCorrelations:Array<TaxonomyCorrelationInterface>;

    private _isFocused:boolean;
    private _selectedTaxonomyCorrelation:TaxonomyCorrelationInterface;

    constructor(private _editSplitViewConfig:TaxonomiesSplitConfig,
                public translation:TranslationService)
    {
        super(translation);

        this._isFocused = false;

        this._selectedTaxonomyCorrelation = null;
    }

    ngOnInit()
    {
    }

    public ngDoCheck():void
    {
        if(!isNullOrUndefined(this._editSplitViewConfig))
        {
            this._isFocused = this._editSplitViewConfig.currentSelectedView === this.splitViewInstance;
        }
    }

    private onDeleteBtnClicked(taxonomyCorrelation:TaxonomyCorrelationInterface)
    {
        this.deleteCorrelation(taxonomyCorrelation);
    }

    private deleteCorrelation(taxonomyCorrelation:TaxonomyCorrelationInterface):void
    {
        let idx = this.taxonomyCorrelations.indexOf(taxonomyCorrelation);

        this.taxonomyCorrelations.splice(idx, 1);
    }

    private editCorrelation(taxonomyCorrelation:TaxonomyCorrelationInterface)
    {
        this._selectedTaxonomyCorrelation = taxonomyCorrelation;
        
        this._editSplitViewConfig.addView({
            module:                TaxonomyCorrelationModule.forRoot(),
            defaultWidth:          'col-xs-12 col-md-8 col-lg-9',
            name:                  taxonomyCorrelation.category.name + ' + ' + taxonomyCorrelation.taxonomy.name,
            mainComponentName:     TaxonomyCorrelationModule.getMainComponent(),
            isBackgroundColorGrey: true,
            inputs:                [
                {
                    name:  'taxonomies',
                    value: this.taxonomies
                },
                {
                    name:  'categories',
                    value: this.categories
                },
                {
                    name:  'taxonomyCorrelation',
                    value: this._selectedTaxonomyCorrelation
                }
            ]
        }, this.splitViewInstance);
    }
    
    private getCategoryName(category:CategoryInterface)
    {
        let names:Array<string> = [];
        
        category.path.forEach((cat) => {
            names.push(cat.name);
        });
        
        return names.join(' &raquo; ');
    }

    private getTaxonomyName(taxonomy:TaxonomyInterface)
    {
        let names:Array<string> = [];
        
        taxonomy.path.forEach((cat) => {
            names.push(cat.name);
        });

        return names.join(' &raquo; ');
    }
}