/*
*
* > Component <
* consists of Component Decorator and Component Class
*
* > TerraDemoComponent <
* a.k.a The AppComponent
* is one or the only unit of functionality of a module
*
*/

import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'etsy-app',
  template: require('./etsy-app.component.html'),
  styles:   [require('./etsy-app.component.scss')]
})
export class EtsyComponent implements OnInit{

  constructor()
  {

  }

  ngOnInit()
  {
  }
}
