# PokerBacker: A Next.js App for Poker Financial Tracking

## Description

PokerBacker is a robust and user-friendly application designed to assist poker players who pay for others to enter tournaments (backers). This financial tracking tool helps manage and record transactions, providing a clear picture of your investment and its performance. PokerBacker is built using Next.js with React components for a seamless and responsive user experience. Bootstrapped from the T3 app setup. Thanks, Theo and co. ! :)

Hosted on [Vercel](https://poker-backer.vercel.app/)


## Screenshot
![image](https://github.com/Hard-Luck/poker-backer/assets/72257311/5882bc47-a7a7-4a7e-bd2c-4d2f3fb7e103)

## Features

- **User Authentication**: Uses Clerk for secure and reliable user authentication, ensuring data privacy and integrity.
- **Database**: Utilizes PlanetScale for database requirements, but thanks to the adaptability of our ORM layer, any SQL database could be easily integrated.
- **ORM**: Makes use of Prisma as an Object-Relational Mapping (ORM) tool, managing the data exchange between our app and the database.
- **API Handling**: Incorporates tRPC for handling API requests, providing type safety and autocompletion out-of-the-box due to its ability to infer types in the communication between the client and server.
- **Language**: Uses TypeScript throughout to enforce static typing, increasing the maintainability and robustness of the app.
- **Webhooks**: The application makes use of webhooks to automate the process and keep the data up-to-date.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repo
```sh
git clone https://github.com/hard-luck/poker-backer.git
```
2. Install NPM packages
```sh
npm install
```

## Configuration

Create a `.env` file in the root directory and update the environment variables:

```
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CHECK=your_check_value
```

## Usage

To run the application in development mode, use the following command:

```sh
npm run dev
```

## Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Clerk](https://clerk.dev/)
- [PlanetScale](https://planetscale.com/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [TypeScript](https://www.typescriptlang.org/)

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. If you have any idea for an enhancement or found a bug, please start a discussion on GitHub. Your participation enriches the project and is greatly appreciated.

## License

This project is licensed under the All Rights Reserved License - it is the proprietary property of the owner and may not be duplicated or used for profit without express permission from the owner.

## Contact

Project Link: [https://github.com/hard-luck/poker-backer](https://github.com/hard-luck/poker-backer)

Please feel free to reach out on GitHub if you have any questions or need further clarification. Happy coding!

## Acknowlegment

Once again a huge thanks to Theo and the T3 team, this app was built on the shoulders of giants. 
Much respect to [Vercel](https://vercel.com/) for such a great platform and NextJS.
