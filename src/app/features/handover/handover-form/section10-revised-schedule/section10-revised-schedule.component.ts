import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section10-revised-schedule',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section10" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">10. Revised Payment Schedule</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Schedule Details</label>
        <textarea formControlName="scheduleDetails" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"></textarea>
      </div>
    </div>
  `
})
export class Section10RevisedScheduleComponent {
    @Input() parentForm!: FormGroup;
    get section10(): FormGroup { return this.parentForm.get('section10') as FormGroup; }
}
