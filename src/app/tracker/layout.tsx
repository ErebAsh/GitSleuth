import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitSleuth Tracker — Precision Contributor Telemetry',
  description:
    'Search contributor activity, track PR and issue lifecycles, and view exact timestamps with millisecond precision.',
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
