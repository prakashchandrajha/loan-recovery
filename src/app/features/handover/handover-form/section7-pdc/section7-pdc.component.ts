import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section7-pdc',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section7" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">7. Post Dated Cheques (PDC)</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">PDC Count</label>
          <input type="number" formControlName="pdcCount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
        </div>
         <div>
          <label class="block text-sm font-medium text-gray-700">Total PDC Amount</label>
          <input type="number" formControlName="pdcAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
        </div>
      </div>
    </div>
  `
})
export class Section7PdcComponent {
    @Input() parentForm!: FormGroup;
    get section7(): FormGroup { return this.parentForm.get('section7') as FormGroup; }
}
