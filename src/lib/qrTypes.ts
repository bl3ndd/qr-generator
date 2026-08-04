// Посадочные страницы под каждый тип кода.
//
// Вся эта функциональность уже была в генераторе, но жила в выпадающем списке на
// главной — то есть для поиска её не существовало: ранжировать пункт селекта нельзя.
// Здесь у каждого типа появляется свой URL и свой текст под конкретный запрос.
//
// Тексты намеренно разные по существу. Страница про WiFi и страница про vCard —
// это разные задачи разных людей, а не одна страница с подставленным словом.

export type QRToolType = 'wifi' | 'vcard' | 'email' | 'sms' | 'text' | 'crypto' | 'facebook' | 'twitter'

export interface QRTool {
  slug: string
  type: QRToolType
  title: string // <title>
  h1: string
  description: string // meta description
  intro: string
  useCases: string[]
  faq: { q: string; a: string }[]
}

export const qrTools: QRTool[] = [
  {
    slug: 'wifi-qr-code-generator',
    type: 'wifi',
    title: 'WiFi QR Code Generator — Free, No Sign-Up | QRafty',
    h1: 'WiFi QR Code Generator',
    description:
      'Create a QR code that connects phones to your WiFi automatically. Enter the network name and password, download the code, and guests join without typing anything.',
    intro:
      'A WiFi QR code holds your network name, password and security type. When someone points a phone camera at it, the phone offers to join the network — no spelling out a long password across a room. The code is generated here in your browser, so the password is never sent anywhere.',
    useCases: [
      'Guest WiFi in a cafe, bar or waiting room, printed on the table',
      'A holiday rental or hotel room, so guests connect without asking',
      'The office guest network, stuck to the meeting room wall',
      'Home — on the fridge, for visitors and new devices',
    ],
    faq: [
      {
        q: 'Is my WiFi password safe?',
        a: 'The code is built in your browser and nothing is uploaded, so the password never reaches a server. Bear in mind the finished code does contain the password — anyone who scans it can join, which is the point, so put it where only the people you want can see it.',
      },
      {
        q: 'Does it work on both iPhone and Android?',
        a: 'Yes. The format is a standard both platforms understand. On iOS the camera app handles it; on Android it is the camera or the built-in scanner, depending on the phone.',
      },
      {
        q: 'Which security type should I pick?',
        a: 'WPA covers WPA, WPA2 and WPA3, which is almost every modern router. Pick WEP only for genuinely old equipment, and "no password" for an open network.',
      },
    ],
  },
  {
    slug: 'vcard-qr-code-generator',
    type: 'vcard',
    title: 'vCard QR Code Generator — Contact Card QR | QRafty',
    h1: 'vCard QR Code Generator',
    description:
      'Turn your contact details into a QR code. One scan and your name, phone, email and company are saved straight to the phone — no typing, no app needed.',
    intro:
      'A vCard QR code carries a full contact card. Scanning it opens the phone\'s "add contact" screen with every field already filled in. It is the fastest way to hand over your details, and unlike a paper business card it cannot be mistyped.',
    useCases: [
      'On a business card, next to the printed details',
      'In an email signature, so people can save you in one scan',
      'On a conference badge or exhibition stand',
      'On a shop window or van, so customers save the number rather than write it down',
    ],
    faq: [
      {
        q: 'What is a vCard?',
        a: 'It is the standard format phones and address books use for contact details. Because it is a standard, the scan works the same on iPhone, Android and desktop mail clients.',
      },
      {
        q: 'Which fields should I fill in?',
        a: 'Only the ones you want to share. Every field you add makes the code denser and harder to scan from a distance, so if the code will be printed small, keep it to name, phone and email.',
      },
      {
        q: 'Can I update the details later?',
        a: 'Not on a code that is already printed — the details are encoded in the image itself, not fetched from anywhere. Generate a new code when your details change.',
      },
    ],
  },
  {
    slug: 'text-qr-code-generator',
    type: 'text',
    title: 'Text QR Code Generator — Encode Any Text | QRafty',
    h1: 'Text QR Code Generator',
    description:
      'Put any plain text into a QR code — a note, a serial number, a config string, an ID. Encoded exactly as typed, generated in your browser.',
    intro:
      'Not every QR code is a link. This one encodes whatever you type, character for character — no prefix added, no formatting applied. Scanners simply hand the text back. It is what you want for identifiers, machine-readable settings and anything that is not meant to open a website.',
    useCases: [
      'Asset tags and serial numbers on equipment',
      'Configuration strings that a device or kiosk app reads on setup',
      'Shelf and bin labels in a warehouse',
      'Short instructions or a note attached to a physical object',
    ],
    faq: [
      {
        q: 'Will the text open as a website?',
        a: 'No. Because it is not a URL, most scanners just display the text. Note that many phone cameras act automatically on links but stay quiet on plain text — you may need to tap to see it. That is the scanner behaving normally, not a fault in the code.',
      },
      {
        q: 'How much text can fit?',
        a: 'Technically a few thousand characters, but long text makes a dense grid of tiny squares. If the code will be printed, keep it short and print it larger — density is the usual reason a printed code will not scan.',
      },
      {
        q: 'Can I encode JSON or a config string?',
        a: 'Yes, it is encoded verbatim, punctuation included. Whether the app reading it accepts that format is up to that app — the code carries exactly what you typed.',
      },
    ],
  },
  {
    slug: 'email-qr-code-generator',
    type: 'email',
    title: 'Email QR Code Generator — Pre-Filled Message | QRafty',
    h1: 'Email QR Code Generator',
    description:
      'Create a QR code that opens a new email with your address, subject and message already filled in. Free, no sign-up, generated in your browser.',
    intro:
      'Scanning this code opens the phone\'s mail app with a message already addressed to you — subject and body included, if you want them. The person only has to hit send, which removes the two things that stop people writing in: finding the address and working out what to say.',
    useCases: [
      'A feedback or support code on a receipt or packaging',
      'Warranty and returns requests, with the subject pre-set',
      'Event enquiries on a poster, with the event name in the subject line',
      'A "report a problem here" sticker on equipment, pre-filled with the machine ID',
    ],
    faq: [
      {
        q: 'Does the email send automatically?',
        a: 'No, and it should not. The code opens a draft in the person\'s mail app — they still read it and press send. Nothing is sent without them.',
      },
      {
        q: 'Can I pre-fill the subject and body?',
        a: 'Yes, both. Pre-filling the subject is especially useful when you want the replies to sort themselves into the right place.',
      },
      {
        q: 'What if the phone has no mail app set up?',
        a: 'Then the scan will not open anything useful. If your audience might not have mail configured, print the address next to the code as a fallback.',
      },
    ],
  },
  {
    slug: 'sms-qr-code-generator',
    type: 'sms',
    title: 'SMS QR Code Generator — Pre-Written Text Message | QRafty',
    h1: 'SMS QR Code Generator',
    description:
      'Make a QR code that opens a text message to your number with the wording already written. The sender just presses send.',
    intro:
      'This code opens the phone\'s messaging app with your number in the recipient field and the message already typed. It suits anything where you want a short, uniform reply — a keyword, a code, a confirmation — without asking people to copy a number by hand.',
    useCases: [
      'Opt-in keywords for a mailing list',
      'Table service — the message already carries the table number',
      'Quick check-in or attendance confirmations',
      'Requesting a callback, with the reference already in the text',
    ],
    faq: [
      {
        q: 'Is the message sent for me?',
        a: 'No. It opens the messaging app with everything filled in, and the person presses send themselves.',
      },
      {
        q: 'How should I write the phone number?',
        a: 'Use the full international form with the country code, for example +447700900000. A local-format number will not work for anyone scanning from abroad.',
      },
      {
        q: 'Do carriers charge for it?',
        a: 'It is an ordinary text message, so whatever the sender\'s normal rate is applies. Say so on the poster if the audience might not expect it.',
      },
    ],
  },
  {
    slug: 'crypto-qr-code-generator',
    type: 'crypto',
    title: 'Crypto QR Code Generator — BTC, ETH, USDT | QRafty',
    h1: 'Crypto Wallet QR Code Generator',
    description:
      'Turn a wallet address into a QR code for Bitcoin, Ethereum, USDT, Litecoin and more. Scan to pay without copying a long string by hand.',
    intro:
      'Wallet addresses are long, case-sensitive and unforgiving of typos — which is exactly why every wallet app can scan them instead. Paste your address here and get a code the sender points their wallet at. Nothing leaves your browser.',
    useCases: [
      'Accepting payment in person, from a phone or a printed card',
      'A donation code on a website or in a stream overlay',
      'An invoice, so the payer does not retype the address',
      'Your own cold wallet address, kept somewhere safe to receive to',
    ],
    faq: [
      {
        q: 'Plain address or a payment link?',
        a: 'Both work here. A plain address is the most widely accepted — some wallets do not understand the bitcoin: and ethereum: link formats, so if a scan is being refused, try the plain address first.',
      },
      {
        q: 'Can I set the amount in advance?',
        a: 'Yes, in the payment-link format. Wallets that support it will open with the amount already entered; wallets that do not will fall back to reading just the address.',
      },
      {
        q: 'Does the network matter?',
        a: 'Very much. USDT on TRC20 and USDT on ERC20 are different addresses on different chains, and sending to the wrong one loses the funds. Label the code with the network — always.',
      },
    ],
  },
  {
    slug: 'facebook-qr-code-generator',
    type: 'facebook',
    title: 'Facebook QR Code Generator — Link to Your Page | QRafty',
    h1: 'Facebook QR Code Generator',
    description:
      'Create a QR code that opens your Facebook page or profile. Free, customisable with colours and a logo, no account needed.',
    intro:
      'A code that takes people straight to your Facebook page. It saves them searching your name and picking the wrong result out of five similar ones — which is the point where most people give up.',
    useCases: [
      'On shop signage, menus or packaging',
      'On flyers and posters for an event',
      'On a market stall, so visitors follow you before they walk off',
      'On a vehicle or shop window',
    ],
    faq: [
      {
        q: 'What do I put in the username field?',
        a: 'The part of your page address after facebook.com/ — so for facebook.com/myshop, enter myshop.',
      },
      {
        q: 'Does it open in the app or the browser?',
        a: 'If the Facebook app is installed, most phones hand the link to the app. Otherwise it opens in the browser, where the visitor may be asked to log in.',
      },
      {
        q: 'Will it still work if I rename the page?',
        a: 'No. The address is encoded in the image, so a renamed page breaks every printed code. Settle on the name before printing anything.',
      },
    ],
  },
  {
    slug: 'twitter-qr-code-generator',
    type: 'twitter',
    title: 'Twitter / X QR Code Generator — Link to Your Profile | QRafty',
    h1: 'Twitter QR Code Generator',
    description:
      'Make a QR code that opens your Twitter (X) profile, or a pre-written tweet. Customise the colours, add a logo, download instantly.',
    intro:
      'Point people at your profile without making them type a handle they half-remember. You can also pre-write a tweet, so scanning opens the compose screen with your wording already in it.',
    useCases: [
      'Conference slides and speaker badges',
      'A stream overlay or video end card',
      'Printed material where a handle would otherwise be mistyped',
      'Campaign posters, with the hashtag pre-written into the tweet',
    ],
    faq: [
      {
        q: 'Does it still work now the site is X?',
        a: 'Yes. Twitter.com addresses redirect to x.com, so existing codes keep working.',
      },
      {
        q: 'Can I pre-write the tweet?',
        a: 'Yes. Add a message and the scan opens the compose screen with it filled in — useful for hashtags and campaign wording you want people to repeat exactly.',
      },
      {
        q: 'Do I include the @ symbol?',
        a: 'No, just the handle itself.',
      },
    ],
  },
]

export const getQRTool = (slug: string) => qrTools.find((t) => t.slug === slug)
