import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section6-release',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section6" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">6. Release Details</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Release Status</label>
        <input type="text" formControlName="releaseStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
      </div>
    </div>
  `
})
export class Section6ReleaseComponent {
    @Input() parentForm!: FormGroup;
    get section6(): FormGroup { return this.parentForm.get('section6') as FormGroup; }
}
