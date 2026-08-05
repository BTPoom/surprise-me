import re

# Fix receiver-view.tsx
with open('components/receiver/receiver-view.tsx', 'r') as f:
    content = f.read()

# Add BG_THEME before DOT_THEME
bg_theme = '''const BG_THEME: Record<"rose" | "blue" | "gold" | "green" | "purple", string> = {
  rose: "from-pink-50 via-white to-rose-50",
  blue: "from-sky-50 via-white to-blue-50",
  gold: "from-amber-50 via-white to-yellow-50",
  green: "from-emerald-50 via-white to-green-50",
  purple: "from-violet-50 via-white to-purple-50",
};

'''
content = content.replace('const DOT_THEME:', bg_theme + 'const DOT_THEME:')

# Replace hardcoded bg with dynamic
content = content.replace(
    'className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-pink-50 via-white to-rose-50"',
    'className={`relative min-h-screen overflow-x-hidden bg-gradient-to-br ${BG_THEME[themeKey]}`}'
)

with open('components/receiver/receiver-view.tsx', 'w') as f:
    f.write(content)

# Fix page.tsx wrapper
with open('app/(public)/s/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white"',
    'className="min-h-screen bg-transparent"'
)

with open('app/(public)/s/[slug]/page.tsx', 'w') as f:
    f.write(content)

print('Done!')
