import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function RequestChangeModal({ show, handleClose, dealId }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Solicitar Alteração</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <button className="btn btn-secondary w-100 mb-2">Alterar Data</button>
                <button className="btn btn-secondary w-100 mb-2">Alterar Horário</button>
                <button className="btn btn-secondary w-100 mb-2">Adicionar Observação</button>
                <button className="btn btn-secondary w-100 mb-2">Contatar Local</button>
                <button className="btn btn-secondary w-100 mb-2">Visualizar Penalidades</button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="primary" onClick={() => { /* Função para enviar a solicitação */ }}>Enviar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RequestChangeModal;