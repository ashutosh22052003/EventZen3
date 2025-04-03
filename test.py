
import os

def list_directory(path=".", level=0):
    """Recursively prints the directory structure"""
    if level == 0:
        print(f"Root Directory: {os.path.abspath(path)}")
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            print("  " * level + f"📁 {item}/")
            list_directory(item_path, level + 1)
        else:
            print("  " * level + f"📄 {item}")

# Change the path to your project directory
project_directory = "/Users/ashutoshkumar/Downloads/EventZen2/eventzen-frontend"  # Change this as needed
list_directory(project_directory)
