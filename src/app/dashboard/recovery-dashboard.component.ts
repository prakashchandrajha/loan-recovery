import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, PostEntry } from './loan.service';

@Component({
  selector: 'app-recovery-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recovery-dashboard.component.html'
})
export class RecoveryDashboardComponent implements OnInit {
  divisionEntries: PostEntry[] = [];
  legalEntries: PostEntry[] = [];
  selectedEntry: PostEntry | null = null;
  remarks: string = '';
  file13bName: string = '';
  isEditMode: boolean = false;
  isUploadMode: boolean = false;
  isEditRemarksMode: boolean = false;
  activeTab: 'division' | 'legal' = 'division';

  constructor(private loanService: LoanService) { }

  get activeEntries(): PostEntry[] {
    return this.activeTab === 'division' ? this.divisionEntries : this.legalEntries;
  }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.divisionEntries = entries.filter(e => e.currentLocation === 'Recovery' && e.history.some(log => log.location === 'Division') && !e.history.some(log => log.location === 'Legal'));
      this.legalEntries = entries.filter(e => e.currentLocation === 'Recovery' && e.history.some(log => log.location === 'Legal'));
    });
  }

  uploadEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.file13bName = entry.file13bName || '';
    this.remarks = entry.remarks || '';
    this.isUploadMode = true;
    this.isEditRemarksMode = false;
    this.isEditMode = false;
  }

  editRemarksEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.file13bName = entry.file13bName || '';
    this.remarks = entry.remarks || '';
    this.isEditRemarksMode = true;
    this.isUploadMode = false;
    this.isEditMode = false;
  }

  forwardEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.remarks = entry.remarks || '';
    this.file13bName = entry.file13bName || '';
    this.isEditMode = false;
    this.isUploadMode = false;
    this.isEditRemarksMode = false;
  }

  closeModal() {
    this.selectedEntry = null;
    this.remarks = '';
    this.file13bName = '';
    this.isEditMode = false;
    this.isUploadMode = false;
    this.isEditRemarksMode = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file13bName = file.name;
    }
  }

  updateEntry() {
    if (this.selectedEntry) {
      this.selectedEntry.remarks = this.remarks;
      this.selectedEntry.file13bName = this.file13bName;
      this.selectedEntry.file13bUploadDate = new Date();
      this.loanService.updateEntry(this.selectedEntry);
      this.closeModal();
    }
  }

  sendToLegal() {
    if (this.selectedEntry && this.file13bName) {
      if (confirm('Send this file to Legal Cell with 13b form?')) {
        this.loanService.moveToLegal(this.selectedEntry.id, this.remarks, this.file13bName);
        this.closeModal();
      }
    } else {
      alert('Please upload 13b form before sending to Legal Cell');
    }
  }

  // Helper methods for deadline tracking
  isOverdue(entry: PostEntry): boolean {
    if (!entry.recoveryDeadline) return false;
    const now = new Date();
    const deadline = new Date(entry.recoveryDeadline);
    return now > deadline;
  }

  getDaysOverdue(entry: PostEntry): number {
    if (!entry.recoveryDeadline) return 0;
    const now = new Date();
    const deadline = new Date(entry.recoveryDeadline);
    const diffTime = now.getTime() - deadline.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
