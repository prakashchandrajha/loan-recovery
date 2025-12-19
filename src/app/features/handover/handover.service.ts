import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HandoverService {
    private readonly STORAGE_KEY = 'handover_draft';
    private formDataSubject = new BehaviorSubject<any>(this.loadDraft());

    formData$ = this.formDataSubject.asObservable();

    constructor() {
        // Auto-save subscription
        this.formData$.pipe(
            debounceTime(1000) // Debounce for 1 second
        ).subscribe(data => {
            this.saveDraft(data);
        });
    }

    updateForm(data: any) {
        this.formDataSubject.next(data);
    }

    private saveDraft(data: any) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        console.log('Draft saved to localStorage');
    }

    private loadDraft(): any {
        const draft = localStorage.getItem(this.STORAGE_KEY);
        return draft ? JSON.parse(draft) : {};
    }

    clearDraft() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.formDataSubject.next({});
    }

    submitHandover(data: any) {
        console.log('Submitting handover data:', data);
        // Simulate API call
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
}
