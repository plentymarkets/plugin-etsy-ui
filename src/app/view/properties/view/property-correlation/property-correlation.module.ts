import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../../../../core/rest/markets/etsy/properties/properties.service';
import { PropertyCorrelationComponent } from './property-correlation.component';

@NgModule({
    imports:      [
        CommonModule,
        TerraComponentsModule.forRoot(),
        TranslationModule,
        FormsModule,
    ],
    declarations: [
        PropertyCorrelationComponent
    ]
})
export class PropertyCorrelationModule
{
    static forRoot()
    {
        return {
            ngModule:  PropertyCorrelationModule,
            providers: [
                PropertiesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'PropertyCorrelationComponent';
    }
}