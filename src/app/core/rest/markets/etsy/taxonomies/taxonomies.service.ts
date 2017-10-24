import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { TaxonomyCorrelationInterface } from './data/taxonomy-correlation.interface';
import { TaxonomyInterface } from './data/taxonomy.interface';
import { CategoriesInterface } from './data/categories.interface';
import { CategoryParameterInterface } from './data/category.parameter.interface';
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

    public getTaxonomies():Observable<Array<TaxonomyInterface>>
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

    public getCategories(filters:CategoryParameterInterface):Observable<CategoriesInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string;

        filters.lang = this.translation.getLanguage();

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    '',
                search:  this.createUrlSearchParams(filters)
            })
        );
    }

    public saveCorrelations(taxonomyCorrelations:Array<TaxonomyCorrelationInterface>):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url = this.url + 'correlate';

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    taxonomyCorrelations
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
