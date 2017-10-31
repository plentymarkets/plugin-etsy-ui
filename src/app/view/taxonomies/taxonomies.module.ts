import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { TaxonomiesService } from '../../core/rest/markets/etsy/taxonomies/taxonomies.service';
import { TaxonomiesSplitConfig } from './config/taxonomies-split.config';
import { TaxonomiesListModule } from './view/taxonomies-list/taxonomies-list.module';
import { TaxonomyCorrelationModule } from './view/taxonomy-correlation/taxonomy-correlation.module';
import { CategoriesService } from '../../core/rest/markets/etsy/categories/categories.service';

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        TerraComponentsModule.forRoot(),
        TaxonomiesListModule.forRoot(),
        TaxonomyCorrelationModule.forRoot(),
    ],
    providers:    [
        TaxonomiesSplitConfig
    ],
    declarations: []
})
export class TaxonomiesModule
{
    static forRoot()
    {
        return {
            ngModule:  TaxonomiesModule,
            providers: [
                TaxonomiesService,
                CategoriesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'TaxonomiesComponent';
    }
}