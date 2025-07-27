import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedAppModule } from '../../../../shared-app/shared-app.module';
import { TouristService } from '../../../tourist.service';
import { AlertDialogComponent } from '../../../../alert-dialog-component/alert-dialog-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-booking',
  imports: [SharedAppModule],
  templateUrl: './delete-booking.component.html',
  styleUrl: './delete-booking.component.scss'
})
export class DeleteBookingComponent implements OnInit {

  constructor(private service: TouristService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteBookingComponent>, public matDialog: MatDialog) { }
  ngOnInit(): void {
    this.id = this.data.id;
    this.itemName = this.data.itemName;
  }
  id!: string;

  itemName!: string;
  confirm() {
    this.service.deleteBooking(this.id).subscribe(
      {
        next: (value) => {
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'TripLink',
              message: 'Booking deleted successfully!',
            }
          });

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
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close(false);
  }
}