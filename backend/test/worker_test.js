const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Work = require('../models/Work');
const { applyWork } = require('../controllers/workController');

describe('Worker API testing', function () {


    it('should apply for the work', async function () {

        const user_id = new mongoose.Types.ObjectId()
        const existingWorkData = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Work 1',
            description: 'This is a short description',
            budget: 1,
            category: new mongoose.Types.ObjectId(),
            user_id: new mongoose.Types.ObjectId(),
            applied_users: [] // No one has applied yet
        };

        const existingWork = new Work(existingWorkData);

        const req = {
            user: { _id: user_id, user_type: 'worker' },
            body: {
                work_id: existingWork._id,
                message: 'This is a new test message',
                amount: 12
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const findByIdStub = sinon.stub(Work, 'findById').resolves(existingWork);

        const saveStub = sinon.stub(existingWork, 'save').resolves(existingWork);

        // Call the applyWork function
        await applyWork(req, res);

        // Check if the status 200 was called
        expect(res.status.calledWith(200)).to.be.true;

        // Check if the applied user's data was pushed into the applied_users array
        expect(existingWork.applied_users).to.have.lengthOf(1);

        expect(existingWork.applied_users[0].user_id.toString()).to.equal(user_id.toString());
        expect(existingWork.applied_users[0].message).to.equal('This is a new test message');
        expect(existingWork.applied_users[0].amount).to.equal(12);

        // Ensure the save method was called
        expect(saveStub.calledOnce).to.be.true;

        // Restore the stubs
        findByIdStub.restore();
        saveStub.restore();
    });

    it('should prevent client from applying to job', async function () {
        const existingWorkData = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Work 1',
            description: 'This is a short description',
            budget: 1,
            category: new mongoose.Types.ObjectId(),
            user_id: new mongoose.Types.ObjectId(),
            applied_users: [] // No one has applied yet
        };

        const existingWork = new Work(existingWorkData);

        const req = {
            user: { _id: new mongoose.Types.ObjectId(), user_type: 'client' },
            body: {
                work_id: existingWork._id,
                message: 'This is a new test message',
                amount: 12
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const findByIdStub = sinon.stub(Work, 'findById').resolves(existingWork);


        // Call the applyWork function
        await applyWork(req, res);

        // Check if the status 400 was called
        expect(res.status.calledWith(400)).to.be.true;

        findByIdStub.restore();
    });

    it('should prevent worker  applying morethan one to a work', async function () {
        const existingWorkData = {
            _id: new mongoose.Types.ObjectId(),
            title: 'Work 1',
            description: 'This is a short description',
            budget: 1,
            category: new mongoose.Types.ObjectId(),
            user_id: new mongoose.Types.ObjectId(),
            applied_users: [] // No one has applied yet
        };

        const existingWork = new Work(existingWorkData);

        const req = {
            user: { _id: new mongoose.Types.ObjectId(), user_type: 'worker' },
            body: {
                work_id: existingWork._id,
                message: 'This is a new test message',
                amount: 12
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const findByIdStub = sinon.stub(Work, 'findById').resolves(existingWork);
        const saveStub = sinon.stub(existingWork, 'save').resolves(existingWork);


        // Call the applyWork function
        await applyWork(req, res);
        expect(res.status.calledWith(200)).to.be.true;
        await applyWork(req, res);


        // Check if the status 400 was called
        expect(res.status.calledWith(400)).to.be.true;

        findByIdStub.restore();
        saveStub.restore();
    });

    it('should return a 500 error if there is a server error', async () => {


        const req = {
            user: { _id: new mongoose.Types.ObjectId(), user_type: 'worker' },
            body: {
                work_id:  new mongoose.Types.ObjectId(),
                message: 'This is a new test message',
                amount: 12
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        const findByIdStub = sinon.stub(Work, 'findById').throws(new Error('Database error'))

        await applyWork(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({ message: 'Database error' })).to.be.true;
        findByIdStub.restore()

    });


});
