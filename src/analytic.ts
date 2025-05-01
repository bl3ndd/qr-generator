// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCsseF4tzlddwCA3r44xl3PDcaKMhGVB1w",
    authDomain: "ytdownloader-3ee4e.firebaseapp.com",
    projectId: "ytdownloader-3ee4e",
    storageBucket: "ytdownloader-3ee4e.firebasestorage.app",
    messagingSenderId: "528581347028",
    appId: "1:528581347028:web:b7262bb0d8b9ed74ec1d41",
    measurementId: "G-MP0LVWT5PS"
};

const AnalyticsEvents = {
    PageView: "page_view",
    InputTriggered: "input_triggered",
    SearchButtonClick: "search_button_click",
    DownloadedSuccessful: "downloaded_successful",
    DownloadError: "download_error",
    QualitiesFetched: "qualities_fetched",
    QualitiesFetchedError: "qualities_fetched_error",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Инициализация Analytics (работает только в браузере)
let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { analytics, AnalyticsEvents };