# LI.FI Technical assignment done by Kiryl Sauko

## Application starting
To start the application you need to follow next steps. <br />
1) Make sure to configure your env variables by creating `.env` file in the root folder of the project. All needed variables located in the `.env.example` file. Ideally you would need to create a new wagmi application and use the project id in `.env`, but since it's a home-assignment project I left my project key in `.env.example` to make the setup quicker. In the real project I woudln't do this of course.<br />
2) Install all dependencies:
```bash
npm i
```
3) Run the project locally:
```bash
npm run dev
```
4) Use the gotten link in the console to react the application. By default it's [http://localhost:5173/](http://localhost:5173/).

## Application testing
To test the application you need to follow next steps. <br />
1) Install all dependencies:
```bash
npm i
```
2) Start tests:
```bash
npm run test
```
Also, if you want to see the coverage by tests you need to use:
```bash
npm run test-coverage
```

## Design decisions
Since the requirements were to create a project with React and TypeScript I chose to use [vite](https://vite.dev/). It's a tool that allows devs to easy and quick setup brand new frontend projects. <br />
Then I started thinking about the store management. There are tons of options for that but in the end I chose the simplest way in my opinion - react hooks wrapped into contexts. Reason why I chose it:
1) No need to install an external package for that;
2) Easy to use;
3) Fits good for small/medium applications;
4) Also, after some research I recognised that libraries for EVM and Solana use also contexts for that and I wanted to keep our custom store consistent.

Other things in the project structure are quite usual: `components` folder for components, `services` folder for services and etc.

Also, worth mentioning that I always write details commits which include my thoughts that popped up during the implementation. Also, the changes in commits aren't mixed up with each other and they are quite accurate to the commit title and body,
so you can find some explanations there as well.

## Wallet connectivity
In the application the user can connect their accounts on EVM, Solana and Bitcoin. <br />
EVM and Solana use `wagmi` and `viem` packages for this logic. Those 2 chains support many different wallets, <br />
Bitcoin uses `@stacks/connect` package. Sadly the package supports only 3 wallets. In the beginning I wanted to use the `bigmi` package for bitcoin connectivity, but the documentation for this package is not the best and after hours that I spent on trying to understand how this library works I decided to try something else to don't waste all time for understanding of how this library works.

The main challenge here was the research. I mostly worked with EOSIO chains and I had to spend some time for research about EVM, Solana and Bitcoin in frontend applications. <br />

## Token list
There is an interesting story about that. When I started implementing this task I used LI.FI api. So, I created all requests manually in the application by using `fetch` and the APIs url, you can see how it was [here](https://github.com/kirillsavko/li.fi/commit/16295079a39b177a380f26e0f0dc8b8869d7f572#diff-86755906882c2ad03556cb294809b536bb5a654c94a829cb40a2da09632821d4). <br />
Then I found out the `@lifi/sdk` package super randomly, I checked the docs and I recognised it suits for my application even better than my solution! So, [here](https://github.com/kirillsavko/li.fi/commit/6f333bd36c67c8cf8816901c951cfcc148fa8b96#diff-764761d79ed791ea154187526b088322dba3bebe94f9d38ab22120554aba77c7) I rewrote logic of getting tokens to use the SDK and the SDK is also used for fetching balances, but I'll talk about this below. <br />
I didn't really have any big challenges here since I already knew how to deal with rendering of big lists. Just this funny story of the API and SDK 😄

## Display balances
For displaying balances the LI.FI SDK was used to get balances for the particular tokens when the user connects a wallet and UI reacts on that and updates it.
I didn't have any challenges here.

## Write unit tests
I think it was the task I spent the most time on and specifically on configuring jest into the project, tests itself were written quite fast. I haven't configured jest in projects for quite a while since it's the type of task that you do only once per project in the very beginning and then just forget about that. <br />
But it the end I managed tests work as expected in the application and covered the main logic by tests.  
