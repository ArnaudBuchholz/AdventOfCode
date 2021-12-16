from lib import lines
from intcode import IntCode, INTCODE_HALTED, INTCODE_WAITING_FOR_INPUT, exec

initial_memory = [*map(int, lines[0].split(','))]


def engine(memory, phases):
  last_output = 0
  for phase in phases:
    engine_output = exec([*memory], False, [phase, last_output])
    last_output = engine_output[0]
  return last_output


# assert engine([3,15,3,16,1002,16,10,16,1,16,15,
#               15,4,15,99,0,0],[4,3,2,1,0]) == 43210
# assert engine([3,23,3,24,1002,24,10,24,1002,23,-1,
#               23,101,5,23,23,1,24,23,23,4,23,99,0,0],
#               [0,1,2,3,4]) == 54321
# assert engine([3,31,3,32,1002,32,10,32,1001,31,-2,
#               31,1007,31,0,33,1002,33,7,33,1,33,31,
#               31,1,32,31,31,4,31,99,0,0,0],
#               [1,0,4,3,2]) == 65210

def generate (numbers):
  if len(numbers) == 1:
    return numbers

  results = []
  for index, number in enumerate(numbers):
    remaining = [*numbers]
    del remaining[index]
    possibilities = generate(remaining)
    results = results + [*map(lambda n: n * 10 + number, possibilities)]

  return results

possible_phases = generate([0, 1, 2, 3, 4])
max_signal = 0
for int_phases in possible_phases:
  phases = str(int_phases).rjust(5, '0')
  signal = engine(initial_memory, phases)
  if signal > max_signal:
    max_signal = signal
print('Step 1 :', max_signal)

def feedback_engine(memory, phases):
  # First phase
  amp_a = IntCode([*memory])
  amp_a.inputs([phases[0], 0])
  amp_a.run()
  assert amp_a.state() == INTCODE_WAITING_FOR_INPUT

  amp_b = IntCode([*memory])
  amp_b.inputs([phases[1], amp_a.outputs()[-1]])
  amp_b.run()
  assert amp_b.state() == INTCODE_WAITING_FOR_INPUT

  amp_c = IntCode([*memory])
  amp_c.inputs([phases[2], amp_b.outputs()[-1]])
  amp_c.run()
  assert amp_c.state() == INTCODE_WAITING_FOR_INPUT

  amp_d = IntCode([*memory])
  amp_d.inputs([phases[3], amp_c.outputs()[-1]])
  amp_d.run()
  assert amp_d.state() == INTCODE_WAITING_FOR_INPUT

  amp_e = IntCode([*memory])
  amp_e.inputs([phases[4], amp_d.outputs()[-1]])
  amp_e.run()

  while amp_e.state() == INTCODE_WAITING_FOR_INPUT:
    amp_a.inputs([amp_e.outputs()[-1]])
    amp_a.run()
    amp_b.inputs([amp_a.outputs()[-1]])
    amp_b.run()
    amp_c.inputs([amp_b.outputs()[-1]])
    amp_c.run()
    amp_d.inputs([amp_c.outputs()[-1]])
    amp_d.run()
    amp_e.inputs([amp_d.outputs()[-1]])
    amp_e.run()

  assert amp_e.state() == INTCODE_HALTED
  return amp_e.outputs()[-1]

# assert feedback_engine([3,26,1001,26,-4,26,3,27,1002,27,
#                         2,27,1,27,26,27,4,27,1001,28,-1,
#                         28,1005,28,6,99,0,0,5],
#                         [9,8,7,6,5]) == 139629729
# assert feedback_engine([3,52,1001,52,-5,52,3,53,1,52,56,
#                         54,1007,54,5,55,1005,55,26,1001,
#                         54,-5,54,1105,1,12,1,53,54,53,
#                         1008,54,0,55,1001,55,1,55,2,53,
#                         55,53,4,53,1001,56,-1,56,1005,56,
#                         6,99,0,0,0,0,10],
#                         [9,7,8,5,6]) == 18216

possible_feedback_phases = generate([5, 6, 7, 8, 9])
max_feedback_signal = 0
for int_phases in possible_feedback_phases:
  phases = str(int_phases).rjust(5, '0')
  signal = feedback_engine(initial_memory, phases)
  if signal > max_feedback_signal:
    max_feedback_signal = signal
print('Step 2 :', max_feedback_signal)
