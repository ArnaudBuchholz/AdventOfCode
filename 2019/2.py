import math
from lib import lines
from intcode import exec

initial_memory = [*map(int, lines[0].split(','))]

memory = [*initial_memory]
memory[1] = 12
memory[2] = 2
exec(memory, True)
print('Step 1 :', memory[0])

for attempt in range(100*100):
  verb = attempt % 100
  noun = math.floor((attempt - verb) / 100)
  memory = [*initial_memory]
  memory[1] = noun
  memory[2] = verb
  exec(memory, False)
  result = memory[0]
  # print('verb', verb, 'noun', noun, ':', result)
  if result == 19690720:
    print('Step 2 :', attempt)
    break
