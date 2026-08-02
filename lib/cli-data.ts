export type CliCommand = {
  command: string;
  category: "Filters" | "PID" | "Rates" | "Failsafe" | "Motor/ESC" | "Battery" | "Receiver";
  type: string;
  default: string;
  range?: string;
  description: string;
};

export const CLI_COMMANDS: CliCommand[] = [
  {
    command: "gyro_lpf1_static_hz",
    category: "Filters",
    type: "uint16",
    default: "250",
    range: "0–500",
    description:
      "Static cutoff for the first gyro low-pass filter stage. Lower values smooth the signal more but add control-loop latency; raise it on stiffer, lighter builds with cleaner mechanical noise.",
  },
  {
    command: "dterm_lpf1_static_hz",
    category: "Filters",
    type: "uint16",
    default: "150",
    range: "0–500",
    description:
      "Static cutoff for D-term filtering. Set lower than the gyro LPF, since D-term is the noisiest and most latency-sensitive term in the PID loop.",
  },
  {
    command: "dyn_notch_count",
    category: "Filters",
    type: "uint8",
    default: "3",
    range: "0–5",
    description:
      "Number of dynamic notch filters tracked per axis. Each notch removes one dominant noise frequency; more notches catch more motor harmonics at a small CPU cost.",
  },
  {
    command: "dyn_notch_q",
    category: "Filters",
    type: "uint16",
    default: "300",
    range: "1–1000",
    description:
      "Width (Q factor) of each dynamic notch. Higher Q means a narrower, more surgical notch; lower Q removes a wider noise band but risks cutting real signal near it.",
  },
  {
    command: "dyn_notch_min_hz",
    category: "Filters",
    type: "uint16",
    default: "100",
    range: "60–250",
    description:
      "Lower bound of the frequency range dynamic notches will search. Should be set below the lowest expected motor-noise frequency for your KV/prop combo.",
  },
  {
    command: "dyn_notch_max_hz",
    category: "Filters",
    type: "uint16",
    default: "600",
    range: "200–1000",
    description:
      "Upper bound of the dynamic notch search range. Raising it helps on higher-KV setups where noise harmonics sit at higher frequencies.",
  },
  {
    command: "p_pitch / p_roll / p_yaw",
    category: "PID",
    type: "uint8",
    default: "47 / 47 / 45",
    range: "0–200",
    description:
      "Proportional gain per axis — how sharply the FC corrects a given error. Increase gradually and watch for high-frequency oscillation as the ceiling.",
  },
  {
    command: "i_pitch / i_roll / i_yaw",
    category: "PID",
    type: "uint8",
    default: "84 / 84 / 80",
    range: "0–200",
    description:
      "Integral gain per axis — corrects sustained error (wind, a bent arm, a hover sag). Too high shows up as a slow wallow after sharp inputs.",
  },
  {
    command: "d_pitch / d_roll",
    category: "PID",
    type: "uint8",
    default: "34 / 30",
    range: "0–200",
    description:
      "Derivative gain — damps the P response to reduce overshoot. Most sensitive term to filtering quality; tune filters before pushing this up.",
  },
  {
    command: "angle_limit",
    category: "PID",
    type: "uint8",
    default: "60",
    range: "10–90",
    description:
      "Maximum tilt angle in degrees while flying in Angle (self-level) mode.",
  },
  {
    command: "thr_mid",
    category: "Rates",
    type: "uint8",
    default: "50",
    range: "0–100",
    description:
      "Throttle midpoint as a percentage — shapes how throttle response curves around the stick's center rather than at min/max.",
  },
  {
    command: "thr_expo",
    category: "Rates",
    type: "uint8",
    default: "0",
    range: "0–100",
    description:
      "Throttle expo — softens throttle response near center stick while keeping full range at the extremes.",
  },
  {
    command: "motor_pwm_protocol",
    category: "Motor/ESC",
    type: "string",
    default: "DSHOT600",
    range: "PWM / ONESHOT125 / MULTISHOT / DSHOT150 / DSHOT300 / DSHOT600",
    description:
      "Protocol used to send throttle signals to the ESCs. Digital DSHOT protocols are checksum-verified and far lower latency than legacy analog PWM.",
  },
  {
    command: "dshot_idle_value",
    category: "Motor/ESC",
    type: "uint16",
    default: "550",
    range: "0–2000",
    description:
      "Minimum DSHOT command sent at idle to keep motors spinning smoothly and responsive. Too low causes stutter or stalling at low throttle.",
  },
  {
    command: "failsafe_procedure",
    category: "Failsafe",
    type: "string",
    default: "DROP",
    range: "DROP / LAND / RTH / GPS-RESCUE",
    description:
      "Action the flight controller takes once failsafe triggers from lost RX link. Must be matched to the airframe and flying environment, not left on default blindly.",
  },
  {
    command: "failsafe_delay",
    category: "Failsafe",
    type: "uint8",
    default: "4",
    range: "0–200 (0.1s units)",
    description:
      "Time after signal loss before failsafe procedure triggers. Too short risks false triggers from brief RX glitches; too long delays a real recovery response.",
  },
  {
    command: "serialrx_provider",
    category: "Receiver",
    type: "string",
    default: "SBUS",
    range: "SBUS / CRSF / IBUS / SUMD / SPEKTRUM…",
    description:
      "Protocol used to decode the receiver's serial data stream. Must match the actual RX hardware/protocol or the link won't decode at all.",
  },
  {
    command: "vbat_min_cell_voltage",
    category: "Battery",
    type: "uint8",
    default: "330",
    range: "100–500 (0.01V units)",
    description:
      "Per-cell voltage (in centivolts) below which the FC treats the battery as critically low and can trigger warnings or a failsafe response.",
  },
];
