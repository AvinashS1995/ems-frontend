import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { API_ENDPOINTS, REGEX } from '../../../shared/constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/api/auth.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../shared/services/common/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      // password: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD_REGEX)]]
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onLoginSubmit() {
    console.log(this.loginForm);
    let { rememberMe } = this.loginForm.getRawValue();
    if (this.loginForm.valid) {
      this.AuthService.authApiCall(
        API_ENDPOINTS.SERVICE_LOGIN,
        this.loginForm.value
      ).subscribe({
        next: (resp: any) => {
          console.log(`${API_ENDPOINTS.SERVICE_LOGIN} Response : `, resp);
          if (resp.token && resp.secretKey) {
            const decryptedSecret = this.commonService.decryptSecretKey(
              resp.secretKey
            );

            const storage = rememberMe ? localStorage : sessionStorage;

            storage.setItem('token', resp.token);
            storage.setItem('key', resp.secretKey);
            storage.setItem(
              'userName',
              this.commonService.encryptWithKey(resp.user.name, decryptedSecret)
            );
            storage.setItem(
              'roleName',
              this.commonService.encryptWithKey(resp.user.role, decryptedSecret)
            );
            storage.setItem(
              'email',
              this.commonService.encryptWithKey(resp.user.email, decryptedSecret)
            );
            storage.setItem(
              'empNo',
              this.commonService.encryptWithKey(resp.user.empNo, decryptedSecret)
            );

            this.commonService.setUserDetailsFromToken();
            this.commonService.openSnackbar(resp.message, 'success');
            // this.commonService.setUserDetails(resp.user.name, resp.user.role);
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (error) => {
          this.commonService.openSnackbar(error.error.message, 'error');
        },
      });
    }
  } 

  onForgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
}
