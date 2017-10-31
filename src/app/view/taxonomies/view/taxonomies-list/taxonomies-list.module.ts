import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import { TaxonomiesService } from '../../../../core/rest/markets/etsy/taxonomies/taxonomies.service';
import { TaxonomiesListComponent } from './taxonomies-list.component';

@NgModule({
    imports:      [
        CommonModule,
        TerraComponentsModule.forRoot(),
        TranslationModule,
        FormsModule,
    ],
    declarations: [
        TaxonomiesListComponent
    ]
})
export class TaxonomiesListModule
{
    static forRoot()
    {
        return {
            ngModule:  TaxonomiesListModule,
            providers: [
                TaxonomiesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'TaxonomiesListComponent';
    }
}