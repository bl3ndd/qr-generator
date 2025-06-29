export function Faq() {
  const faqs = [
    {
      question: 'Is it really free to create QR codes with Qrafty?',
      answer:
        'Yes! Qrafty allows you to generate unlimited custom QR codes completely free of charge.',
    },
    {
      question: 'Can I customize the colors of my QR code?',
      answer:
        'Absolutely. You can choose any foreground and background colors to match your brand or style.',
    },
    {
      question: 'What file formats are available for download?',
      answer: 'You can download your QR code in SVG, PNG, JPEG, or WEBP formats.',
    },
    {
      question: 'Can I add my logo to the QR code?',
      answer: 'Yes, uploading a logo is easy and helps personalize your QR code.',
    },
    {
      question: 'Will the QR codes work on all devices?',
      answer:
        'Our QR codes are fully compatible with all standard QR code scanners on smartphones and tablets.',
    },
  ]

  return (
    <section className="max-w-5xl mx-auto px-10 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold mb-2">{question}</h3>
            <p className="text-gray-700">{answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
