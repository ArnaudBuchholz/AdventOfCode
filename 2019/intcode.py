def exec(memory, verbose, inputs=[]):
  input_index = 0
  position = 0
  outputs = []

  def getParameter(offset, mode):
    if mode == 0:
      pos_of_value = memory[position + offset]
      value = memory[pos_of_value]
      return (value, '@{}:{}'.format(pos_of_value, value))
    value = memory[position + offset]
    return (value, str(value))

  while True:
    instruction = memory[position]
    opcode = instruction % 100
    param1_mode = int(instruction // 100 % 10)
    param2_mode = int(instruction // 1000 % 10)
    param3_mode = int(instruction // 10000 % 10)

    if opcode == 1:
      a, label_of_a = getParameter(1, param1_mode)
      b, label_of_b = getParameter(2, param2_mode)
      assert param3_mode == 0
      pos_of_c = memory[position + 3]
      c = a + b
      if verbose:
        print('add', label_of_a, '+', label_of_b, '=', '@' + str(pos_of_c), c)
      memory[pos_of_c] = c
      position += 4

    elif opcode == 2:
      a, label_of_a = getParameter(1, param1_mode)
      b, label_of_b = getParameter(2, param2_mode)
      assert param3_mode == 0
      pos_of_c = memory[position + 3]
      c = a * b
      if verbose:
        print('mul', label_of_a, '*', label_of_b, '=', '@' + str(pos_of_c), c)
      memory[pos_of_c] = c
      position += 4

    elif opcode == 3:
      assert param1_mode == 0
      pos_of_input = memory[position + 1]
      if input_index < len(inputs):
        if verbose:
          print('input', '@' + str(pos_of_input))
        str_value = inputs[input_index]
        input_index = input_index + 1
      else:
        print('input', '@' + str(pos_of_input))
        str_value = input()
      memory[pos_of_input] = int(str_value)
      position += 2

    elif opcode == 4:
      # if param1_mode != 0:
      #   print('Suprise :', instruction)
      # assert param1_mode == 0
      pos_of_output = memory[position + 1]
      if verbose:
        print('output', '@' + str(pos_of_output))
      value = memory[pos_of_output]
      print(value)
      outputs = [*outputs, value]
      position += 2

    elif opcode == 5:
      condition, label_of_condition = getParameter(1, param1_mode)
      offset, label_of_offset = getParameter(2, param2_mode)
      if verbose:
        print('jump-if-true', label_of_condition, '? ->', label_of_offset)
      if condition != 0:
        position = offset
      else:
        position += 3

    elif opcode == 6:
      condition, label_of_condition = getParameter(1, param1_mode)
      offset, label_of_offset = getParameter(2, param2_mode)
      if verbose:
        print('jump-if-false', label_of_condition, '? ->', label_of_offset)
      if condition == 0:
        position = offset
      else:
        position += 3

    elif opcode == 7:
      a, label_of_a = getParameter(1, param1_mode)
      b, label_of_b = getParameter(2, param2_mode)
      assert param3_mode == 0
      pos_of_c = memory[position + 3]
      if verbose:
        print('less-than', label_of_a, '<', label_of_b,
              '? ->', '@' + str(pos_of_c))
      if a < b:
        memory[pos_of_c] = 1
      else:
        memory[pos_of_c] = 0
      position += 4

    elif opcode == 8:
      a, label_of_a = getParameter(1, param1_mode)
      b, label_of_b = getParameter(2, param2_mode)
      assert param3_mode == 0
      pos_of_c = memory[position + 3]
      if verbose:
        print('equal', label_of_a, '==', label_of_b,
              '? ->', '@' + str(pos_of_c))
      if a == b:
        memory[pos_of_c] = 1
      else:
        memory[pos_of_c] = 0
      position += 4

    elif opcode == 99:
      break

    else:
      print('unknown', '@{}:{}'.format(position, memory[position]))
      break

  return outputs
