import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section11-sarfaesi',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section11" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">11. SARFAESI Actions</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Pending Actions</label>
        <input type="text" formControlName="sarfaesiAction" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
      </div>
    </div>
  `
})
export class Section11SarfaesiComponent {
    @Input() parentForm!: FormGroup;
    get section11(): FormGroup { return this.parentForm.get('section11') as FormGroup; }
}
