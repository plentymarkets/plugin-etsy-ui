import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {
    TerraLeafInterface,
    TerraSplitViewComponentInterface,
    TerraMultiSplitViewInterface,
} from '@plentymarkets/terra-components';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { LoadingConfig } from '../../../../core/config/loading.config';
import { AlertConfig } from '../../../../core/config/alert.config';
import { PropertyInterface } from '../../../../core/rest/markets/etsy/properties/data/property.interface';
import { SystemPropertyInterface } from '../../../../core/rest/markets/etsy/properties/data/system-property.interface';
import { PropertyCorrelationInterface } from '../../../../core/rest/markets/etsy/properties/data/property-correlation.interface';
import { PropertiesSplitConfig } from '../../config/properties-split.config';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'property-correlation',
    template: require('./property-correlation.component.html'),
    styles:   [require('./property-correlation.component.scss')]
})
export class PropertyCorrelationComponent extends Translation implements OnInit, TerraSplitViewComponentInterface
{
    @Input() public splitViewInstance:TerraMultiSplitViewInterface;
    @Input() public parameter:any;
    @Input() public properties:Array<PropertyInterface>;
    @Input() public systemProperties:Array<SystemPropertyInterface>;
    @Input() public propertyCorrelation:PropertyCorrelationInterface;

    private _propertiesTree:Array<TerraLeafInterface>;
    private _systemPropertiesTree:Array<TerraLeafInterface>;

    constructor(private _editSplitViewConfig:PropertiesSplitConfig,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._propertiesTree = [];
        this._systemPropertiesTree = [];
    }

    ngOnInit()
    {
        this.initPropertiesTree();
    }

    private initPropertiesTree()
    {
        this.createPropertiesTree(this.properties);
        this.createSystemPropertiesTree(this.systemProperties);
    }

    private createPropertiesTree(properties:Array<PropertyInterface>)
    {
        this._propertiesTree = [];

        let propertyGroups = [];

        properties.forEach((property:PropertyInterface) =>
        {
            if(propertyGroups[property.groupId])
            {
                propertyGroups[property.groupId].children.push(property);
            }
            else
            {
                propertyGroups[property.groupId] = {
                    groupId:   property.groupId,
                    groupName: property.groupName,
                    name:      property.name,
                    children:  [property]
                };
            }
        });

        propertyGroups.forEach((propertyGroup:PropertyInterface) =>
        {
            if(propertyGroup.children.length)
            {
                this._propertiesTree.push(this.getPropertyChildren(propertyGroup));
            }
        });
    }

    private getPropertyChildren(property:PropertyInterface)
    {
        let leafData = {
            caption:     property.groupName,
            id:          property.groupId,
            icon:        'icon-folder',
            subLeafList: null,
            isOpen:      property.groupId === this.propertyCorrelation.property.groupId
        };

        if(property.children.length > 0)
        {
            leafData.subLeafList = [];

            property.children.forEach((child) =>
            {
                leafData.subLeafList.push({
                    caption:     child.name,
                    id:          child.id,
                    icon:        null,
                    subLeafList: null,
                    isOpen:      false,
                    isActive:    child.id === this.propertyCorrelation.property.id,
                    clickFunction: () =>
                                   {
                                       this.propertyCorrelation.property = child;
                                       this.updateViewName();
                                   }
                });
            });
        }

        return leafData;
    }

    private createSystemPropertiesTree(systemProperties:Array<SystemPropertyInterface>)
    {
        this._systemPropertiesTree = [];

        let systemPropertyGroups = [];

        systemProperties.forEach((systemProperty:SystemPropertyInterface) =>
        {
            if(systemPropertyGroups[systemProperty.groupId])
            {
                systemPropertyGroups[systemProperty.groupId].children.push(systemProperty);
            }
            else
            {
                systemPropertyGroups[systemProperty.groupId] = {
                    groupId:   systemProperty.groupId,
                    groupName: systemProperty.groupName,
                    name:      systemProperty.name,
                    children:  [systemProperty]
                };
            }
        });

        systemPropertyGroups.forEach((systemPropertyGroup:SystemPropertyInterface) =>
        {
            if(systemPropertyGroup.children.length)
            {
                this._systemPropertiesTree.push(this.getSystemPropertyChildren(systemPropertyGroup));
            }
        });
    }

    private getSystemPropertyChildren(systemProperty:SystemPropertyInterface)
    {
        let leafData = {
            caption:     systemProperty.groupName,
            id:          systemProperty.groupId,
            icon:        'icon-folder',
            subLeafList: null,
            isOpen:      systemProperty.groupId === this.propertyCorrelation.systemProperty.groupId
        };

        if(systemProperty.children.length > 0)
        {
            leafData.subLeafList = [];

            systemProperty.children.forEach((child) =>
            {
                leafData.subLeafList.push({
                    caption:     child.name,
                    id:          child.id,
                    icon:        null,
                    subLeafList: null,
                    isOpen:      false,
                    isActive:    child.id === this.propertyCorrelation.systemProperty.id,
                    clickFunction: () =>
                                   {
                                       this.propertyCorrelation.systemProperty = child;
                                       this.updateViewName();
                                   }
                });
            });
        }

        return leafData;
    }
    
    private updateViewName():void
    {
        let marketPropertyName:string;
        let systemPropertyName:string;
        
        if(!isNullOrUndefined(this.propertyCorrelation.property.name))
        {
            marketPropertyName = this.propertyCorrelation.property.name;
        }
        else
        {
            marketPropertyName = '?';
        }
        
        if(!isNullOrUndefined(this.propertyCorrelation.systemProperty.name))
        {
            systemPropertyName = this.propertyCorrelation.systemProperty.name;
        }
        else {
            systemPropertyName = '?';
        }
        
        this.splitViewInstance.name = marketPropertyName + ' + ' + systemPropertyName;
    }
}