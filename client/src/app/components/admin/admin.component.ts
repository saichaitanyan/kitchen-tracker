import { Component, OnInit } from '@angular/core';
import { KitchenService } from 'src/app/services/kitchen.service';
import { interval } from 'rxjs';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  itemsList: any = [];
  isAdminLoggedIn: boolean = false;
  orders: any = [];
  noOfOrders: number = 0;
  constructor(private kitchenService: KitchenService, private statusService: StatusService) { }

  ngOnInit(): void {
    this.loginAsAdmin();
    // listen for items list
    this.fetchItemsList();
    if (!this.isAdminLoggedIn) {
      interval(2000).subscribe(() => {
        this.loginAsAdmin();
      });
    }
  }

  loginAsAdmin(): void {
    this.isAdminLoggedIn = true;
    sessionStorage.setItem('isAdminLogin', JSON.stringify(this.isAdminLoggedIn));
    this.kitchenService.handshakeForAdmin();
    if (this.isAdminLoggedIn) {
      this.statusService.setAdminStatus(true);
    }
  }

  fetchItemsList(): void {
    this.kitchenService.getItemsList().subscribe((res: any) => {
      this.itemsList = res;
    });
  }
  /**
   * add items to cart
   * @param item: any 
   */
  async addToCart(item: any) {
    const itemDetails = { ...item };
    itemDetails.count = 1;
    const index = await this.checkItemInOrderList(item);
    if (index != -1) {
      let count: number = await this.getItemsCount(item);
      itemDetails.count = count + 1;
      this.orders.splice(index, 1, itemDetails);
    } else {
      this.orders.push(itemDetails);
    }
    this.noOfOrders = await this.totalItemsCount();
  }

  /**
   * check whether item is exist in the order list or not
   * @param item: number 
   */
  async checkItemInOrderList(item: any): Promise<number> {
    return this.orders.findIndex((e: any) => e.itemName == item.itemName);
  }
  /**
   * get items count
   * @param item: any 
   */
  async getItemsCount(item: any): Promise<number> {
    return this.orders.filter((e: any) => e.itemName == item.itemName)[0]['count'];
  }
  /**
   * 
   */
  async totalItemsCount(): Promise<number> {
    const ordersCount = this.orders.map((e: any) => e.count);
    // if (this.orders.length > 1) {
    return ordersCount.reduce((totalCount: any, e: any) => totalCount + e);
    // }
    // else
    //   return this.orders[0]['count'];
  }
  placeTheOrder(): void {
    this.kitchenService.makeOrder(this.orders);
    setTimeout(() => {
      this.orders = [];
      this.noOfOrders = 0;
    }, 10);
  }

  onChangeItemsCount(item: any) {
    console.log('item ', item);
    this.addToCart(item);
  }
}
