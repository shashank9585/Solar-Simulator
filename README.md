# Solar-Battery-Load System Simulator

## Engineering Learning Lab

An educational, industry-relevant, system-level simulation tool designed to help college students and early engineers understand how solar configuration, battery storage, and electrical load design together determine system performance, runtime, and sustainability.

![Solar Simulator](https://img.shields.io/badge/Type-Educational-blue)
![Frontend Only](https://img.shields.io/badge/Stack-Frontend%20Only-green)
![No APIs](https://img.shields.io/badge/Dependencies-No%20APIs-orange)

---

## 🎯 Purpose

This simulator is designed as an **engineering learning lab** focused on:

- **Energy balance understanding** - See how generation, storage, and consumption interact
- **System sizing intuition** - Develop feel for appropriate component sizing
- **Trade-off analysis** - Understand the impact of design decisions
- **First-order modeling** - Learn simplified engineering approximations

> **Note:** This is not a startup, not a commercial product, and not a high-fidelity electrical simulator. It is an engineering learning lab focused on energy balance and system sizing intuition.

---

## 🌟 Features

### 🌞 Solar Configuration Module
- Panel wattage selection (100W - 600W)
- Number of panels configuration
- Peak sun hours adjustment
- Efficiency factors:
  - Tilt/orientation efficiency
  - Temperature loss
  - Dust/soiling loss
  - Panel degradation
- **Output:** Effective daily energy generated (Wh/day)

### 🔋 Battery Configuration Module
- Battery bank voltage (12V / 24V / 48V)
- Capacity configuration (Ah)
- Battery chemistry selection:
  - Lead-Acid (80% efficiency)
  - AGM (85% efficiency)
  - Gel (82% efficiency)
  - Lithium-Ion (95% efficiency)
  - LiFePO4 (98% efficiency)
- Depth of Discharge (DoD) limit
- Charge/discharge efficiency settings
- **Output:** Usable stored energy (Wh), Battery autonomy (hours)

### ⚡ Load Configuration Module
- Multiple load support with add/remove functionality
- Load types:
  - Resistive (heaters, incandescent lights)
  - Inductive (motors, compressors)
  - Capacitive (LED drivers, SMPS)
  - Mixed loads
- Per-load configuration:
  - Power rating (W)
  - Operating duration (hours/day)
  - Start time scheduling
  - Priority levels
- **Output:** Total daily energy consumption (Wh/day)

### 📊 System Analysis
- Net energy balance calculation
- Sustainability assessment (Sustainable / Marginal / Unstable)
- Battery autonomy estimation
- Runtime predictions
- Design recommendations

### 📈 Visualizations
- **Battery State of Charge** - 24-hour SoC profile
- **Solar vs Load** - Generation and consumption comparison
- **Surplus/Deficit** - Hourly energy balance bar chart
- **System Diagram** - Interactive SVG flow visualization

---

## 🖥️ Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| Charts | Chart.js + react-chartjs-2 |
| Diagrams | SVG |
| Styling | Vanilla CSS |
| Calculations | Vanilla JavaScript |

**No backend, no APIs, no databases, no cloud services.**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to the project directory
cd "Solar sim"

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## ⚠️ Simplifications & Assumptions

This simulator uses simplified models for educational clarity. The following assumptions are made:

### Electrical Model
- ✅ **DC-equivalent system** - No AC conversion modeling
- ✅ **Average power modeling** - No instantaneous power calculations
- ✅ **No AC waveform simulation** - Pure DC approximation
- ✅ **No MPPT internal modeling** - Assumes ideal MPPT operation
- ✅ **No grid interaction** - Off-grid system only

### Solar Model
- ✅ **Gaussian solar profile** - Simplified bell curve centered at noon
- ✅ **Static sun hours** - No seasonal variation
- ✅ **No shading analysis** - Uniform irradiance assumed
- ✅ **No weather variability** - Clear sky conditions

### Battery Model
- ✅ **Linear discharge** - No Peukert effect
- ✅ **No temperature effects** - Constant efficiency
- ✅ **Simplified chemistry factors** - Single round-trip efficiency
- ✅ **No calendar aging** - Only cycle-based degradation

### Load Model
- ✅ **Constant power loads** - No transient startup modeling
- ✅ **Simplified power factor** - DC equivalent correction
- ✅ **No power quality effects** - Ideal power delivery

> **Disclaimer:** This simulator uses simplified energy models to help users understand system-level design trade-offs rather than detailed electrical behavior.

---

## 📐 Calculation Methodology

### Solar Energy Generation
```
Daily Energy (Wh) = Panel Wattage × Number of Panels × Sun Hours × Combined Efficiency

Combined Efficiency = Tilt Efficiency × (1 - Temp Loss) × (1 - Soiling Loss) × (1 - Degradation)
```

### Battery Storage
```
Total Energy (Wh) = Voltage × Capacity (Ah)

Usable Energy (Wh) = Total Energy × DoD × Charge Eff. × Discharge Eff. × Chemistry Eff.

Autonomy (hours) = Usable Energy / Average Load Power
```

### Load Consumption
```
Daily Energy (Wh) = Σ (Power / Power Factor × Operating Hours)

Power Factor depends on load type:
- Resistive: 1.0
- Inductive: 0.8
- Capacitive: 0.9
- Mixed: 0.85
```

### System Sustainability
```
Net Balance = Solar Daily Energy - Load Daily Energy

If Net Balance ≥ 0 with 20%+ surplus → SUSTAINABLE
If Net Balance ≥ 0 with <20% surplus → MARGINAL
If Net Balance < 0 → UNSTABLE

Runtime = Battery Usable Energy / Daily Deficit (if negative balance)
```

---

## 🎓 Learning Objectives

After using this simulator, students should be able to:

1. **Understand Panel Sizing**
   - How wattage and quantity affect daily generation
   - Impact of efficiency losses on effective output
   - Relationship between sun hours and energy production

2. **Analyze Battery Capacity**
   - Why DoD limits usable capacity
   - How chemistry affects round-trip efficiency
   - Calculating autonomy for given load profiles

3. **Configure Load Systems**
   - Impact of power factor on effective consumption
   - Scheduling loads with solar availability
   - Priority-based load management concepts

4. **System Integration**
   - Energy balance principles
   - Sustainability vs. deficit scenarios
   - Trade-offs between components

---

## 📁 Project Structure

```
Solar sim/
├── public/
│   └── solar-icon.svg
├── src/
│   ├── components/
│   │   ├── BatteryConfig/
│   │   │   ├── BatteryConfig.jsx
│   │   │   └── BatteryConfig.css
│   │   ├── Charts/
│   │   │   ├── Charts.jsx
│   │   │   └── Charts.css
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── LoadConfig/
│   │   │   ├── LoadConfig.jsx
│   │   │   └── LoadConfig.css
│   │   ├── ResultsDashboard/
│   │   │   ├── ResultsDashboard.jsx
│   │   │   └── ResultsDashboard.css
│   │   ├── SolarConfig/
│   │   │   ├── SolarConfig.jsx
│   │   │   └── SolarConfig.css
│   │   └── SystemDiagram/
│   │       ├── SystemDiagram.jsx
│   │       └── SystemDiagram.css
│   ├── utils/
│   │   └── calculations.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔧 Customization

### Adding New Battery Chemistries
Edit `src/utils/calculations.js`:
```javascript
export const BATTERY_CHEMISTRY = {
  'new-chemistry': { efficiency: 0.92, label: 'New Chemistry (92%)' },
  // ... existing chemistries
};
```

### Adding New Load Types
Edit `src/utils/calculations.js`:
```javascript
export const LOAD_TYPES = {
  'new-type': { powerFactor: 0.75, label: 'New Type', startupMultiplier: 2.0 },
  // ... existing types
};
```

### Modifying Solar Profile
The solar generation profile uses a Gaussian distribution. To modify:
```javascript
// In generateSolarProfile function
const peakHour = 12;  // Change solar peak time
const sigma = sunHours / 2.5;  // Adjust spread
```

---

## 📚 Educational Use

This simulator is designed for:

- **Undergraduate Courses** - Renewable energy systems, power electronics
- **Lab Exercises** - System sizing experiments
- **Self-Study** - Understanding solar-battery fundamentals
- **Workshop Demos** - Quick prototyping of system concepts

### Suggested Exercises

1. **Size a system for 1000Wh/day load** - Find minimum panel and battery requirements
2. **Compare battery chemistries** - Analyze cost-efficiency trade-offs
3. **Optimize for cloudy days** - Design for reduced sun hours
4. **Load scheduling** - Maximize solar self-consumption

---

## 📝 License

Educational use only. This project is provided as-is for learning purposes.

---

## 🙏 Acknowledgments

Built as an educational engineering simulator that feels like it was designed by someone who understands energy systems.

> *"The best way to learn is to build."*
