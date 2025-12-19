import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
    label: string;
    link: string;
    icon: string;
    roles: string[];
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnChanges {
    @Input() userRole: string = '';
    @Input() isOpen: boolean = false;

    menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            link: '/dashboard',
            icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
            roles: ['Division', 'Recovery', 'Legal', 'Officer', 'Admin']
        },
        {
            label: 'Create Handover',
            link: '/create-handover',
            icon: 'M12 4v16m8-8H4',
            roles: ['Division']
        },
        {
            label: 'My Handovers',
            link: '/my-handovers',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
            roles: ['Division']
        },
        {
            label: 'Handover Inbox',
            link: '/handover-inbox',
            icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
            roles: ['Recovery']
        },
        {
            label: 'Notices',
            link: '/notices',
            icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
            roles: ['Recovery']
        },
        {
            label: 'Timeline',
            link: '/timeline',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            roles: ['Recovery']
        },
        {
            label: 'Vetting Queue',
            link: '/vetting-queue',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            roles: ['Legal']
        },
        {
            label: 'Issue Notices',
            link: '/issue-notices',
            icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
            roles: ['Officer']
        },
        {
            label: 'Auctions',
            link: '/auctions',
            icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
            roles: ['Officer']
        },
        {
            label: 'Valuations',
            link: '/valuations',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            roles: ['Officer']
        },
        {
            label: 'Settings',
            link: '/settings',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            roles: ['Admin']
        },
    ];

    filteredMenuItems: MenuItem[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userRole']) {
            this.updateDashboardLink();
            this.filterMenu();
        }
    }

    updateDashboardLink() {
        const dashboardItem = this.menuItems.find(item => item.label === 'Dashboard');
        if (dashboardItem) {
            switch (this.userRole) {
                case 'Division':
                    dashboardItem.link = '/division-dashboard';
                    break;
                case 'Recovery':
                    dashboardItem.link = '/recovery-dashboard';
                    break;
                case 'Legal':
                    dashboardItem.link = '/legal-dashboard';
                    break;
                case 'Officer':
                    dashboardItem.link = '/officer-dashboard';
                    break;
                case 'Admin':
                    dashboardItem.link = '/admin-dashboard';
                    break;
                default:
                    dashboardItem.link = '/dashboard';
            }
        }
    }

    filterMenu() {
        this.filteredMenuItems = this.menuItems.filter(item =>
            item.roles.includes(this.userRole)
        );
    }
}
