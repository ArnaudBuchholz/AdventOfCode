import sys
import re
import math
from pathlib import Path

year_day_parser = re.compile(r'(\d+)(?:\\|/)(\d+)')
year, day = year_day_parser.search(sys.argv[1]).groups()

if (len(sys.argv) >= 3 and sys.argv[2] == '-sample'):
  folder = 'sample'
else:
  folder = 'input'

input_path = Path.cwd() / year / folder / (day + '.txt')
script_path = Path.cwd() / year / (day + '.py')

with open(input_path) as input:
  lines = input.readlines()

lines = [*map(lambda s: s.strip(), lines)]

try:
  numbers = [*map(int, lines)]
except ValueError:
  numbers = []

exec(open(script_path).read())
