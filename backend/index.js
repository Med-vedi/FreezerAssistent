require('dotenv').config();

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'freezer'
});

const User = require('./models/user.model');
const UserData = require('./models/userData.model');
const Box = require('./models/boxes.model');
const Product = require('./models/products.model');
const Shelf = require('./models/shelves.model');
const Category = require('./models/categories.model');

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utils');

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://freezer-assist.netlify.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// app.listen(8000)

//USERS
//Create user
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({
        name,
        email,
        password,
        id: uuidv4(),
        isReady: false
    });
    await user.save();
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3600s' });
    res.json({
        error: false,
        message: 'User created successfully',
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isReady: user.isReady
        }
    });
});

//Login user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (userInfo.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (userInfo.email === email && userInfo.password === password) {
        const accessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '36000m' });
        const refreshToken = jwt.sign({ user: userInfo }, process.env.REFRESH_TOKEN_SECRET);
        return res.json({
            error: false,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                isReady: userInfo.isReady
            }
        });

    } else {
        return res.status(401).json({
            error: true,
            message: 'Invalid credentials'
        });
    }
});

//logout user
app.post('/logout', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
    user.tokens = [];
    user.accessToken = null;
    user.refreshToken = null;
    localStorage.removeItem('token');
    await user.save();
    res.json({ message: 'Logout successful' });
});

//Get all users
// app.get('/users', async (req, res) => {
//     const users = await User.find();
//     res.json(users);
// });

//Get user
app.get('/get-user', authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const userData = await User.findOne({ email: user.email });
        if (!userData) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.json({
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                isReady: userData.isReady
            },
            message: 'User fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

//user is ready
app.post('/user-ready', authenticateToken, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isReady = true;
        await user.save();
        res.json({
            message: 'User is ready', user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isReady: user.isReady
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

//Get user by id
app.get('/users/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

//Update user
app.put('/users/:id', authenticateToken, async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, password }, { new: true });
    res.json(user);
});

//USER DATA

//get user data by user_id
app.get('/user-data', authenticateToken, async (req, res) => {
    const { user_id } = req.query;
    const userData = await UserData.findOne({ user_id });
    res.json(userData);
});

//Create user data
app.post('/user-data', authenticateToken, async (req, res) => {
    const { user_id } = req.body;
    const userData = await UserData.create({ user_id, products: [] });
    res.json(userData);
});
//Put user products
app.put('/user-data/products', authenticateToken, async (req, res) => {
    const { user_id, products } = req.body;
    const userData = await UserData.findOneAndUpdate({ user_id }, { products }, { new: true });
    res.json(userData);
});

//force import product to user data
app.post('/user-data/products/import', authenticateToken, async (req, res) => {
    try {
        const { user_id } = req.body;

        // Get all products from db
        const products = await Product.find();

        // Find or create user data
        let userData = await UserData.findOne({ user_id });
        if (!userData) {
            userData = new UserData({ user_id, products: [], products_all: [] }); // Create if not found
        }

        // Update products_all array
        userData.products_all = products;
        await userData.save();
        res.json(userData);
    } catch (error) {
        console.error('Error importing products:', error);
        res.status(500).json({ message: 'Error importing products to user data' });
    }
});

//Get user data
app.get('/user-data', authenticateToken, async (req, res) => {
    const { user_id } = req.query;
    const userData = await UserData.findOne({ user_id });
    res.json(userData);
});

//Update user data by id
//TODO
app.put('/user-data/:id', authenticateToken, async (req, res) => {
    const { user_id, products } = req.body;
    const userData = await UserData.findByIdAndUpdate(req.params.id, { user_id, products }, { new: true });
    res.json(userData);
});

//BOXES
//Create box
app.post('/boxes/user', authenticateToken, async (req, res) => {
    const { boxes } = req.body;

    if (!boxes || !Array.isArray(boxes) || boxes.length < 1) {
        return res.status(400).json({ message: 'Valid boxes array is required' });
    }

    try {
        // Create boxes first
        const savedBoxes = await Box.insertMany(boxes);

        // Create shelves for each box
        const shelvesToCreate = boxes.flatMap(box =>
            box.shelves_ids.map((shelfId, index) => ({
                id: shelfId,
                level: String(index),
                box_id: box.id,
                products: []
            }))
        );

        // Create all shelves
        await Shelf.insertMany(shelvesToCreate);
        res.json(savedBoxes);
    } catch (error) {
        console.error('Error creating boxes:', error);
        res.status(500).json({ message: 'Error creating boxes', error: error.message });
    }
});

//Get boxes list by user_id
app.get('/boxes/user', authenticateToken, async (req, res) => {
    if (!req.query.user_id) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const { user_id } = req.query;
        const query = {};

        if (user_id) {
            query.user_id = user_id;
        }

        const boxes = await Box.find(query);
        res.json(boxes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching boxes', error: error.message });
    }
});

//update boxes list
app.patch('/boxes/user/:id', authenticateToken, async (req, res) => {
    try {
        const box = await Box.findOneAndUpdate(
            { id: req.params.id },
            {
                title: req.body.title,
                shelves_ids: req.body.shelves_ids
            },
            { new: true });
        res.json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error updating box', error: error.message });
    }
});

// Delete box and its related data
app.delete('/boxes/user/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.query;

        // Find the box first to get shelf IDs
        const box = await Box.findOne({ user_id, id });
        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Delete all shelves associated with this box
        if (box.shelves_ids && box.shelves_ids.length > 0) {
            // Find all shelves to get their product IDs
            const shelves = await Shelf.find({ id: { $in: box.shelves_ids } });

            // Remove product references from shelves
            for (const shelf of shelves) {
                if (shelf.products && shelf.products.length > 0) {
                    await Product.updateMany(
                        { id: { $in: shelf.products } },
                        { $unset: { shelf_id: "", box_id: "" } }
                    );
                }
            }

            // Delete all shelves
            await Shelf.deleteMany({ id: { $in: box.shelves_ids } });
        }

        // Finally delete the box
        await Box.findOneAndDelete({ user_id, id });

        res.json({ message: 'Box and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting box:', error);
        res.status(500).json({ message: 'Error deleting box', error: error.message });
    }
});

//PRODUCTS
//Create product
app.post('/products', authenticateToken, async (req, res) => {
    try {
        const productId = uuidv4();
        const product = {
            id: productId,
            user_id: req.user.user.id,
            category_id: req.body?.category_id || 0,
            emoji: req.body?.emoji || '❄️',
            name: req.body.name,
        };

        // Find and update userData directly
        const userData = await UserData.findOne({ user_id: req.user.user.id });
        if (!userData) {
            return res.status(404).json({ message: 'User data not found' });
        }

        userData.products_all.push(product);
        await userData.save();

        res.json(product);
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
});
//add product to shelf
app.post('/products/shelf', authenticateToken, async (req, res) => {
    try {
        const product = req.body;
        console.log('Received product:', product);

        // Find the target shelf directly
        const targetShelf = await Shelf.findOne({
            id: product.shelf_id,
            box_id: product.box_id
        });
        console.log('Found target shelf:', targetShelf);

        if (!targetShelf) {
            console.log('No shelf found with id:', product.shelf_id);
            return res.status(404).json({
                message: `Shelf ${product.shelf_id} not found`,
                searchCriteria: { id: product.shelf_id, box_id: product.box_id }
            });
        }

        // Add product to the correct shelf
        targetShelf.products.push(product);
        const savedShelf = await targetShelf.save();
        console.log('Saved shelf:', savedShelf);

        // Return all updated shelves
        const updatedShelves = await Shelf.find({ box_id: product.box_id }).lean();
        console.log('Returning shelves:', updatedShelves);

        res.json(updatedShelves);

    } catch (error) {
        console.error('Error in /products/shelf:', error);
        res.status(500).json({
            message: 'Error adding product to shelf',
            error: error.message
        });
    }
});

//Get products
app.get('/products', authenticateToken, async (req, res) => {
    try {
        const { name, category_id } = req.query;
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (category_id) {
            query.category_id = category_id;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

//delete product from shelf
app.delete('/products/:productId/shelf/:shelfId', authenticateToken, async (req, res) => {
    const { productId, shelfId } = req.params;
    try {
        console.log('Deleting product:', { productId, shelfId });

        const shelf = await Shelf.findOne({ id: shelfId });
        if (!shelf) {
            return res.status(404).json({ message: 'Shelf not found' });
        }

        // Filter out the product from the products array
        shelf.products = shelf.products.filter(product => product.id !== productId);

        // Save the updated shelf
        const updatedShelf = await shelf.save();

        // Return all shelves for the box to update UI
        const allShelves = await Shelf.find({ box_id: shelf.box_id });

        res.json(allShelves);
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error removing product from shelf', error: error.message });
    }
});

//SHELVES
//Create shelf
app.post('/shelves', authenticateToken, async (req, res) => {
    const shelfId = uuidv4();
    const shelf = {
        id: shelfId,
        box_id: req.body.box_id,
        products: req.body.products || [],
        level: req.body.level || '0'
    };

    try {
        // Check if a shelf with the same level exists in this box
        const existingShelf = await Shelf.findOne({
            box_id: req.body.box_id,
            level: shelf.level
        });

        if (existingShelf) {
            // If exists, increment the level
            const highestLevel = await Shelf.findOne({ box_id: req.body.box_id })
                .sort({ level: -1 })
                .limit(1);
            shelf.level = String(Number(highestLevel.level) + 1);
        }

        const savedShelf = await Shelf.create(shelf);

        // Update the box's shelves_ids array
        await Box.findOneAndUpdate(
            { id: req.body.box_id },
            { $push: { shelves_ids: shelfId } }
        );

        res.json(savedShelf);
    } catch (error) {
        res.status(500).json({ message: 'Error creating shelf', error: error.message });
    }
});

//Get shelves list
app.get('/shelves', authenticateToken, async (req, res) => {
    try {
        const { box_id } = req.query;
        const query = {};

        if (box_id) {
            query.box_id = box_id;
        }

        const shelves = await Shelf.find(query);
        res.json(shelves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shelves', error: error.message });
    }
});

//delete shelf
app.delete('/shelves/:shelfId', authenticateToken, async (req, res) => {
    console.log(req.params.shelfId);
    try {
        // Find the shelf to be deleted to get its box_id
        const shelfToDelete = await Shelf.findOne({ id: req.params.shelfId });

        if (!shelfToDelete) {
            return res.status(404).json({ message: 'Shelf not found' });
        }

        // Delete the shelf
        await Shelf.findOneAndDelete({ id: req.params.shelfId });

        // Remove shelf ID from the box's shelves_ids array
        await Box.findOneAndUpdate(
            { id: shelfToDelete.box_id },
            { $pull: { shelves_ids: req.params.shelfId } }
        );

        // Recalculate levels for remaining shelves in the box
        const remainingShelves = await Shelf.find({ box_id: shelfToDelete.box_id })
            .sort({ level: 1 });

        // Update levels to be sequential starting from 0
        const updatePromises = remainingShelves.map((shelf, index) => {
            return Shelf.findOneAndUpdate(
                { id: shelf.id },
                { level: String(index) }
            );
        });
        await Promise.all(updatePromises);

        res.json({ message: 'Shelf deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shelf', error: error.message });
    }
});

//patch shelf product count
app.patch('/shelf-product-count', authenticateToken, async (req, res) => {
    const { shelf_id, product_count } = req.body;
    const shelf = await Shelf.findOneAndUpdate({ id: shelf_id }, { product_count }, { new: true });
    res.json(shelf);
});

// Change to singular form and simplify route
app.patch('/shelf/:shelfId/product/:productId/count', authenticateToken, async (req, res) => {
    try {
        const { shelfId, productId } = req.params;
        const { count } = req.body;

        console.log('Updating product:', { shelfId, productId, count }); // Add logging

        const shelf = await Shelf.findOneAndUpdate(
            { id: shelfId },
            {
                $set: {
                    "products.$[elem].count": count
                }
            },
            {
                arrayFilters: [{ "elem.id": productId }],
                new: true
            }
        );

        if (!shelf) {
            return res.status(404).json({ message: 'Shelf not found' });
        }

        res.json(shelf);
    } catch (error) {
        console.error('Error updating product count:', error);
        res.status(500).json({ message: 'Error updating product count' });
    }
});

//delete shelf product
app.delete('/shelf/:shelfId/product/:productId', authenticateToken, async (req, res) => {
    try {
        const { shelfId, productId } = req.params;

        // First find the shelf
        const shelf = await Shelf.findOne({ id: shelfId });

        if (!shelf) {
            return res.status(404).json({ message: 'Shelf not found' });
        }

        // Remove the product from the products array
        const updatedShelf = await Shelf.findOneAndUpdate(
            { id: shelfId },
            {
                $pull: {
                    products: { id: productId }
                }
            },
            { new: true }
        );

        if (!updatedShelf) {
            return res.status(404).json({ message: 'Product not found in shelf' });
        }

        res.json(updatedShelf);
    } catch (error) {
        console.error('Error deleting product from shelf:', error);
        res.status(500).json({ message: 'Error deleting product from shelf' });
    }
});

//CATEGORIES
//Create category
app.post('/categories', authenticateToken, async (req, res) => {
    const category = req.body;
});

//Get categories list
app.get('/categories', authenticateToken, async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

const shelves_ids = () => {
    return Array.from({ length: 5 }, () => uuidv4());
};

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;