import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section12-pending-cases',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section12" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">12. Pending Legal Cases</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Case Details</label>
        <textarea formControlName="caseDetails" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"></textarea>
      </div>
    </div>
  `
})
export class Section12PendingCasesComponent {
    @Input() parentForm!: FormGroup;
    get section12(): FormGroup { return this.parentForm.get('section12') as FormGroup; }
}
