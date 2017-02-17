import {
    Component,
    OnInit,
    Inject,
    forwardRef
} from '@angular/core';
import { ShippingProfileService } from './service/shipping-profile.service';
import { ParcelServicesData } from './data/parcel-services-data';
import { ShippingProfileSettingsData } from './data/shipping-profile-settings-data';
import { ShippingProfileCorrelationData } from './data/shipping-profile-correlation-data';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { EtsyComponent } from "../etsy-app.component";
import { LocaleService } from "angular2localization/angular2localization";
import { LocalizationService } from "angular2localization/angular2localization";
import { Locale } from "angular2localization/angular2localization";

@Component({
               selector: 'shipping-profiles',
               template: require('./shipping-profiles.component.html'),
               styles:   [require('./shipping-profiles.component.scss')]
           })
export class ShippingProfilesComponent extends Locale implements OnInit
{
    private parcelServicePresetList:Array<TerraSelectBoxValueInterface>;
    private shippingProfileSettingsList:Array<TerraSelectBoxValueInterface>;
    private shippingProfileCorrelationList:Array<any>;
    private isLoading:boolean = true;
    
    constructor(private service:ShippingProfileService,
                @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent,
                locale:LocaleService,
                localization:LocalizationService)
    {
        super(locale, localization);
        
        this.shippingProfileCorrelationList = [];
        this.parcelServicePresetList = [
            {
                value:   null,
                caption: 'Default'
            }
        ];
        this.shippingProfileSettingsList = [
            {
                value:   null,
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
    ngOnInit()
    {
        
    }
    
    private getShippingProfileCorrelations():void
    {
        this.etsyComponent.callLoadingEvent(true);
        
        this.service.getShippingProfileCorrelations().subscribe(
            response =>
            {
                for(let index in response)
                {
                    this.shippingProfileCorrelationList.push(response[index]);
                }
                
                this.etsyComponent.callLoadingEvent(false);
                
                this.getParcelServiceList();
            },
            
            error =>
            {
                
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadShippingProfileCorrelations') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }
    
    private getParcelServiceList():void
    {
        this.etsyComponent.callLoadingEvent(true);
        
        this.service.getParcelServiceList().subscribe(
            response =>
            {
                for(let index in response)
                {
                    let data:ParcelServicesData = response[index];
                    
                    this.parcelServicePresetList.push({
                                                          value:   data.id,
                                                          caption: data.name
                                                      });
                }
                
                this.etsyComponent.callLoadingEvent(false);
                this.getShippingProfileSettingsList();
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadParcelServicePresetList') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }
    
    private getShippingProfileSettingsList():void
    {
        this.etsyComponent.callLoadingEvent(true);
        
        this.service.getShippingProfileSettingsList().subscribe(
            response =>
            {
                this.shippingProfileSettingsList = [];
                
                for(let index in response)
                {
                    let data:ShippingProfileSettingsData = response[index];
                    
                    this.shippingProfileSettingsList.push({
                                                              value:   data.id,
                                                              caption: data.name
                                                          });
                }
                
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadShippingProfileSettingsList') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }
    
    
    private saveCorrelations():void
    {
        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;
        
        this.service.saveCorrelations({correlations: this.shippingProfileCorrelationList}).subscribe(
            response =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('successSaveShippingProfileCorrelations'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorSaveShippingProfileCorrelations') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }
    
    private deleteCorrelations():void
    {
        let foundAtLeastOne = false;
        
        for(let i = this.shippingProfileCorrelationList.length - 1; i >= 0; i--)
        {
            if(this.shippingProfileCorrelationList[i].selected === true)
            {
                foundAtLeastOne = true;
                this.shippingProfileCorrelationList.splice(i, 1);
            }
        }
        
        if(foundAtLeastOne)
        {
            this.saveCorrelations();
        }
    }
    
    private addCorrelation():void
    {
        this.shippingProfileCorrelationList.push({
                                                     settingsId:            null,
                                                     parcelServicePresetId: null
                                                 });
    }
    
    private import():void
    {
        this.isLoading = true;
        this.etsyComponent.callLoadingEvent(true);
        
        this.service.importShippingProfiles().subscribe(
            response =>
            {
                this.getShippingProfileSettingsList();
                
                this.etsyComponent.callStatusEvent(this.localization.translate('successImportShippingProfiles'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorImportShippingProfiles') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }
    
    private reload()
    {
        location.reload();
    }
}
