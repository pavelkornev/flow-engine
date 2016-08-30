import { isPlainObject } from './utils';

export const isValid = (rule) => {
  if (!isPlainObject(rule)) return false;

  const {
    id,
    body,
    true_id,
    false_id,
  } = rule;

  // Check required fields
  if (!id || typeof id !== 'number') return false;
  if (!body || typeof body !== 'string') return false;
  if ((true_id !== null && typeof true_id !== 'number') || true_id === id) return false; // eslint-disable-line camelcase
  if ((false_id !== null && typeof false_id !== 'number') || false_id === id) return false;  // eslint-disable-line camelcase

  // Check if `body` is valid function that returns boolean value
  let tester;
  try {
    tester = eval(`(${body})`); // eslint-disable-line no-eval
  } catch (e) {
    throw new Error(`Something went wrong while creating body function: ${e.message}`);
  }

  if (typeof tester !== 'function' || typeof tester({}) !== 'boolean') return false;

  return true;
};

export const createTester = (rule) => {
  if (!isValid(rule)) {
    throw new Error(`Attempt to use invalid rule: ${JSON.stringify(rule)}`);
  }

  return {
    ...rule,
    tester: eval(`(${rule.body})`), // eslint-disable-line no-eval
  };
};
