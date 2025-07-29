import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Component, inject, OnInit } from '@angular/core';
import { TourGuideService } from '../tour-guide.service';
import { DashBoard } from '../interfaces/dashboard';
import { log } from 'console';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../landing-app/Components/auth-service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  logout() {
    this.authSerivce.logout();
  }
  dashBoard!: DashBoard;

  constructor(private matDialog: MatDialog) { }

  service = inject(TourGuideService);

  authSerivce = inject(AuthService);

  ngOnInit(): void {
    this.service.dashboard$.subscribe(
      {
        next: (value) => {
          this.dashBoard = value!;
        },
        error: (err) => {
          let message = '';
          err['error']['errors'].map((e: string) => message += e + '\n');
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: message
            }
          });
        },
      }
    );
    this.service.getTourGuideDashBoard();
  }

}
