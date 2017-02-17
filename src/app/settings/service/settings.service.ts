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
        //super(loadingBarService, http, '/rest/markets/etsy/settings/');
        super(loadingBarService, http, 'http://master.plentymarkets.com/rest/markets/etsy/settings/');
    }
    
    public getSettings():Observable<any>
    {
        this.setAuthorization();
        //this.headers.set('Authorization', 'Bearer v5QHsBgA9NHrOwMOvrdb2eKi02lod1Wq1VrrkmLm'); //MF
        
        let url:string;
        
        url = this.url + 'all';
        
        this.headers.set('Authorization', 'Bearer CUYN1UmI4IO8bUdcXtCumXJTDnOJiTU1EjMMItMs'); //MS
        
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
        
        this.headers.set('Authorization', 'Bearer CUYN1UmI4IO8bUdcXtCumXJTDnOJiTU1EjMMItMs');
        
        return this.mapRequest(
            this.http.post(url, data, {headers: this.headers})
        );
    }
    
    public getShops():Observable<ShopData>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'shops';
        
        this.headers.set('Authorization', 'Bearer CUYN1UmI4IO8bUdcXtCumXJTDnOJiTU1EjMMItMs');
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
}
