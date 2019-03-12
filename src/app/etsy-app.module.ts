import {
    APP_INITIALIZER,
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { EtsyAppComponent } from './etsy-app.component';
import { TranslationModule } from 'angular-l10n';
import { LoadingConfig } from './core/config/loading.config';
import { AlertConfig } from './core/config/alert.config';
import { LocalizationConfig } from './core/localization/localization.config';
import { AuthModule } from './view/auth/auth.module';
import { AuthComponent } from './view/auth/auth.component';
import { SettingsModule } from './view/settings/settings.module';
import { SettingsComponent } from './view/settings/settings.component';
import { LegalInformationModule } from './view/legal-information/legal-information.module';
import { LegalInformationComponent } from './view/legal-information/legal-information.component';

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        TranslationModule.forRoot(),
        TerraComponentsModule.forRoot(),
        AuthModule.forRoot(),
        SettingsModule.forRoot(),
        LegalInformationModule.forRoot(),
    ],
    declarations: [
        EtsyAppComponent,
        AuthComponent,
        SettingsComponent,
        LegalInformationComponent,
    ],

    providers: [
        LoadingConfig,
        AlertConfig,
        LocalizationConfig,
        {
            provide:    APP_INITIALIZER,
            useFactory: initLocalization,
            deps:       [LocalizationConfig],
            multi:      true
        }
    ],
    bootstrap: [
        EtsyAppComponent
    ]
})

export class EtsyAppModule
{
}

export function initLocalization(localizationConfig:LocalizationConfig):Function
{
    return () => localizationConfig.load();
}