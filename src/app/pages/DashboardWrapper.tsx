"use client";

import { useUser } from '../context/UserContext';
import { DashboardDoctor } from './DashboardDoctor';
import { DashboardPatient } from './DashboardPatient';

export function DashboardWrapper() {
  const { user } = useUser();

  if (user?.role === 'doctor') {
    return <DashboardDoctor />;
  }

  return <DashboardPatient />;
}
