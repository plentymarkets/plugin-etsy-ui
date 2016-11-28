import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingBarService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { PropertyData } from "../data/property-data";
import { MarketPropertyData } from "../data/market-property-data";

@Injectable()
export class PropertyService extends TerraBaseService {
    constructor(loadingBarService:TerraLoadingBarService, http:Http) {
        super(loadingBarService, http, '/etsy/properties/');
    }

    public getProperties():Observable<PropertyData> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'properties';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public getMarketProperties():Observable<MarketPropertyData> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'imported';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public getCorrelations():Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'correlations';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public saveCorrelations(data:any):Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'correlate';

        return this.mapRequest(
            this.http.post(url, data, {headers: this.headers})
        );
    }

    public importMarketProperties():Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'import';

        return this.mapRequest(
            this.http.post(url, '', {headers: this.headers})
        );
    }
}
