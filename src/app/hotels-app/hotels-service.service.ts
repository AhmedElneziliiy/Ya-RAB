import { Hotel, HotelDashBoard, Room } from './interfaces/hotel-dashboard';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, take, tap } from 'rxjs';
import { AlertDialogComponent } from '../alert-dialog-component/alert-dialog-component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingDialogComponent } from '../shared-app/Components/loading-dialog/loading-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  editProfile(formData: FormData, hotelId: string): Observable<Hotel> {
    return this.client.put<Hotel>(this.baseUrl + 'Hotels/' + hotelId, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,

      }
    });
  }
  editRoom(room: FormData, roomId: string) {
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    return this.client.put<Room>(this.baseUrl + 'rooms/' + roomId, room, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).subscribe({
      next: (value) => {
        ref.close();
        this.matDialog.open(AlertDialogComponent, {
          data: {
            title: 'TripLink',
            message: 'Room Updated Successfully',
            method: () => {
              inject(Router).navigate(['/hotel/rooms'])
            }
          }
        });
        this.hotelDashBoard$.subscribe(
          (hotel) => {
            hotel.rooms?.map((e) => {
              if (e.roomId == roomId) {
                e.photoUrls = value.photoUrls;
              }
            });
          }
        );
      },

      error: (err) => {
        ref.close();
        let message = '';
        err['error']['errors'].map((e: string) => message += e + '\n');
        this.matDialog.open(AlertDialogComponent, {
          data: {
            title: 'Error',
            message: message
          }
        });
      },
    });
  }
  matDialog!: MatDialog;
  // localStorage.setItem('hotelToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNzM2NjhkMy05MGM1LTRmOGYtYjA2NS0wNzVjYTZiNDcwN2MiLCJqdGkiOiJiN2VlNDY2MS0wYzJjLTRkMDUtYjgwNi01NWFlZmU5NmIxZTYiLCJlbWFpbCI6InNhcmEuYWhtZWRAZXhhbXBsZS5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJIb3RlbCIsInJvbGVzIjoiSG90ZWwiLCJleHAiOjE3NTU1NDIyMjEsImlzcyI6IkVneXB0VHJpcEFwaSIsImF1ZCI6IkVneXB0VHJpcEFwaSJ9.CrmD7MfOII_fsj_EfAZapPyUEa7wbwcp2SsqOqWufuo');
  deleteRoom(roomId: string) {
    return this.client.delete<Room>(this.baseUrl + 'rooms/' + roomId, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).pipe(tap(r => {
      this.roomsSubject.subscribe(
        (rooms) => {
          rooms = rooms.filter((e) => e.roomId != roomId);
          this.roomsSubject.next(rooms);
        }
      )
    }));


  }

  addNewRoom(formData: FormData): Observable<Room> {
    return this.client.post<Room>(this.baseUrl + 'Hotels/' + localStorage.getItem('id') + '/rooms', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }

  hotelDashBoardSubject = new ReplaySubject<HotelDashBoard>();
  hotelDashBoard$ = this.hotelDashBoardSubject.asObservable();

  roomsSubject = new ReplaySubject<Room[]>();
  roomsDashBoard$ = this.roomsSubject.asObservable();

  profileSubject = new ReplaySubject<Hotel>();
  profileDashBoard$ = this.profileSubject.asObservable();


  baseUrl = 'https://fizo.runasp.net/api/';


  constructor(private client: HttpClient) {
    this.matDialog = inject(MatDialog);
  }


  getHotelDashBoard() {
    this.client.get<HotelDashBoard>(this.baseUrl + 'Dashboard/hotel', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).pipe(take(1)).subscribe(
      {
        next: (value) => {
          this.hotelDashBoardSubject.next(value);
          this.roomsSubject.next(value.rooms!);
        },
        error: (err) => {
          this.hotelDashBoardSubject.error(err);
        }
      }
    );
  }

  getHotelProfile() {
    this.client.get<Hotel>(this.baseUrl + `Hotels/${localStorage.getItem('id')}`).subscribe(
      (profile) => { this.profileSubject.next(profile); }
    )
  }
}
