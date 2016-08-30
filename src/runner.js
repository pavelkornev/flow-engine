import { logger, createHashTable } from './utils';
import * as rule from './rule';

/**
 * @typedef {Object} Rule
 * @property {Number} rule.id         Unique identifier of the rule
 * @property {String} [rule.title]    Title of the rule
 * @property {String} rule.body       Tester function as String primitive to be evaluated into real JS function
 * @property {Number} rule.true_id    ID of the rule to be executed if tester function return true
 * @property {Number} rule.false_id   ID of the rule to be executed if tester function return false
 */

/**
 * Runner helps to run tasks and responsible for preventing endless cycles.
 * @param {Array.<Rule>} rules        An array of rules
 * @param {Object} task               Task to be performed
 * @param {Number} nextRuleId         Initial ID of the rule to start with
 * @param {Function} [logger]         Custom logger function
 */
export default (rules = [], task, nextRuleId, log = logger) => {
  if (!Array.isArray(rules)) {
    throw new Error(`Expected <array> of rules, but <${(typeof rules)}> was passed.`);
  }

  const appliedRuleIds = [];

  rules = createHashTable('id', rules.map(v => rule.createTester(v)));

  log('info', `\nStarting task: ${JSON.stringify(task)}`);

  while (nextRuleId) {
    if (!(nextRuleId in rules)) {
      throw new Error(`Unknown RuleId => ${nextRuleId}`);
    }
    if (appliedRuleIds.indexOf(nextRuleId) !== -1) {
      log(
        'error',
        `\tCycle detected. Please check following sequence of rules: ${appliedRuleIds.join(', ')}. Stopped!`
      );

      throw new Error(`Cycle detected. Please check following sequence of rules: ${appliedRuleIds.join(', ')}`);
    }

    appliedRuleIds.push(nextRuleId);

    const {
      title,
      true_id,
      false_id,
      tester,
    } = rules[nextRuleId];

    const hasPassed = tester(task);

    log(
      hasPassed ? 'success' : 'warning',
      `\tRule "${title}" (id: ${nextRuleId}) has been ${hasPassed ? 'passed' : 'failed'}`
    );

    nextRuleId = hasPassed ? true_id : false_id; // eslint-disable-line camelcase
  }
};
