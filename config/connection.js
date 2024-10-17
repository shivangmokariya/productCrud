// const mongoose=require("mongoose");
// mongoose.set('strictQuery', false);
// // console.log(process.env.MONGO_URI)
// mongoose
// .connect(process.env.MONGO_URI)
// .then(()=>console.log("Database connection succesfull"))
// .catch((e)=>console.log("no connection in Database"+e))

const { Sequelize } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('demo', 'postgres', 'admin', {
  host: 'localhost',
  dialect: 'postgres',
});

// Test the connection
const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Close the connection
const disconnect = async () => {
  await sequelize.close();
  console.log('Disconnected from PostgreSQL');
};


module.exports = {
  sequelize,
  connect,
  disconnect,
};
