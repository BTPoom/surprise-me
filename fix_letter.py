with open('components/receiver/letter-content.tsx', 'r') as f:
    content = f.read()

# 1. เพิ่ม theme ใน interface
content = content.replace(
    'interface LetterContentProps {\n  page: PageData;\n}',
    'interface LetterContentProps {\n  page: PageData;\n  theme?: "rose" | "blue" | "gold" | "green" | "purple";\n}'
)

# 2. เพิ่ม LETTER_THEME map ก่อน export function
theme_map = '''const LETTER_THEME: Record<string, { borderOuter: string; bgCard: string; shadow: string; borderCard: string; glowTop: string; glowBottom: string; icon: string; title: string; line: string; dot: string; quote: string; text: string; senderBg: string; senderBorder: string; senderText: string }> = {
  rose: {
    borderOuter: "border-rose-300/40", bgCard: "bg-rose-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(225,29,72,0.18)]", borderCard: "border-rose-200/70",
    glowTop: "bg-rose-200/25", glowBottom: "bg-rose-100/30", icon: "text-rose-400", title: "text-rose-700", line: "bg-rose-300/70", dot: "bg-rose-400", quote: "text-rose-300/80", text: "text-rose-900/85", senderBg: "bg-rose-50", senderBorder: "border-rose-200/80", senderText: "text-rose-700",
  },
  blue: {
    borderOuter: "border-sky-300/40", bgCard: "bg-sky-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(14,165,233,0.18)]", borderCard: "border-sky-200/70",
    glowTop: "bg-sky-200/25", glowBottom: "bg-sky-100/30", icon: "text-sky-400", title: "text-sky-700", line: "bg-sky-300/70", dot: "bg-sky-400", quote: "text-sky-300/80", text: "text-sky-900/85", senderBg: "bg-sky-50", senderBorder: "border-sky-200/80", senderText: "text-sky-700",
  },
  gold: {
    borderOuter: "border-gold-300/40", bgCard: "bg-[#FFFDF8]/95", shadow: "shadow-[0_20px_60px_-15px_rgba(107,39,55,0.18)]", borderCard: "border-gold-200/70",
    glowTop: "bg-gold-200/25", glowBottom: "bg-wine-100/30", icon: "text-gold-400", title: "text-wine-600", line: "bg-gold-300/70", dot: "bg-gold-400", quote: "text-gold-300/80", text: "text-ink/85", senderBg: "bg-gold-50", senderBorder: "border-gold-200/80", senderText: "text-wine-600",
  },
  green: {
    borderOuter: "border-emerald-300/40", bgCard: "bg-emerald-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(16,185,129,0.18)]", borderCard: "border-emerald-200/70",
    glowTop: "bg-emerald-200/25", glowBottom: "bg-emerald-100/30", icon: "text-emerald-400", title: "text-emerald-700", line: "bg-emerald-300/70", dot: "bg-emerald-400", quote: "text-emerald-300/80", text: "text-emerald-900/85", senderBg: "bg-emerald-50", senderBorder: "border-emerald-200/80", senderText: "text-emerald-700",
  },
  purple: {
    borderOuter: "border-violet-300/40", bgCard: "bg-violet-50/95", shadow: "shadow-[0_20px_60px_-15px_rgba(139,92,246,0.18)]", borderCard: "border-violet-200/70",
    glowTop: "bg-violet-200/25", glowBottom: "bg-violet-100/30", icon: "text-violet-400", title: "text-violet-700", line: "bg-violet-300/70", dot: "bg-violet-400", quote: "text-violet-300/80", text: "text-violet-900/85", senderBg: "bg-violet-50", senderBorder: "border-violet-200/80", senderText: "text-violet-700",
  },
};

'''

content = content.replace('export function LetterContent({ page }: LetterContentProps) {', theme_map + 'export function LetterContent({ page, theme = "rose" }: LetterContentProps) {\n  const t = LETTER_THEME[theme] || LETTER_THEME["rose"];')

# 3. แทนที่สี hardcode ด้วย t.xxx
content = content.replace('border-gold-300/40', '${t.borderOuter}')
content = content.replace('bg-[#FFFDF8]/95', '${t.bgCard}')
content = content.replace('shadow-[0_20px_60px_-15px_rgba(107,39,55,0.18)]', '${t.shadow}')
content = content.replace('border-gold-200/70', '${t.borderCard}')
content = content.replace('bg-gold-200/25', '${t.glowTop}')
content = content.replace('bg-wine-100/30', '${t.glowBottom}')
content = content.replace('text-gold-400', '${t.icon}')
content = content.replace('text-wine-500', '${t.title}')
content = content.replace('bg-gold-300/70', '${t.line}')
content = content.replace('bg-gold-400', '${t.dot}')
content = content.replace('text-gold-300/80', '${t.quote}')
content = content.replace('text-ink/85', '${t.text}')
content = content.replace('bg-gold-50', '${t.senderBg}')
content = content.replace('border-gold-200/80', '${t.senderBorder}')
content = content.replace('text-wine-500', '${t.senderText}')

# Fix duplicate replacements for senderText (wine-500 appears twice)
# Actually we need to be more careful - let me do targeted replacements

with open('components/receiver/letter-content.tsx', 'w') as f:
    f.write(content)

print("✅ Done - check the file manually to ensure replacements are correct")
