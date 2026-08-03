# ☀️ SolarSim: Battery-Load System Simulator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://chartjs.org)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

> **An educational, industry-relevant engineering learning lab that demonstrates how solar generation, battery storage, and electrical load design interact to determine system performance, runtime, and sustainability.**

**🌐 Live Demo:** https://solar-simulator-inky.vercel.app

---

## ✨ Highlights

- 🌞 Interactive solar system sizing simulator
- 🔋 Multiple battery chemistries with realistic efficiencies
- ⚡ Dynamic load scheduling and power-factor modelling
- 📈 Real-time visualizations with Chart.js
- 🧠 Transparent engineering calculations
- 🚀 Built entirely with React + Vite (No Backend • No APIs • No Database)

---

# 🎯 Purpose

This project is an **engineering learning lab**, designed to help students and early engineers understand energy balance rather than perform commercial-grade photovoltaic simulation.

It focuses on:

- Energy balance understanding
- System sizing intuition
- Trade-off analysis
- First-order engineering modelling

> **Note:** This is **not** a commercial simulator such as PVsyst. It intentionally uses simplified engineering models to improve learning and intuition.

---

# 🌟 Features

## 🌞 Solar Configuration

- Panel wattage (100W–600W)
- Number of panels
- Peak sun hours
- Tilt efficiency
- Temperature losses
- Soiling losses
- Panel degradation
- Effective daily energy generation

## 🔋 Battery Configuration

- 12V / 24V / 48V banks
- Capacity (Ah)
- Lead Acid
- AGM
- Gel
- Lithium-Ion
- LiFePO4
- Depth of Discharge
- Round-trip efficiency
- Battery autonomy calculations

## ⚡ Load Configuration

- Multiple loads
- Dynamic add/remove
- Resistive / Inductive / Capacitive / Mixed
- Operating schedule
- Priority levels
- Daily energy consumption

## 📊 System Analysis

- Net Energy Balance
- Sustainability Assessment
- Runtime Prediction
- Design Recommendations

## 📈 Visualizations

- 24-hour Battery SoC
- Solar vs Load
- Hourly Surplus / Deficit
- Interactive SVG System Diagram

---

# 📸 Screenshots

> Add screenshots here after deployment.

| Dashboard | Charts | System Diagram |
|-----------|--------|----------------|
| *(Insert)* | *(Insert)* | *(Insert)* |

---

# 🖥️ Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| Charts | Chart.js |
| Diagrams | SVG |
| Styling | CSS |
| Calculations | JavaScript |

No backend, APIs, database or cloud services are required.

---

# 📐 Calculation Methodology

## Solar

Daily Energy = Panel Wattage × Panels × Sun Hours × Combined Efficiency

Combined Efficiency =
Tilt × (1−Temp Loss) × (1−Soiling Loss) × (1−Degradation)

## Battery

Total Energy = Voltage × Capacity

Usable Energy =
Total × DoD × Charge Efficiency × Discharge Efficiency × Chemistry Efficiency

Autonomy = Usable Energy / Average Load

## Load

Daily Consumption = Σ(Power / Power Factor × Hours)

Power Factors

- Resistive = 1.0
- Inductive = 0.8
- Capacitive = 0.9
- Mixed = 0.85

## Sustainability

- ≥20% surplus → Sustainable
- Positive but <20% surplus → Marginal
- Negative balance → Unstable

---

# ⚠️ Simplifications & Assumptions

## Electrical

- DC-equivalent modelling
- Average power calculations
- No AC waveform simulation
- Ideal MPPT
- Off-grid system

## Solar

- Gaussian solar profile
- Clear-sky assumption
- No seasonal effects
- No shading

## Battery

- Linear discharge
- No Peukert effect
- Constant temperature
- Simplified ageing

## Load

- Constant power loads
- Simplified power factor
- Ideal delivery

These assumptions intentionally trade physical accuracy for educational clarity.

---

# 🎓 Learning Objectives

Students will learn:

- Solar panel sizing
- Battery sizing
- Energy balance
- Battery chemistry trade-offs
- Load scheduling
- Sustainable system design

---

# 🚀 Getting Started

```bash
git clone https://github.com/shashank9585/Solar-Simulator.git
cd Solar-Simulator
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

# 📁 Project Structure

```text
src/
├── components/
│   ├── BatteryConfig/
│   ├── Charts/
│   ├── Header/
│   ├── LoadConfig/
│   ├── ResultsDashboard/
│   ├── SolarConfig/
│   └── SystemDiagram/
├── utils/
│   └── calculations.js
├── App.jsx
└── main.jsx
```

---

# 🔧 Customization

- Add battery chemistries in `src/utils/calculations.js`
- Add new load types
- Modify Gaussian solar profile
- Extend engineering models

---

# 📚 Educational Use

Suitable for:

- Renewable Energy courses
- Power Electronics labs
- Engineering workshops
- Self-learning

Suggested exercises:

- Size a 1000 Wh/day system
- Compare battery chemistries
- Optimize cloudy-day performance
- Improve load scheduling

---

# 📝 License

Educational use only.

---

> *"The best way to learn engineering is to build engineering."*
