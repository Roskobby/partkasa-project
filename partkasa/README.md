# PartKasa.com - Auto Parts Marketplace

PartKasa is a modular, containerized auto parts marketplace that allows users to search for car parts by make, model, year, part name, or part number. Vendors can upload listings with images, location, stock status, delivery ETA, and price. Users can select parts, pay online, and receive delivery without direct vendor interaction.

## Architecture

The platform is built using a microservices architecture with Docker containerization. Each service is responsible for a specific domain and communicates with other services through RESTful APIs.

### Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Databases**: 
  - PostgreSQL (main database)
  - MongoDB (for search service)
  - Redis (for caching)
- **API Gateway**: Node.js Express
- **Third-Party Integrations**: 
  - Twilio (WhatsApp)
  - Telegram
  - Car API (NHTSA)
  - Paystack/MoMo (Payments)

## Services

### API Gateway
The API Gateway serves as the entry point for all client requests. It routes requests to the appropriate microservices and handles cross-cutting concerns like authentication, logging, and request/response transformation.

### Client Web
The web client is built with React and TailwindCSS, providing a responsive and modern user interface for customers to search for and purchase auto parts.

### User Service
The User Service handles user authentication, registration, and profile management. It uses PostgreSQL for data storage and JWT for authentication.

### Vendor Service
The Vendor Service manages vendor profiles, listings, and inventory. Vendors can create and manage their auto parts listings through this service.

### Search Service
The Search Service provides powerful search capabilities for auto parts based on various criteria like vehicle compatibility, part name, part number, etc. It uses MongoDB for efficient text search and indexing.

### Order Service
The Order Service manages the order lifecycle, from creation to fulfillment. It tracks order status and communicates with other services like Payment and Delivery.

### Payment Service
The Payment Service handles payment processing through integrations with payment providers like Paystack and Mobile Money.

### Delivery Service
The Delivery Service manages the delivery of auto parts to customers, tracking shipment status and providing delivery estimates.

### Notification Service
The Notification Service sends notifications to users and vendors through various channels like email, SMS, WhatsApp, and Telegram.

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/partkasa.git
   cd partkasa
   ```

2. Create a `.env` file based on the `.env.example`:
   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration values.

4. Start the services using Docker Compose:
   ```
   docker-compose up -d
   ```

5. Access the web client at `http://localhost:3000` and the API at `http://localhost:8000/api`.

## Development

### Running Services Individually

Each service can be run individually for development purposes:

```
cd <service-directory>
npm install
npm run dev
```

### API Documentation

API documentation is available at `http://localhost:8000/api-docs` when the API Gateway is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
