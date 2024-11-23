# 😎 Sophisticated Car API

A modern API built with [Node.js](https://nodejs.org/), [express.js](https://expressjs.com/), [mongoose](https://mongoosejs.com), [typescript](https://www.typescript.org) and ❤️.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About The Project

This API allows users to manage orders for cars in an inventory system. Users can create orders, manage inventory, and calculate revenue generated from orders.

## 🚀 Features

✅ Place an order for a car.
✅ Validate input data (e.g., email, car ID, quantity).
✅ Automatically reduce inventory stock when an order is placed.
✅ Mark cars as out of stock when inventory reaches zero.
✅ Calculate total revenue using MongoDB aggregation.
✅ Sophisticated error message

## Demo

![App Screenshot](https://i.ibb.co.com/85NL94n/38028744-e6ca-4b6e-8f18-6211ddd00a7e.webp)

👉 [Live Demo](https://car-project-one.vercel.app/)

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **DevDependncy:** Typescript, Morgan
- **Deployment:** Vercel

## Installation

Prerequisites
Node.js: Ensure Node.js (v14 or later) is installed.
MongoDB: A running MongoDB instance is required.

### Clone the Repository

```bash
Copy code
git clone https://github.com/your-repo/orders-api.git
cd orders-api
```

### Install Dependencies

```
npm install
```

### Environment Variables

Create a .env file in the project root and configure the following variables:

```
MONGO_URI=mongodb://localhost:27017/orders-db
PORT=3000
```

### Start the Server

Run the development server:

```
npm run dev
```

### For production:

```
npm run build
npm start
```

The API will be available at <span style="background-color:rgb(72, 72, 72);">http://localhost:3000`</span>

## API Endpoints

<span style="background-color:rgb(72, 72, 72);">/api/cars</span>

Description
This endpoint provides functionality to manage car-related resources. You can use this endpoint to create, read, update, and delete cars.

Endpoints

1. GET /api/cars
   Fetch all available cars.

Request:

Method: GET
URL Parameters: None
Query Parameters:
category (optional): Filter cars by category (e.g., Sedan, SUV, etc.).
inStock (optional): true or false to filter cars based on their stock status.
Response:

Status Code: 200 OK
Body Example:

```

{
"id": "648d1f1a7e90fddaf9e4627b",
"brand": "Toyota",
"model": "Corolla",
"year": 2023,
"price": 20000,
"category": "Sedan",
"description": "A reliable and fuel-efficient sedan.",
"quantity": 10,
"inStock": true,
"createdAt": "2024-11-01T12:00:00Z",
"updatedAt": "2024-11-10T12:00:00Z"
}
```

2. GET /api/cars/:id
   Fetch a single car by its ID.

Request:

Method: GET
URL Parameters:
id (required): The ID of the car to retrieve.
Response:

Status Code: 200 OK
Body Example:

```

{
"id": "648d1f1a7e90fddaf9e4627b",
"brand": "Toyota",
"model": "Corolla",
"year": 2023,
"price": 20000,
"category": "Sedan",
"description": "A reliable and fuel-efficient sedan.",
"quantity": 10,
"inStock": true,
"createdAt": "2024-11-01T12:00:00Z",
"updatedAt": "2024-11-10T12:00:00Z"
}

```

Error Example:

Status Code: 404 Not Found
Body:

```
{ "error": "Car not found" }
```

3. POST /api/cars
   Create a new car.

Request:

Method: POST
Body Example:

```
{
"brand": "Toyota",
"model": "Corolla",
"year": 2023,
"price": 20000,
"category": "Sedan",
"description": "A reliable and fuel-efficient sedan.",
"quantity": 10
}
```

Response:

Status Code: 201 Created
Body Example:

```
{
"id": "648d1f1a7e90fddaf9e4627b",
"brand": "Toyota",
"model": "Corolla",
"year": 2023,
"price": 20000,
"category": "Sedan",
"description": "A reliable and fuel-efficient sedan.",
"quantity": 10,
"inStock": true,
"createdAt": "2024-11-01T12:00:00Z",
"updatedAt": "2024-11-01T12:00:00Z"
}

```

Error Example:

Status Code: 400 Bad Request
Body:

```
{ "error": "Validation failed: Missing required fields" }
```

4. PUT /api/cars/:id
   Update an existing car.

Request:

Method: PUT
URL Parameters:
id (required): The ID of the car to update.
Body Example:

```

{
"price": 22000,
"quantity": 15
}

```

Response:

Status Code: 200 OK
Body Example:

```

{
"id": "648d1f1a7e90fddaf9e4627b",
"brand": "Toyota",
"model": "Corolla",
"year": 2023,
"price": 22000,
"category": "Sedan",
"description": "A reliable and fuel-efficient sedan.",
"quantity": 15,
"inStock": true,
"createdAt": "2024-11-01T12:00:00Z",
"updatedAt": "2024-11-15T12:00:00Z"
}

```

5. DELETE /api/cars/:id
   Delete a car by its ID.

Request:
Method: DELETE
URL Parameters:
id (required): The ID of the car to delete.

Response:
Status Code: 204 No Content

Error Example:
Status Code: 404 Not Found
Body:

```
{ "error": "Car not found" }
```

Validation Rules
Brand, Model, Year, Price, and Description are required fields.
Quantity must be at least 1.
Category must be one of the following:
Sedan
SUV
Truck
Coupe
Convertible
Error Codes
400 Bad Request: Validation errors or missing fields.
404 Not Found: Car not found for the given ID.
500 Internal Server Error: Unexpected server errors.

6. Fetch All Cars:

```
curl -X GET http://localhost:3000/api/cars
```

7. Fetch a Car by ID:

```
curl -X GET http://localhost:3000/api/cars/648d1f1a7e90fddaf9e4627b
```

8. Create a Car

```
curl -X POST http://localhost:3000/api/cars \

-H "Content-Type: application/json" \
 -d '{
"brand": "Tesla",
"model": "Model S",
"year": 2024,
"price": 80000,
"category": "Sedan",
"description": "An electric luxury sedan.",
"quantity": 5
}'
```

4. Update a Car:

```
curl -X PUT http://localhost:3000/api/cars/648d1f1a7e90fddaf9e4627b \
 -H "Content-Type: application/json" \
 -d '{
"price": 85000,
"quantity": 3
}'
```

5. Delete a Car:

```

curl -X DELETE http://localhost:3000/api/cars/648d1f1a7e90fddaf9e4627b

```

### 1. Create an Order

URL: /orders
Method: POST
Description: Creates a new order and updates the inventory.

Request Body

```

{
"email": "example@example.com",
"car": "648d1f1a7e90fddaf9e4627b",
"quantity": 2,
"totalPrice": 50000
}

```

Response

```

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

```

#### Notes

- Reduces the car's quantity.
- Marks the car as out of stock if quantity reaches zero.

\*Returns an error if insufficient stock is available.

### 2.Get Total Revenue

URL: /orders/revenue
Method: GET
Description: Calculates the total revenue from all orders.

Response
json
Copy code
{
"totalRevenue": 150000
}

## Validation

- Email: Must be in a valid email format.
- Car ID: Must be a valid MongoDB ObjectId and reference an existing car.
- Quantity: Must be at least 1.
- Total Price: Must be a non-negative number.

### Error Example

If an invalid car ID is provided:

```

{
"error": "Invalid car ID"
}

```

## Database Models

### Car Schema

```

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

```

### Order Schema

```

export interface IOrder {
email: string;
car: mongoose.Types.ObjectId;
quantity: number;
totalPrice: number;
}

```

## Key Functionality

### Reduce Quantity

When an order is placed:

1. Check if the requested car has sufficient stock.
2. Reduce the car's quantity field by the order's quantity.
3. Set <span style="background-color: "rgb(44, 44, 44)">inStock</span> to false if the <span style="background-color: "rgb(44, 44, 44)">quantity</span> reaches zero.

### Aggregation for Revenue

Uses MongoDB's aggregation pipeline to calculate total revenue:

- Multiplies price by quantity for all orders.
- Sums the result across all orders.

## Contributing

1. Fork the repository.
2. Create a new feature branch: <span style="background-color: "rgb(44, 44, 44)">git checkout -b feature-name</span>.
3. Commit your changes: <span style="background-color: "rgb(44, 44, 44)">git commit -m "Add feature"</span> .
4. Push to the branch: <span style="background-color: "rgb(44, 44, 44)">git push origin feature-name</span> .
5. Open a pull request.

## Usage

## License

This project is licensed under the MIT License. See the <span style="background-color: "rgb(44, 44, 44)">LICENSE</span> file for details.
