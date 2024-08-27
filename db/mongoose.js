const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://akashchawla497:Rahul2890@cluster0.marwsar.mongodb.net/EcommerceWebApi?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("mongodb connected successfully"))
.catch(err => console.error("mongodb connection error ", err))
////MONGODB_URL = "mongodb+srv://akashchawla497:Rahul2890@cluster0.byk4b.mongodb.net/EcommerceWebApi?retryWrites=true&w=majority&appName=Cluster0"