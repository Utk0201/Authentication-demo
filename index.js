const express=require('express');
const app=express();
const User=require('./models/user');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const session= require('express-session');

mongoose.connect('mongodb://localhost:27017/authDemo',{
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(()=>{
    console.log("Mongo connection open");
})
.catch(err=>{
    console.log("mongo error");
    console.log(err);
})

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:true}));
app.use(session({secret:'tmpSecret'}));

///////////routes start after middlewares////////////
const requireLogin=(req,res,next)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    next();
}

app.get('/',(req,res)=>{
    res.send("Home!!");
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',async (req,res)=>{
    const {username,password}=req.body;
    // const hash=await bcrypt.hash(password,12);
    const user=new User({username,password})
    await user.save();
    req.session.user_id=user._id;
    // res.send(hash);
    res.redirect('/');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    const foundUser=await User.findAndValidate(username,password);
    // const user=await User.findOne({username});
    // const valid=await bcrypt.compare(password,user.password);
    if(foundUser){
        req.session.user_id=foundUser._id;
        // res.send("welcome!");
        res.redirect('/secret');
    }
    else{
        res.redirect('/login');
    }
})

app.post('/logout',(req,res)=>{
    // req.session.user_id=null;
    req.session.destroy();
    res.redirect('/login');
})

app.get('/secret',requireLogin,(req,res)=>{
    res.render('secret');
    // res.send('This is temporary redirect');
})
app.get('/topsecret',requireLogin,(req,res)=>{
    res.send('topSecret');
    // res.send('This is temporary redirect');
})

app.listen(3000,()=>{
    console.log('Serving @ 3k');
})