import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../services/company.service';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { title } from 'process';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-delete-booking',
  imports: [],
  templateUrl: './delete-booking.component.html',
  styleUrl: './delete-booking.component.scss'
})
export class DeleteBookingComponent {
  constructor(private service: CompanyService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeleteBookingComponent>, public matDialog: MatDialog) {
    this.itemName = this.data.itemName;
  }

  itemName!: string;

  confirm() {
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,

    })
    this.service.deleteBooking(this.data.bookingId).subscribe(
      {
        next: (val) => {
          ref.close();
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'TripLink',
              message: 'Booking Deleted Successfully!',
              method: () => {
                this.dialogRef.close(true);
              }
            }
          });
        },
        error: (error) => {
          ref.close();
          let message = '';
          error['error']['errors'].map((e: string) => message += e + '\n');
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'Error',
              message: message
            }
          });
        }
      }
    )
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
