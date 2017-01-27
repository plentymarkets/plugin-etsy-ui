import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingBarService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class SettingsService extends TerraBaseService {
    constructor(loadingBarService:TerraLoadingBarService, http:Http) {
        super(loadingBarService, http, '/markets/etsy/settings/');
    }

    public getSettings():Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'all';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers, body: ''})
        );
    }

    public saveSettings(data:any):Observable<any> {
        this.setAuthorization();

        let url:string;

        url = this.url + 'save';

        return this.mapRequest(
            this.http.post(url, data, {headers: this.headers})
        );
    }
}
