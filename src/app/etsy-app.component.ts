import { Component } from '@angular/core';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { LoadingConfig } from './core/config/loading.config';
import { AlertConfig } from './core/config/alert.config';

@Component({
    selector: 'etsy-app',
    template: require('./etsy-app.component.html'),
    styles:   [require('./etsy-app.component.scss')],
})

export class EtsyAppComponent extends Translation
{
    private _action:any;

    constructor(public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._action = this.getUrlVars()['action'];

        this._alertConfig.callStatusEvent = this.callStatusEvent;
        this._loadingConfig.callLoadingEvent = this.callLoadingEvent;
    }

    private getUrlVars()
    {
        let vars = {};

        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(substring:string, ...args:any[]):string
        {
            vars[args[0]] = args[1];
            return;
        });

        return vars;
    }

    public callStatusEvent(message, type)
    {
        let detail = {
            type:    type,
            message: message
        };

        let customEvent:CustomEvent = new CustomEvent('status', {detail: detail});

        window.parent.window.parent.window.dispatchEvent(customEvent);
    }

    public callLoadingEvent(isLoading:boolean)
    {
        let detail = {
            isLoading: isLoading
        };

        let customEvent:CustomEvent = new CustomEvent('loadingStatus', {detail: detail});

        window.parent.window.parent.window.dispatchEvent(customEvent);
    }
}
