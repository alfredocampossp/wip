import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Button, Table, Modal, Form } from 'react-bootstrap';

function Agenda() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ date: '', time: '', description: '', price: '' });

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = collection(db, 'events');
            const eventsSnapshot = await getDocs(eventsCollection);
            const eventsList = eventsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(eventsList);
        };

        fetchEvents();
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            const eventsCollection = collection(db, 'events');
            await addDoc(eventsCollection, newEvent);
            setEvents([...events, newEvent]);
            setNewEvent({ date: '', time: '', description: '', price: '' });
            setShowModal(false);
        } catch (error) {
            console.error("Erro ao adicionar evento:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Agenda</h2>
            <Button variant="primary" onClick={handleShowModal}>
                Bloquear Período
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{event.date}</td>
                            <td>{event.time}</td>
                            <td>{event.description}</td>
                            <td>{event.price}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Bloquear Período</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddEvent}>
                        <Form.Group controlId="formDate">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={newEvent.date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTime" className="mt-3">
                            <Form.Label>Horário</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={newEvent.time}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription" className="mt-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newEvent.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrice" className="mt-3">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={newEvent.price}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Adicionar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Agenda;