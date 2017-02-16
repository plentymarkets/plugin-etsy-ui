import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingBarService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { ParcelServicesData } from '../data/parcel-services-data';
import { ShippingProfileSettingsData } from '../data/shipping-profile-settings-data';
import { ShippingProfileCorrelationData } from '../data/shipping-profile-correlation-data';

@Injectable()
export class ShippingProfileService extends TerraBaseService
{
    constructor(loadingBarService:TerraLoadingBarService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/shipping-profiles/');
    }
    
    public getParcelServiceList():Observable<ParcelServicesData>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'parcel-service-presets';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
    
    public getShippingProfileSettingsList():Observable<ShippingProfileSettingsData>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'imported';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
    
    public getShippingProfileCorrelations():Observable<ShippingProfileCorrelationData>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'correlations';
        
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
    
    public saveCorrelations(data:any):Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'correlate';
        
        return this.mapRequest(
            this.http.post(url, data, {headers: this.headers})
        );
    }
    
    public importShippingProfiles():Observable<any>
    {
        this.setAuthorization();
        
        let url:string;
        
        url = this.url + 'import';
        
        return this.mapRequest(
            this.http.post(url, '', {headers: this.headers})
        );
    }
}
