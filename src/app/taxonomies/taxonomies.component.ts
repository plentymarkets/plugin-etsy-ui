import { Component, OnInit, ViewChild, HostListener, Inject, forwardRef } from '@angular/core';
import { TerraTreeComponent, TerraMultiSelectBoxValueInterface, TerraSelectBoxValueInterface, TerraPagerInterface, TerraOverlayComponent, TerraLeafInterface, TerraOverlayButtonInterface } from '@plentymarkets/terra-components/index';
import { TaxonomyService } from "./service/taxonomy.service";
import { TaxonomyCorrelationData } from "./data/taxonomy-correlation.data";
import { EtsyComponent } from "../etsy-app.component";
import { LocaleService } from "angular2localization/angular2localization";
import { LocalizationService } from "angular2localization/angular2localization";
import { Locale } from "angular2localization/angular2localization";

@Component({
    selector: 'taxonomies',
    template: require('./taxonomies.component.html'),
    styles: [require('./taxonomies.component.scss').toString()]
})
export class TaxonomiesComponent extends Locale implements OnInit {
    private isLoading:boolean = true;
    private taxonomiesList:Array<TerraLeafInterface> = [];
    private taxonomiesNameList:Array<any> = [];
    private correlations:Array<any>;
    private categories:Array<any>;
    private pagingData;
    private rowInOverlay:any;
    private correlationsLoaded = false;

    private updateTaxonomyPrimaryButtonOverlay:TerraOverlayButtonInterface;

    @ViewChild('viewTaxonomiesOverlay') public viewTaxonomiesOverlay:TerraOverlayComponent;
    @ViewChild('tree') public tree:TerraTreeComponent;

    constructor(
        private taxonomyService:TaxonomyService,
        @Inject(forwardRef(() => EtsyComponent)) private etsyComponent:EtsyComponent,
        locale:LocaleService,
        localization:LocalizationService
    ) {
        super(locale, localization);

        this.localization.translationChanged.subscribe(() => {
            this.pagingData = {
                pagingUnit: this.localization.translate('categories'),
                total: 0,
                currentPage: 1,
                perPage: 25,
                lastPage: 0,
                from: 0,
                to: 0
            };
        });

        this.getTaxonomies();
    }

    /*
     * belong to OnInit Lifecycle hook
     * get called right after the directive's data-bound properties have been checked for the
     * first time, and before any of its children have been checked. It is invoked only once when the
     * directive is instantiated.
     */
    ngOnInit() {
        this.updateTaxonomyPrimaryButtonOverlay = {
            icon:          'icon-plus',
            caption:       'Add',
            isDisabled:    false,
            clickFunction: () => this.updateTaxonomy()
        };
    }

    private doPaging(pagerData:TerraPagerInterface):void {
        this.getData(pagerData.perPage, pagerData.currentPage)
    }

    private getTaxonomies() {
        this.etsyComponent.callLoadingEvent(true);

        this.taxonomyService.getTaxonomies().subscribe(
            response => {
                this.buildTaxonomiesTree(response);

                this.etsyComponent.callLoadingEvent(false);

                this.getCorrelations();
            },

            error => {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadTaxonomies') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        )
    }

    private getCorrelations() {
        this.etsyComponent.callLoadingEvent(true);

        this.taxonomyService.getCorrelations().subscribe(
            response => {
                this.correlations = response;

                this.etsyComponent.callLoadingEvent(false);

                this.correlationsLoaded = true;

                this.getData(this.pagingData.perPage, this.pagingData.currentPage);
            },

            error => {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadTaxonomyCorrelations') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }

    private getData(perPage, currentPage) {
        if(!this.correlationsLoaded)
        {
            return;
        }

        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;

        this.taxonomyService.getCategories(currentPage, perPage).subscribe(
            response => {
                this.calculatePagingData(response, perPage, currentPage);

                this.categories = response.entries;

                this.categories.forEach((item, key) => {
                    this.categories[key].taxonomyName = ' ';

                    this.correlations.forEach((correlationItem) => {
                        if (item.categoryId == correlationItem.categoryId) {
                            this.categories[key].taxonomyId = correlationItem.taxonomyId;
                            this.categories[key].taxonomyName = this.getTaxonomyName(correlationItem.taxonomyId);
                        }
                    });
                });

                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorLoadCategories') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.etsyComponent.isLoading = false;
                this.isLoading = false;
            }
        );
    }

    private getTaxonomyName(taxonomyId):string {
        if (this.taxonomiesNameList[taxonomyId]) {
            return this.taxonomiesNameList[taxonomyId];
        }

        return ' ';
    }

    private openTaxonomiesOverlay(row) {
        this.rowInOverlay = row;

        this.viewTaxonomiesOverlay.showOverlay();
    }

    private updateTaxonomy() {
        let leaf:TerraLeafInterface = this.tree.getSelectedLeaf();

        if (leaf != null) {
            this.rowInOverlay.taxonomyId = leaf.id;
            this.rowInOverlay.taxonomyName = this.getTaxonomyName(leaf.id);
            this.viewTaxonomiesOverlay.hideOverlay();
        }
    }

    private buildTaxonomiesTree(taxonomies):void {
        taxonomies.forEach((item) => {
            this.taxonomiesNameList[item.id] = item.name;

            this.taxonomiesList.push(this.getLeaf(item));
        });
    }

    private getLeaf(item) {
        let leafData = {
            caption: item.name,
            id: item.id,
            icon: null,
            subLeafList: null
        };

        this.taxonomiesNameList[item.id] = item.name;

        if (item.children.length > 0) {
            leafData.icon = 'icon-folder';
            leafData.subLeafList = [];

            item.children.forEach((child) => {
                leafData.subLeafList.push(this.getLeaf(child));
            });
        }

        return leafData;
    }

    private saveCorrelations() {
        this.etsyComponent.callLoadingEvent(true);
        this.isLoading = true;

        this.categories.forEach((categoryData) => {
            this.updateOrAddCorrelation(categoryData);
        });


        this.taxonomyService.saveCorrelations({correlations: this.correlations}).subscribe(
            result => {
                this.etsyComponent.callStatusEvent(this.localization.translate('successSaveTaxonomyCorrelations'), 'success');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            },

            error => {
                this.etsyComponent.callStatusEvent(this.localization.translate('errorSaveTaxonomyCorrelations') + ': ' + error.statusText, 'danger');
                this.etsyComponent.callLoadingEvent(false);
                this.isLoading = false;
            }
        )
    }

    private updateOrAddCorrelation(categoryData) {
        let isUpdate = false;

        this.correlations.forEach((correlationData, key) => {
            if (correlationData.categoryId == categoryData.categoryId) {
                isUpdate = true;
                if (categoryData.taxonomyId) {
                    this.correlations[key].taxonomyId = categoryData.taxonomyId
                }
                else {
                    this.correlations[key].taxonomyId = null;
                }
            }
        });

        if (isUpdate == false && categoryData.taxonomyId) {
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

    private reload() {
        location.reload();
    }
}