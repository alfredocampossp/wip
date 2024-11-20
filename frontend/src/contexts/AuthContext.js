import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().userType); // Certifique-se de que o campo "userType" existe no Firestore
        } else {
          setUserType(null);
        }
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Recuperar o tipo de usuário após o login
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserType(userDoc.data().userType);
      } else {
        throw new Error("Tipo de usuário inválido.");
      }

      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, userType, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};