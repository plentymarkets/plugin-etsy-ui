import {
    Component,
    OnInit,
    ViewChild
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
import { AccountInterface } from '../../core/rest/markets/etsy/auth/data/account.interface';
import {
    TerraOverlayButtonInterface,
    TerraOverlayComponent
} from '@plentymarkets/terra-components';

@Component({
    selector: 'auth',
    template: require('./auth.component.html'),
    styles:   [require('./auth.component.scss')]
})
export class AuthComponent extends Translation implements OnInit
{
    @ViewChild('overlay') public overlay:TerraOverlayComponent;
    
    private _isAuthenticated:boolean;
    private _accountList:Array<AccountInterface>;
    private _isLoading:boolean;
    private _cancelBtn:TerraOverlayButtonInterface;
    private _removeBtn:TerraOverlayButtonInterface;
    
    constructor(private _authService:AuthService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);
     
        this._isLoading = false;
        this._accountList = [];
    }

    ngOnInit()
    {
        this.loadAccounts();

        this._cancelBtn = {
            icon:          'icon-cancel',
            caption:       this.translation.translate('auth.account.cancel'),
            isDisabled:    false,
            clickFunction: () => this.onCancelRemoveAccountBtnClick()
        };

        this._removeBtn = {
            icon:          'icon-delete',
            caption:       this.translation.translate('auth.account.remove'),
            isDisabled:    false,
            clickFunction: () => this.onRemoveAccountBtnClick()
        };
    }

    private loadAccounts()
    {
        this._isLoading = true;
        
        this._accountList = [];
        
        this._loadingConfig.callLoadingEvent(true);

        this._authService.getLoginStatus().subscribe(
            response =>
            {
                this._accountList = response;
                
                this._isAuthenticated =  this._accountList.length > 0;

                this._isLoading = false;
                
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                let message:any = error.json();

                this._alertConfig.callStatusEvent(this.translation.translate('auth.alerts.loginStatusCheckError') + ' ' + message.error.code + ' ' + message.error.message,
                    'danger');

                this._isLoading = false;
                
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private openLoginPopup()
    {
        this._loadingConfig.callLoadingEvent(true);

        this._isLoading = true;
        
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

                        this._isLoading = false;

                        this.loadAccounts();
                    }
                }, 200);
            },

            error =>
            {
                let message:any = error.json();

                this._isLoading = false;

                this._alertConfig.callStatusEvent(this.translation.translate('auth.alerts.fetchLoginUrlError') + ' ' + message.error.code + ' ' + message.error.message,
                    'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private onShowRemoveAccountOverlayBtnClick():void
    {
        this.overlay.showOverlay();
    }

    private onCancelRemoveAccountBtnClick():void
    {
        this.overlay.hideOverlay();
    }

    private onRemoveAccountBtnClick():void
    {
        this._isLoading = true;

        this._loadingConfig.callLoadingEvent(true);

        this._authService.deleteAccount().subscribe(
            response =>
            {
                this.loadAccounts();

                this._isLoading = false;

                this.overlay.hideOverlay();

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                let message:any = error.json();

                this._alertConfig.callStatusEvent(this.translation.translate('auth.alerts.cannotDeleteAccount') + ' ' + message.error.code + ' ' + message.error.message,
                    'danger');

                this._isLoading = false;
                
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}

