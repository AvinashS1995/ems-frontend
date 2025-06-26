import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogData } from '../../../interfaces/dialog';
import { SharedModule } from '../../../shared.module';


@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
