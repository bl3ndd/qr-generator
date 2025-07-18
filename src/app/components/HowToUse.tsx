export function HowToUse() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Create Your Free Custom QR Code with Qrafty in 3 Easy Steps
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
        Generate a personalized QR code instantly — no hassle, no cost. Follow these simple steps
        and get your custom QR code ready to use!
      </p>

      <div className="relative space-y-16">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 rounded-lg overflow-hidden">
            <video src="/gifs/enter-text.mp4" autoPlay muted loop playsInline></video>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Step 1: Enter Your Text or URL</h3>
            <p className="text-gray-700">
              Simply type in any text or website URL you want to link to. Our QR code generator
              supports all kinds of content!
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Step 2: Customize Colors</h3>
            <p className="text-gray-700">
              Choose your favorite foreground and background colors using the easy color picker —
              make your QR code truly yours.
            </p>
          </div>
          <div className="flex-1 rounded-2xl overflow-hidden">
            <video src="/gifs/customize.mp4" autoPlay muted loop playsInline></video>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-6">
          <div className="flex-1 rounded-2xl overflow-hidden">
            <video src="/gifs/download.mp4" autoPlay muted loop playsInline></video>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Step 3: Download & Add Your Logo</h3>
            <p className="text-gray-700">
              Pick the perfect file format — SVG, PNG, JPEG, or WEBP — and easily upload your logo
              to personalize your QR code even more.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
