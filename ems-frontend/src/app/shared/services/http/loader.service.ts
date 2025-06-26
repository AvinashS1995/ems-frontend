import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

   constructor(private loader: NgxUiLoaderService) { }


  showLoader ()  {
    this.loader.start();
  }

  hideLoader () {
    this.loader.stop();
  }
}
