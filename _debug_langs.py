import re
with open('/home/piyush/timetable-app/frontend/guide.html', 'r') as f:
    content = f.read()

# Find all lang-content divs
lang_pattern = r'<div class="lang-content[^>]*>'
langs = re.findall(lang_pattern, content)
print(f"કુલ lang-content divs: {len(langs)}")
for i, lang in enumerate(langs):
    print(f"  {i+1}. {lang}")

# Find the closing </div> for content
end_pattern = r'</div>\s*</div>\s*<div class="footer>'
match = re.search(end_pattern, content)
if match:
    print(f"\nમુખ્ય કન્ટેન્ટ સમાપ્તિ: line ~{content[:match.end()].count(chr(10)) + 1}")