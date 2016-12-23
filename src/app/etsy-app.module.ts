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
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { PropertiesComponent } from "./properties/properties.component";
import { PropertyService } from "./properties/service/property.service";
import { LocaleModule } from "angular2localization/angular2localization";
import { LocalizationModule } from "angular2localization/angular2localization";
import { LocaleService } from "angular2localization/angular2localization";
import { LocalizationService } from "angular2localization/angular2localization";
import { ModalModule, ComponentsHelper } from 'ng2-bootstrap/ng2-bootstrap';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        LocaleModule,
        LocalizationModule,
        TerraComponentsModule.forRoot()
    ],
    declarations: [
        EtsyComponent,
        ShippingProfilesComponent,
        LoginComponent,
        SettingsComponent,
        TaxonomiesComponent,
        PropertiesComponent,
        ToolbarComponent
    ],

    providers: [
        ShippingProfileService,
        LoginService,
        SettingsService,
        TaxonomyService,
        PropertyService,
        LocaleService,
        LocalizationService,
        {provide: ComponentsHelper, useClass: ComponentsHelper}
    ],

    bootstrap: [
        EtsyComponent
    ]
})

export class EtsyModule {
}