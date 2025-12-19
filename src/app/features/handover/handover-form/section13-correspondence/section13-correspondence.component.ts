import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section13-correspondence',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section13" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">13. Correspondence History</h3>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Communication</label>
        <textarea formControlName="lastCommunication" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"></textarea>
      </div>
    </div>
  `
})
export class Section13CorrespondenceComponent {
    @Input() parentForm!: FormGroup;
    get section13(): FormGroup { return this.parentForm.get('section13') as FormGroup; }
}
