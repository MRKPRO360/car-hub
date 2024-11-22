Orders API
This API allows users to manage orders for cars in an inventory system. Users can create orders, manage inventory, and calculate revenue generated from orders.

Features
Place an order for a car.
Validate input data (e.g., email, car ID, quantity).
Automatically reduce inventory stock when an order is placed.
Mark cars as out of stock when inventory reaches zero.
Calculate total revenue using MongoDB aggregation.
Built using Node.js, Express, MongoDB, Mongoose, and TypeScript.
Installation and Setup
Prerequisites
Node.js: Ensure Node.js (v14 or later) is installed.
MongoDB: A running MongoDB instance is required.
Clone the Repository
bash
Copy code
git clone https://github.com/your-repo/orders-api.git
cd orders-api
Install Dependencies
bash
Copy code
npm install
Environment Variables
Create a .env file in the project root and configure the following variables:

env
Copy code
MONGO_URI=mongodb://localhost:27017/orders-db
PORT=3000
Start the Server
Run the development server:

bash
Copy code
npm run dev
For production:

bash
Copy code
npm run build
npm start
The API will be available at http://localhost:3000.

API Endpoints

1. Place an Order
   URL: /orders
   Method: POST
   Description: Creates a new order and updates the inventory.

Request Body
json
Copy code
{
"email": "example@example.com",
"car": "648d1f1a7e90fddaf9e4627b",
"quantity": 2,
"totalPrice": 50000
}
Response
json
Copy code
{
"\_id": "648d1f1a7e90fddaf9e4627c",
"email": "example@example.com",
"car": "648d1f1a7e90fddaf9e4627b",
"quantity": 2,
"totalPrice": 50000,
"createdAt": "2024-11-22T15:30:45.456Z",
"updatedAt": "2024-11-22T15:30:45.456Z",
"\_\_v": 0
}
Notes
Reduces the car's inventory.
Marks the car as out of stock if inventory reaches zero.
Returns an error if insufficient stock is available. 2. Get Total Revenue
URL: /orders/revenue
Method: GET
Description: Calculates the total revenue from all orders.

Response
json
Copy code
{
"totalRevenue": 150000
}
Validation
Email: Must be in a valid email format.
Car ID: Must be a valid MongoDB ObjectId and reference an existing car.
Quantity: Must be at least 1.
Total Price: Must be a non-negative number.
Error Example
If an invalid car ID is provided:

json
Copy code
{
"error": "Invalid car ID"
}
Database Models
Car Schema
typescript
Copy code
export interface ICar {
brand: string;
model: string;
year: number;
price: number;
category: 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible';
description: string;
quantity: number;
inStock: boolean;
createdAt: Date;
updatedAt: Date;
isDeleted: boolean;
}
Order Schema
typescript
Copy code
export interface IOrder {
email: string;
car: mongoose.Types.ObjectId;
quantity: number;
totalPrice: number;
}
Technologies Used
Node.js: JavaScript runtime environment.
Express.js: Web framework for Node.js.
MongoDB: NoSQL database for storing orders and inventory data.
Mongoose: ODM library for MongoDB.
TypeScript: Type-safe JavaScript.
Key Functionality
Reduce Inventory
When an order is placed:

Check if the requested car has sufficient stock.
Reduce the car's quantity field by the order's quantity.
Set inStock to false if the quantity reaches zero.
Aggregation for Revenue
Uses MongoDB's aggregation pipeline to calculate total revenue:

Multiplies price by quantity for all orders.
Sums the result across all orders.
Run Tests
Run unit tests using the following command:

bash
Copy code
npm test
Contribution Guidelines
Fork the repository.
Create a new feature branch: git checkout -b feature-name.
Commit your changes: git commit -m "Add feature".
Push to the branch: git push origin feature-name.
Open a pull request.
License
This project is licensed under the MIT License. See the LICENSE file for details.
