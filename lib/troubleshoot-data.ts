import type { Locale } from "./i18n/locales";

export type TroubleshootCategory = "Oscillation" | "Power / ESC" | "Flight Behavior" | "Radio Link" | "General";

type RawTroubleshootEntry = {
  id: string;
  symptom: { en: string; th: string };
  category: TroubleshootCategory;
  causes: { en: string[]; th: string[] };
  fix: { en: string; th: string };
  relatedKnowledge?: string;
};

export type TroubleshootEntry = {
  id: string;
  symptom: string;
  category: string;
  causes: string[];
  fix: string;
  relatedKnowledge?: string;
};

const CATEGORY_LABEL: Record<Locale, Record<TroubleshootCategory, string>> = {
  en: {
    Oscillation: "Oscillation",
    "Power / ESC": "Power / ESC",
    "Flight Behavior": "Flight Behavior",
    "Radio Link": "Radio Link",
    General: "General",
  },
  th: {
    Oscillation: "การสั่น",
    "Power / ESC": "พลังงาน / ESC",
    "Flight Behavior": "พฤติกรรมการบิน",
    "Radio Link": "ลิงก์วิทยุ",
    General: "ทั่วไป",
  },
};

const RAW_TROUBLESHOOT: RawTroubleshootEntry[] = [
  {
    id: "fast-flip-oscillation",
    symptom: { en: "Quad oscillates on fast flips or rolls", th: "โดรนสั่นตอนตีลังกาหรือ roll เร็วๆ" },
    category: "Oscillation",
    causes: {
      en: [
        "D-term set too high for the current filter setup",
        "Mechanical looseness — camera mount, stack screws, arm bolts",
        "Prop imbalance introducing periodic noise",
      ],
      th: [
        "D-term ตั้งสูงเกินไปสำหรับฟิลเตอร์ที่ใช้อยู่",
        "หลวมเชิงกล — ขาตั้งกล้อง, น็อตสแตก, น็อตแขน",
        "ใบพัดไม่บาลานซ์ ทำให้เกิด noise เป็นจังหวะ",
      ],
    },
    fix: {
      en: "Reduce D-term in small steps and re-test. Check all mechanical fasteners and prop balance before touching PID further — a loose stack will fight any tune.",
      th: "ลด D-term ทีละน้อยแล้วทดสอบใหม่ เช็คน็อตทุกตัวและบาลานซ์ใบพัดก่อนไปแตะ PID เพิ่ม — สแตกที่หลวมจะต้านทูนทุกแบบ",
    },
    relatedKnowledge: "gyro-dterm-filters",
  },
  {
    id: "hot-motors-short-flight",
    symptom: { en: "Motors run hot after a short flight", th: "มอเตอร์ร้อนหลังบินไม่นาน" },
    category: "Power / ESC",
    causes: {
      en: [
        "Dynamic notch filter not tracking the real motor noise frequency",
        "D-term set too high, forcing constant micro-corrections",
        "Prop pitch too aggressive for the motor KV / cell count",
      ],
      th: [
        "Dynamic notch filter ไม่ได้ติดตามความถี่ noise จริงของมอเตอร์",
        "D-term สูงเกินไป ทำให้แก้ไขเล็กๆ ตลอดเวลา",
        "Pitch ใบพัดแรงเกินไปสำหรับ KV มอเตอร์ / จำนวนเซลล์แบต",
      ],
    },
    fix: {
      en: "Re-check dyn_notch_min_hz / dyn_notch_max_hz against your motor KV and prop size, confirm blackbox gyro trace is clean, then re-evaluate D-term.",
      th: "เช็ค dyn_notch_min_hz / dyn_notch_max_hz ใหม่ให้ตรงกับ KV มอเตอร์และขนาดใบพัด เช็คว่ากราฟ gyro ใน blackbox สะอาด แล้วค่อยประเมิน D-term ใหม่",
    },
    relatedKnowledge: "motor-esc-basics",
  },
  {
    id: "drift-in-hover",
    symptom: { en: "Quad drifts to one side while hovering", th: "โดรนดริฟท์ไปด้านใดด้านหนึ่งตอนโฮเวอร์" },
    category: "Flight Behavior",
    causes: {
      en: [
        "I-term set too low to hold against a constant disturbance",
        "A bent arm or motor that isn't perfectly perpendicular to the frame",
        "Accelerometer not calibrated, if flying in Angle mode",
      ],
      th: [
        "I-term ต่ำเกินไปที่จะต้านแรงรบกวนต่อเนื่อง",
        "แขนเอียงหรือมอเตอร์ไม่ตั้งฉากกับเฟรมพอดี",
        "Accelerometer ยังไม่ได้ calibrate ถ้าบินโหมด Angle",
      ],
    },
    fix: {
      en: "Rule out hardware first — check frame squareness and motor alignment. If hardware is fine, increase I-term slightly and re-test the hover.",
      th: "ตัดเรื่องฮาร์ดแวร์ออกก่อน — เช็คความเที่ยงตรงของเฟรมและแนวมอเตอร์ ถ้าฮาร์ดแวร์ปกติดี ค่อยเพิ่ม I-term เล็กน้อยแล้วทดสอบโฮเวอร์ใหม่",
    },
    relatedKnowledge: "pid-controller-basics",
  },
  {
    id: "random-disarm",
    symptom: { en: "Quad disarms unexpectedly mid-flight", th: "โดรน disarm เองกลางอากาศ" },
    category: "Power / ESC",
    causes: {
      en: [
        "Battery voltage sagged below the configured low-voltage cutoff",
        "A brief RX link glitch triggered failsafe",
        "Loose battery connector causing momentary power loss",
      ],
      th: [
        "แรงดันแบตตกต่ำกว่าค่า cutoff ที่ตั้งไว้",
        "RX ลิงก์สะดุดสั้นๆ ทำให้ failsafe ทำงาน",
        "ขั้วต่อแบตหลวม ทำให้ไฟขาดชั่วขณะ",
      ],
    },
    fix: {
      en: "Check the blackbox log's vbat trace around the disarm timestamp, and RSSI/link-quality at the same point, to tell a power event from a link event apart.",
      th: "เช็คกราฟ vbat ใน blackbox log รอบเวลาที่ disarm และดู RSSI/link-quality ช่วงเดียวกัน เพื่อแยกว่าเป็นปัญหาไฟหรือปัญหาลิงก์",
    },
    relatedKnowledge: "radio-link-failsafe",
  },
  {
    id: "fuzzy-gyro-trace",
    symptom: { en: "Gyro trace in blackbox looks fuzzy or thick", th: "กราฟ gyro ใน blackbox ดูฟูหรือหนา" },
    category: "Oscillation",
    causes: {
      en: [
        "Filters not removing real mechanical noise",
        "Dynamic notch range set for the wrong motor/prop combo",
        "A mechanical vibration source — bent shaft, bad bearing, unbalanced prop",
      ],
      th: [
        "ฟิลเตอร์กำจัด noise เชิงกลจริงไม่หมด",
        "ตั้งช่วง dynamic notch ผิดสำหรับคู่มอเตอร์/ใบพัดที่ใช้",
        "มีแหล่งสั่นเชิงกล — แกนคด, ลูกปืนเสีย, ใบพัดไม่บาลานซ์",
      ],
    },
    fix: {
      en: "Confirm hardware is mechanically sound first, then walk through the filter chain from notch range to LPF cutoff before adjusting any PID value.",
      th: "เช็คว่าฮาร์ดแวร์ไม่มีปัญหาเชิงกลก่อน แล้วไล่เช็คฟิลเตอร์ทั้งชุดตั้งแต่ช่วง notch ถึง LPF cutoff ก่อนไปแตะค่า PID ใดๆ",
    },
    relatedKnowledge: "gyro-dterm-filters",
  },
  {
    id: "iterm-bounce",
    symptom: { en: "Quad bounces back after a hard flip (I-term bounce)", th: "โดรนเด้งกลับหลังตีลังกาแรงๆ (I-term bounce)" },
    category: "Oscillation",
    causes: {
      en: ["I-term set too high", "I-term relax settings too aggressive or too weak for the airframe"],
      th: ["I-term ตั้งสูงเกินไป", "ค่า I-term relax แรงหรืออ่อนเกินไปสำหรับตัวเครื่อง"],
    },
    fix: {
      en: "Lower I-term in small increments and re-test flips specifically, since this symptom shows up almost exclusively under sharp, large stick inputs.",
      th: "ลด I-term ทีละน้อยแล้วทดสอบท่าตีลังกาโดยเฉพาะ เพราะอาการนี้มักเกิดเฉพาะตอนกดสติ๊กแรงและสุดเท่านั้น",
    },
    relatedKnowledge: "pid-controller-basics",
  },
  {
    id: "link-loss-moderate-range",
    symptom: { en: "Control link degrades or drops at moderate range", th: "ลิงก์ควบคุมแย่ลงหรือขาดที่ระยะปานกลาง" },
    category: "Radio Link",
    causes: {
      en: [
        "Antenna orientation blocking line-of-sight to the transmitter",
        "TX output power set lower than needed for the environment",
        "RF interference from other 2.4/5.8GHz equipment nearby",
      ],
      th: [
        "ทิศทางเสาอากาศบัง line-of-sight ไปยังเครื่องส่ง",
        "กำลังส่งของ TX ตั้งต่ำเกินไปสำหรับสภาพแวดล้อม",
        "สัญญาณรบกวน RF จากอุปกรณ์ 2.4/5.8GHz อื่นใกล้ๆ",
      ],
    },
    fix: {
      en: "Check antenna placement and polarization first — it's the most common cause. Confirm link-quality telemetry, not just perceived signal strength, when diagnosing.",
      th: "เช็คตำแหน่งเสาอากาศและ polarization ก่อนเป็นอันดับแรก เป็นสาเหตุที่พบบ่อยที่สุด และดู link-quality telemetry จริง ไม่ใช่แค่ความรู้สึกว่าสัญญาณแรง",
    },
    relatedKnowledge: "radio-link-failsafe",
  },
  {
    id: "propwash-bounce-descent",
    symptom: { en: "Quad bounces or feels unstable during a fast descent", th: "โดรนเด้งหรือรู้สึกไม่นิ่งตอนดิ่งลงเร็วๆ" },
    category: "Flight Behavior",
    causes: {
      en: [
        "Prop wash — the quad flying through its own turbulent air on descent",
        "PID gains not attenuated at low throttle, amplifying the disturbance",
      ],
      th: [
        "Prop wash — โดรนบินผ่านอากาศปั่นป่วนของตัวเองตอนดิ่งลง",
        "ค่า PID ไม่ถูกลดลงตอนคันเร่งต่ำ ทำให้แรงรบกวนถูกขยาย",
      ],
    },
    fix: {
      en: "This is partly aerodynamic and expected to some degree. Throttle-based PID attenuation (TPA) settings can reduce how much the tune reacts to prop wash at low throttle.",
      th: "ส่วนหนึ่งเป็นเรื่องอากาศพลศาสตร์ที่คาดเดาได้อยู่แล้ว การตั้งค่า TPA (Throttle PID Attenuation) ช่วยลดการตอบสนองของทูนต่อ prop wash ตอนคันเร่งต่ำได้",
    },
  },
  {
    id: "wont-arm",
    symptom: { en: "Quad won't arm", th: "โดรน arm ไม่ได้" },
    category: "General",
    causes: {
      en: [
        "Failsafe condition currently active",
        "Craft tilted beyond the configured arming angle limit",
        "No valid RX signal being received",
        "Throttle stick not at minimum when arming",
      ],
      th: [
        "อยู่ในสถานะ failsafe อยู่",
        "ลำเอียงเกินมุมที่ตั้งไว้สำหรับการ arm",
        "ไม่มีสัญญาณ RX ที่ถูกต้องเข้ามา",
        "สติ๊กคันเร่งไม่ได้อยู่ตำแหน่งต่ำสุดตอน arm",
      ],
    },
    fix: {
      en: "Check the OSD or configurator arming-disable flags — Betaflight reports the exact blocking reason rather than leaving you to guess.",
      th: "เช็ค flag arming-disable ใน OSD หรือ configurator — Betaflight จะบอกสาเหตุที่บล็อกไว้ตรงๆ ไม่ต้องเดา",
    },
  },
  {
    id: "motor-idle-stutter",
    symptom: { en: "Motors twitch or stutter at low throttle / idle", th: "มอเตอร์กระตุกหรือสะดุดตอนคันเร่งต่ำ / idle" },
    category: "Power / ESC",
    causes: {
      en: [
        "dshot_idle_value set too low for the motor/ESC combo",
        "ESC not properly calibrated for the selected protocol",
        "Mismatched motor_pwm_protocol between FC and ESC firmware",
      ],
      th: [
        "dshot_idle_value ตั้งต่ำเกินไปสำหรับคู่มอเตอร์/ESC",
        "ESC ยัง calibrate ไม่ถูกต้องสำหรับ protocol ที่เลือก",
        "motor_pwm_protocol ระหว่าง FC กับ firmware ของ ESC ไม่ตรงกัน",
      ],
    },
    fix: {
      en: "Raise dshot_idle_value slightly and confirm the ESC firmware supports the configured DSHOT rate before assuming it's a tuning issue.",
      th: "เพิ่ม dshot_idle_value ขึ้นเล็กน้อย และเช็คว่า firmware ของ ESC รองรับ DSHOT rate ที่ตั้งไว้ ก่อนจะสรุปว่าเป็นปัญหาเรื่องจูน",
    },
    relatedKnowledge: "motor-esc-basics",
  },
  {
    id: "tips-over-on-takeoff",
    symptom: { en: "Quad tips over immediately on takeoff", th: "โดรนล้มทันทีตอนขึ้นบิน" },
    category: "General",
    causes: {
      en: [
        "One or more motors spinning the wrong direction",
        "Props mounted in the wrong rotation direction",
        "Throttle stick not centered / trimmed correctly before arming",
      ],
      th: [
        "มอเตอร์หนึ่งตัวหรือมากกว่าหมุนผิดทิศทาง",
        "ใส่ใบพัดผิดทิศทางการหมุน",
        "สติ๊กคันเร่งไม่อยู่กลางหรือ trim ไม่ถูกต้องก่อน arm",
      ],
    },
    fix: {
      en: "With props off, verify each motor's spin direction against the configurator's motor layout before ever testing with props on again.",
      th: "ถอดใบพัดออกก่อน แล้วเช็คทิศทางการหมุนของแต่ละมอเตอร์เทียบกับผังใน configurator ก่อนจะทดสอบใส่ใบพัดอีกครั้ง",
    },
  },
  {
    id: "osd-garbled",
    symptom: { en: "OSD elements are garbled, flickering, or missing", th: "OSD แสดงผลเพี้ยน กระพริบ หรือหายไป" },
    category: "General",
    causes: {
      en: [
        "OSD/VTX voltage or wiring issue",
        "Wrong OSD video system setting (PAL vs NTSC) for the camera",
        "SPI/serial contention with another peripheral on the same resource",
      ],
      th: [
        "ปัญหาแรงดันไฟหรือสายไฟของ OSD/VTX",
        "ตั้งค่าระบบวิดีโอ OSD ผิด (PAL กับ NTSC) ไม่ตรงกับกล้อง",
        "SPI/serial ชนกันกับอุปกรณ์อื่นที่ใช้ resource เดียวกัน",
      ],
    },
    fix: {
      en: "Confirm the video system setting matches your camera output first — it's the most common single cause of a garbled or partially-missing OSD.",
      th: "เช็คว่าตั้งค่าระบบวิดีโอตรงกับสัญญาณเอาต์พุตของกล้องก่อนเป็นอันดับแรก เป็นสาเหตุที่พบบ่อยที่สุดของ OSD เพี้ยนหรือหายไปบางส่วน",
    },
  },
  {
    id: "punchout-sluggish",
    symptom: { en: "Quad feels sluggish or flat on full-throttle punch-outs", th: "โดรนรู้สึกอืดหรือไม่มีแรงตอน punch-out คันเร่งเต็ม" },
    category: "Power / ESC",
    causes: {
      en: [
        "motor_output_limit set below 100%",
        "Battery voltage sagging heavily under load",
        "TPA attenuating PID gains too aggressively at high throttle",
      ],
      th: [
        "motor_output_limit ตั้งไว้ต่ำกว่า 100%",
        "แรงดันแบตตกหนักเมื่อโหลดสูง",
        "TPA ลดค่า PID แรงเกินไปตอนคันเร่งสูง",
      ],
    },
    fix: {
      en: "Check motor_output_limit and blackbox vbat sag first — both look like a 'weak' punch-out but aren't PID problems at all.",
      th: "เช็ค motor_output_limit และอาการแรงดันตกใน blackbox ก่อน ทั้งสองอย่างดูเหมือน punch-out 'อ่อนแรง' แต่ไม่ใช่ปัญหา PID เลย",
    },
  },
  {
    id: "vibration-after-crash",
    symptom: { en: "Noticeably more vibration or heat after a crash and repair", th: "สั่นหรือร้อนมากขึ้นชัดเจนหลังจากตกและซ่อม" },
    category: "Oscillation",
    causes: {
      en: [
        "A bent prop or motor shaft from the impact",
        "A motor screw not properly re-torqued during the repair",
        "A hairline crack in the frame introducing new flex",
      ],
      th: [
        "ใบพัดหรือแกนมอเตอร์คดจากแรงกระแทก",
        "น็อตมอเตอร์ขันไม่แน่นพอตอนซ่อม",
        "เฟรมร้าวเป็นรอยเล็กๆ ทำให้เกิดการโค้งงอใหม่",
      ],
    },
    fix: {
      en: "Treat any post-crash vibration increase as a hardware issue first — re-check props, motor mounting, and frame integrity before assuming the tune needs revisiting.",
      th: "ให้ถือว่าอาการสั่นที่เพิ่มขึ้นหลังตกเป็นปัญหาฮาร์ดแวร์ก่อนเสมอ — เช็คใบพัด, การยึดมอเตอร์ และความสมบูรณ์ของเฟรม ก่อนจะคิดว่าต้องกลับไปแก้ทูน",
    },
    relatedKnowledge: "gyro-dterm-filters",
  },
];

export function getTroubleshootEntries(locale: Locale): TroubleshootEntry[] {
  return RAW_TROUBLESHOOT.map((t) => ({
    id: t.id,
    symptom: t.symptom[locale],
    category: CATEGORY_LABEL[locale][t.category],
    causes: t.causes[locale],
    fix: t.fix[locale],
    relatedKnowledge: t.relatedKnowledge,
  }));
}
