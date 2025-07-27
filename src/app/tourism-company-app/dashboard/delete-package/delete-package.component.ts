import { Component, inject, Inject, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedAppModule } from '../../../shared-app/shared-app.module';
import { AlertDialogComponent } from '../../../alert-dialog-component/alert-dialog-component';
import { title } from 'process';
import { Router } from '@angular/router';
import { LoadingDialogComponent } from '../../../shared-app/Components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-delete-package',
  imports: [SharedAppModule],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.scss'
})
export class DeletePackageComponent implements OnInit {

  constructor(private service: CompanyService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeletePackageComponent>, public matDialog: MatDialog) { }
  ngOnInit(): void {
    this.id = this.data.id;
    this.itemName = this.data.itemName;
  }
  id!: string;

  itemName!: string;

  router = inject(Router);

  confirm() {
    const ref = this.matDialog.open(LoadingDialogComponent, {
      disableClose: true,
    });
    this.service.deletePackage(this.id).subscribe(
      {
        next: (val) => {
          ref.close();
          this.matDialog.open(AlertDialogComponent, {
            data: {
              title: 'TripLink',
              message: 'Package Deleted Successfully!',
              method: () => {
                this.router.navigate(['/company/dashboard']);
              }
            }
          })
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