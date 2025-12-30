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
  valuationAmount: number = 0;
  roValuationFileName: string = '';
  isNoticeMode: boolean = false;
  isValuationMode: boolean = false;

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.regionalEntries = entries.filter(e => e.currentLocation === 'RegionalOffice1');
    });
  }

  noticeToBorrower(entry: PostEntry) {
    this.selectedEntry = entry;
    this.remarks = entry.remarks || '';
    this.isNoticeMode = true;
  }

  closeModal() {
    this.selectedEntry = null;
    this.remarks = '';
    this.valuationAmount = 0;
    this.roValuationFileName = '';
    this.isNoticeMode = false;
    this.isValuationMode = false;
  }

  openValuationForm(entry: PostEntry) {
    this.selectedEntry = entry;
    this.valuationAmount = entry.valuationAmount || 0;
    this.roValuationFileName = entry.roValuationFileName || '';
    this.remarks = entry.remarks || '';
    this.isValuationMode = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.roValuationFileName = file.name;
    }
  }

  sendNotice() {
    if (this.selectedEntry) {
      if (confirm('Reclarification: Are you sure to send notice to borrower?')) {
        this.loanService.moveBackToRecoveryFromRO(this.selectedEntry.id, this.remarks);
        this.closeModal();
      }
    }
  }

  sendToDivision() {
    if (this.selectedEntry && this.valuationAmount > 0 && this.roValuationFileName) {
      if (confirm(`Send file back to ${this.selectedEntry.divisionId} with valuation amount ₹${this.valuationAmount.toLocaleString('en-IN')}?`)) {
        this.loanService.moveToDivisionFromRO(
          this.selectedEntry.id,
          this.valuationAmount,
          this.roValuationFileName,
          this.remarks
        );
        this.closeModal();
      }
    } else {
      alert('Please enter valuation amount and upload RO valuation file');
    }
  }

  // Check if file is in 13(4) stage (second visit to RO)
  isSecondVisit(entry: PostEntry): boolean {
    const roVisits = entry.history.filter(log =>
      log.location === 'RegionalOffice1' ||
      log.location === 'RegionalOffice2' ||
      log.location === 'RODivision'
    );
    return roVisits.length > 1;
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