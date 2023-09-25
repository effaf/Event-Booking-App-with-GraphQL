const User = require('../../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

createUser : async (args, req ) => {

        // if(!req.isAuth){
        //     throw new Error("Authentication failed");
        // }
        try
        {
            const currentUser = await User.findOne({email:args.userInput.email});
            if(currentUser){

                    throw new Error("User Exists")
            }else{
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
                const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                })
                const result = await user.save()
                return {...result._doc, password:null, _id:result.id}

            }
        }

        catch(err){
            throw err
        }
    
},

login : async (args) => {

    try{
        const user = await User.findOne({email : args.email});

        if(!user){
                throw new Error("User email does not exist"); 
            }
        const isEqual = await bcrypt.compare(args.password, user.password);
        if(!isEqual){
            throw new Error("Password is incorrect");
        }
        const token = jwt.sign({
            userId:user.id,
            email:user.email
        },'myPrivateHashKey',{ expiresIn:'1h' })

        return {
            userId:user.id,
            token:token,
            tokenExpiration: 1
        }
        
    }catch(err){
        throw err;
        }
    }   
}
