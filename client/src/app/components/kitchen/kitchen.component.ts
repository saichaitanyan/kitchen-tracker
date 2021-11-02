import { Component, OnInit } from '@angular/core';
import { KitchenService } from 'src/app/services/kitchen.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {
  ordersList: any = [];
  time: any = '5:00';
  constructor(private kitchenService: KitchenService) { }

  ngOnInit(): void {
    this.fetchOrdersList();
  }
  /**
   * listen for order list
   */
  fetchOrdersList(): void {
    this.kitchenService.getOrderDetails().subscribe((res: any) => {
      this.ordersList.push({ ...res });
    });
  }
}
