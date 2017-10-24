import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import { SettingsService } from '../../core/rest/markets/etsy/settings/settings.service';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { SettingsParameterInterface } from '../../core/rest/markets/etsy/settings/data/settings.parameter.interface';
import {
    TerraMultiSelectBoxComponent,
    TerraMultiSelectBoxValueInterface,
    TerraSelectBoxComponent,
    TerraSelectBoxValueInterface
} from '@plentymarkets/terra-components';
import { AlertConfig } from '../../core/config/alert.config';
import { LoadingConfig } from '../../core/config/loading.config';
import { Observable } from 'rxjs/Observable';
import { ShopInterface } from '../../core/rest/markets/etsy/settings/data/shop.interface';
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles:   [require('./settings.component.scss')]
})
export class SettingsComponent extends Translation implements OnInit
{
    @ViewChild('shopIdSelect') public shopIdSelect:TerraSelectBoxComponent;
    @ViewChild('exportLanguagesMultiSelect') public exportLanguagesMultiSelect:TerraMultiSelectBoxComponent;
    @ViewChild('mainLanguageSelect') public mainLanguageSelect:TerraSelectBoxComponent;
    @ViewChild('processesMultiSelect') public processesMultiSelect:TerraMultiSelectBoxComponent;

    private _settings:SettingsParameterInterface;

    private _shopValueList:Array<TerraSelectBoxValueInterface>;
    private _exportLanguagesValueList:Array<TerraMultiSelectBoxValueInterface>;
    private _mainLanguageValueList:Array<TerraSelectBoxValueInterface>;
    private _processesValueList:Array<TerraMultiSelectBoxValueInterface>;

    private _settingsForm:FormGroup;

    constructor(private _settingsService:SettingsService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._settings = {
            shop: {
                shopId:            0,
                mainLanguage:      'de',
                exportLanguages: [],
                processes:         []
            }
        };

        this._settingsForm = new FormGroup({
            shopId:       new FormControl(null, Validators.compose([
                Validators.required
            ])),
            mainLanguage: new FormControl(null, Validators.compose([
                Validators.required,
            ]))
        });

        this._shopValueList = [];
        this._exportLanguagesValueList = [];
        this._mainLanguageValueList = [];
        this._processesValueList = [];
    }

    ngOnInit()
    {
        this.createMainLanguagesList();

        this.createExportLanguagesList();

        this.createProcessesList();

        this.initSettings();
    }

    private createShopList(shops:Array<ShopInterface>)
    {
        let shopValues:Array<TerraSelectBoxValueInterface> = [];

        shops.forEach((shop:ShopInterface) =>
        {
            shopValues.push({
                value:   shop.shopId,
                caption: shop.shopName
            });
        });

        this._shopValueList = shopValues;
    }

    private createMainLanguagesList()
    {
        this._mainLanguageValueList = [
            {
                value:   'en',
                caption: 'English',
            },
            {
                value:   'de',
                caption: 'German',
            },
            {
                value:   'fr',
                caption: 'French',
            },
        ];
    }

    private createExportLanguagesList()
    {
        this._exportLanguagesValueList = [
            {
                value:    'en',
                caption:  'English',
                selected: false,
            },
            {
                value:    'de',
                caption:  'German',
                selected: false
            },
            {
                value:    'fr',
                caption:  'French',
                selected: false
            }
        ];
    }

    private createProcessesList()
    {
        this._processesValueList = [
            {
                value:    'item_export',
                caption:  'Item Export',
                selected: false
            },
            {
                value:    'stock_update',
                caption:  'Stock Update',
                selected: false
            },
            {
                value:    'order_import',
                caption:  'Order Import',
                selected: false
            },
        ];
    }


    private initSettings()
    {
        this._loadingConfig.callLoadingEvent(true);

        Observable.combineLatest(
            this._settingsService.getSettings(),
            this._settingsService.getShops(),
            (settings, shops) =>
            {
                return {
                    settings: settings,
                    shops:    shops,
                }
            }
        ).subscribe(
            (data:any) =>
            {
                this._settings = data.settings;

                this.createShopList(data.shops);

                this._loadingConfig.callLoadingEvent(false);
            },
            (error:any) =>
            {
                this._loadingConfig.callLoadingEvent(false);

                let message:any = error.json();

                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }

    private onSaveBtnClicked()
    {
        this.validateAndSave()
    }

    private validateAndSave():void
    {
        if(this.validateFormGroup())
        {
            this.saveSettings();
        }
    }

    private validateFormGroup():boolean
    {
        let valid:boolean = true;

        if(this._settingsForm.invalid)
        {
            if(this._settingsForm.get('shopId').invalid)
            {
                this.shopIdSelect.isValid = false;

                this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.invalidShopId'), 'danger');
            }
            else
            {
                this.shopIdSelect.isValid = true;
            }

            if(this._settingsForm.get('mainLanguage').invalid)
            {
                this.mainLanguageSelect.isValid = false;

                this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.invalidMainLanguage'), 'danger');
            }
            else
            {
                this.mainLanguageSelect.isValid = true;
            }

            valid = false;
        }

        if(this._settings.shop.exportLanguages.length <= 0)
        {
            this.exportLanguagesMultiSelect.inputIsError = true;
            valid = false;

            this._alertConfig.callStatusEvent(this.translation.translate('settings.alerts.invalidExportLanguages'), 'danger');
        }
        else
        {
            this.exportLanguagesMultiSelect.inputIsError = false;
        }

        if(valid)
        {
            this.shopIdSelect.isValid = true;
            this.mainLanguageSelect.isValid = true;
            this.exportLanguagesMultiSelect.inputIsError = false;
            this.processesMultiSelect.inputIsError = false;
        }

        return valid;
    }

    private saveSettings()
    {
        this._loadingConfig.callLoadingEvent(true);

        this._settingsService.saveSettings(this._settings).subscribe(
            response =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('successSaveSettings'), 'success');

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('errorSaveSettings') + ': ' + error.statusText, 'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

}