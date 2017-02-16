import {
    Component,
    OnInit,
    forwardRef,
    Inject,
    ViewChild
} from '@angular/core';
import {
    TerraOverlayComponent,
    TerraLeafInterface,
    TerraTreeComponent,
    TerraOverlayButtonInterface
} from '@plentymarkets/terra-components/index';
import { EtsyComponent } from "../etsy-app.component";
import { Locale } from "angular2localization/angular2localization";
import { LocaleService } from "angular2localization/angular2localization";
import { LocalizationService } from "angular2localization/angular2localization";
import { PropertyService } from "./service/property.service";

@Component({
               selector: 'properties',
               template: require('./properties.component.html'),
               styles:   [require('./properties.component.scss')]
           })
export class PropertiesComponent extends Locale implements OnInit
{
    private isLoading:boolean = true;
    private correlations:Array<any> = [];
    private marketPropertiesNameList:Array<any> = [];
    private propertiesNameList:Array<any> = [];
    private propertiesRowInOverlay:any;
    private marketPropertiesSettingsRowInOverlay:any;
    private propertiesTreeList:Array<TerraLeafInterface> = [];
    private marketPropertiesSettingsTreeList:Array<TerraLeafInterface> = [];
    
    private updatePropertyPrimaryButtonOverlay:TerraOverlayButtonInterface;
    private updateMarketPropertySettingsPrimaryButtonOverlay:TerraOverlayButtonInterface;
    
    @ViewChild('viewPropertiesOverlay') public viewPropertiesOverlay:TerraOverlayComponent;
    @ViewChild('viewMarketPropertiesSettingsOverlay') public viewMarketPropertiesSettingsOverlay:TerraOverlayComponent;
    @ViewChild('propertyTree') public propertyTree:TerraTreeComponent;
    @ViewChild('marketPropertySettingsTree') public marketPropertySettingsTree:TerraTreeComponent;
    
    constructor(private propertyService:PropertyService,
                @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent,
                locale:LocaleService,
                localization:LocalizationService)
    {
        super(locale, localization);
        
        this.getProperties();
    }
    
    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit()
    {
        this.updatePropertyPrimaryButtonOverlay = {
            icon:          'icon-add',
            caption:       'Add',
            isDisabled:    false,
            clickFunction: () => this.updateProperty()
        };
        
        this.updateMarketPropertySettingsPrimaryButtonOverlay = {
            icon:          'icon-add',
            caption:       'Add',
            isDisabled:    false,
            clickFunction: () => this.updateMarketPropertySettings()
        };
    }
    
    private getProperties()
    {
        this.etsyComponent.callLoadingEvent(true);
        
        this.propertyService.getProperties().subscribe(
            response =>
            {
                this.etsyComponent.callLoadingEvent(false);
                
                this.getMarketProperties();
                
                this.buildPropertiesTree(response);
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadProperties') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }
    
    private getMarketProperties()
    {
        this.etsyComponent.callLoadingEvent(true);
        
        this.propertyService.getMarketProperties().subscribe(
            response =>
            {
                this.etsyComponent.callLoadingEvent(false);
                
                this.getCorrelations();
                
                this.buildMarketPropertiesSettingsTree(response);
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadMarketProperties') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }
    
    private getCorrelations()
    {
        this.etsyComponent.callLoadingEvent(true);
        
        this.propertyService.getCorrelations().subscribe(
            response =>
            {
                this.etsyComponent.callLoadingEvent(false);
                
                this.correlations = response;
                
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadPropertyCorrelations') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        )
    }
    
    private getMarketPropertyName(marketPropertySettingsId)
    {
        if(this.marketPropertiesNameList[marketPropertySettingsId])
        {
            return this.marketPropertiesNameList[marketPropertySettingsId];
        }
        
        return '-';
    }
    
    private buildMarketPropertiesSettingsTree(marketPropertiesSettings):void
    {
        let groups = [];
        
        this.marketPropertiesNameList = [];
        this.marketPropertiesSettingsTreeList = [];
        
        marketPropertiesSettings.forEach((item) =>
                                         {
                                             this.marketPropertiesNameList[item.id] = item.groupName + ': ' + item.name;
            
                                             if(groups[item.groupId])
                                             {
                                                 groups[item.groupId].children.push(item);
                                             }
                                             else
                                             {
                                                 groups[item.groupId] = {
                                                     groupId:   item.groupId,
                                                     groupName: item.groupName,
                                                     children:  [item]
                                                 };
                                             }
                                         });
        
        groups.forEach((group) =>
                       {
                           if(group.children.length)
                           {
                               this.marketPropertiesSettingsTreeList.push(this.getPropertyLeaf(group));
                           }
                       });
    }
    
    private getPropertyName(propertyId)
    {
        if(this.propertiesNameList[propertyId])
        {
            return this.propertiesNameList[propertyId];
        }
        
        return '-';
    }
    
    private buildPropertiesTree(propertiesSettings):void
    {
        let groups = [];
        
        groups[0] = {
            groupId:   0,
            groupName: 'No group',
            children:  []
        };
        
        propertiesSettings.forEach((item) =>
                                   {
            
                                       if(item.groupId)
                                       {
                                           this.propertiesNameList[item.id] = item.groupName + ': ' + item.name;
                                       }
                                       else
                                       {
                                           this.propertiesNameList[item.id] = item.name;
                                       }
            
                                       let groupId = item.groupId ? item.groupId : 0;
            
                                       if(groups[groupId])
                                       {
                                           groups[groupId].children.push(item);
                                       }
                                       else
                                       {
                                           groups[groupId] = {
                                               groupId:   item.groupId,
                                               groupName: item.groupName,
                                               children:  [item]
                                           };
                                       }
                                   });
        
        groups.forEach((group) =>
                       {
                           if(group.groupId === 0 && group.children.length)
                           {
                               group.children.forEach((item) =>
                                                      {
                                                          this.propertiesTreeList.push({
                                                                                           caption:     item.name,
                                                                                           id:          item.id,
                                                                                           icon:        null,
                                                                                           subLeafList: null
                                                                                       });
                                                      });
                           }
                           else if(group.groupId !== 0 && group.children.length)
                           {
                               this.propertiesTreeList.push(this.getPropertyLeaf(group));
                           }
                       });
    }
    
    private openPropertiesOverlay(row)
    {
        this.propertiesRowInOverlay = row;
        
        this.viewPropertiesOverlay.showOverlay();
    }
    
    private openMarketPropertiesSettingsOverlay(row)
    {
        this.marketPropertiesSettingsRowInOverlay = row;
        
        this.viewMarketPropertiesSettingsOverlay.showOverlay();
    }
    
    private getPropertyLeaf(item)
    {
        let leafData = {
            caption:     item.groupName,
            id:          item.groupId,
            icon:        'icon-folder',
            subLeafList: null
        };
        
        if(item.children.length > 0)
        {
            leafData.subLeafList = [];
            
            item.children.forEach((child) =>
                                  {
                                      leafData.subLeafList.push({
                                                                    caption:     child.name,
                                                                    id:          child.id,
                                                                    icon:        null,
                                                                    subLeafList: null
                                                                });
                                  });
        }
        
        return leafData;
    }
    
    private updateProperty()
    {
        let leaf:TerraLeafInterface = this.propertyTree.getSelectedLeaf();
        
        if(leaf != null)
        {
            this.propertiesRowInOverlay.propertyId = leaf.id;
            this.viewPropertiesOverlay.hideOverlay();
        }
    }
    
    private updateMarketPropertySettings()
    {
        let leaf:TerraLeafInterface = this.marketPropertySettingsTree.getSelectedLeaf();
        
        if(leaf != null)
        {
            this.marketPropertiesSettingsRowInOverlay.settingsId = leaf.id;
            this.viewMarketPropertiesSettingsOverlay.hideOverlay();
        }
    }
    
    private addCorrelation():void
    {
        this.correlations.push({
                                   settingsId: null,
                                   propertyId: null
                               });
    }
    
    private removeCorrelation(item):void
    {
        var index = this.correlations.indexOf(item);
        this.correlations.splice(index, 1);
    }
    
    private saveCorrelations():void
    {
        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;
        
        this.propertyService.saveCorrelations({correlations: this.correlations}).subscribe(
            response =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('successSavePropertyCorrelations'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorSavePropertyCorrelations') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }
    
    private import():void
    {
        this.isLoading = true;
        this.etsyComponent.callLoadingEvent(true);
        
        this.propertyService.importMarketProperties().subscribe(
            response =>
            {
                this.getMarketProperties();
                
                this.etsyComponent.callStatusEvent(this.localization.translate('successImportProperties'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },
            
            error =>
            {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorImportProperties') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        );
    }
    
}