# NPA Recovery System - Module-Wise Implementation Approach

## 🎯 Project Structure

### Technology Stack
- **Frontend:** Angular 20 (TypeScript)
- **Backend:** Spring Boot 3.x (Java)
- **Database:** PostgreSQL
- **Notifications:** In-app (no SMS/Email)
- **Styling:** Bootstrap/Tailwind CSS (keep it simple)

---

## 📅 One-Week Implementation Timeline

### **Day 1: Setup & Core Foundation**
- Project setup (Angular + Spring Boot)
- Database schema design
- Authentication module

### **Day 2: User Management & Dashboard**
- User roles and permissions
- Login/logout
- Dashboard layouts for each role

### **Day 3: Handover Module (Division)**
- 14-section form
- Document upload
- Submission workflow

### **Day 4: Recovery & Legal Workflow**
- Notice generation
- Vetting workflow
- Status tracking

### **Day 5: Timeline & Notification System**
- Timeline trigger engine
- In-app notifications
- Alert management

### **Day 6: Auction & Reporting**
- Auction management
- Reports and analytics
- System testing

### **Day 7: Integration & Deployment**
- End-to-end testing
- Bug fixes
- Documentation
- Deployment

---

## 🧩 Module Breakdown (Frontend Focus)

---

## **Module 1: Authentication & User Management**

### Components
```
src/app/
├── auth/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   ├── auth.service.ts
│   └── auth.guard.ts
├── users/
│   ├── user-list/
│   ├── user-form/
│   └── user.service.ts
```

### Features
- ✅ Frontend-only login (no backend authentication)
- ✅ Simple role selection
- ✅ Session management (localStorage)
- ✅ Route guards for protection
- ✅ Mock users for development

### Authentication Approach
**Frontend-only** - No backend authentication API required
- User selects role from dropdown (Division, Recovery, Legal, Officer, Admin)
- Credentials stored in localStorage
- Route guards protect pages based on role
- Perfect for quick development and testing
- Uses mock users hardcoded in frontend

### Database Tables
```sql
-- No users table needed - authentication is frontend-only with mock data
-- All user data is hardcoded in the frontend
```

### Mock Users (Frontend)
```typescript
const MOCK_USERS = [
  { id: 1, username: 'Division User', role: 'Division', fullName: 'John Doe' },
  { id: 2, username: 'Recovery User', role: 'Recovery', fullName: 'Jane Smith' },
  { id: 3, username: 'Legal User', role: 'Legal', fullName: 'Mike Johnson' },
  { id: 4, username: 'Officer User', role: 'AuthorizedOfficer', fullName: 'Sarah Williams' },
  { id: 5, username: 'Admin User', role: 'Admin', fullName: 'Admin Admin' }
];
```

---

## **Module 2: Dashboard (Role-Specific)**

### Components
```
src/app/
├── dashboard/
│   ├── division-dashboard/
│   ├── recovery-dashboard/
│   ├── legal-dashboard/
│   ├── officer-dashboard/
│   └── dashboard.service.ts
```

### Features
- ✅ Pending tasks widget
- ✅ Timeline alerts
- ✅ Quick stats (count of NPAs, pending actions)
- ✅ Recent activities
- ✅ Upcoming deadlines

### API Endpoints
```
GET /api/dashboard/division/{userId}
GET /api/dashboard/recovery/{userId}
GET /api/dashboard/legal/{userId}
GET /api/dashboard/officer/{userId}
```

### Sample Dashboard Data
```json
{
  "pendingHandovers": 5,
  "overdueActions": 2,
  "upcomingDeadlines": [
    {
      "accountName": "ABC Society",
      "action": "Submit 13(2) notice",
      "dueDate": "2025-12-25"
    }
  ],
  "recentActivities": []
}
```

---

## **Module 3: Handover Management (Division)**

### Components
```
src/app/
├── handover/
│   ├── handover-form/
│   │   ├── basic-details/
│   │   ├── facility-details/
│   │   ├── security-details/
│   │   ├── valuation-details/
│   │   ├── documentation-details/
│   │   └── ... (14 sections total)
│   ├── handover-list/
│   ├── document-upload/
│   └── handover.service.ts
```

### Features
- ✅ Multi-step form (14 sections)
- ✅ Form validation
- ✅ Auto-save (draft)
- ✅ Document upload (multiple files)
- ✅ Document flagging
- ✅ Checklist validation
- ✅ Submit to Recovery Cell

### API Endpoints
```
GET    /api/handover/all
GET    /api/handover/{id}
POST   /api/handover/create
PUT    /api/handover/{id}
POST   /api/handover/{id}/submit
POST   /api/handover/{id}/documents
GET    /api/handover/{id}/documents
```

### Database Tables
```sql
CREATE TABLE npa_accounts (
    id SERIAL PRIMARY KEY,
    account_name VARCHAR(200) NOT NULL,
    npa_date DATE NOT NULL,
    division_id INT REFERENCES divisions(id),
    regional_office_id INT REFERENCES regional_offices(id),
    business_activity TEXT,
    registered_address TEXT,
    corporate_office TEXT,
    factory_address TEXT,
    factory_running BOOLEAN,
    factory_leased BOOLEAN,
    status VARCHAR(50), -- Draft, Submitted, InRecovery, Closed
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP
);

CREATE TABLE borrower_contacts (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    name VARCHAR(200),
    designation VARCHAR(100),
    contact_details VARCHAR(100),
    address TEXT
);

CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    facility_type VARCHAR(50), -- TermLoan, WorkingCapital
    tenor VARCHAR(100),
    amount DECIMAL(15, 2),
    sanction_date DATE,
    sanction_ref VARCHAR(100),
    documentation_date DATE,
    disbursed_amount DECIMAL(15, 2),
    outstanding_amount DECIMAL(15, 2),
    banking_arrangement TEXT
);

CREATE TABLE securities (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    security_type VARCHAR(50), -- Land, Stock, Building
    asset_type VARCHAR(50), -- Movable, Immovable
    property_address TEXT,
    charge_type VARCHAR(50), -- First, Second, Paripassu
    charge_creation_date DATE,
    is_free_from_encumbrance BOOLEAN
);

CREATE TABLE valuations (
    id SERIAL PRIMARY KEY,
    security_id INT REFERENCES securities(id),
    title_search_date DATE,
    advocate_name VARCHAR(200),
    fmv DECIMAL(15, 2),
    rv DECIMAL(15, 2),
    dsv DECIMAL(15, 2),
    guideline_rate DECIMAL(15, 2),
    valuer_name VARCHAR(200),
    valuation_date DATE,
    cersai_id VARCHAR(100),
    cersai_date DATE
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    document_type VARCHAR(100), -- LoanAgreement, Hypothecation, Mortgage, etc.
    file_name VARCHAR(255),
    file_path TEXT,
    file_size BIGINT,
    uploaded_by INT REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_flagged BOOLEAN DEFAULT FALSE
);

-- Additional tables for sections 6-14 (simplified here)
CREATE TABLE pdc_details (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    pdc_available BOOLEAN,
    pdc_count INT,
    pdc_presented BOOLEAN,
    pdc_dishonored BOOLEAN,
    ni_act_notice_sent BOOLEAN,
    ni_act_case_filed BOOLEAN,
    case_number VARCHAR(100),
    case_status TEXT
);

CREATE TABLE repayment_schedule (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    is_revised BOOLEAN DEFAULT FALSE,
    installment_date DATE,
    installment_amount DECIMAL(15, 2),
    actual_receipt_date DATE
);
```

---

## **Module 4: Recovery Workflow**

### Components
```
src/app/
├── recovery/
│   ├── handover-inbox/
│   ├── notice-generation/
│   │   ├── section-13-2/
│   │   ├── section-13-4/
│   │   └── sale-notice/
│   ├── timeline-tracker/
│   ├── representation-management/
│   └── recovery.service.ts
```

### Features
- ✅ Receive handovers
- ✅ Generate Section 13(2) notice
- ✅ Generate Section 13(4) notice
- ✅ Track representations
- ✅ Timeline monitoring
- ✅ Send to Legal for vetting

### API Endpoints
```
GET  /api/recovery/handovers
POST /api/recovery/notice/13-2
POST /api/recovery/notice/13-4
GET  /api/recovery/representations/{accountId}
POST /api/recovery/representations/{id}/reply
```

### Database Tables
```sql
CREATE TABLE notices (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    notice_type VARCHAR(50), -- Section132, Section134, SaleNotice
    draft_prepared_by INT REFERENCES users(id),
    draft_date DATE,
    vetted_by INT REFERENCES users(id),
    vetted_date DATE,
    issued_by INT REFERENCES users(id),
    issued_date DATE,
    status VARCHAR(50), -- Draft, WithLegal, Vetted, Issued
    notice_content TEXT,
    comments TEXT
);

CREATE TABLE representations (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    notice_id INT REFERENCES notices(id),
    representation_date DATE,
    representation_content TEXT,
    reply_prepared_by INT REFERENCES users(id),
    reply_date DATE,
    reply_content TEXT,
    final_reply_date DATE
);
```

---

## **Module 5: Legal Vetting**

### Components
```
src/app/
├── legal/
│   ├── vetting-queue/
│   ├── document-review/
│   ├── comments-feedback/
│   └── legal.service.ts
```

### Features
- ✅ Pending vetting queue
- ✅ Document viewer
- ✅ Approve/Return with comments
- ✅ Timeline compliance tracking

### API Endpoints
```
GET  /api/legal/pending-vetting
GET  /api/legal/document/{noticeId}
POST /api/legal/approve/{noticeId}
POST /api/legal/return/{noticeId}
```

---

## **Module 6: Authorized Officer Actions**

### Components
```
src/app/
├── officer/
│   ├── notice-issuance/
│   ├── valuation-management/
│   ├── asc-meeting/
│   ├── auction-setup/
│   └── officer.service.ts
```

### Features
- ✅ Issue vetted notices
- ✅ Arrange valuations
- ✅ Schedule ASC meetings
- ✅ Fix reserve price
- ✅ Conduct auctions

### API Endpoints
```
POST /api/officer/issue-notice/{noticeId}
POST /api/officer/valuation/{accountId}
POST /api/officer/asc-meeting
POST /api/officer/auction
```

### Database Tables
```sql
CREATE TABLE asc_meetings (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    meeting_date DATE,
    reserve_price DECIMAL(15, 2),
    members JSONB,
    minutes TEXT,
    convened_by INT REFERENCES users(id)
);

CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    auction_type VARCHAR(50), -- First, Subsequent
    auction_date DATE,
    reserve_price DECIMAL(15, 2),
    highest_bid DECIMAL(15, 2),
    status VARCHAR(50), -- Scheduled, Completed, Cancelled
    outcome TEXT
);
```

---

## **Module 7: Timeline & Notification Engine**

### Components
```
src/app/
├── notifications/
│   ├── notification-center/
│   ├── notification-badge/
│   └── notification.service.ts
├── timeline/
│   ├── timeline-tracker/
│   └── timeline.service.ts
```

### Features
- ✅ 16 predefined triggers
- ✅ Auto-calculate due dates
- ✅ In-app notification popup
- ✅ Notification center
- ✅ Badge counters
- ✅ Mark as read/unread

### API Endpoints
```
GET  /api/notifications/user/{userId}
POST /api/notifications/mark-read/{id}
GET  /api/timeline/account/{accountId}
```

### Database Tables
```sql
CREATE TABLE timelines (
    id SERIAL PRIMARY KEY,
    npa_account_id INT REFERENCES npa_accounts(id),
    trigger_id INT,
    trigger_name VARCHAR(200),
    responsible_role VARCHAR(50),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    status VARCHAR(50), -- Pending, InProgress, Completed, Overdue
    days_allowed INT
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    npa_account_id INT REFERENCES npa_accounts(id),
    notification_type VARCHAR(50), -- TimelineAlert, ActionRequired, StatusUpdate
    title VARCHAR(200),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    priority VARCHAR(20) -- High, Medium, Low
);
```

### Notification Logic (Backend)
```java
@Scheduled(cron = "0 0 9 * * *") // Daily at 9 AM
public void checkTimelines() {
    List<Timeline> upcomingDeadlines = timelineRepository.findUpcomingDeadlines();
    for (Timeline timeline : upcomingDeadlines) {
        createNotification(timeline);
    }
}
```

---

## **Module 8: Reports & Analytics**

### Components
```
src/app/
├── reports/
│   ├── handover-summary/
│   ├── timeline-compliance/
│   ├── recovery-progress/
│   ├── auction-status/
│   └── reports.service.ts
```

### Features
- ✅ Filter by date, division, status
- ✅ Export to PDF/Excel
- ✅ Charts and graphs
- ✅ Print preview

### API Endpoints
```
GET /api/reports/handover-summary
GET /api/reports/timeline-compliance
GET /api/reports/recovery-progress
GET /api/reports/export/{reportType}
```

---

## **Module 9: Master Data Management (Admin)**

### Components
```
src/app/
├── admin/
│   ├── divisions/
│   ├── regional-offices/
│   ├── system-settings/
│   └── admin.service.ts
```

### Features
- ✅ Manage divisions
- ✅ Manage regional offices
- ✅ Configure timeline triggers
- ✅ System parameters

### Database Tables
```sql
CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    division_name VARCHAR(200) UNIQUE NOT NULL,
    division_code VARCHAR(50),
    regional_office_id INT REFERENCES regional_offices(id)
);

CREATE TABLE regional_offices (
    id SERIAL PRIMARY KEY,
    office_name VARCHAR(200) UNIQUE NOT NULL,
    office_code VARCHAR(50),
    address TEXT
);

CREATE TABLE timeline_config (
    id SERIAL PRIMARY KEY,
    trigger_id INT UNIQUE,
    trigger_name VARCHAR(200),
    days_allowed INT,
    responsible_role VARCHAR(50)
);
```

---

## 🛠️ Implementation Priority Order

### **Phase 1: Foundation (Day 1)**
1. ✅ Database setup
2. ✅ Spring Boot project structure
3. ✅ Angular project setup
4. ✅ Authentication module
5. ✅ Basic routing

### **Phase 2: Core Modules (Days 2-3)**
6. ✅ User management
7. ✅ Dashboard (all roles)
8. ✅ Handover form (14 sections)
9. ✅ Document upload

### **Phase 3: Workflow (Days 4-5)**
10. ✅ Recovery workflow
11. ✅ Legal vetting
12. ✅ Officer actions
13. ✅ Timeline engine
14. ✅ Notifications

### **Phase 4: Advanced Features (Day 6)**
15. ✅ Auction management
16. ✅ Reports
17. ✅ Admin panel

### **Phase 5: Testing & Deployment (Day 7)**
18. ✅ Integration testing
19. ✅ Bug fixes
20. ✅ Deployment

---

## 📦 Folder Structure (Angular)

```
src/app/
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── models/
├── shared/
│   ├── components/
│   │   ├── header/
│   │   ├── sidebar/
│   │   ├── notification-badge/
│   │   └── loader/
│   ├── directives/
│   ├── pipes/
│   └── utils/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── handover/
│   ├── recovery/
│   ├── legal/
│   ├── officer/
│   ├── notifications/
│   ├── reports/
│   └── admin/
└── app.component.ts
```

---

## 📦 Folder Structure (Spring Boot)

```
src/main/java/com/ncdc/npa/
├── config/
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── HandoverController.java
│   ├── RecoveryController.java
│   ├── LegalController.java
│   ├── OfficerController.java
│   ├── NotificationController.java
│   └── ReportController.java
├── service/
│   ├── UserService.java
│   ├── HandoverService.java
│   ├── RecoveryService.java
│   ├── TimelineService.java
│   └── NotificationService.java
├── repository/
│   ├── UserRepository.java
│   ├── NPAAccountRepository.java
│   ├── NoticeRepository.java
│   └── TimelineRepository.java
├── model/
│   ├── User.java
│   ├── NPAAccount.java
│   ├── Notice.java
│   └── Timeline.java
├── dto/
│   ├── LoginRequest.java
│   ├── HandoverDTO.java
│   └── NotificationDTO.java
└── NPAApplication.java
```

---

## 🎨 UI/UX Guidelines (Simple Approach)

### Design Principles
- ✅ Clean and minimal
- ✅ Bootstrap grid system
- ✅ Responsive design
- ✅ Consistent color scheme
- ✅ Clear typography

### Color Scheme
```css
:root {
  --primary: #0d6efd;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
  --light: #f8f9fa;
  --dark: #343a40;
}
```

### Key UI Components
- Bootstrap cards for dashboards
- Tables with pagination
- Forms with validation
- Modals for confirmations
- Toast notifications

---

## 🔧 Development Commands

### Angular
```bash
# Install dependencies
npm install

# Run dev server
ng serve

# Build for production
ng build --prod

# Generate component
ng generate component features/handover/handover-form
```

### Spring Boot
```bash
# Run application
mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test
```

### Database
```bash
# Connect to PostgreSQL
psql -U postgres -d npa_recovery

# Run migrations
# (Use Flyway or Liquibase)
```

---

## ✅ Testing Checklist

### Frontend
- [ ] Login/Logout
- [ ] Role-based access
- [ ] Handover form submission
- [ ] Document upload
- [ ] Notifications display
- [ ] Timeline tracking
- [ ] Reports generation

### Backend
- [ ] API authentication
- [ ] CRUD operations
- [ ] File upload
- [ ] Timeline calculations
- [ ] Notification triggers
- [ ] Database queries

---

## 🚀 Deployment

### Frontend (Angular)
- Build: `ng build --prod`
- Deploy to: Apache/Nginx server
- Serve `dist/` folder

### Backend (Spring Boot)
- Build: `mvn clean package`
- Deploy JAR to server
- Run: `java -jar npa-recovery.jar`

### Database (PostgreSQL)
- Create database
- Run schema scripts
- Configure connection in `application.properties`

---

## 📝 Summary

This module-wise approach provides:
✅ Clear separation of concerns  
✅ Step-by-step implementation guide  
✅ Database schema for each module  
✅ API endpoints specification  
✅ Frontend component structure  
✅ Timeline-based development plan  

**Start with Module 1 (Auth) and progressively build each module.**

**Focus on simplicity and functionality over aesthetics for now.**

**Good luck with the one-week sprint! 🎉**
