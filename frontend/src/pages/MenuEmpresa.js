import React from 'react';

function MenuEmpresa() {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Bem-vindo ao Menu da Empresa</h1>
            <p>Gerencie suas propostas, eventos e mais.</p>
            <ul style={{ listStyle: 'none', padding: '0' }}>
                <li><a href="/propostas">Propostas</a></li>
                <li><a href="/eventos">Eventos</a></li>
                <li><a href="/configuracoes">Configurações</a></li>
            </ul>
        </div>
    );
}

export default MenuEmpresa;
