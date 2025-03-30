const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const sinon = require('sinon');

const User = require('../models/User');

const { registerUser, loginUser, getProfile, updateUserProfile } = require('../controllers/authController');

const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('User Auth Function Test', () => {

    it('should create a new user successfully', async () => {
        // Mock request data


        const req = {
            body: {
                name: 'Test name',
                email: 'Test email',
                password: 'Test password',
                user_type: 'worker'
            }
        };

        const createdUser = { _id: new mongoose.Types.ObjectId(), ...req.body };

        const createStub = sinon.stub(User, 'create').resolves(createdUser);
        const findOneStub = sinon.stub(User, "findOne").resolves(null);
        const jwtStub = sinon.stub(jwt, "sign").returns("mocked_token");
        const bcryptStub = sinon.stub(bcrypt, "compare").resolves(true);
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await registerUser(req, res);

        expect(findOneStub.calledOnceWith({ email: req.body.email })).to.be.true;
        expect(createStub.calledOnceWith(sinon.match({ 
            name: req.body.name, 
            email: req.body.email, 
            user_type: req.body.user_type 
        }))).to.be.true;
        expect(createStub.calledOnceWith(req.body)).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(jwtStub.calledOnce).to.be.true;
        expect(res.json.calledWith(sinon.match.has("id"))).to.be.true;

        createStub.restore();
        findOneStub.restore();
        jwtStub.restore();
        bcryptStub.restore();
    })

    it('should return 500 if an error occurs in registerUser', async () => {
        const createStub = sinon.stub(User, 'create').throws(new Error('DB Error'));
        const findOneStub = sinon.stub(User, "findOne").resolves(null);
        const req = {
            body: {
                name: 'Test name',
                email: 'Test email',
                password: 'Test password',
                user_type: 'worker'
            }
        };
    
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    
        await registerUser(req, res);
    
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    
        createStub.restore();
        findOneStub.restore();
    });
    
    it('should return 400 if the email already exists', async () => {
        const req = {
            body: {
                email: 'test@email.com',
                password: 'TestPassword',
            }
        };

        
        const res = {
            json: sinon.spy(), 
            status: sinon.stub().returnsThis()
          };

        const findByIdStub = sinon.stub(User, 'findOne').resolves({email: req.body.email});

        await registerUser(req,res)

        expect(res.status.calledWith(400)).to.be.true;

        findByIdStub.restore();
    })

    it('should login the user successfully', async () => {
        const req = {
            body: {
                email: 'test@email.com',
                password: 'TestPassword',
            }
        };
    
        const hashedPassword = await bcrypt.hash("TestPassword", 10);
        const user = {
            _id: new mongoose.Types.ObjectId(),
            name: "Test User",
            email: "test@email.com",
            password: hashedPassword, // ✅ Use hashed password
            user_type: "worker",
        };
    
        const findOneStub = sinon.stub(User, "findOne").resolves(user);
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    
        await loginUser(req, res);
    
        expect(findOneStub.calledOnceWith({ email: req.body.email })).to.be.true;
        expect(res.status.calledWith(200)).to.be.true; 
        expect(res.json.calledWith(sinon.match.has("token"))).to.be.true;
    
        findOneStub.restore();
    });
    

    it('should return 401 if the email and password do not exist', async () => {
        const req = {
            body: {
                email: 'test@email.com',
                password: 'TestPassword',
            }
        };
        const hashedPassword = await bcrypt.hash("TestPassword12", 10);
        const existingUser = {
            _id: new mongoose.Types.ObjectId(),
            name: "Test User",
            email: "test@email.com",
            password: hashedPassword, 
            user_type: "worker",
        };
    
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
        };
    
        // Stub `findOne` to return a user without a password (or null)
        const findOneStub = sinon.stub(User, 'findOne').resolves(existingUser);
    
        // Stub bcrypt.compare to return false (password does not match)
        const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false);
    
        await loginUser(req, res);
    
        // Ensure status 401 is returned
        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWith(sinon.match({ message: 'Invalid email or password' }))).to.be.true;
    
        // Restore stubs
        findOneStub.restore();
        bcryptStub.restore();
    });
    
    it('should return 500 if an error occurs in loginUser', async () => {
        const req = {
            body: {
            
                email: 'Test email',
                password: 'Test password',
               
            }
        };
        const findOneStub = sinon.stub(User, "findOne").throws(new Error('DB Error'));;

    
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    
        await loginUser(req, res);
    
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    
        findOneStub.restore();
    });


    it('should get the profile of the user', async () => {
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: {
                id: userId
            },
        };
    
        const user = {
            _id: userId, 
            name: "Test User",
            email: "test@email.com",
            user_type: "worker",
        };
    
        const findByIdStub = sinon.stub(User, "findById").resolves(user);
    
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    
        await getProfile(req, res);
    
       
        expect(res.json.calledWith({
            id: user._id,  
            name: user.name,
            email: user.email,
            user_type: user.user_type
        })).to.be.true;
    
        expect(res.status.calledWith(200)).to.be.true;
    
        findByIdStub.restore();
    });
    
    it('should return 500 if error occurs in getProfile', async () => {
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: {
                id: userId
            },
        };
    
        const user = {
            _id: userId, 
            name: "Test User",
            email: "test@email.com",
            user_type: "worker",
        };
    
        const findByIdStub = sinon.stub(User, "findById").throws(new Error('DB Error'));
    
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
    
        await getProfile(req, res);
        expect(res.status.calledWith(500)).to.be.true;
        findByIdStub.restore()

    })

    it('should update user details successfully', async () => {
        const userId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash("TestPassword", 10);
        
        const existingUser = {
            _id: userId,
            name: "Test User",
            email: "test@gmail.com",
            password: hashedPassword,
            user_type: 'worker',
            save: sinon.stub().resolves({
                id: userId,
                name: "New name",  
                email: "new@gmail.com", 
                user_type: 'worker'
            })
        };
    
        const findByIdStub = sinon.stub(User, 'findById').resolves(existingUser);
    
        const req = {
            user: { id: userId },  
            body: {
                name: "New name",
            }
        };
    
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
    
        // Call the function under test
        await updateUserProfile(req, res);
    
        expect(existingUser.name).to.equal("New name");
    
        expect(res.status.called).to.be.false;
        expect(res.json.calledOnce).to.be.true;
     
    
        findByIdStub.restore();
    });

    it('should return 500 if error occirs', async () => {
        const userId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash("TestPassword", 10);
        
        const existingUser = {
            _id: userId,
            name: "Test User",
            email: "test@gmail.com",
            password: hashedPassword,
            user_type: 'worker',
            save: sinon.stub().resolves({
                id: userId,
                name: "New name",  
                email: "new@gmail.com", 
                user_type: 'worker'
            })
        };
    
        const findByIdStub = sinon.stub(User, 'findById').throws(new Error('DB Error'));
    
        const req = {
            user: { id: userId },  
            body: {
                name: "New name",
                password: "new Password"
            }
        };
    
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };
    
        // Call the function under test
        await updateUserProfile(req, res);
    
        expect(res.status.calledWith(500)).to.be.true;
    
        findByIdStub.restore();
    });
    
})