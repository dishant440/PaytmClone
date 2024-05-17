const mongoose = require("mongoose");

const Connection = async () => {
  await mongoose
    .connect("mongodb+srv://dishant:dishant@cluster0.l75zfnv.mongodb.net/")
    .then(() => {
      console.log("connected to mongo database");
    })
    .catch((err) => console.log(err.message));
};

// Creating UserSchema

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});


// creating Account  schema

const AccountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    balance:{
        type:Number,
        required:true
    }
});


const User = mongoose.model('User',UserSchema);
const Account = mongoose.model('Account',AccountSchema)

module.exports = {
    Connection,
    User,
    Account
}