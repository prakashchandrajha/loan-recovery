# Implementation Plan: NPA Account Recovery Management System

## Overview

Building a **simple and functional** NPA Account Handover and Recovery Management System to streamline the process defined in NCDC Office Order No.NCDC:01-01/2025-Recovery.

**Key Requirements:**
- Track 14-section handover documents from Division to Recovery Cell
- Manage 16 timeline triggers with automated in-app notifications
- Support 4 user roles: Division, Recovery Cell, Legal Cell, Authorized Officer
- Frontend focus using Angular 20
- Backend: Spring Boot + PostgreSQL
- **No SMS/Email** - using in-app notifications only

---

## User Review Required

> [!IMPORTANT]
> **Frontend-First Approach**
> This plan prioritizes frontend development with mock/minimal backend initially. We'll build Angular components first and connect to Spring Boot APIs progressively.

> [!IMPORTANT]
> **Simplified Design**
> Using Bootstrap for quick UI development instead of custom design system. Focus is on functionality over aesthetics as requested.

> [!WARNING]
> **One-Week Timeline**
> The aggressive timeline means we'll implement core features first, with some advanced features (reporting, detailed analytics) marked as "Phase 2" for post-launch.

---

## Proposed Changes

### 📁 Project Structure

```
loan-recovery/
├── src/app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── services/
│   │   └── models/
│   ├── shared/
│   │   ├── components/ (header, sidebar, notification-badge)
│   │   └── utils/
│   └── features/
│       ├── auth/
│       ├── dashboard/
│       ├── handover/
│       ├── recovery/
│       ├── legal/
│       ├── officer/
│       ├── notifications/
│       └── admin/
```

---

### Module 1: Authentication & Layout

#### [NEW] [auth.guard.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/core/guards/auth.guard.ts)
- Route protection based on authentication status
- Redirect to login if not authenticated

#### [NEW] [auth.service.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/core/services/auth.service.ts)
- Frontend-only login (no backend API)
- Store user session in localStorage
- Role-based access helpers
- Mock user data for testing

```typescript
// Simple frontend-only authentication
login(role: string) {
  const user = { id: 1, role: role, username: role + ' User' };
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
}
```

#### [NEW] [login.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/auth/login/login.component.ts)
- Simple role selection dropdown
- Select role: Division, Recovery, Legal, Officer, Admin
- No password required
- Role-based routing after selection

#### [NEW] [header.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/shared/components/header/header.component.ts)
- Top navigation bar
- User info display
- Notification badge
- Logout button

#### [NEW] [sidebar.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/shared/components/sidebar/sidebar.component.ts)
- Role-based navigation menu
- Different menu items for each role

---

### Module 2: Dashboard (Role-Specific)

#### [NEW] [division-dashboard.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/dashboard/division-dashboard/division-dashboard.component.ts)
- Pending handovers count
- Overdue actions alert
- Quick action buttons
- Recent activities

#### [NEW] [recovery-dashboard.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/dashboard/recovery-dashboard/recovery-dashboard.component.ts)
- Received handovers
- Pending notice generation
- Timeline compliance metrics

#### [NEW] [legal-dashboard.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/dashboard/legal-dashboard/legal-dashboard.component.ts)
- Pending vetting queue
- Documents awaiting review

#### [NEW] [officer-dashboard.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/dashboard/officer-dashboard/officer-dashboard.component.ts)
- Notices to be issued
- Upcoming auctions
- Valuation pending

---

### Module 3: Handover Management (Division)

#### [NEW] [handover-form.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/handover/handover-form/handover-form.component.ts)
- Multi-step form wizard (14 sections)
- Form validation per section
- Auto-save to localStorage (draft)
- Submit to Recovery Cell

**14 Form Sections:**
1. Basic Details (account name, NPA date, contacts)
2. Facility Sanctioned (term loan, working capital)
3. Security Details (land, stock, charges)
4. Valuation & Title Search
5. Loan Documentation
6. Release Details
7. PDC Details
8. Original Repayment Schedule
9. Restructuring Details
10. Revised Repayment Schedule
11. SARFAESI Actions
12. Pending Cases
13. Correspondence Log
14. Remarks

#### [NEW] [document-upload.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/handover/document-upload/document-upload.component.ts)
- Multi-file upload
- Document type selection
- Flag important documents
- Preview uploaded files

#### [NEW] [handover-list.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/handover/handover-list/handover-list.component.ts)
- List all handovers created by division
- Filter by status (Draft, Submitted, In Recovery)
- Edit draft handovers
- View submitted handovers

---

### Module 4: Recovery Workflow

#### [NEW] [handover-inbox.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/recovery/handover-inbox/handover-inbox.component.ts)
- View received handovers from divisions
- Review 14-section details
- Download documents
- Initiate recovery process

#### [NEW] [notice-generation.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/recovery/notice-generation/notice-generation.component.ts)
- Generate Section 13(2) notice
- Generate Section 13(4) notice
- Text editor for notice content
- Send to Legal Cell for vetting

#### [NEW] [timeline-tracker.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/recovery/timeline-tracker/timeline-tracker.component.ts)
- Display 16 timeline triggers
- Show status (Pending, In Progress, Completed, Overdue)
- Calculate due dates automatically
- Visual timeline view

---

### Module 5: Legal Vetting

#### [NEW] [vetting-queue.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/legal/vetting-queue/vetting-queue.component.ts)
- List notices pending vetting
- Prioritize by due date
- Filter by notice type

#### [NEW] [document-review.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/legal/document-review/document-review.component.ts)
- Display notice content
- Add comments/feedback
- Approve or Return to Recovery Cell
- Track vetting timeline (7 days for 13(2), 15 days for 13(4))

---

### Module 6: Authorized Officer Actions

#### [NEW] [notice-issuance.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/officer/notice-issuance/notice-issuance.component.ts)
- View vetted notices
- Issue to borrower
- Record issuance date
- Generate PDF notice

#### [NEW] [valuation-management.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/officer/valuation-management/valuation-management.component.ts)
- Appoint valuer
- Upload valuation report
- Track valuation timeline (30 days)

#### [NEW] [auction-setup.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/officer/auction-setup/auction-setup.component.ts)
- Schedule auction date
- Set reserve price (from ASC meeting)
- Publish sale notice
- Record auction outcome

---

### Module 7: Notifications

#### [NEW] [notification-center.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/features/notifications/notification-center/notification-center.component.ts)
- Display all notifications
- Filter by type (Timeline Alert, Action Required, Status Update)
- Mark as read/unread
- Delete notifications

#### [NEW] [notification-badge.component.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/shared/components/notification-badge/notification-badge.component.ts)
- Show unread count
- Dropdown preview
- Click to open notification center

#### [NEW] [notification.service.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/core/services/notification.service.ts)
- Fetch notifications from backend API
- Poll for new notifications (every 30 seconds)
- Real-time updates using simple polling (no WebSocket initially)
- Toast notifications for urgent alerts

---

### Module 8: Models & Services

#### [NEW] [models.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/core/models/models.ts)
```typescript
export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'Division' | 'Recovery' | 'Legal' | 'AuthorizedOfficer' | 'Admin';
  divisionId?: number;
  regionalOfficeId?: number;
}

export interface NPAAccount {
  id: number;
  accountName: string;
  npaDate: Date;
  status: 'Draft' | 'Submitted' | 'InRecovery' | 'Closed';
  divisionId: number;
  // 14 section fields...
}

export interface Notice {
  id: number;
  accountId: number;
  noticeType: 'Section132' | 'Section134' | 'SaleNotice';
  status: 'Draft' | 'WithLegal' | 'Vetted' | 'Issued';
  draftDate: Date;
  vettedDate?: Date;
  issuedDate?: Date;
}

export interface Timeline {
  id: number;
  accountId: number;
  triggerId: number;
  triggerName: string;
  dueDate: Date;
  status: 'Pending' | 'Completed' | 'Overdue';
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'TimelineAlert' | 'ActionRequired' | 'StatusUpdate';
  isRead: boolean;
  createdAt: Date;
}
```

#### [NEW] [handover.service.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/core/services/handover.service.ts)
- CRUD operations for handover
- Document upload
- Submit handover

#### [NEW] [recovery.service.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/core/services/recovery.service.ts)
- Notice generation
- Representation management
- Timeline tracking

---

### Routing

#### [MODIFY] [app.routes.ts](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/app/app.routes.ts)
```typescript
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent }, // Role-based routing
      { path: 'handover', loadChildren: () => import('./features/handover/handover.routes') },
      { path: 'recovery', loadChildren: () => import('./features/recovery/recovery.routes') },
      { path: 'legal', loadChildren: () => import('./features/legal/legal.routes') },
      { path: 'officer', loadChildren: () => import('./features/officer/officer.routes') },
      { path: 'notifications', component: NotificationCenterComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
```

---

### Styling

#### [MODIFY] [styles.css](file:///c:/Users/acer/Desktop/prakash/Front-End/loan-recovery/src/styles.css)
- Import Bootstrap 5
- Define CSS variables for colors
- Simple utility classes

```css
@import 'bootstrap/dist/css/bootstrap.min.css';

:root {
  --primary: #0d6efd;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
}

.overdue { color: var(--danger); font-weight: bold; }
.pending { color: var(--warning); }
.completed { color: var(--success); }
```

---

### Backend API (Reference for Frontend)

**Base URL:** `http://localhost:8080/api`

#### Authentication
```
# No backend authentication needed - frontend only
# Optional user management for Admin
GET  /users  # List all users (Admin panel only)
```

#### Handover
```
GET    /handover/all?userId=1&role=Division
POST   /handover/create
PUT    /handover/{id}
POST   /handover/{id}/submit
POST   /handover/{id}/documents (multipart/form-data)
```

#### Recovery
```
GET  /recovery/handovers?userId=1
POST /recovery/notice/13-2
POST /recovery/notice/13-4
```

#### Notifications
```
GET  /notifications/user/{userId}
POST /notifications/mark-read/{id}
```

#### Timeline
```
GET /timeline/account/{accountId}
```

---

## Verification Plan

### Automated Tests

> [!NOTE]
> Initially, we'll focus on building functionality. Unit tests will be added for critical services in Phase 2.

**Service Tests (to be added):**
- `auth.service.spec.ts` - Login, logout, role checks
- `handover.service.spec.ts` - CRUD operations
- `notification.service.spec.ts` - Fetch, mark as read

**Command to run tests:**
```bash
ng test
```

---

### Manual Verification

#### 1. **Authentication Flow**
**Steps:**
1. Navigate to `http://localhost:4200`
2. Should redirect to `/login`
3. Select role from dropdown:
   - **Division User**
   - **Recovery User**
   - **Legal User**
   - **Officer User**
   - **Admin User**
4. Click "Login" button
5. After login, should redirect to role-specific dashboard
6. Logout should clear localStorage and redirect to login

**Expected Result:** ✅ Role-based routing works, session persisted in localStorage

---

#### 2. **Handover Creation (Division User)**
**Steps:**
1. Login as Division user
2. Navigate to "Create Handover"
3. Fill Section 1 (Basic Details):
   - Account Name: "Test Society Ltd"
   - NPA Date: "2025-12-01"
   - Business Activity: "Dairy"
4. Click "Save Draft" - should save to localStorage
5. Refresh page - draft should be restored
6. Complete all 14 sections
7. Upload 2-3 test documents (PDFs/images)
8. Click "Submit to Recovery Cell"

**Expected Result:** ✅ Handover created, documents uploaded, status changes to "Submitted", notification sent to Recovery Cell

---

#### 3. **Timeline Tracking**
**Steps:**
1. Login as Recovery user
2. Open a handover with NPA date = "2025-12-01"
3. View Timeline Tracker
4. Should show 16 triggers with calculated due dates:
   - Trigger 1: Handover due by "2025-12-04" (3 days)
   - Trigger 2: Draft 13(2) due by "2025-12-31" (30 days)
   - etc.
5. If today > due date, status should show "Overdue" in red

**Expected Result:** ✅ Timeline auto-calculated, overdue alerts visible

---

#### 4. **Notice Generation & Vetting**
**Steps:**
1. Login as Recovery user
2. Navigate to handover inbox
3. Select an account
4. Click "Generate Section 13(2) Notice"
5. Fill notice content
6. Click "Send to Legal Cell"
7. Logout and login as Legal user
8. View vetting queue - should see pending notice
9. Click "Review", add comments
10. Click "Approve"
11. Logout and login as Authorized Officer
12. View approved notices - should see vetted notice
13. Click "Issue Notice", confirm issuance date

**Expected Result:** ✅ Notice workflow from Recovery → Legal → Officer completed

---

#### 5. **Notifications**
**Steps:**
1. Login as any user
2. Check notification badge in header - should show count
3. Click badge - dropdown shows recent notifications
4. Click "View All" - opens notification center
5. Mark a notification as read - badge count decreases
6. Create a handover overdue scenario (mock backend response)
7. Should see "Timeline Alert" notification

**Expected Result:** ✅ Notifications display, mark as read works, alerts for overdue items

---

#### 6. **Role-Based Access Control**
**Steps:**
1. Login as Division user
2. Try to access `/recovery` route manually
3. Should redirect to dashboard or show "Access Denied"
4. Sidebar should only show Division-relevant menu items

**Expected Result:** ✅ Unauthorized routes blocked, menu filtered by role

---

#### 7. **Responsive Design**
**Steps:**
1. Open application in browser
2. Resize window to mobile size (375px width)
3. Check:
   - Sidebar collapses to hamburger menu
   - Tables are scrollable
   - Forms are stack vertically
   - Buttons are full-width on mobile

**Expected Result:** ✅ Application is usable on mobile devices

---

### User Acceptance Testing

**After development completion, request user to test:**
1. Create a real handover with actual borrower data
2. Upload scanned documents from a real case
3. Generate Section 13(2) notice with proper legal language
4. Track a full workflow from handover → notice → auction
5. Verify timeline calculations match office order requirements
6. Confirm notification alerts are timely and relevant

---

## Implementation Timeline

### Day 1 (Monday) - Foundation
- ✅ Angular project setup
- ✅ Install Bootstrap
- ✅ Create core folder structure
- ✅ Authentication module (frontend-only with role selector)
- ✅ Auth guard for route protection
- ✅ Header and sidebar components
- ✅ Basic routing

### Day 2 (Tuesday) - Dashboards
- ✅ Division dashboard
- ✅ Recovery dashboard
- ✅ Legal dashboard
- ✅ Officer dashboard
- ✅ Dashboard service with mock data

### Day 3 (Wednesday) - Handover Module
- ✅ Handover form (14 sections)
- ✅ Form validation and auto-save
- ✅ Document upload component
- ✅ Handover list
- ✅ Handover service

### Day 4 (Thursday) - Workflow Modules
- ✅ Recovery workflow components
- ✅ Legal vetting components
- ✅ Officer action components
- ✅ Notice generation forms

### Day 5 (Friday) - Notifications & Timeline
- ✅ Timeline tracker component
- ✅ Timeline calculation logic
- ✅ Notification center
- ✅ Notification badge
- ✅ Notification service with polling

### Day 6 (Saturday) - Integration & Polish
- ✅ Connect frontend to backend APIs
- ✅ Replace mock data with real API calls
- ✅ Error handling
- ✅ Loading spinners
- ✅ Toast notifications

### Day 7 (Sunday) - Testing & Deployment
- ✅ Manual testing (all scenarios above)
- ✅ Bug fixes
- ✅ Build production bundle
- ✅ Deploy frontend
- ✅ Final user acceptance testing

---

## Next Steps After Plan Approval

1. **Start with Module 1 (Authentication)**
   - Generate components: `ng generate component features/auth/login`
   - Create auth service and guard
   - Set up routing with auth protection

2. **Create Mock Data Service**
   - `/src/app/core/services/mock-data.service.ts`
   - Return sample users, handovers, notices for development

3. **Build Components Incrementally**
   - Follow the module breakdown in `MODULE-WISE-APPROACH.md`
   - Test each component before moving to next

4. **Backend Integration (Day 6)**
   - Ensure Spring Boot APIs are ready
   - Replace mock services with HTTP calls
   - Handle errors gracefully

---

## Notes

- **Simplicity First:** Using Bootstrap components (cards, tables, modals) instead of custom UI
- **No Over-Engineering:** Focus on working features, not perfect code
- **Frontend-First:** Build UI with mock data, connect backend later
- **Incremental Testing:** Test each module as it's built
- **User Feedback:** Show progress daily to stakeholders

---

**Ready to start building! 🚀**
