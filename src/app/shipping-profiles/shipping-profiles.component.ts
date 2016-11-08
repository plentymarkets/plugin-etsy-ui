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

@Component({
  selector: 'shipping-profiles-table',
  template: require('./shipping-profiles.component.html'),
  styles: [require('./shipping-profiles.component.scss')]
})
export class ShippingProfilesComponent implements OnInit {

  private parcelServicePresetList;
  private shippingProfileSettingsList;
  private shippingProfileCorrelationList;

  constructor(private service:ShippingProfileService) {

    this.parcelServicePresetList = [];
    this.shippingProfileSettingsList = [];
    this.shippingProfileCorrelationList = [];

    service.getShippingProfileCorrelations().subscribe(
      res => {
        for (let index in res) {
          this.shippingProfileCorrelationList.push(res[index]);
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

  }

  private saveCorrelations():void
  {
    this.service.saveCorrelations({
      correlations:this.shippingProfileCorrelationList}).subscribe(
      res => {

      },

      error => {

      }
    );
  }

  private addCorrelation():void
  {
    this.shippingProfileCorrelationList.push({
      settingsId: null,
      parcelServicePresetId: null
    });

    // this.service.saveCorrelations(this.shippingProfileCorrelationList);
  }
}
