import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardWrapper } from './pages/DashboardWrapper';
import { MRIUpload } from './pages/MRIUpload';
import { Chatbot } from './pages/Chatbot';
import { CaseSearch } from './pages/CaseSearch';
import { PatientHistory } from './pages/PatientHistory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

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
      { path: 'chatbot', Component: Chatbot },
      { path: 'case-search', Component: CaseSearch },
      { path: 'patient-history', Component: PatientHistory },
      { path: '*', Component: NotFound },
    ],
  },
]);