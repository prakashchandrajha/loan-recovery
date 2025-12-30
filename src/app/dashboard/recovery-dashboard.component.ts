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
  roEntries: PostEntry[] = [];
  selectedEntry: PostEntry | null = null;
  remarks: string = '';
  file13bName: string = '';
  isEditMode: boolean = false;
  isUploadMode: boolean = false;
  isEditRemarksMode: boolean = false;
  activeTab: 'division' | 'legal' | 'ro' = 'division';
  isSendToRO: boolean = false;
  selectedRegionalOffice: string = 'RegionalOffice1';

  constructor(private loanService: LoanService) { }

  get activeEntries(): PostEntry[] {
    switch (this.activeTab) {
      case 'division': return this.divisionEntries;
      case 'legal': return this.legalEntries;
      case 'ro': return this.roEntries;
      default: return this.divisionEntries;
    }
  }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      // Filter entries based on where they came from (last location before Recovery)
      this.divisionEntries = entries.filter(e => {
        if (e.currentLocation !== 'Recovery') return false;
        // Get the last non-Recovery location from history
        const lastNonRecoveryLog = [...e.history].reverse().find(log => log.location !== 'Recovery');
        return lastNonRecoveryLog?.location === 'Division';
      });

      this.legalEntries = entries.filter(e => {
        if (e.currentLocation !== 'Recovery') return false;
        // Get the last non-Recovery location from history
        const lastNonRecoveryLog = [...e.history].reverse().find(log => log.location !== 'Recovery');
        return lastNonRecoveryLog?.location === 'Legal';
      });

      this.roEntries = entries.filter(e => {
        if (e.currentLocation !== 'Recovery') return false;
        // Get the last non-Recovery location from history
        const lastNonRecoveryLog = [...e.history].reverse().find(log => log.location !== 'Recovery');
        return lastNonRecoveryLog?.location === 'RODivision' ||
          lastNonRecoveryLog?.location === 'RegionalOffice1' ||
          lastNonRecoveryLog?.location === 'RegionalOffice2';
      });
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
    this.isSendToRO = this.activeTab === 'legal';
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

  // Auction Stage
  draftNoticeFileName: string = '';
  isSaleNoticeMode: boolean = false;

  isAuctionMode(entry: PostEntry): boolean {
    return !!entry.minutesFileName && !!entry.reservePrice && entry.currentLocation === 'Recovery';
  }

  onDraftNoticeSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.draftNoticeFileName = file.name;
    }
  }

  openSaleNoticeModal(entry: PostEntry) {
    this.selectedEntry = entry;
    this.isSaleNoticeMode = true;
    this.draftNoticeFileName = '';
    this.remarks = '';
  }

  closeModal() {
    this.selectedEntry = null;
    this.remarks = '';
    this.file13bName = '';
    this.isEditMode = false;
    this.isUploadMode = false;
    this.isEditRemarksMode = false;
    this.isSendToRO = false;
    this.isSaleNoticeMode = false;
    this.draftNoticeFileName = '';
    this.selectedRegionalOffice = 'RegionalOffice1';
  }

  sendSaleNoticeToLegal() {
    if (this.selectedEntry && this.draftNoticeFileName) {
      if (confirm('Send Draft Sale Notice to Legal Cell for vetting?')) {
        this.loanService.sendSaleNoticeToLegal(
          this.selectedEntry.id,
          this.draftNoticeFileName,
          this.remarks
        );
        this.closeModal();
      }
    } else {
      alert('Please upload Draft Sale Notice document');
    }
  }

  // Original sendToLegal (for 13(2) and 13(4))
  sendToLegal() {
    if (this.selectedEntry && this.file13bName) {
      if (confirm('Send this file to Legal Cell with form?')) {
        // ... (rest of logic)
        const hasBeenToRO = this.selectedEntry.history.some(log =>
          log.location === 'RODivision' ||
          log.location === 'RegionalOffice1' ||
          log.location === 'RegionalOffice2'
        );

        // If file has been to RO, this is 13(4) stage, update sectionType
        if (hasBeenToRO && this.selectedEntry.sectionType === '13(2)') {
          this.selectedEntry.sectionType = '13(4)';
        }

        this.loanService.moveToLegal(this.selectedEntry.id, this.remarks, this.file13bName);
        this.closeModal();
      }
    } else {
      alert('Please upload form before sending to Legal Cell');
    }
  }

  sendToRegional() {
    if (this.selectedEntry) {
      if (confirm('Send this file to Regional Office?')) {
        this.loanService.moveToRegional(this.selectedEntry.id, this.selectedRegionalOffice, this.remarks);
        this.closeModal();
      }
    }
  }

  sendToRODivision() {
    if (this.selectedEntry) {
      if (confirm('Send this file to RO Division for notice issuance?')) {
        this.loanService.moveToRODivision(this.selectedEntry.id, this.remarks);
        this.closeModal();
      }
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

  getDeadlineDays(entry: PostEntry): number {
    return entry.sectionType === '13(2)' ? 27 : 75;
  }

  getDaysRemaining(entry: PostEntry): number {
    if (!entry.recoveryDeadline) return 0;
    const now = new Date();
    const deadline = new Date(entry.recoveryDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
