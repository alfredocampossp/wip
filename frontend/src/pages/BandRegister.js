import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

function BandRegister() {
    const [bandData, setBandData] = useState({
        name: '',
        userName: '',
        email: '',
        confirmEmail: '',
        whatsapp: '',
        password: '',
        confirmPassword: '',
        styles: [],
        zipCode: '',
        range: 50,
        portfolioLinks: ['', '', ''],
        prices: [
            { label: 'Segunda a Sexta', amount: '' },
            { label: 'Finais de Semana', amount: '' },
            { label: 'Feriados', amount: '' }
        ],
        duration: '',
        includeFood: false,
        ownEquipment: false,
        notes: '',
        members: '1'
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [newStyle, setNewStyle] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const bandId = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        const loadBandData = async () => {
            if (bandId) {
                try {
                    const bandDoc = await getDoc(doc(db, 'bands', bandId));
                    if (bandDoc.exists()) {
                        setBandData(bandDoc.data());
                    } else {
                        console.error("Banda não encontrada.");
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados da banda:", error);
                }
            }
        };
        loadBandData();
    }, [bandId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setBandData((prevData) => ({ ...prevData, [name]: fieldValue }));

        // Validações específicas
        if (name === 'confirmEmail' && value !== bandData.email) {
            setEmailError('Os e-mails não coincidem.');
        } else if (name === 'confirmEmail') {
            setEmailError('');
        }

        if (name === 'confirmPassword' && value !== bandData.password) {
            setPasswordError('As senhas não coincidem.');
        } else if (name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const handleStyleAdd = () => {
        if (newStyle.trim() !== '') {
            setBandData((prevData) => ({
                ...prevData,
                styles: [...prevData.styles, newStyle]
            }));
            setNewStyle('');
        }
    };

    const handleStyleRemove = (style) => {
        setBandData((prevData) => ({
            ...prevData,
            styles: prevData.styles.filter((s) => s !== style)
        }));
    };

    const handlePortfolioLinkChange = (index, value) => {
        const updatedLinks = [...bandData.portfolioLinks];
        updatedLinks[index] = value;
        setBandData((prevData) => ({ ...prevData, portfolioLinks: updatedLinks }));
    };

    const handlePriceChange = (index, value) => {
        const numericValue = value.replace(/[^\d]/g, '');
        const updatedPrices = [...bandData.prices];
        updatedPrices[index].amount = numericValue;
        setBandData((prevData) => ({ ...prevData, prices: updatedPrices }));
    };

    const formatCurrency = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError || passwordError) {
            setErrorMessage('Corrija os erros antes de salvar.');
            return;
        }

        try {
            if (bandId) {
                await updateDoc(doc(db, 'bands', bandId), bandData);
                setSuccessMessage('Banda atualizada com sucesso!');
            } else {
                const bandCollection = collection(db, 'bands');
                await addDoc(bandCollection, bandData);
                setSuccessMessage('Banda cadastrada com sucesso!');
            }
            setErrorMessage('');
            navigate("/bandas/lista");
        } catch (error) {
            setErrorMessage('Erro ao cadastrar/atualizar a banda. Tente novamente.');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2>{bandId ? "Editar Banda" : "Cadastro de Banda"}</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Nome do Usuário</label>
                        <input
                            type="text"
                            name="userName"
                            value={bandData.userName}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">WhatsApp</label>
                        <InputMask
                            mask="(99) 99999-9999"
                            value={bandData.whatsapp}
                            onChange={(e) => handleChange({ target: { name: 'whatsapp', value: e.target.value } })}
                            className="form-control"
                            required
                        />
                    </div>
                </div>
                    <div className="col">
                        <label className="form-label">Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={bandData.password}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Confirmar Senha</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={bandData.confirmPassword}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {passwordError && <small className="text-danger">{passwordError}</small>}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={bandData.email}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Confirmar E-mail</label>
                        <input
                            type="email"
                            name="confirmEmail"
                            value={bandData.confirmEmail}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {emailError && <small className="text-danger">{emailError}</small>}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Nome da Banda</label>
                        <input
                            type="text"
                            name="name"
                            value={bandData.name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Integrantes</label>
                        <select
                            name="members"
                            value={bandData.members}
                            onChange={handleChange}
                            className="form-select"
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Estilos Musicais</label>
                    <div className="input-group mb-2">
                        <input
                            type="text"
                            value={newStyle}
                            onChange={(e) => setNewStyle(e.target.value)}
                            className="form-control"
                            placeholder="Adicionar estilo"
                        />
                        <button type="button" onClick={handleStyleAdd} className="btn btn-primary">Adicionar</button>
                    </div>
                    <div>
                        {bandData.styles.map((style, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <span className="me-2">{style}</span>
                                <button type="button" onClick={() => handleStyleRemove(style)} className="btn btn-sm btn-danger">Remover</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">CEP</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={bandData.zipCode}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Alcance</label>
                        <input
                            type="range"
                            name="range"
                            min="0"
                            max="100"
                            value={bandData.range}
                            onChange={(e) => setBandData((prevData) => ({ ...prevData, range: parseInt(e.target.value) }))}
                            className="form-range"
                        />
                        <span>{bandData.range} km</span>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Links do Portfólio</label>
                    {bandData.portfolioLinks.map((link, index) => (
                        <input
                            key={index}
                            type="text"
                            value={link}
                            onChange={(e) => handlePortfolioLinkChange(index, e.target.value)}
                            className="form-control mb-2"
                            placeholder={`Link ${index + 1}`}
                        />
                    ))}
                </div>
                <div className="mb-3">
                    <label className="form-label">Preços</label>
                    <div className="row">
                        {bandData.prices.map((price, index) => (
                            <div className="col" key={index}>
                                <label>{price.label}</label>
                                <input
                                    type="text"
                                    placeholder="Preço (R$)"
                                    value={formatCurrency(price.amount)}
                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Duração (Horas)</label>
                        <input
                            type="number"
                            name="duration"
                            value={bandData.duration}
                            onChange={handleChange}
                            className="form-control"
                            min="1"
                            max="24"
                            required
                        />
                    </div>
                    <div className="col form-check">
                        <input
                            type="checkbox"
                            name="includeFood"
                            checked={bandData.includeFood}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Alimentação Inclusa</label>
                    </div>
                    <div className="col form-check">
                        <input
                            type="checkbox"
                            name="ownEquipment"
                            checked={bandData.ownEquipment}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Equipamento Próprio</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea
                        name="notes"
                        value={bandData.notes}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">{bandId ? "Salvar Alterações" : "Cadastrar Banda"}</button>
            </form>
        </div>
    );
}

export default BandRegister;
