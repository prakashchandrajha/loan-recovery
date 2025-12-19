import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface DashboardStats {
    pendingTasks: number;
    overdueItems: number;
    completedTasks: number;
}

export interface Activity {
    id: number;
    description: string;
    time: string;
    type: 'info' | 'warning' | 'error' | 'success';
}

export interface DashboardData {
    role: string;
    stats: DashboardStats;
    activities: Activity[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor() { }

    getDashboardData(role: string): Observable<DashboardData> {
        const data = this.getMockDataForRole(role);
        return of(data).pipe(delay(500)); // Simulate API delay
    }

    private getMockDataForRole(role: string): DashboardData {
        switch (role) {
            case 'Division':
                return {
                    role: 'Division',
                    stats: { pendingTasks: 12, overdueItems: 3, completedTasks: 45 },
                    activities: [
                        { id: 1, description: 'New handover request created', time: '2 hours ago', type: 'info' },
                        { id: 2, description: 'Handover #1234 rejected', time: '5 hours ago', type: 'warning' },
                        { id: 3, description: 'Monthly report generated', time: '1 day ago', type: 'success' }
                    ]
                };
            case 'Recovery':
                return {
                    role: 'Recovery',
                    stats: { pendingTasks: 25, overdueItems: 8, completedTasks: 120 },
                    activities: [
                        { id: 1, description: 'New handover received', time: '30 mins ago', type: 'info' },
                        { id: 2, description: 'Notice issued for Loan #5678', time: '4 hours ago', type: 'success' },
                        { id: 3, description: 'Overdue task: Verify documents', time: '1 day ago', type: 'error' }
                    ]
                };
            case 'Legal':
                return {
                    role: 'Legal',
                    stats: { pendingTasks: 5, overdueItems: 1, completedTasks: 30 },
                    activities: [
                        { id: 1, description: 'Vetting request approved', time: '1 hour ago', type: 'success' },
                        { id: 2, description: 'New generic notice template added', time: '2 days ago', type: 'info' }
                    ]
                };
            case 'Officer':
                return {
                    role: 'Officer',
                    stats: { pendingTasks: 8, overdueItems: 2, completedTasks: 15 },
                    activities: [
                        { id: 1, description: 'Auction scheduled for Property #99', time: '3 hours ago', type: 'warning' },
                        { id: 2, description: 'Valuation report uploaded', time: '6 hours ago', type: 'info' }
                    ]
                };
            case 'Admin':
                return {
                    role: 'Admin',
                    stats: { pendingTasks: 0, overdueItems: 0, completedTasks: 0 },
                    activities: [
                        { id: 1, description: 'System backup completed', time: '1 hour ago', type: 'success' },
                        { id: 2, description: 'New user added', time: '1 day ago', type: 'info' }
                    ]
                };
            default:
                return {
                    role: 'Guest',
                    stats: { pendingTasks: 0, overdueItems: 0, completedTasks: 0 },
                    activities: []
                };
        }
    }
}
