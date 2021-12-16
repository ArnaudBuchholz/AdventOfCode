INTOCODE_NOT_RUNNING = 0
INTCODE_HALTED = 99
INTCODE_ERROR = 100
INTCODE_WAITING_FOR_INPUT = 3


class IntCode:
  def __init__(self, memory):
    self.__memory = memory
    self.__position = 0
    self.__state = INTOCODE_NOT_RUNNING
    self.__verbose = False
    self.__inputs = []
    self.__outputs = []

  def state(self):
    return self.__state

  def verbose(self, verbose):
    self.__verbose = verbose

  def inputs(self, inputs):
    self.__inputs = inputs

  def outputs(self):
    return self.__outputs

  def __getParameter(self, offset, mode):
    if mode == 0:
      pos_of_value = self.__memory[self.__position + offset]
      value = self.__memory[pos_of_value]
      return (value, '@{}:{}'.format(pos_of_value, value))
    value = self.__memory[self.__position + offset]
    return (value, str(value))

  def run(self):
    while True:
      instruction = self.__memory[self.__position]
      opcode = instruction % 100
      param1_mode = int(instruction // 100 % 10)
      param2_mode = int(instruction // 1000 % 10)
      param3_mode = int(instruction // 10000 % 10)

      if opcode == 1:  # ADD
        a, label_of_a = self.__getParameter(1, param1_mode)
        b, label_of_b = self.__getParameter(2, param2_mode)
        assert param3_mode == 0
        pos_of_c = self.__memory[self.__position + 3]
        c = a + b
        if self.__verbose:
          print('ADD', label_of_a, '+', label_of_b,
                '=', '@' + str(pos_of_c), c)
        self.__memory[pos_of_c] = c
        self.__position += 4

      elif opcode == 2:  # MUL
        a, label_of_a = self.__getParameter(1, param1_mode)
        b, label_of_b = self.__getParameter(2, param2_mode)
        assert param3_mode == 0
        pos_of_c = self.__memory[self.__position + 3]
        c = a * b
        if self.__verbose:
          print('MUL', label_of_a, '*', label_of_b,
                '=', '@' + str(pos_of_c), c)
        self.__memory[pos_of_c] = c
        self.__position += 4

      elif opcode == 3:  # INPUT
        assert param1_mode == 0
        pos_of_input = self.__memory[self.__position + 1]
        if self.__verbose:
          print('INPUT', '@' + str(pos_of_input))
        if len(self.__inputs) == 0:
          self.__state = INTCODE_WAITING_FOR_INPUT
          break
        str_value = self.__inputs[0]
        del self.__inputs[0]
        self.__memory[pos_of_input] = int(str_value)
        self.__position += 2

      elif opcode == 4:  # OUTPUT
        # if param1_mode != 0:
        #   print('Suprise :', instruction)
        # assert param1_mode == 0
        pos_of_output = self.__memory[self.__position + 1]
        if self.__verbose:
          print('output', '@' + str(pos_of_output))
        value = self.__memory[pos_of_output]
        self.__outputs.append(value)
        self.__position += 2

      elif opcode == 5:  # JUMP-IF-TRUE
        condition, label_of_condition = self.__getParameter(1, param1_mode)
        offset, label_of_offset = self.__getParameter(2, param2_mode)
        if self.__verbose:
          print('JUMP-IF-TRUE', label_of_condition, '? ->', label_of_offset)
        if condition != 0:
          self.__position = offset
        else:
          self.__position += 3

      elif opcode == 6:  # JUMP-IF-FALSE
        condition, label_of_condition = self.__getParameter(1, param1_mode)
        offset, label_of_offset = self.__getParameter(2, param2_mode)
        if self.__verbose:
          print('JUMP-IF-FALSE', label_of_condition, '? ->', label_of_offset)
        if condition == 0:
          self.__position = offset
        else:
          self.__position += 3

      elif opcode == 7:  # LESS-THAN
        a, label_of_a = self.__getParameter(1, param1_mode)
        b, label_of_b = self.__getParameter(2, param2_mode)
        assert param3_mode == 0
        pos_of_c = self.__memory[self.__position + 3]
        if self.__verbose:
          print('LESS-THAN', label_of_a, '<', label_of_b,
                '? ->', '@' + str(pos_of_c))
        if a < b:
          self.__memory[pos_of_c] = 1
        else:
          self.__memory[pos_of_c] = 0
        self.__position += 4

      elif opcode == 8:  # EQUAL
        a, label_of_a = self.__getParameter(1, param1_mode)
        b, label_of_b = self.__getParameter(2, param2_mode)
        assert param3_mode == 0
        pos_of_c = self.__memory[self.__position + 3]
        if self.__verbose:
          print('EQUAL', label_of_a, '==', label_of_b,
                '? ->', '@' + str(pos_of_c))
        if a == b:
          self.__memory[pos_of_c] = 1
        else:
          self.__memory[pos_of_c] = 0
        self.__position += 4

      elif opcode == 99:  # HALT
        self.__state = INTCODE_HALTED
        break

      else:
        self.__state = INTCODE_ERROR
        print('unknown',
              '@{}:{}'.format(self.__position, self.__memory[self.__position]))
        break


def exec(memory, verbose, inputs=[]):
  intcode = IntCode(memory)
  intcode.verbose(verbose)
  intcode.inputs(inputs)
  intcode.run()
  return intcode.outputs()
