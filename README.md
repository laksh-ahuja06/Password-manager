# How to start the password manager

1) npm install
2) npm install prisma @prisma/client @prisma/adapter-better-sqlite3 dotenv
3) npm install prisma@latest @prisma/client@latest @prisma/adapter-better-sqlite3@latest
4) npm install -D @types/better-sqlite3
5) npm install --save-dev prisma@7.10.0 --save-exact
6) npm install @prisma/client@7.10.0 --save-exact
7) npx prisma generate
8) npx prisma migrate deploy
9) npm install electron concurrently cross-env wait-on

## How to start prisma studio: 

npx prisma studio --url="file:///(File directory)/password-manager/dev.db"

For example:
npx prisma studio --url="file:///Users/apple/Desktop/NextJS-Projects/Password-manager/dev.db"

## .env file contents
DATABASE_URL="file:./dev.db"
VAULT_ENCRYPTION_KEY="dc0db5dc35f343634d20ab0b6e9899e9a9a905c8142f604b7b833d66d49948c6"

# Password-manager-using-Electron
