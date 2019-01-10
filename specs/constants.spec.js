var expect = require('chai').expect;
var constants = require('../app/shared/constants');

describe('test constatns', function() {
    it('should test something', function() {
        expect(constants.DB_PROPS.HOST).to.be.equal('localhostss');
    });
});
