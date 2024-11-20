import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function EventModal({ show, handleClose, handleSave, handleDelete, eventToEdit, initialDate }) {
    const [eventData, setEventData] = useState({
        title: '',
        date: initialDate || '',
        startTime: '',
        endTime: '',
        location: '',
        cache: '',
        address: '',
        contractorPhone: '',
        notes: '',
    });

    useEffect(() => {
        if (eventToEdit) {
            setEventData({
                ...eventToEdit,
                date: eventToEdit.start.toISOString().split('T')[0],
                startTime: eventToEdit.start.toTimeString().slice(0, 5),
                endTime: eventToEdit.end.toTimeString().slice(0, 5),
            });
        } else if (initialDate) {
            setEventData((prevData) => ({ ...prevData, date: initialDate }));
        }
    }, [eventToEdit, initialDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleSubmit = () => {
        handleSave(eventData);
        handleClose();
    };

    const onDelete = () => {
        if (handleDelete) {
            handleDelete(eventData);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{eventToEdit ? 'Editar Compromisso' : 'Adicionar Compromisso'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="eventTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={eventData.title}
                            onChange={handleChange}
                            placeholder="Título do compromisso"
                        />
                    </Form.Group>
                    <Form.Group controlId="eventDate">
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={eventData.date}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="eventStartTime">
                        <Form.Label>Horário de Início</Form.Label>
                        <Form.Control
                            type="time"
                            name="startTime"
                            value={eventData.startTime}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="eventEndTime">
                        <Form.Label>Horário de Término</Form.Label>
                        <Form.Control
                            type="time"
                            name="endTime"
                            value={eventData.endTime}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="eventLocation">
                        <Form.Label>Local</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={eventData.location}
                            onChange={handleChange}
                            placeholder="Local do evento"
                        />
                    </Form.Group>
                    <Form.Group controlId="eventCache">
                        <Form.Label>Cachê</Form.Label>
                        <Form.Control
                            type="text"
                            name="cache"
                            value={eventData.cache}
                            onChange={handleChange}
                            placeholder="Valor do cachê"
                        />
                    </Form.Group>
                    <Form.Group controlId="eventAddress">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={eventData.address}
                            onChange={handleChange}
                            placeholder="Endereço do evento"
                        />
                    </Form.Group>
                    <Form.Group controlId="eventContractorPhone">
                        <Form.Label>Telefone do Contratante</Form.Label>
                        <Form.Control
                            type="tel"
                            name="contractorPhone"
                            value={eventData.contractorPhone}
                            onChange={handleChange}
                            placeholder="Número do contratante"
                        />
                    </Form.Group>
                    <Form.Group controlId="eventNotes">
                        <Form.Label>Observações</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="notes"
                            value={eventData.notes}
                            onChange={handleChange}
                            placeholder="Observações adicionais"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {eventToEdit && !eventToEdit.isNegotiated && (
                    <Button variant="danger" onClick={onDelete}>Excluir</Button>
                )}
                <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EventModal;