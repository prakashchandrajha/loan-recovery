import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section9-restructuring',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section9" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">9. Restructuring Details</h3>
      <div class="flex items-center gap-2">
         <input type="checkbox" formControlName="isRestructured" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
         <label class="block text-sm font-medium text-gray-700">Account Restructured?</label>
      </div>
    </div>
  `
})
export class Section9RestructuringComponent {
    @Input() parentForm!: FormGroup;
    get section9(): FormGroup { return this.parentForm.get('section9') as FormGroup; }
}
