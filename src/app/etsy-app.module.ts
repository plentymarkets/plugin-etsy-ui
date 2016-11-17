import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { EtsyComponent }   from './etsy-app.component.ts';
import { ShippingProfilesComponent } from "./shipping-profiles/shipping-profiles.component";
import { ShippingProfileService } from "./shipping-profiles/service/shipping-profile.service";
import { LoginComponent } from "./login/login.component";
import { LoginService } from "./login/service/login.service";
import { SettingsService } from "./settings/service/settings.service";
import { SettingsComponent } from "./settings/settings.component";
import { TaxonomiesComponent } from "./taxonomies/taxonomies.component";
import { TaxonomyService } from "./taxonomies/service/taxonomy.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        TerraComponentsModule.forRoot()
    ],
    declarations: [
        EtsyComponent,
        ShippingProfilesComponent,
        LoginComponent,
        SettingsComponent,
        TaxonomiesComponent
    ],

    providers: [
        ShippingProfileService,
        LoginService,
        SettingsService,
        TaxonomyService
    ],

    bootstrap: [
        EtsyComponent
    ]
})

export class EtsyModule {
}