import { useTranslations } from 'next-intl';
import Link from "next/link";


export function RelatedArticles() {
    const t = useTranslations();

    return (
        <div className="mx-auto mt-4 max-w-6xl">
            <div className="bg-white/90 shadow-xl rounded-2xl px-6 py-8">
                <ul className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                    <li>
                        <Link
                            href="blog/how-to-create-qr-code-online"
                            className={`block px-5 py-3 rounded-xl font-semibold text-base md:text-lg shadow transition hover:shadow-lg`}
                        >
                            {t('article1.title')}
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
