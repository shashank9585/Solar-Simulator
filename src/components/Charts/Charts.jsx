import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './Charts.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Chart.js global defaults for dark theme
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = '#2d3a4f';
ChartJS.defaults.font.family = "'Inter', sans-serif";

/**
 * Battery State of Charge Chart
 * Shows how battery charge level changes throughout the day.
 * Highlights current hour and DoD limit line.
 */
export function BatterySoCChart({ socProfile, currentHour, minSoCLimit, powerFailures = [] }) {
    const hours = Array.from({ length: 25 }, (_, i) =>
        i === 24 ? '24:00' : `${i.toString().padStart(2, '0')}:00`
    );

    // Determine colors based on SoC levels
    const getGradientColors = () => {
        const colors = socProfile.map(soc => {
            if (soc <= minSoCLimit + 0.05) return 'rgba(239, 68, 68, 0.8)';
            if (soc <= 0.3) return 'rgba(249, 115, 22, 0.6)';
            if (soc <= 0.5) return 'rgba(234, 179, 8, 0.4)';
            return 'rgba(16, 185, 129, 0.3)';
        });
        return colors;
    };

    const data = useMemo(() => ({
        labels: hours,
        datasets: [
            {
                label: 'State of Charge (%)',
                data: socProfile.map(v => v * 100),
                borderColor: (ctx) => {
                    const value = socProfile[ctx.dataIndex] || 0.5;
                    if (value <= minSoCLimit + 0.05) return '#ef4444';
                    if (value <= 0.3) return '#f97316';
                    if (value <= 0.5) return '#eab308';
                    return '#10b981';
                },
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: (ctx) => ctx.dataIndex === currentHour ? 8 : 0,
                pointHoverRadius: 6,
                pointBackgroundColor: (ctx) => ctx.dataIndex === currentHour ? '#fbbf24' : '#10b981',
                pointBorderColor: (ctx) => ctx.dataIndex === currentHour ? '#fff' : '#10b981',
                pointBorderWidth: (ctx) => ctx.dataIndex === currentHour ? 3 : 0,
                borderWidth: 3,
                segment: {
                    borderColor: (ctx) => {
                        const value = socProfile[ctx.p1DataIndex] || 0.5;
                        if (value <= minSoCLimit + 0.02) return '#ef4444';
                        if (value <= 0.3) return '#f97316';
                        if (value <= 0.5) return '#eab308';
                        return '#10b981';
                    }
                }
            },
            // DoD Limit Line
            {
                label: 'DoD Limit',
                data: Array(25).fill(minSoCLimit * 100),
                borderColor: '#ef4444',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }
        ]
    }), [socProfile, currentHour, minSoCLimit]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: 10,
                    font: { size: 10 }
                }
            },
            tooltip: {
                backgroundColor: '#1a2332',
                borderColor: '#2d3a4f',
                borderWidth: 1,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                padding: 12,
                callbacks: {
                    label: (ctx) => {
                        if (ctx.datasetIndex === 1) return `DoD Limit: ${ctx.parsed.y.toFixed(0)}%`;
                        return `SoC: ${ctx.parsed.y.toFixed(1)}%`;
                    },
                    afterLabel: (ctx) => {
                        if (ctx.datasetIndex === 0 && powerFailures.some(pf => pf.hour === ctx.dataIndex)) {
                            return '⚠️ POWER FAILURE';
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 12,
                    font: { size: 10 },
                    color: (ctx) => ctx.index === currentHour ? '#fbbf24' : '#94a3b8'
                }
            },
            y: {
                min: 0,
                max: 100,
                grid: {
                    color: 'rgba(45, 58, 79, 0.5)'
                },
                ticks: {
                    callback: (value) => `${value}%`,
                    font: { size: 10 }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="chart-panel">
            <div className="chart-header">
                <span className="chart-icon battery">🔋</span>
                <h4>Battery State of Charge</h4>
                <span className="current-hour-badge">
                    Now: {String(currentHour).padStart(2, '0')}:00
                </span>
            </div>
            {powerFailures.length > 0 && (
                <div className="power-failure-alert">
                    ⚠️ Power failure detected at {powerFailures.map(pf => `${pf.hour}:00`).join(', ')}
                </div>
            )}
            <div className="chart-wrapper">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}

/**
 * Solar vs Load Chart
 * Compares hourly solar generation with load consumption.
 * Highlights current hour with a vertical line.
 */
export function SolarVsLoadChart({ solarProfile, loadProfile, currentHour }) {
    const hours = Array.from({ length: 24 }, (_, i) =>
        `${i.toString().padStart(2, '0')}:00`
    );

    const data = useMemo(() => ({
        labels: hours,
        datasets: [
            {
                label: 'Solar Generation (Wh)',
                data: solarProfile,
                borderColor: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: (ctx) => ctx.dataIndex === currentHour ? 8 : 0,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#fff',
                pointBorderWidth: (ctx) => ctx.dataIndex === currentHour ? 2 : 0,
                pointHoverRadius: 5,
                borderWidth: 2,
                order: 2
            },
            {
                label: 'Load Consumption (Wh)',
                data: loadProfile,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.2,
                pointRadius: (ctx) => ctx.dataIndex === currentHour ? 8 : 0,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#fff',
                pointBorderWidth: (ctx) => ctx.dataIndex === currentHour ? 2 : 0,
                pointHoverRadius: 5,
                borderWidth: 2,
                order: 1
            }
        ]
    }), [solarProfile, loadProfile, currentHour]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 12,
                    boxHeight: 12,
                    padding: 15,
                    font: { size: 11 }
                }
            },
            tooltip: {
                backgroundColor: '#1a2332',
                borderColor: '#2d3a4f',
                borderWidth: 1,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                padding: 12,
                callbacks: {
                    title: (items) => {
                        const hour = items[0]?.dataIndex;
                        return hour === currentHour ? `${hours[hour]} (NOW)` : hours[hour];
                    },
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(0)} Wh`,
                    afterBody: (items) => {
                        const solar = items[0]?.parsed?.y || 0;
                        const load = items[1]?.parsed?.y || 0;
                        const diff = solar - load;
                        return [`Net: ${diff >= 0 ? '+' : ''}${diff.toFixed(0)} Wh`];
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: (ctx) => ctx.index === currentHour ? 'rgba(251, 191, 36, 0.5)' : 'transparent',
                    lineWidth: (ctx) => ctx.index === currentHour ? 2 : 0
                },
                ticks: {
                    maxTicksLimit: 12,
                    font: { size: 10 },
                    color: (ctx) => ctx.index === currentHour ? '#fbbf24' : '#94a3b8'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(45, 58, 79, 0.5)'
                },
                ticks: {
                    callback: (value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value,
                    font: { size: 10 }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="chart-panel">
            <div className="chart-header">
                <span className="chart-icon solar">☀️</span>
                <h4>Solar Generation vs Load Consumption</h4>
                <span className="current-hour-badge">
                    Now: {String(currentHour).padStart(2, '0')}:00
                </span>
            </div>
            <div className="chart-wrapper">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}

/**
 * Energy Surplus/Deficit Chart
 * Shows hourly energy balance (positive = surplus, negative = deficit).
 * Highlights current hour bar.
 */
export function SurplusDeficitChart({ surplusDeficit, currentHour }) {
    const hours = Array.from({ length: 24 }, (_, i) =>
        `${i.toString().padStart(2, '0')}:00`
    );

    const data = useMemo(() => ({
        labels: hours,
        datasets: [
            {
                label: 'Energy Balance (Wh)',
                data: surplusDeficit,
                backgroundColor: surplusDeficit.map((v, i) => {
                    const isCurrentHour = i === currentHour;
                    if (isCurrentHour) {
                        return v >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)';
                    }
                    return v >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
                }),
                borderColor: surplusDeficit.map((v, i) => {
                    const isCurrentHour = i === currentHour;
                    if (isCurrentHour) {
                        return '#fff';
                    }
                    return v >= 0 ? '#22c55e' : '#ef4444';
                }),
                borderWidth: surplusDeficit.map((_, i) => i === currentHour ? 3 : 1),
                borderRadius: 3
            }
        ]
    }), [surplusDeficit, currentHour]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1a2332',
                borderColor: '#2d3a4f',
                borderWidth: 1,
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                padding: 12,
                callbacks: {
                    title: (items) => {
                        const hour = items[0]?.dataIndex;
                        return hour === currentHour ? `${hours[hour]} (NOW)` : hours[hour];
                    },
                    label: (ctx) => {
                        const val = ctx.parsed.y;
                        return `${val >= 0 ? 'Surplus' : 'Deficit'}: ${Math.abs(val).toFixed(0)} Wh`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 12,
                    font: { size: 10 },
                    color: (ctx) => ctx.index === currentHour ? '#fbbf24' : '#94a3b8'
                }
            },
            y: {
                grid: {
                    color: 'rgba(45, 58, 79, 0.5)'
                },
                ticks: {
                    callback: (value) => {
                        if (value >= 1000) return `+${(value / 1000).toFixed(1)}k`;
                        if (value <= -1000) return `${(value / 1000).toFixed(1)}k`;
                        return value;
                    },
                    font: { size: 10 }
                }
            }
        }
    };

    return (
        <div className="chart-panel">
            <div className="chart-header">
                <span className="chart-icon balance">⚖️</span>
                <h4>Hourly Energy Surplus / Deficit</h4>
                <span className="current-hour-badge">
                    Now: {String(currentHour).padStart(2, '0')}:00
                </span>
            </div>
            <div className="chart-wrapper">
                <Bar data={data} options={options} />
            </div>
            <div className="chart-legend-custom">
                <span className="legend-surplus">▲ Surplus (Charging)</span>
                <span className="legend-deficit">▼ Deficit (Discharging)</span>
            </div>
        </div>
    );
}

export default { BatterySoCChart, SolarVsLoadChart, SurplusDeficitChart };
