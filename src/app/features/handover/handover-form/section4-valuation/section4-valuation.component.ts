import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section4-valuation',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section4" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">4. Valuation Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Valuation Amount</label>
          <input type="number" formControlName="valuationAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700">Valuation Date</label>
           <input type="date" formControlName="valuationDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
        </div>
      </div>
    </div>
  `
})
export class Section4ValuationComponent {
    @Input() parentForm!: FormGroup;
    get section4(): FormGroup { return this.parentForm.get('section4') as FormGroup; }
}
