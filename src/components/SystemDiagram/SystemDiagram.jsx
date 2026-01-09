import React, { useMemo } from 'react';
import './SystemDiagram.css';

/**
 * System Diagram Component
 * Dynamic SVG visualization of the solar-battery-load system
 * showing real-time energy flow based on current hour and power levels.
 */
function SystemDiagram({
    solarOutput,
    batteryOutput,
    loadOutput,
    systemAnalysis,
    currentHour,
    currentSolarPowerW,
    currentLoadPowerW,
    currentSoC,
    energyFlow,
    sustainabilityStatus,
    hasPowerFailure
}) {
    // Calculate flow metrics for visualization
    const maxPower = Math.max(solarOutput.effectiveCapacityW, loadOutput.peakDemandW, 1);

    // Flow line thickness based on power (2-12px range)
    const solarFlowThickness = useMemo(() => {
        return Math.max(2, Math.min(12, (currentSolarPowerW / maxPower) * 12));
    }, [currentSolarPowerW, maxPower]);

    const loadFlowThickness = useMemo(() => {
        return Math.max(2, Math.min(12, (currentLoadPowerW / maxPower) * 12));
    }, [currentLoadPowerW, maxPower]);

    const batteryFlowThickness = useMemo(() => {
        return Math.max(2, Math.min(12, (energyFlow.batteryFlowW / maxPower) * 12));
    }, [energyFlow.batteryFlowW, maxPower]);

    // Animation speed based on power flow intensity (faster = more power)
    const getAnimationDuration = (power) => {
        const intensity = Math.min(1, power / (maxPower * 0.5));
        return Math.max(0.3, 2 - intensity * 1.7); // 0.3s to 2s
    };

    // Is it daytime? (for sun icon)
    const isDaytime = currentHour >= 6 && currentHour < 18;

    // Battery fill level (0-5 bars)
    const batteryFillLevel = Math.round(currentSoC * 5);

    // Status colors
    const getStatusColor = () => {
        if (hasPowerFailure) return '#ef4444';
        switch (sustainabilityStatus?.status) {
            case 'sustainable': return '#22c55e';
            case 'marginal': return '#eab308';
            case 'critical': return '#f97316';
            case 'unstable': return '#ef4444';
            case 'unsustainable': return '#ef4444';
            default: return '#64748b';
        }
    };

    const statusColor = getStatusColor();

    return (
        <div className="system-diagram-container">
            <div className="diagram-header">
                <div className="diagram-title-section">
                    <h3>⚙️ System Overview</h3>
                    <div className="time-display">
                        <span className="time-icon">{isDaytime ? '☀️' : '🌙'}</span>
                        <span className="time-value">{String(currentHour).padStart(2, '0')}:00</span>
                    </div>
                </div>
                <div
                    className={`sustainability-indicator ${hasPowerFailure ? 'failure-pulse' : ''}`}
                    style={{
                        backgroundColor: `${statusColor}20`,
                        borderColor: statusColor,
                        color: statusColor
                    }}
                >
                    <span className="indicator-dot" style={{ backgroundColor: statusColor }}></span>
                    {sustainabilityStatus?.message || 'ANALYZING'}
                </div>
            </div>

            <svg
                viewBox="0 0 800 320"
                className="system-diagram-svg"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Gradients */}
                    <linearGradient id="solarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                    <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="loadGradientNormal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="loadGradientFailure" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>

                    {/* Dynamic flow patterns - Solar to Battery */}
                    <pattern id="solarFlowPattern" patternUnits="userSpaceOnUse" width="20" height={solarFlowThickness}>
                        <rect width="12" height={solarFlowThickness} fill="#fbbf24" opacity="0.8" rx="2">
                            <animate
                                attributeName="x"
                                from="-12"
                                to="20"
                                dur={`${getAnimationDuration(energyFlow.solarToBatteryW)}s`}
                                repeatCount="indefinite"
                            />
                        </rect>
                    </pattern>

                    {/* Battery charging pattern */}
                    <pattern id="chargePattern" patternUnits="userSpaceOnUse" width="20" height={batteryFlowThickness}>
                        <rect width="12" height={batteryFlowThickness} fill="#22c55e" opacity="0.8" rx="2">
                            <animate
                                attributeName="x"
                                from="-12"
                                to="20"
                                dur={`${getAnimationDuration(energyFlow.solarToBatteryW)}s`}
                                repeatCount="indefinite"
                            />
                        </rect>
                    </pattern>

                    {/* Battery discharging pattern - Red, flows Left to Right (Battery -> Load) */}
                    <pattern id="dischargePattern" patternUnits="userSpaceOnUse" width="20" height={batteryFlowThickness}>
                        <rect width="12" height={batteryFlowThickness} fill="#ef4444" opacity="0.8" rx="2">
                            <animate
                                attributeName="x"
                                from="-12"
                                to="20"
                                dur={`${getAnimationDuration(energyFlow.batteryToLoadW)}s`}
                                repeatCount="indefinite"
                            />
                        </rect>
                    </pattern>

                    {/* Load flow pattern */}
                    <pattern id="loadFlowPattern" patternUnits="userSpaceOnUse" width="20" height={loadFlowThickness}>
                        <rect width="12" height={loadFlowThickness} fill={hasPowerFailure ? '#ef4444' : '#8b5cf6'} opacity="0.8" rx="2">
                            <animate
                                attributeName="x"
                                from="-12"
                                to="20"
                                dur={`${getAnimationDuration(currentLoadPowerW)}s`}
                                repeatCount="indefinite"
                            />
                        </rect>
                    </pattern>

                    {/* Glow filters */}
                    <filter id="solarGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feFlood floodColor="#fbbf24" floodOpacity="0.6" />
                        <feComposite in2="blur" operator="in" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="batteryGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feFlood floodColor="#10b981" floodOpacity="0.6" />
                        <feComposite in2="blur" operator="in" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="loadGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feFlood floodColor={hasPowerFailure ? '#ef4444' : '#8b5cf6'} floodOpacity="0.6" />
                        <feComposite in2="blur" operator="in" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="failureGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feFlood floodColor="#ef4444" floodOpacity="0.8" />
                        <feComposite in2="blur" operator="in" />
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background */}
                <rect x="0" y="0" width="800" height="320" fill="#0a0e17" rx="12" />

                {/* ===== CONNECTION LINES WITH DYNAMIC FLOW ===== */}

                {/* Solar to Battery connection - base line */}
                <path
                    d="M 190 140 L 320 140"
                    stroke="#2d3a4f"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Solar to Battery - animated flow (only when surplus flowing to battery) */}
                {energyFlow.solarToBatteryW > 0 && (
                    <g>
                        <path
                            d="M 190 140 L 320 140"
                            stroke="url(#solarFlowPattern)"
                            strokeWidth={solarFlowThickness}
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Power label on line */}
                        <rect x="215" y="110" width="70" height="22" rx="4" fill="#1a2332" stroke="#fbbf24" strokeWidth="1" />
                        <text x="250" y="125" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">
                            {energyFlow.solarToBatteryW >= 1000 ? `${(energyFlow.solarToBatteryW / 1000).toFixed(1)}kW` : `${energyFlow.solarToBatteryW.toFixed(0)}W`}
                        </text>
                    </g>
                )}

                {/* Battery to Load connection - base line */}
                <path
                    d="M 480 140 L 610 140"
                    stroke="#2d3a4f"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Battery to Load - animated flow (based on charging vs discharging) */}
                {currentLoadPowerW > 0 && (
                    <g>
                        <path
                            d="M 480 140 L 610 140"
                            stroke={energyFlow.isCharging ? "url(#chargePattern)" : "url(#dischargePattern)"}
                            strokeWidth={loadFlowThickness}
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Power label on line */}
                        <rect x="505" y="110" width="70" height="22" rx="4" fill="#1a2332" stroke={hasPowerFailure ? '#ef4444' : '#8b5cf6'} strokeWidth="1" />
                        <text x="540" y="125" textAnchor="middle" fill={hasPowerFailure ? '#ef4444' : '#8b5cf6'} fontSize="11" fontFamily="JetBrains Mono">
                            {currentLoadPowerW >= 1000 ? `${(currentLoadPowerW / 1000).toFixed(1)}kW` : `${currentLoadPowerW.toFixed(0)}W`}
                        </text>
                    </g>
                )}

                {/* Flow direction arrows */}
                <polygon
                    points="305,130 320,140 305,150"
                    fill={currentSolarPowerW > 0 ? '#fbbf24' : '#2d3a4f'}
                    className={currentSolarPowerW > 0 ? 'pulse' : ''}
                />
                <polygon
                    points="595,130 610,140 595,150"
                    fill={currentLoadPowerW > 0 ? (hasPowerFailure ? '#ef4444' : '#8b5cf6') : '#2d3a4f'}
                    className={currentLoadPowerW > 0 ? 'pulse' : ''}
                />

                {/* ===== SOLAR PANEL GROUP ===== */}
                <g transform="translate(50, 60)" filter={currentSolarPowerW > 0 ? "url(#solarGlow)" : ""}>
                    {/* Panel Frame */}
                    <rect
                        x="0" y="0"
                        width="140" height="160"
                        rx="8"
                        fill="#1a2332"
                        stroke="url(#solarGradient)"
                        strokeWidth="2"
                        opacity={isDaytime ? 1 : 0.5}
                    />

                    {/* Panel Cells Grid - brightness based on current power */}
                    <g fill="#0f172a" stroke="#fbbf24" strokeWidth="0.5">
                        {[0, 1, 2, 3].map(row => (
                            [0, 1, 2].map(col => {
                                const cellIntensity = isDaytime ? Math.min(0.8, (currentSolarPowerW / solarOutput.effectiveCapacityW) * 0.8) : 0;
                                return (
                                    <rect
                                        key={`${row}-${col}`}
                                        x={10 + col * 42}
                                        y={10 + row * 36}
                                        width="36"
                                        height="30"
                                        rx="2"
                                        fill={`rgba(251, 191, 36, ${0.1 + cellIntensity + row * 0.05})`}
                                        opacity={isDaytime ? 1 : 0.3}
                                    />
                                );
                            })
                        ))}
                    </g>

                    {/* Sun/Moon Icon */}
                    {isDaytime ? (
                        <g>
                            <circle cx="70" cy="-15" r="14" fill="#fbbf24" opacity={currentSolarPowerW > 0 ? 1 : 0.4}>
                                {currentSolarPowerW > 0 && (
                                    <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
                                )}
                            </circle>
                            {/* Sun rays */}
                            {currentSolarPowerW > 0 && [0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                                <line
                                    key={angle}
                                    x1={70 + Math.cos(angle * Math.PI / 180) * 20}
                                    y1={-15 + Math.sin(angle * Math.PI / 180) * 20}
                                    x2={70 + Math.cos(angle * Math.PI / 180) * 26}
                                    y2={-15 + Math.sin(angle * Math.PI / 180) * 26}
                                    stroke="#fbbf24"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    opacity="0.8"
                                >
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
                                </line>
                            ))}
                        </g>
                    ) : (
                        <g>
                            <circle cx="70" cy="-15" r="12" fill="#64748b" opacity="0.6" />
                            <circle cx="75" cy="-18" r="10" fill="#0a0e17" /> {/* Moon crescent effect */}
                        </g>
                    )}

                    {/* Label */}
                    <text x="70" y="185" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Inter">
                        SOLAR ARRAY
                    </text>
                    <text x="70" y="202" textAnchor="middle" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">
                        {(solarOutput.installedCapacityW / 1000).toFixed(2)} kWp
                    </text>
                    {/* Current output */}
                    <text x="70" y="218" textAnchor="middle" fill={isDaytime ? '#22c55e' : '#64748b'} fontSize="10" fontFamily="JetBrains Mono">
                        {isDaytime ? `NOW: ${currentSolarPowerW.toFixed(0)}W` : 'NO SUN'}
                    </text>
                </g>

                {/* ===== BATTERY GROUP ===== */}
                <g transform="translate(330, 60)" filter="url(#batteryGlow)">
                    {/* Battery Body */}
                    <rect
                        x="0" y="20"
                        width="140" height="120"
                        rx="8"
                        fill="#1a2332"
                        stroke="url(#batteryGradient)"
                        strokeWidth="2"
                    />

                    {/* Battery Terminal */}
                    <rect x="55" y="10" width="30" height="15" rx="3" fill="#10b981" />

                    {/* Charge Level Bars - based on actual SoC */}
                    {[0, 1, 2, 3, 4].map(i => {
                        const isFilled = i < batteryFillLevel;
                        const isPartial = i === batteryFillLevel && (currentSoC * 5) % 1 > 0.2;
                        const partialWidth = isPartial ? ((currentSoC * 5) % 1) * 110 : 110;

                        // Color based on SoC level
                        let barColor;
                        if (currentSoC > 0.6) barColor = 'rgba(16, 185, 129, 0.8)'; // Green
                        else if (currentSoC > 0.3) barColor = 'rgba(234, 179, 8, 0.8)'; // Yellow
                        else barColor = 'rgba(239, 68, 68, 0.8)'; // Red

                        return (
                            <g key={i}>
                                <rect
                                    x="15"
                                    y={110 - i * 20}
                                    width="110"
                                    height="14"
                                    rx="2"
                                    fill="#0f172a"
                                    stroke="#10b981"
                                    strokeWidth="0.5"
                                />
                                {(isFilled || isPartial) && (
                                    <rect
                                        x="15"
                                        y={110 - i * 20}
                                        width={isFilled ? 110 : partialWidth}
                                        height="14"
                                        rx="2"
                                        fill={barColor}
                                    >
                                        {energyFlow.isCharging && isFilled && (
                                            <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
                                        )}
                                    </rect>
                                )}
                            </g>
                        );
                    })}

                    {/* SoC Percentage */}
                    <text x="70" y="85" textAnchor="middle" fill="#f1f5f9" fontSize="18" fontFamily="JetBrains Mono" fontWeight="bold">
                        {(currentSoC * 100).toFixed(0)}%
                    </text>

                    {/* Charge/Discharge Indicator */}
                    <g transform="translate(70, 145)">
                        <text
                            x="0" y="0"
                            textAnchor="middle"
                            fill={energyFlow.isCharging ? '#22c55e' : (hasPowerFailure ? '#ef4444' : '#f97316')}
                            fontSize="12"
                            fontFamily="JetBrains Mono"
                            fontWeight="bold"
                        >
                            {energyFlow.isCharging ? '▲ CHARGING' : '▼ DISCHARGING'}
                        </text>
                        <text
                            x="0" y="14"
                            textAnchor="middle"
                            fill={energyFlow.isCharging ? '#22c55e' : (hasPowerFailure ? '#ef4444' : '#f97316')}
                            fontSize="10"
                            fontFamily="JetBrains Mono"
                        >
                            {energyFlow.batteryFlowW.toFixed(0)}W
                        </text>
                    </g>

                    {/* Label */}
                    <text x="70" y="185" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="Inter">
                        BATTERY BANK
                    </text>
                    <text x="70" y="202" textAnchor="middle" fill="#10b981" fontSize="11" fontFamily="JetBrains Mono">
                        {(batteryOutput.totalEnergyWh / 1000).toFixed(2)} kWh
                    </text>
                </g>

                {/* ===== LOAD GROUP ===== */}
                <g transform="translate(610, 60)" filter={hasPowerFailure ? "url(#failureGlow)" : "url(#loadGlow)"}>
                    {/* Load Container */}
                    <rect
                        x="0" y="0"
                        width="140" height="160"
                        rx="8"
                        fill="#1a2332"
                        stroke={hasPowerFailure ? "url(#loadGradientFailure)" : "url(#loadGradientNormal)"}
                        strokeWidth={hasPowerFailure ? "3" : "2"}
                        className={hasPowerFailure ? 'failure-flash' : ''}
                    />

                    {/* Circuit Icon */}
                    <g transform="translate(20, 20)" stroke={hasPowerFailure ? '#ef4444' : '#8b5cf6'} strokeWidth="2" fill="none">
                        {/* Resistor symbol */}
                        <path d="M 10 30 L 20 30 L 25 20 L 35 40 L 45 20 L 55 40 L 65 20 L 75 40 L 80 30 L 90 30" />

                        {/* Motor symbol */}
                        <circle cx="50" cy="70" r="20" />
                        <text x="50" y="75" textAnchor="middle" fill={hasPowerFailure ? '#ef4444' : '#8b5cf6'} fontSize="14" fontFamily="Inter">M</text>

                        {/* Connection lines */}
                        <line x1="10" y1="70" x2="30" y2="70" />
                        <line x1="70" y1="70" x2="90" y2="70" />

                        {/* X mark if power failure */}
                        {hasPowerFailure && (
                            <g stroke="#ef4444" strokeWidth="4">
                                <line x1="30" y1="50" x2="70" y2="90">
                                    <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
                                </line>
                                <line x1="70" y1="50" x2="30" y2="90">
                                    <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
                                </line>
                            </g>
                        )}
                    </g>

                    {/* Power consumption indicator */}
                    <g transform="translate(70, 125)">
                        <text
                            x="0" y="0"
                            textAnchor="middle"
                            fill={hasPowerFailure ? '#ef4444' : '#ec4899'}
                            fontSize="14"
                            fontFamily="JetBrains Mono"
                            fontWeight="bold"
                        >
                            {hasPowerFailure ? '⚠ FAILURE' : `${currentLoadPowerW.toFixed(0)}W`}
                        </text>
                        {hasPowerFailure && (
                            <text
                                x="0" y="16"
                                textAnchor="middle"
                                fill="#ef4444"
                                fontSize="10"
                                fontFamily="JetBrains Mono"
                            >
                                <animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite" />
                                NO POWER
                            </text>
                        )}
                    </g>

                    {/* Label */}
                    <text x="70" y="185" textAnchor="middle" fill={hasPowerFailure ? '#ef4444' : '#94a3b8'} fontSize="12" fontFamily="Inter">
                        ELECTRICAL LOADS
                    </text>
                    <text x="70" y="202" textAnchor="middle" fill={hasPowerFailure ? '#ef4444' : '#8b5cf6'} fontSize="11" fontFamily="JetBrains Mono">
                        {(loadOutput.totalDailyWh / 1000).toFixed(2)} kWh/day
                    </text>
                </g>

                {/* ===== ENERGY FLOW STATUS BAR ===== */}
                <g transform="translate(400, 270)">
                    <rect x="-150" y="-15" width="300" height="40" rx="8" fill="#1a2332" stroke={statusColor} strokeWidth="1" />

                    <text
                        x="0" y="5"
                        textAnchor="middle"
                        fill={statusColor}
                        fontSize="14"
                        fontFamily="JetBrains Mono"
                        fontWeight="600"
                    >
                        {energyFlow.isCharging
                            ? `☀ SURPLUS: +${energyFlow.solarToBatteryW.toFixed(0)}W → BATTERY`
                            : `🔋 DEFICIT: -${energyFlow.batteryToLoadW.toFixed(0)}W ← BATTERY`}
                    </text>
                    <text
                        x="0" y="20"
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="JetBrains Mono"
                    >
                        NET: {systemAnalysis.netEnergyBalance >= 0 ? '+' : ''}{(systemAnalysis.netEnergyBalance / 1000).toFixed(2)} kWh/day
                    </text>
                </g>
            </svg>

            <div className="diagram-legend">
                <div className="legend-item">
                    <span className="legend-color solar"></span>
                    <span>Solar: {currentSolarPowerW.toFixed(0)}W</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color battery" style={{ backgroundColor: currentSoC > 0.3 ? '#10b981' : '#ef4444' }}></span>
                    <span>Battery: {(currentSoC * 100).toFixed(0)}%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color load" style={{ backgroundColor: hasPowerFailure ? '#ef4444' : '#8b5cf6' }}></span>
                    <span>Load: {currentLoadPowerW.toFixed(0)}W</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: statusColor }}></span>
                    <span>{sustainabilityStatus?.status?.toUpperCase() || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
}

export default SystemDiagram;
