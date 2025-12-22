import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LocationLog {
    location: 'Division' | 'Recovery';
    timestamp: Date;
    action: string; // e.g., "Created", "Sent Urgent", "Auto-Forwarded"
}

export interface PostEntry {
    id: string; // Added ID for easier deletion
    fullName: string;
    mobileNumber: string;
    status: 'Pending' | 'Urgent';
    currentLocation: 'Division' | 'Recovery';
    history: LocationLog[];
}

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private entriesSubject = new BehaviorSubject<PostEntry[]>([]);
    entries$ = this.entriesSubject.asObservable();

    addEntry(entry: Omit<PostEntry, 'id' | 'history'>) {
        const newEntry: PostEntry = {
            ...entry,
            id: this.generateId(),
            history: [{
                location: entry.currentLocation,
                timestamp: new Date(),
                action: 'Entry Created'
            }]
        };

        const currentEntries = this.entriesSubject.getValue();
        this.entriesSubject.next([...currentEntries, newEntry]);
    }

    updateEntry(entry: PostEntry) {
        const currentEntries = this.entriesSubject.getValue();
        const index = currentEntries.findIndex(e => e.id === entry.id);
        if (index !== -1) {
            currentEntries[index] = entry;
            this.entriesSubject.next([...currentEntries]);
        }
    }

    deleteEntry(id: string) {
        const currentEntries = this.entriesSubject.getValue();
        const updatedEntries = currentEntries.filter(e => e.id !== id);
        this.entriesSubject.next(updatedEntries);
    }

    moveToRecovery(id: string, isUrgent: boolean) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.status = isUrgent ? 'Urgent' : 'Pending';
            entry.currentLocation = 'Recovery';
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: isUrgent ? 'Urgent Transfer' : 'Standard Transfer'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
