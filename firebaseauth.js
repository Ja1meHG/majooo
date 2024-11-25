 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
 
 const firebaseConfig = {
    apiKey: "AIzaSyAUluF7QMIYxWzixBUmOJPxv96ZkX9sp7g",
    authDomain: "login-form-456c6.firebaseapp.com",
    projectId: "login-form-456c6",
    storageBucket: "login-form-456c6.firebasestorage.app",
    messagingSenderId: "982731642703",
    appId: "1:982731642703:web:6590522c44ad596a7c973a"
  };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 // Function to handle local logs
 function logEvent(eventType, message) {
    const logs = JSON.parse(localStorage.getItem("appLogs")) || [];
    const logEntry = {
        timestamp: new Date().toISOString(),
        eventType: eventType,
        message: message,
    };
    logs.push(logEntry);
    localStorage.setItem("appLogs", JSON.stringify(logs));
    console.log(`[${logEntry.timestamp}] [${eventType}] ${message}`);
 }

 function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
 }

 const signUp = document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };
        logEvent("Registration", `User registered: ${email}`);
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            logEvent("Firestore", `User data saved for: ${email}`);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            logEvent("Error", `Error writing to Firestore: ${error.message}`);
            console.error("Error writing document", error);
        });
    })
    .catch((error) => {
        logEvent("Error", `Registration failed: ${error.message}`);
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        } else {
            showMessage('Unable to create user', 'signUpMessage');
        }
    });
 });

 const signIn = document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        logEvent("Login", `User logged in: ${email}`);
        showMessage('Login is successful', 'signInMessage');
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homepage.html';
    })
    .catch((error) => {
        logEvent("Error", `Login failed: ${error.message}`);
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential') {
            showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
            showMessage('Account does not exist', 'signInMessage');
        }
    });
 });
