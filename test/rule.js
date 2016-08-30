import { expect } from 'chai';
import { isValid, createTester } from '../src/rule';

describe('Rule / isValid', () => {
  let rule;

  beforeEach(() => {
    rule = {
      id: 1,
      body: '(v) => !!v',
      true_id: 2,
      false_id: 3,
    };
  });

  it('should return false when passed argument is not an plain object', () => {
    expect(isValid(1)).to.be.false;
  });

  it('should return true on valid object', () => {
    expect(isValid(rule)).to.be.true;
  });

  // ID
  it('should return false when id is not set', () => {
    delete rule.id;
    expect(isValid(rule)).to.be.false;
  });

  it('should return false when id is not a number', () => {
    rule.id = rule.id.toString();
    expect(isValid(rule)).to.be.false;
  });

  // BODY
  it('should return false when body is not set', () => {
    delete rule.body;
    expect(isValid(rule)).to.be.false;
  });

  it('should return false when body is not a string', () => {
    rule.body = 1;
    expect(isValid(rule)).to.be.false;
  });

  it('should return false when body is not a function', () => {
    rule.body = 'new Number(1)';
    expect(isValid(rule)).to.be.false;
  });

  it('should return false when body function returns not a boolean datatype', () => {
    rule.body = '() => 1';
    expect(isValid(rule)).to.be.false;
  });

  it('should throw an Error if passed invalid javascript as body function', () => {
    rule.body = 'str';
    expect(
      isValid.bind(null, rule)
    ).to.throw('Something went wrong while creating body function');
  });

  // TRUE_ID
  it('should return false when true_id is not set', () => {
    delete rule.true_id;
    expect(isValid(rule)).to.be.false;
  });

  it('should return false when true_id is not a number', () => {
    rule.true_id = rule.true_id.toString();
    expect(isValid(rule)).to.be.false;
  });

  it('should return true when true_id is null', () => {
    rule.true_id = null;
    expect(isValid(rule)).to.be.true;
  });

  it('should return false when true_id is equal to id (cycle detection)', () => {
    rule.true_id = rule.id;
    expect(isValid(rule)).to.be.false;
  });

  // FALSE_ID
  it('should return false when false_id is not set', () => {
    delete rule.false_id;
    expect(isValid(rule)).to.be.false;
  });

  it('should return false when false_id is not a number', () => {
    rule.false_id = rule.false_id.toString();
    expect(isValid(rule)).to.be.false;
  });

  it('should return true when false_id is null', () => {
    rule.false_id = null;
    expect(isValid(rule)).to.be.true;
  });

  it('should return false when false_id is equal to id (cycle detection)', () => {
    rule.false_id = rule.id;
    expect(isValid(rule)).to.be.false;
  });
});

describe('Rule / createTester', () => {
  it('should throw an Error if invalid object passed', () => {
    expect(
      createTester.bind(null, {})
    ).to.throw('Attempt to use invalid rule');
  });

  it('should create property tester and return new Object with it', () => {
    const input = {
      id: 1,
      body: '(v) => !!v',
      true_id: 2,
      false_id: 3,
    };

    const output = createTester(input);

    expect(output).to.have.property('tester');
    expect(output.tester).to.be.a('function');

    // Passed object should not be mutated
    expect(input).to.not.equal(output);
  });
});
