import {
    Component,
    DoCheck,
    Input,
    OnInit
} from '@angular/core';
import {
    TerraSplitViewComponentInterface,
    TerraMultiSplitViewInterface,
} from '@plentymarkets/terra-components';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { isNullOrUndefined } from 'util';
import { PropertyInterface } from '../../../../core/rest/markets/etsy/properties/data/property.interface';
import { SystemPropertyInterface } from '../../../../core/rest/markets/etsy/properties/data/system-property.interface';
import { PropertyCorrelationInterface } from '../../../../core/rest/markets/etsy/properties/data/property-correlation.interface';
import { PropertiesSplitConfig } from '../../config/properties-split.config';
import { PropertyCorrelationModule } from '../property-correlation/property-correlation.module';

@Component({
    selector: 'properties-list',
    template: require('./properties-list.component.html'),
    styles:   [require('./properties-list.component.scss').toString()]
})
export class PropertiesListComponent extends Translation implements OnInit, TerraSplitViewComponentInterface, DoCheck
{
    @Input() public splitViewInstance:TerraMultiSplitViewInterface;
    @Input() public parameter:any;
    @Input() public properties:Array<PropertyInterface>;
    @Input() public systemProperties:Array<SystemPropertyInterface>;
    @Input() public propertyCorrelations:Array<PropertyCorrelationInterface>;

    private _isFocused:boolean;
    private _selectedPropertyCorrelation:PropertyCorrelationInterface;

    constructor(private _editSplitViewConfig:PropertiesSplitConfig,
                public translation:TranslationService)
    {
        super(translation);

        this._isFocused = false;

        this._selectedPropertyCorrelation = null;
    }

    ngOnInit()
    {
        console.log(this.propertyCorrelations);
    }

    public ngDoCheck():void
    {
        if(!isNullOrUndefined(this._editSplitViewConfig))
        {
            this._isFocused = this._editSplitViewConfig.currentSelectedView === this.splitViewInstance;
        }
    }

    private onDeleteBtnClicked(propertyCorrelation:PropertyCorrelationInterface)
    {
        this.deleteCorrelation(propertyCorrelation);
    }

    private deleteCorrelation(propertyCorrelation:PropertyCorrelationInterface):void
    {
        let idx = this.propertyCorrelations.indexOf(propertyCorrelation);

        this.propertyCorrelations.splice(idx, 1);
    }

    private editCorrelation(propertyCorrelation:PropertyCorrelationInterface)
    {
        this._selectedPropertyCorrelation = propertyCorrelation;

        let name:string = propertyCorrelation.property.name + ' + ' + propertyCorrelation.systemProperty.name;

        if(isNullOrUndefined(propertyCorrelation.property.name) || isNullOrUndefined(propertyCorrelation.systemProperty.name))
        {
            name = 'New property' + this.getNewCorrelationsCounter();
        }

        this._editSplitViewConfig.addView({
            module:                PropertyCorrelationModule.forRoot(),
            defaultWidth:          'col-xs-12 col-md-8 col-lg-9',
            name:                  name,
            mainComponentName:     PropertyCorrelationModule.getMainComponent(),
            isBackgroundColorGrey: true,
            inputs:                [
                {
                    name:  'properties',
                    value: this.properties
                },
                {
                    name:  'systemProperties',
                    value: this.systemProperties
                },
                {
                    name:  'propertyCorrelation',
                    value: this._selectedPropertyCorrelation
                }
            ]
        }, this.splitViewInstance);
    }

    private getNewCorrelationsCounter():string
    {
        let counter:number = 0;

        this.propertyCorrelations.forEach((propertyCorrelation:PropertyCorrelationInterface) =>
        {
            if(isNullOrUndefined(propertyCorrelation.property.name) && isNullOrUndefined(propertyCorrelation.systemProperty.name))
            {
                counter++;
            }
        });

        if(counter > 1)
        {
            return ' (' + counter + ')'
        }
        
        return '';
    }
}