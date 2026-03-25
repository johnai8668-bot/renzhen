import INDEX from '../pages/index.jsx';
import INVOICE from '../pages/invoice.jsx';
import FILES from '../pages/files.jsx';
import CERTIFICATES from '../pages/certificates.jsx';
import KNOWLEDGE from '../pages/knowledge.jsx';
import PROJECTS from '../pages/projects.jsx';
import HOME from '../pages/home.jsx';
import BUSINESS_CARD from '../pages/business-card.jsx';
import ACCOUNTING from '../pages/accounting.jsx';
import SETTINGS from '../pages/settings.jsx';
import LOGIN from '../pages/login.jsx';
import PERMISSION_MANAGEMENT from '../pages/permission-management.jsx';
import AUDIT_DEPARTMENT from '../pages/audit-department.jsx';
import MARKETING_DEPARTMENT from '../pages/marketing-department.jsx';
import GENERAL_MANAGEMENT from '../pages/general-management.jsx';
import CUSTOMER_MANAGEMENT from '../pages/customer-management.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "invoice",
  component: INVOICE
}, {
  id: "files",
  component: FILES
}, {
  id: "certificates",
  component: CERTIFICATES
}, {
  id: "knowledge",
  component: KNOWLEDGE
}, {
  id: "projects",
  component: PROJECTS
}, {
  id: "home",
  component: HOME
}, {
  id: "business-card",
  component: BUSINESS_CARD
}, {
  id: "accounting",
  component: ACCOUNTING
}, {
  id: "settings",
  component: SETTINGS
}, {
  id: "login",
  component: LOGIN
}, {
  id: "permission-management",
  component: PERMISSION_MANAGEMENT
}, {
  id: "audit-department",
  component: AUDIT_DEPARTMENT
}, {
  id: "marketing-department",
  component: MARKETING_DEPARTMENT
}, {
  id: "general-management",
  component: GENERAL_MANAGEMENT
}, {
  id: "customer-management",
  component: CUSTOMER_MANAGEMENT
}]