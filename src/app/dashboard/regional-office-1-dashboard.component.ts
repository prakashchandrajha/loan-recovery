import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, PostEntry } from './loan.service';

@Component({
  selector: 'app-regional-office-1-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regional-office-1-dashboard.component.html'
})
export class RegionalOffice1DashboardComponent implements OnInit {
  regionalEntries: PostEntry[] = [];
  selectedEntry: PostEntry | null = null;
  remarks: string = '';
  file13bName: string = '';
  isUploadMode: boolean = false;
  isEditRemarksMode: boolean = false;

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.regionalEntries = entries.filter(e => e.history.some(log => log.location === 'RegionalOffice1'));
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.file13bName = file.name;
    }
  }

  // Helper methods for deadline tracking
  isOverdue(entry: PostEntry): boolean {
    if (!entry.regionalDeadline) return false;
    const now = new Date();
    const deadline = new Date(entry.regionalDeadline);
    return now > deadline;
  }

  getDaysOverdue(entry: PostEntry): number {
    if (!entry.regionalDeadline) return 0;
    const now = new Date();
    const deadline = new Date(entry.regionalDeadline);
    const diffTime = now.getTime() - deadline.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}