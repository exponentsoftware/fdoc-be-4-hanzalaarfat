const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const Todo = require("../Models/Todo");

exports.GetSignup = async (req, res) => {
  res.render("register");
};
exports.GetLogin = async (req, res) => {
  res.render("login");
};

exports.signup = async (req, res) => {
  const { username, email, password, phone, role = "admin" } = req.body;
  if (!username || !email || !password || !phone) {
    return res.status(422).json({ err: "plz filled properly" });
  }

  ///////////////////////////////// async await or  /////////
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      console.log(userExist);
      return res.status(422).json({ error: "Email alreday Exist" });
    }
    const user = new User({
      username,
      email,
      password,
      phone,
      role,
    });
    /// pre save password hashing in user schema
    const userRegister = await user.save();
    if (userRegister) {
      res.status(201).json({ message: "User resgister successfuly" });
    } else {
      res.status(500).json({ error: "Faild to register" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Incoreet Email addresh", err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ err: "plz fill data properly" });
  }
  console.log(email, password);
  User.findOne({ email: email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({ err });
    }
    if (user) {
      ///////////////////////////// check user admin   /////////////////////////////////////////
      if (user.role == "admin") {
        if (user.authenticate(password)) {
          const token = jwt.sign(
            { _id: user._id }, /// all data
            process.env.SECRET_KEY_ADMIN,
            {
              expiresIn: "24h",
            }
          );
          const { _id, email, name } = user;
          res.status(200).json({ token, _id, email, name, user });
        } else {
          return res.status.json({
            message: "incoreet usr or email",
          });
        }
      } else {
        return res
          .status(400)
          .send({ message: "You are Not admin login denied this route" });
      }
    } else {
      return res.status(400).send({ message: "email or password wrong" });
    }
  });
};

exports.getalltodoByAdmin = async (req, res) => {
  try {
    //////////////////////// Get all Todo //////////////////////////////
    ///////////////// sorting Todo by createdAt //////////////////////////////
    let key = [];
    for (let k in req.query) {
      key.push(k);
    }
    if (key.length == 0) {
      console.log("should have no query string");
      const todo = await Todo.find().sort({ createdAt: -1 });

      ///////////////// chcke todo  data found or Not//////////////////////////////
      if (todo.length == 0) {
        res.status(404).json({
          success: false,
          message: `Not Found any Todo Data`,
          todo,
        });
      } else {
        res.status(200).json({ success: true, message: "All Todo", todo });
      }
    } else {
      let firstKey = key[0];

      if (key.length == 1) {
        // console.log(req.query[firstKey]);
        firstKey == "true" ? (firstKey = true) : "";
        req.query[key][0] == "false" ? (req.query[key][0] = false) : "";

        ///////////////// if it has query then fillter by given key//////////////////////////////
        ///////////////// // route ex http://localhost:3000/todo/?status=true   ////////////////////
        ///////////////// // req.query = example {key : value}   ////////////////////

        const response = await Todo.find(req.query).sort({
          createdAt: -1,
        });

        ///////////////// chcke filterd data found or Not//////////////////////////////
        if (response.length <= 0) {
          res.status(404).json({
            success: false,
            message: `Not Found ${key} of Todo`,
            todo: response,
          });
        }
        ///////////////// Filterd data resposed//////////////////////////////
        res.status(200).json({
          success: true,
          message: `All ${key} of Todo`,
          todo: response,
        });
      } else {
        ///////////////// respose all todo whithout filtering route (/)//////////////////////////////
        res.status(400).json({ success: false, message: "Add only One key" });
      }
    }
  } catch (err) {
    // console.log(err);
    res.status(404).json({ success: false, message: "data not found", err });
  }
};
