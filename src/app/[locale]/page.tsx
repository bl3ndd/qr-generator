import { getTranslations } from 'next-intl/server';
import QrGenerator from "@/app/components/QrGenerator";


type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const {locale} = await params
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
  };
}

export default function Index() {
  return (
        <QrGenerator />
  );
}
