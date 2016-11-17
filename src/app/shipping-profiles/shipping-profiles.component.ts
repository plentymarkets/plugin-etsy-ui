import { Component, OnInit } from '@angular/core';
import { ShippingProfileService } from './service/shipping-profile.service.ts';
import { ParcelServicesData } from './data/parcel-services-data';
import { ShippingProfileSettingsData } from './data/shipping-profile-settings-data';
import { ShippingProfileCorrelationData } from './data/shipping-profile-correlation-data';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { TerraAlertComponent } from '@plentymarkets/terra-components/index';

@Component({
    selector: 'shipping-profiles-table',
    template: require('./shipping-profiles.component.html'),
    styles: [require('./shipping-profiles.component.scss').toString()]
})
export class ShippingProfilesComponent implements OnInit {
    private alert:TerraAlertComponent = TerraAlertComponent.getInstance();
    private parcelServicePresetList:Array<TerraSelectBoxValueInterface>;
    private shippingProfileSettingsList:Array<TerraSelectBoxValueInterface>;
    private shippingProfileCorrelationList:Array<ShippingProfileCorrelationData>;
    private isLoading:boolean = true;
    private service:ShippingProfileService;

    constructor(private S:ShippingProfileService) {

        this.service = S;
        this.shippingProfileCorrelationList = [];

        this.getShippingProfileCorrelations();
        this.getParcelServiceList();
        this.getShippingProfileSettingsList();
    }

    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit() {

    }

    private getShippingProfileCorrelations():void {
        this.service.getShippingProfileCorrelations().subscribe(
            response => {
                for (let index in response) {
                    this.shippingProfileCorrelationList.push(response[index]);
                }

                this.isLoading = false;
            },

            error => {

                this.alert.addAlert({
                    msg: 'Could not load shipping profile correlations: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;

            }
        );
    }

    private getParcelServiceList():void {

        this.parcelServicePresetList = [
            {
                value: null,
                caption: 'Default'
            }
        ];

        this.service.getParcelServiceList().subscribe(
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

                this.alert.addAlert({
                    msg: 'Could not load parcel service preset list: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

            }
        );
    }

    private getShippingProfileSettingsList():void {

        this.shippingProfileSettingsList = [
            {
                value: null,
                caption: 'Default'
            }
        ];

        this.service.getShippingProfileSettingsList().subscribe(
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

                this.alert.addAlert({
                    msg: 'Could not load shipping profile settings list: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

            }
        );
    }


    private saveCorrelations():void {
        this.isLoading = true;

        this.service.saveCorrelations({correlations: this.shippingProfileCorrelationList}).subscribe(
            response => {

                this.alert.addAlert({
                    msg: 'Shipping profile correlations saved successfully',
                    closable: true,
                    type: 'success',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;
            },

            error => {

                this.alert.addAlert({
                    msg: 'Shipping profile correlations not saved' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;
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

    private import():void {
        this.isLoading = true;

        this.service.importShippingProfiles().subscribe(
            response => {

                this.alert.addAlert({
                    msg: 'Shipping profiles imported',
                    closable: true,
                    type: 'success',
                    dismissOnTimeout: 5000
                });

                this.getShippingProfileSettingsList();

                this.isLoading = false;
            },

            error => {

                this.alert.addAlert({
                    msg: 'Shipping profiles could not be imported' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;
            }
        );
    }
}
