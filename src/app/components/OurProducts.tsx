export function OurProducts() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 bg-gray-50 rounded-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Products</h2>
      <div className="space-y-6 max-w-3xl mx-auto text-center text-gray-700">
        <p>
          We create easy-to-use, free online tools designed to make your life and business easier.
        </p>
        <p>
          One of our popular projects is{' '}
          <a
            href="https://cutbg.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            cutbg
          </a>{' '}
          — a free hub of in-browser image tools: remove backgrounds, compress, convert HEIC,
          resize, crop, remove metadata and more. Everything runs on your device, nothing gets uploaded.
        </p>
        <p>Try it out and see how quickly you can get professional results — no sign-up, no watermark.</p>
      </div>
    </section>
  )
}
