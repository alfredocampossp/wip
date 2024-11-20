import React, { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import ProposalList from './ProposalList';

const ProposalsPage = () => {
    const [proposals, setProposals] = useState([]);
    const [filteredProposals, setFilteredProposals] = useState([]);
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        const fetchProposals = async () => {
            const data = [
                { id: 1, date: '2024-11-10', time: '18:00', style: 'Rock', cache: 1500, distance: 8 },
                { id: 2, date: '2024-11-15', time: '20:00', style: 'Jazz', cache: 2500, distance: 15 },
            ];
            setProposals(data);
            setFilteredProposals(data);
        };
        fetchProposals();
    }, []);

    const applyFilters = (filters) => {
        setActiveFilters(filters);
        const { date, timeRange, styles, cacheRange, radius } = filters;

        const filtered = proposals.filter((proposal) => {
            const matchesDate = !date || proposal.date === date;
            const matchesTime = (!timeRange.start && !timeRange.end) ||
                (proposal.time >= timeRange.start && proposal.time <= timeRange.end);
            const matchesStyle = styles.length === 0 || styles.includes(proposal.style);
            const matchesCache = proposal.cache >= cacheRange[0] && proposal.cache <= cacheRange[1];
            const matchesRadius = proposal.distance <= radius;

            return matchesDate && matchesTime && matchesStyle && matchesCache && matchesRadius;
        });

        setFilteredProposals(filtered);
    };

    const resetFilters = () => {
        setActiveFilters({});
        setFilteredProposals(proposals);
    };

    return (
        <div className="proposals-page">
            <FilterPanel onApplyFilters={applyFilters} onResetFilters={resetFilters} />
            
            {/* Exibir filtros ativos */}
            <div className="active-filters">
                <h6>Filtros Aplicados:</h6>
                {Object.entries(activeFilters).map(([key, value]) => (
                    value && <span key={key} className="filter-tag">{`${key}: ${value}`}</span>
                ))}
            </div>

            <ProposalList proposals={filteredProposals} />
        </div>
    );
};

export default ProposalsPage;
