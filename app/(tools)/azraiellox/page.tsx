import { Metadata } from 'next';
import ClientApplicationForm from './ClientApplicationForm';

export const metadata: Metadata = {
  title: 'AzraielLox | Beta Subject Onboarding',
  description: 'Submit your application to become a test subject for AzraielLox. Total PC lockdown, remote surveillance, and compliance testing.',
  openGraph: {
    title: 'AzraielLox | Beta Subject Onboarding',
    description: 'Submit your application to become a test subject for AzraielLox. Total PC lockdown, remote surveillance, and compliance testing.',
    url: 'https://princessazraiel.com/apply', // Update to your actual domain
    siteName: 'PrincessOS',
    images: [
      {
        url: '/guide/1.png', // Uses your first guide image as the link preview!
        width: 1200,
        height: 630,
        alt: 'AzraielLox Interface',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AzraielLox | Beta Subject Onboarding',
    description: 'Submit your application to become a test subject for AzraielLox. Total PC lockdown, remote surveillance, and compliance testing.',
    images: ['/guide/1.png'],
  },
};

export default function ApplyPage() {
  return <ClientApplicationForm />;
}