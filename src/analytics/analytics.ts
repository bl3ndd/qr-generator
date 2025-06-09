// firebase.js
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDo23hk562hjAuXZiQUe4KS_g2R7Q3pzkw',
  authDomain: 'qrafty-4a09f.firebaseapp.com',
  projectId: 'qrafty-4a09f',
  storageBucket: 'qrafty-4a09f.firebasestorage.app',
  messagingSenderId: '480931718804',
  appId: '1:480931718804:web:449e6acf3cb6923fa07681',
  measurementId: 'G-GD894G3Q5N',
}

const AnalyticsEvents = {
  qr_download_button_click: 'qr_download_button_click',
  qr_created: 'qr_created',
  foreground_color_click: 'foreground_color_click',
  background_color_click: 'background_color_click',
  format_select_click: 'format_select_click',
  upload_logo_click: 'upload_logo_click',
  language_select_click: 'language_select_click',
  blog_link_click: 'blog_link_click',
  donate_link_click: 'donate_link_click',
  donate_address_copy_button_click: 'donate_address_copy_button_click',
  delete_logo_button_click: 'delete_logo_button_click',
}

// Инициализация Firebase
const app = initializeApp(firebaseConfig)

// Инициализация Analytics (работает только в браузере)
let analytics: Analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export { app, analytics, AnalyticsEvents }
