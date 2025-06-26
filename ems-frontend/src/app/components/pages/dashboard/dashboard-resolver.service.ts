import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../../shared/constant';
import { CommonService } from '../../../shared/services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService {

  constructor(private apiService: ApiService, private commonService: CommonService) {}

  

  resolve(): Observable<any> {

    let getUpcomingHoliday = of({});
    // let getEmployeeRequestList = of({});
    
    getUpcomingHoliday = this.apiService.getApiCall(API_ENDPOINTS.SERVICE_GET_UPCOMING_HOLIDAYS);

    // const payload = {
    //   empNo : this.commonService.userDetails.empNo || '',
    //   role : this.commonService.userDetails.role || '',
    // }
    // getEmployeeRequestList = this.apiService.postApiCall(API_ENDPOINTS.SERVICE_GET_EMPLOYEE_LEAVE_REQUEST_LIST, payload);


   return forkJoin({
    getUpcomingHoliday,
    // getEmployeeRequestList
    });
  }
}
