import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardWrapper } from './pages/DashboardWrapper';
import { MRIUpload } from './pages/MRIUpload';
import { CaseSearch } from './pages/CaseSearch';
import { PatientHistory } from './pages/PatientHistory';
import { PatientReviewNew } from './pages/PatientReviewNew';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

// กำหนดเส้นทางทั้งหมดของแอป และระบุว่าแต่ละ path จะ render หน้าใด
export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: DashboardWrapper },
      { path: 'mri-upload', Component: MRIUpload },
      { path: 'case-search', Component: CaseSearch },
      { path: 'patient-history', Component: PatientHistory },
      { path: 'patient-review', Component: PatientReviewNew },
      { path: '*', Component: NotFound },
    ],
  },
]);