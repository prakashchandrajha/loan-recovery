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
  selectedRegionalOffice: string = '';

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.legalEntries = entries.filter(e => e.history.some(log => log.location === 'Legal'));
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

  forwardEntry(entry: PostEntry) {
    this.selectedEntry = entry;
    this.remarks = entry.remarks || '';
    this.file13bName = entry.file13bName || '';
    this.selectedRegionalOffice = '';
    this.isEditRemarksMode = false;
    this.isUploadMode = false;
  }

  closeModal() {
    this.selectedEntry = null;
    this.remarks = '';
    this.file13bName = '';
    this.isUploadMode = false;
    this.isEditRemarksMode = false;
    this.selectedRegionalOffice = '';
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

  sendToRegional() {
    if (this.selectedEntry && this.selectedRegionalOffice) {
      // Assume moveToRegional method exists
      this.loanService.moveToRegional(this.selectedEntry.id, this.selectedRegionalOffice);
      this.closeModal();
    } else {
      alert('Please select a regional office');
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

  getDaysOverdue(entry: PostEntry): number {
    return 0;
  }
}
