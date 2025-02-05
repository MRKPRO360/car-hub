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
- [Notes](#notes)
- [License](#license)

## About The Project

This API allows users to manage orders for cars in an inventory system. Users can create orders, manage inventory, and calculate revenue generated from orders.

## Features

✅ User Authentication & Management
✅ Register new users and store profile data
✅ Secure login with JWT authentication
✅ Refresh authentication token for session management
✅ Change password with validation
✅ Admin can retrieve all users
✅ Get individual user profile and update details
✅ Deactivate or delete a user account

✅ Car Management
✅ Add new cars with image upload functionality
✅ Retrieve all available cars or filter by user
✅ Update car details (e.g., price, description)
✅ Delete cars from inventory
✅ Ensure data validation for car-related operations

✅ Order Management
✅ Place an order for a car
✅ Validate input data (e.g., car ID, quantity, payment details)
✅ Automatically reduce inventory stock when an order is placed
✅ Retrieve all orders for an admin or specific user
✅ Verify payments for placed orders
✅ Allow users to check their own orders
✅ Update or cancel orders (Admin/User roles)

✅ Revenue & Analytics
✅ Calculate total revenue using MongoDB aggregation
✅ Generate insights into order trends and car sales

✅ Security & Middleware
✅ Role-based access control (Admin/User)
✅ Authentication middleware using JWT
✅ Input validation to prevent invalid requests
✅ Sophisticated error handling with meaningful messages

## Demo

![App Screenshot](https://i.ibb.co.com/C3399GTF/car-hub.webp)

👉 [Live Demo](https://car-hub-puce-three.vercel.app/)

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
npm run start:dev
```

### For production:

```
npm run build
npm run start:prod
```

The API will be available at <span style="background-color:rgb(72, 72, 72);">http://localhost:3000`</span>

# API Documentation

This project provides a RESTful API for managing users, orders, cars, and authentication. Below is the documentation for the available routes and their functionalities.

---

## Table of Contents

1. [User Routes](#user-routes)
2. [Order Routes](#order-routes)
3. [Car Routes](#car-routes)
4. [Auth Routes](#auth-routes)

---

## User Routes

### Get All Users

- **Endpoint**: `GET /users`
- **Access**: Admin
- **Description**: Retrieve all users.
- **Controller**: `UserControllers.getAllUsers`

### Get My Profile

- **Endpoint**: `GET /users/me`
- **Access**: Admin, User
- **Description**: Retrieve the profile of the currently logged-in user.
- **Controller**: `UserControllers.getMe`

### Get Single User

- **Endpoint**: `GET /users/:userId`
- **Access**: Admin
- **Description**: Retrieve a single user by ID.
- **Controller**: `UserControllers.getSingleUser`

### Update User

- **Endpoint**: `PATCH /users/:userId`
- **Access**: Admin, User
- **Description**: Update user details.
- **Validation**: `userValidationsSchema.updateUserValidationSchema`
- **Controller**: `UserControllers.updateUser`

### Delete User

- **Endpoint**: `DELETE /users/:userId`
- **Access**: Admin
- **Description**: Delete a user by ID.
- **Controller**: `UserControllers.deleteUser`

### Deactivate User

- **Endpoint**: `PATCH /users/deactivate-user/:userId`
- **Access**: Admin
- **Description**: Deactivate a user by ID.
- **Controller**: `UserControllers.deactivateUser`

---

## Order Routes

### Get All Orders

- **Endpoint**: `GET /orders`
- **Access**: Admin, User
- **Description**: Retrieve all orders.
- **Controller**: `orderControllers.getAllOrders`

### Create Order

- **Endpoint**: `POST /orders`
- **Access**: Admin, User
- **Description**: Create a new order.
- **Validation**: `orderValidationsSchema.createOrderValidationSchema`
- **Controller**: `orderControllers.createOrder`

### Verify Payment

- **Endpoint**: `GET /orders/verify-order`
- **Access**: Admin, User
- **Description**: Verify payment for an order.
- **Controller**: `orderControllers.verifyPayment`

### Get My Orders

- **Endpoint**: `GET /orders/my-orders`
- **Access**: User
- **Description**: Retrieve orders for the currently logged-in user.
- **Controller**: `orderControllers.getMyOrders`

### Update Order

- **Endpoint**: `PATCH /orders/:orderId`
- **Access**: Admin
- **Description**: Update an order by ID.
- **Validation**: `orderValidationsSchema.updateOrderValidationSchema`
- **Controller**: `orderControllers.updateAnOrder`

### Delete Order

- **Endpoint**: `DELETE /orders/:orderId`
- **Access**: Admin, User
- **Description**: Delete an order by ID.
- **Controller**: `orderControllers.deleteAnOrder`

### Calculate Revenue

- **Endpoint**: `GET /orders/revenue`
- **Access**: Admin, User
- **Description**: Calculate total revenue.
- **Controller**: `orderControllers.claculateRevenue`

---

## Car Routes

### Get All Cars

- **Endpoint**: `GET /cars`
- **Access**: Public
- **Description**: Retrieve all cars.
- **Controller**: `carControllers.getAllCars`

### Create a Car

- **Endpoint**: `POST /cars`
- **Access**: Admin
- **Description**: Create a new car.
- **Validation**: `carValidationSchema.createCarValidationSchema`
- **File Upload**: Single file upload for car image.
- **Controller**: `carControllers.createACar`

### Get My Cars

- **Endpoint**: `GET /cars/my-car`
- **Access**: Admin, User
- **Description**: Retrieve cars owned by the currently logged-in user.
- **Controller**: `carControllers.getMyCars`

### Get a Single Car

- **Endpoint**: `GET /cars/:carId`
- **Access**: Public
- **Description**: Retrieve a single car by ID.
- **Controller**: `carControllers.getACar`

### Update a Car

- **Endpoint**: `PATCH /cars/:carId`
- **Access**: Admin
- **Description**: Update car details by ID.
- **Validation**: `carValidationSchema.updateCarValidationSchema`
- **Controller**: `carControllers.updateACar`

### Delete a Car

- **Endpoint**: `DELETE /cars/:carId`
- **Access**: Admin
- **Description**: Delete a car by ID.
- **Controller**: `carControllers.deleteACar`

---

## Auth Routes

### Register User

- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Description**: Register a new user.
- **Validation**: `authValidations.registeredUserValidationSchema`
- **File Upload**: Single file upload for user profile picture.
- **Controller**: `authControllers.registerUser`

### Login User

- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Description**: Login a user.
- **Validation**: `authValidations.loginValidationSchema`
- **Controller**: `authControllers.loginUser`

### Refresh Token

- **Endpoint**: `POST /auth/refresh-token`
- **Access**: Public
- **Description**: Refresh the access token.
- **Validation**: `authValidations.refreshTokenValidationSchema`
- **Controller**: `authControllers.refreshToken`

### Change Password

- **Endpoint**: `POST /auth/change-password`
- **Access**: Admin, User
- **Description**: Change the password of the currently logged-in user.
- **Validation**: `authValidations.changePasswordValidationSchema`
- **Controller**: `authControllers.changePassword`

---

## Middlewares

1. **Auth Middleware**: Ensures that the user is authenticated and has the required role.
2. **Validate Request Middleware**: Validates the request body using Joi schemas.
3. **Multer Middleware**: Handles file uploads.

---

## Constants

- **USER_ROLES**: Contains user roles (`admin`, `user`).

---

## Validation Schemas

- **User Validation**: `userValidationsSchema`
- **Order Validation**: `orderValidationsSchema`
- **Car Validation**: `carValidationSchema`
- **Auth Validation**: `authValidations`

---

## Controllers

- **User Controllers**: `UserControllers`
- **Order Controllers**: `orderControllers`
- **Car Controllers**: `carControllers`
- **Auth Controllers**: `authControllers`

---

## License

This project is licensed under the MIT License.

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

## Notes

All requests and responses use JSON format.
Replace http://localhost:5000/api/cars or http://localhost:5000/api/orders with the vercel deployed link to consume it.
Authentication and authorization mechanisms can be integrated if needed in the future.

## License

This project is licensed under the MIT License. See the <span style="background-color: "rgb(44, 44, 44)">LICENSE</span> file for details.
