import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardData } from '../dashboard.service';

@Component({
    selector: 'app-legal-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './legal-dashboard.component.html',
    styleUrls: ['./legal-dashboard.component.css']
})
export class LegalDashboardComponent implements OnInit {
    data: DashboardData | null = null;
    loading = true;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getDashboardData('Legal').subscribe(data => {
            this.data = data;
            this.loading = false;
        });
    }
}
