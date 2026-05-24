# Inventory Management System

A full-stack Inventory Management System built using **Next.js, Prisma, PostgreSQL, and Tailwind CSS**.

## Features

* View products and warehouse stock
* Reserve products in real time
* Confirm or cancel reservations
* Live stock tracking
* Responsive modern UI
* REST API integration
* Prisma ORM with PostgreSQL database
* Deployed on Vercel

## Tech Stack

* Next.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Tailwind CSS
* Vercel

## Installation

```bash
git clone https://github.com/pratyakshagupta16/allo-inventory.git
cd allo-inventory
npm install
```

## Setup Environment Variables

Create a `.env` file and add:

```env
DATABASE_URL="postgresql://postgres.dymhpdreqljrlipftxkf:pratyaksha16@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

```

## Run the Project

```bash
npm run dev
```

## Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Deployment

The project is deployed on Vercel.

Live Demo:

```text
https://allo-inventory-puce.vercel.app
```

## Author

Pratyaksha Gupta
GitHub: [https://github.com/pratyakshagupta16](https://github.com/pratyakshagupta16)
