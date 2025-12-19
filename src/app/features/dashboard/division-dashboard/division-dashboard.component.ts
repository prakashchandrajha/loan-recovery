import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData } from '../dashboard.service';

@Component({
    selector: 'app-division-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './division-dashboard.component.html',
    styleUrls: ['./division-dashboard.component.css']
})
export class DivisionDashboardComponent implements OnInit {
    data: DashboardData | null = null;
    loading = true;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getDashboardData('Division').subscribe(data => {
            this.data = data;
            this.loading = false;
        });
    }
}
