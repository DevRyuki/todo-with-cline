# Todo App with Next.js, Drizzle ORM, and PostgreSQL

This is a [Next.js](https://nextjs.org) project using Drizzle ORM with PostgreSQL for database operations.

## Getting Started

### Database Setup

This project uses Docker to run PostgreSQL. To start the database:

```bash
# Start PostgreSQL in Docker
npm run db:start

# View database logs
npm run db:logs

# Stop the database
npm run db:stop
```

### Database Migrations

After starting the database, you need to run migrations:

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

### Development Server

Once the database is running and migrations are applied, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Drizzle Studio

You can use Drizzle Studio to view and manage your database:

```bash
npm run db:studio
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
