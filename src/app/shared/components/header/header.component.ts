import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationBadgeComponent } from '../notification-badge/notification-badge.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, NotificationBadgeComponent],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    @Input() title: string = 'NPA Recovery';
    @Input() notificationCount: number = 0;
    @Input() userName: string = 'User';
    @Input() userRole: string = 'Role';

    @Output() toggleSidebar = new EventEmitter<void>();
    @Output() logout = new EventEmitter<void>();

    onToggleSidebar() {
        this.toggleSidebar.emit();
    }

    onLogout() {
        this.logout.emit();
    }
}
