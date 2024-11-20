import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Modal, Form } from 'react-bootstrap';
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showSpecificTimesModal, setShowSpecificTimesModal] = useState(false);
    const [eventData, setEventData] = useState({
        title: '',
        start: '',
        end: '',
        location: '',
        cache: '',
        address: '',
        contractorPhone: '',
        notes: '',
        isProposal: false,
    });
    const [selectedDate, setSelectedDate] = useState(null);
    const [blockedTimes, setBlockedTimes] = useState([]);
    const [isTimeBlocked, setIsTimeBlocked] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsCollection = collection(db, 'events');
            const eventsSnapshot = await getDocs(eventsCollection);
            const eventsList = eventsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setEvents(eventsList);
        };
        fetchEvents();
    }, []);

    const handleSelectSlot = (slotInfo) => {
        setClickCount(prev => prev + 1);

        setTimeout(() => setClickCount(0), 300);

        if (clickCount === 1) {
            handleDoubleClickSlot(slotInfo);
        } else {
            setSelectedDate({
                start: slotInfo.start,
                end: slotInfo.end
            });
            setIsTimeBlocked(blockedTimes.some(blocked =>
                moment(blocked.start).isSame(slotInfo.start) &&
                moment(blocked.end).isSame(slotInfo.end)
            ));
        }
    };

    const handleDoubleClickSlot = (slotInfo) => {
        setEventData({
            title: '',
            start: moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'),
            end: moment(slotInfo.start).add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
            location: '',
            cache: '',
            address: '',
            contractorPhone: '',
            notes: '',
            isProposal: false,
        });
        setShowModal(true);
    };

    const handleDoubleClickEvent = (event) => {
        setEventData({
            ...event,
            start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
            end: moment(event.end).format('YYYY-MM-DDTHH:mm')
        });
        setShowModal(true);
    };

    const handleAddEvent = () => {
        const start = selectedDate ? selectedDate.start : moment().toDate();
        const end = moment(start).add(1, 'hour').toDate();
        setEventData({
            title: '',
            start: moment(start).format('YYYY-MM-DDTHH:mm'),
            end: moment(end).format('YYYY-MM-DDTHH:mm'),
            location: '',
            cache: '',
            address: '',
            contractorPhone: '',
            notes: '',
            isProposal: false,
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!eventData.title || !eventData.start || !eventData.end) {
            alert("Por favor, preencha todos os campos obrigatórios antes de salvar.");
            return;
        }

        try {
            if (eventData.id) {
                await updateDoc(doc(db, 'events', eventData.id), eventData);
                setEvents(events.map(evt => (evt.id === eventData.id ? eventData : evt)));
            } else {
                const docRef = await addDoc(collection(db, 'events'), eventData);
                setEvents([...events, { ...eventData, id: docRef.id }]);
            }
            setShowModal(false);
        } catch (error) {
            console.error("Erro ao salvar o evento:", error);
            alert("Ocorreu um erro ao salvar o evento. Tente novamente.");
        }
    };

    const handleBlockTime = () => {
        if (selectedDate) {
            setShowBlockModal(true);
        } else {
            alert("Selecione um horário primeiro!");
        }
    };

    const confirmBlockTime = (blockFullDay) => {
        setShowBlockModal(false);

        if (blockFullDay) {
            setBlockedTimes([...blockedTimes, selectedDate]);
            alert("Dia inteiro bloqueado!");
        } else {
            setShowSpecificTimesModal(true);
        }
    };

    const handleSpecificTimesSubmit = () => {
        const timesToBlock = selectedTimes.map(time => ({
            start: moment(selectedDate.start).set({ hour: time, minute: 0 }).toDate(),
            end: moment(selectedDate.start).set({ hour: time + 1, minute: 0 }).toDate()
        }));
        setBlockedTimes([...blockedTimes, ...timesToBlock]);
        setSelectedTimes([]);
        setShowSpecificTimesModal(false);
        alert("Horários específicos bloqueados!");
    };

    const handleTimeSelect = (e) => {
        const time = parseInt(e.target.value);
        setSelectedTimes(prev =>
            prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
        );
    };

    const handleDelete = async () => {
        if (eventData.isProposal) {
            alert("Este compromisso é oriundo de uma proposta e não pode ser excluído.");
            return;
        }

        try {
            await deleteDoc(doc(db, 'events', eventData.id));
            setEvents(events.filter(e => e.id !== eventData.id));
            setShowModal(false);
        } catch (error) {
            console.error("Erro ao excluir o evento:", error);
            alert("Ocorreu um erro ao excluir o evento.");
        }
    };

    const eventStyleGetter = (event) => {
        let backgroundColor = event.isProposal ? '#d9534f' : '#3174ad';
        let style = {
            backgroundColor,
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return { style: style };
    };

    const dateCellStyleGetter = (date) => {
        const blocked = blockedTimes.some(blocked =>
            moment(blocked.start).isSame(date, 'day') && moment(blocked.end).isSame(date, 'day')
        );
        if (blocked) {
            return {
                style: {
                    backgroundColor: '#FF6F61',
                    color: 'white'
                }
            };
        }
        if (moment(date).isSame(selectedDate?.start, 'minute')) {
            return {
                style: {
                    backgroundColor: '#5DADE2',
                    color: 'white'
                }
            };
        }
        return {};
    };

    return (
        <div>
            <h2>Agenda da Banda</h2>
            <Button variant="primary" onClick={handleAddEvent}>Adicionar Compromisso</Button>
            <Button
                variant={isTimeBlocked ? "danger" : "warning"}
                onClick={handleBlockTime}
                className="ms-2"
            >
                {isTimeBlocked ? "Desbloquear Horário" : "Bloquear Horário"}
            </Button>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: '50px' }}
                selectable
                onSelectSlot={handleSelectSlot}
                onDoubleClickEvent={handleDoubleClickEvent}
                eventPropGetter={eventStyleGetter}
                dayPropGetter={dateCellStyleGetter}
                views={['month', 'week', 'day']}
                defaultView="month"
                messages={{
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    today: 'Hoje',
                    previous: 'Anterior',
                    next: 'Próximo',
                    agenda: 'Agenda'
                }}
            />

            {showModal && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{eventData.id ? 'Editar Compromisso' : 'Adicionar Compromisso'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Título</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={eventData.title}
                                    onChange={handleInputChange}
                                    placeholder="Título do compromisso"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Início</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="start"
                                    value={eventData.start}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Término</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="end"
                                    value={eventData.end}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Local</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="location"
                                    value={eventData.location}
                                    onChange={handleInputChange}
                                    placeholder="Local do evento"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Cache</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cache"
                                    value={eventData.cache}
                                    onChange={handleInputChange}
                                    placeholder="Cache"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={eventData.address}
                                    onChange={handleInputChange}
                                    placeholder="Endereço"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Telefone do Contratante</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contractorPhone"
                                    value={eventData.contractorPhone}
                                    onChange={handleInputChange}
                                    placeholder="Telefone do Contratante"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Observações</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="notes"
                                    value={eventData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Observações"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        {!eventData.isProposal && (
                            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
                        )}
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" onClick={handleSave}>Salvar</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showBlockModal && (
                <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Bloquear Horário</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Deseja bloquear o dia inteiro ou selecionar horários específicos?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => confirmBlockTime(true)}>Bloquear Dia Inteiro</Button>
                        <Button variant="primary" onClick={() => confirmBlockTime(false)}>Selecionar Horários Específicos</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {showSpecificTimesModal && (
                <Modal show={showSpecificTimesModal} onHide={() => setShowSpecificTimesModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Selecionar Horários para Bloqueio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {[...Array(24).keys()].map(hour => (
                                <Form.Check
                                    key={hour}
                                    type="checkbox"
                                    label={`${hour}:00 - ${hour + 1}:00`}
                                    value={hour}
                                    onChange={handleTimeSelect}
                                />
                            ))}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSpecificTimesModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSpecificTimesSubmit}>
                            Confirmar Bloqueio de Horários
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Calendar;