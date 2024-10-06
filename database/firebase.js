// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCf_ZAfwwS6FnFIU4BEPVn5dxsmQ1WKTLg',
  authDomain: 'dhakapulse24-9a544.firebaseapp.com',
  projectId: 'dhakapulse24-9a544',
  storageBucket: 'dhakapulse24-9a544.appspot.com',
  messagingSenderId: '935489882630',
  appId: '1:935489882630:web:d20581e328c6e737b89187',
  measurementId: 'G-1DWK7ETQPJ'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
