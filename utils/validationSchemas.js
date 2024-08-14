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
    notEmpty: true,
    trim: true,
    isEmail: true,
    custom: {
      options: async (email) => {
        const inUse = await db.findByEmail(email);
        if (inUse) {
          throw new Error("User already exists!");
        }
      },
    },
  },
  password: {
    trim: true,
    isLength: {
        options: {
            min: 6,
            max: 20
        }
    },
    errorMessage: "password must contain between 6 and 20 characters."
  },
};
