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
    mobileNumber: '',
    status: 'Pending',
    date: new Date()
  };

  entries: any[] = [];
  editingIndex: number | null = null;

  switchView(view: 'form' | 'list') {
    this.currentView = view;
    if (view === 'form' && this.editingIndex === null) {
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.formData.fullName && this.formData.mobileNumber) {
      if (this.editingIndex !== null) {
        // Update existing
        this.entries[this.editingIndex] = { ...this.formData };
        this.editingIndex = null;
      } else {
        // Create new
        this.entries.push({
          ...this.formData,
          status: 'Pending',
          date: new Date()
        });
      }
      this.resetForm();
      this.currentView = 'list';
    }
  }

  editEntry(index: number) {
    this.editingIndex = index;
    this.formData = { ...this.entries[index] };
    this.currentView = 'form';
  }

  deleteEntry(index: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entries.splice(index, 1);
    }
  }

  markUrgent(index: number) {
    if (confirm('Mark this entry as Urgent and send immediately?')) {
      this.entries[index].status = 'Urgent';
      alert('Entry marked as Urgent and sent to Recovery Division.');
    }
  }

  resetForm() {
    this.formData = { fullName: '', mobileNumber: '', status: 'Pending', date: new Date() };
    this.editingIndex = null;
  }
}
