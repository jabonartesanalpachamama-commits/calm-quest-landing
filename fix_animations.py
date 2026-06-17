import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content
    
    # 1. Update duration: 0.7 to 0.4
    content = re.sub(r'duration:\s*0\.[6789]', 'duration: 0.4', content)
    
    # 2. Update staggerChildren: 0.1 or 0.2 to 0.05
    content = re.sub(r'staggerChildren:\s*0\.[123]', 'staggerChildren: 0.05', content)
    content = re.sub(r'delayChildren:\s*0\.[234]', 'delayChildren: 0.1', content)

    # 3. For sections that only have <motion.div initial="hidden" animate="show"> but aren't the hero (we can't blindly do this, so I will do this manually for sections if needed, or stick to just speeding up for now)
    
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for d in ['src/pages/*.tsx', 'src/components/*.tsx']:
    for f in glob.glob(d):
        process_file(f)
