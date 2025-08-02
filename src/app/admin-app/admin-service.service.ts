import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Admin } from "./admin";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  client = inject(HttpClient);

  baseUrl = 'https://fizo.runasp.net/api/';

  getAdminDashboard(): Observable<Admin> {
    return this.client.get<Admin>(this.baseUrl + 'Dashboard/admin', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
