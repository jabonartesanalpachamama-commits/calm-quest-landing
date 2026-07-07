import re

with open("doc.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace images with a marker
content_with_markers = re.sub(r'<img[^>]*>', '\n[IMAGE_MARKER]\n', content)

# Remove other HTML tags
text_only = re.sub(r'<[^>]+>', '\n', content_with_markers)

# Clean up empty lines
lines = [line.strip() for line in text_only.split('\n') if line.strip()]

for line in lines:
    print(line)
