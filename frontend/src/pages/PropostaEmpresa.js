import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';

function PropostaEmpresa() {
    const [filters, setFilters] = useState({
        date: '',
        time: '',
        style: '',
        minCache: 0,
        maxCache: 10000,
        radius: 50
    });
    const [styles, setStyles] = useState([]);
    const [filteredBands, setFilteredBands] = useState([]);
    const [selectedBand, setSelectedBand] = useState(null);
    const [negotiationForm, setNegotiationForm] = useState({
        date: '',
        time: '',
        offeredCache: '',
        notes: '',
        company: 'Empresa XYZ', // Exemplo de empresa
        address: 'Rua Principal, 123' // Exemplo de endereço
    });
    const [showNegotiationForm, setShowNegotiationForm] = useState(false);

    useEffect(() => {
        const fetchStyles = async () => {
            const bandsCollection = collection(db, 'bands');
            const snapshot = await getDocs(bandsCollection);
            const uniqueStyles = new Set();
            snapshot.docs.forEach(doc => {
                doc.data().styles.forEach(style => uniqueStyles.add(style));
            });
            setStyles([...uniqueStyles]);
        };
        fetchStyles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchBands = async () => {
        const bandsCollection = collection(db, 'bands');
        let q = query(bandsCollection);

        if (filters.style) {
            q = query(q, where('styles', 'array-contains', filters.style));
        }

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => {
            const band = doc.data();
            band.id = doc.id;

            if (filters.date) {
                const dayOfWeek = new Date(filters.date).getDay();
                let priceForDate = null;

                switch (dayOfWeek) {
                    case 0:
                    case 6:
                        priceForDate = band.prices.find(price => price.label === 'Finais de Semana');
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        priceForDate = band.prices.find(price => price.label === 'Segunda a Sexta');
                        break;
                    default:
                        break;
                }

                band.filteredPrice = priceForDate ? priceForDate.amount : null;
            } else {
                band.filteredPrice = null;
            }

            return band;
        });

        setFilteredBands(results);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBands();
    };

    const handleNegotiate = (band) => {
        setSelectedBand(band);
        setNegotiationForm({
            date: '',
            time: '',
            offeredCache: '',
            notes: '',
            company: 'Empresa XYZ', // Preencher com os dados da empresa
            address: 'Rua Principal, 123' // Preencher com os dados da empresa
        });
        setShowNegotiationForm(true);
    };

    const handleNegotiationFormChange = (e) => {
        const { name, value } = e.target;
        setNegotiationForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSendNegotiation = async () => {
        try {
            // Salvar negociação no banco de dados
            await addDoc(collection(db, 'negotiations'), {
                ...negotiationForm,
                bandId: selectedBand.id,
                bandName: selectedBand.name
            });

            // Enviar e-mail com EmailJS
            const formattedDate = new Date(negotiationForm.date).toLocaleDateString();
            const templateParams = {
                to_name: selectedBand.name,
                empresa: negotiationForm.company,
                local: negotiationForm.address,
                data: formattedDate,
                horario: negotiationForm.time,
                cache: new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'BRL'
                }).format(negotiationForm.offeredCache)
            };

            emailjs
                .send(
                    'service_x67zlsg', // ID do serviço
                    'template_mwo5bpq', // ID do template
                    templateParams,
                    'FAEE_4cbxAIgv-E1-' // Chave pública
                )
                .then(() => {
                    alert('Negociação enviada com sucesso!');
                })
                .catch(() => {
                    alert('Erro ao enviar o e-mail de negociação.');
                });

            setShowNegotiationForm(false);
        } catch (error) {
            alert('Erro ao enviar negociação. Tente novamente.');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="container mt-4">
            <h2>Procurar Bandas</h2>
            <form onSubmit={handleSearch}>
                <div className="row mb-3">
                    <div className="col">
                        <label>Data</label>
                        <input
                            type="date"
                            name="date"
                            value={filters.date}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <label>Hora</label>
                        <input
                            type="time"
                            name="time"
                            value={filters.time}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col">
                        <label>Estilo</label>
                        <select
                            name="style"
                            value={filters.style}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">Todos</option>
                            {styles.map(style => (
                                <option key={style} value={style}>
                                    {style}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label>Cache Mínimo</label>
                        <input
                            type="range"
                            name="minCache"
                            min="0"
                            max="10000"
                            value={filters.minCache}
                            onChange={handleChange}
                            className="form-range"
                        />
                        <span>{formatCurrency(filters.minCache)}</span>
                    </div>
                    <div className="col">
                        <label>Cache Máximo</label>
                        <input
                            type="range"
                            name="maxCache"
                            min="0"
                            max="10000"
                            value={filters.maxCache}
                            onChange={handleChange}
                            className="form-range"
                        />
                        <span>{formatCurrency(filters.maxCache)}</span>
                    </div>
                    <div className="col">
                        <label>Raio (km)</label>
                        <input
                            type="range"
                            name="radius"
                            min="0"
                            max="100"
                            value={filters.radius}
                            onChange={handleChange}
                            className="form-range"
                        />
                        <span>{filters.radius} km</span>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Pesquisar
                </button>
            </form>

            <div className="mt-4">
                <h3>Resultados</h3>
                {filteredBands.length > 0 ? (
                    <ul className="list-group">
                        {filteredBands.map(band => (
                            <li key={band.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{band.name}</strong>
                                    <p>Estilo: {band.styles.join(', ')}</p>
                                    <p>Cache: {band.filteredPrice ? formatCurrency(band.filteredPrice) : 'N/A'}</p>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={() => alert(`Contratar ${band.name}`)}
                                    >
                                        Contratar
                                    </button>
                                    <button
                                        className="btn btn-info me-2"
                                        onClick={() => handleNegotiate(band)}
                                    >
                                        Negociar
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => window.location.href = `/bandas/cadastro?id=${band.id}`}
                                    >
                                        Visitar Perfil
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhuma banda encontrada.</p>
                )}
            </div>

            {showNegotiationForm && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Negociar com {selectedBand.name}</h5>
                                <button className="btn-close" onClick={() => setShowNegotiationForm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>Data</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={negotiationForm.date}
                                        onChange={handleNegotiationFormChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={negotiationForm.time}
                                        onChange={handleNegotiationFormChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Cache Oferecido</label>
                                    <input
                                        type="text"
                                        name="offeredCache"
                                        value={formatCurrency(negotiationForm.offeredCache)}
                                        onChange={(e) => handleNegotiationFormChange({
                                            target: { name: 'offeredCache', value: e.target.value.replace(/[^0-9]/g, '') }
                                        })}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Observações</label>
                                    <textarea
                                        name="notes"
                                        value={negotiationForm.notes}
                                        onChange={handleNegotiationFormChange}
                                        className="form-control"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowNegotiationForm(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={handleSendNegotiation}>
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropostaEmpresa;
