import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LocationLog {
    location: 'Division' | 'Recovery' | 'Legal' | 'RegionalOffice1' | 'RegionalOffice2' | 'RODivision';
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
    sectionType: '13(2)' | '13(4)'; // Section type for the notice
    deadlineDate: Date; // 3 days deadline from NPA date
    recoveryDeadline?: Date; // 27 or 75 days deadline for Recovery processing based on section type
    legalDeadline?: Date; // 7 or 15 days deadline for Legal vetting based on section type
    roDeadline?: Date; // RO Division deadline
    // Recovery Cell fields
    remarks: string; // Remarks from Recovery cell
    file13bName: string; // 13b form file name
    file13bUploadDate: Date; // Upload date for 13b form
    vettedFileName?: string; // Vetted file name from Legal Cell
    status: 'Pending' | 'Urgent' | 'Late' | 'With Recovery' | 'With Legal' | 'With RO';
    currentLocation: 'Division' | 'Recovery' | 'Legal' | 'RegionalOffice1' | 'RegionalOffice2' | 'RODivision';
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

    addEntry(entry: Omit<PostEntry, 'id' | 'history' | 'deadlineDate' | 'remarks' | 'file13bName' | 'file13bUploadDate' | 'vettedFileName'>) {
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
            // Set deadline for Recovery processing from NPA date based on section type
            // 27 days for Section 13(2), 75 days for Section 13(4)
            entry.recoveryDeadline = new Date(entry.npaDate);
            const daysToAdd = entry.sectionType === '13(2)' ? 27 : 75;
            entry.recoveryDeadline.setDate(entry.recoveryDeadline.getDate() + daysToAdd);
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
            // Set Legal deadline based on section type
            // 7 days for Section 13(2), 15 days for Section 13(4)
            entry.legalDeadline = new Date();
            const daysToAdd = entry.sectionType === '13(2)' ? 7 : 15;
            entry.legalDeadline.setDate(entry.legalDeadline.getDate() + daysToAdd);
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: `${entry.sectionType} Form Uploaded: ${file13bName}. Sent to Legal Cell. Remarks: ${remarks}`
            });
            entry.history.push({
                location: 'Legal',
                timestamp: new Date(),
                action: 'Received from Recovery'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry back from Legal to Recovery
    moveBackToRecovery(id: string, remarks: string, vettedFileName?: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.remarks = remarks;
            if (vettedFileName) {
                entry.vettedFileName = vettedFileName;
            }
            entry.currentLocation = 'Recovery';
            // Set 1 day deadline for Recovery Division to review and forward to RO
            entry.recoveryDeadline = new Date();
            entry.recoveryDeadline.setDate(entry.recoveryDeadline.getDate() + 1);
            entry.history.push({
                location: 'Legal',
                timestamp: new Date(),
                action: `Vetted and sent back to Recovery. ${vettedFileName ? 'Vetted File: ' + vettedFileName + '. ' : ''}Remarks: ${remarks}`
            });
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: 'Received back from Legal Cell'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry back from Regional Office to Recovery
    moveBackToRecoveryFromRO(id: string, remarks: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.remarks = remarks;
            entry.currentLocation = 'Recovery';
            // Set 1 day deadline for Recovery to process
            entry.recoveryDeadline = new Date();
            entry.recoveryDeadline.setDate(entry.recoveryDeadline.getDate() + 1);
            entry.history.push({
                location: entry.currentLocation,
                timestamp: new Date(),
                action: `Notice sent to borrower. Sent back to Recovery. Remarks: ${remarks}`
            });
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: 'Received back from Regional Office'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry from Recovery to RO Division (after Legal vetting)
    moveToRODivision(id: string, remarks?: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.remarks = remarks || '';
            entry.currentLocation = 'RODivision';
            entry.status = 'With RO';
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: `Sent to RO Division for notice issuance. Remarks: ${remarks || 'None'}`
            });
            entry.history.push({
                location: 'RODivision',
                timestamp: new Date(),
                action: 'Received from Recovery Division'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry back from RO Division to Recovery
    moveBackToRecoveryFromRODivision(id: string, remarks: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.remarks = remarks;
            entry.currentLocation = 'Recovery';
            entry.status = 'Pending';
            entry.history.push({
                location: 'RODivision',
                timestamp: new Date(),
                action: `Notice issued to borrower. Sent back to Recovery. Remarks: ${remarks}`
            });
            entry.history.push({
                location: 'Recovery',
                timestamp: new Date(),
                action: 'Received back from RO Division'
            });
            this.entriesSubject.next([...currentEntries]);
        }
    }

    // Send entry from Legal to Regional Office
    moveToRegional(id: string, regionalOffice: string, remarks?: string) {
        const currentEntries = this.entriesSubject.getValue();
        const entry = currentEntries.find(e => e.id === id);
        if (entry) {
            entry.remarks = remarks || '';
            entry.regionalOffice = regionalOffice;
            entry.currentLocation = regionalOffice as 'RegionalOffice1' | 'RegionalOffice2';
            // Set 8 days deadline for Regional processing
            entry.regionalDeadline = new Date();
            entry.regionalDeadline.setDate(entry.regionalDeadline.getDate() + 8);
            entry.history.push({
                location: entry.currentLocation,
                timestamp: new Date(),
                action: `Sent to ${regionalOffice.replace('RegionalOffice', 'Regional Office ')}. Remarks: ${remarks || 'None'}`
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
            } else if (entry.currentLocation === 'Legal' && entry.legalDeadline) {
                const now = new Date();
                const deadline = new Date(entry.legalDeadline);

                // Calculate days late
                const diffTime = now.getTime() - deadline.getTime();
                const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysLate > 0 && entry.status !== 'Late') {
                    entry.status = 'Late';
                    // Add late log
                    entry.history.push({
                        location: 'Legal',
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

