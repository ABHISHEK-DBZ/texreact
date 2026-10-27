import type { Experiment, QuestionItem } from '../types';

export const DVLSI_EXPERIMENTS: Experiment[] = [
  {
    id: 'dvlsi-exp-1',
    subjectId: 'dvlsi',
    expNumber: 1,
    title: 'MOSFET Drain and Transfer Characteristics (Depletion/Zero-VTO vs. Enhancement Mode VTO=2V)',
    chapter: 'MOSFET Device Characterization',
    topic: 'Drain & Transfer I-V Curves',
    aim: 'To simulate and analyze the Drain (ID vs. VDS) and Transfer (ID vs. VGS) characteristics of an N-channel MOSFET using LTspice XVII, investigating the behavioral shift between a zero-threshold device (VTO = 0V) and an enhancement-mode transistor with an explicit threshold voltage (VTO = 2V).',
    problemStatement: 'Construct a dual DC-sweep simulation in LTspice XVII for an NMOS transistor with gate series resistor R1 = 10 Ω and drain load resistor R2 = 220 Ω. Observe how altering the SPICE threshold parameter VTO shifts the conduction threshold on the transfer curve and alters the pinch-off boundary between linear (triode) and saturation regions across the family of drain curves.',
    theory: `### 1. MOSFET Structure and Fundamental Working Principle

The Metal-Oxide-Semiconductor Field-Effect Transistor (MOSFET) is a voltage-controlled, four-terminal semiconductor device consisting of **Gate (G)**, **Drain (D)**, **Source (S)**, and **Body / Substrate (B)**.

In an N-channel enhancement MOSFET:
- The device is built upon a **p-type silicon substrate**.
- Two heavily doped **n+ wells** form the Source and Drain terminals.
- A thin dielectric layer of **silicon dioxide (SiO2)** insulates the metallic or polysilicon Gate from the substrate channel region.
- Applying a positive Gate-to-Source voltage ($V_{GS}$) creates an electric field that repels holes from the substrate surface and attracts free electrons, creating an **n-type inversion layer** (the conducting channel).

---

### 2. The Three Distinct Physical Operating Regions

#### Region 1: Cutoff Mode (VGS < VTO)
- **Physical Condition:** The gate-to-source bias is below the threshold voltage ($V_{GS} < V_{TO}$).
- **Surface State:** No conductive inversion channel exists under the gate oxide. The p-type surface remains un-inverted.
- **Drain Current:** The drain current is virtually zero ($I_D \\approx 0\\text{ A}$), limited only to minute subthreshold leakage current.
- **Circuit Behavior:** The transistor acts as an **open switch** (OFF state).

#### Region 2: Linear / Triode Mode (VGS ≥ VTO and VDS < VGS - VTO)
- **Physical Condition:** Gate voltage exceeds threshold ($V_{GS} \\ge V_{TO}$) creating a continuous channel from Source to Drain, and drain bias is small ($V_{DS} < V_{GS} - V_{TO}$).
- **Surface State:** The channel has uniform depth along the channel length. Electrons drift freely from Source to Drain under the lateral electric field.
- **Governing Current Equation:**
  $$I_D = k_n' \\cdot \\left(\\frac{W}{L}\\right) \\cdot \\left[ (V_{GS} - V_{TO}) \\cdot V_{DS} - \\frac{1}{2} \\cdot V_{DS}^2 \\right]$$
  *(where $k_n' = \\mu_n \\cdot C_{ox}$ is the process transconductance parameter, $W$ is channel width, and $L$ is channel length).*
- **Circuit Behavior:** The transistor behaves as a **voltage-controlled linear resistor**, where the channel resistance decreases as $V_{GS}$ increases.

#### Region 3: Saturation / Pinch-Off Mode (VGS ≥ VTO and VDS ≥ VGS - VTO)
- **Physical Condition:** Drain voltage reaches or exceeds the saturation boundary:
  $$V_{DS,sat} = V_{GS} - V_{TO}$$
- **Surface State:** As $V_{DS}$ increases, the local voltage across the gate oxide near the drain end drops to $V_{TO}$. The channel pinches off at the drain edge.
- **Carrier Transport:** Electrons arriving at the pinch-off point are swept across the drain depletion region by the high lateral electric field.
- **Governing Current Equation (Square-Law):**
  $$I_D = \\frac{1}{2} \\cdot k_n' \\cdot \\left(\\frac{W}{L}\\right) \\cdot (V_{GS} - V_{TO})^2$$
- **Circuit Behavior:** The drain current reaches a constant plateau independent of further increases in $V_{DS}$, functioning as an ideal **voltage-controlled current source**.

---

### 3. Threshold Voltage (VTO) Shift Analysis

#### Case A: Zero-Threshold Device (VTO = 0V)
- Conduction commences immediately at the origin ($V_{GS} = 0\\text{V}$).
- Even with zero gate overdrive, mobile carrier density is sufficient to support immediate linear and saturation currents.
- In LTspice, the default generic NMOS model assumes $V_{TO} = 0\\text{V}$, resulting in a quadratic curve rising directly from $0\\text{V}$ up to $1.1\\text{ mA}$ at $10\\text{V}$.

#### Case B: Enhancement-Mode Device (VTO = 2V)
- Defined via the SPICE directive: \`.MODEL NMOS1 NMOS (VTO=2)\`.
- Current is **completely blocked ($I_D = 0\\text{ A}$)** for all gate voltages from $0\\text{V}$ to $2.0\\text{V}$.
- The entire transfer characteristic shifts horizontally to the right by exactly $2.0\\text{V}$.
- Requires a positive gate overdrive voltage ($V_{OV} = V_{GS} - 2\\text{V}$) to initiate channel conduction, reflecting the true behavior of practical CMOS logic transistors.`,
    prerequisites: [
      {
        concept: 'MOSFET Terminals & Inversion',
        explanation: 'The Gate controls channel conductivity via electrostatic induction across the thin gate oxide dielectric without drawing static DC gate current.',
        example: 'Positive charge on gate repels holes and attracts electrons to form an n-type inversion channel in a p-type substrate.'
      },
      {
        concept: 'Channel Pinch-Off Mechanism',
        explanation: 'Occurs when V_DS = V_GS - V_TO (saturation voltage V_DS,sat). Beyond pinch-off, additional drain voltage is dropped across the depletion region.',
        example: 'If V_GS = 6V and V_TO = 2V, pinch-off occurs at V_DS,sat = 4V.'
      },
      {
        concept: 'LTspice Nested DC Sweeps',
        explanation: 'A nested DC sweep sweeps a primary source (V2) along the X-axis while stepping a secondary source (V1) to generate parametric curve families.',
        example: '.dc v2 0 30 0.1 v1 0 10 2 sweeps V2 from 0 to 30V for each V1 in {0, 2, 4, 6, 8, 10V}.'
      }
    ],
    booleanExpression: "I_D = ½ · k_n' · (W / L) · (V_GS - V_TO)²   [Saturation: V_DS ≥ V_GS - V_TO]",
    logicDiagrams: [
      {
        id: 'dvlsi-exp1-diag1',
        url: '/assets/dvlsi/drain_and_transfer_image1.png',
        caption: 'Figure 1.1: LTspice Schematic and Drain Characteristics Family for VTO = 0V (.dc v2 0 30 0.1 v1 0 10 2). Notice conduction begins at V1 = 0V.',
        alt: 'Drain characteristics for VTO=0V'
      },
      {
        id: 'dvlsi-exp1-diag2',
        url: '/assets/dvlsi/drain_and_transfer_image3.png',
        caption: 'Figure 1.2: LTspice Schematic with .MODEL NMOS1 NMOS (VTO=2) and Transfer Curve. Conduction is strictly zero until V1 reaches 2.0V.',
        alt: 'Transfer characteristic for VTO=2V'
      }
    ],
    waveforms: [
      {
        id: 'dvlsi-exp1-wave1',
        url: '/assets/dvlsi/drain_and_transfer_image2.png',
        caption: 'Figure 1.3: Transfer Characteristic (ID vs V1) for Default VTO = 0V (.dc v1 0 10 1). Conduction originates directly at 0V with quadratic growth.',
        alt: 'Transfer curve for VTO=0V'
      },
      {
        id: 'dvlsi-exp1-wave2',
        url: '/assets/dvlsi/drain_and_transfer_image4.png',
        caption: 'Figure 1.4: Family of Drain Curves (ID vs V2) for Enhancement Mode VTO = 2V (.dc v2 0 30 2 v1 0 10 1). Curves for V1 <= 2V show complete cutoff.',
        alt: 'Drain curves family for VTO=2V'
      }
    ],
    componentsList: [
      {
        designator: 'M1',
        component: 'NMOS Transistor',
        value: 'Default NMOS / NMOS1',
        description: 'Primary N-channel MOSFET device under characterization'
      },
      {
        designator: 'R1',
        component: 'Resistor',
        value: '10 Ω',
        description: 'Gate protection and damping resistor to prevent numerical oscillation'
      },
      {
        designator: 'R2',
        component: 'Resistor',
        value: '220 Ω',
        description: 'Drain series sensing resistor'
      },
      {
        designator: 'V1',
        component: 'DC Voltage Source',
        value: '10 V (Swept)',
        description: 'Gate-to-source bias voltage supply'
      },
      {
        designator: 'V2',
        component: 'DC Voltage Source',
        value: '30 V (Swept)',
        description: 'Drain-to-source bias voltage supply'
      }
    ],
    simulationSetup: {
      software: 'LTspice XVII',
      directives: [
        '.dc v2 0 30 0.1 v1 0 10 2  (Nested DC sweep for Drain family of curves)',
        '.dc v1 0 10 1            (Single DC sweep for Transfer curve with fixed V2=30V)',
        '.MODEL NMOS1 NMOS (VTO=2) (Enhancement mode model statement defining 2V threshold)'
      ],
      parameters: [
        { name: 'V2 (V_DS)', value: '0V to 30V', description: 'Primary sweep source stepped at 0.1V' },
        { name: 'V1 (V_GS)', value: '0V to 10V', description: 'Secondary stepping source stepped at 1V or 2V' },
        { name: 'VTO', value: '0V / 2V', description: 'Zero-bias threshold voltage parameter' }
      ],
      notes: 'Simulation run directly from original lab schematic files in rawasset/dvlsi/Drain & transfer.docx.'
    },
    traceBreakdown: [
      {
        label: 'Drain Curve Family (VTO=0V)',
        signal: 'I_D(M1) vs V_DS',
        color: 'Green (Multi-trace)',
        type: 'DC Sweep Output',
        behavior: 'Shows 6 distinct curves for V1 = 0, 2, 4, 6, 8, 10V. Initial linear slope followed by saturation plateau reaching ~1.1 mA at V1 = 10V.'
      },
      {
        label: 'Transfer Curve (VTO=0V)',
        signal: 'I_D(M1) vs V_GS',
        color: 'Green',
        type: 'DC Sweep Output',
        behavior: 'Parabolic curve starting at V1 = 0V, verifying that current begins without threshold delay. Saturates near 1.1 mA.'
      },
      {
        label: 'Transfer Curve (VTO=2V)',
        signal: 'I_D(M1) vs V_GS',
        color: 'Green',
        type: 'DC Sweep Output',
        behavior: 'Current remains strictly 0 µA from V1 = 0V to 2.0V (cutoff). Conduction begins smoothly at V1 = 2.0V and rises to ~660 µA at 10V.'
      },
      {
        label: 'Drain Curve Family (VTO=2V)',
        signal: 'I_D(M1) vs V_DS',
        color: 'Green (Multi-trace)',
        type: 'DC Sweep Output',
        behavior: 'Traces for V1 = 0V, 1V, and 2V overlap at the 0A horizontal axis (cutoff). Traces for V1 = 3V to 10V separate into standard triode and saturation regions.'
      }
    ],
    observationTable: {
      title: 'Quantitative Comparison: VTO = 0V vs. VTO = 2V Characteristics',
      headers: ['Gate Bias V_GS (V)', 'VTO = 0V: I_D,sat (µA)', 'VTO = 0V: State', 'VTO = 2V: I_D,sat (µA)', 'VTO = 2V: State', 'Overdrive V_OV (VTO=2V)'],
      rows: [
        ['0.0 V', '0.0 µA', 'Boundary', '0.0 µA', 'Deep Cutoff', 'V_GS < V_TO (-2.0V)'],
        ['2.0 V', '45.0 µA', 'Saturation', '0.0 µA', 'Threshold Cutoff', '0.0 V (Onset)'],
        ['4.0 V', '180.0 µA', 'Saturation', '75.0 µA', 'Saturation', '+2.0 V'],
        ['6.0 V', '410.0 µA', 'Saturation', '230.0 µA', 'Saturation', '+4.0 V'],
        ['8.0 V', '730.0 µA', 'Saturation', '430.0 µA', 'Saturation', '+6.0 V'],
        ['10.0 V', '1100.0 µA', 'Saturation', '660.0 µA', 'Saturation', '+8.0 V']
      ]
    },
    codeSnippets: [
      {
        language: 'spice',
        filename: 'mosfet_drain_transfer.cir',
        explanation: 'SPICE netlist corresponding to the LTspice schematics in Drain & transfer.docx.',
        code: `* MOSFET Drain and Transfer Characteristics Simulation Netlist
* Circuit: M1 (NMOS), R1 (Gate Damping), R2 (Drain Load)

M1 n002 n001 0 0 NMOS1
R1 n003 n001 10
R2 n004 n002 220
V1 n003 0 10
V2 n004 0 30

* Model card for Enhancement Mode (Part B)
.MODEL NMOS1 NMOS (VTO=2 KP=20u)

* Simulation direct: Nested DC Sweep for Drain Family
.dc v2 0 30 0.1 v1 0 10 2

* Alternative Transfer Curve sweep (uncomment to run):
* .dc v1 0 10 0.1

.backanno
.end`
      }
    ],
    result: 'The Drain (ID vs VDS) and Transfer (ID vs VGS) characteristics of the NMOS transistor were successfully simulated and analyzed using LTspice XVII. For VTO = 0V, conduction commences at zero gate bias, reaching 1.1 mA at VGS = 10V. For VTO = 2V, conduction is completely inhibited for VGS ≤ 2.0V, shifting the transfer threshold by exactly 2.0V rightward and verifying standard enhancement-mode operation.',
    conclusion: 'Threshold voltage VTO is the primary parameter governing MOSFET conduction and switching. Setting VTO > 0V is imperative in digital CMOS design to ensure complete turn-off in the cutoff region and eliminate static leakage currents. In saturation, drain current adheres closely to the square-law relation with respect to gate overdrive voltage (VGS - VTO).',
    vivaQuestions: [
      {
        id: 'dvlsi-viva-1-1',
        questionNumber: 1,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-1',
        question: 'What is the physical meaning of threshold voltage (VTO) in an NMOS transistor?',
        answer: 'Threshold voltage is the minimum positive gate-to-source voltage required to invert the p-type substrate surface under the gate oxide from p-type to n-type (strong inversion), establishing a continuous electron conduction channel between source and drain.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-1-2',
        questionNumber: 2,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-1',
        question: 'Why does drain current saturate and become independent of VDS in the saturation region?',
        answer: 'When VDS reaches VDS,sat = VGS - VTO, the channel pinches off at the drain end because the local gate-to-channel potential falls to VTO. Any further increase in VDS simply widens the drain depletion region rather than increasing channel charge, keeping the current constant.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-1-3',
        questionNumber: 3,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-1',
        question: 'What is the purpose of gate resistor R1 = 10Ω in the simulation schematic?',
        answer: 'R1 acts as a small series damping resistance that suppresses high-frequency numerical oscillations and convergence artifacts in SPICE simulation during fast switching or high-resolution voltage sweeps.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-1-4',
        questionNumber: 4,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-1',
        question: 'How do you extract threshold voltage VTO graphically from a transfer characteristic curve?',
        answer: 'In the saturation region, plot sqrt(ID) versus VGS. The resulting straight line can be extrapolated to the horizontal axis (where sqrt(ID) = 0). The VGS intercept yields the threshold voltage VTO.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-1-5',
        questionNumber: 5,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-1',
        question: 'What is channel length modulation (λ), and how does it alter the ideal saturation curve?',
        answer: 'Channel length modulation is the shortening of the effective channel length (Leff) as VDS increases past pinch-off. It introduces a finite positive slope in the saturation region: ID = ID,sat * (1 + λ * VDS), resulting in a non-infinite output resistance ro = 1 / (λ * ID).',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Cutoff: VGS < VTO (ID ≈ 0 A).',
        'Triode: VDS < VGS - VTO (Channel continuous, acts as resistor).',
        'Saturation: VDS ≥ VGS - VTO (Pinch-off occurs, current follows square law).',
        'VTO = 2V requires an additional 2V gate overdrive compared to VTO = 0V.'
      ],
      commonPitfalls: [
        'Confusing VDS,sat with VTO: VDS,sat = VGS - VTO, not VTO alone.',
        'Neglecting the difference between depletion mode (normally-on, VTO ≤ 0) and enhancement mode (normally-off, VTO > 0).'
      ],
      examTips: [
        'In viva, remember the square-law equation: ID = 0.5 * kn\' * (W/L) * (VGS - VTO)²',
        'Be ready to explain how SPICE .dc directives step primary vs secondary voltage sources.'
      ]
    },
    sourceReference: {
      docName: 'Drain & transfer.docx',
      pageNumber: 1,
      reviewNeeded: false,
      notes: 'Fully extracted from rawasset/dvlsi/Drain & transfer.docx. All 4 authentic LTspice screenshots associated and verified.'
    }
  },
  {
    id: 'dvlsi-exp-2',
    subjectId: 'dvlsi',
    expNumber: 2,
    title: 'MOSFET Scaling Analysis: Unscaled, Constant Voltage Scaling, and Constant Electric Field (Full) Scaling',
    chapter: 'MOSFET Scaling & Short-Channel Effects',
    topic: 'Dennard Scaling & Power-Delay Trade-offs',
    aim: 'To model, simulate, and compare the I-V characteristics of an NMOS transistor in LTspice XVII under three operational regimes: (1) Unscaled baseline, (2) Constant Voltage Scaling, and (3) Full / Constant Electric Field Scaling, verifying Dennard scaling rules for saturation current and power dissipation.',
    problemStatement: 'Using an initial unscaled NMOS baseline with VTO = 2V, kp = 100µA/V², V1 = 10V, and V2 = 30V, apply a scaling factor S = 2. Evaluate how scaling transconductance kp to 200µ under constant voltage doubles saturation current, and how scaling both voltages by 1/S (V1=5V, V2=15V, VTO=1V) under full scaling decreases current by 1/S while preserving internal electric field reliability.',
    theory: `### 1. The Scaling Principle and Scaling Factor S

In VLSI design, shrinking device dimensions enables packing more transistors into a given silicon area, lowering cost and boosting circuit operating speed.

When physical dimensions are reduced by a dimensionless scaling factor $S > 1$ (typically $S \\approx \\sqrt{2} \\approx 1.414$ per technology generation):
- Gate length scales as: $L' = L / S$
- Gate width scales as: $W' = W / S$
- Gate oxide thickness scales as: $t_{ox}' = t_{ox} / S$
- Substrate doping increases: $N_A' = S \\cdot N_A$

Because gate oxide thickness is reduced by $1/S$, gate capacitance per unit area increases:
$$C_{ox}' = \\frac{\\epsilon_{ox}}{t_{ox}'} = S \\cdot C_{ox}$$

Consequently, the process transconductance parameter $k_p = \\mu_n \\cdot C_{ox}$ scales up directly by $S$:
$$k_p' = S \\cdot k_p$$

---

### 2. Three Comparative Scaling Modes

#### Mode 1: Unscaled Baseline Transistor
- **Model Card:** \`.Model NMOS1 NMOS (VTO=2 kp=100u)\`
- **Bias Voltages:** $V_1 = 10\\text{V}$, $V_2 = 30\\text{V}$
- **Observed Current:** Maximum saturation current reaches **$I_{D,sat} \\approx 3.3\\text{ mA}$**.
- **Role:** Serves as the control reference to benchmark both Constant Voltage and Full Scaling.

#### Mode 2: Constant Voltage (CV) Scaling
- **Model Card:** \`.Model NMOS1 NMOS (VTO=2 kp=200u)\`
- **Bias Voltages:** Kept identical to baseline ($V_1 = 10\\text{V}$, $V_2 = 30\\text{V}$) for TTL 5V interface compatibility.
- **Observed Current:** Saturation current **doubles to $6.6\\text{ mA}$** ($I_D' = S \\cdot I_D$).
- **The Problem:** 
  - Internal electric field increases by $S = 2$ ($E' = S \\cdot E$), causing severe hot-carrier degradation and dielectric breakdown.
  - Power dissipation per transistor doubles ($P' = S \\cdot P$).
  - **Power density explodes by $S^3 = 8\\times$**, creating insurmountable thermal dissipation bottlenecks.

#### Mode 3: Full (Constant Electric Field) Dennard Scaling
- **Model Card:** \`.Model NMOS1 NMOS (VTO=1 kp=200u)\`
- **Bias Voltages:** Both supply and gate voltages are scaled down by $1/S = 1/2$ ($V_1 = 5\\text{V}$, $V_2 = 15\\text{V}$, $V_{TO} = 1\\text{V}$).
- **Observed Current:** Saturation current **scales down to $1.6\\text{ mA}$** ($I_D' = I_D / S$).
- **The Advantage:**
  - Electric field inside the gate oxide remains **strictly constant** ($E' = E$).
  - Power dissipation per transistor drops to **25%** ($P' = P / S^2$).
  - **Power density remains constant**, preventing chip overheating and enabling massive integration.`,
    prerequisites: [
      {
        concept: 'Dennard Scaling Hypothesis',
        explanation: 'Shrinking dimensions and supply voltages simultaneously maintains constant electric fields and prevents thermal runaway.',
        example: 'Scaling by S = 2 doubles circuit density while reducing single-gate power to 25%.'
      },
      {
        concept: 'Transconductance Parameter (kp)',
        explanation: 'kp = mu * Cox represents the intrinsic current-driving strength of the fabrication process. Thinner oxide increases Cox and kp.',
        example: 'Halving oxide thickness doubles Cox and doubles kp from 100u to 200u.'
      }
    ],
    booleanExpression: "Dennard Full Scaling:  I_D' = I_D / S,   P' = P / S²,   Power Density = Constant",
    logicDiagrams: [
      {
        id: 'dvlsi-exp2-diag1',
        url: '/assets/dvlsi/scaling_image1.png',
        caption: 'Figure 2.1: Without Scaling — Baseline NMOS model (.Model NMOS1 NMOS (VTO=2 kp=100u)) with V1=10V, V2=30V. Saturation current reaches ~3.3 mA.',
        alt: 'Without scaling baseline schematic and waveform'
      },
      {
        id: 'dvlsi-exp2-diag2',
        url: '/assets/dvlsi/scaling_image2.png',
        caption: 'Figure 2.2: Constant Voltage Scaling — Transistor scaled to kp=200u (S=2) with voltages unchanged (V1=10V, V2=30V). Saturation current doubles to ~6.6 mA.',
        alt: 'Constant voltage scaling schematic and waveform'
      }
    ],
    waveforms: [
      {
        id: 'dvlsi-exp2-wave1',
        url: '/assets/dvlsi/scaling_image3.png',
        caption: 'Figure 2.3: Full Scaling (Constant Electric Field) — Both voltages and threshold scaled by S=2 (V1=5V, V2=15V, VTO=1V, kp=200u). Saturation current drops to ~1.6 mA.',
        alt: 'Full scaling schematic and waveform'
      }
    ],
    componentsList: [
      {
        designator: 'M1',
        component: 'NMOS Transistor',
        value: 'Model NMOS1',
        description: 'Transistor with parametric kp and VTO to model scaling effects'
      },
      {
        designator: 'R1',
        component: 'Resistor',
        value: '10 Ω',
        description: 'Gate damping resistance'
      },
      {
        designator: 'R2',
        component: 'Resistor',
        value: '220 Ω',
        description: 'Drain load resistor'
      },
      {
        designator: 'V1',
        component: 'DC Voltage Source',
        value: '10V (Unscaled/CV) / 5V (Full)',
        description: 'Gate bias voltage'
      },
      {
        designator: 'V2',
        component: 'DC Voltage Source',
        value: '30V (Unscaled/CV) / 15V (Full)',
        description: 'Drain bias voltage'
      }
    ],
    simulationSetup: {
      software: 'LTspice XVII',
      directives: [
        'Without Scaling: .Model NMOS1 NMOS (VTO=2 kp=100u) | V1=10V, V2=30V | .dc v2 0 30 0.1 v1 0 10 2',
        'Constant Voltage Scaling: .Model NMOS1 NMOS (VTO=2 kp=200u) | V1=10V, V2=30V | .dc v2 0 30 0.1 v1 0 10 2',
        'Full (Constant Field) Scaling: .Model NMOS1 NMOS (VTO=1 kp=200u) | V1=5V, V2=15V | .dc v2 0 15 0.1 v1 0 5 1'
      ],
      parameters: [
        { name: 'Scaling Factor (S)', value: '2.0', description: 'Dimensional shrinkage factor' },
        { name: 'kp (Process Transconductance)', value: '100u -> 200u', description: 'Scaled by S due to thinner oxide' },
        { name: 'VTO (Threshold Voltage)', value: '2V -> 1V', description: 'Scaled by 1/S under Full Scaling' },
        { name: 'V_DD (Supply Rail)', value: '30V -> 15V', description: 'Scaled by 1/S under Full Scaling' }
      ],
      notes: 'Extracted from rawasset/dvlsi/scaling.docx. Accurately models the exact three simulation setups.'
    },
    traceBreakdown: [
      {
        label: 'Unscaled Baseline (Fig 2.1)',
        signal: 'I_D(M1)',
        color: 'Green (Family)',
        type: 'DC Sweep Output',
        behavior: 'Curves plateau cleanly into saturation. Maximum saturation current at V1 = 10V is 3.3 mA.'
      },
      {
        label: 'Constant Voltage Scaling (Fig 2.2)',
        signal: 'I_D(M1)',
        color: 'Green (Family)',
        type: 'DC Sweep Output',
        behavior: 'With kp = 200u and same voltages, saturation current doubles to exactly 6.6 mA. Demonstrates higher drive strength but dangerous power density.'
      },
      {
        label: 'Full (Constant Field) Scaling (Fig 2.3)',
        signal: 'I_D(M1)',
        color: 'Green (Family)',
        type: 'DC Sweep Output',
        behavior: 'With V1 scaled to 5V, V2 scaled to 15V, and VTO scaled to 1V, saturation current scales down to 1.6 mA (approx 3.3 mA / 2).'
      }
    ],
    observationTable: {
      title: 'MOSFET Scaling Parameters & Simulation Results (Scaling Factor S = 2)',
      headers: ['Parameter / Quantity', 'Unscaled Baseline', 'Constant Voltage Scaling', 'Full (Constant Field) Scaling', 'Theoretical Ratio'],
      rows: [
        ['Process Transconductance (kp)', '100 µA/V²', '200 µA/V²', '200 µA/V²', 'kp * S'],
        ['Threshold Voltage (V_TO)', '2.0 V', '2.0 V', '1.0 V', 'V_TO / S (Full)'],
        ['Gate Voltage (V1, max)', '10.0 V', '10.0 V', '5.0 V', 'V1 / S (Full)'],
        ['Drain Voltage (V2, max)', '30.0 V', '30.0 V', '15.0 V', 'V2 / S (Full)'],
        ['Max Saturation Current (I_D,sat)', '3.3 mA', '6.6 mA', '1.6 mA', 'CV: S * I_D | Full: I_D / S'],
        ['Single Transistor Power (P = V*I)', '99.0 mW', '198.0 mW (2x)', '24.0 mW (0.24x)', 'CV: S * P | Full: P / S²'],
        ['Internal Electric Field (E)', 'E_0', '2 * E_0 (High Risk)', 'E_0 (Constant)', 'Full keeps E constant']
      ]
    },
    codeSnippets: [
      {
        language: 'spice',
        filename: 'mosfet_scaling_study.cir',
        explanation: 'Parametric SPICE comparison for Unscaled, Constant Voltage, and Full Scaling.',
        code: `* MOSFET Scaling Study in LTspice
* Scaling Factor S = 2

* 1. UNSCALED BASELINE
M1 n002 n001 0 0 NMOS_UNSCALED
R1 n003 n001 10
R2 n004 n002 220
V1 n003 0 10
V2 n004 0 30
.MODEL NMOS_UNSCALED NMOS (VTO=2 KP=100u)
.dc v2 0 30 0.1 v1 0 10 2

* 2. CONSTANT VOLTAGE SCALING (kp doubled to 200u, voltages unchanged)
* .MODEL NMOS_CV NMOS (VTO=2 KP=200u)

* 3. FULL CONSTANT FIELD SCALING (kp=200u, VTO=1V, V1=5V, V2=15V)
* .MODEL NMOS_FULL NMOS (VTO=1 KP=200u)
* .dc v2 0 15 0.1 v1 0 5 1

.end`
      }
    ],
    result: 'The three scaling regimes were successfully verified in LTspice XVII for scaling factor S = 2. Constant voltage scaling doubled saturation current from 3.3 mA to 6.6 mA at the expense of higher power dissipation. Full (constant field) scaling decreased current to 1.6 mA (a 1/S reduction), reducing individual gate power by a factor of 4 (1/S²) while preserving internal electric field integrity.',
    conclusion: 'Full Dennard scaling is essential for sustainable VLSI scaling because it maintains constant power density and constant electric fields. Constant voltage scaling, while providing temporary speed advantages, results in catastrophic thermal scaling (P_density proportional to S³) and dielectric degradation, which forced the modern microelectronics industry to adopt aggressive voltage scaling.',
    vivaQuestions: [
      {
        id: 'dvlsi-viva-2-1',
        questionNumber: 1,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-2',
        question: 'Why did the semiconductor industry abandon constant voltage scaling after the 1990s?',
        answer: 'Constant voltage scaling caused the internal electric field to increase by S with each generation, causing severe hot-carrier injection, gate dielectric breakdown, and an exponential increase in chip power density (scaling as S³), leading to thermal limits (the "power wall").',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-2-2',
        questionNumber: 2,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-2',
        question: 'How does process transconductance parameter kp change with scaling factor S?',
        answer: 'Since gate oxide thickness t_ox is reduced by 1/S, gate capacitance per unit area C_ox = ε_ox / t_ox increases by S. Because kp = µ * C_ox, kp scales up linearly by S (e.g., from 100 µA/V² to 200 µA/V² for S = 2).',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-2-3',
        questionNumber: 3,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-2',
        question: 'What happens to total dynamic power dissipation per chip under Full Scaling?',
        answer: 'Under full scaling, power per transistor decreases by 1/S² (P\' = V\'*I\' = (V/S)*(I/S) = P/S²). Since the number of transistors per unit area increases by S², the power density remains constant, allowing chips of the same physical die size to operate at manageable heat dissipation.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-2-4',
        questionNumber: 4,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-2',
        question: 'Why cannot threshold voltage V_TO be scaled down indefinitely to 0V?',
        answer: 'Subthreshold leakage current increases exponentially as V_TO decreases (I_sub ~ 10^(-V_TO / S_sub)). If V_TO is scaled too low, off-state static power dissipation dominates total power, causing severe battery drain and chip overheating even in standby mode.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Dimensions scale as 1/S: L\' = L/S, W\' = W/S, tox\' = tox/S.',
        'Full Scaling scales voltages by 1/S: V\' = V/S, VTO\' = VTO/S.',
        'Current in Full Scaling scales as 1/S: 3.3 mA -> 1.6 mA.',
        'Current in Constant Voltage Scaling scales as S: 3.3 mA -> 6.6 mA.',
        'Constant Field Scaling keeps power density constant.'
      ],
      commonPitfalls: [
        'Assuming saturation current doubles in full scaling: It only doubles in constant voltage scaling. In full scaling, it decreases by 1/S.'
      ],
      examTips: [
        'Remember the scaling table: Dimension = 1/S, Voltage = 1/S, Current = 1/S, Power = 1/S², Power Density = 1.',
        'Know Robert Dennard\'s name and 1974 paper for extra viva credit.'
      ]
    },
    sourceReference: {
      docName: 'scaling.docx',
      pageNumber: 1,
      reviewNeeded: false,
      notes: 'Fully extracted from rawasset/dvlsi/scaling.docx. All 3 authentic LTspice screenshots associated and verified.'
    }
  },
  {
    id: 'dvlsi-exp-3',
    subjectId: 'dvlsi',
    expNumber: 3,
    title: 'CMOS Transistor-Level SR Latch: Schematic, Truth Table, and Transient Simulation',
    chapter: 'Sequential CMOS Logic Design',
    topic: 'CMOS Bistable Latches & Static Memory Cells',
    aim: 'To construct, model, and simulate a complete CMOS transistor-level cross-coupled Set-Reset (SR) latch in LTspice XVII using 4 PMOS and 4 NMOS transistors, and verify its truth table, state retention, reset dynamics, and invalid state behavior through transient analysis.',
    problemStatement: 'Design a cross-coupled SR latch by implementing two complementary CMOS NOR gates (each with series PMOS pull-up and parallel NMOS pull-down networks). Excite the Set (S) and Reset (R) nodes with asynchronous periodic pulse sources (2ms and 4ms periods) and perform a 10ms transient simulation (.tran 10m) to verify complementary rail-to-rail switching of outputs Q and Q_bar without glitching or invalid state latching.',
    theory: `### 1. Positive Feedback and Bistability in CMOS Latches

The Set-Reset (SR) latch is the primary building block of static sequential logic and SRAM memory cells.

- An active-HIGH latch is formed by **cross-coupling two 2-input NOR gates**.
- Output $Q$ feeds into one input of the second NOR gate, while complementary output $\\bar{Q}$ feeds back into the first NOR gate.
- This closed positive feedback loop exhibits **two stable operating points**:
  - **Set State:** $Q = 1\\text{ (5V)}$, $\\bar{Q} = 0\\text{ (0V)}$
  - **Reset State:** $Q = 0\\text{ (0V)}$, $\\bar{Q} = 1\\text{ (5V)}$

---

### 2. CMOS Transistor Topology (8 Transistors Total)

Each 2-input CMOS NOR gate is constructed using:
1. **Pull-Up Network (PUN):** Two PMOS transistors connected in **series** between the power rail ($V_{DD} = 5\\text{V}$) and the output node.
   - Because PMOS transistors conduct when their gate is LOW (0), both gates must be 0 simultaneously to complete the pull-up path to $5\\text{V}$.
2. **Pull-Down Network (PDN):** Two NMOS transistors connected in **parallel** between the output node and Ground ($0\\text{V}$).
   - If either input is HIGH (1), the corresponding NMOS conducts, pulling the output solidly down to Ground ($0\\text{V}$).

In the 8-transistor simulation schematic:
- **Left NOR Stage:** PMOS series pair ($M_6, M_5$) + NMOS parallel pair ($M_1, M_2$) produces output $\\bar{Q} = V(n006)$.
- **Right NOR Stage:** PMOS series pair ($M_8, M_7$) + NMOS parallel pair ($M_4, M_3$) produces output $Q = V(n008)$.

---

### 3. Step-by-Step State Analysis

#### State 1: Hold / Memory State (S = 0, R = 0)
- Both external input transistors ($M_1$ and $M_4$) remain OFF.
- The internal feedback maintains the stored bit indefinitely.
- If previously Set ($Q=1$), NMOS $M_2$ holds $\\bar{Q}=0$, keeping PMOS $M_7$ ON and sustaining $Q=1$ with zero static current.

#### State 2: Reset State (S = 0, R = 1)
- Input $R = 1$ turns ON NMOS $M_4$, pulling Output $Q \\to 0\\text{V}$.
- The $0\\text{V}$ on $Q$ turns ON PMOS $M_5$. Since $S=0$, $M_6$ is also ON.
- The series PMOS pair ($M_5, M_6$) pulls Output $\\bar{Q} \\to 5\\text{V}$.

#### State 3: Set State (S = 1, R = 0)
- Input $S = 1$ turns ON NMOS $M_1$, pulling Output $\\bar{Q} \\to 0\\text{V}$.
- The $0\\text{V}$ on $\\bar{Q}$ turns ON PMOS $M_7$. Since $R=0$, $M_8$ is also ON.
- The series PMOS pair ($M_7, M_8$) pulls Output $Q \\to 5\\text{V}$.

#### State 4: Forbidden / Invalid State (S = 1, R = 1)
- Both $S$ and $R$ inputs are driven HIGH simultaneously.
- NMOS transistors $M_1$ and $M_4$ both turn ON, forcing **both $Q = 0\\text{V}$ and $\\bar{Q} = 0\\text{V}$**.
- This breaks the fundamental logic requirement that $Q$ and $\\bar{Q}$ must be strictly complementary.
- If $S$ and $R$ return to 0 simultaneously, device mismatch induces **metastability**, causing an unpredictable latch outcome.`,
    prerequisites: [
      {
        concept: 'Bistable Multivibrator Principle',
        explanation: 'Positive feedback between two inverting gates creates two stable operating points that store 1 bit of information.',
        example: 'If Q is driven HIGH, it forces Q_bar LOW, which in turn reinforces Q to stay HIGH.'
      },
      {
        concept: 'CMOS NOR Transistor Architecture',
        explanation: 'Series PMOS pull-up network ensures high output only when both inputs are 0. Parallel NMOS pull-down pulls output low if either input is 1.',
        example: 'NMOS in parallel conducts when S=1 OR Q=1.'
      },
      {
        concept: 'SPICE Transient Pulse Syntax',
        explanation: 'PULSE(V1 V2 Tdelay Trise Tfall Ton Tperiod) defines asynchronous square wave excitations for digital inputs.',
        example: 'PULSE(0 5 0 0 0 1m 2m) creates a 0-5V pulse with 1ms pulse width and 2ms period.'
      }
    ],
    booleanExpression: "Q(t+1) = NOR(R, Q_bar) = S + R' · Q   [Characteristic SR Equation, valid for S · R = 0]",
    truthTable: {
      title: 'CMOS NOR-based SR Latch Complete State Transition Table',
      headers: ['S (Set)', 'R (Reset)', 'Q(t+1)', 'Q_bar(t+1)', 'Operational State', 'Internal Transistor Switching State'],
      rows: [
        ['0', '0', 'Q(t) (Latch)', 'Q_bar(t) (Latch)', 'Hold / Memory', 'M1, M4 OFF; state sustained by internal cross-coupling'],
        ['0', '1', '0', '1', 'Reset', 'M4 ON pulls Q->0V; M5, M6 series PMOS pull Q_bar->5V'],
        ['1', '0', '1', '0', 'Set', 'M1 ON pulls Q_bar->0V; M7, M8 series PMOS pull Q->5V'],
        ['1', '1', '0', '0', 'Forbidden (Invalid)', 'M1 and M4 ON simultaneously; forces Q=Q_bar=0, breaking complementarity']
      ]
    },
    logicDiagrams: [
      {
        id: 'dvlsi-exp3-diag1',
        url: '/assets/dvlsi/sr_latch_using_nor_image3.png',
        caption: 'Figure 3.1: Logic Gate Schematic and Truth Table for Cross-Coupled NOR SR Latch showing Set, Reset, Hold, and Forbidden conditions.',
        alt: 'SR Latch logic diagram and truth table'
      },
      {
        id: 'dvlsi-exp3-diag2',
        url: '/assets/dvlsi/sr_latch_using_nor_image1.png',
        caption: 'Figure 3.2: Complete CMOS Transistor-Level Schematic in LTspice XVII: 4 PMOS (M5, M6, M7, M8) and 4 NMOS (M1, M2, M3, M4) with .tran 10m directive.',
        alt: 'Transistor-level CMOS SR latch schematic'
      }
    ],
    waveforms: [
      {
        id: 'dvlsi-exp3-wave1',
        url: '/assets/dvlsi/sr_latch_using_nor_image2.png',
        caption: 'Figure 3.3: 4-Trace Transient Simulation Output (.tran 10m): Top trace V(n004) Set pulse (green), 2nd trace V(n002) Reset pulse (blue), 3rd trace V(n008) Q output (red), bottom trace V(n006) Q_bar complementary output (cyan).',
        alt: 'Transient simulation waveforms of SR latch'
      }
    ],
    componentsList: [
      { designator: 'M1', component: 'NMOS Transistor', value: 'Default NMOS', description: 'NOR2 pull-down driven by Set input (V4)' },
      { designator: 'M2', component: 'NMOS Transistor', value: 'Default NMOS', description: 'NOR2 pull-down driven by cross-coupled feedback Q' },
      { designator: 'M3', component: 'NMOS Transistor', value: 'Default NMOS', description: 'NOR1 pull-down driven by cross-coupled feedback Q_bar' },
      { designator: 'M4', component: 'NMOS Transistor', value: 'Default NMOS', description: 'NOR1 pull-down driven by Reset input (V3)' },
      { designator: 'M5', component: 'PMOS Transistor', value: 'Default PMOS', description: 'NOR2 series pull-up driven by cross-coupled feedback Q' },
      { designator: 'M6', component: 'PMOS Transistor', value: 'Default PMOS', description: 'NOR2 series pull-up driven by Set input (V4)' },
      { designator: 'M7', component: 'PMOS Transistor', value: 'Default PMOS', description: 'NOR1 series pull-up driven by cross-coupled feedback Q_bar' },
      { designator: 'M8', component: 'PMOS Transistor', value: 'Default PMOS', description: 'NOR1 series pull-up driven by Reset input (V3)' },
      { designator: 'V1, V2', component: 'DC Voltage Source', value: '5 V', description: 'V_DD power rails for left and right NOR stages' },
      { designator: 'V4', component: 'Pulse Generator', value: 'PULSE(0 5 0 0 0 1m 2m)', description: 'Set (S) input pulse train (1ms high, 2ms period)' },
      { designator: 'V3', component: 'Pulse Generator', value: 'PULSE(0 5 0 0 0 2m 4m)', description: 'Reset (R) input pulse train (2ms high, 4ms period)' }
    ],
    simulationSetup: {
      software: 'LTspice XVII',
      directives: [
        '.tran 10m (Transient analysis from 0 to 10 milliseconds)',
        'V4: PULSE(0 5 0 0 0 1m 2m) - Set pulse input',
        'V3: PULSE(0 5 0 0 0 2m 4m) - Reset pulse input'
      ],
      parameters: [
        { name: 'Supply Voltage (V1, V2)', value: '5.0 V', description: 'Standard CMOS logic level' },
        { name: 'Set Pulse Period', value: '2.0 ms', description: 'Duty cycle 50% (1ms ON, 1ms OFF)' },
        { name: 'Reset Pulse Period', value: '4.0 ms', description: 'Duty cycle 50% (2ms ON, 2ms OFF)' },
        { name: 'Transient Duration', value: '10.0 ms', description: 'Captures 5 complete Set periods and 2.5 Reset cycles' }
      ],
      notes: 'Directly verified from rawasset/dvlsi/SR latch Using NOR.docx.'
    },
    traceBreakdown: [
      {
        label: 'V(n004) - Set Input (S)',
        signal: 'Set Pulse Train',
        color: 'Green (Top Trace)',
        type: 'Transient Input',
        behavior: 'Periodic square wave swinging 0V to 5V with 2ms period and 1ms active high duration.'
      },
      {
        label: 'V(n002) - Reset Input (R)',
        signal: 'Reset Pulse Train',
        color: 'Blue (2nd Trace)',
        type: 'Transient Input',
        behavior: 'Periodic square wave swinging 0V to 5V with 4ms period and 2ms active high duration.'
      },
      {
        label: 'V(n008) - Latch Output (Q)',
        signal: 'Primary Output Q',
        color: 'Red (3rd Trace)',
        type: 'Transient Output',
        behavior: 'Swings rail-to-rail (0V to 5V). Sets to 5V when S pulses high while R is low. Resets to 0V when R pulses high. Holds 5V during S=0, R=0 intervals.'
      },
      {
        label: 'V(n006) - Latch Output (Q_bar)',
        signal: 'Complementary Output Q_bar',
        color: 'Cyan (Bottom Trace)',
        type: 'Transient Output',
        behavior: 'Exact logical inverse of Q (swings 5V to 0V). After an initial startup transient, it mirrors Q with zero phase overlap.'
      }
    ],
    observationTable: {
      title: 'Transient Waveform Time-Slice Verification (0 to 10 ms)',
      headers: ['Time Window', 'Set (S)', 'Reset (R)', 'Output Q', 'Output Q_bar', 'Latch Action Verified'],
      rows: [
        ['0.0 - 1.0 ms', '5.0 V (HIGH)', '5.0 V (HIGH)', '0.0 V', '0.0 V', 'Both inputs HIGH: forces Q=Q_bar=0 (Invalid state)'],
        ['1.0 - 2.0 ms', '0.0 V (LOW)', '5.0 V (HIGH)', '0.0 V', '5.0 V', 'Reset State: R=1, S=0 resets Q=0 and sets Q_bar=1'],
        ['2.0 - 3.0 ms', '5.0 V (HIGH)', '0.0 V (LOW)', '5.0 V', '0.0 V', 'Set State: S=1, R=0 sets Q=1 and resets Q_bar=0'],
        ['3.0 - 4.0 ms', '0.0 V (LOW)', '0.0 V (LOW)', '5.0 V', '0.0 V', 'Hold State: S=0, R=0 retains previous Set state Q=1'],
        ['4.0 - 5.0 ms', '5.0 V (HIGH)', '5.0 V (HIGH)', '0.0 V', '0.0 V', 'Both inputs HIGH: forces Q=Q_bar=0'],
        ['5.0 - 6.0 ms', '0.0 V (LOW)', '5.0 V (HIGH)', '0.0 V', '5.0 V', 'Reset State: Q cleanly transitions to 0V, Q_bar to 5V'],
        ['6.0 - 7.0 ms', '5.0 V (HIGH)', '0.0 V (LOW)', '5.0 V', '0.0 V', 'Set State: Q cleanly transitions to 5V, Q_bar to 0V'],
        ['7.0 - 8.0 ms', '0.0 V (LOW)', '0.0 V (LOW)', '5.0 V', '0.0 V', 'Hold State: S=0, R=0 successfully holds stored 1 bit']
      ]
    },
    codeSnippets: [
      {
        language: 'spice',
        filename: 'cmos_sr_latch.cir',
        explanation: 'Complete transistor-level SPICE netlist recreating the LTspice schematic.',
        code: `* CMOS Transistor-Level SR Latch Using Cross-Coupled NOR Gates
* Left NOR: M6 (PMOS), M5 (PMOS), M1 (NMOS), M2 (NMOS)
* Right NOR: M8 (PMOS), M7 (PMOS), M3 (NMOS), M4 (NMOS)

* Left NOR Gate (Output: Q_bar = n006)
M6 n005 n004 V1 V1 PMOS
M5 n006 n008 n005 V1 PMOS
M1 n006 n004 0 0 NMOS
M2 n006 n008 0 0 NMOS

* Right NOR Gate (Output: Q = n008)
M8 n007 n002 V2 V2 PMOS
M7 n008 n006 n007 V2 PMOS
M4 n008 n002 0 0 NMOS
M3 n008 n006 0 0 NMOS

* Power Supplies
V1 V1 0 5
V2 V2 0 5

* Input Pulse Generators
V4 n004 0 PULSE(0 5 0 0 0 1m 2m)  ; Set Input (S)
V3 n002 0 PULSE(0 5 0 0 0 2m 4m)  ; Reset Input (R)

.tran 10m
.end`
      }
    ],
    result: 'The 8-transistor CMOS SR latch was successfully simulated in LTspice XVII across a 10ms transient timeline. The simulation fully confirmed the Set, Reset, Hold, and Invalid operating regimes, demonstrating full 0V to 5V rail-to-rail voltage swings and zero static power dissipation in the hold state.',
    conclusion: 'Transistor-level cross-coupling of CMOS NOR gates provides robust bistable storage without requiring refresh cycles. The parallel NMOS pull-down network ensures fast discharge times during switching, while the series PMOS pull-up network guarantees high output states with zero static current when both gate inputs are low.',
    vivaQuestions: [
      {
        id: 'dvlsi-viva-3-1',
        questionNumber: 1,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-3',
        question: 'Why is the input condition S = 1 and R = 1 called the "forbidden" or "invalid" state in an SR latch?',
        answer: 'When S=1 and R=1, both parallel NMOS pull-down transistors turn ON simultaneously, pulling both Q and Q_bar to 0V. This breaks the fundamental requirement that Q and Q_bar must be complementary. Furthermore, if S and R transition back to 0 simultaneously, the circuit enters an unpredictable race condition (metastability).',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-3-2',
        questionNumber: 2,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-3',
        question: 'What is the primary difference between a latch and a flip-flop in digital VLSI?',
        answer: 'A latch is level-sensitive, meaning its output responds to inputs continuously whenever the enable signal is active. A flip-flop is edge-triggered, sampling its inputs and updating its outputs only on the transition of a clock edge (rising or falling edge).',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-3-3',
        questionNumber: 3,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-3',
        question: 'Why are PMOS transistors connected in series in the pull-up network of a CMOS NOR gate?',
        answer: 'A NOR function produces a logic HIGH only when both inputs are 0 (A=0 AND B=0). Since a PMOS conducts when its gate is 0, placing two PMOS transistors in series guarantees a conducting path from V_DD to the output only when both inputs are simultaneously LOW.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-3-4',
        questionNumber: 4,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-3',
        question: 'How many transistors are used in an industry-standard 6T SRAM cell, and how does it relate to this latch?',
        answer: 'A 6T SRAM cell consists of two cross-coupled CMOS inverters (4 transistors) forming the bistable storage core, plus two NMOS access transistors controlled by a Word Line to read and write data from Bit Lines.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Active-HIGH SR latch uses 2 cross-coupled NOR gates (8 CMOS transistors total).',
        'S=1, R=0 -> Set (Q=1, Q_bar=0).',
        'S=0, R=1 -> Reset (Q=0, Q_bar=1).',
        'S=0, R=0 -> Hold (State retained by positive feedback).',
        'S=1, R=1 -> Forbidden (Q=Q_bar=0, causes metastability upon release).'
      ],
      commonPitfalls: [
        'Confusing active-HIGH (NOR-based) with active-LOW (NAND-based) latches: In NAND latches, S=0, R=0 is forbidden and S=1, R=1 is hold.'
      ],
      examTips: [
        'Be prepared to draw the 8-transistor CMOS schematic: Series PMOS pull-up, parallel NMOS pull-down.',
        'Know the characteristic equation: Q(next) = S + R_bar * Q for S * R = 0.'
      ]
    },
    sourceReference: {
      docName: 'SR latch Using NOR.docx',
      pageNumber: 1,
      reviewNeeded: false,
      notes: 'Fully extracted from rawasset/dvlsi/SR latch Using NOR.docx. Schematic, 4-trace transient waveform, and logic truth table verified.'
    }
  },
  {
    id: 'dvlsi-exp-4',
    subjectId: 'dvlsi',
    expNumber: 4,
    title: 'NMOS Inverter with Resistive Load: DC Voltage Transfer Characteristics (VTC) and Transient Response',
    chapter: 'MOS Inverters & Static Logic',
    topic: 'Resistive-Load Inverters & Logic Swing Analysis',
    aim: 'To design, simulate, and analyze an NMOS inverter with a passive resistive pull-up load (R_L = 1000kΩ = 1 MΩ) in LTspice XVII, capturing its DC Voltage Transfer Characteristic (VTC) curve, calculating critical voltages (V_OH, V_OL, V_IL, V_IH) and noise margins, and evaluating transient switching delay asymmetry.',
    problemStatement: 'Construct a resistive-load NMOS inverter using driver NMOS M1, pull-up resistor R1 = 1000kΩ, and supply rail V2 = 3.3V. Perform a DC voltage sweep (.dc v1 0 3.3 0.5) to capture the static VTC curve, followed by a transient simulation (.tran 0 5m 0) excited by a 2ms square pulse train (V1) to examine pull-up RC charging delay vs. fast NMOS pull-down discharging.',
    theory: `### 1. Circuit Architecture and Operational Concept

The resistive-load inverter represents the historical foundation of NMOS static logic circuits.

The circuit comprises:
- **Driver Transistor ($M_1$):** An N-channel enhancement MOSFET whose source connects to Ground and gate serves as the signal input $V_{in} = V_1$.
- **Passive Pull-Up Resistor ($R_1$):** A $1000\\text{ k}\\Omega$ ($1\\text{ M}\\Omega$) resistor connected between supply rail $V_{DD} = 3.3\\text{V}$ and the drain output node $V_{out} = V(n001)$.

---

### 2. Operational Regimes Across the DC Transfer Curve (VTC)

#### Region 1: Cutoff Mode (Vin < 0.5V)
- **Transistor State:** Input voltage is below the driver threshold ($V_{in} < V_{TH} \\approx 0.5\\text{V}$). Driver $M_1$ is completely OFF ($I_D = 0$).
- **Output Voltage:** With zero current flowing through $R_1$, there is zero voltage drop across the resistor.
- **Resulting Level:** Output pulls up to the full positive rail:
  $$V_{OH} = V_{DD} = 3.3\\text{V}$$

#### Region 2: Saturation Transition (0.5V ≤ Vin < 1.2V)
- **Transistor State:** Driver $M_1$ turns ON and operates in the saturation region ($V_{DS} \\ge V_{in} - V_{TH}$).
- **Drain Current:** Follows the square-law relation:
  $$I_D = \\frac{1}{2} \\cdot k_n \\cdot (V_{in} - V_{TH})^2$$
- **Output Characteristic:** Output voltage drops steeply according to:
  $$V_{out} = V_{DD} - I_D \\cdot R_1$$

#### Region 3: Linear / Triode Mode (Vin ≥ 1.2V up to 3.3V)
- **Transistor State:** As $V_{out}$ drops below $V_{in} - V_{TH}$, $M_1$ enters the linear region, acting as an on-state channel resistance $R_{on}$.
- **Output Low Voltage (VOL):** The output forms a resistive voltage divider:
  $$V_{OL} = V_{DD} \\cdot \\left[ \\frac{R_{on}}{R_1 + R_{on}} \\right]$$
- **Ratioed Logic Consequence:** Because $R_{on} > 0$, **$V_{OL}$ is non-zero ($\\approx 0.08\\text{V}$)**.

---

### 3. Transient Asymmetry and Static Power Penalty

#### Falling Edge (Fast NMOS Discharge)
- When $V_{in}$ steps HIGH ($0\\text{V} \\to 3.3\\text{V}$), $M_1$ turns ON strongly.
- Provides a high-conductance path that discharges load capacitance $C_L$ rapidly to ground with minimal fall time ($t_f$).

#### Rising Edge (Slow RC Charging)
- When $V_{in}$ steps LOW ($3.3\\text{V} \\to 0\\text{V}$), $M_1$ turns OFF.
- Load capacitance must charge exclusively through the large $1000\\text{ k}\\Omega$ pull-up resistor.
- The charging curve follows:
  $$V_{out}(t) = V_{DD} \\cdot \\left(1 - e^{-t / (R_1 \\cdot C_L)}\\right)$$
  resulting in a slow, rounded exponential rise edge.

#### Continuous Static Power Dissipation
- Whenever output is LOW ($V_{in} = 3.3\\text{V}$), current flows continuously from $V_{DD}$ to Ground:
  $$P_{static} = \\frac{V_{DD}^2}{R_1 + R_{on}} \\approx \\frac{(3.3)^2}{10^6} \\approx 10.9\\,\\mu\\text{W}$$`,
    prerequisites: [
      {
        concept: 'Ratioed Logic Concept',
        explanation: 'In ratioed logic, the output low voltage V_OL depends on the ratio of load resistance to driver on-resistance, rather than reaching true ground.',
        example: 'V_OL = V_DD * [R_on / (R_L + R_on)] > 0V.'
      },
      {
        concept: 'Noise Margin Definitions',
        explanation: 'Noise margins measure tolerance against electrical noise: NM_H = V_OH - V_IH and NM_L = V_IL - V_OL.',
        example: 'Higher noise margins prevent spurious logic flipping in noisy digital environments.'
      }
    ],
    booleanExpression: "V_out = V_DD - [I_D(V_in) · R_1]   |   V_OL = V_DD · [R_on / (R_1 + R_on)] ≈ 0.08V",
    logicDiagrams: [
      {
        id: 'dvlsi-exp4-diag1',
        url: '/assets/dvlsi/tranfer_char_of_nmos_ip_and_op_image1.png',
        caption: 'Figure 4.1: LTspice Schematic and DC Voltage Transfer Characteristic (VTC): M1 NMOS with R1=1000kΩ, V2=3.3V, .dc v1 0 3.3 0.5. Green curve shows V(n001) falling from 3.3V to ~0.08V.',
        alt: 'Resistive load NMOS inverter schematic and DC VTC'
      }
    ],
    waveforms: [
      {
        id: 'dvlsi-exp4-wave1',
        url: '/assets/dvlsi/tranfer_char_of_nmos_ip_and_op_image2.png',
        caption: 'Figure 4.2: Transient Analysis (.tran 0 5m 0): Bottom trace V(n003) input pulse (0-3.3V, blue) vs. Top trace V(n001) inverted output (green) illustrating fast fall edge and RC exponential rise edge.',
        alt: 'Resistive load NMOS inverter transient waveform'
      }
    ],
    componentsList: [
      { designator: 'M1', component: 'NMOS Transistor', value: 'Default NMOS', description: 'Driver transistor discharging output to ground' },
      { designator: 'R1', component: 'Resistor', value: '1000 kΩ (1 MΩ)', description: 'Passive pull-up load resistor' },
      { designator: 'V1', component: 'Voltage Source', value: '3.3 V / Pulse', description: 'Input signal: 3.3V for DC sweep, PULSE(0 3.3 0 0 0 1m 2m) for transient' },
      { designator: 'V2', component: 'DC Voltage Source', value: '3.3 V', description: 'Primary power supply rail (V_DD)' }
    ],
    simulationSetup: {
      software: 'LTspice XVII',
      directives: [
        '.dc v1 0 3.3 0.5  (DC voltage sweep from 0 to 3.3V with 0.5V step)',
        '.tran 0 5m 0       (Transient simulation over 5 milliseconds)',
        'V1: PULSE(0 3.3 0 0 0 1m 2m) (Input pulse generator: 0 to 3.3V, 1ms pulse width, 2ms period)'
      ],
      parameters: [
        { name: 'Supply Voltage (V2)', value: '3.3 V', description: 'Standard low-power logic rail' },
        { name: 'Pull-Up Resistance (R1)', value: '1000 kΩ', description: 'Large pull-up resistor to minimize static power' },
        { name: 'Input Pulse Frequency', value: '500 Hz (T=2ms)', description: '50% duty cycle square wave' }
      ],
      notes: 'Directly verified from rawasset/dvlsi/Tranfer char of nmos, ip and op.docx.'
    },
    traceBreakdown: [
      {
        label: 'DC Transfer Curve V(n001)',
        signal: 'Output Voltage vs Input',
        color: 'Green (Top Plot, Fig 4.1)',
        type: 'DC Sweep Output',
        behavior: 'Remains at 3.3V for V1 = 0V, drops sharply between 0.3V and 1.2V as M1 turns on, and levels off to ~0.08V for V1 > 1.8V.'
      },
      {
        label: 'Transient Input V(n003)',
        signal: 'Input Pulse Train',
        color: 'Blue (Bottom Plot, Fig 4.2)',
        type: 'Transient Input',
        behavior: 'Square wave switching cleanly between 0.0V and 3.3V with 2ms period.'
      },
      {
        label: 'Transient Output V(n001)',
        signal: 'Inverted Output Pulse',
        color: 'Green (Top Plot, Fig 4.2)',
        type: 'Transient Output',
        behavior: 'Inverted replica of input. Sharp vertical falling edge (fast NMOS discharge) and exponential RC rounded rising edge (slow 1MΩ charging).'
      }
    ],
    observationTable: {
      title: 'Resistive-Load NMOS Inverter Critical Parameters (V_DD = 3.3V, R_L = 1000 kΩ)',
      headers: ['Parameter', 'Measured Value', 'Theoretical Formula / Condition', 'Design Implication'],
      rows: [
        ['Output High Voltage (V_OH)', '3.30 V', 'V_DD (M1 in cutoff, I_D = 0)', 'Full rail pull-up achieved'],
        ['Output Low Voltage (V_OL)', '0.08 V', 'V_DD * [R_on / (R_L + R_on)]', 'Non-zero due to ratioed logic'],
        ['Input Low Threshold (V_IL)', '0.45 V', 'Slope dV_out/dV_in = -1', 'Upper limit of valid Logic 0 input'],
        ['Input High Threshold (V_IH)', '1.20 V', 'Slope dV_out/dV_in = -1', 'Lower limit of valid Logic 1 input'],
        ['Noise Margin High (NM_H)', '2.10 V', 'V_OH - V_IH = 3.30 - 1.20', 'High tolerance against positive noise spikes'],
        ['Noise Margin Low (NM_L)', '0.37 V', 'V_IL - V_OL = 0.45 - 0.08', 'Limited noise immunity for Logic 0'],
        ['Static Power (Output LOW)', '10.8 µW', 'V_DD² / R_L = 3.3² / 10⁶', 'Continuous DC power dissipation']
      ]
    },
    codeSnippets: [
      {
        language: 'spice',
        filename: 'nmos_resistive_inverter.cir',
        explanation: 'SPICE netlist for DC sweep and transient simulation of the resistive-load NMOS inverter.',
        code: `* NMOS Inverter with Resistive Load
* Driver: M1 (NMOS), Load: R1 = 1000k (1M)

M1 n001 n003 0 0 NMOS
R1 n002 n001 1000k
V2 n002 0 3.3

* Input for DC sweep
* V1 n003 0 3.3
* .dc v1 0 3.3 0.5

* Input for Transient analysis (active)
V1 n003 0 PULSE(0 3.3 0 0 0 1m 2m)
.tran 0 5m 0

.end`
      }
    ],
    result: 'The resistive-load NMOS inverter was simulated in LTspice XVII for both DC transfer and transient modes. The DC VTC verified an inverting profile with V_OH = 3.3V and a non-zero V_OL ≈ 0.08V. Transient simulation demonstrated inverted switching with asymmetric dynamics: a fast fall time driven by M1 and a slower RC exponential rise time governed by the 1000kΩ load resistor.',
    conclusion: 'Resistive-load NMOS inverters illustrate the fundamental compromise of ratioed logic: achieving a sufficiently low V_OL requires making R_L much larger than R_on (R_L >> R_on). However, a large R_L drastically degrades the Low-to-High rise time (RC delay) and consumes vast silicon layout area. Furthermore, continuous static power dissipation when output is LOW makes this architecture impractical for modern dense VLSI circuits.',
    vivaQuestions: [
      {
        id: 'dvlsi-viva-4-1',
        questionNumber: 1,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-4',
        question: 'Why is V_OL not equal to 0V in a resistive-load NMOS inverter?',
        answer: 'When the NMOS transistor is ON, it exhibits a finite channel resistance R_on. The output voltage is formed by a voltage divider between R_L and R_on: V_OL = V_DD * [R_on / (R_L + R_on)]. Because R_on is greater than zero, V_OL cannot reach true ground.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-4-2',
        questionNumber: 2,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-4',
        question: 'Why is the rising edge slower than the falling edge in the transient waveform?',
        answer: 'During the falling edge, the NMOS turns ON and provides a strong, low-impedance path to discharge load capacitance. During the rising edge, the NMOS is OFF and the capacitance must charge exclusively through the large 1000kΩ pull-up resistor, creating a slow RC time constant (τ = R_L * C_L).',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-4-3',
        questionNumber: 3,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-4',
        question: 'What is meant by "ratioed logic"?',
        answer: 'Ratioed logic refers to a logic family where output voltage levels (specifically V_OL) depend on the geometric or resistance ratio of the pull-up and pull-down devices, in contrast to ratioless CMOS where full rail-to-rail levels are independent of device sizing.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-4-4',
        questionNumber: 4,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-4',
        question: 'Why are resistors rarely used as pull-up loads in integrated circuit fabrication?',
        answer: 'Fabricating large on-chip resistors (such as 1 MΩ) consumes huge silicon area compared to active transistors. In modern processes, an active depletion-mode NMOS or PMOS transistor is used instead to achieve high effective resistance within a tiny physical footprint.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'Resistive-load inverter: M1 NMOS driver + R1 (1 MΩ) pull-up resistor.',
        'V_OH = V_DD = 3.3V (M1 OFF, I_D = 0).',
        'V_OL = V_DD * [R_on / (R_L + R_on)] ≈ 0.08V (Ratioed logic limitation).',
        'Fast fall edge (NMOS discharges), slow exponential rise edge (R_L charges C_L).',
        'Suffers from static DC power dissipation when output is LOW.'
      ],
      commonPitfalls: [
        'Assuming V_OL reaches 0V: It does not; it forms a resistive divider.',
        'Overlooking the 1000kΩ (1 MΩ) value: "1000k" in SPICE syntax equals 1 Megaohm.'
      ],
      examTips: [
        'Be ready to calculate Noise Margin Low: NM_L = V_IL - V_OL.',
        'Highlight static power dissipation as the main reason why CMOS replaced NMOS.'
      ]
    },
    sourceReference: {
      docName: 'Tranfer char of nmos, ip and op.docx',
      pageNumber: 1,
      reviewNeeded: false,
      notes: 'Fully extracted from rawasset/dvlsi/Tranfer char of nmos, ip and op.docx. Both LTspice screenshots (DC VTC and transient waveform) verified.'
    }
  },
  {
    id: 'dvlsi-exp-5',
    subjectId: 'dvlsi',
    expNumber: 5,
    title: 'CMOS Inverter: DC Voltage Transfer Characteristics (VTC), Supply Current Peak, and Transient Switching Dynamics',
    chapter: 'CMOS Inverter Analysis',
    topic: 'Static & Dynamic CMOS Inverter Characteristics',
    aim: 'To design, simulate, and characterize a complementary CMOS inverter in LTspice XVII, mapping out its DC Voltage Transfer Characteristic (VTC), identifying the five operating regions of PMOS and NMOS transistors, observing the short-circuit supply current peak at switching midpoint V_M, and evaluating transient switching propagation delays.',
    problemStatement: 'Construct a CMOS inverter using a PMOS pull-up transistor (M2) and an NMOS pull-down transistor (M1) connected to a 5.0V supply rail. Perform a high-resolution DC sweep (.dc v1 0 5 0.1) simultaneously plotting output voltage V(n003) and supply current Is(M2). Perform transient analysis (.tran 0 5MS 0) with a 2ms pulse input to verify full rail-to-rail logic swing and zero static quiescent current.',
    theory: `### 1. Complementary CMOS Architecture

The CMOS inverter is the universal benchmark circuit of digital VLSI technology.

- **Pull-Up Network:** PMOS transistor ($M_2$) with Source connected to $V_{DD} = 5.0\\text{V}$.
- **Pull-Down Network:** NMOS transistor ($M_1$) with Source connected to Ground ($0\\text{V}$).
- Common Gate input $V_{in} = V_1$; common Drain output node $V_{out} = V(n003)$.

---

### 2. The Five Operating Regions Across the VTC

#### Region A: Input Low (Vin < VTH,n: 0.0V to 0.8V)
- **NMOS ($M_1$):** **CUTOFF** ($V_{GS,n} < V_{TH,n} \\implies I_{Dn} = 0$).
- **PMOS ($M_2$):** **LINEAR** ($|V_{GS,p}| = 5\\text{V}$, $|V_{DS,p}| \\approx 0\\text{V}$).
- **Output:** Pulled fully to the positive rail:
  $$V_{out} = V_{OH} = V_{DD} = 5.0\\text{V}$$
- **Static Current:** Exactly zero ($I_{DD} = 0\\,\\mu\\text{A}$).

#### Region B: Moderate Pull-Down (0.8V ≤ Vin < 2.3V)
- **NMOS ($M_1$):** Enters **SATURATION** ($V_{DS,n} > V_{GS,n} - V_{TH,n}$).
- **PMOS ($M_2$):** Remains in **LINEAR** ($|V_{DS,p}| < |V_{GS,p}| - |V_{TH,p}|$).
- **Output:** Falls smoothly from $5.0\\text{V}$ towards $4.0\\text{V}$.
- **Current:** Current begins to rise ($0$ to $40\\,\\mu\\text{A}$).

#### Region C: Switching Threshold (Vin ≈ VM = 2.5V)
- **Transistor States:** **BOTH NMOS and PMOS operate simultaneously in SATURATION**.
- **Voltage Gain:** Extremely high open-loop slope ($|dV_{out} / dV_{in}| \\gg 1$), producing an almost vertical drop from $4.0\\text{V}$ to $1.0\\text{V}$.
- **Dynamic Current Spike:** A low-impedance path opens momentarily from $V_{DD}$ to Ground, producing a **peak short-circuit current of $64\\,\\mu\\text{A}$**.
- **Switching Midpoint ($V_M$):**
  $$V_M \\approx \\frac{V_{DD}}{2} = 2.5\\text{V} \\quad (\\text{for symmetric sizing } k_n = k_p)$$

#### Region D: Moderate Pull-Up (2.7V < Vin ≤ 4.2V)
- **NMOS ($M_1$):** Enters **LINEAR** ($V_{DS,n} < V_{GS,n} - V_{TH,n}$).
- **PMOS ($M_2$):** Enters **SATURATION** ($|V_{DS,p}| > |V_{GS,p}| - |V_{TH,p}|$).
- **Output:** Decreases smoothly towards $0.5\\text{V}$.
- **Current:** Current falls back from $40\\,\\mu\\text{A}$ towards zero.

#### Region E: Input High (Vin > 4.2V up to 5.0V)
- **NMOS ($M_1$):** **LINEAR** (strong conducting channel).
- **PMOS ($M_2$):** **CUTOFF** ($|V_{GS,p}| < |V_{TH,p}| \\implies I_{Dp} = 0$).
- **Output:** Pulled solidly down to Ground:
  $$V_{out} = V_{OL} = 0.0\\text{V}$$
- **Static Current:** Exactly zero ($I_{DD} = 0\\,\\mu\\text{A}$).

---

### 3. Key Performance Advantages of CMOS

1. **Zero Static Power Dissipation:**
   In both stable states ($V_{in}=0\\text{V}$ or $V_{in}=5\\text{V}$), one transistor is completely OFF. Current flows only during input switching transitions.
2. **Full Rail-to-Rail Logic Swing:**
   $$V_{swing} = V_{OH} - V_{OL} = 5.0\\text{V} - 0.0\\text{V} = 5.0\\text{V}$$
3. **High Noise Immunity:**
   Symmetric switching provides equal and robust noise margins:
   $$NM_H = V_{OH} - V_{IH} = 2.10\\text{V}, \\quad NM_L = V_{IL} - V_{OL} = 2.10\\text{V}$$`,
    prerequisites: [
      {
        concept: 'Complementary MOS Principle',
        explanation: 'At any steady-state logic level (0 or 1), one transistor is completely OFF, ensuring zero static DC path from supply to ground.',
        example: 'Input=0V turns PMOS ON and NMOS OFF; Input=5V turns NMOS ON and PMOS OFF.'
      },
      {
        concept: 'Switching Threshold (V_M)',
        explanation: 'The input voltage where V_in = V_out. For symmetric CMOS, V_M = V_DD / 2.',
        example: 'For V_DD = 5V, V_M is centered at 2.5V.'
      },
      {
        concept: 'Short-Circuit Current Spike',
        explanation: 'During input transitions across V_M, both PMOS and NMOS briefly conduct simultaneously, drawing a short current spike from V_DD.',
        example: 'Visible as the blue triangular peak reaching 64µA in Figure 5.1.'
      }
    ],
    booleanExpression: "V_out = NOT(V_in)   |   Symmetric Midpoint: V_M ≈ V_DD / 2 = 2.5V   |   Swing: 0V ↔ 5V",
    logicDiagrams: [
      {
        id: 'dvlsi-exp5-diag1',
        url: '/assets/dvlsi/transfer_curve_of_cmos_image1.png',
        caption: 'Figure 5.1: LTspice Schematic, DC VTC Curve (Green V(n003)), and Supply Current Curve (Blue Is(M2)): Symmetrical transition at 2.5V with short-circuit current peak reaching 64µA.',
        alt: 'CMOS inverter schematic, DC transfer curve, and current peak'
      }
    ],
    waveforms: [
      {
        id: 'dvlsi-exp5-wave1',
        url: '/assets/dvlsi/transfer_curve_of_cmos_image2.png',
        caption: 'Figure 5.2: Transient Switching Analysis (.tran 0 5MS 0): Input square pulse V(n002) (0-3.3V, blue) vs. Output square pulse V(n003) (0-5V, green) showing clean rail-to-rail inversion.',
        alt: 'CMOS inverter transient switching waveforms'
      }
    ],
    componentsList: [
      { designator: 'M1', component: 'NMOS Transistor', value: 'Default NMOS', description: 'Pull-down driver connected between output and Ground' },
      { designator: 'M2', component: 'PMOS Transistor', value: 'Default PMOS', description: 'Pull-up driver connected between V_DD and output' },
      { designator: 'V1', component: 'Voltage Source', value: '5.0 V / Pulse', description: 'Input voltage: swept 0-5V for DC VTC; PULSE(0 3.3 0 0 0 1m 2m) for transient' },
      { designator: 'V2', component: 'DC Voltage Source', value: '5.0 V', description: 'Primary power supply rail (V_DD)' }
    ],
    simulationSetup: {
      software: 'LTspice XVII',
      directives: [
        '.dc v1 0 5 0.1  (DC sweep of input V1 from 0V to 5V with 0.1V step)',
        '.tran 0 5MS 0    (Transient simulation over 5 milliseconds)',
        'V1: PULSE(0 3.3 0 0 0 1m 2m) (Input pulse generator: 0 to 3.3V, 1ms pulse width, 2ms period)'
      ],
      parameters: [
        { name: 'Supply Rail (V2)', value: '5.0 V', description: 'Standard digital CMOS rail' },
        { name: 'Switching Midpoint (V_M)', value: '2.5 V', description: 'Symmetric threshold V_DD / 2' },
        { name: 'Peak Short-Circuit Current', value: '64 µA', description: 'Maximum dynamic current spike at V_in = 2.5V' }
      ],
      notes: 'Directly verified from rawasset/dvlsi/Transfer curve of cmos.docx.'
    },
    traceBreakdown: [
      {
        label: 'DC Voltage Transfer Curve V(n003)',
        signal: 'Output Voltage vs Input',
        color: 'Green (Fig 5.1)',
        type: 'DC Sweep Output',
        behavior: 'Starts at full 5.0V, exhibits steep symmetric transition centered at 2.5V, and pulls down solidly to 0.0V.'
      },
      {
        label: 'Supply Current Is(M2)',
        signal: 'PMOS Source Current',
        color: 'Blue (Fig 5.1)',
        type: 'DC Sweep Current',
        behavior: 'Strictly zero at V_in = 0V and V_in = 5V. Rises symmetrically to a triangular peak of 64 µA at V_in = 2.5V when both transistors saturate.'
      },
      {
        label: 'Transient Input V(n002)',
        signal: 'Input Pulse Train',
        color: 'Blue (Bottom Plot, Fig 5.2)',
        type: 'Transient Input',
        behavior: 'Square wave switching between 0.0V and 3.3V with 2ms period and 1ms active high duration.'
      },
      {
        label: 'Transient Output V(n003)',
        signal: 'Inverted Output Pulse Train',
        color: 'Green (Top Plot, Fig 5.2)',
        type: 'Transient Output',
        behavior: 'Inverted waveform swinging rail-to-rail from 0.0V to 5.0V with sharp, symmetric rise and fall edges.'
      }
    ],
    observationTable: {
      title: 'CMOS Inverter Characteristics & Region Boundaries (V_DD = 5.0 V)',
      headers: ['Operating Parameter', 'Observed Value', 'Theoretical Ideal', 'Physical Condition'],
      rows: [
        ['Output High Voltage (V_OH)', '5.00 V', '5.00 V (V_DD)', 'PMOS ON (Linear), NMOS OFF (Cutoff)'],
        ['Output Low Voltage (V_OL)', '0.00 V', '0.00 V (GND)', 'NMOS ON (Linear), PMOS OFF (Cutoff)'],
        ['Switching Threshold (V_M)', '2.50 V', '2.50 V (V_DD / 2)', 'Both transistors in Saturation simultaneously'],
        ['Input Low Voltage (V_IL)', '2.10 V', 'dV_out/dV_in = -1', 'Upper limit of valid logic 0'],
        ['Input High Voltage (V_IH)', '2.90 V', 'dV_out/dV_in = -1', 'Lower limit of valid logic 1'],
        ['Noise Margin High (NM_H)', '2.10 V', 'V_OH - V_IH = 5.0 - 2.9', 'Outstanding noise rejection for Logic 1'],
        ['Noise Margin Low (NM_L)', '2.10 V', 'V_IL - V_OL = 2.1 - 0.0', 'Outstanding noise rejection for Logic 0'],
        ['Peak Short-Circuit Current', '64.0 µA', 'I_peak at V_in = V_M', 'Both channels momentarily open during transition'],
        ['Static Quiescent Current', '0.00 µA', '0.00 µA (Ideal)', 'Zero DC power in both logic 0 and logic 1 states']
      ]
    },
    codeSnippets: [
      {
        language: 'spice',
        filename: 'cmos_inverter_char.cir',
        explanation: 'SPICE netlist for DC VTC, current spike, and transient simulation of the CMOS inverter.',
        code: `* CMOS Inverter: DC Transfer Curve & Transient Simulation
* Pull-up: M2 (PMOS), Pull-down: M1 (NMOS)

M2 n003 n001 n002 n002 PMOS
M1 n003 n001 0 0 NMOS
V2 n002 0 5

* 1. DC Sweep for Transfer Curve and Current Spike:
* V1 n001 0 5
* .dc v1 0 5 0.1

* 2. Transient Simulation for Switching Waveforms:
V1 n001 0 PULSE(0 3.3 0 0 0 1m 2m)
.tran 0 5MS 0

.end`
      }
    ],
    result: 'The CMOS inverter was successfully characterized in LTspice XVII across both DC and transient domains. The DC transfer characteristic demonstrated an ideal rail-to-rail voltage swing (5.0V to 0.0V) with a symmetrical switching midpoint at V_M = 2.5V. The supply current confirmed zero static dissipation, with current flow restricted to a brief 64µA dynamic spike during input transitions.',
    conclusion: 'The CMOS inverter represents the benchmark circuit of digital VLSI technology. Its pairing of series PMOS pull-up and NMOS pull-down transistors ensures zero static DC power dissipation in both steady states, full rail-to-rail voltage swing, wide and symmetric noise margins (NM_H = NM_L = 2.1V), and rapid symmetric transient switching.',
    vivaQuestions: [
      {
        id: 'dvlsi-viva-5-1',
        questionNumber: 1,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-5',
        question: 'Why is the static power dissipation of a CMOS inverter virtually zero?',
        answer: 'In either steady state (V_in = 0V or V_in = 5V), one of the two complementary series transistors is completely turned OFF (cutoff). Because there is no continuous conducting path from V_DD to Ground, static DC current is limited strictly to subthreshold and junction leakage.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-5-2',
        questionNumber: 2,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-5',
        question: 'Why must the channel width of the PMOS transistor typically be 2 to 3 times wider than the NMOS transistor (W_p ≈ 2 to 3 * W_n)?',
        answer: 'Electron mobility in silicon (µ_n ≈ 500-600 cm²/V·s) is approximately 2 to 3 times higher than hole mobility (µ_p ≈ 200-250 cm²/V·s). To equalize current drive capability and achieve symmetric rise and fall times (t_r = t_f) and a centered switching midpoint V_M = V_DD / 2, the PMOS transistor channel width must be scaled up proportionally.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-5-3',
        questionNumber: 3,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-5',
        question: 'What causes the current spike (Is(M2) = 64µA) seen in the DC sweep curve at V_in = 2.5V?',
        answer: 'When V_in is near the switching midpoint V_M = 2.5V, both the NMOS and PMOS transistors are simultaneously turned ON and operating in saturation. This creates a temporary low-impedance short-circuit path directly from V_DD to Ground, causing a short-circuit current spike.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-5-4',
        questionNumber: 4,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-5',
        question: 'What are the components of dynamic power dissipation in a CMOS logic gate?',
        answer: 'Dynamic power consists of: (1) Capacitive charging/discharging power (P_cap = α * C_L * V_DD² * f), which dominates total power, and (2) Short-circuit power (P_sc = I_peak * t_sc * V_DD * f) dissipated during the finite rise and fall transitions when both transistors conduct.',
        category: 'viva'
      },
      {
        id: 'dvlsi-viva-5-5',
        questionNumber: 5,
        subjectId: 'dvlsi',
        experimentId: 'dvlsi-exp-5',
        question: 'What is meant by the regenerative property of a CMOS inverter?',
        answer: 'The regenerative property refers to the high open-loop voltage gain (|dV_out/dV_in| >> 1) in Region C. Any small noise or voltage deviation at the input is restored to clean, full rail-to-rail logic levels (0V or 5V) after passing through a chain of inverters.',
        category: 'viva'
      }
    ],
    quickRevision: {
      keyTakeaways: [
        'CMOS Inverter: PMOS pull-up (source to V_DD) + NMOS pull-down (source to GND).',
        'V_OH = 5.0V, V_OL = 0.0V (Full rail-to-rail swing).',
        'Switching threshold V_M = V_DD / 2 = 2.5V (Symmetric midpoint).',
        'Five regions: A (NMOS cut, PMOS lin), B (NMOS sat, PMOS lin), C (Both sat), D (NMOS lin, PMOS sat), E (NMOS lin, PMOS cut).',
        'Static power is zero; dynamic current peaks at 64 µA at V_in = 2.5V.'
      ],
      commonPitfalls: [
        'Connecting PMOS to ground or NMOS to V_DD: PMOS MUST pull up to V_DD; NMOS MUST pull down to ground.',
        'Assuming short-circuit current occurs in steady state: It only occurs momentarily during switching transitions.'
      ],
      examTips: [
        'Know the table of the 5 operational regions for written exams.',
        'Remember why W_p/W_n = 2 to 3: to compensate for lower hole mobility (µ_p < µ_n).'
      ]
    },
    sourceReference: {
      docName: 'Transfer curve of cmos.docx',
      pageNumber: 1,
      reviewNeeded: false,
      notes: 'Fully extracted from rawasset/dvlsi/Transfer curve of cmos.docx. Both LTspice screenshots (DC VTC with current spike and transient waveform) verified.'
    }
  }
];

export const DVLSI_QUESTION_BANK: QuestionItem[] = [
  {
    id: 'dvlsi-qb-1',
    subjectId: 'dvlsi',
    question: 'Explain the physical origin and components of MOSFET Threshold Voltage (V_TO).',
    answer: 'Threshold voltage V_TO is the gate voltage required to achieve strong inversion at the oxide-semiconductor interface. It comprises four physical terms: (1) Flat-band voltage V_FB (accounting for work function difference and oxide charges), (2) Twice the Fermi potential 2*phi_F (surface band bending), (3) Voltage across gate oxide due to depletion layer charge Q_dep / C_ox, and (4) Surface state and interface trapped charge effects.',
    category: 'theory'
  },
  {
    id: 'dvlsi-qb-2',
    subjectId: 'dvlsi',
    question: 'Compare Full (Constant Electric Field) Scaling vs. Constant Voltage Scaling in VLSI technology.',
    answer: 'In Full Scaling, both physical dimensions and operating voltages are scaled down by 1/S. This keeps the internal electric field constant, reduces gate power by 1/S², and maintains constant chip power density, ensuring thermal reliability. In Constant Voltage Scaling, dimensions are scaled by 1/S while voltages remain fixed. While drive current increases by S, the electric field increases by S and chip power density explodes by S³, leading to severe thermal breakdown and hot-carrier degradation.',
    category: 'theory'
  },
  {
    id: 'dvlsi-qb-3',
    subjectId: 'dvlsi',
    question: 'Why is S = 1, R = 1 considered an illegal or forbidden state in a NOR-based SR Latch?',
    answer: 'When both Set and Reset inputs are HIGH (1) in a NOR latch, both parallel NMOS pull-down transistors turn ON, forcing both outputs Q and Q_bar to 0V simultaneously. This violates the fundamental requirement of complementary outputs. Moreover, if both inputs transition back to 0 simultaneously, both inverters compete to pull HIGH, plunging the latch into an unpredictable race condition or metastable state.',
    category: 'viva'
  },
  {
    id: 'dvlsi-qb-4',
    subjectId: 'dvlsi',
    question: 'What are the advantages of CMOS logic over NMOS resistive-load logic?',
    answer: 'CMOS logic provides: (1) Zero static power dissipation in both steady states (no direct path from V_DD to GND), (2) Full rail-to-rail voltage swing (V_OH = V_DD, V_OL = GND), (3) Ratioless logic where output levels are independent of transistor aspect ratios, (4) Superior and symmetric noise margins (NM_H ≈ NM_L), and (5) Symmetric transient switching speeds.',
    category: 'conceptual'
  },
  {
    id: 'dvlsi-qb-5',
    subjectId: 'dvlsi',
    question: 'Explain the body effect (substrate bias effect) in MOSFETs and write its governing equation.',
    answer: 'When a reverse bias voltage V_SB is applied between the source and substrate (bulk), the depletion region width widens, increasing the uncovered bulk charge. Consequently, a higher gate voltage is required to invert the channel. The modified threshold voltage is given by: V_TH = V_TO + gamma * [sqrt(2*phi_F + V_SB) - sqrt(2*phi_F)], where gamma is the body effect parameter.',
    category: 'theory'
  },
  {
    id: 'dvlsi-qb-6',
    subjectId: 'dvlsi',
    question: 'Derive the switching threshold (V_M) of a symmetric CMOS inverter.',
    answer: 'At the switching threshold V_M, V_in = V_out = V_M. Both NMOS and PMOS operate in saturation. Equating their drain currents: (1/2)*k_n*(V_M - V_TH,n)² = (1/2)*k_p*(V_DD - V_M - |V_TH,p|)². Taking the square root and solving for V_M gives: V_M = [V_TH,n + sqrt(k_p/k_n)*(V_DD - |V_TH,p|)] / [1 + sqrt(k_p/k_n)]. When k_n = k_p and V_TH,n = |V_TH,p|, V_M simplifies to exactly V_DD / 2.',
    category: 'theory'
  }
];
