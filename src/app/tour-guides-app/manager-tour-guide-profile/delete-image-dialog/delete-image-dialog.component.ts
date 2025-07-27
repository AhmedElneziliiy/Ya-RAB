import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManagerTourGuideProfileComponent } from '../manager-tour-guide-profile.component';

@Component({
  selector: 'app-delete-image-dialog',
  imports: [],
  templateUrl: './delete-image-dialog.component.html',
  styleUrl: './delete-image-dialog.component.scss',
  providers: [ManagerTourGuideProfileComponent]
})
export class DeleteImageDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteImageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  profileComponent = inject(ManagerTourGuideProfileComponent);

  confirm() {
    this.dialogRef.close(this.data.imageUrl);
  }
  cancel() {
    this.dialogRef.close(false);
  }
}
