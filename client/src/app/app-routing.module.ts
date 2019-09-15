import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';


const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
