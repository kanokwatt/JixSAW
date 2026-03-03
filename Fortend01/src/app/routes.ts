import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => {
      const module = await import('./pages/Login');
      return { Component: module.Login };
    },
  },
  {
    path: '/register',
    lazy: async () => {
      const module = await import('./pages/Register');
      return { Component: module.Register };
    },
  },
  {
    path: '/',
    lazy: async () => {
      const module = await import('./components/Layout');
      return { Component: module.Layout };
    },
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import('./pages/DashboardWrapper');
          return { Component: module.DashboardWrapper };
        },
      },
      {
        path: 'mri-upload',
        lazy: async () => {
          const module = await import('./pages/MRIUpload');
          return { Component: module.MRIUpload };
        },
      },
      {
        path: 'case-search',
        lazy: async () => {
          const module = await import('./pages/CaseSearch');
          return { Component: module.CaseSearch };
        },
      },
      {
        path: 'patient-history',
        lazy: async () => {
          const module = await import('./pages/PatientHistory');
          return { Component: module.PatientHistory };
        },
      },
      {
        path: 'patient-review',
        lazy: async () => {
          const module = await import('./pages/PatientReviewNew');
          return { Component: module.PatientReviewNew };
        },
      },
      {
        path: '*',
        lazy: async () => {
          const module = await import('./pages/NotFound');
          return { Component: module.NotFound };
        },
      },
    ],
  },
]);