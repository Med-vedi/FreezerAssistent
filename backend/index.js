require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

mongoose.connect(config.connectionString, {
    dbName: 'freezer'
});

const User = require('./models/user.model');
const Box = require('./models/boxes.model');
const Product = require('./models/products.model');
const Shelf = require('./models/shelves.model');
const Category = require('./models/categories.model');

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utils');

app.use(express.json());
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.listen(8000)

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
        id: uuidv4()
    });
    await user.save();
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600m' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3600s' });
    res.json({
        error: false,
        message: 'User created successfully',
        accessToken,
        refreshToken,
        user
    });
});

//Login user
app.get('/login', async (req, res) => {
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
        const accessToken = jwt.sign({ user: userInfo }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600m' });
        const refreshToken = jwt.sign({ user: userInfo }, process.env.REFRESH_TOKEN_SECRET);
        return res.json({
            error: false,
            email: userInfo.email,
            message: 'Login successful',
            accessToken,
            refreshToken
        });

    } else {
        return res.status(401).json({
            error: true,
            message: 'Invalid credentials'
        });
    }
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
            },
            message: 'User fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
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

//BOXES
app.post('/boxes', authenticateToken, async (req, res) => {
    const boxes = req.body;
    console.log(boxes);

    const shelves_ids = () => {
        return Array(5).fill().map(() => uuidv4());
    };
    if (!boxes || !Array.isArray(boxes) || boxes.length < 1) {
        return res.status(400).json({ message: 'Valid boxes array is required' });
    }

    try {
        const savedBoxes = await Box.insertMany(boxes.map(box => ({
            id: uuidv4() + box.title,
            title: box.title,
            shelves_id: shelves_ids(),
            type: box.type
        })));

        res.json(savedBoxes);
    } catch (error) {
        res.status(500).json({ message: 'Error creating boxes', error: error.message });
    }
});

//Get boxes list
app.get('/boxes', authenticateToken, async (req, res) => {
    try {
        const { id } = req.query;
        const query = {};

        if (id) {
            query.id = id;
        }

        const boxes = await Box.find(query);
        res.json(boxes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching boxes', error: error.message });
    }
});

//update boxes list
app.patch('/boxes/:id', authenticateToken, async (req, res) => {
    try {
        const box = await Box.findOneAndUpdate(
            { id: req.params.id },
            {
                title: req.body.title,
                shelves_id: req.body.shelves_id
            },
            { new: true });
        res.json(box);
    } catch (error) {
        res.status(500).json({ message: 'Error updating box', error: error.message });
    }
});

app.delete('/boxes/:id', authenticateToken, async (req, res) => {
    try {
        await Box.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Box deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting box', error: error.message });
    }
});

//PRODUCTS
//Create product
app.post('/products', authenticateToken, async (req, res) => {
    const product = {
        id: uuidv4(),
        category_id: req.body?.category_id || 0,
        emoji: req.body?.emoji || '❄️',
        ...req.body
    };

    try {
        const savedProduct = await Product.create(product);

        // If shelf_id is provided, update the shelf's products array
        if (req.body.shelf_id) {
            await Shelf.findOneAndUpdate(
                { id: req.body.shelf_id },
                { $push: { products: savedProduct.id } }
            );
        }

        res.json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
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
//add product
app.post('/products', authenticateToken, async (req, res) => {
    const productId = uuidv4();
    const product = {
        id: productId,
        ...req.body
    };
    try {
        //if product is not from the list of the products, create it
        const isProductExists = await Product.findOne({ id: productId });
        if (isProductExists) {
            return res.status(400).json({ message: 'Product already exists' });
        }
        const savedProduct = await Product.create(product);
        res.json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
});
//

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

        // Update the box's shelves_id array
        await Box.findOneAndUpdate(
            { id: req.body.box_id },
            { $push: { shelves_id: shelfId } }
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

        // Remove shelf ID from the box's shelves_id array
        await Box.findOneAndUpdate(
            { id: shelfToDelete.box_id },
            { $pull: { shelves_id: req.params.shelfId } }
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

//CATEGORIES
//Create category
app.post('/categories', authenticateToken, async (req, res) => {
    const category = req.body;
    console.log(category);
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





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;