import express from 'express';
import { connectDB } from './config/db.js';


const app = express();


// want to connect to database as soon as server starts 
app.listen(3000,()=>{
    connectDB();
    console.log('Server is running on port http://localhost:3000 ');
})

// defining routes 
// get request with controller function (params: request, response)

// this will return undefined 
// (inaccessible unless we use dotenv which is a package that 
// loads environment variables from a .env file into process.env)
// dotenv is a dependency in package.json
//console.log(process.env.MONGO_URI);

app.get('/', (req,res)=>{
    res.send('The server is ready!!');

})
