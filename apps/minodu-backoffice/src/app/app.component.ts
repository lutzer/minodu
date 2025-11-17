import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { MenuService } from './_helpers/menu.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'minodu-backoffice';
  activeMenu: any;

  constructor(private menuService: MenuService, private router: Router, private activatedRoute: ActivatedRoute) {}
    
    ngOnInit(): void {
      this.menuService.activeMenu$.subscribe((activeMenu) => {
        this.activeMenu = activeMenu;
      });
  
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const route = this.activatedRoute.firstChild;
          this.menuService.setActiveMenu(route?.snapshot.data?.['activeMenu']);
        }
      });
    }

}
