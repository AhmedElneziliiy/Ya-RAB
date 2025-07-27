import { HotelsService } from './../../hotels-service.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedAppModule } from '../../../shared-app/shared-app.module';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { Router } from '@angular/router';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'room-delete-package',
  imports: [SharedAppModule],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.scss'
})
export class DeletePackageComponent implements OnInit {

  constructor(private service: HotelsService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeletePackageComponent>, public matDialog: MatDialog) { }
  ngOnInit(): void {
    this.id = this.data.id;
    this.itemName = this.data.itemName;
  }
  id!: string;

  itemName!: string;

  confirm() {
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });

    this.service.deleteRoom(this.id).subscribe(
      {
        next: (val) => {
          ref.close();
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'TripLink',
              message: 'Room Deleted Successfully!',

              method: () => {
                inject(Router).navigate(['/hotel/rooms'])
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
    );
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}