const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    username: {
      type: String,
      required: [true, "Please enter your name"],
    },
    hash_password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Your password must be longer than 6 characters"],
    },
    // phone: {
    //   type: Number,
    //   required: true,
    // },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /\d{3} \d{3} \d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "User phone number required"],
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

UserSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

UserSchema.methods = {
  authenticate: function (password) {
    //login time call hoga ye method whan se password pass hoga
    return bcrypt.compareSync(password, this.hash_password);
  },
};

module.exports = mongoose.model("User", UserSchema);
