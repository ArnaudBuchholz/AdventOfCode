from lib import lines
from intcode import exec
initial_memory = [*map(int, lines[0].split(','))]

# exec([3,0,4,0,99], True)
# exec([1002,4,3,4,33], True)

outputs = exec([*initial_memory], False, [1])
print('Step 1 :', outputs[-1])

# 1 if input == 8, 0 otherwise
# exec([3,9,8,9,10,9,4,9,99,-1,8], True)
# exec([3,3,1108,-1,8,3,4,3,99], True)
# 1 if input < 8, 0 otherwise
# exec([3,9,7,9,10,9,4,9,99,-1,8], True)
# exec([3,3,1107,-1,8,3,4,3,99], True)
# 1 if input != 0, 0 otherwise
# exec([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], True)
# exec([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], True)

outputs = exec([*initial_memory], False, [5])
print('Step 1 :', outputs[-1])
