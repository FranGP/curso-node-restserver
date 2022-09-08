const mongoose = require('mongoose');

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('connected');
    }catch (err){
        console.log(err);
        throw new Error('Error de conexión en la BD.');
    }
}

module.exports = {
    dbConnection
}