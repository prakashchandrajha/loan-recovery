import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notification-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-badge.component.html',
    styleUrls: ['./notification-badge.component.css']
})
export class NotificationBadgeComponent {
    @Input() count: number = 0;
}
