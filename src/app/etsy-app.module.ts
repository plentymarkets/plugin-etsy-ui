/**
 *
 * root application module
 *
 * be required and can be the only module
 * declare components and directives of root app component
 * import used modules
 * list provided services
 */

import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { EtsyComponent } from './etsy-app.component.ts';
import { DataTableDemoComponent } from './data-table-demo/data-table-demo.component';
import { DataTableDemoService } from './data-table-demo/service/data-table-demo.service';
import { AppModule } from '@plentymarkets/terra-components/app/';
import { DataTableDemoDirective } from './data-table-demo/directive/data-table-demo.directive';
import { PopupComponent } from './popup/popup.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingBarDirective } from './loading-bar/directive/loading-bar.directive';
import { ShippingProfilesComponent } from './shipping-profiles/shipping-profiles.component';
import { ShippingProfileService } from "./shipping-profiles/service/shipping-profile.service.ts";

@NgModule({
  declarations: [
    EtsyComponent,
    DataTableDemoComponent,
    ShippingProfilesComponent,
    DataTableDemoDirective,
    PopupComponent,
    LoadingBarComponent,
    LoadingBarDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppModule.forRoot()
  ],
  providers: [
    DataTableDemoService,
    ShippingProfileService,
  ],
  bootstrap: [EtsyComponent]
})
export class EtsyModule
{

}
