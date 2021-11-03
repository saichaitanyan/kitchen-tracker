import { Component, OnInit, ViewChild } from '@angular/core';
import { KitchenService } from 'src/app/services/kitchen.service';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {
  ordersList: any = [];
  time: any = '5:00';
  @ViewChild('cd', { static: false })
  countdown!: CountdownComponent;
  config: any = { leftTime: 300 };
  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.fetchOrdersList();
  }
  /**
   * listen for order list
   */
  fetchOrdersList(): void {
    let count = 0;
    this.kitchenService.getOrderDetails().subscribe(async (res: any) => {
      res.orderDetails.forEach((element: { count: number, itemName: string }) => {
        count += element.count;
      });
      const response = { ...res };
      response.timeRequired = await { leftTime: (60 * 2 * count) };
      this.ordersList.push(response);
      this.countdown.begin();
    });
  }
  /**
   * handle counter event
   * @param event: any 
   */
  handleEvent(event: any, order: any): void {
    if (event.action === 'done') {
      this.deliverOrder(order.id);
    }
  }
  /**
   * 
   */
  deliverOrder(orderId: string): void {
    const index = this.ordersList.findIndex((e: any) => e.id == orderId);
    if (index != -1) {
      this.ordersList.splice(index, 1);
    }
  }
}
