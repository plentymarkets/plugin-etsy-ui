import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { TaxonomyCorrelationInterface } from './data/taxonomy-correlation.interface';
import { TaxonomyInterface } from './data/taxonomy.interface';
import { TranslationService } from 'angular-l10n';

@Injectable()
export class TaxonomiesService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService,
                http:Http,
                public translation:TranslationService)
    {
        super(loadingBarService, http, '/rest/markets/etsy/taxonomies/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getTaxonomy(id:number):Observable<TaxonomyInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + id;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    '',
                search: {
                    lang: this.translation.getLanguage(),
                    with: ['path']
                }
            })
        );
    }
    
    public getTaxonomies():Observable<Array<TaxonomyInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    '',
                search: {
                    lang: this.translation.getLanguage(),
                    with: ['children']
                }
            })
        );
    }

    public getCorrelations():Observable<Array<TaxonomyCorrelationInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'correlations';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
            })
        );
    }
    
    public saveCorrelations(taxonomyCorrelations:Array<TaxonomyCorrelationInterface>):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url = this.url + 'correlations';

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body: {
                        correlations: taxonomyCorrelations
                    }
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
