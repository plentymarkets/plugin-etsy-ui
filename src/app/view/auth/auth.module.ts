import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TerraComponentsModule} from '@plentymarkets/terra-components/app/terra-components.module';
import {TranslationModule} from "angular-l10n";
import { AuthService } from '../../core/rest/markets/etsy/auth/auth.service';

@NgModule({
    imports: [
        CommonModule,
        TranslationModule,
        TerraComponentsModule.forRoot(),
    ],
    providers: [
    ],
    declarations: [
    ]
})
export class AuthModule {
    static forRoot() {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService
            ]
        };
    }

    static getMainComponent(): string {
        return 'AuthComponent';
    }
}