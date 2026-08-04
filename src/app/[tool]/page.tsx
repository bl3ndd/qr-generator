import { notFound } from 'next/navigation'
import Link from 'next/link'

import QrGenerator from '@/app/components/QrGenerator'
import { OurProducts } from '@/app/components/OurProducts'
import { qrTools, getQRTool } from '@/lib/qrTypes'

// Страница серверная — иначе не работают generateStaticParams/generateMetadata.
// Поэтому здесь обычная разметка, без antd: его компоненты клиентские и в RSC
// резолвятся в undefined (тот же donate/page.tsx поэтому помечен 'use client').
//
// Статические роуты (/blog, /donate) в App Router приоритетнее динамического
// сегмента, так что он их не перехватывает. dynamicParams=false — всё, чего нет
// в списке, отдаёт 404, а не рендерит пустую страницу под любым адресом.
export const dynamicParams = false

export function generateStaticParams() {
  return qrTools.map((t) => ({ tool: t.slug }))
}

// В Next 15 params — промис, его нужно дождаться.
export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getQRTool(slug)
  if (!tool) return {}
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `https://qrafty.cutbg.org/${tool.slug}` },
  }
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params
  const tool = getQRTool(slug)
  if (!tool) notFound()

  return (
    <div>
      {/* h1 страницы отдаём генератору — он рендерит его первым на экране. */}
      <QrGenerator initialType={tool.type} heading={tool.h1} />

      <section className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-base text-gray-600">{tool.intro}</p>

        <h2 className="text-xl font-semibold mt-10">Where people use it</h2>
        <ul className="mt-3 list-disc pl-5 text-gray-600 space-y-1">
          {tool.useCases.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-10">Questions</h2>
        <div className="mt-3 space-y-6">
          {tool.faq.map((f) => (
            <div key={f.q}>
              <h3 className="font-semibold text-gray-900">{f.q}</h3>
              <p className="mt-1 text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-10">Other QR code types</h2>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {qrTools
            .filter((t) => t.slug !== tool.slug)
            .map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="text-blue-600 hover:underline">
                {t.h1}
              </Link>
            ))}
        </div>
      </section>

      <OurProducts />
    </div>
  )
}
