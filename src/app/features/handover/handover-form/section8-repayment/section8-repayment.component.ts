import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section8-repayment',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section8" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">8. Repayment History</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Payment Date</label>
        <input type="date" formControlName="lastPaymentDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
      </div>
    </div>
  `
})
export class Section8RepaymentComponent {
    @Input() parentForm!: FormGroup;
    get section8(): FormGroup { return this.parentForm.get('section8') as FormGroup; }
}
