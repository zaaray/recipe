import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    // fields and values 
    // think of attributes in RDBMS 
    // _url is a unique identifier for the recipe
    // will be used as a primary key in the database
    _url: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    image:{
        type: String,
    },
    instructions:{
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    yield: {
        type: Number,
    },
}, {
    // createdAt and updatedAt metadata fields - automatically tracked by DB
    timestamps: true,
});

/*
function model<any>(name: string, schema?: any, collection?: string, options?: 
*/
// defined a Recipe document object model using the recipeSchema
// Recipe is a constructor function that can be used to create new Recipe documents
const Recipe = mongoose.model('Recipe', recipeSchema)
// convention:takes singular capitalized name as string --> Mongoose will name the collection as 'recipes' 

export default Recipe;
