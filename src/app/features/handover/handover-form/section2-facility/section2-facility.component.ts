import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section2-facility',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section2" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">2. Facility Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Facility Type</label>
          <input type="text" formControlName="facilityType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
        </div>
        <div>
           <label class="block text-sm font-medium text-gray-700">Sanctioned Amount</label>
           <input type="number" formControlName="sanctionedAmount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
        </div>
      </div>
    </div>
  `
})
export class Section2FacilityComponent {
    @Input() parentForm!: FormGroup;
    get section2(): FormGroup { return this.parentForm.get('section2') as FormGroup; }
}
