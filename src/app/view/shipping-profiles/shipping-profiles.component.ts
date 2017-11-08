import {
    Component,
    OnInit
} from '@angular/core';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import { Observable } from 'rxjs/Observable';
import { ShippingProfilesService } from '../../core/rest/markets/etsy/shipping-profiles/shipping-profiles.service';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components';
import { ParcelServicePresetInterface } from '../../core/rest/markets/etsy/shipping-profiles/data/parcel-service-preset.interface';
import { ShippingProfileSettingsInterface } from '../../core/rest/markets/etsy/shipping-profiles/data/shipping-profile-settings.interface';
import { ShippingProfileCorrelationInterface } from '../../core/rest/markets/etsy/shipping-profiles/data/shipping-profile-correlation.interface';

@Component({
    selector: 'shipping-profiles',
    template: require('./shipping-profiles.component.html'),
    styles:   [require('./shipping-profiles.component.scss')]
})
export class ShippingProfilesComponent extends Translation implements OnInit
{
    private _parcelServicePresetValueList:Array<TerraSelectBoxValueInterface>;
    private _shippingProfileSettingsValueList:Array<TerraSelectBoxValueInterface>;
    
    private _shippingProfileCorrelations:Array<ShippingProfileCorrelationInterface>;

    private _isLoading:boolean;
    
    constructor(private _shippingProfilesService:ShippingProfilesService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._parcelServicePresetValueList = [];
        this._shippingProfileSettingsValueList = [];
        
        this._shippingProfileCorrelations = [];

        this._isLoading = false;
    }

    ngOnInit()
    {
        this.initData();
    }

    private initData()
    {
        this._isLoading = true;
        
        this._loadingConfig.callLoadingEvent(true);

        Observable.combineLatest(
            this._shippingProfilesService.getParcelServiceList(),
            this._shippingProfilesService.getShippingProfileSettingsList(),
            this._shippingProfilesService.getShippingProfileCorrelations(),
            (parcelServicePresets, shippingProfileSettings, shippingProfileCorrelations) =>
            {
                return {
                    parcelServicePresets: parcelServicePresets,
                    shippingProfileSettings:    shippingProfileSettings,
                    shippingProfileCorrelations: shippingProfileCorrelations
                }
            }
        ).subscribe(
            (data:any) =>
            {
                this._isLoading = false;
                
                this._shippingProfileCorrelations = data.shippingProfileCorrelations;
                
                this.createParcelServicePresetsList(data.parcelServicePresets);
                this.createShippingProfileSettingsList(data.shippingProfileSettings);

                this._loadingConfig.callLoadingEvent(false);
            },
            (error:any) =>
            {
                this._isLoading = false;
                
                this._loadingConfig.callLoadingEvent(false);

                let message:any = error.json();

                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }
    
    private createParcelServicePresetsList(parcelServicePresets:Array<ParcelServicePresetInterface>)
    {
        let parcelServicePresetValues:Array<TerraSelectBoxValueInterface> = [{
            value: null,
            caption: ''
        }];

        parcelServicePresets.forEach((parcelServicePreset:ParcelServicePresetInterface) =>
        {
            parcelServicePresetValues.push({
                value:   parcelServicePreset.id,
                caption: parcelServicePreset.name
            });
        });

        this._parcelServicePresetValueList = parcelServicePresetValues;
    }

    private createShippingProfileSettingsList(shippingProfileSettings:Array<ParcelServicePresetInterface>)
    {
        let shippingProfileSettingsValues:Array<TerraSelectBoxValueInterface> = [{
            value: null,
            caption: ''
        }];

        shippingProfileSettings.forEach((shippingProfileSettings:ShippingProfileSettingsInterface) =>
        {
            shippingProfileSettingsValues.push({
                value:   shippingProfileSettings.id,
                caption: shippingProfileSettings.name
            });
        });

        this._shippingProfileSettingsValueList = shippingProfileSettingsValues;
    }

    private addCorrelation():void
    {
        this._shippingProfileCorrelations.push({
            settingsId:                  null,
            parcelServicePresetId:       null,
        });
    }

    private deleteCorrelation(shippingProfileCorrelation:ShippingProfileCorrelationInterface):void
    {
        let idx = this._shippingProfileCorrelations.indexOf(shippingProfileCorrelation);

        this._shippingProfileCorrelations.splice(idx, 1);
    }
    
    private saveCorrelations():void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._shippingProfilesService.saveCorrelations(this._shippingProfileCorrelations).subscribe(
            response =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('shippingProfiles.alerts.correlationsSaved'), 'success');
                
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('shippingProfiles.alerts.correlationsNotSaved') + ' ' + error.statusText,
                    'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private importCorrelations():void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._shippingProfilesService.importShippingProfiles().subscribe(
            response =>
            {
                this.initData();

                this._alertConfig.callStatusEvent(this.translation.translate('shippingProfiles.alerts.shippingProfilesImported'), 'success');
                
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('shippingProfiles.alerts.shippingProfilesNotImported') + ' ' + error.statusText,
                    'danger');
                
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}
