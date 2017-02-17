import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingBarService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { ShopData } from '../data/shop-data';

@Injectable()
export class SettingsService extends TerraBaseService
{
    constructor(loadingBarService:TerraLoadingBarService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/settings/');
        //super(loadingBarService, http, '/rest/markets/etsy/settings/');
    }
    
    public getSettings():Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'all';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
    
    public saveSettings(data:any):Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'save';
        
        return this.mapRequest(
            this.http.post(url, data, {headers: this.headers})
        );
    }
    
    public getShops():Observable<ShopData>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'shops';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
}
