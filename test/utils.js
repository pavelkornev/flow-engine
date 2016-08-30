import { expect } from 'chai';
import { spy } from 'sinon';
import { createHashTable, isPlainObject, logger } from '../src/utils';


describe('Utils createHashTable ', () => {
  it('should throw error if no key was found in passed object', () => {
    const input = [{}];
    expect(
      createHashTable.bind(null, 'id', input)
    ).to.throw(`Key "id" is not specified in object => ${JSON.stringify(input[0])}`);
  });

  it('should throw error if key duplication was found in passed object', () => {
    expect(
      createHashTable.bind(
        null,
        'id',
        [{
          id: 1,
        }, {
          id: 1,
        }]
      )
    ).to.throw('Key duplication detected for key = "id" and value = "1". Please, check passed objects carefully.');
  });

  it('should return hash table with selected keys', () => {
    expect(
      createHashTable(
        'id',
        [{
          id: 1,
        }, {
          id: 2,
        }]
      )
    ).to.deep.equal({
      1: { id: 1 },
      2: { id: 2 },
    });
  });
});


describe('Utils isPlainObject ', () => {
  it('should recognize object literal', () => {
    expect(isPlainObject({})).to.be.true;
  });

  it('should recognize `new Object` constructor', () => {
    expect(isPlainObject(new Object())).to.be.true; // eslint-disable-line no-new-object
  });

  it('should recognize `Object.create()`', () => {
    expect(isPlainObject(Object.create({}))).to.be.true;
  });

  it('should fail on null', () => {
    expect(isPlainObject(null)).to.be.false;
  });

  it('should fail on undefined', () => {
    expect(isPlainObject(undefined)).to.be.false;
  });

  it('should fail on array literal', () => {
    expect(isPlainObject([])).to.be.false;
  });

  it('should fail on function', () => {
    expect(isPlainObject(() => {})).to.be.false;
  });

  it('should fail on arrow function', () => {
    expect(isPlainObject(() => {})).to.be.false;
  });

  it('should fail on primitive number', () => {
    expect(isPlainObject(1)).to.be.false;
  });

  it('should fail on primitive string', () => {
    expect(isPlainObject('s')).to.be.false;
  });

  it('should fail on primitive boolean', () => {
    expect(isPlainObject(true)).to.be.false;
  });
});

describe('Utils logger', () => {
  beforeEach(() => {
    // We could use 'stub' to avoid printing text in stdout but in this case
    // Mocha will have no change to print testing results. That said, 'spy'
    // should considered in this situation as trade off.
    spy(process.stdout, 'write');
  });

  afterEach(() => {
    process.stdout.write.restore();
  });

  it('should print to stdout with white color', () => {
    logger('info', 'Test Message');
    expect(process.stdout.write.calledWithExactly(`\x1b[97mTest Message\n\x1b[0m`)).to.be.true;
  });
});
