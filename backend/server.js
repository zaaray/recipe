import express from 'express';
import { connectDB } from './config/db.js';
import { parseRecipeFromUrl } from './parser.js'; 

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.post('/recipes/parse', async (req, res) => {
    const { url } = req.body;
    
    // Validate input
    if (!url) {
        return res.status(400).json({ 
            error: 'URL is required',
            message: 'Please provide a recipe URL to parse' 
        });
    }

    try {
        const recipe = await parseRecipeFromUrl(url);
        
        // Return the parsed recipe with success status
        res.status(200).json({
            success: true,
            recipe: recipe,
            message: 'Recipe parsed successfully'
        });
        
    } catch (error) {
        console.error('Recipe parsing error:', error.message);
        
        // Return specific error messages
        res.status(400).json({ 
            success: false,
            error: error.message,
            message: 'Failed to parse recipe from the provided URL'
        });
    }
})
