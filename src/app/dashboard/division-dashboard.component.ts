import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService, PostEntry } from './loan.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-division-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './division-dashboard.component.html'
})
export class DivisionDashboardComponent implements OnInit {
  currentView: 'form' | 'list' = 'form';

  formData = {
    fullName: '',
    mobileNumber: ''
  };

  entries: PostEntry[] = [];
  editingEntryId: string | null = null;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      // Filter entries to show only those belonging to current division
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.entries = entries.filter(e => e.divisionId === currentUser.username);
      }
    });
  }

  switchView(view: 'form' | 'list') {
    this.currentView = view;
    if (view === 'form' && !this.editingEntryId) {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.formData.fullName && this.formData.mobileNumber) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      if (this.editingEntryId) {
        // Find and update
        const entry = this.entries.find(e => e.id === this.editingEntryId);
        if (entry) {
          entry.fullName = this.formData.fullName;
          entry.mobileNumber = this.formData.mobileNumber;
          // Ideally call service.updateEntry(entry) to notify others, though object ref works locally
          this.loanService.updateEntry(entry);
        }
      } else {
        // Create new
        this.loanService.addEntry({
          divisionId: currentUser.username, // Set to current user's division (div1, div2, etc.)
          fullName: this.formData.fullName,
          mobileNumber: this.formData.mobileNumber,
          status: 'Pending',
          currentLocation: 'Division'
        });
      }
      this.resetForm();
      this.currentView = 'list';
    }
  }

  editEntry(entry: PostEntry) {
    this.editingEntryId = entry.id;
    this.formData = {
      fullName: entry.fullName,
      mobileNumber: entry.mobileNumber
    };
    this.currentView = 'form';
  }

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this file permanently?')) {
      this.loanService.deleteEntry(id);
    }
  }

  markUrgent(id: string) {
    if (confirm('Log urgency and forward to Recovery immediately?')) {
      this.loanService.moveToRecovery(id, true);
      // Entry removes itself from view due to filter
    }
  }

  resetForm() {
    this.formData = { fullName: '', mobileNumber: '' };
    this.editingEntryId = null;
  }
}
