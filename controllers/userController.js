const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")

exports.signUp = async (req, res) => {
  try {
    let userModel = new UserModel();
    
    const userData = await UserModel.find({email: req.body.email});

    if(userData.length !==0){
      throw new Error("user already registered")
    }

    userModel.first_name = req.body.first_name
    userModel.last_name = req.body.last_name
    userModel.phone_no = req.body.phone_no
    userModel.role = req.body.role
    userModel.email = req.body.email

    
    const password = req.body.password
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function (err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    userModel.password = hashedPassword

    const insertedData = await userModel.save()
    if (insertedData) {
      return res.send({success:"yes",insertedData})
    } else {
      throw new Error("user not created")
    }
  } catch (error) {
    return res.status(400).send({ success:"no",message: error.message });
  }
};

exports.updateUsers = async (req, res) => {
  try {
    if (req.body.password) {
      const password = req.body.password
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
      req.body.password = hashedPassword
    }
    const updatedData = await UserModel.findOneAndUpdate(
      { _id: { $eq: req.body.user_id } },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    if (updatedData) {
      return res.send({success:"yes",updatedData})
    } else {
      throw new Error("user not updated")
    }
  } catch (error) {
    return res.status(400).send({success:"no", message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const allUserData = await UserModel.find({}).select("-password")
    if (allUserData) {
      res.status(201).json({
        success: "yes",
        message: "all user data",
        allUserData
      })
    }
  } catch (error) {
    res.status(500).send({
      success: "no",
      error,
      message: "Error to get all user data",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    if (!req.body.email) {
     throw "Please provide email"
      
    }
    if (!req.body.password) {
      throw "Please provide password"
    }


    const email = req.body.email;
    const password = req.body.password;

    // console.log("hhh",req.body)

    const userData = await UserModel.find({ email: email });

    if (userData.length !== 0) {
      const hash = userData[0]?.password
      const isValidPassword = await bcrypt.compare(password, hash)
      // console.log("78",isValidPassword)
      if (isValidPassword) {
        const user = userData[0]

        jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (error, token) => {
          if (error) {

            throw error.message

          }
          else {
            res.status(201).send({
              success: "yes",
              message: "user successfully sign in",
              token,
              user
            });
          }
        })
      }
      else {
        throw "Password not matched"
      }
    }
    else {
      throw "user not registered"
    }
  } catch (error) {
    res.status(500).send({
      success: "no",
      message: error,
    });
  }
};

exports.getToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ")
    const token = bearer[1]
    req.token = token
    next()
  } else {
    res.status(500).send({
      success: "no",
      message: "can't get token",
    })
  }
}

exports.verifyToken = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, authData) => {
    if (err) {
      res.status(500).send({
        success: "no",
        message: err.message,
      })
    } else {
      req.body.authData = authData;
      next()
    }
  })
}

exports.deleteUsers = async (req, res) => {
  try {
    const userId = req.body.user_id;
  
   
    const deletedData=await UserModel.findOneAndDelete(
     {_id:{$eq:userId}}
   )
    if (deletedData) {
      return res.send(deletedData)
    } else {
      throw new Error("user not deleted")
    }


  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

exports.verifyTokenWithoutNext = (req, res) => {
  jwt.verify(req.body.jwt_token, process.env.JWT_SECRET_KEY, (err, _) => {
    if (err) {
      res.status(301).send({
        success: "no",
        message: err.message,
      })
    } else {
      res.status(200).send({
        success: "yes",
        message: "token verified",
      })
    }
  })
}