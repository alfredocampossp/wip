// src/components/FilterPanel.js
import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterPanel = ({ onFilter }) => {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState('');
    const [musicStyle, setMusicStyle] = useState('');
    const [cacheMin, setCacheMin] = useState('');
    const [cacheMax, setCacheMax] = useState('');
    const [radius, setRadius] = useState('');

    const handleFilter = () => {
        onFilter({ date, time, musicStyle, cacheMin, cacheMax, radius });
    };

    return (
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Data Disponível</Form.Label>
                        <DatePicker
                            selected={date}
                            onChange={(d) => setDate(d)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Selecione uma data"
                            className="form-control"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Horário</Form.Label>
                        <Form.Control
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Estilo de Música</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ex: Rock, Jazz"
                            value={musicStyle}
                            onChange={(e) => setMusicStyle(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Cachê Mínimo (R$)</Form.Label>
                        <Form.Control
                            type="number"
                            value={cacheMin}
                            onChange={(e) => setCacheMin(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Cachê Máximo (R$)</Form.Label>
                        <Form.Control
                            type="number"
                            value={cacheMax}
                            onChange={(e) => setCacheMax(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Raio de Distância (km)</Form.Label>
                        <Form.Control
                            type="number"
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                    <Button variant="primary" onClick={handleFilter}>
                        Aplicar Filtros
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FilterPanel;