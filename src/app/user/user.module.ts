import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './componets/search/search.component';
import { VisitComponent } from './componets/visit/visit.component';

//PrimeNg
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';
import {FileUploadModule} from 'primeng/fileupload';
import {SelectButtonModule} from 'primeng/selectbutton';


@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    VisitComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,    
    FileUploadModule,
    SelectButtonModule 
  ]
})
export class UserModule { }
