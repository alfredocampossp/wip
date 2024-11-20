import React from 'react';

function MenuBanda() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Bem-vindo ao Menu da Banda</h1>
            <p>Gerencie seus eventos, portfólio e mais.</p>
            <ul style={{ listStyle: 'none', padding: '0' }}>
                <li><a href="/gerenciar-eventos">Gerenciar Eventos</a></li>
                <li><a href="/portfolio">Portfólio</a></li>
                <li><a href="/configuracoes">Configurações</a></li>
            </ul>
        </div>
    );
}

export default MenuBanda;
