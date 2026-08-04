import type { Locale } from "./i18n/locales";

export type CliCategory = "Filters" | "PID" | "Rates" | "Failsafe" | "Motor/ESC" | "Battery" | "Receiver";

type RawCliCommand = {
  command: string;
  category: CliCategory;
  type: string;
  default: string;
  range?: string;
  description: { en: string; th: string };
};

export type CliCommand = {
  command: string;
  category: string;
  type: string;
  default: string;
  range?: string;
  description: string;
};

const CATEGORY_LABEL: Record<Locale, Record<CliCategory, string>> = {
  en: {
    Filters: "Filters",
    PID: "PID",
    Rates: "Rates",
    Failsafe: "Failsafe",
    "Motor/ESC": "Motor/ESC",
    Battery: "Battery",
    Receiver: "Receiver",
  },
  th: {
    Filters: "ฟิลเตอร์",
    PID: "PID",
    Rates: "Rates",
    Failsafe: "Failsafe",
    "Motor/ESC": "มอเตอร์/ESC",
    Battery: "แบตเตอรี่",
    Receiver: "ตัวรับสัญญาณ",
  },
};

const RAW_CLI_COMMANDS: RawCliCommand[] = [
  {
    command: "gyro_lpf1_static_hz",
    category: "Filters",
    type: "uint16",
    default: "250",
    range: "0–500",
    description: {
      en: "Static cutoff for the first gyro low-pass filter stage. Lower values smooth the signal more but add control-loop latency; raise it on stiffer, lighter builds with cleaner mechanical noise.",
      th: "จุดตัด (cutoff) คงที่ของฟิลเตอร์ low-pass สเตจแรกของ gyro ค่ายิ่งต่ำสัญญาณยิ่งเรียบแต่เพิ่ม latency ใน control loop ปรับสูงขึ้นได้บนลำที่แข็งและเบา ซึ่งมี noise เชิงกลน้อยกว่า",
    },
  },
  {
    command: "dterm_lpf1_static_hz",
    category: "Filters",
    type: "uint16",
    default: "150",
    range: "0–500",
    description: {
      en: "Static cutoff for D-term filtering. Set lower than the gyro LPF, since D-term is the noisiest and most latency-sensitive term in the PID loop.",
      th: "จุดตัดคงที่ของฟิลเตอร์ D-term ตั้งให้ต่ำกว่า gyro LPF เพราะ D-term เป็นค่าที่มี noise มากที่สุดและไวต่อ latency มากที่สุดใน PID loop",
    },
  },
  {
    command: "dyn_notch_count",
    category: "Filters",
    type: "uint8",
    default: "3",
    range: "0–5",
    description: {
      en: "Number of dynamic notch filters tracked per axis. Each notch removes one dominant noise frequency; more notches catch more motor harmonics at a small CPU cost.",
      th: "จำนวน dynamic notch filter ที่ติดตามต่อแกน แต่ละ notch กำจัด noise ความถี่เด่นหนึ่งจุด ยิ่งมี notch มากยิ่งจับ harmonics ของมอเตอร์ได้มากขึ้น แลกกับ CPU เพิ่มขึ้นเล็กน้อย",
    },
  },
  {
    command: "dyn_notch_q",
    category: "Filters",
    type: "uint16",
    default: "300",
    range: "1–1000",
    description: {
      en: "Width (Q factor) of each dynamic notch. Higher Q means a narrower, more surgical notch; lower Q removes a wider noise band but risks cutting real signal near it.",
      th: "ความกว้าง (Q factor) ของ notch แต่ละจุด Q สูง = notch แคบและแม่นยำกว่า, Q ต่ำ = กำจัด noise ได้กว้างขึ้นแต่เสี่ยงตัดสัญญาณจริงที่อยู่ใกล้ๆ ไปด้วย",
    },
  },
  {
    command: "dyn_notch_min_hz",
    category: "Filters",
    type: "uint16",
    default: "100",
    range: "60–250",
    description: {
      en: "Lower bound of the frequency range dynamic notches will search. Should be set below the lowest expected motor-noise frequency for your KV/prop combo.",
      th: "ขอบล่างของช่วงความถี่ที่ dynamic notch จะค้นหา ควรตั้งให้ต่ำกว่าความถี่ noise มอเตอร์ที่ต่ำที่สุดที่คาดว่าจะเจอ ตามคู่ KV/ใบพัดของคุณ",
    },
  },
  {
    command: "dyn_notch_max_hz",
    category: "Filters",
    type: "uint16",
    default: "600",
    range: "200–1000",
    description: {
      en: "Upper bound of the dynamic notch search range. Raising it helps on higher-KV setups where noise harmonics sit at higher frequencies.",
      th: "ขอบบนของช่วงค้นหา dynamic notch การเพิ่มค่านี้ช่วยได้บนเซ็ตอัพ KV สูง ที่ harmonics ของ noise อยู่ที่ความถี่สูงกว่า",
    },
  },
  {
    command: "p_pitch / p_roll / p_yaw",
    category: "PID",
    type: "uint8",
    default: "47 / 47 / 45",
    range: "0–200",
    description: {
      en: "Proportional gain per axis — how sharply the FC corrects a given error. Increase gradually and watch for high-frequency oscillation as the ceiling.",
      th: "ค่า Proportional ต่อแกน — FC แก้ error ได้คมแค่ไหน เพิ่มค่าทีละน้อยและสังเกตอาการสั่นความถี่สูงเป็นเพดานที่ไม่ควรเกิน",
    },
  },
  {
    command: "i_pitch / i_roll / i_yaw",
    category: "PID",
    type: "uint8",
    default: "84 / 84 / 80",
    range: "0–200",
    description: {
      en: "Integral gain per axis — corrects sustained error (wind, a bent arm, a hover sag). Too high shows up as a slow wallow after sharp inputs.",
      th: "ค่า Integral ต่อแกน — แก้ error ที่ต่อเนื่อง (ลม, แขนเอียง, ทรุดตอนโฮเวอร์) ถ้าสูงเกินไปจะเห็นอาการโยกช้าๆ หลังกดสติ๊กแรงๆ",
    },
  },
  {
    command: "d_pitch / d_roll",
    category: "PID",
    type: "uint8",
    default: "34 / 30",
    range: "0–200",
    description: {
      en: "Derivative gain — damps the P response to reduce overshoot. Most sensitive term to filtering quality; tune filters before pushing this up.",
      th: "ค่า Derivative — หน่วงการตอบสนองของ P เพื่อลด overshoot เป็นค่าที่ไวต่อคุณภาพฟิลเตอร์มากที่สุด ควรจูนฟิลเตอร์ก่อนเพิ่มค่านี้",
    },
  },
  {
    command: "angle_limit",
    category: "PID",
    type: "uint8",
    default: "60",
    range: "10–90",
    description: {
      en: "Maximum tilt angle in degrees while flying in Angle (self-level) mode.",
      th: "มุมเอียงสูงสุดเป็นองศา ขณะบินในโหมด Angle (ปรับระดับอัตโนมัติ)",
    },
  },
  {
    command: "thr_mid",
    category: "Rates",
    type: "uint8",
    default: "50",
    range: "0–100",
    description: {
      en: "Throttle midpoint as a percentage — shapes how throttle response curves around the stick's center rather than at min/max.",
      th: "จุดกึ่งกลางคันเร่งเป็นเปอร์เซ็นต์ — กำหนดรูปทรงของการตอบสนองคันเร่งรอบจุดกลางสติ๊ก มากกว่าที่ min/max",
    },
  },
  {
    command: "thr_expo",
    category: "Rates",
    type: "uint8",
    default: "0",
    range: "0–100",
    description: {
      en: "Throttle expo — softens throttle response near center stick while keeping full range at the extremes.",
      th: "Throttle expo — ทำให้การตอบสนองคันเร่งนุ่มขึ้นใกล้จุดกลางสติ๊ก ในขณะที่ยังคงช่วงเต็มที่ปลายสุด",
    },
  },
  {
    command: "motor_pwm_protocol",
    category: "Motor/ESC",
    type: "string",
    default: "DSHOT600",
    range: "PWM / ONESHOT125 / MULTISHOT / DSHOT150 / DSHOT300 / DSHOT600",
    description: {
      en: "Protocol used to send throttle signals to the ESCs. Digital DSHOT protocols are checksum-verified and far lower latency than legacy analog PWM.",
      th: "Protocol ที่ใช้ส่งสัญญาณคันเร่งไปหา ESC protocol แบบ digital อย่าง DSHOT มีการตรวจสอบ checksum และ latency ต่ำกว่า PWM analog รุ่นเก่ามาก",
    },
  },
  {
    command: "dshot_idle_value",
    category: "Motor/ESC",
    type: "uint16",
    default: "550",
    range: "0–2000",
    description: {
      en: "Minimum DSHOT command sent at idle to keep motors spinning smoothly and responsive. Too low causes stutter or stalling at low throttle.",
      th: "ค่าคำสั่ง DSHOT ต่ำสุดที่ส่งตอน idle เพื่อให้มอเตอร์หมุนลื่นและตอบสนองไว ถ้าตั้งต่ำเกินไปจะสะดุดหรือดับที่คันเร่งต่ำ",
    },
  },
  {
    command: "failsafe_procedure",
    category: "Failsafe",
    type: "string",
    default: "DROP",
    range: "DROP / LAND / RTH / GPS-RESCUE",
    description: {
      en: "Action the flight controller takes once failsafe triggers from lost RX link. Must be matched to the airframe and flying environment, not left on default blindly.",
      th: "การกระทำที่ flight controller ทำเมื่อ failsafe ทำงานจากลิงก์ RX ขาด ต้องเลือกให้เหมาะกับตัวเครื่องและสภาพแวดล้อมที่บิน ไม่ควรปล่อยไว้ที่ default โดยไม่คิด",
    },
  },
  {
    command: "failsafe_delay",
    category: "Failsafe",
    type: "uint8",
    default: "4",
    range: "0–200 (0.1s units)",
    description: {
      en: "Time after signal loss before failsafe procedure triggers. Too short risks false triggers from brief RX glitches; too long delays a real recovery response.",
      th: "เวลาหลังสัญญาณขาดก่อนที่ failsafe จะเริ่มทำงาน สั้นเกินไปเสี่ยง trigger ผิดจาก RX สะดุดชั่วครู่ นานเกินไปทำให้การกู้สถานการณ์จริงล่าช้า",
    },
  },
  {
    command: "serialrx_provider",
    category: "Receiver",
    type: "string",
    default: "SBUS",
    range: "SBUS / CRSF / IBUS / SUMD / SPEKTRUM…",
    description: {
      en: "Protocol used to decode the receiver's serial data stream. Must match the actual RX hardware/protocol or the link won't decode at all.",
      th: "Protocol ที่ใช้ถอดรหัสข้อมูล serial จากตัวรับ ต้องตรงกับฮาร์ดแวร์/protocol ของ RX จริง ไม่งั้นลิงก์จะถอดรหัสไม่ได้เลย",
    },
  },
  {
    command: "vbat_min_cell_voltage",
    category: "Battery",
    type: "uint8",
    default: "330",
    range: "100–500 (0.01V units)",
    description: {
      en: "Per-cell voltage (in centivolts) below which the FC treats the battery as critically low and can trigger warnings or a failsafe response.",
      th: "แรงดันต่อเซลล์ (หน่วย centivolt) ที่ต่ำกว่านี้ FC จะถือว่าแบตวิกฤต และอาจสั่งเตือนหรือ trigger failsafe",
    },
  },
  {
    command: "gyro_lpf2_static_hz",
    category: "Filters",
    type: "uint16",
    default: "500",
    range: "0–1000",
    description: {
      en: "Second-stage gyro low-pass filter, applied after gyro_lpf1. Usually left higher than LPF1 — it's a light cleanup pass rather than the primary noise-removal stage.",
      th: "ฟิลเตอร์ low-pass ของ gyro สเตจที่สอง ทำงานต่อจาก gyro_lpf1 ปกติตั้งไว้สูงกว่า LPF1 เพราะเป็นแค่การกรองเบาๆ รอบสุดท้าย ไม่ใช่สเตจกำจัด noise หลัก",
    },
  },
  {
    command: "tpa_rate",
    category: "PID",
    type: "uint8",
    default: "65",
    range: "0–100",
    description: {
      en: "Throttle PID Attenuation — how much P and D are reduced at full throttle, as a percentage. Fixes oscillation that only appears on hard punch-outs or wide-open throttle.",
      th: "Throttle PID Attenuation — ลดค่า P และ D ลงเท่าไหร่ตอนคันเร่งเต็ม เป็นเปอร์เซ็นต์ แก้อาการสั่นที่เกิดเฉพาะตอน punch-out แรงๆ หรือคันเร่งสุด",
    },
  },
  {
    command: "tpa_breakpoint",
    category: "PID",
    type: "uint16",
    default: "1250",
    range: "1000–2000",
    description: {
      en: "Raw throttle value where TPA attenuation begins. Below this point PID gains run at their full configured value; above it they taper per tpa_rate.",
      th: "ค่าคันเร่งดิบที่ TPA เริ่มลดค่า PID ต่ำกว่าจุดนี้ PID จะทำงานเต็มค่าที่ตั้งไว้ สูงกว่าจุดนี้จะค่อยๆ ลดลงตาม tpa_rate",
    },
  },
  {
    command: "anti_gravity_gain",
    category: "PID",
    type: "uint16",
    default: "80",
    range: "0–250",
    description: {
      en: "Temporarily boosts I-term during fast throttle changes to counter the sag/surge a quad feels on sudden throttle input — most noticeable on punch-outs and quick throttle chops.",
      th: "เพิ่มค่า I-term ชั่วคราวตอนคันเร่งเปลี่ยนเร็วๆ เพื่อต้านอาการทรุด/พุ่งที่โดรนรู้สึกตอนกดคันเร่งกะทันหัน สังเกตชัดตอน punch-out และสับคันเร่งเร็วๆ",
    },
  },
  {
    command: "rc_smoothing_auto_factor",
    category: "Rates",
    type: "uint8",
    default: "30",
    range: "1–50",
    description: {
      en: "Controls how aggressively RC input smoothing filters incoming stick data. Higher values smooth a noisy or low-resolution link at the cost of added input latency.",
      th: "ควบคุมความแรงของการกรองข้อมูลสติ๊กที่เข้ามาจาก RC ค่ายิ่งสูงยิ่งเรียบสำหรับลิงก์ที่มี noise หรือความละเอียดต่ำ แลกกับ latency ของ input ที่เพิ่มขึ้น",
    },
  },
  {
    command: "motor_output_limit",
    category: "Motor/ESC",
    type: "uint8",
    default: "100",
    range: "1–100",
    description: {
      en: "Caps maximum motor output as a percentage, independent of throttle position. Useful for break-in periods on new motors or protecting an underpowered/overheating setup.",
      th: "จำกัด motor output สูงสุดเป็นเปอร์เซ็นต์ โดยไม่ขึ้นกับตำแหน่งคันเร่ง มีประโยชน์ตอนรันอินมอเตอร์ใหม่ หรือป้องกันเซ็ตอัพที่กำลังไม่พอ/ร้อนเกิน",
    },
  },
  {
    command: "small_angle",
    category: "PID",
    type: "uint8",
    default: "180",
    range: "0–180",
    description: {
      en: "Maximum tilt angle, in degrees, the FC will still allow arming at. Set to 180 to disable the check entirely; lower values block arming if the craft is tilted past that angle.",
      th: "มุมเอียงสูงสุดเป็นองศาที่ FC ยังยอมให้ arm ได้ ตั้ง 180 เพื่อปิดการเช็คนี้ไปเลย ค่าต่ำกว่าจะบล็อกการ arm ถ้าลำเอียงเกินมุมนั้น",
    },
  },
];

export function slugifyCommand(command: string): string {
  return command
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCliCommands(locale: Locale): CliCommand[] {
  return RAW_CLI_COMMANDS.map((c) => ({
    command: c.command,
    category: CATEGORY_LABEL[locale][c.category],
    type: c.type,
    default: c.default,
    range: c.range,
    description: c.description[locale],
  }));
}

/**
 * Real Betaflight dumps set individual keys (p_roll, p_pitch, p_yaw...) but
 * our reference groups related ones into a single entry ("p_pitch / p_roll
 * / p_yaw") for readability. This builds a per-key lookup back to the
 * parent entry (in the given locale), plus the matching positional default
 * when the entry's `default` field is itself a "/"-separated list.
 */
export function buildCliLookup(locale: Locale): Map<string, { entry: CliCommand; defaultValue: string }> {
  const map = new Map<string, { entry: CliCommand; defaultValue: string }>();
  for (const entry of getCliCommands(locale)) {
    const keys = entry.command.split("/").map((k) => k.trim());
    const defaults = entry.default.split("/").map((d) => d.trim());
    keys.forEach((key, i) => {
      map.set(key.toLowerCase(), {
        entry,
        defaultValue: defaults.length === keys.length ? defaults[i] : entry.default,
      });
    });
  }
  return map;
}
