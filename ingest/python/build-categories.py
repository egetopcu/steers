'''
Create a program in python that:
1.  Reads in a text file with lines in the following format:
    category[:category[:category]]

    - each line may contain up to three categories. Categories on the same line are nested categories.
    - empty lines and lines starting with a '#' should be ignored.
2.  Creates a tree structure of the categories.
3.  Writes the tree structure to a file.
'''

import json

class Category:
    def __init__(self, name, parent=None):
        self.name = name
        self.parent = parent
        self.children = {}
        
    def add_child(self, child):
        self.children[child.name] = child

    def to_json(self):
        return {child.name: child.to_json() for child in self.children.values()}
    
root = Category('root')

with open('ingest/taxonomy.txt') as f:
    for line in f:
        if line.startswith('#') or not line.strip(): 
            continue

        parent = root
        categories = [c.strip() for c in line.split(':')]
        
        for category in categories:
            if category not in parent.children:
                parent.add_child(Category(category, parent=parent))

            parent = parent.children[category]

def print_tree(node: Category, depth = 0, max_depth = 9999):
    if depth > max_depth:
        return
        
    print(' ' * depth * 2, node.name)
    for child in node.children.values():
        print_tree(child, depth + 1, max_depth)

with open('ingest/taxonomy.json', 'w') as out:
    json.dump(root.to_json(), out, indent=2)