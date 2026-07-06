import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    depth = filepath.count(os.sep) - 1
    import_path = '../' * depth + 'utils/apiResponse'
    import_path = import_path.replace('\\', '/')

    # Track what we use so we can import it
    uses_extractList = False
    uses_extractData = False
    uses_extractErrorMessage = False

    # 1. Replace setX(res.content || []) with setX(extractList(res))
    # We do a targeted replacement for known list assignments:
    content, n1 = re.subn(r'(set[A-Z][a-zA-Z]*)\(\s*(?:res|response|data|claimResponse|policyResponse|paymentResponse)\.content(?:\s*\|\|\s*\[\])?\s*\)', r'\1(extractList(\g<0>))', content)
    # The above regex is flawed because \g<0> is the whole match. Let's do it better.
    
    # Let's just write a custom function for replacement
    def repl_list(m):
        return f"{m.group(1)}(extractList({m.group(2)}))"
        
    content, n1 = re.subn(r'(set[A-Z][a-zA-Z]*)\(\s*([a-zA-Z]+)\.content(?:\s*\|\|\s*\[\])?\s*\)', repl_list, content)
    if n1 > 0: uses_extractList = True

    def repl_list2(m):
        return f"return extractList({m.group(1)});"
    content, n2 = re.subn(r'return\s+([a-zA-Z]+)\.content(?:\s*\|\|\s*\[\])?\s*;', repl_list2, content)
    if n2 > 0: uses_extractList = True

    # Single entity data extraction
    def repl_data(m):
        return f"{m.group(1)}(extractData({m.group(2)}))"
    content, n3 = re.subn(r'(set[A-Z][a-zA-Z]*)\(\s*([a-zA-Z]+)\.data(?:\s*\|\|\s*\[\])?\s*\)', repl_data, content)
    if n3 > 0: uses_extractData = True
    
    # Error message extraction
    def repl_err(m):
        if m.group(2):
            return f"extractErrorMessage({m.group(1)}, {m.group(2)})"
        return f"extractErrorMessage({m.group(1)})"
        
    content, n4 = re.subn(r'([a-zA-Z]+)(?:\.response\?\.data\?\.message|\?\.response\?\.data\?\.message)\s*\|\|\s*(?:"([^"]+)"|\'([^\']+)\')', lambda m: f"extractErrorMessage({m.group(1)}, \"{m.group(2) or m.group(3)}\")", content)
    if n4 > 0: uses_extractErrorMessage = True

    if original != content:
        imports = []
        if uses_extractList: imports.append('extractList')
        if uses_extractData: imports.append('extractData')
        if uses_extractErrorMessage: imports.append('extractErrorMessage')
        
        if imports:
            import_stmt = f"import {{ {', '.join(imports)} }} from '{import_path}';\n"
            # Insert after the last import
            lines = content.split('\n')
            last_import = -1
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import = i
            if last_import != -1:
                lines.insert(last_import + 1, import_stmt)
            else:
                lines.insert(0, import_stmt)
            content = '\n'.join(lines)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for f in glob.glob('src/pages/**/*.jsx', recursive=True):
    process_file(f)
