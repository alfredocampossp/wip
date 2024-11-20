import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            // Consulta o Firestore para verificar o usuário
            const userQuery = query(
                collection(db, 'users'),
                where('email', '==', email)
            );
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                setErrorMessage('Usuário não encontrado.');
                return;
            }

            // Obter os dados do usuário
            const userData = querySnapshot.docs[0].data();

            // Validar a senha
            if (userData.password !== password) {
                setErrorMessage('Senha inválida.');
                return;
            }

            // Redirecionar com base no tipo de usuário
            if (userData.userType === 'banda') {
                navigate('/calendar');
            } else if (userData.userType === 'empresa') {
                navigate('/menu-empresa');
            } else {
                setErrorMessage('Tipo de usuário inválido.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setErrorMessage('Erro ao fazer login. Tente novamente.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Login</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ marginBottom: '10px' }}>
                    E-mail:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </label>
                <label style={{ marginBottom: '20px' }}>
                    Senha:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        required
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;