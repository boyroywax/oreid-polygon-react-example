import express, { Request, Response } from 'express'
// import addProxyRoutes from './src/setupProxy.js';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || process.env.REACT_APP_PORT

try {
    const app = express();

    app.use(cors())

    // addProxyRoutes(app) // shares setup with Create React App dev server

    // Hosts Frontend - Static files built with npm run build
    app.use('/', express.static(`${__dirname}`));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/index.html`));
    });

    app.listen(PORT, () => {
        console.log( `Service is now running on {server}:${PORT}` );
    });
} catch (error) {
    console.log(error);
}