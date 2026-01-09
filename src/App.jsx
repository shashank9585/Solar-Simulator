import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header/Header';
import SolarConfig from './components/SolarConfig/SolarConfig';
import BatteryConfig from './components/BatteryConfig/BatteryConfig';
import LoadConfig from './components/LoadConfig/LoadConfig';
import SystemDiagram from './components/SystemDiagram/SystemDiagram';
import ResultsDashboard from './components/ResultsDashboard/ResultsDashboard';
import TimeControl from './components/TimeControl/TimeControl';
import { BatterySoCChart, SolarVsLoadChart, SurplusDeficitChart } from './components/Charts/Charts';
import {
    calculateSolarOutput,
    calculateBatteryStorage,
    calculateLoadConsumption,
    analyzeSystem,
    generateSolarProfile,
    generateLoadProfile,
    simulateBatterySoC,
    simulateSurplusDeficit,
    getSolarPowerAtHour,
    getLoadPowerAtHour,
    calculateEnergyFlow,
    simulateBatterySoCDetailed,
    getEnhancedSustainabilityStatus,
    calculateRemainingAutonomy
} from './utils/calculations';
import './App.css';

/**
 * Main Application Component
 * Solar-Battery-Load System Simulator
 * 
 * An educational engineering tool for understanding energy balance
 * and system sizing in solar power systems.
 */
function App() {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    // Solar Configuration State
    const [solarConfig, setSolarConfig] = useState({
        panelWattage: 350,
        numberOfPanels: 8,
        sunHours: 5,
        tiltEfficiency: 0.90,
        temperatureLoss: 0.10,
        soilingLoss: 0.05,
        degradation: 0.02
    });

    // Battery Configuration State
    const [batteryConfig, setBatteryConfig] = useState({
        voltage: 48,
        capacity: 200,
        chemistry: 'lithium-ion',
        depthOfDischarge: 0.80,
        initialSoC: 0.80,
        chargeEfficiency: 0.95,
        dischargeEfficiency: 0.95
    });

    // Load Configuration State
    const [loads, setLoads] = useState([
        {
            id: 1,
            name: 'LED Lighting',
            type: 'resistive',
            powerW: 100,
            hoursPerDay: 6,
            startHour: 18,
            priority: 2
        },
        {
            id: 2,
            name: 'Refrigerator',
            type: 'inductive',
            powerW: 150,
            hoursPerDay: 24,
            startHour: 0,
            priority: 1
        },
        {
            id: 3,
            name: 'Fan',
            type: 'inductive',
            powerW: 75,
            hoursPerDay: 8,
            startHour: 10,
            priority: 3
        }
    ]);

    // Time of Day State
    const [currentHour, setCurrentHour] = useState(12); // Start at noon
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms per hour

    // ============================================
    // TIME SIMULATION EFFECT
    // ============================================

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentHour((prev) => (prev + 1) % 24);
            }, simulationSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, simulationSpeed]);

    // ============================================
    // CALCULATIONS (Memoized for Performance)
    // ============================================

    // Calculate solar output
    const solarOutput = useMemo(() =>
        calculateSolarOutput(solarConfig),
        [solarConfig]
    );

    // Calculate battery storage
    const batteryOutput = useMemo(() =>
        calculateBatteryStorage(batteryConfig),
        [batteryConfig]
    );

    // Calculate load consumption
    const loadOutput = useMemo(() =>
        calculateLoadConsumption(loads),
        [loads]
    );

    // System analysis
    const systemAnalysis = useMemo(() =>
        analyzeSystem(solarOutput, batteryOutput, loadOutput),
        [solarOutput, batteryOutput, loadOutput]
    );

    // Generate hourly profiles for visualization
    const solarProfile = useMemo(() =>
        generateSolarProfile(solarOutput.dailyEnergyWh, solarConfig.sunHours),
        [solarOutput.dailyEnergyWh, solarConfig.sunHours]
    );

    const loadProfile = useMemo(() =>
        generateLoadProfile(loads),
        [loads]
    );

    // Enhanced SoC simulation with power failure detection
    const socSimulation = useMemo(() =>
        simulateBatterySoCDetailed(solarProfile, loadProfile, batteryOutput, batteryConfig.initialSoC || 0.8),
        [solarProfile, loadProfile, batteryOutput, batteryConfig.initialSoC]
    );

    const socProfile = socSimulation.socProfile;

    const surplusDeficit = useMemo(() =>
        simulateSurplusDeficit(solarProfile, loadProfile),
        [solarProfile, loadProfile]
    );

    // ============================================
    // REAL-TIME CALCULATIONS (Time-of-Day Aware)
    // ============================================

    // Current solar power at this hour
    const currentSolarPowerW = useMemo(() =>
        getSolarPowerAtHour(solarOutput, currentHour, solarConfig.sunHours),
        [solarOutput, currentHour, solarConfig.sunHours]
    );

    // Current load power at this hour
    const currentLoadPowerW = useMemo(() =>
        getLoadPowerAtHour(loads, currentHour),
        [loads, currentHour]
    );

    // Current energy flow
    const energyFlow = useMemo(() =>
        calculateEnergyFlow(currentSolarPowerW, currentLoadPowerW),
        [currentSolarPowerW, currentLoadPowerW]
    );

    // Current battery SoC (from simulation profile)
    const currentSoC = useMemo(() => {
        // Use the simulated SoC for the current hour
        return socProfile[currentHour] || 0.5;
    }, [socProfile, currentHour]);

    // Enhanced sustainability status
    const sustainabilityStatus = useMemo(() =>
        getEnhancedSustainabilityStatus(socSimulation, systemAnalysis),
        [socSimulation, systemAnalysis]
    );

    // Calculate minimum SoC limit (DoD limit)
    const minSoCLimit = useMemo(() => {
        return 1 - batteryConfig.depthOfDischarge;
    }, [batteryConfig.depthOfDischarge]);

    // Power failure detection
    const hasPowerFailure = socSimulation.hasPowerFailure;
    const powerFailures = socSimulation.powerFailures;

    // Real-time battery autonomy based on current load
    const currentAutonomy = useMemo(() =>
        calculateRemainingAutonomy(
            currentSoC,
            minSoCLimit,
            batteryOutput.totalEnergyWh,
            currentLoadPowerW
        ),
        [currentSoC, minSoCLimit, batteryOutput.totalEnergyWh, currentLoadPowerW]
    );

    // ============================================
    // HANDLERS
    // ============================================

    const handleSolarChange = useCallback((newConfig) => {
        setSolarConfig(newConfig);
    }, []);

    const handleBatteryChange = useCallback((newConfig) => {
        setBatteryConfig(newConfig);
    }, []);

    const handleLoadChange = useCallback((newLoads) => {
        setLoads(newLoads);
    }, []);

    const handleHourChange = useCallback((hour) => {
        setCurrentHour(hour);
    }, []);

    const handlePlayPauseToggle = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const handleSpeedChange = useCallback((speed) => {
        setSimulationSpeed(speed);
    }, []);

    const handleReset = useCallback(() => {
        setSolarConfig({
            panelWattage: 350,
            numberOfPanels: 8,
            sunHours: 5,
            tiltEfficiency: 0.90,
            temperatureLoss: 0.10,
            soilingLoss: 0.05,
            degradation: 0.02
        });
        setBatteryConfig({
            voltage: 48,
            capacity: 200,
            chemistry: 'lithium-ion',
            depthOfDischarge: 0.80,
            chargeEfficiency: 0.95,
            dischargeEfficiency: 0.95
        });
        setLoads([
            {
                id: 1,
                name: 'LED Lighting',
                type: 'resistive',
                powerW: 100,
                hoursPerDay: 6,
                startHour: 18,
                priority: 2
            }
        ]);
        setCurrentHour(12);
        setIsPlaying(false);
    }, []);

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="app">
            <Header />

            <main className="app-main">
                {/* Time of Day Control */}
                <section className="time-section">
                    <TimeControl
                        currentHour={currentHour}
                        onHourChange={handleHourChange}
                        isPlaying={isPlaying}
                        onPlayPauseToggle={handlePlayPauseToggle}
                        simulationSpeed={simulationSpeed}
                        onSpeedChange={handleSpeedChange}
                    />
                </section>

                {/* Configuration Section */}
                <section className="config-section">
                    <div className="section-title-bar">
                        <h2>🔧 System Configuration</h2>
                        <button className="btn" onClick={handleReset}>
                            Reset to Defaults
                        </button>
                    </div>

                    <div className="config-panels">
                        <SolarConfig
                            config={solarConfig}
                            onChange={handleSolarChange}
                            output={solarOutput}
                        />
                        <BatteryConfig
                            config={batteryConfig}
                            onChange={handleBatteryChange}
                            output={batteryOutput}
                            loadPower={loadOutput.averagePowerW}
                        />
                        <LoadConfig
                            loads={loads}
                            onChange={handleLoadChange}
                            output={loadOutput}
                        />
                    </div>
                </section>

                {/* System Diagram - Now with real-time data */}
                <section className="diagram-section">
                    <SystemDiagram
                        solarOutput={solarOutput}
                        batteryOutput={batteryOutput}
                        loadOutput={loadOutput}
                        systemAnalysis={systemAnalysis}
                        currentHour={currentHour}
                        currentSolarPowerW={currentSolarPowerW}
                        currentLoadPowerW={currentLoadPowerW}
                        currentSoC={currentSoC}
                        energyFlow={energyFlow}
                        sustainabilityStatus={sustainabilityStatus}
                        hasPowerFailure={hasPowerFailure}
                    />
                </section>

                {/* Real-Time Status Bar */}
                {hasPowerFailure && (
                    <section className="failure-alert-section">
                        <div className="global-failure-alert">
                            <span className="alert-icon">⚠️</span>
                            <div className="alert-content">
                                <strong>SYSTEM FAILURE DETECTED</strong>
                                <p>Battery reaches DoD limit at {powerFailures[0]?.hour}:00.
                                    Loads cannot be powered. Consider increasing solar capacity or battery storage.</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Results Dashboard */}
                <section className="results-section">
                    <ResultsDashboard
                        systemAnalysis={systemAnalysis}
                        solarOutput={solarOutput}
                        batteryOutput={batteryOutput}
                        loadOutput={loadOutput}
                        currentHour={currentHour}
                        currentSoC={currentSoC}
                        currentAutonomy={currentAutonomy}
                        sustainabilityStatus={sustainabilityStatus}
                        hasPowerFailure={hasPowerFailure}
                    />
                </section>

                {/* Charts Section */}
                <section className="charts-section">
                    <div className="section-title-bar">
                        <h2>📊 24-Hour Simulation</h2>
                        <span className="charts-update-note">
                            Current time: {String(currentHour).padStart(2, '0')}:00 •
                            Charts show full day simulation
                        </span>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-item full-width">
                            <SolarVsLoadChart
                                solarProfile={solarProfile}
                                loadProfile={loadProfile}
                                currentHour={currentHour}
                            />
                        </div>
                        <div className="chart-item">
                            <BatterySoCChart
                                socProfile={socProfile}
                                currentHour={currentHour}
                                minSoCLimit={minSoCLimit}
                                powerFailures={powerFailures}
                            />
                        </div>
                        <div className="chart-item">
                            <SurplusDeficitChart
                                surplusDeficit={surplusDeficit}
                                currentHour={currentHour}
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="app-footer">
                    <div className="footer-content">
                        <div className="footer-info">
                            <h4>Solar-Battery-Load System Simulator</h4>
                            <p>Educational Engineering Tool • Energy Balance & System Sizing</p>
                        </div>
                        <div className="footer-disclaimer">
                            <p>
                                <strong>Disclaimer:</strong> This simulator uses simplified energy models for educational purposes.
                                It is not intended for commercial system design or high-fidelity electrical analysis.
                            </p>
                        </div>
                        <div className="footer-credits">
                            <p>Built for engineering education • No APIs, No Cloud, Frontend Only</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default App;
