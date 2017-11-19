import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraBaseService,
    TerraLoadingSpinnerService,
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { AccountInterface } from './data/account.interface';
import { LoginUrlInterface } from './data/login-url.interface';

@Injectable()
export class AuthService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/auth/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getLoginStatus():Observable<Array<AccountInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'status';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    public getLoginUrl():Observable<LoginUrlInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'login-url';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
            })
        );
    }
    
    public deleteAccount():Observable<any>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url;

        return this.mapRequest(
            this.http.delete(url, {
                headers: this.headers,
            })
        );
    }

    private setHeader()
    {
        if(this.bearer != null && this.bearer.length > 0)
        {
            this.headers.set('Authorization', 'Bearer ' + this.bearer);
        }
    }
}
