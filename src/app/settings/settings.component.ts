import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { TerraMultiSelectBoxValueInterface, TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { SettingsService } from "./service/settings.service";
import { EtsyComponent } from "../etsy-app.component";

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles: [require('./settings.component.scss').toString()]
})
export class SettingsComponent implements OnInit {
    private service:SettingsService;
    private settings;
    private testSettings:string = '';
    private isLoading:boolean = true;
    private exportLanguages:Array<TerraMultiSelectBoxValueInterface>;
    private availableLanguages:Array<TerraSelectBoxValueInterface>;

    constructor(private S:SettingsService, @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent) {
        this.service = S;

        this.settings = {
            shop: {
                shopId: 0,
                mainLanguage: 'de',
                exportLanguages: []
            },
            payment: {
                name: ''
            }
        };

        this.exportLanguages = [
            {
                value: 'en',
                caption: 'English',
                selected: false,
            },
            {
                value: 'de',
                caption: 'German',
                selected: false
            },
            {
                value: 'fr',
                caption: 'French',
                selected: false
            },
        ];

        this.availableLanguages = [
            {
                value: 'en',
                caption: 'English',
            },
            {
                value: 'de',
                caption: 'German',
            },
            {
                value: 'fr',
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

    private loadSettings() {
        this.etsyComponent.callLoadingEvent(true);

        this.service.getSettings().subscribe(
            response => {
                this.mapSettings(response);

                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.callStatusEvent('Could not load settings: ' + error.statusText, 'danger');
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }

    private mapSettings(response:any):void {
        if (typeof response !== 'undefined') {
            let settings = this.settings;

            if ("shop" in response) {
                if ("shopId" in response.shop) {
                    settings.shop.shopId = response.shop.shopId;
                }

                if ("mainLanguage" in response.shop) {
                    settings.shop.mainLanguage = response.shop.mainLanguage;
                }

                if ("exportLanguages" in response.shop) {
                    response.shop.exportLanguages.forEach((responseItem) => {
                        this.exportLanguages.forEach((item, key) => {
                            if (item.value == responseItem) {
                                this.exportLanguages[key].selected = true;
                            }
                        });
                    });
                }
            }

            if ("payment" in response) {
                if ("name" in response.payment) {
                    settings.payment.name = response.payment.name;
                }
            }
        }
    }

    private saveSettings():void {
        this.isLoading = true;
        this.etsyComponent.callLoadingEvent(true);

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
                this.etsyComponent.callStatusEvent('Settings saved successfully', 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent('Could not save settings: ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }

    private getSelectedExportLanguages():Array<any> {
        let exportLanguagesList = [];

        this.exportLanguages.forEach((item) => {
            if (item.selected === true) {
                exportLanguagesList.push(item.value);
            }
        });

        return exportLanguagesList;
    }
}