import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private adminStatus: boolean = false;
  constructor() { }

  setAdminStatus(value: boolean): void {
    this.adminStatus = value;
  }

  getAdminStatus(): boolean { return this.adminStatus; }
}
