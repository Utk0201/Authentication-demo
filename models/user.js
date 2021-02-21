const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:['true','username can\'t be blank']
    },
    password:{
        type:String,
        required:['true','password can\'t be blank']
    }
})

userSchema.statics.findAndValidate= async function(username,password){
    const foundUser=await this.findOne({username}); // this refers to current user
    const isVal=await bcrypt.compare(password,foundUser.password);
    return isVal?foundUser:false;
}

userSchema.pre('save',async function(next){
    // this.password='Not your real password';
    this.password=await bcrypt.hash(this.password,12);
    next(); // call save() function
})

module.exports= mongoose.model('User',userSchema);