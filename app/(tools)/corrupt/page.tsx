import type { Metadata } from 'next';
import CorruptClient from './CorruptClient';

export const metadata: Metadata = {
  title: 'C:/CORRUPT/SYSTEM',
  description: 'Memory leak detected. Fragments found.',
};

export default function CorruptPage() {
  return <CorruptClient />;
}