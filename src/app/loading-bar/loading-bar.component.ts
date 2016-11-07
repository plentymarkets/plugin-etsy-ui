import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'loading-bar',
  template: require('./loading-bar.component.html'),
  styles: [require('./loading-bar.component.css').toString()],
  encapsulation: ViewEncapsulation.None
})
export class LoadingBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
