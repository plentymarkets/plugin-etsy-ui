import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { ShippingProfileService } from './service/shipping-profile.service.ts';
import { ParcelServicesData } from './data/parcel-services-data';
import { ShippingProfileSettingsData } from './data/shipping-profile-settings-data';
import { ShippingProfileCorrelationData } from './data/shipping-profile-correlation-data';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { EtsyComponent } from "../etsy-app.component";

@Component({
    selector: 'shipping-profiles-table',
    template: require('./shipping-profiles.component.html'),
    styles: [require('./shipping-profiles.component.scss').toString()]
})
export class ShippingProfilesComponent implements OnInit {
    private parcelServicePresetList:Array<TerraSelectBoxValueInterface>;
    private shippingProfileSettingsList:Array<TerraSelectBoxValueInterface>;
    private shippingProfileCorrelationList:Array<ShippingProfileCorrelationData>;
    private isLoading:boolean = true;
    private service:ShippingProfileService;

    constructor(private S:ShippingProfileService, @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent) {

        this.service = S;
        this.shippingProfileCorrelationList = [];
        this.parcelServicePresetList = [
            {
                value: null,
                caption: 'Default'
            }
        ];
        this.shippingProfileSettingsList = [
            {
                value: null,
                caption: 'Default'
            }
        ];

        this.getShippingProfileCorrelations();
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
        this.etsyComponent.callLoadingEvent(true);

        this.service.getShippingProfileCorrelations().subscribe(
            response => {
                for (let index in response) {
                    this.shippingProfileCorrelationList.push(response[index]);
                }

                this.etsyComponent.callLoadingEvent(false);

                this.getParcelServiceList();
            },

            error => {

                this.etsyComponent.callStatusEvent('Could not load shipping profile correlations: ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }

    private getParcelServiceList():void {
        this.etsyComponent.callLoadingEvent(true);

        this.service.getParcelServiceList().subscribe(
            response => {
                for (let index in response) {
                    let data:ParcelServicesData = response[index];

                    this.parcelServicePresetList.push({
                        value: data.id,
                        caption: data.name
                    });
                }

                this.etsyComponent.callLoadingEvent(false);
                this.getShippingProfileSettingsList();
            },

            error => {
                this.etsyComponent.callStatusEvent('Could not load parcel service preset list: ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }

    private getShippingProfileSettingsList():void {
        this.etsyComponent.callLoadingEvent(true);

        this.service.getShippingProfileSettingsList().subscribe(
            response => {
                for (let index in response) {
                    let data:ShippingProfileSettingsData = response[index];

                    this.shippingProfileSettingsList.push({
                        value: data.id,
                        caption: data.name
                    });
                }

                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent('Could not load shipping profile settings list: ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }


    private saveCorrelations():void {
        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;

        this.service.saveCorrelations({correlations: this.shippingProfileCorrelationList}).subscribe(
            response => {
                this.etsyComponent.callStatusEvent('Shipping profile correlations saved successfully', 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent('Shipping profile correlations not saved' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
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
        this.etsyComponent.callLoadingEvent(true);

        this.service.importShippingProfiles().subscribe(
            response => {
                this.getShippingProfileSettingsList();

                this.etsyComponent.callStatusEvent('Shipping profiles imported successfully', 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent('Shipping profiles could not be imported' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }

    private reload() {
        location.reload();
    }
}
