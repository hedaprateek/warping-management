# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



/* Sequelize */


npx sequelize-cli model:generate --name Party --attributes pmttype:string,desc:string

npx sequelize-cli model:generate --name MASTER_EMPLOYEE --attributes firstname:string,lastname:string,startdate:date,enddate:date,phonenumber:string

npx sequelize-cli model:generate --name DAILYATTENDANCE --attributes empid:integer,firstin:date,lunchout:date,lunchin:date,finalout:date,workingtime:real,breaktime:real

npx sequelize-cli model:generate --name DAILYWAGES --attributes empid:integer,wagedate:date,wages:real

npx sequelize-cli model:generate --name TRASNACTION --attributes empid:integer,pmttypeid:integer,compid:integer,transdate:date,amount:real,desc:string

/** Seeders **/ npx sequelize-cli seed:generate --name default-users npx sequelize-cli seed:generate --name default-wagetype
npx sequelize-cli seed:generate --name default-settings


npx sequelize-cli model:generate --name Outward --attributes partyId:integer,weaverId:integer,qualityId:integer,date:dateonly,empConeWt:real,emptyBagWt:real,netWt:real
npx sequelize-cli model:generate --name Settings --attributes companyName:string,companyAddress:string,companyGst:string,companyContact:string
npx sequelize-cli seed:generate --name default-settings

npx sequelize-cli model:generate --name OutwardBags --attributes outwardId:integer,cones:integer,date:dateonly,grossWt:real

npx sequelize-cli migration:create --name add-new-columns
npx sequelize-cli migration:create --name add-new-columns2
npx sequelize-cli migration:create --name add-new-columns-inward
