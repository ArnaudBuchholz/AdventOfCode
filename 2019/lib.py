import sys
import re
from pathlib import Path

script_param_index = 0
if '--' in sys.argv:  # debug mode
  script_param_index = sys.argv.index('--') + 1

year_day_parser = re.compile(r'(\d+)(?:\\|/)(\d+)\.py$')
year, day = year_day_parser.search(sys.argv[script_param_index]).groups()

if (len(sys.argv) >= (script_param_index + 2)
    and sys.argv[script_param_index + 1] == '-sample'):
  folder = 'sample'
else:
  folder = 'input'

input_path = Path.cwd() / year / folder / (day + '.txt')

with open(input_path) as input:
  lines = input.readlines()

lines = [*map(lambda s: s.strip(), lines)]

try:
  numbers = [*map(int, lines)]
except ValueError:
  numbers = []
