import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import { PropertiesListComponent, } from './properties-list.component';
import { PropertiesService } from '../../../../core/rest/markets/etsy/properties/properties.service';

@NgModule({
    imports:      [
        CommonModule,
        TerraComponentsModule.forRoot(),
        TranslationModule,
        FormsModule,
    ],
    declarations: [
        PropertiesListComponent
    ]
})
export class PropertiesListModule
{
    static forRoot()
    {
        return {
            ngModule:  PropertiesListModule,
            providers: [
                PropertiesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'PropertiesListComponent';
    }
}