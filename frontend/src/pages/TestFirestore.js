import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function TestFirestore() {
  const [bands, setBands] = useState([]);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const bandCollection = collection(db, 'bands');
        const bandSnapshot = await getDocs(bandCollection);
        const bandList = bandSnapshot.docs.map(doc => doc.data());
        setBands(bandList);
      } catch (error) {
        console.error("Erro ao carregar bandas:", error.message);
      }
    };

    fetchBands();
  }, []);

  return (
    <div>
      <h2>Teste Firestore</h2>
      <pre>{JSON.stringify(bands, null, 2)}</pre>
    </div>
  );
}

export default TestFirestore;