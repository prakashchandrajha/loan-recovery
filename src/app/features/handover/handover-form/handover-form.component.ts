import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HandoverService } from '../handover.service';
import { Router } from '@angular/router';

import { Section1BasicDetailsComponent } from './section1-basic-details/section1-basic-details.component';
import { Section2FacilityComponent } from './section2-facility/section2-facility.component';
import { Section3SecurityComponent } from './section3-security/section3-security.component';
import { Section4ValuationComponent } from './section4-valuation/section4-valuation.component';
import { Section5DocumentationComponent } from './section5-documentation/section5-documentation.component';
import { Section6ReleaseComponent } from './section6-release/section6-release.component';
import { Section7PdcComponent } from './section7-pdc/section7-pdc.component';
import { Section8RepaymentComponent } from './section8-repayment/section8-repayment.component';
import { Section9RestructuringComponent } from './section9-restructuring/section9-restructuring.component';
import { Section10RevisedScheduleComponent } from './section10-revised-schedule/section10-revised-schedule.component';
import { Section11SarfaesiComponent } from './section11-sarfaesi/section11-sarfaesi.component';
import { Section12PendingCasesComponent } from './section12-pending-cases/section12-pending-cases.component';
import { Section13CorrespondenceComponent } from './section13-correspondence/section13-correspondence.component';
import { Section14RemarksComponent } from './section14-remarks/section14-remarks.component';

@Component({
    selector: 'app-handover-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        Section1BasicDetailsComponent,
        Section2FacilityComponent,
        Section3SecurityComponent,
        Section4ValuationComponent,
        Section5DocumentationComponent,
        Section6ReleaseComponent,
        Section7PdcComponent,
        Section8RepaymentComponent,
        Section9RestructuringComponent,
        Section10RevisedScheduleComponent,
        Section11SarfaesiComponent,
        Section12PendingCasesComponent,
        Section13CorrespondenceComponent,
        Section14RemarksComponent
    ],
    templateUrl: './handover-form.component.html',
    styleUrls: ['./handover-form.component.css']
})
export class HandoverFormComponent implements OnInit {
    currentStep = 1;
    totalSteps = 14;
    handoverForm: FormGroup;

    steps = [
        { number: 1, name: 'Basic Details' },
        { number: 2, name: 'Facility' },
        { number: 3, name: 'Security' },
        { number: 4, name: 'Valuation' },
        { number: 5, name: 'Documentation' },
        { number: 6, name: 'Release' },
        { number: 7, name: 'PDC' },
        { number: 8, name: 'Repayment' },
        { number: 9, name: 'Restructuring' },
        { number: 10, name: 'Revised Schedule' },
        { number: 11, name: 'SARFAESI' },
        { number: 12, name: 'Pending Cases' },
        { number: 13, name: 'Correspondence' },
        { number: 14, name: 'Remarks' }
    ];

    constructor(
        private fb: FormBuilder,
        private handoverService: HandoverService,
        private router: Router
    ) {
        this.handoverForm = this.fb.group({
            section1: this.fb.group({
                borrowerName: ['', Validators.required],
                loanAccountNo: ['', Validators.required],
                branch: ['', Validators.required],
                region: ['']
            }),
            section2: this.fb.group({
                facilityType: [''],
                sanctionedAmount: ['']
            }),
            section3: this.fb.group({
                securityDescription: ['']
            }),
            section4: this.fb.group({
                valuationAmount: [''],
                valuationDate: ['']
            }),
            section5: this.fb.group({
                docStatus: ['']
            }),
            section6: this.fb.group({
                releaseStatus: ['']
            }),
            section7: this.fb.group({
                pdcCount: [''],
                pdcAmount: ['']
            }),
            section8: this.fb.group({
                lastPaymentDate: ['']
            }),
            section9: this.fb.group({
                isRestructured: [false]
            }),
            section10: this.fb.group({
                scheduleDetails: ['']
            }),
            section11: this.fb.group({
                sarfaesiAction: ['']
            }),
            section12: this.fb.group({
                caseDetails: ['']
            }),
            section13: this.fb.group({
                lastCommunication: ['']
            }),
            section14: this.fb.group({
                remarks: ['', Validators.required]
            })
        });
    }

    ngOnInit(): void {
        const draft = localStorage.getItem('handover_draft');
        if (draft) {
            // For simplicity in this demo, we might skip deep patching complex nested forms 
            // unless we ensure structure matches.
            try {
                const parsed = JSON.parse(draft);
                this.handoverForm.patchValue(parsed);
            } catch (e) {
                console.error('Failed to parse draft', e);
            }
        }

        // Subscribe to changes for auto-save
        this.handoverForm.valueChanges.subscribe(val => {
            this.handoverService.updateForm(val);
        });
    }

    next() {
        if (this.currentStep < this.totalSteps) {
            // Optional: specific validator per step
            this.currentStep++;
        }
    }

    previous() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    submit() {
        if (this.handoverForm.valid) {
            this.handoverService.submitHandover(this.handoverForm.value).then(() => {
                alert('Handover submitted successfully!');
                this.handoverService.clearDraft();
                this.router.navigate(['/division-dashboard']);
            });
        } else {
            alert('Please fill all required fields.');
        }
    }

    get currentGroup(): FormGroup {
        return this.handoverForm.get(`section${this.currentStep}`) as FormGroup;
    }
}
