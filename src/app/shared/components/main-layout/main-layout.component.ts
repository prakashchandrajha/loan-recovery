import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
    isSidebarOpen = false;
    userRole: string = 'Guest';
    userName: string = 'Guest User';
    notificationCount = 3; // Mock count

    constructor(private router: Router) { }

    ngOnInit(): void {
        // In a real app, this would come from AuthService
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');

        if (role) this.userRole = role;
        if (name) this.userName = name;

        // Optional: Redirect if no role found (not authenticated)
        if (!role) {
            // console.warn('No user role found, redirecting to login');
            // this.router.navigate(['/login']);
        }
    }

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    closeSidebar() {
        this.isSidebarOpen = false;
    }

    logout() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        this.router.navigate(['/login']);
    }
}
