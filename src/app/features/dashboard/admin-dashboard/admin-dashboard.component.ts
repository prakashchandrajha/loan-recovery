import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData } from '../dashboard.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    data: DashboardData | null = null;
    loading = true;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getDashboardData('Admin').subscribe(data => {
            this.data = data;
            this.loading = false;
        });
    }
}
