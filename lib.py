import sys, re, math
from pathlib import Path

year_day_parser = re.compile(r'(\d+)(?:\\|/)(\d+)')
year, day = year_day_parser.search(sys.argv[1]).groups()

input_path = Path.cwd() / year / 'input' / (day + '.txt')
script_path = Path.cwd() / year / (day + '.py')

with open(input_path) as input:
  lines = input.readlines()

numbers = [*map(int, lines)]

exec(open(script_path).read())
