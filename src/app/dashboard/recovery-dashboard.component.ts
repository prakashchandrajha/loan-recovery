import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService, PostEntry } from './loan.service';

@Component({
  selector: 'app-recovery-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recovery-dashboard.component.html'
})
export class RecoveryDashboardComponent implements OnInit {
  recoveryEntries: PostEntry[] = [];

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.recoveryEntries = entries.filter(e => e.currentLocation === 'Recovery');
    });
  }
}
