# PokerBacker: A Next.js App for Poker Financial Tracking

## Description

PokerBacker is a robust and user-friendly application designed to assist poker backers—those who sponsor players for tournament entries. This financial tracking tool helps manage and record transactions, providing a clear overview of your investments and their performance. Built with Next.js and React for a seamless and responsive user experience, PokerBacker leverages modern web technologies for optimal performance. 

[Hosted App](https://www.poker-backer.com/)

## Screenshot
![image](https://github.com/Hard-Luck/poker-backer/assets/72257311/a98934cd-9708-4d2c-936f-d9c9c9f335f0)
![image](https://github.com/Hard-Luck/poker-backer/assets/72257311/667454c3-99a4-4537-90b7-6d31f0d86257)
![image](https://github.com/Hard-Luck/poker-backer/assets/72257311/fe325f82-7751-4e2f-9fe2-779fa08dc7af)

## Features

- **User Authentication:** Secure and reliable user authentication with Clerk, ensuring data privacy and integrity.
- **Database:** Utilizes SQLite for database requirements, easily adaptable to other SQL databases via the ORM layer.
- **ORM:** Prisma for managing data exchange between the app and the database.
- **API Handling:** tRPC for handling API requests, providing type safety and autocompletion due to its ability to infer types between client and server.
- **Language:** TypeScript throughout to enforce static typing, increasing maintainability and robustness.
- **Webhooks:** Automates processes and keeps data up-to-date with webhooks.

## Getting Started

Follow these instructions to set up a copy of the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/hard-luck/poker-backer.git
   ```

2. **Install NPM packages**
   ```sh
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory and update the environment variables:
   ```sh
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CHECK=your_check_value
   ```

### Usage

To run the application in development mode:
```sh
npm run dev
```

## Built With

- **Next.js**
- **React**
- **Clerk**
- **SQLite**
- **Prisma**
- **tRPC**
- **TypeScript**

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. If you have an idea for an enhancement or found a bug, please start a discussion on GitHub. Your participation enriches the project and is greatly appreciated.

## License

This project is licensed under the All Rights Reserved License - it is the proprietary property of the owner and may not be duplicated or used for profit without express permission from the owner.

## Contact

Project Link: [https://github.com/hard-luck/poker-backer](https://github.com/hard-luck/poker-backer)

For any questions or further clarification, feel free to reach out on GitHub. Happy coding!

## Acknowledgments

A huge thanks to Theo and the T3 team for their foundational work. Much respect to Vercel for their excellent platform and to the Next.js team.

## Additional Features

- **Precommit Checks:** Utilizes Husky for precommit checks.
- **CI/CD:** Employs GitHub Actions to check merges and commits to the main branch.

