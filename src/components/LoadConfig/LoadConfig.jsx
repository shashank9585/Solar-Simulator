import React from 'react';
import { LOAD_TYPES } from '../../utils/calculations';
import './LoadConfig.css';

/**
 * Load Configuration Module
 * Allows users to configure multiple electrical loads
 * with different types, power ratings, and operating durations.
 */
function LoadConfig({ loads, onChange, output }) {
    const handleLoadChange = (index, field, value) => {
        const newLoads = [...loads];
        newLoads[index] = { ...newLoads[index], [field]: value };
        onChange(newLoads);
    };

    const addLoad = () => {
        const newLoad = {
            id: Date.now(),
            name: `Load ${loads.length + 1}`,
            type: 'mixed',
            powerW: 100,
            hoursPerDay: 4,
            startHour: 8,
            priority: 3
        };
        onChange([...loads, newLoad]);
    };

    const removeLoad = (index) => {
        if (loads.length > 1) {
            onChange(loads.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="config-module card card--load">
            <div className="section-header">
                <div className="section-header__icon section-header__icon--load">
                    ⚡
                </div>
                <div>
                    <h3 className="section-header__title">Load Configuration</h3>
                    <p className="section-subtitle">Define your electrical loads and schedules</p>
                </div>
            </div>

            <div className="loads-container">
                {loads.map((load, index) => (
                    <div key={load.id} className="load-item">
                        <div className="load-header">
                            <input
                                type="text"
                                value={load.name}
                                onChange={(e) => handleLoadChange(index, 'name', e.target.value)}
                                className="load-name-input"
                                placeholder="Load Name"
                            />
                            {loads.length > 1 && (
                                <button
                                    className="btn-remove"
                                    onClick={() => removeLoad(index)}
                                    title="Remove Load"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <div className="load-config-grid">
                            {/* Load Type */}
                            <div className="input-group">
                                <label>Type</label>
                                <select
                                    value={load.type}
                                    onChange={(e) => handleLoadChange(index, 'type', e.target.value)}
                                >
                                    {Object.entries(LOAD_TYPES).map(([key, { label }]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Power Rating */}
                            <div className="input-group">
                                <label>Power (W)</label>
                                <div className="input-row compact">
                                    <input
                                        type="range"
                                        min="10"
                                        max="2000"
                                        step="10"
                                        value={load.powerW}
                                        onChange={(e) => handleLoadChange(index, 'powerW', Number(e.target.value))}
                                    />
                                    <span className="input-value load-value">{load.powerW}</span>
                                </div>
                            </div>

                            {/* Operating Hours */}
                            <div className="input-group">
                                <label>Hours/Day</label>
                                <div className="input-row compact">
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="24"
                                        step="0.5"
                                        value={load.hoursPerDay}
                                        onChange={(e) => handleLoadChange(index, 'hoursPerDay', Number(e.target.value))}
                                    />
                                    <span className="input-value load-value">{load.hoursPerDay}</span>
                                </div>
                            </div>

                            {/* Start Hour */}
                            <div className="input-group">
                                <label>Start Hour</label>
                                <select
                                    value={load.startHour}
                                    onChange={(e) => handleLoadChange(index, 'startHour', Number(e.target.value))}
                                >
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option key={i} value={i}>
                                            {i.toString().padStart(2, '0')}:00
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div className="input-group">
                                <label>Priority</label>
                                <select
                                    value={load.priority}
                                    onChange={(e) => handleLoadChange(index, 'priority', Number(e.target.value))}
                                >
                                    <option value={1}>1 - Critical</option>
                                    <option value={2}>2 - High</option>
                                    <option value={3}>3 - Medium</option>
                                    <option value={4}>4 - Low</option>
                                    <option value={5}>5 - Optional</option>
                                </select>
                            </div>
                        </div>

                        {/* Individual Load Energy */}
                        <div className="load-energy">
                            Daily: {((load.powerW * load.hoursPerDay) / (LOAD_TYPES[load.type]?.powerFactor || 1)).toFixed(0)} Wh
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn add-load-btn" onClick={addLoad}>
                + Add Load
            </button>

            <div className="divider"></div>

            {/* Output Summary */}
            <div className="output-summary load-output">
                <h4 className="output-title">📊 Total Load Summary</h4>
                <div className="output-grid">
                    <div className="metric metric--load">
                        <span className="metric__label">Peak Demand</span>
                        <span className="metric__value">
                            {output.peakDemandW >= 1000
                                ? (output.peakDemandW / 1000).toFixed(2)
                                : output.peakDemandW.toFixed(0)}
                            <span className="metric__unit">{output.peakDemandW >= 1000 ? 'kW' : 'W'}</span>
                        </span>
                    </div>
                    <div className="metric metric--load">
                        <span className="metric__label">Average Power</span>
                        <span className="metric__value">
                            {output.averagePowerW.toFixed(0)}
                            <span className="metric__unit">W</span>
                        </span>
                    </div>
                    <div className="metric metric--load highlight-load">
                        <span className="metric__label">Daily Consumption</span>
                        <span className="metric__value">
                            {output.totalDailyWh >= 1000
                                ? (output.totalDailyWh / 1000).toFixed(2)
                                : output.totalDailyWh.toFixed(0)}
                            <span className="metric__unit">{output.totalDailyWh >= 1000 ? 'kWh' : 'Wh'}/day</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadConfig;
