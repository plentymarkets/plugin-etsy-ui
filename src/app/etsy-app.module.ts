import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppModule } from '@plentymarkets/terra-components/app/';
import { EtsyComponent }   from './etsy-app.component.ts';
import { ShippingProfilesComponent } from "./shipping-profiles/shipping-profiles.component";
import { ShippingProfileService } from "./shipping-profiles/service/shipping-profile.service";
import { LoginComponent } from "./login/login.component";
import { LoginService } from "./login/service/login.service";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        AppModule.forRoot()
    ],
    declarations: [
        EtsyComponent,
        ShippingProfilesComponent,
        LoginComponent
    ],

    providers: [
        ShippingProfileService,
        LoginService
    ],

    bootstrap: [
        EtsyComponent
    ]
})

export class EtsyModule {
}