import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LoanService, PostEntry, HandoverDetails,
  DirectorDetails, FacilityDetails, SecurityDetails,
  ValuationDetails, DocDetails, ReleaseDetails,
  RepaymentSchedule, LegalCaseDetails, CorrespondenceDetails
} from './loan.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-division-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './division-dashboard.component.html'
})
export class DivisionDashboardComponent implements OnInit {
  currentView: 'form' | 'list' = 'list';
  isHandoverMode: boolean = false;
  activeSection: number = 1; // 1 to 14

  // Handover Form Data
  handoverData: HandoverDetails = this.getEmptyHandoverData();

  entries: PostEntry[] = [];
  selectedEntryForHandover: PostEntry | null = null;

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loanService.entries$.subscribe(entries => {
      // Filter entries to show only those belonging to current division
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.entries = entries.filter(e => e.divisionId === currentUser.username);
      }
      // Check deadlines for all entries
      this.loanService.checkDeadlines();
    });
  }

  getEmptyHandoverData(): HandoverDetails {
    return {
      basicDetails: {
        borrwerName: '',
        mobileNumber: '',
        classificationDate: '',
        businessActivity: '',
        directors: [],
        registeredAddress: '',
        corporateAddress: '',
        factoryAddress: '',
        isFactoryRunning: '',
        isFactoryLeased: ''
      },
      facilities: [],
      securities: [],
      valuations: [],
      loanDocuments: [],
      releases: [],
      pdcDetails: {
        isAvailable: '',
        numberAvailable: 0,
        isPresented: ''
      },
      originalRepaymentSchedule: [],
      restructuring: {
        isDone: ''
      },
      revisedRepaymentSchedule: [],
      sarfaesiAction: {
        date132: '',
        date133Reply: '',
        date134: '',
        saleNoticeDate: '',
        auctionDetails: ''
      },
      legalCases: [],
      correspondences: [],
      otherRemarks: ''
    };
  }

  // OLD switching logic - redirected
  switchView(view: 'form' | 'list') {
    if (view === 'form') {
      this.startCreateNew(); // Hijack the 'New Entry' button
    } else {
      this.currentView = view;
      this.isHandoverMode = false;
    }
  }

  // Open Handover Form in 'Create Mode' (no existing entry yet)
  startCreateNew() {
    this.handoverData = this.getEmptyHandoverData();
    this.selectedEntryForHandover = null;

    // Initialize one row for tables
    this.addDirector();
    this.addFacility();
    this.addSecurity();

    this.isHandoverMode = true;
    this.currentView = 'list'; // Show list in background
    this.activeSection = 1;
  }

  // Deprecated/Legacy methods removed

  deleteEntry(id: string) {
    if (confirm('Are you sure you want to delete this file permanently?')) {
      this.loanService.deleteEntry(id);
    }
  }

  // Updated to open Handover Checklist instead of direct transfer
  startHandover(entry: PostEntry) {
    this.selectedEntryForHandover = entry;
    // Pre-fill basic details if possible
    this.handoverData = this.getEmptyHandoverData();
    this.handoverData.basicDetails.borrwerName = entry.fullName;
    this.handoverData.basicDetails.classificationDate = entry.npaDate;

    // Add one empty row for arrays
    this.addDirector();
    this.addFacility();
    this.addSecurity();

    this.isHandoverMode = true;
    this.currentView = 'list'; // Keep list view visible in background or just switch context
    this.activeSection = 1;
  }

  cancelHandover() {
    this.isHandoverMode = false;
    this.selectedEntryForHandover = null;
  }

  submitHandover(isUrgent: boolean = false) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    if (this.selectedEntryForHandover) {
      // Update EXISTING entry
      this.selectedEntryForHandover.handoverDetails = this.handoverData;
      // Sync basic fields back to entry for list display
      this.selectedEntryForHandover.fullName = this.handoverData.basicDetails.borrwerName;
      this.selectedEntryForHandover.mobileNumber = this.handoverData.basicDetails.mobileNumber;
      this.selectedEntryForHandover.npaDate = this.handoverData.basicDetails.classificationDate;

      this.loanService.updateEntry(this.selectedEntryForHandover);

      // Move to Recovery
      if (confirm(`Submit Handover Checklist and forward to Recovery${isUrgent ? ' (URGENT)' : ''}?`)) {
        this.loanService.moveToRecovery(this.selectedEntryForHandover.id, isUrgent);
        this.isHandoverMode = false;
        this.selectedEntryForHandover = null;
      }
    } else {
      // Create NEW Entry from Handover Data
      const newEntry = this.loanService.addEntry({
        divisionId: currentUser.username,
        fullName: this.handoverData.basicDetails.borrwerName || 'New Borrower',
        mobileNumber: this.handoverData.basicDetails.mobileNumber || '',
        npaDate: this.handoverData.basicDetails.classificationDate || new Date().toISOString().split('T')[0],
        sectionType: '13(2)', // Default, or considered derived
        status: 'Pending',
        currentLocation: 'Division',
        handoverDetails: this.handoverData
      });

      if (confirm(`Entry Created. Forward to Recovery Cell now${isUrgent ? ' (URGENT)' : ''}?`)) {
        this.loanService.moveToRecovery(newEntry.id, isUrgent);
      }

      this.isHandoverMode = false;
    }
  }

  // Dynamic Form Helpers
  addDirector() {
    this.handoverData.basicDetails.directors.push({ name: '', designation: '', contact: '', address: '' });
  }
  removeDirector(index: number) {
    this.handoverData.basicDetails.directors.splice(index, 1);
  }

  addFacility() {
    this.handoverData.facilities.push({
      name: '', tenor: '', amount: 0, sanctionDate: '',
      docDate: '', disbursedAmount: 0, outstandingAmount: 0, bankingArrangement: ''
    });
  }
  removeFacility(index: number) {
    this.handoverData.facilities.splice(index, 1);
  }

  addSecurity() {
    this.handoverData.securities.push({
      type: '', assetType: '', address: '', chargeType: '', chargeDate: '', isFreeFromEncumbrances: ''
    });
  }
  removeSecurity(index: number) {
    this.handoverData.securities.splice(index, 1);
  }

  addValuation() {
    this.handoverData.valuations.push({
      security: '', titleSearchDate: '', advocateName: '', valuationDate: '',
      valuerName: '', fmv: 0, rv: 0, dsv: 0, cersaiId: '', cersaiDate: ''
    });
  }
  removeValuation(index: number) {
    this.handoverData.valuations.splice(index, 1);
  }

  addLoanDoc() {
    this.handoverData.loanDocuments.push({ facility: '', amount: 0, documentsExecuted: '' });
  }
  removeLoanDoc(index: number) {
    this.handoverData.loanDocuments.splice(index, 1);
  }

  addRelease() {
    this.handoverData.releases.push({ date: '', againstLetter: '', amount: 0 });
  }
  removeRelease(index: number) {
    this.handoverData.releases.splice(index, 1);
  }

  addOriginalRepayment() {
    this.handoverData.originalRepaymentSchedule.push({ installmentDate: '', amount: 0, receiptDate: '' });
  }
  removeOriginalRepayment(index: number) {
    this.handoverData.originalRepaymentSchedule.splice(index, 1);
  }

  addRevisedRepayment() {
    this.handoverData.revisedRepaymentSchedule.push({ installmentDate: '', amount: 0, receiptDate: '' });
  }
  removeRevisedRepayment(index: number) {
    this.handoverData.revisedRepaymentSchedule.splice(index, 1);
  }

  addLegalCase() {
    this.handoverData.legalCases.push({ borrowerName: '', facts: '', caseNo: '', ndoh: '', status: '' });
  }
  removeLegalCase(index: number) {
    this.handoverData.legalCases.splice(index, 1);
  }

  addCorrespondence() {
    this.handoverData.correspondences.push({ particulars: '', date: '', outcome: '' });
  }
  removeCorrespondence(index: number) {
    this.handoverData.correspondences.splice(index, 1);
  }

  // Backwards compatibility for the original markUrgent if needed, but we'll use startHandover now
  markUrgent(id: string) {
    // Redirect to handover form instead of immediate send
    const entry = this.entries.find(e => e.id === id);
    if (entry) this.startHandover(entry);
  }



  // Helper methods for deadline tracking
  isOverdue(entry: PostEntry): boolean {
    const now = new Date();
    const deadline = new Date(entry.deadlineDate);
    return now > deadline;
  }

  getDaysOverdue(entry: PostEntry): number {
    const now = new Date();
    const deadline = new Date(entry.deadlineDate);
    const diffTime = now.getTime() - deadline.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Final Stage Methods
  selectedEntryForCompletion: PostEntry | null = null;
  minutesFileName: string = '';
  reservePrice: number = 0;

  isReturnedFromRO(entry: PostEntry): boolean {
    // Check if entry has returned from RO with valuation details
    return !!entry.valuationAmount && !!entry.roValuationFileName && entry.currentLocation === 'Division';
  }

  isFullyCompleted(entry: PostEntry): boolean {
    // Check if Division has added minutes and reserve price
    return !!entry.minutesFileName && !!entry.reservePrice;
  }

  openCompletionModal(entry: PostEntry) {
    this.selectedEntryForCompletion = entry;
    this.minutesFileName = entry.minutesFileName || '';
    this.reservePrice = entry.reservePrice || 0;
  }

  closeCompletionModal() {
    this.selectedEntryForCompletion = null;
    this.minutesFileName = '';
    this.reservePrice = 0;
  }

  onMinutesFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.minutesFileName = file.name;
    }
  }

  submitCompletion() {
    if (this.selectedEntryForCompletion && this.minutesFileName && this.reservePrice > 0) {
      this.loanService.moveToRegionalFromDivision(
        this.selectedEntryForCompletion.id,
        this.minutesFileName,
        this.reservePrice
      );
      this.closeCompletionModal();
    } else {
      alert('Please enter Reserve Price and upload Minutes document');
    }
  }
}
