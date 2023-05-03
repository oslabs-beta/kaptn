// // v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const myURI: string = 'mongodb+srv://osp5:9dm8OGGfECIJmZdQ@cluster.zboxzus.mongodb.net/test';

const URI: string = process.env.MONGO_URI || myURI;

// mongoose.connect(URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: 'Task'
//   });


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {type: String, required: true},
    email : {type: String, required: true},
    password : {type: String, required: true}
    // created_at: {type: String, required: true}
})

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, function (err: Error, salt: string) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash: string) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  });

const Users = mongoose.model('users', userSchema);

export default Users;