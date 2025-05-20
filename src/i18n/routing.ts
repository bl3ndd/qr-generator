import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: [
        "en", "cn", "de", "en", "es", "fr", "hi", "id", "it",
        "ja", "kk", "ko", "ky", "ms", "pt", "ru", "th",
        "tr", "uz", "vi"
    ],

    // Used when no locale matches
    defaultLocale: 'en'
});