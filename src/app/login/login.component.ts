import { Component, OnInit } from '@angular/core';
import { PlentyAlert } from '@plentymarkets/terra-components/index';
import { LoginService } from "./service/login.service";

@Component({
    selector: 'login',
    template: require('./login.component.html'),
    styles: [require('./login.component.scss').toString()]
})
export class LoginComponent implements OnInit {
    private service:LoginService;
    private isAuthenticated:boolean = null;
    private alert:PlentyAlert = PlentyAlert.getInstance();
    private isLoginLoading = true;

    constructor(private L:LoginService) {
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

    private checkLoginStatus()
    {
        this.service.getLoginStatus().subscribe(
            response => {
                this.isAuthenticated = response.status;
                this.isLoginLoading = false;
            },

            error => {
                this.alert.addAlert('Could not check the login status: ' + error.statusText,
                    true,
                    'danger',
                    5000);
            }
        );
    }

    private openLoginPopup()
    {
        this.isLoginLoading = true;

        this.service.getLoginUrl().subscribe(
            response => {
                this.isLoginLoading = false;

                var popup = window.open(response.loginUrl, 'Test', 'toolbar=no, location=#, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=600, height=600, top=0, left=50');

                var pollTimer = window.setInterval(function() {
                    if (popup.closed !== false) { // !== is required for compatibility with Opera
                        window.clearInterval(pollTimer);

                        location.reload();
                    }
                }, 200);
            },

            error => {
                this.alert.addAlert('Could not get the login url: ' + error.statusText,
                    true,
                    'danger',
                    5000);
            }
        );
    }
}

