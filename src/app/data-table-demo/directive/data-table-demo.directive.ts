/**
 * > Directive <
 * is a attribute directive: manipulate appearance and behavior of an element
 *
 * > DataTableDemoDirective <
 * have to be declared in applying TerraDemoModule
 * manipulate elements of PlentyDataTable
 * set initial pager, table header and context menu content by onInit Lifecycle hook
 */

import {
  Directive,
  OnInit,
  HostListener
} from '@angular/core';
import {
  PlentyDataTable,
  PlentyTableHeaderCell,
  PlentyTableRow,
  PlentyButtonInterface,
  PlentyTableCell,
  PlentyPagerData,
  PlentyDataTableContextMenuEntry
} from '@plentymarkets/terra-components';
import { DataTableDemoService } from '../service/data-table-demo.service';
import { DemoData } from '../data/demo-data';
import { Subject } from 'rxjs';

/*
 * Directive Decorator with selector of manipulated DOM element
 * with attribute used in component's template
 */
@Directive({
  selector: 'plenty-data-table[dataTable]'
})
export class DataTableDemoDirective implements OnInit
{
  private headerList:Array<PlentyTableHeaderCell> = [];

  constructor(private baseTable:PlentyDataTable<DataTableDemoService, DemoData>)
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
    this.baseTable.defaultPagingSize = 10;

    this.baseTable.pagingSize = [
      {
        value:   10,
        caption: '10'
      },
      {
        value:   25,
        caption: '25'
      },
      {
        value:   50,
        caption: '50'
      },
      {
        value:   100,
        caption: '100'
      }
    ];

   /*
    * use 'identifier' for appropriate elements in responded list of rest call
    */
    this.headerList.push({
                           caption:    'ID',
                           identifier: 'id',
                           width:      100
                         },
                         {
                           caption:    'Kontakt-ID',
                           identifier: 'contactId',
                           width:      100
                         },
                         {
                           caption:    'Aufträge',
                           identifier: 'orderCount',
                           width:      100
                         },
                         {
                           caption:          'Unbez. Aufträge',
                           tooltipText:      'Unbezahlte Aufträge',
                           tooltipPlacement: 'top',
                           identifier:       'unpaidOrdersCount',
                           width:            100
                         },
                         {
                           caption:          'Σ unb. Aufträge',
                           tooltipText:      'Gesamtsumme unbezahlte Aufträge',
                           tooltipPlacement: 'top',
                           identifier:       'unpaidOrderTotalAmount',
                           width:            100
                         },
                         {
                           caption:    'Erstellt am',
                           identifier: 'createdAt',
                           width:      100
                         },
                         {
                           caption:    'Aktualisiert am',
                           identifier: 'updatedAt',
                           width:      100,
                         },
                         {
                           caption:    '',
                           identifier: 'actions',
                           width:      200,
                         });

    this.baseTable.headerList = this.headerList;

   /*
    * set content for service provided calls
    */
    this.baseTable.onSuccessFunction =
      (res)=>
      {
        let rowList:Array<PlentyTableRow<DemoData>> = [];

        let total = res['total'];
        let perPage = res['per_page'];
        let currentPage = res['current_page'];
        let lastPage = res['last_page'];
        let from = res['from'];
        let to = res['to'];

        this.baseTable.pagingData = {
          pagingUnit:  'Aufträge',
          total:       total,
          currentPage: currentPage,
          perPage:     perPage,
          lastPage:    lastPage,
          from:        from,
          to:          to
        };

        let dataList = res['data'];

        for(let index in dataList)
        {
          let data:DemoData = dataList[index];

          let row:PlentyTableRow<DemoData>;

          let buttonList:Array<PlentyButtonInterface> =
            [{
              icon:          'icon-add',
              tooltipText:   'Hinzufügen',
              clickFunction: ()=>
                             {
                               alert("Add clicked");
                             }
            },
             {
               icon:          'icon-cancel',
               tooltipText:   'Abbrechen',
               clickFunction: ()=>
                              {
                                alert("Cancel clicked");
                              }
             },
             {
               icon:          'icon-delete',
               tooltipText:   'Löschen',
               clickFunction: ()=>
                              {
                                this.baseTable.deleteRow(row);
                              }
             }];

          let cellList:Array<PlentyTableCell> =
            [{
              caption:    data.id,
              identifier: 'id'
            },
             {
               caption:    data.contactId,
               identifier: 'contactId'
             },
             {
               caption:    data.orderCount,
               identifier: 'orderCount'
             },
             {
               caption:    data.unpaidOrdersCount,
               identifier: 'unpaidOrdersCount'
             },
             {
               caption:    data.unpaidOrderTotalAmount,
               identifier: 'unpaidOrderTotalAmount'
             },
             {
               caption:    data.createdAt,
               identifier: 'createdAt'
             },
             {
               caption:          data.updatedAt,
               identifier:       'updatedAt',
               tooltipText:      'Aktualisiert am',
               tooltipPlacement: 'bottom',
             },
             {
               identifier: 'actions',
               buttonList: buttonList
             },];

          let contextMenuLinkList:Array<PlentyDataTableContextMenuEntry<DemoData>> = [
            {
              title:         'Eintrag 1',
              subject:       new Subject<PlentyDataTableContextMenuEntry<DemoData>>(),
              clickFunction: (value)=>this.contextMenuCallback(value),
              data:          data
            },
            {
              title:         'Eintrag 2',
              subject:       new Subject<PlentyDataTableContextMenuEntry<DemoData>>(),
              clickFunction: (value)=>this.contextMenuCallback(value),
              data:          data
            },
            {
              subject:   new Subject<PlentyDataTableContextMenuEntry<DemoData>>(),
              isDivider: true
            },
            {
              title:         'Eintrag 3',
              subject:       new Subject<PlentyDataTableContextMenuEntry<DemoData>>(),
              clickFunction: (value)=>this.contextMenuCallback(value),
              data:          data
            }
          ];

          row = {
            cellList:            cellList,
            data:                data,
            clickFunction:       ()=>
                                 {
                                   alert('ROW with ID ' + data.id + ' clicked');
                                 },
            contextMenuLinkList: contextMenuLinkList
          };

          rowList.push(row);
        }

        this.baseTable.rowList = rowList;
      };

    this.baseTable.doSearch(this.baseTable.service.getOrdersummary(1, 10));
  }

  @HostListener('doPagingEvent', ['$event'])
  onPaging(pagerData:PlentyPagerData)
  {
    this.baseTable.doSearch(this.baseTable.service.getOrdersummary(pagerData.currentPage, pagerData.perPage));
  }

  private contextMenuCallback(value:PlentyDataTableContextMenuEntry<DemoData>):void
  {
    alert(value.data.id);
  }
}
