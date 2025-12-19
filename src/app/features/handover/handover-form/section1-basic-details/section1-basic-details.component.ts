import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-section1-basic-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './section1-basic-details.component.html',
    styleUrls: ['./section1-basic-details.component.css']
})
export class Section1BasicDetailsComponent {
    @Input() parentForm!: FormGroup;

    get section1(): FormGroup {
        return this.parentForm.get('section1') as FormGroup;
    }
}
