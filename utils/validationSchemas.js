const db = require("../db/queries");

exports.signUpValidationSchema = {
  first_name: {
    trim: true,
    isLength: {
      options: {
        min: 3,
        max: 50,
      },
      errorMessage:
        "First name must be at least 5 characters with a max of 50 characters",
    },
  },
  last_name: {
    trim: true,
    isLength: {
      options: {
        min: 3,
        max: 50,
      },
    },
    errorMessage:
      "Last name must be at least 5 characters with a max of 50 characters",
  },
  username: {
    notEmpty: {
      errorMessage: "An email must be provided",
    },
    trim: true,
    isEmail: {
      errorMessage: "Invalid email",
    },
    custom: {
      options: async (email) => {
        const inUse = await db.findByEmail(email);
        if (inUse) {
          throw new Error("User already exists!");
        } else {
          return true;
        }
      },
    },
  },
  password: {
    trim: true,
    isLength: {
      options: {
        min: 6,
        max: 20,
      },
    },
    errorMessage: "password must contain between 6 and 20 characters.",
  },
  confirm_password: {
    custom: {
      options: (confirm_pass, { req }) => {
        if(confirm_pass !== req.body.password){
          throw new Error("Passwords does not match")
        } else {
          return true;
        }
      }
    }
  }
};
