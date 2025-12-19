# NPA Recovery System - Build It Module by Module

## 🎯 Build Sequence for Developers

This document tells you **EXACTLY** which module to build first, second, third, etc. Follow this order to complete the project in one week.

---

## ⚠️ IMPORTANT: Authentication is 100% Frontend

**NO BACKEND LOGIN API REQUIRED**

- Login = Simple dropdown to select role
- No username/password needed
- No database for users
- Session stored in browser localStorage
- Route guards protect pages

---

## 🏗️ Build Order (Follow This Exact Sequence)

### **BUILD #1: Authentication Module (Frontend Only)** ⏱️ Day 1

**What to Build:**
1. Login component with role dropdown
2. Auth service (localStorage based)
3. Auth guard for route protection
4. Basic routing setup

**Files to Create:**
```
src/app/features/auth/
  ├── login/
  │   ├── login.component.ts
  │   ├── login.component.html
  │   └── login.component.css
  
src/app/core/services/
  └── auth.service.ts

src/app/core/guards/
  └── auth.guard.ts

src/app/core/models/
  └── user.model.ts
```

**Key Code:**
```typescript
// auth.service.ts
const MOCK_USERS = [
  { id: 1, role: 'Division', username: 'Division User' },
  { id: 2, role: 'Recovery', username: 'Recovery User' },
  { id: 3, role: 'Legal', username: 'Legal User' },
  { id: 4, role: 'AuthorizedOfficer', username: 'Officer User' },
  { id: 5, role: 'Admin', username: 'Admin User' }
];

login(selectedRole: string) {
  const user = MOCK_USERS.find(u => u.role === selectedRole);
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
}
```

**Test:**
- Select role → Click login → Should redirect to dashboard
- Refresh page → Should stay logged in
- Logout → Should clear localStorage → Redirect to login

---

### **BUILD #2: Layout Components** ⏱️ Day 1

**What to Build:**
1. Header with notification badge
2. Sidebar with role-based menu
3. Main layout wrapper

**Files to Create:**
```
src/app/shared/components/
  ├── header/
  │   ├── header.component.ts
  │   ├── header.component.html
  │   └── header.component.css
  ├── sidebar/
  │   ├── sidebar.component.ts
  │   ├── sidebar.component.html
  │   └── sidebar.component.css
  └── notification-badge/
      ├── notification-badge.component.ts
      ├── notification-badge.component.html
      └── notification-badge.component.css
```

**Menu by Role:**
- **Division:** Dashboard, Create Handover, My Handovers
- **Recovery:** Dashboard, Handover Inbox, Notices, Timeline
- **Legal:** Dashboard, Vetting Queue
- **Officer:** Dashboard, Issue Notices, Auctions, Valuations
- **Admin:** Dashboard, Settings

**Test:**
- Login as Division → See only Division menu
- Login as Recovery → See only Recovery menu
- Notification badge shows count

---

### **BUILD #3: Dashboard Components** ⏱️ Day 2

**What to Build:**
1. Division dashboard
2. Recovery dashboard
3. Legal dashboard
4. Officer dashboard

**Files to Create:**
```
src/app/features/dashboard/
  ├── division-dashboard/
  ├── recovery-dashboard/
  ├── legal-dashboard/
  ├── officer-dashboard/
  └── dashboard.service.ts
```

**Each Dashboard Shows:**
- Pending tasks count
- Overdue items (red alert)
- Quick action buttons
- Recent activities list

**Backend APIs Needed:**
```
GET /api/dashboard/{role}/{userId}
```

**Test:**
- Login as each role → Dashboard shows role-specific data

---

### **BUILD #4: Handover Form (14 Sections)** ⏱️ Day 3

**What to Build:**
1. Multi-step wizard form
2. 14 section components
3. Form validation
4. Auto-save to localStorage
5. Document upload
6. Submit to Recovery Cell

**Files to Create:**
```
src/app/features/handover/
  ├── handover-form/
  │   ├── handover-form.component.ts  (Main wizard)
  │   ├── section1-basic-details/
  │   ├── section2-facility/
  │   ├── section3-security/
  │   ├── section4-valuation/
  │   ├── section5-documentation/
  │   ├── section6-release/
  │   ├── section7-pdc/
  │   ├── section8-repayment/
  │   ├── section9-restructuring/
  │   ├── section10-revised-schedule/
  │   ├── section11-sarfaesi/
  │   ├── section12-pending-cases/
  │   ├── section13-correspondence/
  │   └── section14-remarks/
  ├── document-upload/
  ├── handover-list/
  └── handover.service.ts
```

**Backend APIs Needed:**
```
POST /api/handover/create
PUT  /api/handover/{id}
POST /api/handover/{id}/submit
POST /api/handover/{id}/documents (file upload)
GET  /api/handover/all
```

**Test:**
- Fill Section 1 → Click Next → Section 2 loads
- Close browser → Reopen → Draft restored
- Upload PDF → Shows in list
- Submit → Status changes to "Submitted"

---

### **BUILD #5: Recovery Workflow** ⏱️ Day 4

**What to Build:**
1. Handover inbox (received from Division)
2. Section 13(2) notice generation
3. Section 13(4) notice generation
4. Timeline tracker

**Files to Create:**
```
src/app/features/recovery/
  ├── handover-inbox/
  ├── notice-generation/
  │   ├── section-13-2-form/
  │   └── section-13-4-form/
  ├── timeline-tracker/
  └── recovery.service.ts
```

**Backend APIs Needed:**
```
GET  /api/recovery/handovers
POST /api/recovery/notice/13-2
POST /api/recovery/notice/13-4
GET  /api/timeline/account/{id}
```

**Test:**
- View handover inbox → See submitted handovers from Division
- Create 13(2) notice → Send to Legal
- Timeline shows 16 triggers with due dates

---

### **BUILD #6: Legal Vetting** ⏱️ Day 4

**What to Build:**
1. Vetting queue
2. Document review screen
3. Approve/Reject with comments

**Files to Create:**
```
src/app/features/legal/
  ├── vetting-queue/
  ├── document-review/
  └── legal.service.ts
```

**Backend APIs Needed:**
```
GET  /api/legal/pending-vetting
POST /api/legal/approve/{noticeId}
POST /api/legal/return/{noticeId}
```

**Test:**
- See notice sent by Recovery
- Add comment → Return to Recovery
- Or Approve → Sends to Officer

---

### **BUILD #7: Officer Actions** ⏱️ Day 5

**What to Build:**
1. Notice issuance
2. Valuation management
3. Auction setup

**Files to Create:**
```
src/app/features/officer/
  ├── notice-issuance/
  ├── valuation-management/
  ├── auction-setup/
  └── officer.service.ts
```

**Backend APIs Needed:**
```
POST /api/officer/issue-notice/{id}
POST /api/officer/valuation
POST /api/officer/auction
```

**Test:**
- Issue approved notice
- Upload valuation report
- Schedule auction with reserve price

---

### **BUILD #8: Notifications** ⏱️ Day 5

**What to Build:**
1. Notification center
2. Notification badge (in header)
3. Notification service with polling

**Files to Create:**
```
src/app/features/notifications/
  ├── notification-center/
  └── notification.service.ts
```

**Backend APIs Needed:**
```
GET  /api/notifications/user/{userId}
POST /api/notifications/mark-read/{id}
```

**Polling Logic:**
```typescript
// Poll every 30 seconds
setInterval(() => {
  this.fetchNotifications();
}, 30000);
```

**Test:**
- Create overdue handover → See red notification
- Click badge → Dropdown shows recent 5
- Mark as read → Badge count decreases

---

### **BUILD #9: Reports (Optional)** ⏱️ Day 6

**What to Build:**
1. Handover summary report
2. Timeline compliance report
3. Export to PDF/Excel

**Files to Create:**
```
src/app/features/reports/
  ├── handover-summary/
  ├── timeline-compliance/
  └── reports.service.ts
```

**Backend APIs Needed:**
```
GET /api/reports/handover-summary
GET /api/reports/timeline-compliance
```

---

### **BUILD #10: Admin Panel (Optional)** ⏱️ Day 6

**What to Build:**
1. Manage divisions
2. Manage regional offices
3. Configure timeline triggers

**Files to Create:**
```
src/app/features/admin/
  ├── divisions/
  ├── regional-offices/
  ├── system-settings/
  └── admin.service.ts
```

---

## 📊 Implementation Timeline Summary

| Day | Module | Components | Backend APIs |
|-----|--------|-----------|--------------|
| **1** | Auth & Layout | Login, Header, Sidebar | NONE (frontend only) |
| **2** | Dashboards | 4 dashboards | GET /dashboard/{role} |
| **3** | Handover Form | 14 sections, Upload | POST/PUT /handover |
| **4** | Recovery + Legal | Notices, Vetting | POST /notice, /legal |
| **5** | Officer + Notifications | Actions, Alerts | POST /officer, GET /notifications |
| **6** | Reports + Admin | Analytics, Settings | GET /reports |
| **7** | Testing | End-to-end tests | All APIs |

---

## 🔥 Quick Start Commands

### Day 1 - Start Building
```bash
# Create auth module
ng generate component features/auth/login
ng generate service core/services/auth
ng generate guard core/guards/auth

# Create layout
ng generate component shared/components/header
ng generate component shared/components/sidebar
ng generate component shared/components/notification-badge

# Install Bootstrap
npm install bootstrap
# Add to angular.json styles: "node_modules/bootstrap/dist/css/bootstrap.min.css"
```

### Day 2 - Dashboards
```bash
ng generate component features/dashboard/division-dashboard
ng generate component features/dashboard/recovery-dashboard
ng generate component features/dashboard/legal-dashboard
ng generate component features/dashboard/officer-dashboard
ng generate service features/dashboard/dashboard
```

### Day 3 - Handover
```bash
ng generate component features/handover/handover-form
ng generate component features/handover/handover-list
ng generate component features/handover/document-upload
ng generate service features/handover/handover

# Generate 14 section components
ng generate component features/handover/handover-form/section1-basic-details
# ... repeat for sections 2-14
```

---

## ✅ Testing Checklist (After Each Build)

### After BUILD #1 (Auth)
- [ ] Can select role from dropdown
- [ ] Clicking login redirects to dashboard
- [ ] localStorage saves user session
- [ ] Refresh keeps session active
- [ ] Logout clears localStorage

### After BUILD #2 (Layout)
- [ ] Header shows username and role
- [ ] Sidebar menu changes by role
- [ ] Notification badge visible

### After BUILD #3 (Dashboard)
- [ ] Division sees pending handovers count
- [ ] Recovery sees received handovers
- [ ] Legal sees vetting queue
- [ ] Officer sees notices to issue

### After BUILD #4 (Handover)
- [ ] Can navigate through 14 sections
- [ ] Form saves draft on each step
- [ ] Can upload multiple documents
- [ ] Submit button sends to backend
- [ ] Status changes to "Submitted"

### After BUILD #5 (Recovery)
- [ ] Inbox shows Division's handovers
- [ ] Can generate 13(2) notice
- [ ] Timeline shows 16 triggers
- [ ] Due dates calculated correctly

### After BUILD #6 (Legal)
- [ ] Vetting queue shows pending notices
- [ ] Can add comments
- [ ] Approve sends to Officer
- [ ] Return sends back to Recovery

### After BUILD #7 (Officer)
- [ ] Can issue vetted notices
- [ ] Can upload valuation
- [ ] Can schedule auction

### After BUILD #8 (Notifications)
- [ ] Badge shows unread count
- [ ] Clicking badge shows dropdown
- [ ] Notification center lists all
- [ ] Mark as read works

---

## 🚫 What NOT to Build (Out of Scope)

- ❌ Email notifications (using in-app only)
- ❌ SMS notifications
- ❌ Backend user login API (frontend only)
- ❌ Password management
- ❌ User registration
- ❌ Forgot password
- ❌ Role management CRUD (roles are hardcoded)

---

## 📝 Summary for Developers

**START HERE:**
1. Read this document top to bottom
2. Start with BUILD #1 (Authentication)
3. Test after each build
4. Only move to next build when current one works
5. Backend APIs needed from Day 2 onwards (not Day 1)
6. Authentication is 100% frontend - no backend needed

**By End of Week:**
- ✅ Full workflow: Division → Recovery → Legal → Officer → Auction
- ✅ 14-section handover form
- ✅ Timeline tracking with 16 triggers
- ✅ In-app notifications
- ✅ Role-based access control
- ✅ Document management

**Happy Coding! 🚀**
