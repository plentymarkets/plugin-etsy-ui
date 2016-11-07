import {
  Directive,
  OnInit
} from '@angular/core';

@Directive({
  selector: 'loading-bar[demoLoadingBar]'
})
export class LoadingBarDirective implements OnInit {

  constructor()
  {

  }

  ngOnInit()
  {
  }
}
