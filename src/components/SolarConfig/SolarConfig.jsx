import React from 'react';
import './SolarConfig.css';

/**
 * Solar Configuration Module
 * Allows users to configure solar panel array parameters
 * and displays calculated effective daily energy generation.
 */
function SolarConfig({ config, onChange, output }) {
    const handleChange = (field, value) => {
        onChange({ ...config, [field]: value });
    };

    return (
        <div className="config-module card card--solar">
            <div className="section-header">
                <div className="section-header__icon section-header__icon--solar">
                    ☀️
                </div>
                <div>
                    <h3 className="section-header__title">Solar Configuration</h3>
                    <p className="section-subtitle">Configure your solar array parameters</p>
                </div>
            </div>

            <div className="config-grid">
                {/* Panel Wattage */}
                <div className="input-group">
                    <label>
                        Panel Wattage
                        <span className="tooltip" data-tip="Power rating of each individual solar panel">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="100"
                            max="600"
                            step="10"
                            value={config.panelWattage}
                            onChange={(e) => handleChange('panelWattage', Number(e.target.value))}
                        />
                        <span className="input-value">{config.panelWattage} W</span>
                    </div>
                </div>

                {/* Number of Panels */}
                <div className="input-group">
                    <label>
                        Number of Panels
                        <span className="tooltip" data-tip="Total panels in your solar array">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={config.numberOfPanels}
                            onChange={(e) => handleChange('numberOfPanels', Number(e.target.value))}
                        />
                        <span className="input-value">{config.numberOfPanels}</span>
                    </div>
                </div>

                {/* Sun Hours */}
                <div className="input-group">
                    <label>
                        Peak Sun Hours
                        <span className="tooltip" data-tip="Equivalent hours of peak sunlight per day (PSH)">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={config.sunHours}
                            onChange={(e) => handleChange('sunHours', Number(e.target.value))}
                        />
                        <span className="input-value">{config.sunHours} hrs</span>
                    </div>
                </div>

                {/* Tilt/Orientation Efficiency */}
                <div className="input-group">
                    <label>
                        Tilt/Orientation Efficiency
                        <span className="tooltip" data-tip="How well the panel angle captures sunlight (100% = optimal tilt)">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0.5"
                            max="1"
                            step="0.01"
                            value={config.tiltEfficiency}
                            onChange={(e) => handleChange('tiltEfficiency', Number(e.target.value))}
                        />
                        <span className="input-value">{(config.tiltEfficiency * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Temperature Loss */}
                <div className="input-group">
                    <label>
                        Temperature Loss
                        <span className="tooltip" data-tip="Power reduction due to high panel temperature">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0"
                            max="0.3"
                            step="0.01"
                            value={config.temperatureLoss}
                            onChange={(e) => handleChange('temperatureLoss', Number(e.target.value))}
                        />
                        <span className="input-value loss-value">{(config.temperatureLoss * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Soiling Loss */}
                <div className="input-group">
                    <label>
                        Dust/Soiling Loss
                        <span className="tooltip" data-tip="Power reduction from dust, dirt, or debris on panels">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0"
                            max="0.25"
                            step="0.01"
                            value={config.soilingLoss}
                            onChange={(e) => handleChange('soilingLoss', Number(e.target.value))}
                        />
                        <span className="input-value loss-value">{(config.soilingLoss * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Degradation */}
                <div className="input-group">
                    <label>
                        Panel Degradation
                        <span className="tooltip" data-tip="Cumulative power loss from panel aging (~0.5-1% per year)">?</span>
                    </label>
                    <div className="input-row">
                        <input
                            type="range"
                            min="0"
                            max="0.2"
                            step="0.01"
                            value={config.degradation}
                            onChange={(e) => handleChange('degradation', Number(e.target.value))}
                        />
                        <span className="input-value loss-value">{(config.degradation * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            {/* Output Summary */}
            <div className="output-summary">
                <h4 className="output-title">📊 Calculated Output</h4>
                <div className="output-grid">
                    <div className="metric metric--solar">
                        <span className="metric__label">Installed Capacity</span>
                        <span className="metric__value">
                            {(output.installedCapacityW / 1000).toFixed(2)}
                            <span className="metric__unit">kWp</span>
                        </span>
                    </div>
                    <div className="metric metric--solar">
                        <span className="metric__label">Combined Efficiency</span>
                        <span className="metric__value">
                            {(output.combinedEfficiency * 100).toFixed(1)}
                            <span className="metric__unit">%</span>
                        </span>
                    </div>
                    <div className="metric metric--solar highlight">
                        <span className="metric__label">Daily Energy Generated</span>
                        <span className="metric__value">
                            {output.dailyEnergyWh >= 1000
                                ? (output.dailyEnergyWh / 1000).toFixed(2)
                                : output.dailyEnergyWh.toFixed(0)}
                            <span className="metric__unit">{output.dailyEnergyWh >= 1000 ? 'kWh' : 'Wh'}/day</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SolarConfig;
