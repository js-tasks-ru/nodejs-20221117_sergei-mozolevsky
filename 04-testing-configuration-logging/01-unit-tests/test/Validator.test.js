const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('should validate string fields correctly', () => {
      let max = 20;
      let min = 10;
      let name = 'Lalala'

      const validator = new Validator({
        name: {
          type: 'string',
          min,
          max,
        },
      });

      let errors = validator.validate({ name });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too short, expect ${min}, got ${name.length}`);

      name = 'LalalaLalalaLalalaLalala'
      errors = validator.validate({ name });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too long, expect ${max}, got ${name.length}`);

      name = 'LalalaLalala'
      errors = validator.validate({ name });

      expect(errors).to.have.length(0);
    });

    it('should validate number fields correctly', () => {
      const max = 10;
      const min = 5;
      let age = 11;

      const validator = new Validator({
        age: {
          type: 'number',
          min,
          max,
        },
      });

      let errors = validator.validate({ age });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too big, expect ${max}, got ${age}`);

      age = 2;
      errors = validator.validate({ age });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too little, expect ${min}, got ${age}`);

      age = 6;
      errors = validator.validate({ age });

      expect(errors).to.have.length(0);
    })

    it('should return an error if value type does not correspond validation field type', () => {
      const type = 'string';
      const name = 15;

      const validator = new Validator({
        name: {
          type
        },
      });

      const errors = validator.validate({ name });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal(`expect ${type}, got ${typeof name}`);
    })

    it('should not return an error if validation rules were not passed', () => {
      const validator = new Validator({});

      const errors = validator.validate({ name: 'Max' });

      expect(errors).to.have.length(0);
    })

    it('should return an error due to an attempt to validate an unknown type', () => {
      const unSupportedType = 'boolean'

      const validator = new Validator({
        isReady: {
          type: unSupportedType,
          min: 2,
          max: 4
        },
      });

      const errors = validator.validate({ isReady: true });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('error').and.to.be.equal(`validation for field type ${unSupportedType} is not supported`);
    })

    it('should return an error if min validation rule was not set', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          max: 5
        },
      });

      const errors = validator.validate({ age: 10 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`expect min validation rule be provided`);
    })

    it('should return an error if max validation rule was not set', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 1
        },
      });

      const errors = validator.validate({ age: 10 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`expect max validation rule be provided`);
    })

    it('should apply validation rules from last field in case there are multiple fields with the same name and type', () => {
      const min = 20;
      const max = 30;
      let age = 50;

      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
        age: {
          type: 'number',
          min,
          max
        },
      });

      let errors = validator.validate({ age });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too big, expect ${max}, got ${age}`);

      age = 10;
      errors = validator.validate({ age });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal(`too little, expect ${min}, got ${age}`);
    })
  });
});
