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
import { PlentyAlert } from '@plentymarkets/terra-components/index';

@Component({
  selector: 'shipping-profiles-table',
  template: require('./shipping-profiles.component.html'),
  styles: [require('./shipping-profiles.component.scss').toString()]
})
export class ShippingProfilesComponent implements OnInit {
  private alert:PlentyAlert = PlentyAlert.getInstance();
  private parcelServicePresetList:Array<PlentySelectBoxValue>;
  private shippingProfileSettingsList:Array<PlentySelectBoxValue>;
  private shippingProfileCorrelationList:Array<ShippingProfileCorrelationData>;
  private isSaving:boolean = true;

  constructor(private service:ShippingProfileService) {

    this.shippingProfileCorrelationList = [];

    service.getShippingProfileCorrelations().subscribe(
      response => {
        for (let index in response) {
          this.shippingProfileCorrelationList.push(response[index]);
        }

        this.isSaving = false;
      },

      error => {
        this.alert.addAlert('Could not load shipping profile correlations: ' + error.statusText,
          true,
          'danger',
          5000);
      }
    );

    service.getParcelServiceList().subscribe(
      response => {
        for (let index in response) {
          let data:ParcelServicesData = response[index];

          this.parcelServicePresetList.push({
            value: data.id,
            caption: data.name
          });
        }
      },

      error => {
        this.alert.addAlert('Could not load parcel service preset list: ' + error.statusText,
          true,
          'danger',
          5000);
      }
    );

    service.getShippingProfileSettingsList().subscribe(
      response => {
        for (let index in response) {
          let data:ShippingProfileSettingsData = response[index];

          this.shippingProfileSettingsList.push({
            value: data.id,
            caption: data.name
          });
        }
      },

      error => {
        this.alert.addAlert('Could not load shipping profile settings list: ' + error.statusText,
          true,
          'danger',
          5000);
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
        value: '0',
        caption: 'Default'
      }
    ];
    this.shippingProfileSettingsList = [
      {
        value: '0',
        caption: 'Default'
      }
    ];

  }

  private saveCorrelations():void {
    this.isSaving = true;

    this.service.saveCorrelations({correlations: this.shippingProfileCorrelationList}).subscribe(
      response => {
        this.alert.addAlert('Shipping profile correlations saved successfully',
          true,
          'success',
          5000);

        this.isSaving = false;
      },

      error => {
        this.alert.addAlert('Shipping profile correlations not saved',
          true,
          'danger',
          5000);

        this.isSaving = false;
      }
    );
  }

  private addCorrelation():void {
    this.shippingProfileCorrelationList.push({
      settingsId: null,
      parcelServicePresetId: null
    });
  }

  private removeCorrelation(item:ShippingProfileCorrelationData):void {
    var index = this.shippingProfileCorrelationList.indexOf(item);
    this.shippingProfileCorrelationList.splice(index, 1);
  }
}
