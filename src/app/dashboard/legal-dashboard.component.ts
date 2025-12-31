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
  vettedFileName: string = '';
  isUploadMode: boolean = false;
  isEditRemarksMode: boolean = false;
  isSendBackMode: boolean = false;

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
    this.vettedFileName = entry.vettedFileName || '';
    this.isSendBackMode = true;
    this.isEditRemarksMode = false;
    this.isUploadMode = false;
  }

  closeModal() {
    this.selectedEntry = null;
    this.remarks = '';
    this.file13bName = '';
    this.vettedFileName = '';
    this.isUploadMode = false;
    this.isEditRemarksMode = false;
    this.isSendBackMode = false;
  }

  updateEntry() {
    if (this.selectedEntry) {
      this.selectedEntry.remarks = this.remarks;
      this.selectedEntry.file13bName = this.file13bName;
      if (this.vettedFileName) {
        this.selectedEntry.vettedFileName = this.vettedFileName;
      }
      this.selectedEntry.file13bUploadDate = new Date();
      this.loanService.updateEntry(this.selectedEntry);
      this.closeModal();
    }
  }

  isSaleNotice(entry: PostEntry): boolean {
    return !!entry.saleNoticeFileName;
  }

  sendBackToRecovery() {
    if (this.selectedEntry) {
      // Require Vetted File ONLY for Sale Notices
      if (this.isSaleNotice(this.selectedEntry) && !this.vettedFileName) {
        alert('Please upload the Vetted File before returning to Recovery.');
        return;
      }

      if (this.isSaleNotice(this.selectedEntry)) {
        // Auction Stage Return
        if (confirm('Return vetted Sale Notice to Recovery Cell?')) {
          this.loanService.returnSaleNoticeToRecovery(
            this.selectedEntry.id,
            this.vettedFileName,
            this.remarks
          );
          this.closeModal();
        }
      } else {
        // Standard 13(2) / 13(4) Return
        if (confirm('Send this file back to Recovery Division?')) {
          this.loanService.moveBackToRecovery(this.selectedEntry.id, this.remarks, this.vettedFileName);
          this.closeModal();
        }
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vettedFileName = file.name;
    }
  }

  // Helper methods for deadline tracking
  isOverdue(entry: PostEntry): boolean {
    if (!entry.legalDeadline) return false;
    const now = new Date();
    const deadline = new Date(entry.legalDeadline);
    return now > deadline;
  }

  getFormType(entry: PostEntry): string {
    return entry.sectionType;
  }

  getDaysOverdue(entry: PostEntry): number {
    if (!entry.legalDeadline) return 0;
    const now = new Date();
    const deadline = new Date(entry.legalDeadline);
    const diffTime = now.getTime() - deadline.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getLegalDeadlineDays(entry: PostEntry): number {
    return entry.sectionType === '13(2)' ? 7 : 15;
  }

  getDaysRemaining(entry: PostEntry): number {
    if (!entry.legalDeadline) return 0;
    const now = new Date();
    const deadline = new Date(entry.legalDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
