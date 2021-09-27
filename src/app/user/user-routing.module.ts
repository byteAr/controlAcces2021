import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitComponent } from './componets/visit/visit.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'visit', component: VisitComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
