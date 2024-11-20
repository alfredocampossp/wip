import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ backgroundColor: '#333', padding: '10px' }}>
            <ul style={{ listStyleType: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
                <li><Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Início</Link></li>
                <li><Link to="/sobre" style={{ color: '#fff', textDecoration: 'none' }}>Sobre</Link></li>
                <li><Link to="/contato" style={{ color: '#fff', textDecoration: 'none' }}>Contato</Link></li>
                <li><Link to="/feedback" style={{ color: '#fff', textDecoration: 'none' }}>Feedback</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;