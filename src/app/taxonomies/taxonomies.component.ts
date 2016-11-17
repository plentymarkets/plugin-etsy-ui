import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { TerraAlertComponent,TerraTreeComponent, TerraMultiSelectBoxValueInterface, TerraSelectBoxValueInterface, TerraPagerInterface, TerraOverlayComponent, TerraLeafInterface } from '@plentymarkets/terra-components/index';
import { TaxonomyService } from "./service/taxonomy.service";
import { TaxonomyCorrelationData } from "./data/taxonomy-correlation.data";

@Component({
    selector: 'taxonomies',
    template: require('./taxonomies.component.html'),
    styles: [require('./taxonomies.component.scss').toString()]
})
export class TaxonomiesComponent implements OnInit {
    private isLoading:boolean = true;
    private alert:TerraAlertComponent = TerraAlertComponent.getInstance();
    private taxonomiesList:Array<TerraLeafInterface> = [];
    private taxonomiesNameList:Array<any> = [];
    private correlations:Array<any>;
    private categories:Array<any>;
    private pagingData;
    private rowInOverlay:any;

    @ViewChild('viewTaxonomiesOverlay') public viewTaxonomiesOverlay:TerraOverlayComponent;
    @ViewChild('tree') public tree:TerraTreeComponent;

    constructor(private taxonomyService:TaxonomyService) {
        this.pagingData = {
            pagingUnit: 'Categories',
            total: 0,
            currentPage: 1,
            perPage: 25,
            lastPage: 0,
            from: 0,
            to: 0
        };

        this.getTaxonomies();
    }

    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit() {
    }

    private doPaging(pagerData:TerraPagerInterface):void
    {
        this.getData(pagerData.perPage, pagerData.currentPage)
    }

    private getTaxonomies()
    {
        this.taxonomyService.getTaxonomies().subscribe(
            response => {
                this.buildTaxonomiesTree(response);

                this.getCorrelations();
            },

            error => {
                this.alert.addAlert({
                    msg: 'Taxonomies could not be loaded: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });
            }
        )
    }

    private getCorrelations()
    {
        let vm = this;

        this.taxonomyService.getCorrelations().subscribe(
            response => {
                vm.correlations = response;

                vm.getData(vm.pagingData.perPage, vm.pagingData.currentPage);
            },

            error => {
                vm.alert.addAlert({
                    msg: 'Correlations could not be loaded: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });
            }
        );
    }

    private getData(perPage, currentPage)
    {
        let vm = this;

        this.taxonomyService.getCategories(currentPage, perPage).subscribe(
            response => {
                vm.calculatePagingData(response, perPage, currentPage);

                vm.categories = response.entries;

                vm.categories.forEach(function(item, key) {
                    vm.categories[key].taxonomyName = '-';

                    vm.correlations.forEach(function(correlationItem) {
                        if(item.categoryId == correlationItem.categoryId)
                        {
                            vm.categories[key].taxonomyId = correlationItem.taxonomyId;
                            vm.categories[key].taxonomyName = vm.getTaxonomyName(correlationItem.taxonomyId);
                        }
                    })

                    vm.isLoading = false;
                });
            },

            error => {

                vm.alert.addAlert({
                    msg: 'Categories could not be loaded: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });

            }
        );
    }

    private getTaxonomyName(taxonomyId):string
    {
        if(this.taxonomiesNameList[taxonomyId])
        {
            return this.taxonomiesNameList[taxonomyId];
        }

        return 'None';
    }

    private openTaxonomiesOverlay(row)
    {
        this.rowInOverlay = row;

        this.viewTaxonomiesOverlay.showOverlay();
    }

    private updateTaxonomy(event)
    {
        let leaf:TerraLeafInterface = this.tree.getSelectedLeaf();

        if(leaf != null)
        {
            this.rowInOverlay.taxonomyId = leaf.id;
            this.rowInOverlay.taxonomyName = this.getTaxonomyName(leaf.id);
            this.viewTaxonomiesOverlay.hideOverlay();
        }
    }

    private buildTaxonomiesTree(taxonomies):void
    {
        let vm = this;

        taxonomies.forEach(function(item) {
            vm.taxonomiesNameList[item.id] = item.name;

            vm.taxonomiesList.push(vm.getLeaf(item));
        });
    }

    private getLeaf(item)
    {
        let vm = this;

        let leafData = {
            caption: item.name,
            id: item.id,
            icon: null,
            subLeafList: null
        };

        vm.taxonomiesNameList[item.id] = item.name;

        if(item.children.length > 0)
        {
            leafData.icon = 'icon-folder';
            leafData.subLeafList = [];

            item.children.forEach(function(child) {
                leafData.subLeafList.push(vm.getLeaf(child));
            });
        }

        return leafData;
    }

    private saveCorrelations()
    {
        let vm = this;

        this.categories.forEach(function(categoryData) {
            vm.updateOrAddCorrelation(categoryData);
        });


        this.taxonomyService.saveCorrelations({ correlations: this.correlations }).subscribe(
            result => {
                this.alert.addAlert({
                    msg: 'Taxonomy correlations saved successfully',
                    closable: true,
                    type: 'success',
                    dismissOnTimeout: 5000
                });
            },

            error => {
                this.alert.addAlert({
                    msg: 'Correlations could not be saved: ' + error.statusText,
                    closable: true,
                    type: 'danger',
                    dismissOnTimeout: 5000
                });
            }
        )
    }

    private updateOrAddCorrelation(categoryData) {
        let vm = this;
        let isUpdate = false;

        this.correlations.forEach(function (correlationData, key) {
            if (correlationData.categoryId == categoryData.categoryId) {
                isUpdate = true;
                if (categoryData.taxonomyId) {
                    vm.correlations[key].taxonomyId = categoryData.taxonomyId
                }
                else {
                    vm.correlations[key].taxonomyId = null;
                }
            }
        });

        if (isUpdate == false && categoryData.taxonomyId)
        {
            this.correlations.push({
                taxonomyId: categoryData.taxonomyId,
                categoryId: categoryData.categoryId
            })
        }
    }

    private calculatePagingData(response, perPage, currentPage):void {
        this.pagingData.total = response.totalsCount;
        this.pagingData.currentPage = currentPage;
        this.pagingData.perPage = perPage;

        this.pagingData.lastPage = Math.ceil(response.totalsCount / perPage);

        let from = perPage * (currentPage - 1);
        this.pagingData.from = (from <= 0) ? 1 : from;

        let to = (this.pagingData.from <= 1) ? perPage : (this.pagingData.from + perPage);

        this.pagingData.to = (to > this.pagingData.total) ? this.pagingData.total : to;
    }
}