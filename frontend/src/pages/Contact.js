import React, { useState } from 'react';

function Contact() {
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para enviar o formulário de contato
        setSuccess(true);
    };

    return (
        <div>
            <h2>Contato</h2>
            {success && <p>Mensagem enviada com sucesso!</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Mensagem</label>
                    <textarea
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>
    );
}

export default Contact;