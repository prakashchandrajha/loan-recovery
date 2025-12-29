import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, PostEntry } from './loan.service';

@Component({
  selector: 'app-regional-office-2-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regional-office-2-dashboard.component.html'
})
export class RegionalOffice2DashboardComponent implements OnInit {
  regionalEntries: PostEntry[] = [];
  selectedEntry: PostEntry | null = null;
  remarks: string = '';
  isNoticeMode: boolean = false;

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.regionalEntries = entries.filter(e => e.currentLocation === 'RegionalOffice2');
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
    this.isNoticeMode = false;
  }

  sendNotice() {
    if (this.selectedEntry) {
      if (confirm('Reclarification: Are you sure to send notice to borrower?')) {
        this.loanService.moveBackToRecoveryFromRO(this.selectedEntry.id, this.remarks);
        this.closeModal();
      }
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