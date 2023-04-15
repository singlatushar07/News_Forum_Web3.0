# Instructions to run the platform
#### **Important Info**: The stable features are in 'main' branch while the experimental features are in 'experimental' branch. I would request you to first run and test the 'main' branch, and when everythign is found working then test the features in 'experimental'
##### Features in main branch
- Adding user. Updating user. First two users will be activeValidators by default.
- Login and Register user using Postgres database.
- Adding article. Upating article. Upvote. Downvote
- Article is validated when atleast half the active validators validate it.
- Validation power given to new user when conditions met.
##### Features in experimental branch
- Add an article anonymoously.
- User profile page.(Note: When you are login with a particular user the user profile of that user will only be shown, even on changing metamask account )
- Details of the author when displaying an article.

### Notes
1. When you login/register into the platform make sure that you are switching the account in the Metamask. This won't happen automatically but is important for the working of the platform.


### Instructions for setting up and running the News Forum Web3.0 application are as follows: 

- Have Metamask extension installed in your browser. Preferably Chrome. Also add localhost:8545 to the list in Metamask. Create any three new user accounts in Metamask for testing the app. To create new user accounts in Metamask, use 3 of the 20 private keys that are displayed when you ran ‘npx hardhat node’. This is necessary to ensure that you have enough balance in your Meta mask wallet to be able to do the transactions. This process has to be repeated each time you run ‘npx hardhat node’. 
- Delete the folder /server/prisma/migrations each time you want to run an instance of the program. If not done, then one might encounter errors in 
- Firstly, download the repository from Github using the link provided: 
https://github.com/singlatushar07/News_Forum_Web3.0/ 
- Navigate to the /server and /client folders in the downloaded repository and run the "npm i" command in each folder to install the required dependencies. 
- Set up a Postgres database on your system and copy the database's URL. Add this URL to a .env file in the server folder. The .env file should contain the URL in the format: `DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"`
- When one setup up pgAdmin4, one creates a password and username. These details are to be used in the database url in the {username} and {password}.
- Navigate to the server folder in your terminal. 
- Run the command `npx prisma generate` then `npx prisma migrate dev --name init` to set up the database and ORM. 
- Start a Hardhat node using the command `npx hardhat node`. Let is run in one terminal. Open a new terminal. 
- In another terminal, deploy the smart contract on the Hardhat node using the command `npx hardhat run --network localhost scripts/deploy.cjs` and copy the contract address, that you get after deployment. Paste this deployed contract address in `client/src/App.js` in contractAddress. 
- Install `nodemon` with command `npm install -g nodemon'`. 
- Go to `/server`. Run the command `nodemon src/app.js` to start the api server.This interacts with our database(Postgres with ORM from prisma). Let this run in one terminal. 
- In another terminal, navigate to the client folder and paste the contract address in the `src/App.js` file. 
- Run the command `npm start` to start the frontend. 
