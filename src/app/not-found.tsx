import Link from 'next/link';
import { nb } from '@/content/nb';

export default function NotFound() {
  return (
    <div className="page">
      <p className="eyebrow blue">404 / AZURELAB</p>
      <h1>{nb.notFound.title}</h1>
      <p className="page-intro">{nb.notFound.description}</p>
      <Link href="/" className="button button-dark" style={{ marginTop: 24 }}>
        {nb.notFound.back}
      </Link>
    </div>
  );
}
