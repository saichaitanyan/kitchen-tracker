import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// socket 
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { KitchenService } from './services/kitchen.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const config: SocketIoConfig = { url: 'http://localhost:8000', options: { reconnection: true } };
// Angular material
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminComponent } from './components/admin/admin.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
// 3rd party modules
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    KitchenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule,
    MatInputModule,
    MatIconModule,
    CountdownModule
  ],
  providers: [KitchenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
