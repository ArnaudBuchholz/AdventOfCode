initial_memory = [*map(int, lines[0].split(','))]


def exec(verbose):
  global memory
  position = 0
  while True:
    if memory[position] == 1:
      pos_of_a = memory[position + 1]
      a = memory[pos_of_a]
      pos_of_b = memory[position + 2]
      b = memory[pos_of_b]
      pos_of_c = memory[position + 3]
      c = a + b
      if verbose:
        print('add', '@' + str(pos_of_a), a, '+', '@' + str(pos_of_b), b,
              '=', '@' + str(pos_of_c), c)
      memory[pos_of_c] = c
      position += 4
    elif memory[position] == 2:
      pos_of_a = memory[position + 1]
      a = memory[pos_of_a]
      pos_of_b = memory[position + 2]
      b = memory[pos_of_b]
      pos_of_c = memory[position + 3]
      c = a * b
      if verbose:
        print('mul', '@' + str(pos_of_a), a, '+', '@' + str(pos_of_b), b,
              '=', '@' + str(pos_of_c), c)
      memory[pos_of_c] = c
      position += 4
    elif memory[position] == 99:
      break
    else:
      print('unknown', '@' + str(position), memory[position])
      break


memory = [*initial_memory]
memory[1] = 12
memory[2] = 2
exec(True)
print('Step 1:', memory[0])

for attempt in range(100*100):
  verb = attempt % 100
  noun = math.floor((attempt - verb) / 100)
  memory = [*initial_memory]
  memory[1] = noun
  memory[2] = verb
  exec(False)
  result = memory[0]
  print('verb', verb, 'noun', noun, ':', result)
  if result == 19690720:
    print('Step 2 :', attempt)
    break
