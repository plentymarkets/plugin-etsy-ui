import {
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    TerraTreeComponent,
    TerraOverlayComponent,
    TerraLeafInterface,
} from '@plentymarkets/terra-components';
import {
    Translation,
    TranslationService
} from 'angular-l10n';
import { Observable } from 'rxjs/Observable';
import { TaxonomiesService } from '../../../../core/rest/markets/etsy/taxonomies/taxonomies.service';
import { LoadingConfig } from '../../../../core/config/loading.config';
import { AlertConfig } from '../../../../core/config/alert.config';

@Component({
    selector: 'taxonomy-correlation',
    template: require('./taxonomy-correlation.component.html'),
    styles:   [require('./taxonomy-correlation.component.scss')]
})
export class TaxonomyCorrelationComponent extends Translation implements OnInit
{
    @Input('taxonomiesTree') public taxonomiesTree:Array<TerraLeafInterface>;

    @ViewChild('taxonomiesTreeElement') public taxonomiesTreeElement:TerraTreeComponent;
    
    private _taxonomiesTree:Array<TerraLeafInterface>;

    constructor(private _taxonomiesService:TaxonomiesService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        super(translation);

        this._taxonomiesTree = [];
    }

    ngOnInit()
    {
        this._taxonomiesTree = this.taxonomiesTree;
    }

}