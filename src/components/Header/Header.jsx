import React, { useState } from 'react';
import './Header.css';

/**
 * Header Component
 * Application header with title, info modal, and disclaimer.
 */
function Header() {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <>
            <header className="app-header">
                <div className="header-brand">
                    <div className="brand-icon">
                        <svg viewBox="0 0 40 40" className="solar-icon-svg">
                            <defs>
                                <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                            </defs>
                            <circle cx="20" cy="20" r="10" fill="url(#sunGrad)" />
                            <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
                                <line x1="20" y1="2" x2="20" y2="6" />
                                <line x1="20" y1="34" x2="20" y2="38" />
                                <line x1="2" y1="20" x2="6" y2="20" />
                                <line x1="34" y1="20" x2="38" y2="20" />
                                <line x1="7.3" y1="7.3" x2="10.1" y2="10.1" />
                                <line x1="29.9" y1="29.9" x2="32.7" y2="32.7" />
                                <line x1="7.3" y1="32.7" x2="10.1" y2="29.9" />
                                <line x1="29.9" y1="10.1" x2="32.7" y2="7.3" />
                            </g>
                        </svg>
                    </div>
                    <div className="brand-text">
                        <h1>Solar-Battery-Load Simulator</h1>
                        <span className="brand-tagline">Engineering Learning Lab</span>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn header-btn" onClick={() => setShowInfo(true)}>
                        <span>ℹ️</span> About
                    </button>
                </div>
            </header>

            {/* Disclaimer Banner */}
            <div className="disclaimer-banner">
                <span className="disclaimer-icon">📋</span>
                <span className="disclaimer-text">
                    <strong>Educational Simulator:</strong> This tool uses simplified energy models to help users
                    understand system-level design trade-offs rather than detailed electrical behavior.
                </span>
            </div>

            {/* Info Modal */}
            {showInfo && (
                <div className="modal-overlay" onClick={() => setShowInfo(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowInfo(false)}>×</button>

                        <h2>About This Simulator</h2>

                        <div className="modal-section">
                            <h3>🎯 Purpose</h3>
                            <p>
                                This simulator is designed as an educational engineering tool to help college students
                                and early engineers understand how solar configuration, battery storage, and electrical
                                load design together determine system performance, runtime, and sustainability.
                            </p>
                        </div>

                        <div className="modal-section">
                            <h3>📚 Learning Objectives</h3>
                            <ul>
                                <li>Understand why panel sizing matters</li>
                                <li>See how battery capacity limits runtime</li>
                                <li>Learn how load configuration affects sustainability</li>
                                <li>Develop intuition for solar system design trade-offs</li>
                            </ul>
                        </div>

                        <div className="modal-section">
                            <h3>⚠️ Simplifications & Assumptions</h3>
                            <ul className="assumptions-list">
                                <li>DC-equivalent system (no AC conversion modeling)</li>
                                <li>Average power modeling throughout</li>
                                <li>No AC waveform simulation</li>
                                <li>No MPPT internal modeling</li>
                                <li>No grid interaction</li>
                                <li>Simplified Gaussian solar profile</li>
                                <li>No weather variability</li>
                                <li>Battery temperature effects not modeled</li>
                            </ul>
                        </div>

                        <div className="modal-section">
                            <h3>🔬 Calculation Methodology</h3>
                            <p>
                                All calculations use first-order energy balance principles:
                            </p>
                            <ul>
                                <li><strong>Solar:</strong> Energy = Capacity × Sun Hours × Efficiency Factors</li>
                                <li><strong>Battery:</strong> Usable Energy = Capacity × Voltage × DoD × Round-trip Efficiency</li>
                                <li><strong>Load:</strong> Daily Energy = Power × Operating Hours / Power Factor</li>
                            </ul>
                        </div>

                        <div className="modal-footer">
                            <p className="disclaimer-note">
                                This is not a commercial product or high-fidelity electrical simulator.
                                It is an engineering learning lab focused on energy balance and system sizing intuition.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
