import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KitchenService {
  readonly SERVER_STATUS: string = 'status';
  readonly PLACE_ORDER: string = 'orders';
  readonly RECEIVE_ORDER: string = 'receiveOrders';
  readonly ADMIN_LOGIN: string = 'adminLogin';
  readonly ITEMS: string = 'item';

  // socketObj: Socket;
  constructor(private socket: Socket) {
    socket.removeAllListeners();
  }
  /**
   * send order details through socket to listen at kitchen
   * @param orderData: any 
   */
  makeOrder(orderData: []) {
    this.socket.emit(this.PLACE_ORDER, orderData);
  }

  /**
   * receive order details
   */
  getOrderDetails() {
    return new Observable((subscriber) => {
      this.socket.on(this.RECEIVE_ORDER, (res: any) => {
        subscriber.next(res);
      })
    });
  }
  /**
   * check server status
   */
  checkServerStatus() {
    return new Observable((subscriber) => {
      this.socket.on(this.SERVER_STATUS, (data: any) => {
        subscriber.next(data);
      })
    });
  }
  /**
   * 
   */
  handshakeForAdmin() {
    this.socket.emit(this.ADMIN_LOGIN, {});
  }
  /**
   * get items list
   */
  getItemsList() {
    return new Observable((subscriber) => {
      this.socket.on(this.ITEMS, (data: any) => {
        subscriber.next(data);
      })
    });
  }
  /**
   * close socket connection
   */
  closeConnection(): void {
    this.socket.disconnect();
  }
}
