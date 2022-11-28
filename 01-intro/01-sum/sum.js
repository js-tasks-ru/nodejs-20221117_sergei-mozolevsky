function sum(a, b) {
  const areArgsNumbers = typeof a === 'number' && typeof b === 'number';

  if (!areArgsNumbers) throw new TypeError(`Arguments ${a} and ${b} must be numbers`);

  return a + b;
}

module.exports = sum;
