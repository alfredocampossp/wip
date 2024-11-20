import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import MenuEmpresa from './pages/MenuEmpresa';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                {/* Redirecionamento condicional com base no tipo de usuário */}
                <Route
                    path="/dashboard"
                    element={
                        user ? (
                            user.userType === 'banda' ? (
                                <Navigate to="/calendario" />
                            ) : (
                                <Navigate to="/menu-empresa" />
                            )
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route path="/calendario" element={<Calendar />} />
                <Route path="/menu-empresa" element={<MenuEmpresa />} />
            </Routes>
        </Router>
    );
}

export default App;
