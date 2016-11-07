/*
*
* demonstrate the creation of a new component and using of jQuery within an Angular2 App
*
* requires jQuery scripts in index.html
*/

import {
  Component,
  Input,
  ViewEncapsulation,
  ElementRef,
  Inject,
  DoCheck
} from '@angular/core';

// declare variable to use jQuery code, is used instead of '$'
declare var jQuery:any;

@Component({
  selector: 'popup',
  template: require('./popup.component.html'),
  styles: [require('./popup.component.scss').toString()],
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements DoCheck {

  @Input() isOpen:boolean;
  private elementRef:ElementRef;
  private openPopup:boolean;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  /*
  * belong to DoCheck Lifecycle hook
  * get called to check the changes in the directives in addition to the default
  * algorithm. The default change detection algorithm looks for differences by comparing
  * bound-property values by reference across change detection runs.
  */
  ngDoCheck()
  {
    // use jQuery to manipulate the popup element for drag ability and opacity behavior
    jQuery(this.elementRef.nativeElement).find('.popup').draggable({ containment: ".draggable-constraint", scroll: false, snap: ".snap", snapMode: "outer" });
    jQuery(this.elementRef.nativeElement).find('.popup').mousedown(function(){
      jQuery('.popup').addClass("transparent");
    });
    jQuery(this.elementRef.nativeElement).find('.popup').mouseup(function(){
      jQuery('.popup').removeClass("transparent");
    });
  }

  public onClick():void
  {
    this.isOpen = !this.isOpen;
  }
}
