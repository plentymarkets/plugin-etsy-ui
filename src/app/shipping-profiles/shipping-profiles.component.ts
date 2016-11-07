/*
 *
 * demonstrate parts and use of a component
 *
 * > DataTableDemoComponent <
 * use native PlentyDataTable Component and specify used service and class with matching format for responded data
 */

import { Component, OnInit } from '@angular/core';
import { ShippingProfileService } from './service/shipping-profile.service.ts';
import { ParcelServicesData } from './data/parcel-services-data';
import { PopupComponent } from '../popup/popup.component';
import { ShippingProfileSettingsData } from './data/shipping-profile-settings-data';
import { ShippingProfileCorrelationData } from './data/shipping-profile-correlation-data';
import { PlentySelectBoxValue } from '@plentymarkets/terra-components/index';

@Component({
  selector: 'shipping-profiles-table',
  template: require('./shipping-profiles.component.html'),
  styles: [require('./shipping-profiles.component.scss').toString()]
})
export class ShippingProfilesComponent implements OnInit
{
  private parcelServicePresetList:Array<PlentySelectBoxValue>;
  private shippingProfileSettingsList:Array<PlentySelectBoxValue>;
  private shippingProfileCorrelationList;

  constructor(private service:ShippingProfileService)
  {

    this.shippingProfileCorrelationList = [];

    service.getShippingProfileCorrelations().subscribe(
      res => {
        for (let index in res) {
          let data:ShippingProfileCorrelationData = res[index];

          this.shippingProfileCorrelationList.push({
            settingsId: data.settingsId,
            parcelServicePresetId: data.parcelServicePresetId
          });
        }
      }
    );

    service.getParcelServiceList().subscribe(
      res => {


        for (let index in res) {
          let data:ParcelServicesData = res[index];

          this.parcelServicePresetList.push({
            value: data.id,
            caption: data.name
          });
        }
      }
    );

    service.getShippingProfileSettingsList().subscribe(
      res => {
        for (let index in res) {
          let data:ShippingProfileSettingsData = res[index];

          this.shippingProfileSettingsList.push({
            value: data.id,
            caption: data.name
          });
        }
      }
    );


  }

  /*
   * belong to OnInit Lifecycle hook
   * get called right after the directive's data-bound properties have been checked for the
   * first time, and before any of its children have been checked. It is invoked only once when the
   * directive is instantiated.
   */
  ngOnInit() {

    this.parcelServicePresetList = [
      {
        value:   '0',
        caption: 'Default'
      }
    ];
    this.shippingProfileSettingsList = [
      {
        value:   '0',
        caption: 'Default'
      }
    ];

  }


}
