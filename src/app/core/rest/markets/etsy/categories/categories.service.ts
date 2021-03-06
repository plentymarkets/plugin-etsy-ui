import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { TranslationService } from 'angular-l10n';
import { CategoryInterface } from './data/category.interface';

@Injectable()
export class CategoriesService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService,
                http:Http,
                public translation:TranslationService)
    {
        super(loadingBarService, http, '/rest/markets/etsy/categories/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getCategory(id:number):Observable<CategoryInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + id;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    '',
                search:  {
                    lang: this.translation.getLanguage(),
                    with: ['path']
                }
            })
        );
    }    

    public getCategories():Observable<Array<CategoryInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    '',
                search:  {
                    lang: this.translation.getLanguage(),
                    with: ['children']
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
