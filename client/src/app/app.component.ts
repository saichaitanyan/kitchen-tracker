import { Component } from '@angular/core';
import { KitchenService } from './services/kitchen.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  statusObject: any = { status: 'Offline', time: null };
  statusSubscription: Subscription | undefined;

  time: Date = new Date();
  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    // get server status details
    this.getServerStatus();
    this.statusSubscription = interval(1000).subscribe(() => {
      this.time = new Date();
    })
  }
  /**
   * listen for server status 
   */
  getServerStatus(): void {
    this.kitchenService.checkServerStatus().subscribe((res: any) => {
      this.statusObject.status = (res) ? 'Connected' : 'Offline';
      this.statusObject.time = res.timestamp;
    }, (error) => {
      console.log('errors ', error);
    })
  }

  ngOnDestory(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }
}
