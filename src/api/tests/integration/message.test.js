/* eslint-disable arrow-body-style */
/* eslint-disable  no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const app = require('../../../index');
const Message = require('../../models/message.model');

const sandbox = sinon.createSandbox();


describe('Chat bot API', () => {
  let userMsg1; let
    userMsg2;

  beforeEach(async () => {
    userMsg1 = {
      senderPsid: '2271660896277735',
      firstName: 'milad',
      birthday: '1992-05-02',
      confirmation: 'yes',
    };

    userMsg2 = {
      senderPsid: '2271660896277736',
      firstName: 'steve',
      birthday: '2000-11-25',
      confirmation: 'nope',
    };


    await Message.deleteMany({});
    [userMsg1, userMsg2] = await Promise.all([
      Message.create(userMsg1),
      Message.create(userMsg2),
    ]);
  });

  afterEach(() => sandbox.restore());

  describe('GET /v1/messages', () => {
    describe('list of messages', () => {
      it('should return array of messages ', () => {
        return request(app)
          .get('/v1/messages')
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('messages');
            expect(res.body.messages).to.be.an('array').that.is.not.empty;
            expect(res.body).to.have.a.property('total_count');
            expect(res.body).to.have.a.property('limit');
          });
      });

      it('should return array of messages limit to one message using pagination', () => {
        return request(app)
          .get('/v1/messages?limit=1')
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.have.a.property('messages');
            expect(res.body.messages).to.be.an('array').that.is.not.empty;
            expect(res.body.messages).to.have.lengthOf(1);
            expect(res.body.limit).to.equal(1);
          });
      });
    });

    describe('GET /v1/messages/:messageId', () => {
      it('should report error when the messageId provided is not valid', () => {
        return request(app)
          .get('/v1/messages/fakeId')
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            const { field } = res.body.errors[0];
            const { location } = res.body.errors[0];
            const { messages } = res.body.errors[0];
            expect(field[0]).to.be.equal('messageId');
            expect(location).to.be.equal('params');
            expect(messages[0]).to.include('fails to match the required pattern: /^[a-fA-F0-9]{24}$/');
          });
      });

      it('should report error "Message does not exist" when Message does not exists', () => {
        return request(app)
          .delete('/v1/messages/0d000000ed0d00000f00000f')
          .expect(httpStatus.NOT_FOUND)
          .then((res) => {
            expect(res.body.code).to.be.equal(404);
            expect(res.body.message).to.be.equal('Message not found');
          });
      });

      it('should get a single message', async () => {
        const { _id } = await Message.findOne({}).exec();
        return request(app)
          .get(`/v1/messages/${_id}`)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.a.property('_id');
          });
      });
    });

    describe('DELETE /v1/messages/:messageId', () => {
      it('should report error when the messageId provided is not valid', () => {
        return request(app)
          .delete('/v1/messages/fakeId')
          .expect(httpStatus.BAD_REQUEST)
          .then((res) => {
            const { field } = res.body.errors[0];
            const { location } = res.body.errors[0];
            const { messages } = res.body.errors[0];
            expect(field[0]).to.be.equal('messageId');
            expect(location).to.be.equal('params');
            expect(messages[0]).to.include('fails to match the required pattern: /^[a-fA-F0-9]{24}$/');
          });
      });

      it('should delete message', async () => {
        const { _id } = await Message.findOne({}).exec();
        return request(app)
          .delete(`/v1/messages/${_id}`)
          .expect(httpStatus.NO_CONTENT)
          .then(() => request(app).get('/v1/messages'))
          .then(async () => {
            const messages = await Message.find({});
            expect(messages).to.have.lengthOf(1);
          });
      });

      it('should report error "Message not found" when Message does not exists', () => {
        return request(app)
          .delete('/v1/messages/0d000000ed0d00000f00000f')
          .expect(httpStatus.NOT_FOUND)
          .then((res) => {
            expect(res.body.code).to.be.equal(404);
            expect(res.body.message).to.be.equal('Message not found');
          });
      });
    });
  });
});
