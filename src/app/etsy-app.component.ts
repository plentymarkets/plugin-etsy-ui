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

    private getUrlVars() {
        var vars = {};

        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (substring: string, ...args: any[]): string {
            vars[args[0]] = args[1];
            return;
        });

        return vars;
    }
}
