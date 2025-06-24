import axios from 'axios';
import * as cheerio from 'cheerio';

// URL validation function
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

// Normalize image field - handle both string and object formats
const normalizeImage = (image) => {
    if (typeof image === 'string') {
        return image;
    }
    if (typeof image === 'object' && image !== null) {
        // Handle different image object formats
        if (image.url) return image.url;
        if (image.src) return image.src;
        if (image['@value']) return image['@value'];
        if (Array.isArray(image) && image.length > 0) {
            return normalizeImage(image[0]);
        }
    }
    return null;
};

// Normalize instructions - convert to plain string if needed
const normalizeInstructions = (instructions) => {
    if (typeof instructions === 'string') {
        return instructions;
    }
    if (Array.isArray(instructions)) {
        return instructions.map(instruction => {
            if (typeof instruction === 'string') {
                return instruction;
            }
            if (typeof instruction === 'object' && instruction !== null) {
                if (instruction.text) return instruction.text;
                if (instruction['@value']) return instruction['@value'];
                if (instruction.name) return instruction.name;
            }
            return '';
        }).filter(instruction => instruction.trim() !== '').join('\n');
    }
    return '';
};

// Normalize ingredients - ensure it's an array of strings
const normalizeIngredients = (ingredients) => {
    if (!ingredients) return [];
    
    if (Array.isArray(ingredients)) {
        return ingredients.map(ingredient => {
            if (typeof ingredient === 'string') {
                return ingredient;
            }
            if (typeof ingredient === 'object' && ingredient !== null) {
                if (ingredient.name) return ingredient.name;
                if (ingredient['@value']) return ingredient['@value'];
                if (ingredient.text) return ingredient.text;
            }
            return '';
        }).filter(ingredient => ingredient.trim() !== '');
    }
    
    return [];
};

// Normalize yield - convert to number if possible
const normalizeYield = (yieldValue) => {
    if (typeof yieldValue === 'number') {
        return yieldValue;
    }
    if (typeof yieldValue === 'string') {
        // Try to extract number from string like "4 servings" or "4"
        const match = yieldValue.match(/(\d+)/);
        if (match) {
            return parseInt(match[1], 10);
        }
    }
    return null;
};

export const parseRecipeFromUrl = async (url) => {
    // 1. Validate the URL
    if (!isValidUrl(url)) {
        throw new Error('Invalid URL provided');
    }

    try {
        // 2. Fetch HTML content
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        // 3. Load it into Cheerio
        const $ = cheerio.load(response.data);
        
        let recipeData = null;

        // 4. Loop through all <script type="application/ld+json"> blocks
        $('script[type="application/ld+json"]').each((index, element) => {
            try {
                // 5. Try parsing them as JSON
                const jsonData = JSON.parse($(element).html());
                
                // Handle both single objects and arrays
                const items = Array.isArray(jsonData) ? jsonData : [jsonData];
                
                // 6. Find the one with "@type": "Recipe"
                for (const item of items) {
                    if (item['@type'] === 'Recipe' || item['@type'] === 'https://schema.org/Recipe') {
                        recipeData = item;
                        break;
                    }
                }
                
                if (recipeData) return false; // Break the loop if found
            } catch (parseError) {
                // Continue to next script block if JSON parsing fails
                console.warn('Failed to parse JSON-LD block:', parseError.message);
            }
        });

        if (!recipeData) {
            throw new Error('No recipe data found in JSON-LD blocks');
        }

        // 7. Extract and normalize fields to match Mongoose Recipe schema
        const normalizedRecipe = {
            _url: url,
            title: recipeData.name || recipeData.headline || '',
            image: normalizeImage(recipeData.image),
            instructions: normalizeInstructions(recipeData.recipeInstructions),
            ingredients: normalizeIngredients(recipeData.recipeIngredient),
            yield: normalizeYield(recipeData.recipeYield || recipeData.yield)
        };

        // Validate required fields
        if (!normalizedRecipe.title) {
            throw new Error('Recipe title is required but not found');
        }
        if (!normalizedRecipe.instructions) {
            throw new Error('Recipe instructions are required but not found');
        }
        if (!normalizedRecipe.ingredients || normalizedRecipe.ingredients.length === 0) {
            throw new Error('Recipe ingredients are required but not found');
        }

        return normalizedRecipe;

    } catch (error) {
        if (error.message.includes('Invalid URL') || 
            error.message.includes('No recipe data found') ||
            error.message.includes('Recipe title is required') ||
            error.message.includes('Recipe instructions are required') ||
            error.message.includes('Recipe ingredients are required')) {
            throw error;
        }
        throw new Error(`Failed to parse recipe from URL: ${error.message}`);
    }
};