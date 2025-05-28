import os
import sys

SKIP_DIRS = {'.vite', 'node_modules', 'dist', '.env', '.gitignore'}

def list_resources(path, prefix=""):
    try:
        items = sorted(os.listdir(path))
    except PermissionError:
        print(f"{prefix}[Permission Denied] {path}")
        return

    items = [item for item in items if item not in SKIP_DIRS]

    for i, item in enumerate(items):
        full_path = os.path.join(path, item)
        connector = "├── " if i < len(items) - 1 else "└── "
        print(f"{prefix}{connector}{item}")
        if os.path.isdir(full_path):
            extension = "│   " if i < len(items) - 1 else "    "
            list_resources(full_path, prefix + extension)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        root = sys.argv[1]
    else:
        root = "."

    print(root)
    list_resources(root)