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
import { isNullOrUndefined } from 'util';
import { LegalInformationService } from '../../core/rest/markets/etsy/legal-information/legal-information.service';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components';

@Component({
    selector: 'legal-information',
    template: require('./legal-information.component.html'),
    styles:   [require('./legal-information.component.scss')]
})
export class LegalInformationComponent extends Translation implements OnInit {
    
    private id;
    private _selectedLanguage;
    private _value;
    private _languages:Array<TerraSelectBoxValueInterface>;
    private values;
    
    constructor(private _loadingConfig:LoadingConfig,
                public translation:TranslationService,
                private _alertConfig:AlertConfig,
                private legalInformationService:LegalInformationService)
    {
        super(translation);
        
        this._languages = [
            {
                value: 'de',
                caption: 'de'
            },
            {
                value: 'en',
                caption: 'en'
            },
            {
                value: 'fr',
                caption: 'fr'
            }
        ];
    }
    
    ngOnInit()
    {
        this._selectedLanguage = 'de';
        this.loadSettings();
    }
    
    private setLegalInformationForLanguage()
    {
        if(!isNullOrUndefined(this.values[this._selectedLanguage])) {
            this._value = this.values[this._selectedLanguage];
        }
    }
    
    private loadSettings()
    {
        this.legalInformationService.loadLegalInformation().subscribe(
            response =>
            {
                this.fillLegalInformationData(response);
                this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.settingsSaved'), 'success');

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.settingsNotSaved') + ': ' + error.statusText, 'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
    
    private fillLegalInformationData(responseList:any)
    {
        for (let entry of responseList.entries) {
            this.values[entry.lang] = entry.value;
        }
    }
    
    private saveSettings()
    {
        this._loadingConfig.callLoadingEvent(true);
        
        let legalInformationSettings = {
            id: null,
            value: this._value,
            lang: this._selectedLanguage
        };
        
        if (!isNullOrUndefined(this.id)){
            legalInformationSettings.id = this.id;

            this.legalInformationService.updateLegalInformation(legalInformationSettings).subscribe(
                response =>
                {
                    this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.settingsSaved'), 'success');

                    this._loadingConfig.callLoadingEvent(false);
                },

                error =>
                {
                    this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.settingsNotSaved') + ': ' + error.statusText, 'danger');

                    this._loadingConfig.callLoadingEvent(false);
                }
            );
        } else {
            this.legalInformationService.saveLegalInformation(legalInformationSettings).subscribe(
                response =>
                {
                    this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.settingsSaved'), 'success');

                    this._loadingConfig.callLoadingEvent(false);
                },

                error =>
                {
                    this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.settingsNotSaved') + ': ' + error.statusText, 'danger');

                    this._loadingConfig.callLoadingEvent(false);
                }
            );
        }
    }
}