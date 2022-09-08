const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();

    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        //Read and parse for body
        this.app.use(express.json());

        //Public directory
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usersPath, require('../routes/user'));

    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Process running on port',this.port);
        });
    }

}

module.exports  = Server;