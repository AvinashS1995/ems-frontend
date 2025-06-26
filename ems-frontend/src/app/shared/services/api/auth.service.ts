import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private http: HttpService,
  ) { }

  
  authApiCall(endPoint: string, request: any){
    return this.http.post(`${endPoint}`, request);
    
  }
}
