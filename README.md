# Password-manager-using-Electron

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)


This project is a desktop password manager built with Next.js and Electron for securely managing passwords and API keys in one place. It provides a clean interface for organizing, viewing, and managing sensitive credentials. The application combines a modern Next.js frontend with Electron to deliver a cross-platform desktop experience. It also uses Prisma for database management and persistent storage.

## Features

- 🔐 Password management
- 🔑 API key management
- 🗂️ Organized password vault
- 🗑️ Trash/deleted items management
- 💾 Local SQLite database
- 🖥️ Desktop application using Electron
- 🗄️ Prisma ORM for database management

## Images:

<p align="center">
  <img src="passwordManager1.png" alt="passwordManager1" width="800">
</p>

<p align="center">
  <img src="passwordManager2.png" alt="passwordManager2" width="800">
</p>

## How to start the password manager

```bash
1) npm install
2) npm install prisma @prisma/client @prisma/adapter-better-sqlite3 dotenv
3) npm install prisma@latest @prisma/client@latest @prisma/adapter-better-sqlite3@latest
4) npm install -D @types/better-sqlite3
5) npm install --save-dev prisma@7.10.0 --save-exact
6) npm install @prisma/client@7.10.0 --save-exact
7) npx prisma generate
8) npx prisma migrate deploy
9) npm install electron concurrently cross-env wait-on
```

Run the server:

```bash
cd Password-manager
npm run dev
```

## How to start prisma studio: 

```text
npx prisma studio --url="file:///(File directory)/password-manager/dev.db"
```

<p align="center">
  <img src="prismaStudio1.png" alt="prismaStudio1" width="800">
</p>

<p align="center">
  <img src="prismaStudio2.png" alt="prismaStudio2" width="800">
</p>


## .env file contents (add this to the .env which was created by the initialization commands)
```text
DATABASE_URL="file:./dev.db"
VAULT_ENCRYPTION_KEY="YOUR_ENCRYPTION_KEY"
```

## Database structure

<p align="center">
  <img src="Structure.png" alt="DBStructure" width="250">
</p>

The project follows a modular Next.js App Router architecture, separating UI components, application routes, API endpoints, database logic, and desktop functionality into dedicated folders. This keeps the codebase organized, maintainable, and easier to scale.

<b>app/vault — </b> Contains the main password-vault interface/page where users can view and manage their stored credentials. <br>
<b>app/api/vault — </b> Contains the backend API routes responsible for handling vault-related operations such as retrieving, creating, updating, or deleting credentials. <br>
<b>electron/ — </b> Contains the Electron configuration and desktop-process code that wraps the Next.js application into a desktop application. <br>
<b>prisma/ — </b> Contains the Prisma database schema and migration files used to define and manage the application's database structure. <br>




