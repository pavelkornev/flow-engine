import { expect } from 'chai';
import { spy } from 'sinon';
import runner from '../src/runner';


describe('Runner', () => {
  it('should throw an Error if first argument is not array of rules', () => {
    expect(runner.bind(null, 1)).to.throw('Expected <array> of rules');
  });

  it('should call logger to log operations', () => {
    const logger = spy();

    runner([
      {
        id: 1,
        body: 'v => !!v',
        true_id: 2,
        false_id: null,
      }, {
        id: 2,
        body: 'v => !!v',
        true_id: null,
        false_id: null,
      },
    ], {}, 1, logger);

    expect(logger.callCount).to.equal(3);
  });

  it('should throw an Error when cycle detected', () => {
    expect(
      runner.bind(null, [
        {
          id: 1,
          body: 'v => !!v',
          true_id: 2,
          false_id: null,
        }, {
          id: 2,
          body: 'v => !!v',
          true_id: 1,
          false_id: null,
        },
      ], {}, 1, () => {})
    ).to.throw('Cycle detected');
  });

  it('should throw an Error when unknown rule asked to be applied', () => {
    expect(
      runner.bind(null, [
        {
          id: 1,
          body: 'v => !!v',
          true_id: 2,
          false_id: null,
        }, {
          id: 2,
          body: 'v => !!v',
          true_id: 3,
          false_id: 4,
        },
      ], {}, 1, () => {})
    ).to.throw('Unknown RuleId');
  });
});
