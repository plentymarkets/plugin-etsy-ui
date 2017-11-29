import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { PropertiesSplitConfig } from './config/properties-split.config';
import { PropertyCorrelationInterface } from '../../core/rest/markets/etsy/properties/data/property-correlation.interface';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import { Observable } from 'rxjs/Observable';
import { PropertiesService } from '../../core/rest/markets/etsy/properties/properties.service';
import { PropertiesListModule } from './view/properties-list/properties-list.module';
import { TerraMultiSplitViewInterface } from '@plentymarkets/terra-components';

@Component({
    selector: 'properties',
    template: require('./properties.component.html'),
    styles:   [require('./properties.component.scss')]
})
export class PropertiesComponent extends Translation implements OnInit
{
    @Input() public splitViewInstance:TerraMultiSplitViewInterface;

    private _isLoading:boolean;

    private _propertyCorrelations:Array<PropertyCorrelationInterface>;
    
    private _lastUiId:number;

    constructor(public translation:TranslationService,
                private _editSplitViewConfig:PropertiesSplitConfig,
                private _propertiesService:PropertiesService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._isLoading = false;

        this._propertyCorrelations = [];
        
        this._lastUiId = 0;
    }

    ngOnInit()
    {
        this.initData();
    }

    private initData()
    {
        this._isLoading = true;

        this._loadingConfig.callLoadingEvent(true);

        Observable.combineLatest(
            this._propertiesService.getProperties(),
            this._propertiesService.getSystemProperties(),
            this._propertiesService.getCorrelations(),
            (properties, systemProperties, propertyCorrelations) =>
            {
                return {
                    properties:           properties,
                    systemProperties:     systemProperties,
                    propertyCorrelations: propertyCorrelations
                }
            }
        ).subscribe(
            (data:any) =>
            {
                data.propertyCorrelations.forEach((propertyCorrelation:PropertyCorrelationInterface) => {
                    this._lastUiId++;

                    this._propertyCorrelations.push({
                       uiId: this._lastUiId,
                       systemProperty: propertyCorrelation.systemProperty,
                       property: propertyCorrelation.property
                   });
                });
                
                //this._propertyCorrelations = data.propertyCorrelations;

                this._editSplitViewConfig.addView({
                    module:                PropertiesListModule.forRoot(),
                    defaultWidth:          'col-xs-12 col-md-4 col-lg-3',
                    focusedWidth:          'col-xs-12 col-md-12 col-lg-12',
                    name:                  this.translation.translate('properties.splitViewNames.correlations'),
                    mainComponentName:     PropertiesListModule.getMainComponent(),
                    isBackgroundColorGrey: true,
                    inputs:                [
                        {
                            name:  'properties',
                            value: data.properties
                        },
                        {
                            name:  'systemProperties',
                            value: data.systemProperties
                        },
                        {
                            name:  'propertyCorrelations',
                            value: this._propertyCorrelations
                        }
                    ]
                }, this.splitViewInstance);

                this._isLoading = false;

                this._loadingConfig.callLoadingEvent(false);
            },
            (error:any) =>
            {
                this._loadingConfig.callLoadingEvent(false);

                this._isLoading = false;

                let message:any = error.json();

                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }

    private addCorrelation()
    {
        this._lastUiId++;
        
        this._propertyCorrelations.push({
            uiId: this._lastUiId,
            property:       {
                id:        null,
                groupId:   null,
                name:      null,
                groupName: null,
            },
            systemProperty: {
                id:        null,
                groupId:   null,
                name:      null,
                groupName: null,
            }
        })
    }

    private import():void
    {
        this._isLoading = true;
        this._loadingConfig.callLoadingEvent(true);

        this._propertiesService.importProperties().subscribe(
            response =>
            {
                this.initData();

                this._alertConfig.callStatusEvent(this.translation.translate('properties.alerts.propertiesImported'), 'success');
                this._loadingConfig.callLoadingEvent(false);
                this._isLoading = false;
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('properties.alerts.propertiesNotImported') + ' ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
                this._isLoading = false;
            }
        );
    }

    private onSaveBtnClicked()
    {
        this.saveCorrelations();
    }

    private saveCorrelations():void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._propertiesService.saveCorrelations(this._propertyCorrelations).subscribe(
            result =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('properties.alerts.correlationsSaved'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('properties.alerts.correlationsNotSaved') + ' ' + error.statusText,
                    'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}