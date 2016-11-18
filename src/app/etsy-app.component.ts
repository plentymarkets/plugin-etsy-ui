import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Locale } from 'angular2localization';

@Component({
    selector: 'etsy-app',
    template: require('./etsy-app.component.html'),
    styles: [require('./etsy-app.component.scss').toString()],
    changeDetection: ChangeDetectionStrategy.Default
})

export class EtsyComponent extends Locale {
    private action:any = this.getUrlVars()['action'];
    private _isLoading = true;

    private getUrlVars() {
        var vars = {};

        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (substring: string, ...args: any[]): string {
            vars[args[0]] = args[1];
            return;
        });

        return vars;
    }

    public reload() {
        location.reload();
    }

    public get isLoading():boolean
    {
        return this._isLoading;
    }

    public set isLoading(v:boolean)
    {
        this._isLoading = v;
    }

    public callStatusEvent(message, type)
    {
        let detail = {
            type: type,
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
