with open('components/receiver/receiver-view.tsx', 'r') as f:
    content = f.read()

old = '      className={`${notoSerifTh.variable} ${notoSansTh.variable} font-sansTh relative h-screen overflow-hidden bg-gradient-to-br ${BG_THEME[themeKey]}`}'

new = '''      className={[
        notoSerifTh.variable,
        notoSansTh.variable,
        "font-sansTh relative h-screen overflow-hidden bg-gradient-to-br",
        themeKey === "rose" && "from-pink-50 via-white to-rose-50",
        themeKey === "blue" && "from-sky-50 via-white to-blue-50",
        themeKey === "gold" && "from-amber-50 via-white to-yellow-50",
        themeKey === "green" && "from-emerald-50 via-white to-green-50",
        themeKey === "purple" && "from-violet-50 via-white to-purple-50",
      ].filter(Boolean).join(" ")}'''

if old in content:
    content = content.replace(old, new)
    print("✅ Fixed!")
else:
    print("❌ Pattern not found, checking line 322...")
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'bg-gradient-to-br' in line and i > 300:
            print(f"Line {i+1}: {line.strip()}")
            break

with open('components/receiver/receiver-view.tsx', 'w') as f:
    f.write(content)
