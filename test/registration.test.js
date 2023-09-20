const supertest = require('supertest');
const { expect } = require('chai');
const app = require('../server.js');  // Adjust the path to your server.js or app.js

describe('POST /users/register', () => {
    it('should register a new user and return 201 status', async () => {
        const response = await supertest(app)
            .post('/users/register')
            .send({
                username: 'testUser',
                email: 'test@example.com',
                password: 'password123'
            });
        
        expect(response.status).to.equal(201);
        expect(response.body.user.username).to.equal('testUser');
    });
});
