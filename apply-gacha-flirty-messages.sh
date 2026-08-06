#!/usr/bin/env bash
# apply-gacha-flirty-messages.sh
# รันจาก root ของโปรเจกต์ (โฟลเดอร์ที่มี package.json)
#   chmod +x apply-gacha-flirty-messages.sh && ./apply-gacha-flirty-messages.sh
#
# เปลี่ยนข้อความในทุกหมวดของกาชาให้เป็นข้อความจีบ (คงโครงสร้างหมวด/weight/เสียงเดิมไว้)
set -e
echo "กำลังเขียนไฟล์..."

mkdir -p "$(dirname 'components/gacha/gacha-data.ts')"
cat > 'components/gacha/gacha-data.ts' << 'SCRIPT_EOF_MARKER'
export type RewardCategory =
  | "love-message"
  | "encouragement"
  | "secret-message"
  | "open-when"
  | "lucky-heart"
  | "rare-message";

export interface CategoryMeta {
  key: RewardCategory;
  label: string;
  weight: number;
  emoji: string;
  gradient: string; // tailwind gradient classes สำหรับแคปซูล/การ์ด
  ring: string; // สีขอบ/ตัวอักษร
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    key: "love-message",
    label: "จีบตรงๆ",
    weight: 25,
    emoji: "💌",
    gradient: "from-[#F7D3D6] to-[#F0B8BE]",
    ring: "text-[#B4525C] border-[#EFC2C6]",
  },
  {
    key: "encouragement",
    label: "คำชมหวานๆ",
    weight: 22,
    emoji: "🌷",
    gradient: "from-[#F3E4D2] to-[#E9CFB0]",
    ring: "text-[#8A6A45] border-[#E7D3B8]",
  },
  {
    key: "secret-message",
    label: "Secret Message",
    weight: 18,
    emoji: "🔐",
    gradient: "from-[#EAD9E8] to-[#D9BFDA]",
    ring: "text-[#7A5480] border-[#DDC3DE]",
  },
  {
    key: "open-when",
    label: "Open When Letter",
    weight: 15,
    emoji: "✉️",
    gradient: "from-[#F5EADC] to-[#E7D6BF]",
    ring: "text-[#7A5F3F] border-[#E5D2B4]",
  },
  {
    key: "lucky-heart",
    label: "Lucky Heart",
    weight: 13,
    emoji: "🍀",
    gradient: "from-[#DCEAD9] to-[#C4DFC0]",
    ring: "text-[#4E7A48] border-[#CDE2C8]",
  },
  {
    key: "rare-message",
    label: "Rare Message",
    weight: 7,
    emoji: "🌟",
    gradient: "from-[#F6E3B4] to-[#E8C165]",
    ring: "text-[#8A6512] border-[#EAD08C]",
  },
];

const CONTENT_POOL: Record<RewardCategory, string[]> = {
  "love-message": [
    "ขอจีบตรงๆ เลยนะ เธอเป็นคนที่ฉันอยากคุยด้วยทุกวันเลย",
    "แค่เห็นชื่อเธอขึ้นมา หัวใจฉันก็เต้นแรงแบบบอกไม่ถูกแล้ว",
    "แอบสงสัยว่าเธอใช้เวทมนตร์อะไร ถึงทำให้ฉันคิดถึงตลอดเวลา",
    "ถ้าเธอคือดาว ฉันคงเฝ้ามองเธอทั้งคืนโดยไม่มีเบื่อ",
    "เธอทำให้วันธรรมดาๆ ของฉันกลายเป็นวันพิเศษได้ทุกที",
  ],
  encouragement: [
    "ยิ้มสวยแบบนี้ มีใครเคยบอกเธอไหมว่าน่าหลงใหลมาก",
    "เธอเก่งและน่ารักในเวลาเดียวกันได้ยังไงเนี่ย",
    "แค่เธอเดินผ่าน หัวใจฉันก็อดไม่ได้ที่จะเต้นแรง",
    "ขอบอกตรงๆ ว่าเธอคือคนที่ทำให้ฉันอยากดูแลเป็นพิเศษ",
    "เธอมีเสน่ห์บางอย่างที่ทำให้ใครๆ ก็อดใจจีบไม่ไหว",
  ],
  "secret-message": [
    "ความลับ: ฉันแอบดีใจทุกครั้งที่เธอทักมาก่อน",
    "เก็บไว้เป็นความลับนะ... จริงๆ แล้วฉันแอบชอบเธอมานานแล้ว",
    "บอกตามตรง เธอคือคนที่ฉันคิดถึงก่อนนอนทุกคืน",
    "แอบกระซิบว่า ฉันอยากให้เธอเป็นคนพิเศษของฉันจริงๆ",
  ],
  "open-when": [
    "Open When... คุณอยากรู้ว่ามีคนแอบชอบคุณอยู่",
    "Open When... คุณอยากได้ยินคำชมหวานๆ สักคำ",
    "Open When... คุณอยากรู้ว่าใครบางคนคิดถึงคุณทั้งวัน",
    "Open When... คุณพร้อมจะให้ใครสักคนจีบคุณแล้ว",
  ],
  "lucky-heart": [
    "โชคดีจัง วันนี้เธอเจอฉัน ยิ้มหวานๆ แบบนี้ใครจะทนไหว",
    "หัวใจดวงนี้แอบส่งสัญญาณว่าฉันอยากจีบเธอจริงๆ นะ",
    "วันนี้พิเศษกว่าทุกวัน เพราะมีเธออยู่ในสายตาฉัน",
    "Lucky Heart พิเศษ: แลกเบอร์กันไหม แล้วจะจีบให้สุดฝีมือ",
  ],
  "rare-message": [
    "ข้อความหายาก: เธอคือคนที่ทำให้ฉันอยากจีบแบบจริงจังเป็นครั้งแรก",
    "ข้อความหายาก: ถ้าเลือกได้ ฉันอยากให้เธอเป็นคนพิเศษของฉันคนเดียว",
    "ข้อความหายาก: หัวใจฉันเลือกเธอแล้ว เหลือแค่รอเธอตอบตกลง",
  ],
};

export interface GachaResult {
  category: CategoryMeta;
  message: string;
}

// สุ่มแบบถ่วงน้ำหนัก (weighted random) ตาม weight ของแต่ละหมวด
export function rollGacha(): GachaResult {
  const totalWeight = CATEGORY_META.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;

  let chosen = CATEGORY_META[0];
  for (const cat of CATEGORY_META) {
    if (roll < cat.weight) {
      chosen = cat;
      break;
    }
    roll -= cat.weight;
  }

  const pool = CONTENT_POOL[chosen.key];
  const message = pool[Math.floor(Math.random() * pool.length)];

  return { category: chosen, message };
}

// เสียงสังเคราะห์เบาๆ ด้วย Web Audio API — ไม่ต้องพึ่งไฟล์เสียงภายนอก
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(freq: number, startOffset: number, duration: number, ctx: AudioContext, gainPeak = 0.06) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  playTone(660, 0, 0.12, ctx, 0.05);
  playTone(880, 0.06, 0.14, ctx, 0.05);
}

export function playChimeSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    playTone(freq, i * 0.09, 0.35, ctx, 0.045);
  });
}
SCRIPT_EOF_MARKER
echo '  ✓ components/gacha/gacha-data.ts'

echo ""
echo "✅ เสร็จแล้ว! รัน npm run dev แล้วลองหมุนกาชาดูได้เลย"
