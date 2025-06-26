import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from './modules/loader/loader.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
  ],
   exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule,
    CommonModule
    
  ]
})
export class SharedModule { }
