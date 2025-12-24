import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanService, PostEntry } from './loan.service';

@Component({
  selector: 'app-legal-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-dashboard.component.html'
})
export class LegalDashboardComponent implements OnInit {
  legalEntries: PostEntry[] = [];

  constructor(private loanService: LoanService) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      this.legalEntries = entries.filter(e => e.currentLocation === 'Legal');
    });
  }
}
