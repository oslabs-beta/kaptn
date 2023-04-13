// // v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
const mongoose = require('mongoose');
const myURI = 'mongodb+srv://osp5:9dm8OGGfECIJmZdQ@cluster.zboxzus.mongodb.net/test';

// UNCOMMENT THE LINE BELOW IF USING MONGO
const URI = process.env.MONGO_URI || myURI;

// mongoose.connect(URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: 'Task'
//   });

// UNCOMMENT THE LINE BELOW IF USING POSTGRESQL
// const URI = process.env.PG_URI || myURI;


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {type: String, required: true},
    email : {type: String, required: true},
    password : {type: String, required: true}
    // created_at: {type: String, required: true}
})

const Users = mongoose.model('users', userSchema);

module.exports = Users; // <-- export your model
