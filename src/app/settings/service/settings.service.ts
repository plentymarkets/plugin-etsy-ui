import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PlentyLoadingBarService, BaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { SettingsData } from '../data/settings.data';

@Injectable()
export class SettingsService extends BaseService {
    constructor(loadingBarService:PlentyLoadingBarService, http:Http) {
        super(loadingBarService, http, 'http://master.plentymarkets.com/etsy/settings/all');
    }

    public getSettings():Observable<SettingsData> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'parcel-service-presets';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }
}
