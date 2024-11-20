import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, updateDoc, addDoc, query, where, getDocs } from 'firebase/firestore';
import InputMask from 'react-input-mask';
import { useParams, useNavigate } from 'react-router-dom';

function CompanyRegister() {
    const [companyData, setCompanyData] = useState({
        name: '',
        emails: [{ email: '', role: '' }],
        cpfCnpj: '',
        phoneNumber: '',
        supportHours: 'De Segunda a Sexta das 9h às 16h'
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { companyId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (companyId) {
            const fetchCompany = async () => {
                try {
                    const companyDoc = doc(db, 'companies', companyId);
                    const docSnapshot = await getDoc(companyDoc);
                    if (docSnapshot.exists()) {
                        setCompanyData(docSnapshot.data());
                    } else {
                        setErrorMessage("Empresa não encontrada.");
                    }
                } catch (error) {
                    setErrorMessage("Erro ao carregar os dados da empresa.");
                }
            };
            fetchCompany();
        }
    }, [companyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEmailChange = (index, value) => {
        const updatedEmails = [...companyData.emails];
        updatedEmails[index].email = value;
        setCompanyData((prevData) => ({ ...prevData, emails: updatedEmails }));
    };

    const handleRoleChange = (index, value) => {
        const updatedEmails = [...companyData.emails];
        updatedEmails[index].role = value;
        setCompanyData((prevData) => ({ ...prevData, emails: updatedEmails }));
    };

    const handleMaskedChange = (name, value) => {
        setCompanyData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
        if (cnpj.length !== 14) return false;

        // Cálculo de validação de CNPJ
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado !== parseInt(digitos.charAt(0))) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        return resultado === parseInt(digitos.charAt(1));
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            error = !emailRegex.test(value) ? 'Insira um e-mail válido.' : '';
        } else if (name === 'cpfCnpj') {
            error = !validateCNPJ(value) ? 'Insira um CNPJ válido.' : '';
        } else if (name === 'phoneNumber') {
            const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
            error = !phoneRegex.test(value) ? 'Insira um telefone válido.' : '';
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const companyCollection = collection(db, 'companies');

            // Verificação de duplicidade de CNPJ para novos cadastros
            if (!companyId) {
                const q = query(companyCollection, where("cpfCnpj", "==", companyData.cpfCnpj));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setErrorMessage('Erro: Este CNPJ já está cadastrado.');
                    return;
                }
            }

            // Atualiza ou cria o registro no Firestore
            if (companyId) {
                const companyDoc = doc(db, 'companies', companyId);
                await updateDoc(companyDoc, companyData);
                setSuccessMessage('Empresa atualizada com sucesso!');
            } else {
                await addDoc(companyCollection, companyData);
                setSuccessMessage('Empresa cadastrada com sucesso!');
            }

            // Remove a mensagem de sucesso e redireciona após 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
                navigate('/company-list');
            }, 3000);
        } catch (error) {
            setErrorMessage('Erro ao cadastrar/atualizar a empresa. Tente novamente.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2>{companyId ? 'Editar Empresa' : 'Cadastro de Empresa'}</h2>
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome da Empresa</label>
                    <input
                        type="text"
                        name="name"
                        value={companyData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">E-mails</label>
                    {companyData.emails.map((emailEntry, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="email"
                                placeholder="E-mail"
                                value={emailEntry.email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                                onBlur={(e) => validateField('email', e.target.value)}
                                className="form-control"
                                required
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                            <input
                                type="text"
                                placeholder="Função (Ex: adm, user)"
                                value={emailEntry.role}
                                onChange={(e) => handleRoleChange(index, e.target.value)}
                                className="form-control mt-2"
                            />
                        </div>
                    ))}
                </div>
                <div className="mb-3">
                    <label className="form-label">CPF/CNPJ</label>
                    <InputMask
                        mask="99.999.999/9999-99"
                        value={companyData.cpfCnpj}
                        onChange={(e) => handleMaskedChange("cpfCnpj", e.target.value)}
                        onBlur={(e) => validateField('cpfCnpj', e.target.value)}
                        className="form-control"
                        required
                    />
                    {errors.cpfCnpj && <div className="text-danger">{errors.cpfCnpj}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Número de Telefone</label>
                    <InputMask
                        mask="(99) 99999-9999"
                        value={companyData.phoneNumber}
                        onChange={(e) => handleMaskedChange("phoneNumber", e.target.value)}
                        onBlur={(e) => validateField('phoneNumber', e.target.value)}
                        className="form-control"
                        required
                    />
                    {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Horário de Suporte</label>
                    <input
                        type="text"
                        name="supportHours"
                        value={companyData.supportHours}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">{companyId ? 'Atualizar Empresa' : 'Cadastrar Empresa'}</button>
            </form>
        </div>
    );
}

export default CompanyRegister;