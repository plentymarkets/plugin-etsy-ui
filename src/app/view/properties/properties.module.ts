import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { PropertiesService } from '../../core/rest/markets/etsy/properties/properties.service';
import { PropertiesSplitConfig } from './config/properties-split.config';
import { PropertiesListModule } from './view/properties-list/properties-list.module';
import { PropertyCorrelationModule } from './view/property-correlation/property-correlation.module';

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        TerraComponentsModule.forRoot(),
        PropertiesListModule.forRoot(),
        PropertyCorrelationModule.forRoot(),
    ],
    providers:    [
        PropertiesSplitConfig
    ],
    declarations: []
})
export class PropertiesModule
{
    static forRoot()
    {
        return {
            ngModule:  PropertiesModule,
            providers: [
                PropertiesService,
            ]
        };
    }

    static getMainComponent():string
    {
        return 'PropertiesComponent';
    }
}