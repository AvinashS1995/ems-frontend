import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { Sidenav } from '../../../shared/interfaces/sidenav';
import { SharedModule } from '../../../shared/shared.module';
import { CommonService } from '../../../shared/services/common/common.service';
import { NgClass } from '@angular/common';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_ENDPOINTS } from '../../../shared/constant';
import { AuthService } from '../../../shared/services/api/auth.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [SharedModule, NgClass],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('expandCollapseAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  @Output() navigateEvent = new EventEmitter<string>();

  menuItems = signal<Sidenav[]>([]);
  expandedMenus = new Set<string>();

  UserName: string = '';
  RoleName: string = '';
  UserEmail: string = '';

  token: string | null = null;

  constructor(
    private apiService: ApiService,
    public commonService: CommonService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();

    if (typeof window !== 'undefined') {
      this.token = this.commonService.getToken();
      // console.log(token);
    }

    if (this.token) {
      this.loadRoleBasedMenus();
    }

  }

  loadRoleBasedMenus() {
    
    const payload = {
      role: this.RoleName || '',
    };
    this.apiService
      .menuApiCall(API_ENDPOINTS.SERVICE_ROLEWISEMENUS, payload)
      .subscribe((res: any) => {
        if (res?.status === 'success') {
          
          const menus = res.data.filteredMenus

            console.log(menus) 

          const nestedMenus = menus.map((menu: any) => this.transformMenu(menu));
          console.log(nestedMenus)
        this.menuItems.set(nestedMenus.sort((a: { sequence: number; }, b: { sequence: number; }) => a.sequence - b.sequence));
        }
      });
  }

  transformMenu(menu: any): Sidenav {
  const transformed: Sidenav = {
    id: menu._id,
    title: menu.title,
    icon: menu.icon,
    route: menu.path,
    sequence: menu.sequence,
    children: menu.childMenu?.map((child: any) => this.transformMenu(child)) || []
  };
  return transformed; 
}

  buildMenuTree(flat: any[]) {
    const map = new Map<string, any>();
    const roots: any[] = [];
    flat.forEach(item => { item.children = []; map.set(item.id, item); });
    flat.forEach(item => {
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId).children.push(item);
      } else {
        roots.push(item);
      }
    });
    return roots.sort((a, b) => a.sequence - b.sequence);
  }

  toggleSubMenu(menuId: string): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  } 

  trackById(index: number, item: any): string {
  return item.id;
}


  navigateTO(url: string) {
    // debugger
    this.navigateEvent.emit(url);
  }

  loadUserDetails() {
    if (typeof window !== 'undefined') {
      const encryptedName =
        localStorage.getItem('userName') || sessionStorage.getItem('userName');
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
      if (encryptedName && encryptedRole &&  encryptedEmail && this.commonService.secretKey) {
        this.UserName = this.commonService.decryptWithKey(
          encryptedName,
          this.commonService.secretKey
        );
        this.RoleName = this.commonService.decryptWithKey(
          encryptedRole,
          this.commonService.secretKey
        );

        this.UserEmail = this.commonService.decryptWithKey(encryptedEmail, this.commonService.secretKey);


        console.log(`User Name ${this.UserName}  Role Name ${this.RoleName}`);
      }
    }
  }

  confirmLogout() {
    this.commonService
      .showConfirmationDialog({
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        confirmText: 'Yes',
        cancelText: 'No',
      })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.logout();
        } else {
          this.router.navigate(['/dashboard']);
        }
      });
  }

  logout() {
    this.authService.authApiCall(API_ENDPOINTS.SERVICE_LOG_OUT, {}).subscribe({
      next: (res: any) => {
        this.checkOutEmployeeAttendence();
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.clear();
        localStorage.clear();
        this.commonService.openSnackbar(res.message, 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.commonService.openSnackbar(error.error.message, 'error');
      },
    });
  }

  checkOutEmployeeAttendence() {
    const paylaod = {
      email: this.UserEmail ? this.UserEmail : '',
    }

    this.apiService.postApiCall(API_ENDPOINTS.SERVICE_CHECK_OUT_ATTENDENCE, paylaod).subscribe({
      next: (res: any) => {
        console.log(`${API_ENDPOINTS.SERVICE_SAVE_NEW_USER} Response : `, res);
        
        this.commonService.openSnackbar(res.message, 'success');
        // setTimeout(() => {
        //   this.logout();
        // }, 3000);
      },
      error: (error) => {
        this.commonService.openSnackbar(error.error.message, 'error');
      },
    });
  }
}
