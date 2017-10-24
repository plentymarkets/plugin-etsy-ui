import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { ParcelServicePresetInterface } from './data/parcel-service-preset.interface';
import { ShippingProfileInterface } from './data/shipping-profile.interface';
import { ShippingProfileCorrelationInterface } from './data/shipping-profile-correlation.interface';

@Injectable()
export class ShippingProfilesService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/shipping-profiles/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getParcelServiceList():Observable<Array<ParcelServicePresetInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string;

        url = this.url + 'parcel-service-presets';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
            })
        );
    }

    public getShippingProfileSettingsList():Observable<Array<ShippingProfileInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'imported';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
            })
        );
    }

    public getShippingProfileCorrelations():Observable<Array<ShippingProfileCorrelationInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'correlations';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }

    public saveCorrelations(shippingProfileCorrelations:Array<ShippingProfileCorrelationInterface>):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'correlate';

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    shippingProfileCorrelations
                })
        );
    }

    public importShippingProfiles():Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'import';

        return this.mapRequest(
            this.http.post(url, '', {headers: this.headers})
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
