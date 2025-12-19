import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section14-remarks',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section14" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">14. Final Remarks</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Officer Remarks *</label>
        <textarea formControlName="remarks" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"></textarea>
        <div *ngIf="section14.get('remarks')?.touched && section14.get('remarks')?.invalid" class="text-red-500 text-xs mt-1">
            Remarks are required to submit
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
        <p class="text-sm text-yellow-800">Please review all 14 sections before submitting. The drafting process automatically saves your progress.</p>
      </div>
    </div>
  `
})
export class Section14RemarksComponent {
    @Input() parentForm!: FormGroup;
    get section14(): FormGroup { return this.parentForm.get('section14') as FormGroup; }
}
