import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ModalMessage from '../components/ModalMessage';

function BandList() {
    const [bands, setBands] = useState([]);
    const [filteredBands, setFilteredBands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBands = async () => {
            try {
                const bandCollection = collection(db, 'bands');
                const bandSnapshot = await getDocs(bandCollection);
                const bandList = bandSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBands(bandList);
                setFilteredBands(bandList); // Exibe todas as bandas inicialmente
            } catch (error) {
                setModalContent({ title: 'Erro', message: 'Erro ao carregar bandas.' });
                setShowModal(true);
            }
        };

        fetchBands();
    }, []);

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = bands.filter(band =>
            band.name.toLowerCase().includes(term)
        );
        setFilteredBands(filtered);
    };

    // Redireciona para a página de edição com o ID da banda como parâmetro de URL
    const handleEdit = (bandId) => {
        navigate(`/bandas/cadastro?id=${bandId}`);
    };

    const handleDelete = async (bandId) => {
        setModalContent({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir esta banda?',
            onConfirm: () => confirmDelete(bandId)
        });
        setShowModal(true);
    };

    const confirmDelete = async (bandId) => {
        try {
            await deleteDoc(doc(db, 'bands', bandId));
            setBands(bands.filter(band => band.id !== bandId));
            setFilteredBands(filteredBands.filter(band => band.id !== bandId));
            setModalContent({ title: 'Exclusão', message: 'Banda excluída com sucesso!', onConfirm: null });
        } catch (error) {
            setModalContent({ title: 'Erro', message: 'Erro ao excluir a banda.', onConfirm: null });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return (
        <div className="container mt-5">
            <h2>Bandas Cadastradas</h2>
            <input
                type="text"
                placeholder="Pesquisar por nome da banda"
                value={searchTerm}
                onChange={handleSearch}
                className="form-control mb-4"
            />
            <ul className="list-group">
                {filteredBands.map((band) => (
                    <li key={band.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{band.name}</strong>
                        </div>
                        <div>
                            <button
                                className="btn btn-primary me-2"
                                onClick={() => handleEdit(band.id)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(band.id)}
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

export default BandList;
