import React, { useState } from 'react';

function Feedback() {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para enviar o feedback
        setSubmitted(true);
    };

    return (
        <div>
            <h2>Feedback</h2>
            {submitted && <p>Feedback enviado com sucesso!</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Seu Feedback</label>
                    <textarea
                        className="form-control"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>
    );
}

export default Feedback;