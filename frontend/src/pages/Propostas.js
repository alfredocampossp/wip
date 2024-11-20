import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button, Form, Row, Col } from 'react-bootstrap';

const Propostas = () => {
    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [filters, setFilters] = useState({
        date: '',
        time: '',
        musicStyle: '',
        fee: '',
        radius: ''
    });

    useEffect(() => {
        const fetchProposals = async () => {
            const proposalsCollection = collection(db, 'proposals');
            const proposalsSnapshot = await getDocs(proposalsCollection);
            const proposalsList = proposalsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProposals(proposalsList);
            setFilteredProposals(proposalsList);
        };
        fetchProposals();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        let filtered = proposals;

        if (filters.date) {
            filtered = filtered.filter(proposal => proposal.date === filters.date);
        }

        if (filters.time) {
            filtered = filtered.filter(proposal => proposal.time === filters.time);
        }

        if (filters.musicStyle) {
            filtered = filtered.filter(proposal => proposal.musicStyle.includes(filters.musicStyle));
        }

        if (filters.fee) {
            filtered = filtered.filter(proposal => proposal.fee <= parseFloat(filters.fee));
        }

        if (filters.radius) {
            filtered = filtered.filter(proposal => proposal.radius <= parseInt(filters.radius));
        }

        setFilteredProposals(filtered);
    };

    const resetFilters = () => {
        setFilters({
            date: '',
            time: '',
            musicStyle: '',
            fee: '',
            radius: ''
        });
        setFilteredProposals(proposals);
    };

    return (
        <div>
            <h2>Propostas</h2>
            <Form>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="filterDate">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="filterTime">
                            <Form.Label>Horário</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={filters.time}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="filterMusicStyle">
                            <Form.Label>Estilo de Música</Form.Label>
                            <Form.Control
                                type="text"
                                name="musicStyle"
                                placeholder="Ex.: Rock, Jazz"
                                value={filters.musicStyle}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="filterFee">
                            <Form.Label>Cachê Máximo (R$)</Form.Label>
                            <Form.Control
                                type="number"
                                name="fee"
                                placeholder="Ex.: 500"
                                value={filters.fee}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="filterRadius">
                            <Form.Label>Raio (Km)</Form.Label>
                            <Form.Control
                                type="number"
                                name="radius"
                                placeholder="Ex.: 30"
                                value={filters.radius}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" onClick={applyFilters}>Aplicar Filtros</Button>{' '}
                <Button variant="secondary" onClick={resetFilters}>Limpar Filtros</Button>
            </Form>

            <h3 className="mt-4">Resultados</h3>
            {filteredProposals.length > 0 ? (
                <ul>
                    {filteredProposals.map(proposal => (
                        <li key={proposal.id}>
                            <strong>Data:</strong> {proposal.date} - <strong>Horário:</strong> {proposal.time} - 
                            <strong>Estilo:</strong> {proposal.musicStyle} - <strong>Cachê:</strong> R${proposal.fee} - 
                            <strong>Raio:</strong> {proposal.radius} km
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma proposta encontrada com os filtros aplicados.</p>
            )}
        </div>
    );
};

export default Propostas;