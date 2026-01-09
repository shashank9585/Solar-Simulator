import React from 'react';
import { formatEnergy, formatPower, formatDuration, formatPercent } from '../../utils/calculations';
import './ResultsDashboard.css';

/**
 * Results Dashboard Component
 * Displays numerical output summary of system analysis.
 * Now includes real-time SoC and autonomy based on current hour.
 */
function ResultsDashboard({
    systemAnalysis,
    solarOutput,
    batteryOutput,
    loadOutput,
    currentHour,
    currentSoC,
    currentAutonomy,
    sustainabilityStatus,
    hasPowerFailure
}) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'sustainable': return 'status-sustainable';
            case 'marginal': return 'status-warning';
            case 'critical': return 'status-critical';
            case 'unstable': return 'status-unstable';
            case 'unsustainable': return 'status-failure';
            default: return '';
        }
    };

    const getBalanceClass = (balance) => {
        if (balance > 0) return 'positive';
        if (balance < 0) return 'negative';
        return 'neutral';
    };

    // Use enhanced status if available
    const displayStatus = sustainabilityStatus || {
        status: systemAnalysis.sustainabilityStatus,
        message: systemAnalysis.sustainabilityStatus?.toUpperCase(),
        detail: '',
        score: systemAnalysis.sustainabilityScore
    };

    return (
        <div className={`results-dashboard ${hasPowerFailure ? 'has-failure' : ''}`}>
            <div className="dashboard-header">
                <h2>📈 System Analysis Results</h2>
                <p className="dashboard-subtitle">
                    Real-time energy balance and sustainability metrics
                </p>
            </div>

            {/* Real-Time Status Bar */}
            <div className="realtime-status-bar">
                <div className="realtime-item">
                    <span className="realtime-label">Current Time</span>
                    <span className="realtime-value">{String(currentHour).padStart(2, '0')}:00</span>
                </div>
                <div className="realtime-item">
                    <span className="realtime-label">Battery SoC</span>
                    <span className={`realtime-value ${currentSoC < 0.3 ? 'danger' : currentSoC < 0.5 ? 'warning' : 'success'}`}>
                        {(currentSoC * 100).toFixed(0)}%
                    </span>
                </div>
                <div className="realtime-item">
                    <span className="realtime-label">Remaining Autonomy</span>
                    <span className={`realtime-value ${!isFinite(currentAutonomy) ? 'success' : currentAutonomy < 2 ? 'danger' : 'normal'}`}>
                        {formatDuration(currentAutonomy)}
                    </span>
                </div>
                <div className="realtime-item">
                    <span className="realtime-label">Status</span>
                    <span className={`realtime-value status-badge-inline ${getStatusClass(displayStatus.status)}`}>
                        {displayStatus.message || 'N/A'}
                    </span>
                </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="metrics-grid primary-metrics">
                {/* Solar Energy */}
                <div className="metric-card solar">
                    <div className="metric-icon">☀️</div>
                    <div className="metric-content">
                        <span className="metric-label">Daily Solar Generation</span>
                        <span className="metric-value">{formatEnergy(systemAnalysis.solarDailyWh)}</span>
                        <span className="metric-secondary">
                            Peak: {formatPower(solarOutput.effectiveCapacityW)}
                        </span>
                    </div>
                </div>

                {/* Load Consumption */}
                <div className={`metric-card load ${hasPowerFailure ? 'failure' : ''}`}>
                    <div className="metric-icon">{hasPowerFailure ? '⚠️' : '⚡'}</div>
                    <div className="metric-content">
                        <span className="metric-label">Daily Load Consumption</span>
                        <span className="metric-value">{formatEnergy(systemAnalysis.loadDailyWh)}</span>
                        <span className="metric-secondary">
                            Peak: {formatPower(systemAnalysis.peakDemandW)}
                        </span>
                    </div>
                </div>

                {/* Net Energy Balance */}
                <div className={`metric-card balance ${getBalanceClass(systemAnalysis.netEnergyBalance)}`}>
                    <div className="metric-icon">{systemAnalysis.netEnergyBalance >= 0 ? '📈' : '📉'}</div>
                    <div className="metric-content">
                        <span className="metric-label">Net Energy Balance</span>
                        <span className="metric-value">
                            {systemAnalysis.netEnergyBalance >= 0 ? '+' : ''}
                            {formatEnergy(systemAnalysis.netEnergyBalance)}
                        </span>
                        <span className="metric-secondary">
                            {systemAnalysis.netEnergyBalance >= 0 ? 'Surplus' : 'Deficit'} per day
                        </span>
                    </div>
                </div>

                {/* Battery Autonomy */}
                <div className="metric-card battery">
                    <div className="metric-icon">🔋</div>
                    <div className="metric-content">
                        <span className="metric-label">Battery Autonomy</span>
                        <span className="metric-value">
                            {formatDuration(systemAnalysis.batteryAutonomyHours)}
                        </span>
                        <span className="metric-secondary">
                            Without solar generation
                        </span>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="metrics-grid secondary-metrics">
                {/* Estimated Runtime */}
                <div className="metric-tile">
                    <span className="tile-label">Estimated Runtime</span>
                    <span className="tile-value">{formatDuration(systemAnalysis.estimatedRuntimeHours)}</span>
                    <span className="tile-hint">Until battery depletion</span>
                </div>

                {/* Solar to Load Ratio */}
                <div className="metric-tile">
                    <span className="tile-label">Solar-to-Load Ratio</span>
                    <span className="tile-value">
                        {isFinite(systemAnalysis.solarToLoadRatio)
                            ? `${(systemAnalysis.solarToLoadRatio * 100).toFixed(0)}%`
                            : '∞'}
                    </span>
                    <span className="tile-hint">
                        {systemAnalysis.solarToLoadRatio >= 1 ? 'Favorable' : 'Undersized'}
                    </span>
                </div>

                {/* Battery Cycles */}
                <div className="metric-tile">
                    <span className="tile-label">Battery Cycles/Day</span>
                    <span className="tile-value">
                        {systemAnalysis.batteryCyclesPerDay.toFixed(2)}
                    </span>
                    <span className="tile-hint">
                        {systemAnalysis.batteryCyclesPerDay <= 1 ? 'Healthy' : 'High cycling'}
                    </span>
                </div>

                {/* Round-trip Efficiency */}
                <div className="metric-tile">
                    <span className="tile-label">System Efficiency</span>
                    <span className="tile-value">
                        {formatPercent(batteryOutput.roundTripEfficiency * solarOutput.combinedEfficiency)}
                    </span>
                    <span className="tile-hint">Solar × Battery</span>
                </div>
            </div>

            {/* Sustainability Status */}
            <div className={`sustainability-panel ${getStatusClass(displayStatus.status)}`}>
                <div className="status-main">
                    <div className="status-icon">
                        {displayStatus.status === 'sustainable' && '✓'}
                        {displayStatus.status === 'marginal' && '⚠'}
                        {displayStatus.status === 'critical' && '⚡'}
                        {displayStatus.status === 'unstable' && '✗'}
                        {displayStatus.status === 'unsustainable' && '🚨'}
                    </div>
                    <div className="status-text">
                        <span className="status-title">
                            {displayStatus.message || displayStatus.status?.toUpperCase()}
                        </span>
                        <span className="status-description">
                            {displayStatus.detail || (
                                <>
                                    {displayStatus.status === 'sustainable' &&
                                        'Your system generates sufficient energy to meet load demands with a healthy surplus.'}
                                    {displayStatus.status === 'marginal' &&
                                        'System is borderline sustainable. Consider increasing solar capacity or reducing loads.'}
                                    {displayStatus.status === 'unstable' &&
                                        'Energy deficit detected. System will eventually deplete battery without intervention.'}
                                    {displayStatus.status === 'unsustainable' &&
                                        'CRITICAL: Battery depletion during operation. Loads will lose power.'}
                                    {displayStatus.status === 'critical' &&
                                        'Battery margin is dangerously low. System may fail under stress.'}
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <div className="status-score">
                    <svg viewBox="0 0 100 100" className="score-ring">
                        <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="#2d3a4f"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(displayStatus.score || 0) * 2.51} 251`}
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="score-value">{displayStatus.score || 0}</div>
                    <div className="score-label">Score</div>
                </div>
            </div>

            {/* Design Recommendations */}
            <div className="recommendations-panel">
                <h4>💡 Design Insights</h4>
                <ul className="recommendations-list">
                    {hasPowerFailure && (
                        <li className="recommendation-item danger">
                            <span className="rec-icon">🚨</span>
                            <span><strong>CRITICAL:</strong> Battery depletes during the day cycle.
                                Increase solar panels or battery capacity immediately.</span>
                        </li>
                    )}
                    {systemAnalysis.netEnergyBalance < 0 && (
                        <li className="recommendation-item warning">
                            <span className="rec-icon">⚠️</span>
                            <span>Consider adding {Math.ceil(Math.abs(systemAnalysis.netEnergyBalance) /
                                (solarOutput.dailyEnergyWh / (solarOutput.installedCapacityW / 350)))} more 350W panels
                                to eliminate energy deficit.</span>
                        </li>
                    )}
                    {systemAnalysis.batteryCyclesPerDay > 1 && (
                        <li className="recommendation-item warning">
                            <span className="rec-icon">🔋</span>
                            <span>High battery cycling detected. Consider increasing battery capacity for longer lifespan.</span>
                        </li>
                    )}
                    {systemAnalysis.batteryAutonomyHours < 4 && (
                        <li className="recommendation-item info">
                            <span className="rec-icon">⏱️</span>
                            <span>Battery autonomy is less than 4 hours. Increase capacity for better resilience.</span>
                        </li>
                    )}
                    {displayStatus.status === 'sustainable' && systemAnalysis.solarToLoadRatio > 1.5 && (
                        <li className="recommendation-item success">
                            <span className="rec-icon">✓</span>
                            <span>Excellent solar sizing! System has significant headroom for future load growth.</span>
                        </li>
                    )}
                    {displayStatus.status === 'sustainable' && systemAnalysis.solarToLoadRatio <= 1.5 && (
                        <li className="recommendation-item success">
                            <span className="rec-icon">✓</span>
                            <span>System is well-balanced between solar generation and load consumption.</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ResultsDashboard;
