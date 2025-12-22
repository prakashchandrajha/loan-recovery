import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-division-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './division-dashboard.component.html'
})
export class DivisionDashboardComponent {
  currentView: 'form' | 'list' = 'form';

  formData = {
    fullName: '',
    mobileNumber: ''
  };

  entries: any[] = [];

  switchView(view: 'form' | 'list') {
    this.currentView = view;
  }

  onSubmit() {
    if (this.formData.fullName && this.formData.mobileNumber) {
      this.entries.push({ ...this.formData });
      this.formData = { fullName: '', mobileNumber: '' }; // Reset form
      this.currentView = 'list'; // Switch to list view
    }
  }
}
