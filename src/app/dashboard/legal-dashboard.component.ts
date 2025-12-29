import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, PostEntry } from './loan.service';

@Component({
  selector: 'app-legal-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './legal-dashboard.component.html'
})
export class LegalDashboardComponent implements OnInit {
  legalEntries: PostEntry[] = [];
  selectedEntry: PostEntry | null = null;
  remarks: string = '';
  file13bName: string = '';
  isUploadMode: boolean = false;
  isEditRemarksMode: boolean = false;

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.legalEntries = entries.filter(e => e.currentLocation === 'Legal');
    });
  }

  uploadEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.file13bName = entry.file13bName || '';
    this.remarks = entry.remarks || '';
    this.isUploadMode = true;
    this.isEditRemarksMode = false;
  }

  editRemarksEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.file13bName = entry.file13bName || '';
    this.remarks = entry.remarks || '';
    this.isEditRemarksMode = true;
    this.isUploadMode = false;
  }

  sendBackEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.remarks = entry.remarks || '';
    this.file13bName = entry.file13bName || '';
    this.isEditRemarksMode = false;
    this.isUploadMode = false;
  }

  closeModal() {
    this.selectedEntry = null;
    this.remarks = '';
    this.file13bName = '';
    this.isUploadMode = false;
    this.isEditRemarksMode = false;
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

  sendBackToRecovery() {
    if (this.selectedEntry) {
      if (confirm('Send this file back to Recovery Cell?')) {
        this.loanService.moveBackToRecovery(this.selectedEntry.id, this.remarks);
        this.closeModal();
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file13bName = file.name;
    }
  }

  // Helper methods for deadline tracking (if needed)
  isOverdue(entry: PostEntry): boolean {
    // Legal may not have deadline, but if added later
    return false;
  }

  getFormType(entry: PostEntry): string {
    return entry.history.some(log => log.location === 'RegionalOffice1' || log.location === 'RegionalOffice2') ? '13(4)' : '13b';
  }

  getDaysOverdue(entry: PostEntry): number {
    return 0;
  }
}
