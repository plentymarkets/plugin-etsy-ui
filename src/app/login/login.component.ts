import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { LoginService } from "./service/login.service";
import { EtsyComponent } from "../etsy-app.component";

@Component({
    selector: 'login',
    template: require('./login.component.html'),
    styles: [require('./login.component.scss').toString()]
})
export class LoginComponent implements OnInit {
    private service:LoginService;
    private isAuthenticated:boolean = null;
    private isLoading = true;

    constructor(private L:LoginService, @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent) {
        this.service = L;
    }

    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit() {
        this.checkLoginStatus();
    }

    private checkLoginStatus() {
        this.etsyComponent.callLoadingEvent(true);

        this.service.getLoginStatus().subscribe(
            response => {
                this.isAuthenticated = response.status;

                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent('Could not check the login status: ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }

    private openLoginPopup() {
        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;

        this.service.getLoginUrl().subscribe(
            response => {
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;

                var popup = window.open(
                    response.loginUrl,
                    'Etsy Login',
                    'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                var pollTimer = window.setInterval(() => {
                    if (popup.closed !== false) {
                        window.clearInterval(pollTimer);

                        this.reload();
                    }
                }, 200);
            },

            error => {
                this.etsyComponent.callStatusEvent('Could not get the login url: ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }

    private reload() {
        location.reload();
    }
}

