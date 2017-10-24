import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TerraComponentsModule} from '@plentymarkets/terra-components/app/terra-components.module';
import {TranslationModule} from "angular-l10n";
import { SettingsService } from '../../core/rest/markets/etsy/settings/settings.service';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TranslationModule,
        TerraComponentsModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
    ],
    declarations: [
    ]
})
export class SettingsModule {
    static forRoot() {
        return {
            ngModule: SettingsModule,
            providers: [
                SettingsService
            ]
        };
    }

    static getMainComponent(): string {
        return 'SettingsComponent';
    }
}