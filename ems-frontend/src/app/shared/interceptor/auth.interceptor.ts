import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { CommonService } from '../services/common/common.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const commonService = inject(CommonService); 

  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = commonService.getToken();
    // console.log(token);
    
  }

  if (token) {
  //  const cloned = req.clone({
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // headers: req.headers.set('authorization', `Bearer ${token}`)
    });
    // return next(cloned);
  }

  return next(req);
};
