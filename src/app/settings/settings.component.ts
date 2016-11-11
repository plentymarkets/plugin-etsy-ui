import { Component, OnInit } from '@angular/core';
import { PlentyAlert } from '@plentymarkets/terra-components/index';
import { SettingsService } from "./service/settings.service";

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles: [require('./settings.component.scss').toString()]
})
export class SettingsComponent implements OnInit {
    private service:SettingsService;
    private alert:PlentyAlert = PlentyAlert.getInstance();

    constructor(private S:SettingsService) {
        this.service = S;
    }

    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit() {
    }
}

