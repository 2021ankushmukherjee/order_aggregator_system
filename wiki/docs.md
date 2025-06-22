System Design – Distributed Order Aggregator
Overview
This system is a Distributed Order Aggregator that synchronizes stock data from multiple vendors, allows order creation, and ensures consistent stock deduction from both central and vendor inventories.

Features
Vendor Stock Aggregation
Vendors are mocked (via local API or seeded data) and their stock is regularly synced to a central stock repository.

Product Stock View
Users can view the available stock for all products via the /stock endpoint.

Order Creation
When an order is placed via /order, the system:

Verifies if the requested product quantity is available in the local stock.

Atomically reserves the stock.

Publishes the order to a RabbitMQ queue for async processing.

Order Fulfillment Worker
A background worker service:

Consumes orders from the queue.

Selects the vendor with the highest available stock.

Deducts stock from that vendor.

Ensures no over-selling through transactional database operations.

Consistency & Availability
Strong consistency is enforced between local and vendor stock using transactional operations.

Vendor stock is always validated before deduction.

RabbitMQ ensures each order is processed once (ack/nack).

The system supports parallel order processing safely without race conditions.

🚀 Running Instructions (Docker)
Step 1: Run pgAdmin for DB GUI (optional)
bash
Copy
Edit
docker compose up -d order-pgadmin
Step 2: Build Backend Services
bash
Copy
Edit
docker compose build order-api-gateway order-worker
Step 3: Run Backend Services
bash
Copy
Edit
docker compose up -d order-api-gateway order-worker
Step 4: Open Swagger Documentation
Visit:

bash
Copy
Edit
http://localhost:3000/v1/api/swagger
From there, you can:

Sync stock from vendors

View all product stock

Place orders

View stock deduction after order processing

