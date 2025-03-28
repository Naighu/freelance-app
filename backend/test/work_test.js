const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const sinon = require('sinon');


const { postWork } = require('../controllers/workController');
const Work = require('../models/Work');
const Category = require('../models/Category');

const { expect } = chai;

chai.use(chaiHttp);

describe('Client Function Test', () => {
    it('should create a new work successfully', async () => {
        const category_id = new mongoose.Types.ObjectId();
        const user_id = new mongoose.Types.ObjectId();

        const category = {
            _id: category_id,
            name: 'Test'
        };

        const req = {
            user: { id: user_id },
            body: { title: "New work", description: "Test work description", budget: 100, category_id: category_id }
        };

        const createdWork = {
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            category: category.name, 
            user_id: user_id 
        };


        const findCategoryStub = sinon.stub(Category, 'findById').resolves(category);
        const createStub = sinon.stub(Work, 'create').resolves(createdWork);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await postWork(req, res);

        expect(findCategoryStub.calledOnceWith(category_id)).to.be.true;
        expect(createStub.calledOnceWith({
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            category: category.name, 
            user_id: req.user.id
        })).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdWork)).to.be.true;

        findCategoryStub.restore();
        createStub.restore();
    });

    it('should return 400 if the category doesn\'t exist', async () => {
        const category_id = new mongoose.Types.ObjectId();
        const user_id = new mongoose.Types.ObjectId();

        const req = {
            user: { id: user_id },
            body: { title: "New work", description: "Test work description", budget: 100, category_id: category_id }
        };

        
        const findCategoryStub = sinon.stub(Category, 'findById').resolves(null);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await postWork(req, res);

        expect(findCategoryStub.calledOnceWith(category_id)).to.be.true;
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Category does not exists' })).to.be.true;

        findCategoryStub.restore();
    });

    it('should return 500 for any errors', async () => {
        const category_id = new mongoose.Types.ObjectId();
        const user_id = new mongoose.Types.ObjectId();
        const category = {
            _id: category_id,
            name: 'Test'
        };


        const req = {
            user: { id: user_id },
            body: { title: "New work", description: "Test work description", budget: 100, category_id: category_id }
        };
        const createdWork = {
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description,
            budget: req.body.budget,
            category: category.name, 
            user_id: user_id 
        };
    
        const findCategoryStub = sinon.stub(Category, 'findById').resolves(category);
        const createStub = sinon.stub(Work, 'create').resolves(createdWork).throws(new Error('DB Error'));
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await postWork(req, res);

        expect(findCategoryStub.calledOnceWith(category_id)).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        findCategoryStub.restore();
    });

})