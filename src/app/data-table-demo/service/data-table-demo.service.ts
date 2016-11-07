/**
 * > DataTableDemoService <
 * is a provider for TerraDemoModule
 * extend native TerraComponents BaseService
 * call data via rest call
 * provide data for data table
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
  PlentyLoadingBarService,
  BaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { DemoData } from '../data/demo-data';

@Injectable()
export class DataTableDemoService extends BaseService
{
  constructor(loadingBarService:PlentyLoadingBarService, http:Http)
  {
    super(loadingBarService, http, '/rest/accounts/order_summaries');
  }

  public getOrdersummary(page?:number, perPage?:number):Observable<DemoData>
  {
    this.setAuthorization();

    let url:string;

    if(page && perPage)
    {
      url = this.url + '?page=' + page + '&itemsPerPage=' + perPage;
    }
    else
    {
      url = this.url;
    }

    return this.mapRequest(
      this.http.get(url, {headers: this.headers, body: ''})
    );
  }
}
