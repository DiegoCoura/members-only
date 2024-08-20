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
    customSanitizer: {
      options: (fname) => {
        return fname.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
      },
    },
  },
  last_name: {
    trim: true,
    isLength: {
      options: {
        min: 3,
        max: 50,
      },
      errorMessage:
        "Last name must be at least 5 characters with a max of 50 characters",
    },
    customSanitizer: {
      options: (lname) => {
        return lname.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
      },
    },
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
    isStrongPassword: {
      options: {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
      errorMessage: "Password must have at least 8 characters, 1 Uppercase, 1 number and 1 symbol"
    },
  },
  confirm_password: {
    custom: {
      options: (confirm_pass, { req }) => {
        if (confirm_pass !== req.body.password) {
          throw new Error("Passwords does not match");
        } else {
          return true;
        }
      },
    },
  },
};
