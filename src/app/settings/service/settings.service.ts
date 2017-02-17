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
        super(loadingBarService, http, 'http://master.plentymarkets.com/rest/markets/etsy/settings/');
        //super(loadingBarService, http, '/rest/markets/etsy/settings/');
    }
    
    public getSettings():Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'all';
        
        this.headers.set('Authorization', 'Bearer UExK7jOv75Ur62wILLMJ4GFF5kqpBQQtrjZE03gM');
        
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
        
        this.headers.set('Authorization', 'Bearer UExK7jOv75Ur62wILLMJ4GFF5kqpBQQtrjZE03gM');
        
        return this.mapRequest(
            this.http.post(url, data, {headers: this.headers})
        );
    }
    
    public getShops():Observable<ShopData>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'shops';
        
        this.headers.set('Authorization', 'Bearer UExK7jOv75Ur62wILLMJ4GFF5kqpBQQtrjZE03gM');
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
}
