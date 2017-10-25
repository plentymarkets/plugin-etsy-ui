import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import { TaxonomiesService } from '../../core/rest/markets/etsy/taxonomies/taxonomies.service';

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        TerraComponentsModule.forRoot(),
        FormsModule,
    ],
    providers:    [],
    declarations: []
})
export class TaxonomiesModule
{
    static forRoot()
    {
        return {
            ngModule:  TaxonomiesModule,
            providers: [
                TaxonomiesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'TaxonomiesComponent';
    }
}