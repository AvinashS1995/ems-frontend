import { Component } from '@angular/core';
import { HeaderComponent } from '../common/header/header.component';
import { SidenavComponent } from '../common/sidenav/sidenav.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonService } from '../../shared/services/common/common.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidenavComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit() {
    
    this.commonService.userDetails$.subscribe(user => {
  console.log("commonService",user);
});

  }

  navigateToUrl(event:string) {
    this.router.navigateByUrl(event);
  }

}
