import React, { useState, useEffect, useRef } from 'react';
import './TimeControl.css';

/**
 * Time of Day Control Component
 * Provides a slider and play/pause for simulating time progression.
 */
function TimeControl({ currentHour, onHourChange, isPlaying, onPlayPauseToggle, simulationSpeed, onSpeedChange }) {
    const isDaytime = currentHour >= 6 && currentHour < 18;

    // Get time label
    const getTimeLabel = (hour) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:00 ${period}`;
    };

    // Scroll detection for compact mode
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Hysteresis to prevent flickering/vibration
            if (scrollY > 150 && !isCompact) {
                setIsCompact(true);
            } else if (scrollY < 100 && isCompact) {
                setIsCompact(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isCompact]);



    // Get sun/moon position for visual indicator
    const getSunPosition = () => {
        // Map 6AM-6PM to 0-100% of the arc
        if (currentHour < 6) return -20;
        if (currentHour >= 18) return 120;
        return ((currentHour - 6) / 12) * 100;
    };

    return (
        <div className={`time-control ${isCompact ? 'compact' : ''}`}>
            {!isCompact && (
                <div className="time-control-header">
                    <h4>🕐 Time of Day Simulation</h4>
                    <div className="time-badge">
                        <span className="time-icon-badge">{isDaytime ? '☀️' : '🌙'}</span>
                        <span className="time-label">{getTimeLabel(currentHour)}</span>
                    </div>
                </div>
            )}

            <div className="time-control-body">
                {/* Day/Night Visual Arc - Hide in Compact Mode */}
                {!isCompact && (
                    <div className="day-night-arc">
                        <div className="arc-background">
                            <div className="arc-day"></div>
                            <div className="arc-night-left"></div>
                            <div className="arc-night-right"></div>
                        </div>
                        <div
                            className="sun-indicator"
                            style={{ left: `${getSunPosition()}%` }}
                        >
                            {isDaytime ? '☀️' : '🌙'}
                        </div>
                        <div className="arc-labels">
                            <span>6AM</span>
                            <span>12PM</span>
                            <span>6PM</span>
                        </div>
                    </div>
                )}

                {/* Time Slider */}
                <div className={`time-slider-container ${isCompact ? 'compact-slider' : ''}`}>
                    {isCompact && (
                        <div className="compact-time-badge">
                            <span className="compact-icon">{isDaytime ? '☀️' : '🌙'}</span>
                            <span className="compact-label">{getTimeLabel(currentHour)}</span>
                        </div>
                    )}
                    <input
                        type="range"
                        min="0"
                        max="23"
                        step="1"
                        value={currentHour}
                        onChange={(e) => onHourChange(Number(e.target.value))}
                        className="time-slider"
                    />
                    {!isCompact && (
                        <div className="time-marks">
                            {[0, 6, 12, 18, 23].map(hour => (
                                <span
                                    key={hour}
                                    className={`time-mark ${currentHour === hour ? 'active' : ''}`}
                                    style={{ left: `${(hour / 23) * 100}%` }}
                                >
                                    {hour}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Playback Controls */}
                <div className="playback-controls">
                    <div className="playback-main-row">
                        <button
                            className={`playback-btn ${isPlaying ? 'playing' : ''}`}
                            onClick={onPlayPauseToggle}
                            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                        >
                            {isPlaying ? (isCompact ? '⏸️' : '⏸️ Pause') : (isCompact ? '▶️' : '▶️ Play')}
                        </button>

                        <div className="speed-controls">
                            <span className="speed-label">Speed:</span>
                            <button
                                className={`speed-btn ${simulationSpeed === 2000 ? 'active' : ''}`}
                                onClick={() => onSpeedChange(2000)}
                                title="Slow (2s per hour)"
                            >0.5x</button>
                            <button
                                className={`speed-btn ${simulationSpeed === 1000 ? 'active' : ''}`}
                                onClick={() => onSpeedChange(1000)}
                                title="Normal (1s per hour)"
                            >1x</button>
                            <button
                                className={`speed-btn ${simulationSpeed === 500 ? 'active' : ''}`}
                                onClick={() => onSpeedChange(500)}
                                title="Fast (0.5s per hour)"
                            >2x</button>
                        </div>
                    </div>

                    {!isCompact && (
                        <div className="quick-time-buttons">
                            <button
                                className={`quick-btn ${currentHour === 6 ? 'active' : ''}`}
                                onClick={() => onHourChange(6)}
                                title="Sunrise (6 AM)"
                            >
                                🌅 Sunrise
                            </button>
                            <button
                                className={`quick-btn ${currentHour === 12 ? 'active' : ''}`}
                                onClick={() => onHourChange(12)}
                                title="Noon (12 PM)"
                            >
                                ☀️ Noon
                            </button>
                            <button
                                className={`quick-btn ${currentHour === 18 ? 'active' : ''}`}
                                onClick={() => onHourChange(18)}
                                title="Sunset (6 PM)"
                            >
                                🌇 Sunset
                            </button>
                            <button
                                className={`quick-btn ${currentHour === 22 ? 'active' : ''}`}
                                onClick={() => onHourChange(22)}
                                title="Night (10 PM)"
                            >
                                🌙 Night
                            </button>
                        </div>
                    )}
                </div>

                {/* Solar Availability Indicator - Hide in Compact */}
                {!isCompact && (
                    <div className="solar-status">
                        <div className={`solar-indicator ${isDaytime ? 'active' : 'inactive'}`}>
                            <span className="solar-dot"></span>
                            <span>{isDaytime ? 'Solar Available' : 'No Solar (Battery Only)'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimeControl;
