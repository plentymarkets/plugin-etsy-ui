import {
    Component,
    ChangeDetectionStrategy
} from '@angular/core';
import { Locale } from 'angular2localization';

@Component({
               selector:        'etsy-app',
               template:        require('./etsy-app.component.html'),
               styles:          [require('./etsy-app.component.scss').toString()],
               changeDetection: ChangeDetectionStrategy.Default
           })

export class EtsyComponent extends Locale
{
    
}