# 🚀 PartKasa.com – MVP Build Prompts for Cline AI Agent

**Brand Name:** PartKasa.com  
**Tagline:** *No Hustle for Auto Parts*  
**Market:** Ghana 🇬🇭

---

## ✅ OVERVIEW

This document contains all the structured prompts you will use with Cline AI Agent (in VSCode) to generate the full MVP for PartKasa.com — a Ghanaian auto parts marketplace web app.

You will begin with project setup, then create each microservice, build the frontend, link your GitHub repo, and deploy with Docker.

---

## 📁 STEP 1: Create and Structure the Project Directory

Create a new folder in VSCode and name it: `partkasa`.

Inside that folder, copy this `.md` file and begin working through the prompts step by step using Cline.

---

## 🧱 STEP 2: Set Global Context
```
We’re building a modular, containerized auto parts marketplace called PartKasa.com.

Users will search by car make, model, year, part name or number. Vendors upload listings with image, location, stock status, delivery ETA, and price. The user selects a part, pays online, and receives delivery. No direct vendor interaction.

The platform runs on web, WhatsApp, and Telegram, using microservices via Docker.

Stack:
- Frontend: React + TailwindCSS
- Backend: Node.js + Express
- DB: PostgreSQL (main), MongoDB (optional), Redis (cache)
- API Gateway: Node or NGINX
- 3rd Party: Twilio (WhatsApp), Telegram, Car API (NHTSA), Paystack/MoMo
```

---

## 🧱 STEP 3: Generate Folder Structure
```
partkasa/
├── docker-compose.yml
├── api-gateway/
├── client-web/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
├── user-service/
├── vendor-service/
├── search-service/
├── order-service/
├── payment-service/
├── delivery-service/
├── notification-service/
├── shared/
│   ├── db/
│   ├── auth/
│   └── middleware/
├── .env.example
└── README.md
```

---

## 🐳 STEP 4: Generate `docker-compose.yml`
```
Create services:
- api-gateway
- client-web
- user-service
- vendor-service
- search-service
- order-service
- payment-service
- delivery-service
- notification-service
- postgres
- redis

Expose ports, mount volumes, and share environment variables.
```

---

## 🧪 STEP 5: Install Common Dependencies

For each backend service:
```
npm init -y
npm install express cors dotenv axios
npm install sequelize pg pg-hstore
npm install jsonwebtoken bcrypt
npm install multer
```

For services using Redis or bots:
```
npm install redis
npm install twilio node-telegram-bot-api nodemailer
```

For the React frontend:
```
npx create-react-app client-web
cd client-web
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 👤 STEP 6: Build User Service
```
Routes:
- POST /register
- POST /login
- GET /profile (JWT protected)

Use PostgreSQL, JWT authentication, and Sequelize ORM.
```

---

## 🏪 STEP 7: Build Vendor Service
```
Routes:
- POST /vendor/register
- POST /vendor/login
- POST /vendor/parts
- GET /vendor/parts

Fields: name, part number, image URL, price, location, compatible cars, delivery ETA, stock count
```

---

## 🔍 STEP 8: Build Search Service
```
Route: GET /search?make=&model=&year=&part=

- Call car lookup API (NHTSA or Auto.dev)
- Cache search results in Redis
- Return listings from parts DB
```

---

## 🛒 STEP 9: Build Order Service
```
Routes:
- POST /order
- GET /order/history
- PATCH /order/:id/status

Track: user, part, vendor, amount, status, timestamps
```

---

## 💰 STEP 10: Build Payment Service
```
Routes:
- POST /payment/initiate
- PATCH /payment/webhook

Use mock Paystack or MoMo flow.
Update order status on success.
```

---

## 🚚 STEP 11: Build Delivery Service
```
Routes:
- POST /delivery/assign
- PATCH /delivery/:id/status

Track rider, delivery state, ETA
```

---

## 📢 STEP 12: Build Notification Service
```
Route: POST /notify

Send updates via:
- Twilio WhatsApp
- Telegram Bot
- Email (SMTP)
```

---

## 💻 STEP 13: Build Client Web Frontend
```bash
# Create React app
npx create-react-app client-web
cd client-web

# Install dependencies
npm install @heroicons/react axios react-router-dom @headlessui/react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start the development server
npm start
```

Pages:
1. Search (dropdowns + input)
2. Results list (with filter)
3. Checkout (payment + delivery)
4. User profile (view orders)
5. Vendor dashboard (upload parts)

Use TailwindCSS + Axios + Router.

---

## 🔗 STEP 14: Link Project with GitHub

```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/partkasa.git
git branch -M main
git push -u origin main
```

---

## 🔐 STEP 15: Setup .env and Configuration

Install `dotenv`:
```
npm install dotenv
```

In each service:
```js
require('dotenv').config();
```

---

### Sample `.env.example`:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=partkasa_db
DB_HOST=postgres
DB_PORT=5432

JWT_SECRET=your_jwt_secret
TOKEN_EXPIRES_IN=1d

REDIS_HOST=redis
REDIS_PORT=6379

CAR_API_KEY=your_api_key
CAR_API_URL=https://vpic.nhtsa.dot.gov/api/

PAYSTACK_SECRET_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+233XXXXXXX
TELEGRAM_BOT_TOKEN=your_bot_token
```

---

## 🚀 STEP 16: Final Test and Launch
```
docker-compose up --build
```

Use Postman or browser to test:
- Registration, login, part upload
- Search functionality
- Order placement
- Delivery status update
- Payment confirmation
- WhatsApp/Telegram messages
```

# ✅ Your MVP will be ready at this point
