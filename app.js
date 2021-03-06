const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');

const cafeRoutes=require('./api/routes/cafes');
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders');
const userRoutes =require ('./api/routes/user');
const rateRoutes =require ('./api/routes/rates');


mongoose.connect('mongodb+srv://berkan:'+process.env.MONGO_ATLAS_PW+'@cluster0-gbmnd.mongodb.net/test?retryWrites=true',
{ useNewUrlParser: true }

);

mongoose.Promise=global.Promise;


app.use (morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use (bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Acess-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept, Authorization"
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Conrol-Allow-Methods','PUT, POST, PATCH , DELETE, GET');
        return res.status(200).json({});
    }   
    next();
});
app.use('/products',productRoutes );    
app.use('/orders',orderRoutes ); 
app.use('/user',userRoutes ); 
app.use('/cafes',cafeRoutes ); 
app.use('/rates',rateRoutes ); 



app.use((req,res,next)  => {

    const error = new Error('bulunamadi');
    error.status=404;                              //404 hatasi
    next(error);

});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
                message:error.message          //diger hatalar
        }
    });
});


module.exports = app;
