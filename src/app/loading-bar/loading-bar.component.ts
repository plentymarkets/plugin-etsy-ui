import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoadingBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
