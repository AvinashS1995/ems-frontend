import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api/api.service';
import { FormBuilder } from '@angular/forms';
import { CommonService } from '../../../shared/services/common/common.service';
// import { CheckInsComponent } from '../attendence/check-ins/check-ins.component';
import { SharedModule } from '../../../shared/shared.module';
import { animate, keyframes, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { API_ENDPOINTS } from '../../../shared/constant';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
          trigger('scrollUp', [
            transition('* => *', [
              animate(
                '15s linear',
                keyframes([
                  style({ transform: 'translateY(0%)', opacity: 1, offset: 0 }),
                  style({ transform: 'translateY(-100%)', opacity: 0.5, offset: 1 }),
                  
                ])
              ),
            ]),
          ]),
        ],
})
export class DashboardComponent {

  hasCheckedIn: any
  animationState = false;
  pauseAnimation = false;
  upcomingHolidays: Array<any> = [];
  pendingLeaveCount: any;
  EmployeeNo: any;
  RoleName: any;
  UserEmail: any;
  
 constructor(
     private router: Router,
     private dialog: MatDialog,
     private activateRoute: ActivatedRoute,
     private apiService: ApiService,
     private fb: FormBuilder,
     private commonService: CommonService
   ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.openCheckIns();
    this.getparams();
    if (this.RoleName !== 'Employee') {
    this.getEmployeeLeaveRequestList();
    }
  }

  openCheckIns() {
      // debugger
      if (typeof window !== 'undefined') {
      this.hasCheckedIn = sessionStorage.getItem('checkIns');
      }

      

      // if (!this.hasCheckedIn) {
      //   const dialogRef = this.dialog.open(CheckInsComponent, {
      //     width: '600px',
      //     disableClose: true,
      //     data: { mode: 'checkins' }
      //   });
    
      //   dialogRef.afterClosed().subscribe((result) => {
      //     if (result === 'checkins') {
      //       // this.commonService.openSnackbar('Check-in required to continue', 'error');
            
      //     }
      //   });
      // }
    }

    onAnimationDone(event: AnimationEvent) {
      
      this.animationState = !this.animationState;
    }

    getparams() {
      this.activateRoute.data.subscribe((params) => {
        // console.log('Params Leave Management ---->', params);
  
        if (params['data']) {
  
          this.upcomingHolidays =
            params['data'].getUpcomingHoliday?.data?.upComingHolidays || [];
  
  
            this.upcomingHolidays = this.getCurrentAndNextMonthHolidays(this.upcomingHolidays);
  
        }
      });
    }

    getCurrentAndNextMonthHolidays(holidays: any[]): any[] {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
    
      const nextMonth = (currentMonth + 1) % 12;
      const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
      return holidays
        .map(holiday => {
          const dateObj = new Date(holiday.date);
          return {
            ...holiday,
            dateObj,
            name: this.cleanName(holiday.name)
          };
        })
        .filter(holiday => {
          const m = holiday.dateObj.getMonth();
          const y = holiday.dateObj.getFullYear();
          return (m === currentMonth && y === currentYear) || (m === nextMonth && y === nextMonthYear);
        });
    }
    
  
    private cleanName(name: string): string {
      
      return name.replace(/\s*\(.*?\)/g, '').trim();
    }

    getEmployeeLeaveRequestList() {

      const paylaod = {
        empNo: this.EmployeeNo ? this.EmployeeNo : '',
      role: this.RoleName ? this.RoleName : '',
      }
console.log("SERVICE_GET_USER_ATTENDENCE paylaod", paylaod)

    this.apiService
      .postApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_LEAVE_REQUEST_LIST, paylaod)
      .subscribe({
        next: (res: any) => {
          console.log(
            `${API_ENDPOINTS.SERVICE_GET_EMPLOYEE_LEAVE_REQUEST_LIST} Response : `,
            res
          );

          this.pendingLeaveCount = res?.data?.records || '';

          this.commonService.openSnackbar(res.message, 'success');
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    }


    loadUserDetails() {
    if (typeof window !== 'undefined') {
      const encryptedEmployeeNo =
        localStorage.getItem('empNo') || sessionStorage.getItem('empNo');
      const encryptedRole =
        localStorage.getItem('roleName') || sessionStorage.getItem('roleName');

      const encryptedEmail = localStorage.getItem('email') || sessionStorage.getItem('email');


      const encryptedSecretKey =
        localStorage.getItem('key') || sessionStorage.getItem('key');

      if (encryptedSecretKey) {
        
        const decryptedMainKey =
          this.commonService.decryptSecretKey(encryptedSecretKey);
        this.commonService.secretKey = decryptedMainKey; 
        console.log(
          'this.commonService.secretKey---->',
          this.commonService.secretKey
        );
      }
      if (encryptedEmployeeNo && encryptedRole &&  encryptedEmail && this.commonService.secretKey) {
        this.EmployeeNo = this.commonService.decryptWithKey(
          encryptedEmployeeNo,
          this.commonService.secretKey
        );
        this.RoleName = this.commonService.decryptWithKey(
          encryptedRole,
          this.commonService.secretKey
        );

        this.UserEmail = this.commonService.decryptWithKey(encryptedEmail, this.commonService.secretKey);


        console.log(`User Name ${this.EmployeeNo}  Role Name ${this.RoleName}`);
      }
    }
  }

    navigateToRequestList() {
  this.router.navigate(['/employee-leave-approval-request-list']);
}

}
