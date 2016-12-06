import { Component, OnInit, forwardRef, Inject } from '@angular/core';
import { TerraMultiSelectBoxValueInterface, TerraSelectBoxValueInterface } from '@plentymarkets/terra-components/index';
import { SettingsService } from "./service/settings.service";
import { EtsyComponent } from "../etsy-app.component";
import { Locale } from "angular2localization/angular2localization";
import { LocaleService} from "angular2localization/angular2localization";
import { LocalizationService} from "angular2localization/angular2localization";

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles: [require('./settings.component.scss').toString()]
})
export class SettingsComponent extends Locale implements OnInit {
    private settings;
    private isLoading:boolean = true;
    private exportLanguages:Array<TerraMultiSelectBoxValueInterface>;
    private processes:Array<TerraMultiSelectBoxValueInterface>;
    private availableLanguages:Array<TerraSelectBoxValueInterface>;

    constructor(
        private service:SettingsService,
        @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent,
        locale:LocaleService,
        localization:LocalizationService
    ) {
        super(locale,localization);

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
                caption: this.localization.translate('successSaveSettings'),
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

        this.processes = [
            {
                value: 'item_export',
                caption: 'Item Export',
                selected: false
            },
            {
                value: 'stock_update',
                caption: 'Stock Update',
                selected: false
            },
            {
                value: 'order_import',
                caption: 'Order Import',
                selected: false
            }
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
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadSettings') + ': ' + error.statusText, 'danger');
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

                if ("processes" in response.shop) {
                    response.shop.processes.forEach((responseItem) => {
                        this.processes.forEach((item, key) => {
                            if (item.value == responseItem) {
                                this.processes[key].selected = true;
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
                exportLanguages: this.getSelectedExportLanguages(),
                processes: this.getSelectedProcesses(),
            },
            payment: {
                name: this.settings.payment.name
            }
        };

        this.service.saveSettings(data).subscribe(
            response => {
                this.etsyComponent.callStatusEvent(this.localization.translate('successSaveSettings'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorSaveSettings') + ': ' + error.statusText, 'danger');
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

    private getSelectedProcesses():Array<any> {
        let processesList = [];

        this.processes.forEach((item) => {
            if (item.selected === true) {
                processesList.push(item.value);
            }
        });

        return processesList;
    }
}