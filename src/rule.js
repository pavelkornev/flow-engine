import { isPlainObject } from './utils';

/**
 * Check whatever Rule is valid
 * @param {Object} rule            Plain JavaScript Object with following properties:
 * @param {Number} rule.id         Unique identifier of the rule
 * @param {String} [rule.title]    Title of the rule
 * @param {String} rule.body       Tester function as String primitive to be evaluated into real JS function
 * @param {Number} rule.true_id    ID of the rule to be executed if tester function return true
 * @param {Number} rule.false_id   ID of the rule to be executed if tester function return false
 * @returns {boolean}
 */
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

/**
 * Creates tester function from `body` string
 * @param {Object} rule            Plain JavaScript Object with following properties:
 * @param {Number} rule.id         Unique identifier of the rule
 * @param {String} [rule.title]    Title of the rule
 * @param {String} rule.body       Tester function as String primitive to be evaluated into real JS function
 * @param {Number} rule.true_id    ID of the rule to be executed if tester function return true
 * @param {Number} rule.false_id   ID of the rule to be executed if tester function return false
 * @return {object}                Returns copy of object with additional property `tester` which is created JS function
 */
export const createTester = (rule) => {
  if (!isValid(rule)) {
    throw new Error(`Attempt to use invalid rule: ${JSON.stringify(rule)}`);
  }

  return {
    ...rule,
    tester: eval(`(${rule.body})`), // eslint-disable-line no-eval
  };
};
