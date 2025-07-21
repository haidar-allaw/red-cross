import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './allNeededBlood.css';

export default function AllNeededBlood() {
    const [neededBloodData, setNeededBloodData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:4000/api/centers')
            .then(({ data }) => {
                const needed = data
                    .filter(center => center.neededBloodTypes && center.neededBloodTypes.length > 0)
                    .map(center => ({
                        _id: center._id,
                        name: center.name,
                        neededBloodTypes: center.neededBloodTypes
                    }));
                setNeededBloodData(needed);
            })
            .catch(() => setNeededBloodData([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading hospital data...</p>
            </div>
        );
    }

    return (
        <div className="all-needed-blood-container">
            <div className="page-header">
                <h1 className="page-title">All Hospitals in Need</h1>
                <p className="page-subtitle">
                    Find a medical center near you that urgently requires blood donations.
                </p>
            </div>
            <div className="card-content">
                <div className="needed-blood-grid">
                    {neededBloodData.map((center) => (
                        <div key={center._id} className="needed-blood-card">
                            <h3 className="hospital-name">{center.name}</h3>
                            <ul className="blood-type-list">
                                {center.neededBloodTypes.map((blood) => (
                                    <li key={blood.type} className="blood-type-item">
                                        <span className="blood-type-tag">{blood.type}</span>
                                        <span className="quantity-needed">{blood.quantity} units</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 