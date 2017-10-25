import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import { ShippingProfilesService } from '../../core/rest/markets/etsy/shipping-profiles/shipping-profiles.service';

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        TerraComponentsModule.forRoot(),
        FormsModule
    ],
    providers:    [],
    declarations: []
})
export class ShippingProfilesModule
{
    static forRoot()
    {
        return {
            ngModule:  ShippingProfilesModule,
            providers: [
                ShippingProfilesService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'ShippingProfilesComponent';
    }
}