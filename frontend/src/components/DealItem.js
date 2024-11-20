import React from 'react';

function DealItem({ deal, onRequestChange }) {
    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <img src="https://via.placeholder.com/150" alt="Venue" className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">Data: {deal.date}</h5>
                <p className="card-text">Localização: {deal.location}</p>
                <p className="card-text">De: {deal.startTime} - Até: {deal.endTime}</p>
                <p className="card-text">Valor: R$ {deal.price}</p>
                <p className="card-text">Transporte: R$ {deal.transport}</p>
                <p className="card-text">Observações: {deal.observations}</p>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-success">Confirmado</button>
                    <button className="btn btn-warning" onClick={() => onRequestChange(deal.id)}>Solicitar alteração</button>
                </div>
            </div>
        </div>
    );
}

export default DealItem;