import React from 'react';
import { BATTERY_CHEMISTRY } from '../../utils/calculations';
import './BatteryConfig.css';

/**
 * Battery Configuration Module
 * Allows users to configure battery bank parameters
 * and displays calculated usable stored energy and autonomy.
 */
function BatteryConfig({ config, onChange, output, loadPower }) {
    const handleChange = (field, value) => {
        onChange({ ...config, [field]: value });
    };

    // Calculate autonomy in hours
    const autonomyHours = loadPower > 0 ? output.effectiveUsableWh / loadPower : Infinity;

    return (
        <div className="config-module card card--battery">
            <div className="section-header">
                <div className="section-header__icon section-header__icon--battery">
                    🔋
                </div>
                <div>
                    <h3 className="section-header__title">Battery Configuration</h3>
                    <p className="section-subtitle">Configure your battery storage system</p>
                </div>
            </div>

            <div className="config-grid">
                {/* Battery Voltage */}
                <div className="input-group">
                    <label>
                        Battery Bank Voltage
                        <span className="tooltip" data-tip="System voltage (12V typical for small, 48V for larger systems)">?</span>
                    </label>
                    <select
                        value={config.voltage}
                        onChange={(e) => handleChange('voltage', Number(e.target.value))}
                    >
                        <option value={12}>12V System</option>
                        <option value={24}>24V System</option>
                        <option value={48}>48V System</option>
                    </select>
                </div>

                {/* Battery Capacity */}
                <div className="input-group">
                    <label>
                        Battery Capacity
                        <span className="tooltip" data-tip="Total amp-hour capacity of battery bank">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            step="10"
                            value={config.capacity}
                            onChange={(e) => handleChange('capacity', Number(e.target.value))}
                        />
                        <span className="input-value battery-value">{config.capacity} Ah</span>
                    </div>
                </div>

                {/* Battery Chemistry */}
                <div className="input-group">
                    <label>
                        Battery Chemistry
                        <span className="tooltip" data-tip="Battery type affects round-trip efficiency">?</span>
                    </label>
                    <select
                        value={config.chemistry}
                        onChange={(e) => handleChange('chemistry', e.target.value)}
                    >
                        {Object.entries(BATTERY_CHEMISTRY).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Depth of Discharge */}
                <div className="input-group">
                    <label>
                        Depth of Discharge (DoD)
                        <span className="tooltip" data-tip="Maximum allowable discharge (Lead-Acid: 50%, Lithium: 80-90%)">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0.3"
                            max="0.95"
                            step="0.05"
                            value={config.depthOfDischarge}
                            onChange={(e) => handleChange('depthOfDischarge', Number(e.target.value))}
                        />
                        <span className="input-value battery-value">{(config.depthOfDischarge * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Initial State of Charge */}
                <div className="input-group">
                    <label>
                        Initial State of Charge (Start of Day)
                        <span className="tooltip" data-tip="Battery level at 00:00. Adjust to match expected end-of-day level for equilibrium.">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={config.initialSoC || 0.8}
                            onChange={(e) => handleChange('initialSoC', Number(e.target.value))}
                        />
                        <span className="input-value battery-value">{((config.initialSoC || 0.8) * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Charge Efficiency */}
                <div className="input-group">
                    <label>
                        Charge Efficiency
                        <span className="tooltip" data-tip="Energy retained during battery charging">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0.7"
                            max="1"
                            step="0.01"
                            value={config.chargeEfficiency}
                            onChange={(e) => handleChange('chargeEfficiency', Number(e.target.value))}
                        />
                        <span className="input-value battery-value">{(config.chargeEfficiency * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Discharge Efficiency */}
                <div className="input-group">
                    <label>
                        Discharge Efficiency
                        <span className="tooltip" data-tip="Energy delivered during battery discharge">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0.7"
                            max="1"
                            step="0.01"
                            value={config.dischargeEfficiency}
                            onChange={(e) => handleChange('dischargeEfficiency', Number(e.target.value))}
                        />
                        <span className="input-value battery-value">{(config.dischargeEfficiency * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Output Summary */}
            <div className="output-summary battery-output">
                <h4 className="output-title">📊 Calculated Output</h4>
                <div className="output-grid">
                    <div className="metric metric--battery">
                        <span className="metric__label">Total Capacity</span>
                        <span className="metric__value">
                            {(output.totalEnergyWh / 1000).toFixed(2)}
                            <span className="metric__unit">kWh</span>
                        </span>
                    </div>
                    <div className="metric metric--battery">
                        <span className="metric__label">Round-Trip Efficiency</span>
                        <span className="metric__value">
                            {(output.roundTripEfficiency * 100).toFixed(1)}
                            <span className="metric__unit">%</span>
                        </span>
                    </div>
                    <div className="metric metric--battery highlight-battery">
                        <span className="metric__label">Usable Stored Energy</span>
                        <span className="metric__value">
                            {output.effectiveUsableWh >= 1000
                                ? (output.effectiveUsableWh / 1000).toFixed(2)
                                : output.effectiveUsableWh.toFixed(0)}
                            <span className="metric__unit">{output.effectiveUsableWh >= 1000 ? 'kWh' : 'Wh'}</span>
                        </span>
                    </div>
                    <div className="metric metric--battery highlight-battery">
                        <span className="metric__label">Battery Autonomy</span>
                        <span className="metric__value">
                            {isFinite(autonomyHours)
                                ? autonomyHours >= 24
                                    ? (autonomyHours / 24).toFixed(1)
                                    : autonomyHours.toFixed(1)
                                : '∞'}
                            <span className="metric__unit">{isFinite(autonomyHours) ? (autonomyHours >= 24 ? 'days' : 'hours') : ''}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BatteryConfig;
