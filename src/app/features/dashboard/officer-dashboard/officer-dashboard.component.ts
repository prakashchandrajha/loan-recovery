import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData } from '../dashboard.service';

@Component({
    selector: 'app-officer-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './officer-dashboard.component.html',
    styleUrls: ['./officer-dashboard.component.css']
})
export class OfficerDashboardComponent implements OnInit {
    data: DashboardData | null = null;
    loading = true;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getDashboardData('Officer').subscribe(data => {
            this.data = data;
            this.loading = false;
        });
    }
}
