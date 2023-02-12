import schema from '../schema';
import { describe } from '@jest/globals';
import chai from 'chai';

chai.should();
describe('Test Static Schema Snapshot', () => {
  it('schema should contain User type', () => {
    chai.assert.isNotNull(schema.getType('User'));
    chai.assert.isDefined(schema.getType('User'));
  });

  it('schema should contain Bet type', () => {
    chai.assert.isNotNull(schema.getType('Bet'));
    chai.assert.isDefined(schema.getType('Bet'));
  });

  it('scheme should not contain unregistered types', () => {
    chai.assert.isUndefined(schema.getType('NotADefinedType'));
  });
});
