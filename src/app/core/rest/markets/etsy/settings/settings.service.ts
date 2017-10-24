import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { SettingsInterface } from './data/settings.interface';
import { SettingsParameterInterface } from './data/settings.parameter.interface';
import { ShopInterface } from './data/shop.interface';

@Injectable()
export class SettingsService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/etsy/settings/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getSettings():Observable<SettingsInterface>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'all';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }

    public saveSettings(settingsParameterInterface:SettingsParameterInterface):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'save';

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    settingsParameterInterface
                })
        );
    }

    public getShops():Observable<Array<ShopInterface>>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + 'shops';

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
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
