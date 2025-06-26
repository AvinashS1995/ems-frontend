import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<SnackBarComponent>
  ) {}

  closeSnackbar() {
    this.snackBarRef.dismiss();
  }

}
