# 🧩 Distributed Order Aggregator System

## Overview

This system is a **Distributed Order Aggregator** built using NestJS, PostgreSQL, and RabbitMQ.

- Syncs product stock from multiple vendors (mocked or seeded)
- Aggregates and manages stock centrally
- Accepts product orders
- Deducts stock atomically from both central and vendor sources
- Ensures high availability, concurrency safety, and consistent state using message queues

---

## ✨ Features

### ✅ Vendor Stock Aggregation
- Simulates multiple vendors with mock APIs or seed data
- Stores vendor-specific stock
- Aggregates total product stock centrally for user queries

### 📦 Product Stock
- `/stock` — View current product stock from all vendors
- `/vendor-stock` — View vendor-wise stock breakdown

### 🛒 Order API
- `POST /order`
  - Takes product ID and quantity
  - Validates and reserves stock
  - Publishes order to RabbitMQ queue
  - Prevents double selling using atomic transactions

### ⚙️ Order Worker
- Subscribes to `order_queue`
- Selects vendor with highest available stock
- Deducts required quantity (even split across multiple vendors)
- Marks order as successful
- Supports retry on failure using RabbitMQ `nack`

---

## 🛡️ Consistency & Availability

- **Strong consistency**: Orders are processed using DB transactions
- **Vendor-aware availability**: Picks from the vendor with highest stock or distributes across vendors
- **Concurrency-safe**: Prevents race conditions during stock deductions
- **At-least-once processing**: RabbitMQ ensures reliable delivery and retries

---

## 🐳 Run With Docker

### 1️⃣ Start pgAdmin (Optional)
```bash
docker compose up -d order-pgadmin
```

### 2️⃣ Build Backend Services

```bash
docker compose build order-api-gateway order-worker
```

### 3️⃣ Run API Gateway and Worker

```bash
docker compose up -d order-api-gateway order-worker
```

### 4️⃣ Open Swagger Docs

```bash
http://localhost:3000/v1/api/swagger
```

📌 Notes
Uses Docker volumes for persistent PostgreSQL and RabbitMQ data

Configuration is handled via environment variables (see docker-compose.yml)

Seed data and sync logic available under libs/vendor/src/seeds

Vendor stock sync and mock data handled in service layer

