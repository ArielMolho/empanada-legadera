import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, Timestamp, query, where, deleteDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
  signOut, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider
} from "firebase/auth";

export const getItems = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), id: doc.id });
  });
  return docs;
};

export const getOrdersByUser = async () => {
  const q = query(collection(db, 'orders'), where('user', '==', JSON.parse(sessionStorage.getItem("user"))));
  const querySnapshot = await getDocs(q);
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), id: doc.id });
  });
  return docs;
};

export const getOrdersByDate = async (date) => {
  let startDate = new Date(`${date} 00:01`);
  let endDate = new Date(`${date} 23:59`);
  const q = query(collection(db, 'orders'),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)))
  const querySnapshot = await getDocs(q);
  const docs = [];
  querySnapshot.forEach((doc) => {
    docs.push({ ...doc.data(), id: doc.id });
  });
  return docs;
};

export const createOrder = async (items, total) => {
  const order = await setDoc(doc(db, 'orders', `${Math.random().toString(36).substr(2, 9)}`), {
    user: JSON.parse(sessionStorage.getItem("user")),
    total: total,
    date: Timestamp.fromDate(new Date()),
    items: items
  })
    .catch(err => {
      console.log(err);
      return err;
    });
  return order
}

export const deleteOrder = async (orderId) => {
  const order = await deleteDoc(doc(db, 'orders', orderId))
    .catch(err => {
      console.log(err);
      return err;
    });
  return order
}

export const registerUser = async (registerEmail, registerPassword) => {
  const user = await createUserWithEmailAndPassword(
    auth,
    registerEmail,
    registerPassword
  ).catch(err => {
    return err;
  });
  // console.log(user);//para control
  if (user.user) {
    let token = ("Bearer " + user?.user?.accessToken);
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("user", JSON.stringify(user?.user?.email));
  }
  return user
};

export const loginUser = async (loginEmail, loginPassword) => {
  const user = await signInWithEmailAndPassword(
    auth,
    loginEmail,
    loginPassword
  ).catch(err => {
    return err;
  });
  // console.log(user);//para control
  if (user.user) {
    let token = ("Bearer " + user?.user?.accessToken);
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("user", JSON.stringify(user?.user?.email));
  }
  return user
};

export const loginUserWithGoogle = async () => {
  const user = await signInWithPopup(auth, new GoogleAuthProvider())
    .catch(err => {
      return err;
    });
  if (user.user) {
    let token = ("Bearer " + user?.user?.accessToken);
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("user", JSON.stringify(user?.user?.email));
  }
  return user;
};

export const resetPassword = async (userEmail) => {
  const user = await sendPasswordResetEmail(auth, userEmail)
    .catch(err => {
      return err;
    });
  return user;
};

export const logout = async () => {
  await signOut(auth);
  sessionStorage.clear();
};

export const currentUser = onAuthStateChanged(auth, (currentUser) => {
  // console.log(currentUser);//para control
  return currentUser;
});