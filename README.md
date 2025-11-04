# 🗳️ Voting Application Backend API Documentation

This documentation provides details on the available API endpoints for interacting with the voting application backend.

## 🚀 Getting Started

The API provides methods for user **authentication**, managing **candidates**, and **casting votes**. The base URL for all routes should be configured in your frontend environment.

### **Authentication**

Routes under `/api/auth` handle user registration and login, returning a **JSON Web Token (JWT)** upon successful login. This token is required for accessing protected routes.

| Endpoint | Method | Route | Purpose |
| :--- | :--- | :--- | :--- |
| **Register User** | `POST` | `/api/auth/register` | Create a new voter account. |
| **Login User** | `POST` | `/api/auth/login` | Obtain a JWT to access protected routes. |

#### **Usage Note**

After a successful login, the returned **JWT** must be included in the **`Authorization`** header of subsequent requests to protected routes, typically using the **`Bearer`** scheme (e.g., `Authorization: Bearer <your_jwt_token>`).

---

## 🧍 Candidate Management

These endpoints allow viewing the current list of candidates. Admin-level privileges are required to add or remove candidates.

### **Public Candidate Endpoints**

| Endpoint | Method | Route | Purpose |
| :--- | :--- | :--- | :--- |
| **Get All Candidates** | `GET` | `/api/candidates` | View the list of people available for voting. |

### **Admin-Only Candidate Endpoints**

These require a JWT from an **Admin** user and the **`verifyAdmin`** protection layer.

| Endpoint | Method | Route | Protection | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Add Candidate** | `POST` | `/api/candidates` | `verifyAdmin` (Admin only) | Creates a new candidate. |
| **Delete Candidate** | `DELETE` | `/api/candidates/:id` | `verifyAdmin` (Admin only) | Removes a candidate. Replace `:id` with the Candidate's ID. |

---

## ✅ Voting & Results

These routes are central to the voting process, allowing logged-in users to cast their vote and anyone to check the current results.

| Endpoint | Method | Route | Protection | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Cast a Vote** | `POST` | `/api/vote` | `verifyToken` (Any logged-in user) | Records a vote from a user for a candidate. Requires a valid JWT. |
| **Get Results** | `GET` | `/api/vote/results` | None | View the current vote counts for each candidate. |

---

## 👥 User Information (For Development/Admin)

The following endpoint is available for listing registered users. **Security Warning**: This route is currently public but **should be secured** with an `verifyAdmin` or similar protection layer before deployment to a production environment.

| Endpoint | Method | Route | Protection | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Get All Users** | `GET` | `/api/users` | None (Currently public) | View the list of registered voters. **Highly recommended to secure this route.** |

---

## 🔑 Protection Layers

| Layer Name | Description | Required Role |
| :--- | :--- | :--- |
| `verifyToken` | Ensures the request includes a **valid JWT** in the `Authorization` header. | Any logged-in user |
| `verifyAdmin` | Ensures the request includes a valid JWT *and* that the user associated with the token has an **Admin role**. | Admin only |