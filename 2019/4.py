import re
from lib import lines

start_end = re.compile(r'(\d+)-(\d+)')
start, end = [*map(int, start_end.search(lines[0]).groups())]


def test_password1(value):
  digits = str(value)
  double_found = False
  lastDigit = digits[0]
  for digit in digits[1:]:
    if digit == lastDigit:
      double_found = True
    elif digit < lastDigit:
      break
    lastDigit = digit
  else:
    return double_found
  return False


count = 0
for possible_password in range(start, end):
  if test_password1(possible_password):
    count = count + 1
print('Part 1 :', count)


def test_password2(value):
  digits = str(value)

  double_found = False
  group = ''

  def check_group():
    nonlocal double_found
    nonlocal group
    if not double_found:
      double_found = len(group) == 2
    group = ''

  lastDigit = digits[0]
  for digit in digits[1:]:
    if digit == lastDigit:
      if group == '':
        group = digit * 2
      else:
        group += digit
    elif digit < lastDigit:
      break
    else:
      check_group()
    lastDigit = digit
  else:
    check_group()
    return double_found
  return False

# print(112233, test_password2(112233), 'True')
# print(123444, test_password2(123444), 'False')
# print(111122, test_password2(111122), 'True')


count = 0
for possible_password in range(start, end):
  if test_password2(possible_password):
    count = count + 1
print('Part 2 :', count)
