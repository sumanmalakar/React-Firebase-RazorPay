import React, { useState } from 'react';
import Razorpay from 'razorpay';
import firebase from 'firebase/app';
import 'firebase/firestore';

const PaymentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);

  const handlePaymentSuccess = async (response) => {
    try {
      // Initialize Firebase
      const firebaseConfig = {
        apiKey: 'YOUR_FIREBASE_API_KEY',
        authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
        projectId: 'YOUR_FIREBASE_PROJECT_ID',
      };
      firebase.initializeApp(firebaseConfig);

      // Store payment response in Firebase Firestore
      const db = firebase.firestore();
      const paymentData = {
        name,
        email,
        amount,
        razorpayPaymentId: response.razorpay_payment_id,
        // Add more fields as needed
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('payments').add(paymentData);

      console.log('Payment response stored in Firebase:', paymentData);
    } catch (error) {
      console.error('Error storing payment response:', error);
    }
  };

  const initializeRazorpay = () => {
    const options = {
      key: 'YOUR_RAZORPAY_API_KEY',
      amount: amount * 100, // Amount in paisa
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Payment for a Product/Service',
      image: '/path/to/your/logo.png',
      handler: handlePaymentSuccess,
      prefill: {
        name,
        email,
        contact: '1234567890',
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (INR)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={initializeRazorpay}>Pay Now</button>
    </div>
  );
};

export default PaymentForm;
