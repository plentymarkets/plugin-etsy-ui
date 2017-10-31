import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import { TaxonomiesService } from '../../../../core/rest/markets/etsy/taxonomies/taxonomies.service';
import { TaxonomyCorrelationComponent } from './taxonomy-correlation.component';
import { CategoriesService } from '../../../../core/rest/markets/etsy/categories/categories.service';

@NgModule({
    imports:      [
        CommonModule,
        TerraComponentsModule.forRoot(),
        TranslationModule,
        FormsModule,
    ],
    declarations: [
        TaxonomyCorrelationComponent
    ]
})
export class TaxonomyCorrelationModule
{
    static forRoot()
    {
        return {
            ngModule:  TaxonomyCorrelationModule,
            providers: [
                TaxonomiesService,
                CategoriesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'TaxonomyCorrelationComponent';
    }
}