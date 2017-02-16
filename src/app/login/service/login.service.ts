import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingBarService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService extends TerraBaseService
{
    constructor(loadingBarService:TerraLoadingBarService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/auth/');
    }
    
    public getLoginStatus():Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'status';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
    
    public getLoginUrl():Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'login-url';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
}
