import  firebase  from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// import { ref, onUnmounted } from 'vue'

const config = {
    apiKey: "AIzaSyDLmFBnG4KLWck2VOtHGD4bA92depfYUDI",
    authDomain: "consenter-cms.firebaseapp.com",
    projectId: "consenter-cms",
    storageBucket: "consenter-cms.appspot.com",
    messagingSenderId: "933922502857",
    appId: "1:933922502857:web:d7a8a97a06f5f7ebe13518",
    measurementId: "G-ETT1RTW7M9"
}

const firebaseApp = firebase.initializeApp(config)

export const db = firebaseApp.firestore()
const userCollection  = db.collection('users')
// const auth = firebase.auth()

export const createUser = user => {
    return userCollection.add(user)
}

export const getUser = async id => {
    const user = await userCollection.doc(id).get();
    return user.exists ? user.data() : null;
}

export const updateUser = (id, user) => {
    return userCollection.doc(id).update(user);
}

export const delUser = id => {
    return userCollection.doc(id).delete()
}