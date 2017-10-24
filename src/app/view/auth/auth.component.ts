import {
    Component,
    OnInit
} from '@angular/core';
import {
    AuthService,
} from "../../core/rest/markets/etsy/auth/auth.service";
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';

@Component({
    selector: 'auth',
    template: require('./auth.component.html'),
    styles:   [require('./auth.component.scss')]
})
export class AuthComponent extends Translation implements OnInit
{
    private _isAuthenticated;

    constructor(private _authService:AuthService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);
    }

    ngOnInit()
    {
        this.checkLoginStatus();
    }

    private checkLoginStatus()
    {
        this._loadingConfig.callLoadingEvent(true);

        this._authService.getLoginStatus().subscribe(
            response =>
            {
                this._isAuthenticated = response.status;

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                let message:any = error.json();

                this._alertConfig.callStatusEvent(this.translation.translate('errorLoginStatusCheck') + ': ' + message.error.code + ' ' + message.error.message,
                    'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private openLoginPopup()
    {
        this._loadingConfig.callLoadingEvent(true);

        this._authService.getLoginUrl().subscribe(
            response =>
            {
                this._loadingConfig.callLoadingEvent(false);

                let popup = window.open(
                    response.loginUrl,
                    'Etsy Login',
                    'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                let pollTimer = window.setInterval(() =>
                {
                    if(popup.closed !== false)
                    {
                        window.clearInterval(pollTimer);

                        this.checkLoginStatus();
                    }
                }, 200);
            },

            error =>
            {
                let message:any = error.json();

                this._alertConfig.callStatusEvent(this.translation.translate('errorFetchLoginUrl') + ': ' + message.error.code + ' ' + message.error.message,
                    'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}

