import re
from lib import lines


class Node:
  def __init__(self, name):
    self.name = name
    self.parent = None
    self.children = []

  def add(self, child):
    child.parent = self
    self.children = [*self.children, child]

  def path(self):
    result = []
    current = self.parent
    while current is not None:
      result = [current.name, *result]
      current = current.parent
    return result


nodes = {}

orbit_parser = re.compile(r'([A-Z0-9]+)\)([A-Z0-9]+)')

for orbit in lines:
  parent_name, child_name = orbit_parser.search(orbit).groups()
  if parent_name in nodes:
    parent = nodes.get(parent_name)
  else:
    parent = Node(parent_name)
    nodes[parent_name] = parent
  if child_name in nodes:
    child = nodes.get(child_name)
  else:
    child = Node(child_name)
    nodes[child_name] = child
  parent.add(child)

number_of_orbits = 0
for name, node in nodes.items():
  number_of_orbits += len(node.path())

print('Step 1 :', number_of_orbits)

you = nodes.get('YOU')
you_path = you.path()
# print('YOU', you_path)

san = nodes.get('SAN')
san_path = san.path()
# print('SAN', san_path)

index = 0
while you_path[index] == san_path[index]:
  index += 1

print('Step 2 :', len(san_path) - index + len(you_path) - index)
