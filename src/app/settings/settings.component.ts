import { Component, OnInit } from '@angular/core';
import { TerraAlertComponent, TerraMultiSelectBoxValueInterface, TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { SettingsService } from "./service/settings.service";

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles: [require('./settings.component.scss').toString()]
})
export class SettingsComponent implements OnInit {
    private service:SettingsService;
    private settings;
    private isLoading:boolean = true;
    private exportLanguages:Array<TerraMultiSelectBoxValueInterface>;
    private availableLanguages:Array<TerraSelectBoxValueInterface>;
    private alert:TerraAlertComponent = TerraAlertComponent.getInstance();

    constructor(private S:SettingsService) {
        this.service = S;

        this.settings = {
            shop: {
                shopId: 10,
                mainLanguage: 'de',
                exportLanguages: []
            },
            payment: {
                name: ''
            }
        };

        this.exportLanguages = [
            {
                value:   'en',
                caption: 'English',
                selected: false,
            },
            {
                value:   'de',
                caption: 'German',
                selected: false
            },
            {
                value:   'fr',
                caption: 'French',
                selected: false
            },
        ];

        this.availableLanguages = [
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

    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit() {
        this.loadSettings();
    }

    private loadSettings()
    {
        this.service.getSettings().subscribe(
            response => {
                this.mapSettings(response);
                this.isLoading = false;
            },

            error => {
                this.alert.addAlert({
                    msg: 'Could not load settings: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;
            }
        );
    }

    private mapSettings(response:any):void
    {
        if(typeof response !== 'undefined')
        {
            let settings = this.settings;

            if("shop" in response)
            {
                if("shopId" in response.shop)
                {
                    settings.shop.shopId = response.shop.shopId;
                }

                if("mainLanguage" in response.shop)
                {
                    settings.shop.mainLanguage = response.shop.mainLanguage;
                }

                let exportLanguages = this.exportLanguages;

                if("exportLanguages" in response.shop)
                {
                    response.shop.exportLanguages.forEach(function(responseItem){
                        exportLanguages.forEach(function(item, key) {
                            if(item.value == responseItem)
                            {
                                exportLanguages[key].selected = true;
                            }
                        });
                    });
                }
            }

            if("payment" in response)
            {
                if("name" in response.payment)
                {
                    settings.payment.name = response.payment.name;
                }
            }
        }
    }

    private saveSettings():void
    {
        this.isLoading = true;

        let data = {
            shop: {
                shopId: this.settings.shop.shopId,
                mainLanguage: this.settings.shop.mainLanguage,
                exportLanguages: this.getSelectedExportLanguages()
            },
            payment: {
                name: this.settings.payment.name
            }
        };

        this.service.saveSettings(data).subscribe(
            response => {
                this.alert.addAlert({
                    msg: 'Settings saved successfully',
                    closable: true,
                    type: 'success',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;
            },

            error => {
                this.alert.addAlert({
                    msg: 'Could not save settings: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

                this.isLoading = false;
            }
        );
    }

    private getSelectedExportLanguages():Array<any>
    {
        let exportLanguagesList = [];

        this.exportLanguages.forEach(function(item) {
            if(item.selected === true)
            {
                exportLanguagesList.push(item.value);
            }
        });

        return exportLanguagesList;
    }
}