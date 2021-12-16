from lib import lines

VERTICAL = 0
HORIZONTAL = 1

VERBOSE = False


class Vector:
  def __init__(self, x, y, steps, fragment):
    direction = fragment[0]
    length = int(fragment[1:])
    self.steps = steps
    self.length = length

    if direction == 'U':
      self.type = VERTICAL
      self.x = x
      self.y0 = y
      self.y1 = y + length
      self.ye = self.y1

    elif direction == 'D':
      self.type = VERTICAL
      self.x = x
      self.y0 = y - length
      self.y1 = y
      self.ye = self.y0

    elif direction == 'L':
      self.type = HORIZONTAL
      self.y = y
      self.x0 = x - length
      self.x1 = x
      self.xe = self.x0

    else:  # assuming R
      self.type = HORIZONTAL
      self.y = y
      self.x0 = x
      self.x1 = x + length
      self.xe = self.x1

  def end(self):
    if self.type == HORIZONTAL:
      return (self.xe, self.y, self.steps + self.length)
    return (self.x, self.ye, self.steps + self.length)

  def offset(self, x, y):
    if self.type == HORIZONTAL:
      return self.length - abs(x - self.xe)
    return self.length - abs(y - self.ye)

  def __and__(self, other):
    if self.type == other.type:
      return None
    if self.type == VERTICAL:
      x = self.x
      y = other.y
      if (self.y0 <= y <= self.y1) and (other.x0 <= x <= other.x1):
        return (x, y, self.steps + self.offset(x, y)
                + other.steps + other.offset(x, y))
    else:
      x = other.x
      y = self.y
      if (other.y0 <= y <= other.y1) and (self.x0 <= x <= self.x1):
        return (x, y, self.steps + self.offset(x, y)
                + other.steps + other.offset(x, y))
    return None

  def __str__(self):
    if self.type == HORIZONTAL:
      return '@{}({},{})->({},{})'.format(
              self.steps,
              self.x0,
              self.y,
              self.x1,
              self.y
             )
    return '@{}({},{})->({},{})'.format(
            self.steps,
            self.x,
            self.y0,
            self.x,
            self.y1
           )


class Wire:
  def __init__(self, description):
    self.vectors = []
    x, y, steps = (0, 0, 0)
    for fragment in description.split(','):
      vector = Vector(x, y, steps, fragment)
      if VERBOSE:
        print(str(vector))
      x, y, steps = vector.end()
      self.vectors = [*self.vectors, vector]

  def __intersect(self, vertical, horizontal):
    intersections = []
    for vertical_vector in vertical:
      for horizontal_vector in horizontal:
        intersect = vertical_vector & horizontal_vector
        if VERBOSE:
          print(
           str(vertical_vector),
           '&',
           str(horizontal_vector),
           '=',
           intersect
          )
        if intersect is not None:
          intersections = [*intersections, intersect]
    return [*filter(lambda i: i[0] != 0 and i[0] != 0, intersections)]

  def __and__(self, other):
    return [
     *self.__intersect(
      [*filter(lambda t: t.type == VERTICAL, self.vectors)],
      [*filter(lambda t: t.type == HORIZONTAL, other.vectors)]
     ),
     *self.__intersect(
      [*filter(lambda t: t.type == VERTICAL, other.vectors)],
      [*filter(lambda t: t.type == HORIZONTAL, self.vectors)]
     ),
    ]


intersections = Wire(lines[0]) & Wire(lines[1])

distances = [abs(x) + abs(y) for x, y, steps in intersections]
distances.sort()
print('Part 1 :', distances[0])

steps = [steps for x, y, steps in intersections]
steps.sort()
print('Part 2 :', steps[0])
