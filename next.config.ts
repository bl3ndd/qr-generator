import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    // i18n: {
    //     locales: [
    //         "cn", "de", "en", "es", "fr", "hi", "id", "it",
    //         "ja", "kk", "ko", "ky", "ms", "pt", "ru",
    //         "th", "tr", "uz", "vi"
    //     ],
    //     defaultLocale: 'en',
    // },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);