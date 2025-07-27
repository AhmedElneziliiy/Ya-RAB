import { Component, inject, OnInit } from '@angular/core';
import { HotelsService } from '../hotels-service.service';
import { Room } from '../interfaces/hotel-dashboard';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog-component/alert-dialog-component';
import { RouterOutlet, Router } from '@angular/router';
import { HotelNavbarComponent } from "../hotel-navbar/hotel-navbar.component";
@Component({
  selector: 'app-manage-rooms',
  imports: [RouterOutlet],
  templateUrl: './manage-rooms.component.html',
  styleUrl: './manage-rooms.component.scss',
  standalone: true,
})
export class ManageRoomsComponent implements OnInit {

  constructor(private matDialog: MatDialog, public router: Router) {
    this.router.events.subscribe(e => {
      console.log('Router event:', e);
    });
  }

  isRoomsReqFinished = false;

  rooms: Room[] = [];
  ngOnInit(): void {
    this.service.hotelDashBoard$.subscribe(
      {
        next: (value) => {
          this.rooms = value.rooms!;
          this.isRoomsReqFinished = true;
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
    this.service.getHotelDashBoard();
  }
  service = inject(HotelsService);

}
