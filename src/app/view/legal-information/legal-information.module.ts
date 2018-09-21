import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TerraComponentsModule} from '@plentymarkets/terra-components/app/terra-components.module';
import {TranslationModule} from "angular-l10n";
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    LegalInformationService,
} from '../../core/rest/markets/etsy/legal-information/legal-information.service';

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
export class LegalInformationModule {
    static forRoot() {
        return {
            ngModule: LegalInformationModule,
            providers: [
                LegalInformationService
            ]
        };
    }

    static getMainComponent(): string {
        return 'LegalInformationComponent';
    }
}