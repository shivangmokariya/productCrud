const { User, syncModels: syncAuthModels } = require('./userRegistration');
const { Product, syncModels: syncProductModels  } = require('./product');
const syncModels = async () => {
  await syncAuthModels();
  await syncProductModels();
};

module.exports = {
  syncModels,
  User,
  Product
};
