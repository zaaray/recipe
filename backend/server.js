import express from 'express';
import { connectDB } from './config/db.js';


const app = express();


// we want to connect to database as soon as server starts 
app.listen(3000,()=>{
    connectDB();
    console.log('Server is running on port http://localhost:3000 ');
})


// defining routes 
// get request with controller function (params: request, response)

app.get('/', (req,res)=>{
    res.send('The server is ready!!');

})

// RECIPE ROUTES 
app.post('/recipes/parse', (req,res)=>{
    const url = req.body.url;
    // right now this post request is sending a URL string of a recipe website 
    // I don't have any logic to parse the recipe from the website yet 
    // what is the best way to do this?
    // the recipe object cannot create a Recipe model object using the URL string


    const recipe = new Recipe(url);

    res.status(201).json(recipe);


})
