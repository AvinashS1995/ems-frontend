import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from '../../services/http/http.service';
import { LoaderService } from '../../services/http/loader.service';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  
  "bgsColor": "red",
  "bgsOpacity": 0.5,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "ball-spin-fade-rotating",
  "blur": 5,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#252279",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "ball-spin-fade-rotating",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "red",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300

}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers:[{ provide: HTTP_INTERCEPTORS, useClass: LoaderService, multi: true }],
  exports:[
    NgxUiLoaderModule,

  ]

})
export class LoaderModule { }
