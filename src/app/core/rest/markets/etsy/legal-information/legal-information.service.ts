import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class LegalInformationService extends TerraBaseService 
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/settings/legal-information');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }
    
    public saveLegalInformation(legalInformationSettings):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        return this.mapRequest(
            this.http.post(this.url,
                {},
                {
                    headers: this.headers,
                    body:    legalInformationSettings
                })
        );
    }
    
    public updateLegalInformation(legalInformationSettings):Observable<void> {
        this.setAuthorization();
        this.setHeader();

        return this.mapRequest(
            this.http.post(this.url + '/' + legalInformationSettings.id,
                {},
                {
                    headers: this.headers,
                    body:    legalInformationSettings
                })
        );
    }
    
    public loadLegalInformation()
    {
        this.setAuthorization();
        this.setHeader();

        return this.mapRequest(
            this.http.get(this.url, {
                headers: this.headers,
                body:    ''
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