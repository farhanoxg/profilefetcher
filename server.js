const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mysql://root:farhan123@localhost:3306/profile_fetcher');

const Profile = sequelize.define('Profile', {
  name: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  connection_count: { type: DataTypes.INTEGER }
});

const app = express();

app.use(cors({
  origin: 'chrome-extension://hjokgjbbnnbmkecfclenmnnaoocmnjoh'
}));
app.use(bodyParser.json());

sequelize.sync().then(() => {
  console.log('Database & tables created!');
}).catch(err => {
  console.error('Error creating database or tables:', err);
});

app.post('/profiles', async (req, res) => {
  console.log('Received profile data:', req.body);
  try {
    const profileData = req.body;
    const newProfile = await Profile.create(profileData);
    console.log('Profile saved:', newProfile);
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error saving profile data:', error);
    res.status(500).json({ error: 'Error saving profile data' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
