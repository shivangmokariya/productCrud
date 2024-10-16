// const request = require('supertest');
// const app = require('../index'); // Adjust the path according to your project structure
// const mongoose = require('mongoose');
// const Product = require('../models/product');
// const jwt = require('jsonwebtoken');

// const testUser = {
//   _id: '670fa214384e4d6d52d48f08', // Replace with a valid user ID
// };

// describe('Product API', () => {
//   beforeAll(async () => {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

//   describe('POST /api/products', () => {
//     // it('should add a new product successfully', async () => {
//     // //   const token = jwt.sign(testUser, process.env.SECRET_KEY);
//     // jest.setTimeout(10000); // Set timeout to 10 seconds
//     //   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBmYjA2OTQ0MGJiMjVlZjVkZjUyYjMiLCJpYXQiOjE3MjkwODE1NDcsImV4cCI6MTcyOTE2Nzk0N30.Os8sBs9XVZX35wNKaghWkK8YnyvDM3EBAI-ZIlMgY2g"
//     //   const response = await request(app)
//     //     .post('/api/products')
//     //     .set('Authorization', `Bearer ${token}`)

//     //     .field('title', 'Test Product')
//     //     .field('description', 'Test description')
//     //     .field('price', '99.99')
//     //     .field('rating', '5')
//     //     .field('stock', '100')
//     //     .field('brand', 'Test Brand')
//     //     .field('category', 'Test Category')
//     //     .field('createdBy', testUser._id)
//     //     .attach('images', ['D:/shivang/productCrud/upload/img.jpg']); // Adjust the path to your test image
//     //     console.log(response.body,"<<<<<<<<<<<response.body")
//     //   expect(response.status).toBe(201);
//     //   expect(response.body.title).toBe('Test Product');
//     // });
//     it('should add a new product successfully', async () => {
//         jest.setTimeout(10000); // Set timeout to 10 seconds
//         const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBmYjRiZTllYzI0ZmEzNzc3Y2M5YjciLCJpYXQiOjE3MjkwODI1NjgsImV4cCI6MTcyOTE2ODk2OH0.dwn046jodczEjy3aah5ZTSFOC0n5pxbv7gmDgtkvh2Q"; // Use your valid token
      
//         const response = await request(app)
//           .post('/api/products')
//           .set('Authorization', `Bearer ${token}`)
//           .field('title', 'Test Product')
//           .field('description', 'Test description')
//           .field('price', '99.99')
//           .field('rating', '5')
//           .field('stock', '100')
//           .field('brand', 'Test Brand')
//           .field('category', 'Test Category')
//           .field('createdBy', testUser._id) // Include createdBy if needed
//           .attach('images', 'D:/shivang/productCrud/upload/img.jpg'); // Attach the image
      
//         console.log(response.body, "<<<<<<<<<<<response.body");
//         expect(response.status).toBe(201);
//         expect(response.body.title).toBe('Test Product');
//       });
      
      
//     it('should return validation errors for missing fields', async () => {
//       const token = jwt.sign(testUser, process.env.SECRET_KEY);
//       const response = await request(app)
//         .post('/api/products')
//         .set('Authorization', `Bearer ${token}`)
//         .send({}); // No fields

//       expect(response.status).toBe(400);
//       expect(response.body.error).toContain('Invalid title');
//     });
//   });

//   describe('GET /api/products', () => {
//     it('should retrieve products successfully', async () => {
//       const response = await request(app).get('/api/products');

//       expect(response.status).toBe(200);
//       expect(response.body.products).toBeDefined();
//     });
//   });

//   describe('GET /api/products/:id', () => {
//     it('should retrieve a single product by ID', async () => {
//       const product = await Product.create({
//         title: 'Test Product',
//         description: 'Test description',
//         price: '99.99',
//         rating: '5',
//         stock: '100',
//         brand: 'Test Brand',
//         category: 'Test Category',
//       });

//       const response = await request(app).get(`/api/products/${product._id}`);

//       expect(response.status).toBe(200);
//       expect(response.body.products).toBeDefined();
//     });

//     it('should return 404 for a non-existing product', async () => {
//       const response = await request(app).get('/api/products/invalidID');
//       expect(response.status).toBe(500);
//       expect(response.body.error).toContain('No product found');
//     });
//   });

//   describe('PUT /api/products/:id', () => {
//     it('should update a product successfully', async () => {
//       const product = await Product.create({
//         title: 'Test Product',
//         description: 'Test description',
//         price: '99.99',
//         rating: '5',
//         stock: '100',
//         brand: 'Test Brand',
//         category: 'Test Category',
//       });

//       const token = jwt.sign(testUser, process.env.SECRET_KEY);
//       const response = await request(app)
//         .put(`/api/products/${product._id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ title: 'Updated Product' });

//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe('Product details updated successfully');
//     });

//     it('should return 404 for an invalid product ID', async () => {
//       const token = jwt.sign(testUser, process.env.SECRET_KEY);
//       const response = await request(app)
//         .put('/api/products/invalidID')
//         .set('Authorization', `Bearer ${token}`)
//         .send({ title: 'Updated Product' });

//       expect(response.status).toBe(404);
//       expect(response.body.error).toBe('Product not found');
//     });
//   });

//   describe('DELETE /api/products/:id', () => {
//     it('should delete a product successfully', async () => {
//       const product = await Product.create({
//         title: 'Test Product',
//         description: 'Test description',
//         price: '99.99',
//         rating: '5',
//         stock: '100',
//         brand: 'Test Brand',
//         category: 'Test Category',
//       });

//       const token = jwt.sign(testUser, process.env.SECRET_KEY);
//       const response = await request(app)
//         .delete(`/api/products/${product._id}`)
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe('Product deleted successfully');
//     });

//     it('should return 404 for a non-existing product', async () => {
//       const token = jwt.sign(testUser, process.env.SECRET_KEY);
//       const response = await request(app)
//         .delete('/api/products/invalidID')
//         .set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(404);
//       expect(response.body.error).toBe('Product not found');
//     });
//   });
// });
