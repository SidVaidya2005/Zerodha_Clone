## 1. Project Overview

This project is a Zerodha-inspired trading platform clone built as a full-stack learning and portfolio project.
It includes a backend API, a public-facing frontend, and a dashboard app for trading-related workflows.
The project was built to practice real-world full-stack architecture, React UI development, API integration, and data modeling with MongoDB.

## 2. Demo

- Live Demo Link: To be added
- Screenshots/GIFs: To be added

## 3. Features
- Holdings and positions retrieval
- Order placement simulation (`POST /newOrder`)
- Dashboard with portfolio-focused UI
- Public marketing/landing pages
- Watchlist and advanced trading features planned in roadmap
- Responsive React UI across frontend and dashboard apps

## 4. Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- React.js
- React Router
- Material UI (dashboard)
- Chart.js + react-chartjs-2 (dashboard visualizations)

### Backend

- Node.js
- Express.js
- Mongoose
- JWT
- bcrypt
- passport
- express-validator
- helmet

### Database

- MongoDB

### Other Tools

- REST APIs
- Axios
- Postman/Thunder Client for API testing

## 5. System Architecture

High-level flow:

`Frontend/Dashboard -> API Layer -> Express Backend -> MongoDB`

Detailed app flow:

`React UI -> Context/Hooks -> Service Layer (Axios) -> Express Routes -> Middleware -> Controllers/Models -> MongoDB`

## 6. Installation & Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Clone the Repository

```bash
git clone https://github.com/your-username/zerodha-clone.git
cd zerodha-clone
```

### Install Dependencies

Install dependencies for each app:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../dashboard && npm install
```

### Run the Project

Run each app in separate terminals:

```bash
cd backend
npm start
```

```bash
cd frontend
npm start
```

```bash
cd dashboard
npm start
```

## 7. Environment Variables

Create `backend/.env` and add:

```env
PORT=3002
MONGO_URL=your_mongodb_connection
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Optional frontend env (`frontend/.env.local`):

```env
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_DEBUG=true
```

## 8. Folder Structure

```text
zerodha-clone
|
|- backend/                  # Node + Express API
|  |- index.js
|  |- model/
|  |- schemas/
|
|- frontend/                 # Public/marketing React app
|  |- src/
|  |- public/
|
|- dashboard/                # Trading dashboard React app
|  |- src/components/
|  |- src/data/
|
`- README.md
```

## 9. API Endpoints

Current implemented backend endpoints:

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | /allHoldings  | Fetch all holdings  |
| GET    | /allPositions | Fetch all positions |
| POST   | /newOrder     | Create a new order  |

Planned/target endpoints include `/api/auth/*`, `/api/orders/*`, `/api/watchlist/*`, and `/api/portfolio/*` routes.

## 10. Screenshots

- Login Page: To be added
- Dashboard: To be added
- Trading Panel: To be added
- Portfolio Page: To be added

## 11. Future Improvements

- Authentication system with protected routes
- Real-time stock price integration (WebSockets)
- Advanced charting workspace and indicators
- Watchlist CRUD + reorder support
- Order history filters/sorting/pagination
- CSV/PDF export support
- Alerts and notifications
- Paper trading/backtesting module
- PWA/mobile improvements

## 12. Learning Outcomes

- Built and connected multiple React apps with a shared backend
- Practiced REST API creation using Express and MongoDB/Mongoose
- Improved understanding of scalable project structure
- Learned trade-offs between current implementation and production-ready architecture
- Identified challenges around auth, data scoping, and real-time updates

## 13. Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m "Add your message"`).
4. Push to your fork (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

## 14. License

This project is open source. You can use the MIT License for distribution (add a `LICENSE` file if not present).

## 15. Author

- Name: Your Name
- GitHub: https://github.com/your-username
- LinkedIn: https://linkedin.com/in/your-profile
