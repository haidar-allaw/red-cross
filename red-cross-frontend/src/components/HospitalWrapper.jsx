import React from 'react';
import { useSearchParams } from 'react-router-dom';
import HospitalMap from './HospitalMap';
import HospitalList from './HospitalList';

export default function HospitalWrapper() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  // Render list view if view=list, otherwise render map view
  return view === 'list' ? <HospitalList /> : <HospitalMap />;
}
