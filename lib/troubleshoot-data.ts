export type TroubleshootEntry = {
  id: string;
  symptom: string;
  category:
    | "Oscillation"
    | "Power / ESC"
    | "Flight Behavior"
    | "Radio Link"
    | "General";
  causes: string[];
  fix: string;
  relatedKnowledge?: string;
};

export const TROUBLESHOOT: TroubleshootEntry[] = [
  {
    id: "fast-flip-oscillation",
    symptom: "Quad oscillates on fast flips or rolls",
    category: "Oscillation",
    causes: [
      "D-term set too high for the current filter setup",
      "Mechanical looseness — camera mount, stack screws, arm bolts",
      "Prop imbalance introducing periodic noise",
    ],
    fix: "Reduce D-term in small steps and re-test. Check all mechanical fasteners and prop balance before touching PID further — a loose stack will fight any tune.",
    relatedKnowledge: "gyro-dterm-filters",
  },
  {
    id: "hot-motors-short-flight",
    symptom: "Motors run hot after a short flight",
    category: "Power / ESC",
    causes: [
      "Dynamic notch filter not tracking the real motor noise frequency",
      "D-term set too high, forcing constant micro-corrections",
      "Prop pitch too aggressive for the motor KV / cell count",
    ],
    fix: "Re-check dyn_notch_min_hz / dyn_notch_max_hz against your motor KV and prop size, confirm blackbox gyro trace is clean, then re-evaluate D-term.",
    relatedKnowledge: "motor-esc-basics",
  },
  {
    id: "drift-in-hover",
    symptom: "Quad drifts to one side while hovering",
    category: "Flight Behavior",
    causes: [
      "I-term set too low to hold against a constant disturbance",
      "A bent arm or motor that isn't perfectly perpendicular to the frame",
      "Accelerometer not calibrated, if flying in Angle mode",
    ],
    fix: "Rule out hardware first — check frame squareness and motor alignment. If hardware is fine, increase I-term slightly and re-test the hover.",
    relatedKnowledge: "pid-controller-basics",
  },
  {
    id: "random-disarm",
    symptom: "Quad disarms unexpectedly mid-flight",
    category: "Power / ESC",
    causes: [
      "Battery voltage sagged below the configured low-voltage cutoff",
      "A brief RX link glitch triggered failsafe",
      "Loose battery connector causing momentary power loss",
    ],
    fix: "Check the blackbox log's vbat trace around the disarm timestamp, and RSSI/link-quality at the same point, to tell a power event from a link event apart.",
    relatedKnowledge: "radio-link-failsafe",
  },
  {
    id: "fuzzy-gyro-trace",
    symptom: "Gyro trace in blackbox looks fuzzy or thick",
    category: "Oscillation",
    causes: [
      "Filters not removing real mechanical noise",
      "Dynamic notch range set for the wrong motor/prop combo",
      "A mechanical vibration source — bent shaft, bad bearing, unbalanced prop",
    ],
    fix: "Confirm hardware is mechanically sound first, then walk through the filter chain from notch range to LPF cutoff before adjusting any PID value.",
    relatedKnowledge: "gyro-dterm-filters",
  },
  {
    id: "iterm-bounce",
    symptom: "Quad bounces back after a hard flip (I-term bounce)",
    category: "Oscillation",
    causes: ["I-term set too high", "I-term relax settings too aggressive or too weak for the airframe"],
    fix: "Lower I-term in small increments and re-test flips specifically, since this symptom shows up almost exclusively under sharp, large stick inputs.",
    relatedKnowledge: "pid-controller-basics",
  },
  {
    id: "link-loss-moderate-range",
    symptom: "Control link degrades or drops at moderate range",
    category: "Radio Link",
    causes: [
      "Antenna orientation blocking line-of-sight to the transmitter",
      "TX output power set lower than needed for the environment",
      "RF interference from other 2.4/5.8GHz equipment nearby",
    ],
    fix: "Check antenna placement and polarization first — it's the most common cause. Confirm link-quality telemetry, not just perceived signal strength, when diagnosing.",
    relatedKnowledge: "radio-link-failsafe",
  },
  {
    id: "propwash-bounce-descent",
    symptom: "Quad bounces or feels unstable during a fast descent",
    category: "Flight Behavior",
    causes: [
      "Prop wash — the quad flying through its own turbulent air on descent",
      "PID gains not attenuated at low throttle, amplifying the disturbance",
    ],
    fix: "This is partly aerodynamic and expected to some degree. Throttle-based PID attenuation (TPA) settings can reduce how much the tune reacts to prop wash at low throttle.",
  },
  {
    id: "wont-arm",
    symptom: "Quad won't arm",
    category: "General",
    causes: [
      "Failsafe condition currently active",
      "Craft tilted beyond the configured arming angle limit",
      "No valid RX signal being received",
      "Throttle stick not at minimum when arming",
    ],
    fix: "Check the OSD or configurator arming-disable flags — Betaflight reports the exact blocking reason rather than leaving you to guess.",
  },
  {
    id: "motor-idle-stutter",
    symptom: "Motors twitch or stutter at low throttle / idle",
    category: "Power / ESC",
    causes: [
      "dshot_idle_value set too low for the motor/ESC combo",
      "ESC not properly calibrated for the selected protocol",
      "Mismatched motor_pwm_protocol between FC and ESC firmware",
    ],
    fix: "Raise dshot_idle_value slightly and confirm the ESC firmware supports the configured DSHOT rate before assuming it's a tuning issue.",
    relatedKnowledge: "motor-esc-basics",
  },
  {
    id: "tips-over-on-takeoff",
    symptom: "Quad tips over immediately on takeoff",
    category: "General",
    causes: [
      "One or more motors spinning the wrong direction",
      "Props mounted in the wrong rotation direction",
      "Throttle stick not centered / trimmed correctly before arming",
    ],
    fix: "With props off, verify each motor's spin direction against the configurator's motor layout before ever testing with props on again.",
  },
  {
    id: "osd-garbled",
    symptom: "OSD elements are garbled, flickering, or missing",
    category: "General",
    causes: [
      "OSD/VTX voltage or wiring issue",
      "Wrong OSD video system setting (PAL vs NTSC) for the camera",
      "SPI/serial contention with another peripheral on the same resource",
    ],
    fix: "Confirm the video system setting matches your camera output first — it's the most common single cause of a garbled or partially-missing OSD.",
  },
  {
    id: "punchout-sluggish",
    symptom: "Quad feels sluggish or flat on full-throttle punch-outs",
    category: "Power / ESC",
    causes: [
      "motor_output_limit set below 100%",
      "Battery voltage sagging heavily under load",
      "TPA attenuating PID gains too aggressively at high throttle",
    ],
    fix: "Check motor_output_limit and blackbox vbat sag first — both look like a 'weak' punch-out but aren't PID problems at all.",
  },
  {
    id: "vibration-after-crash",
    symptom: "Noticeably more vibration or heat after a crash and repair",
    category: "Oscillation",
    causes: [
      "A bent prop or motor shaft from the impact",
      "A motor screw not properly re-torqued during the repair",
      "A hairline crack in the frame introducing new flex",
    ],
    fix: "Treat any post-crash vibration increase as a hardware issue first — re-check props, motor mounting, and frame integrity before assuming the tune needs revisiting.",
    relatedKnowledge: "gyro-dterm-filters",
  },
];
