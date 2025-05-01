import { getTranslations } from 'next-intl/server';
import DownloadVideo from "@/app/components/DownloadVideo";


type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'seo' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
  };
}

export default function Index() {
  return (
        <DownloadVideo />
  );
}
