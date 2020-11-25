import { Schema, Model, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../interfaces/user";
import ENV from "../utils/env";

interface UserDoc extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    email: {
      id: {
        type: String,
        unique: true // `phoneNumber` must be unique
      },
      verified: { type: Boolean, default: false }
    },
    fullname: String,
    username: {
      type: String,
      unique: true // `username` must be unique
    },
    phone: {
      number: {
        type: String,
        index: {
          unique: true,
          partialFilterExpression: { number: { $type: "string" } }
        }
      },
      verified: { type: Boolean, default: false }
    },
    password: String,
    bio: { type: String, default: "Hey There!" },
    dob: String,
    picture: String,
    active: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"] // 'location.type' must be 'Point'
      },
      name: String,
      coordinates: {
        type: [Number]
      }
    },
    professionalTitle: String
  },
  { timestamps: true }
);

UserSchema.index({ title: 1, email: 1, fullname: 1 }, { unique: true });
UserSchema.pre<UserDoc>("save", function(next) {
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(ENV.SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePasswords = async (candidatePassword, savedPassword) => {
  const isValid = await bcrypt.compare(candidatePassword, savedPassword);
  return isValid;
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

UserSchema.methods.isPasswordValid = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// Omit the password when returning a user
UserSchema.set("toJSON", {
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});
// Use Model generic from mongoose to create a model of User type.
const UserModel: Model<UserDoc> = model<UserDoc>("User", UserSchema);

export { UserModel };
