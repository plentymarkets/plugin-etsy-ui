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
import { ParcelServicesData } from '../data/parcel-services-data';
import { ShippingProfileSettingsData } from '../data/shipping-profile-settings-data';
import { ShippingProfileCorrelationData } from '../data/shipping-profile-correlation-data';

@Injectable()
export class ShippingProfileService extends BaseService
{
  constructor(loadingBarService:PlentyLoadingBarService, http:Http)
  {
    super(loadingBarService, http, 'http://master.plentymarkets.com/etsy/shipping-profiles/');
  }

  public getParcelServiceList():Observable<ParcelServicesData>
  {
    this.setAuthorization();

    let url:string;

    url = this.url + 'parcel-service-presets';

    return this.mapRequest(
      this.http.get(url, {headers: this.headers, body: ''})
    );
  }

  public getShippingProfileSettingsList():Observable<ShippingProfileSettingsData>
  {
    this.setAuthorization();

    let url:string;

    url = this.url + 'imported';

    return this.mapRequest(
      this.http.get(url, {headers: this.headers, body: ''})
    );
  }

  public getShippingProfileCorrelations():Observable<ShippingProfileCorrelationData>
  {
    this.setAuthorization();

    let url:string;

    url = this.url + 'correlations';

    return this.mapRequest(
      this.http.get(url, {headers: this.headers, body: ''})
    );
  }

  public saveCorrelations(data:any):Observable<any>
  {
    this.setAuthorization();

    let url:string;

    url = this.url + 'correlate';

    return this.mapRequest(
      this.http.post(url, data, {headers: this.headers})
    );
  }
}
