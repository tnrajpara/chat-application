// creating user
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.log(error);
  }
};

// signing in user with normal username and password ::--> Register.jsx
const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error(error);
  }
};

// sign in with popup

const signWithPop = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const googleAuth = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(googleAuth);
    const token = credential.accessToken;
    const user = googleAuth.user;

    return { token, user };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email);
  }
};

// signing out user

const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};

// reset password

const resetpass = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
  }
};

// confirm password reset

const confirmPassword = async (code, newPassword) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
  } catch (error) {
    console.log(error);
  }
};

export { createUser, signIn, signOut, resetpass, signWithPop };
