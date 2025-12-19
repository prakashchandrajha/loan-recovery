import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData } from '../dashboard.service';

@Component({
    selector: 'app-recovery-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './recovery-dashboard.component.html',
    styleUrls: ['./recovery-dashboard.component.css']
})
export class RecoveryDashboardComponent implements OnInit {
    data: DashboardData | null = null;
    loading = true;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getDashboardData('Recovery').subscribe(data => {
            this.data = data;
            this.loading = false;
        });
    }
}
