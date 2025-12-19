# NPA Account Recovery Management System - User Guide

## 📋 Project Overview

The **NPA Account Recovery Management System** is a web-based application designed to streamline and automate the process of handling Non-Performing Asset (NPA) accounts as per **NCDC Office Order No.NCDC:01-01/2025-Recovery dated 15.12.2025**.

### Purpose
This system manages the entire lifecycle of NPA account handover from Division to Recovery Cell, tracks SARFAESI actions, manages timelines, and ensures compliance with regulatory requirements.

---

## 🎯 Key Features

### 1. **NPA Account Handover**
- Division creates handover documents with 14 sections of borrower details
- Automatic checklist validation
- Document upload and flagging
- Timeline tracking (3-day handover requirement)

### 2. **SARFAESI Action Management**
- Section 13(2) notice generation and tracking
- Section 13(4) notice management
- Representation/objection handling
- Sale notice preparation
- Auction management (first and subsequent)

### 3. **Timeline & Compliance Tracking**
- 16 predefined timeline triggers
- Automated alerts via **in-app notifications**
- Status tracking for each milestone
- Overdue alerts

### 4. **Multi-Role Workflow**
- **Division**: Create handover, respond to representations
- **Recovery Cell**: Issue notices, manage recovery process
- **Legal Cell**: Vet notices and legal documents
- **Authorized Officer (RO)**: Issue approved notices, conduct auctions

### 5. **Document Management**
- Upload physical file documents
- Digital e-file management
- Document checklist tracking
- Version control for notices and reports

---

## 🔄 Data Flow Architecture

### High-Level Flow
```
Division → Recovery Cell → Legal Cell → Authorized Officer → Auction
```

### Detailed Workflow Steps

#### **Step 1: NPA Declaration & Handover (Division)**
```
Division identifies NPA account
    ↓
Creates handover document (14 sections)
    ↓
Uploads physical files + e-files
    ↓
Submits to Recovery Cell (within 3 days)
    ↓
System triggers notification to Recovery Cell
```

#### **Step 2: Recovery Cell Processing**
```
Recovery Cell receives handover
    ↓
Reviews account details
    ↓
Prepares Section 13(2) notice draft
    ↓
Sends to Legal Cell for vetting (within 30 days of NPA)
```

#### **Step 3: Legal Vetting**
```
Legal Cell receives draft notice
    ↓
Reviews and vets document
    ↓
Returns vetted notice (within 7 days)
    ↓
Recovery Cell forwards to Authorized Officer
```

#### **Step 4: Notice Issuance**
```
Authorized Officer receives vetted notice
    ↓
Issues Section 13(2) to borrower (within 45 days of NPA)
    ↓
System tracks response timeline
```

#### **Step 5: Representation Handling**
```
Borrower submits representation/objection
    ↓
Division prepares reply (with Recovery & Legal)
    ↓
Final reply issued (within 12 days)
    ↓
Section 13(4) process initiated
```

#### **Step 6: Asset Valuation & Auction**
```
Valuation report obtained (within 30 days of 13(4))
    ↓
Division confirms format compliance (7 days)
    ↓
ASC meeting convened, reserve price fixed (15 days)
    ↓
Sale notice prepared and vetted (15 days)
    ↓
First auction conducted (60 days from sale notice)
    ↓
Subsequent auctions if needed (45 days apart)
```

---

## 👥 User Roles & Responsibilities

### **1. Division User**
**Access:** Create and manage handover documents

**Responsibilities:**
- Fill 14-section handover form
- Upload account files (physical + e-file)
- Submit to Recovery Cell within 3 days of NPA
- Respond to borrower representations
- Confirm valuation report format

**Key Screens:**
- Dashboard (pending handovers)
- Handover form entry
- Document upload
- Representation reply

---

### **2. Recovery Cell User**
**Access:** Manage recovery process

**Responsibilities:**
- Receive and review handover files
- Prepare Section 13(2) and 13(4) notices
- Coordinate with Legal Cell
- Manage auction process
- Track all timelines

**Key Screens:**
- Pending handovers dashboard
- Notice generation
- Timeline tracking
- Auction management

---

### **3. Legal Cell User**
**Access:** Vet legal documents

**Responsibilities:**
- Review Section 13(2) notices (7 days)
- Review Section 13(4) notices (15 days)
- Vet sale notices
- Provide legal guidance

**Key Screens:**
- Pending vetting queue
- Document review interface
- Comments/feedback system

---

### **4. Authorized Officer (Regional Office)**
**Access:** Issue notices and manage auctions

**Responsibilities:**
- Issue vetted Section 13(2) notices
- Issue Section 13(4) notices
- Arrange property valuations
- Convene ASC meetings
- Conduct auctions

**Key Screens:**
- Notice issuance dashboard
- Valuation management
- Auction scheduling
- ASC meeting tracker

---

### **5. Admin**
**Access:** System configuration

**Responsibilities:**
- User management
- Role assignment
- Master data configuration
- System monitoring

---

## 📊 14-Section Handover Document

| Section | Details |
|---------|---------|
| **1** | Basic Details (Division, RO, Account name, NPA date, Business activity, Contact details) |
| **2** | Facility Sanctioned (Term loan, Working capital, Disbursed/Outstanding amounts) |
| **3** | Security Details (Type, Asset type, Address, Charge creation, Encumbrances) |
| **4** | Valuation & Title Search (FMV, RV, DSV, CERSAI details) |
| **5** | Loan Documentation (Loan agreement, Hypothecation, Mortgage) |
| **6** | Release Details (Date, Amount, Letter reference) |
| **7** | PDC Details (Availability, Presentation, Dishonor, NI Act proceedings) |
| **8** | Original Repayment Schedule |
| **9** | Restructuring Details (If applicable) |
| **10** | Revised Repayment Schedule (Post-restructuring) |
| **11** | SARFAESI Actions (13(2), 13(3), 13(4), Sale notice, Auction) |
| **12** | Pending Cases (Court cases, Application details) |
| **13** | Correspondence Log (Emails, Letters, Legal notices, Site visits) |
| **14** | Remarks (Division's observations) |

---

## ⏱️ 16 Timeline Triggers

| Sr | Action | Timeline | Responsible | Auto-Alert |
|----|--------|----------|-------------|------------|
| 1 | Handover to Recovery Cell | 3 days from NPA date | Division | ✅ |
| 2 | Draft 13(2) notice | 30 days from NPA | Recovery | ✅ |
| 3 | Vet 13(2) notice | 7 days from draft | Legal | ✅ |
| 4 | Issue 13(2) notice | 45 days from NPA | Authorized Officer | ✅ |
| 5 | Receive representation | Manual entry | Recovery | - |
| 6 | Prepare reply | 7 days from representation | Division + Legal | ✅ |
| 7 | Submit final reply | 12 days from representation | Recovery | ✅ |
| 8 | Draft 13(4) notice | 75 days from 13(2) | Recovery | ✅ |
| 9 | Vet 13(4) notice | 15 days from draft | Legal | ✅ |
| 10 | Issue 13(4) notice | 90 days from 13(2) | Authorized Officer | ✅ |
| 11 | Obtain valuation | 30 days from 13(4) | Authorized Officer | ✅ |
| 12 | Confirm valuation format | 7 days from valuation | Division | ✅ |
| 13 | ASC meeting & reserve price | 15 days from confirmation | Authorized Officer | ✅ |
| 14 | Vet sale notice | 15 days from reserve price | Recovery + Legal | ✅ |
| 15 | First auction | 60 days from sale notice | All | ✅ |
| 16 | Subsequent auction | 45 days from previous | All | ✅ |

---

## 🔔 Notification System

Since SMS and Email services are not used, the system implements **in-app notifications**:

### Notification Types
1. **Timeline Alerts**: Upcoming and overdue deadlines
2. **Action Required**: Tasks pending user action
3. **Status Updates**: Workflow progress notifications
4. **System Alerts**: Document uploads, approvals, rejections

### Notification Delivery
- Real-time browser notifications
- In-app notification center
- Notification badge counters
- Dashboard widgets

---

## 🗂️ File Organization

### Physical Files
- Scanned documents uploaded by Division
- Organized by account number
- Tagged with document type
- Flagged for easy reference

### E-Files
- Digital documents (PDFs, images)
- Version tracking
- Access control based on role
- Audit trail maintained

---

## 🔐 Security & Access Control

### Authentication
**Frontend-only authentication** for quick development:
- Simple role selection (no password required)
- Session stored in browser localStorage
- Route guards protect unauthorized access
- Perfect for development and internal use

> [!NOTE]
> For production deployment, consider adding backend authentication with JWT tokens and proper password security.

### Role-Based Access
- Each role has specific permissions
- Read/Write access controlled by workflow stage
- Audit logs for all actions

### Data Privacy
- Sensitive borrower information encrypted
- Access logs maintained
- Compliance with data protection norms

---

## 📱 System Requirements

### For Users
- Modern web browser (Chrome, Firefox, Edge)
- Stable internet connection
- PDF viewer for documents
- Screen resolution: 1366x768 or higher

### Supported Devices
- Desktop computers
- Laptops
- Tablets (10-inch or larger)

---

## 🚀 Getting Started

### For Division Users
1. Login with credentials
2. Navigate to "Create Handover"
3. Fill all 14 sections
4. Upload documents
5. Submit to Recovery Cell

### For Recovery Cell Users
1. Login to dashboard
2. View pending handovers
3. Generate Section 13(2) notice
4. Track timelines
5. Monitor workflow progress

### For Legal Cell Users
1. Access vetting queue
2. Review documents
3. Provide feedback
4. Approve/Return with comments

### For Authorized Officers
1. View approved notices
2. Issue to borrowers
3. Manage auctions
4. Update status

---

## 📞 Support & Help

### In-App Help
- Tooltips on form fields
- Help icons with explanations
- FAQ section
- User manual

### Technical Support
- Contact system administrator
- Raise tickets for issues
- Training materials available

---

## 📈 Reporting & Analytics

### Available Reports
- Pending handovers summary
- Timeline compliance report
- Recovery progress dashboard
- Auction status tracker
- Overdue actions report

### Export Options
- PDF export
- Excel export
- Print-friendly views

---

## 🎓 Best Practices

1. **Complete handover within 3 days** - Set system reminders
2. **Maintain accurate records** - Upload all documents
3. **Track timelines diligently** - Check notifications daily
4. **Coordinate with teams** - Use comment features
5. **Update status promptly** - Keep workflow current
6. **Regular monitoring** - Review dashboards weekly

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial release |

---

**System Developed By:** NCDC IT Team  
**Last Updated:** December 2025  
**Document Version:** 1.0
