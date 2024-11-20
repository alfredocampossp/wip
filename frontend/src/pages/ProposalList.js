import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ModalMessage from '../components/ModalMessage';

function PropostaList() {
    const [propostas, setPropostas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPropostas = async () => {
            try {
                const propostaCollection = collection(db, 'propostas');
                const propostaSnapshot = await getDocs(propostaCollection);
                const propostaList = propostaSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPropostas(propostaList);
            } catch (error) {
                setModalContent({ title: 'Erro', message: 'Erro ao carregar as propostas.' });
                setShowModal(true);
            }
        };

        fetchPropostas();
    }, []);

    const handleEdit = (propostaId) => {
        navigate(`/proposta-register/${propostaId}`);
    };

    const handleDelete = (propostaId) => {
        setModalContent({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir esta proposta?',
            onConfirm: () => confirmDelete(propostaId)
        });
        setShowModal(true);
    };

    const confirmDelete = async (propostaId) => {
        try {
            await deleteDoc(doc(db, 'propostas', propostaId));
            setPropostas(propostas.filter(proposta => proposta.id !== propostaId));
            setModalContent({ title: 'Exclusão', message: 'Proposta excluída com sucesso!', onConfirm: null });
        } catch (error) {
            setModalContent({ title: 'Erro', message: 'Erro ao excluir a proposta.', onConfirm: null });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="container mt-5">
            <h2>Propostas Cadastradas</h2>
            <ul className="list-group">
                {propostas.map((proposta) => (
                    <li key={proposta.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{proposta.title}</strong>
                            <br />
                            <span>{proposta.description}</span>
                        </div>
                        <div>
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => handleEdit(proposta.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(proposta.id)}
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

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

export default PropostaList;