def fuel_per_mass(x):
  return max(math.floor(x / 3) - 2, 0)


fuel_per_module = [*map(fuel_per_mass, numbers)]

fuel_for_all_modules = sum(fuel_per_module)
print('Part 1 :', fuel_for_all_modules)


def fuel_per_fuel(mass):
  if (mass == 0):
    return 0
  else:
    fuel = fuel_per_mass(mass)
    return fuel + fuel_per_fuel(fuel)


fuel_for_modules_fuel = [*map(fuel_per_fuel, fuel_per_module)]
print('Part 2 :', fuel_for_all_modules + sum(fuel_for_modules_fuel))
