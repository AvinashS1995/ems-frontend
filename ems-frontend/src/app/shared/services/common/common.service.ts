import { Injectable, signal } from '@angular/core';
import { ConfirmationDialogData } from '../../interfaces/widget';
import { ConfirmationDialogComponent } from '../../widget/dialog/confirmation-dialog/confirmation-dialog.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackBarComponent } from '../../widget/snack-bar/snack-bar.component';
import { AlertDialogComponent } from '../../widget/dialog/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '../../interfaces/dialog';
import * as jwtDecodeNamespace from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class CommonService {

  expandSidenav = signal<boolean>(true);

  userDetails = {
    _id: '',
    empNo: '',
    name: '',
    email: '',
    mobile: '',
    role: '',
    type: '',
    status: '',
    teamLeader: '',
    manager: '',
    hr: '',
    designation: '',
    joiningDate: '',
    salary: 0,
    workType: '',
    loginUserSecretkey: ''
  };

  private userDetailsSubject = new BehaviorSubject<any>(this.userDetails);

  userDetails$ = this.userDetailsSubject.asObservable();

  ENCRYPTION_KEY = CryptoJS.enc.Hex.parse('232a3885f7ef6f1bf0136b055956a5f9a44e6633b8ef14f1016e014816f59d64');
  IV_LENGTH = 16; 
  secretKey: string = ''; 
  userSecretKey = "1407492449d59d3e0393cb657c71f02a99b5c9c6b247945204c81ad19188f30f"

  


  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.setUserDetailsFromToken();
  }

  
  decryptSecretKey(encrypted: string): string {
    const [ivHex, encryptedData] = encrypted.split(':');
  
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  encryptWithKey(data: any, key: string): string {
    const keyWordArray = CryptoJS.enc.Hex.parse(key);
    const iv = CryptoJS.lib.WordArray.random(16); 
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), keyWordArray, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return iv.toString() + ':' + encrypted.toString(); 
  }
  
  decryptWithKey(data: string, key: string): any {
    const [ivHex, encryptedData] = data.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const keyWordArray = CryptoJS.enc.Hex.parse(key);
  
    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  encryptByAEStoString(value: any): string {
    const text = JSON.stringify(value); 
  return CryptoJS.AES.encrypt(text, this.userSecretKey).toString();
  }

  decryptByAEStoString(encrypted: string): string {
    const decryptedText = CryptoJS.AES.decrypt(encrypted, this.userSecretKey).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText); 
  }

  
  openSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { message, type },
      duration: 3000, 
      horizontalPosition: 'end', 
      verticalPosition: 'bottom', 
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar',
    });
  }

  showConfirmationDialog(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '650px',
      data: {
        title: data.title,
        message: data.message,
        confirmText: data.confirmText || 'Confirm',
        cancelText: data.cancelText || 'Cancel',
      },
    });

    return dialogRef.afterClosed();
  }

  showAlertDialog(data: AlertDialogData): Observable<void> {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '650px',
      data: {
        title: data.title,
        message: data.message,
        okText: data.okText || 'OK',
      },
    });
  
    return dialogRef.afterClosed();
  }
  

  getToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  setUserDetailsFromToken() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.warn('Session and Token Is Expired');
    }

    if (token) {
      try {
        const decoded: any = jwtDecodeNamespace.jwtDecode(token);

        const updatedUser = {
          _id: decoded._id || '',
          empNo: decoded.empNo || '',
          name: decoded.name || '',
          email: decoded.email || '',
          mobile: decoded.mobile || '',
          role: decoded.role || '',
          type: decoded.type || '',
          status: decoded.status || '',
          teamLeader: decoded.teamLeader || '',
          manager: decoded.manager || '',
          hr: decoded.hr || '',
          designation: decoded.designation || '',
          joiningDate: decoded.joiningDate || '',
          salary: decoded.salary || 0,
          workType: decoded.workType || '',
          loginUserSecretkey: decoded.loginUserSecretKey || ''
        };
 
        this.userDetails = updatedUser;
          this.userDetailsSubject.next(updatedUser);
      } catch (e) {
        console.error('Token decoding failed', e);
      }
    }
  }
  }

  getCurrentUserDetails() {
    return this.userDetailsSubject.value;
  }

}
