import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LocationLog {
    location: 'Division' | 'Recovery' | 'Legal' | 'RegionalOffice1' | 'RegionalOffice2';
    timestamp: Date;
    action: string; // e.g., "Created", "Sent Urgent", "Auto-Forwarded"
    isLate?: boolean; // Flag to indicate if this log shows late status
    daysLate?: number; // Number of days late (1, 2, etc.)
}

export interface PostEntry {
    id: string; // Added ID for easier deletion
    divisionId: string; // Which division created this entry (div1, div2, div3, etc.)
    fullName: string;
    mobileNumber: string;
    npaDate: string; // NPA Date field
    deadlineDate: Date; // 3 days deadline from NPA date
    recoveryDeadline?: Date; // 27 days deadline for Recovery processing
    // Recovery Cell fields
    remarks: string; // Remarks from Recovery cell
    file13bName: string; // 13b form file name
    file13bUploadDate: Date; // Upload date for 13b form
    status: 'Pending' | 'Urgent' | 'Late' | 'With Recovery' | 'With Legal';
    currentLocation: 'Division' | 'Recovery' | 'Legal' | 'RegionalOffice1' | 'RegionalOffice2';
    regionalOffice?: string;
    regionalDeadline?: Date;
    history: LocationLog[];
}

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private entriesSubject = new BehaviorSubject<PostEntry[]>([]);
    entries$ = this.entriesSubject.asObservable();

    addEntry(entry: Omit<PostEntry, 'id' | 'history' | 'deadlineDate' | 'remarks' | 'file13bName' | 'file13bUploadDate'>) {
        // Calculate deadline from NPA date (3 days)
        const npaDate = new Date(entry.npaDate);
        const deadlineDate = new Date(npaDate);
        deadlineDate.setDate(deadlineDate.getDate() + 3); // 3 days deadline from NPA date
        
        const newEntry: PostEntry = {
            ...entry,
            id: this.generateId(),
            deadlineDate,
            remarks: '',
            file13bName: '',
            file13bUploadDate: new Date(),
            history: [{
                location: entry.currentLocation,
                timestamp: new Date(),
                action: 'Entry Created'
            }]
        };

        const currentEntries = this.entriesSubject.getValue();
        this.entriesSubject.next([...currentEntries, newEntry]);
    }

    // Get entries filtered by division
    getEntriesByDivision(divisionId: string) {
        const currentEntries = this.entriesSubject.getValue();
        return currentEntries.filter(e => e.divisionId === divisionId);
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
            // Set 27 days deadline for Recovery processing from NPA date
            entry.recoveryDeadline = new Date(entry.npaDate);
            entry.recoveryDeadline.setDate(entry.recoveryDeadline.getDate() + 27);
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: isUrgent ? 'Urgent Transfer' : 'Standard Transfer'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry from Recovery to Legal
    moveToLegal(id: string, remarks: string, file13bName: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.remarks = remarks;
            entry.file13bName = file13bName;
            entry.file13bUploadDate = new Date();
            entry.status = 'With Legal';
            entry.currentLocation = 'Legal';
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: `13b Form Uploaded: ${file13bName}. Sent to Legal Cell. Remarks: ${remarks}`
            });
            entry.history.push({
                location: 'Legal',
                timestamp: new Date(),
                action: 'Received from Recovery'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry from Legal to Regional Office
    moveToRegional(id: string, regionalOffice: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.regionalOffice = regionalOffice;
            entry.currentLocation = regionalOffice as 'RegionalOffice1' | 'RegionalOffice2';
            // Set 8 days deadline for Regional processing
            entry.regionalDeadline = new Date();
            entry.regionalDeadline.setDate(entry.regionalDeadline.getDate() + 8);
            entry.history.push({
                location: entry.currentLocation,
                timestamp: new Date(),
                action: `Sent to ${regionalOffice.replace('RegionalOffice', 'Regional Office ')}`
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Check and update late status for entries
    checkDeadlines() {
        const currentEntries = this.entriesSubject.getValue();
        let updated = false;

        currentEntries.forEach(entry => {
            if (entry.currentLocation === 'Division') {
                const now = new Date();
                const deadline = new Date(entry.deadlineDate);

                // Calculate days late
                const diffTime = now.getTime() - deadline.getTime();
                const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysLate > 0 && entry.status !== 'Late') {
                    entry.status = 'Late';
                    // Add late log
                    entry.history.push({
                        location: 'Division',
                        timestamp: new Date(),
                        action: `File is late ${daysLate} day${daysLate > 1 ? 's' : ''}`,
                        isLate: true,
                        daysLate: daysLate
                    });
                    updated = true;
                } else if (daysLate > 0 && entry.status === 'Late') {
                    // Update existing late entry with new day count
                    const lastLateLog = entry.history[entry.history.length - 1];
                    if (lastLateLog && lastLateLog.isLate && lastLateLog.daysLate !== daysLate) {
                        lastLateLog.action = `File is late ${daysLate} day${daysLate > 1 ? 's' : ''}`;
                        lastLateLog.daysLate = daysLate;
                        lastLateLog.timestamp = new Date();
                        updated = true;
                    }
                }
            } else if (entry.currentLocation === 'Recovery' && entry.recoveryDeadline) {
                const now = new Date();
                const deadline = new Date(entry.recoveryDeadline);

                // Calculate days late
                const diffTime = now.getTime() - deadline.getTime();
                const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysLate > 0 && entry.status !== 'Late') {
                    entry.status = 'Late';
                    // Add late log
                    entry.history.push({
                        location: 'Recovery',
                        timestamp: new Date(),
                        action: `File is late ${daysLate} day${daysLate > 1 ? 's' : ''}`,
                        isLate: true,
                        daysLate: daysLate
                    });
                    updated = true;
                } else if (daysLate > 0 && entry.status === 'Late') {
                    // Update existing late entry with new day count
                    const lastLateLog = entry.history[entry.history.length - 1];
                    if (lastLateLog && lastLateLog.isLate && lastLateLog.daysLate !== daysLate) {
                        lastLateLog.action = `File is late ${daysLate} day${daysLate > 1 ? 's' : ''}`;
                        lastLateLog.daysLate = daysLate;
                        lastLateLog.timestamp = new Date();
                        updated = true;
                    }
                }
            } else if ((entry.currentLocation === 'RegionalOffice1' || entry.currentLocation === 'RegionalOffice2') && entry.regionalDeadline) {
                const now = new Date();
                const deadline = new Date(entry.regionalDeadline);

                // Calculate days late
                const diffTime = now.getTime() - deadline.getTime();
                const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysLate > 0 && entry.status !== 'Late') {
                    entry.status = 'Late';
                    // Add late log
                    entry.history.push({
                        location: entry.currentLocation,
                        timestamp: new Date(),
                        action: `File is late ${daysLate} day${daysLate > 1 ? 's' : ''}`,
                        isLate: true,
                        daysLate: daysLate
                    });
                    updated = true;
                } else if (daysLate > 0 && entry.status === 'Late') {
                    // Update existing late entry with new day count
                    const lastLateLog = entry.history[entry.history.length - 1];
                    if (lastLateLog && lastLateLog.isLate && lastLateLog.daysLate !== daysLate) {
                        lastLateLog.action = `File is late ${daysLate} day${daysLate > 1 ? 's' : ''}`;
                        lastLateLog.daysLate = daysLate;
                        lastLateLog.timestamp = new Date();
                        updated = true;
                    }
                }
            }
        });

        if (updated) {
            this.entriesSubject.next([...currentEntries]);
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

