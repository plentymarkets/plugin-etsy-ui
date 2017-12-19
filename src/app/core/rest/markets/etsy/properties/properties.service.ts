import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { PropertyInterface } from "./data/property.interface";
import { PropertyCorrelationInterface } from './data/property-correlation.interface';
import { SystemPropertyInterface } from './data/system-property.interface';
import {TranslationService} from "angular-l10n";

@Injectable()
export class PropertiesService extends TerraBaseService
{
    private bearer:string;

    constructor(public translation:TranslationService,
                loadingBarService:TerraLoadingSpinnerService, 
                http:Http)
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

        let url:string = this.url;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                params: {
                    lang: this.translation.getLanguage()
                }
            })
        );
    }

    public getSystemProperties():Observable<SystemPropertyInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'system-properties';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                params: {
                    lang: this.translation.getLanguage()
                }
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
                params: {
                    lang: this.translation.getLanguage()
                }
            })
        );
    }

    public saveCorrelations(propertyCorrelations:Array<PropertyCorrelationInterface>):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'correlations';

        return this.mapRequest(
            this.http.post(url,
                {}, {
                    headers: this.headers,
                    body:    {
                        correlations: propertyCorrelations
                    }
                })
        );
    }

    public importProperties():Observable<void>
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
