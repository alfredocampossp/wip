import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ModalMessage from '../components/ModalMessage';

function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const companyCollection = collection(db, 'companies');
                const companySnapshot = await getDocs(companyCollection);
                const companyList = companySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCompanies(companyList);
                setFilteredCompanies(companyList);
            } catch (error) {
                setModalContent({ title: 'Erro', message: 'Erro ao carregar empresas.' });
                setShowModal(true);
            }
        };

        fetchCompanies();
    }, []);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        
        const filtered = companies.filter(company =>
            company.name.toLowerCase().includes(term) ||
            company.cpfCnpj.includes(term)
        );
        setFilteredCompanies(filtered);
    };

    const handleEdit = (companyId) => {
        navigate(`/company-register/${companyId}`);
    };

    const handleDelete = (companyId) => {
        setModalContent({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir esta empresa?',
            onConfirm: () => confirmDelete(companyId)
        });
        setShowModal(true);
    };

    const confirmDelete = async (companyId) => {
        try {
            await deleteDoc(doc(db, 'companies', companyId));
            setCompanies(companies.filter(company => company.id !== companyId));
            setFilteredCompanies(filteredCompanies.filter(company => company.id !== companyId));
            setModalContent({ title: 'Exclusão', message: 'Empresa excluída com sucesso!', onConfirm: null });
        } catch (error) {
            setModalContent({ title: 'Erro', message: 'Erro ao excluir a empresa.', onConfirm: null });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="container mt-5">
            <h2>Empresas Cadastradas</h2>
            <input
                type="text"
                placeholder="Pesquisar por nome ou CNPJ"
                value={searchTerm}
                onChange={handleSearch}
                className="form-control mb-4"
            />
            <ul className="list-group">
                {filteredCompanies.map((company) => (
                    <li key={company.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{company.name}</strong>
                            <br />
                            <span>{company.cpfCnpj}</span>
                        </div>
                        <div>
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => handleEdit(company.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(company.id)}
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal para exibir mensagens */}
            <ModalMessage
                show={showModal}
                handleClose={closeModal}
                title={modalContent.title}
                message={modalContent.message}
                onConfirm={modalContent.onConfirm}
            />
        </div>
    );
}

export default CompanyList;