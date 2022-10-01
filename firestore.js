// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW7ko6bSX2fctg9coSVgMqv_iNgNttH10",
  authDomain: "ng-fitness-tracker-914f8.firebaseapp.com",
  projectId: "ng-fitness-tracker-914f8",
  storageBucket: "ng-fitness-tracker-914f8.appspot.com",
  messagingSenderId: "753953515628",
  appId: "1:753953515628:web:68652bcca9a5c65dde9049",
  measurementId: "G-TRMP6T6NZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
