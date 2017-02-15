import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingBarService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class TaxonomyService extends TerraBaseService {
    constructor(loadingBarService:TerraLoadingBarService, http:Http) {
        super(loadingBarService, http, '/rest/markets/etsy/taxonomies/');
    }

    public getCorrelations():Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'correlations';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public getTaxonomies():Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'imported';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public getCategories(page?:number, perPage?:number):Observable<any> {
        this.setAuthorization();

        let url:string;

        if(page && perPage)
        {
            url = this.url + 'categories?page=' + page + '&itemsPerPage=' + perPage + '&lang=' + (localStorage.getItem('locale') || 'de');
        }
        else
        {
            url = this.url + 'categories';
        }

        return this.mapRequest(
            this.http.get(url, { headers: this.headers, body: '' })
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
}
