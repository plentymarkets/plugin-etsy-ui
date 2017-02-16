import {
    Component,
    OnInit,
    forwardRef,
    Inject,
    Input
} from '@angular/core';
import { EtsyComponent } from "../etsy-app.component";

@Component({
               selector: 'etsy-toolbar',
               template: require('./toolbar.component.html'),
               styles:   [require('./toolbar.component.scss')]
           })
export class ToolbarComponent implements OnInit
{
    @Input() isLoading:boolean;
    @Input() breadcrumbs:string;
    
    constructor(@Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent)
    {
    }
    
    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit()
    {
    }
}