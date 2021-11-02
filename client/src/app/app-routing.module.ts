import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'kitchen', pathMatch: 'full'
  },
  {
    path: 'kitchen', component: KitchenComponent
  },
  {
    path: 'admin', component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
