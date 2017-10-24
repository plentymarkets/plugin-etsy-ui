import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { PropertyInterface } from "./data/property.interface";
import { MarketPropertyInterface } from "./data/market-property.interface";
import { PropertyCorrelationInterface } from './data/property-correlation.interface';

@Injectable()
export class PropertiesService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/properties/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getProperties():Observable<PropertyInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'properties';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
            })
        );
    }

    public getMarketProperties():Observable<MarketPropertyInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'imported';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }

    public getCorrelations():Observable<Array<PropertyCorrelationInterface>>
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

    public saveCorrelations(propertyCorrelations:Array<PropertyCorrelationInterface>):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'correlate';

        return this.mapRequest(
            this.http.post(url, {}, {
                headers: this.headers,
                body:    propertyCorrelations
            })
        );
    }

    public importMarketProperties():Observable<void>
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
