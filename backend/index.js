const express = require('express')
const app = express();
const port = 3000;
const zod = require('zod');
const cors = require('cors')

const {User} = require('./db')

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

app.use(express.json());
app.use(cors());

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/signup',async (req,res)=>{
    const { success } = signupBody.safeParse(req.body)
    console.log(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

app.post('/signin',async(req,res)=>{
    const { success } = signinBody.safeParse(req.body)
    // console.log(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})