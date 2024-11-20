import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ModalMessage({ show, handleClose, title, message, onConfirm }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
                {onConfirm && (
                    <Button variant="danger" onClick={onConfirm}>
                        Confirmar
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ModalMessage;