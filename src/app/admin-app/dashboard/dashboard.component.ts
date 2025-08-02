import { MatDialog } from '@angular/material/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../landing-app/Components/auth-service.service';
import { Admin } from '../admin';
import { AdminService } from '../admin-service.service';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatProgressSpinner, CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {

  isAdminReqFinished = false;

  ngOnInit(): void {

    this.adminService.getAdminDashboard().subscribe(
      {
        next: (value) => {
          this.admin = value;
          this.isAdminReqFinished = true;
        },
        error: (err) => {
          this.dialog.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: 'Error Getting data try again later'
            }
          });
          this.logout();
        },
      }
    );
  }

  authService = inject(AuthService);

  adminService = inject(AdminService);

  admin!: Admin;

  dialog = inject(MatDialog);

  logout() {
    this.authService.logout();
  }
}
