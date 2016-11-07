/*
*
* demonstrate parts and use of a component
*
* > DataTableDemoComponent <
* use native PlentyDataTable Component and specify used service and class with matching format for responded data
*/

import {
  AfterViewInit,
  Component,
  DoCheck,
  OnInit,
  ViewChild
} from '@angular/core';
import { DataTableDemoService } from './service/data-table-demo.service';
import { DemoData } from './data/demo-data';
import { PopupComponent } from '../popup/popup.component';
import {
  PlentyDataTable,
  PlentyMultiSelectBoxValue
} from '@plentymarkets/terra-components';

@Component({
  selector: 'data-table-demo',
  template: require('./data-table-demo.component.html'),
  styles: [require('./data-table-demo.component.scss')]
})
export class DataTableDemoComponent implements OnInit, AfterViewInit, DoCheck {

  // inject PlentyDataTable component as child to get access to it
  @ViewChild(PlentyDataTable) table:PlentyDataTable<DataTableDemoService, DemoData>;
  @ViewChild(PopupComponent) popup:PopupComponent;
  private disabled:boolean = false;
  private error:boolean = false;
  private isPopupOpen:boolean = false;
  private values:Array<PlentyMultiSelectBoxValue>;

  constructor(private dataTableDemoService:DataTableDemoService)
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
    this.values = [
      {
        value:    '0',
        caption:  'Value 0',
        selected: false
      },
      {
        value:    '1',
        caption:  'Value 1',
        selected: false
      },
      {
        value:    '2',
        caption:  'Value 2',
        selected: false
      },
      {
        value:    '3',
        caption:  'Value 3',
        selected: false
      },
      {
        value:    '4',
        caption:  'Value 4',
        selected: false
      },
      {
        value:    '5',
        caption:  'Value 5',
        selected: false
      },
      {
        value:    '6',
        caption:  'Value 6',
        selected: false
      },
      {
        value:    '7',
        caption:  'Value 7',
        selected: false
      },
    ];
  }

  /**
   * belong to AfterViewInit lifecycle hook
   * is called after a component's view has been fully initialized.
   */
  ngAfterViewInit()
  {
    for(let index in this.table.headerList)
    {
      if(this.table.headerList[index].caption)
      {
        this.values[index] =
        {
          value:    index,
          caption:  this.table.headerList[index].caption,
          selected: true
        }
      }
      else
      {
        this.values[index] =
        {
          value:    index,
          caption:  this.table.headerList[index].identifier.toUpperCase(),
          selected: true
        }
      }
    }
  }

  /**
   * belong to DoCheck lifecycle hook
   * get called to check the changes in the directives in addition to the default
   * algorithm. The default change detection algorithm looks for differences by comparing
   * bound-property values by reference across change detection runs.
   */
  ngDoCheck()
  {
    for(let index in this.table.headerList)
    {
      let hide:boolean = !this.values[index].selected;
      let id:string = this.table.headerList[index].identifier;

      this.table.headerList[index].isHidden = hide;

      if(hide)
      {
        this.table.rowList.forEach(
          (row) => row.cellList.forEach(
            (cell) =>
            {
              if(cell.identifier == id)
              {
                cell.isHidden = hide;
              }
            }
          )
        )
      }
    }
  }

  private onButtonClick():void
  {
    alert(this.table.selectedRowList.length)
  }

  private onPopupClick():void
  {
    this.popup.onClick();
  }
}
