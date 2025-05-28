const { initializeApp } = require('firebase/app');
const { getAuth, sendPasswordResetEmail } = require('firebase/auth');

// Firebase config - make sure this matches your project
const firebaseConfig = {
  apiKey: "AIzaSyDRi7_kFUUzYOvmNT7gm5S8aOUdaIqEvJE",
  authDomain: "green-leaf-app-a9d22.firebaseapp.com",
  projectId: "green-leaf-app-a9d22",
  storageBucket: "green-leaf-app-a9d22.firebasestorage.app",
  messagingSenderId: "590574633655",
  appId: "1:590574633655:web:b4fb11c9c9ad41e12ade42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function resetPassword() {
  const userEmail = 'dmosken2015@gmail.com';
  
  try {
    await sendPasswordResetEmail(auth, userEmail);
    console.log(`✅ Password reset email sent to: ${userEmail}`);
    console.log('📧 Check your email for password reset instructions.');
    console.log('🔗 Click the link in the email to set a new password.');
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.code, error.message);
  }
}

resetPassword();
