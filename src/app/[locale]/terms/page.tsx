import { redirect } from 'next/navigation';

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * /[locale]/terms — redirect to /[locale]/termini (canonical URL for T&C).
 * The termini page already handles both IT and EN content based on locale.
 */
export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/termini`);
}
