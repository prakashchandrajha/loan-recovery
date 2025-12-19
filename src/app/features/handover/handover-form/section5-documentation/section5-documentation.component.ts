import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section5-documentation',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div [formGroup]="section5" class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900 border-b pb-2">5. Documentation</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Documents Status</label>
            <select formControlName="docStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2">
                <option value="">Select Status</option>
                <option value="Complete">Complete</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Deferred">Deferred</option>
            </select>
        </div>
      </div>
    </div>
  `
})
export class Section5DocumentationComponent {
    @Input() parentForm!: FormGroup;
    get section5(): FormGroup { return this.parentForm.get('section5') as FormGroup; }
}
