import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section3-security',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section3" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">3. Security Details</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Security Description</label>
        <textarea formControlName="securityDescription" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"></textarea>
      </div>
    </div>
  `
})
export class Section3SecurityComponent {
    @Input() parentForm!: FormGroup;
    get section3(): FormGroup { return this.parentForm.get('section3') as FormGroup; }
}
