const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User ({email, username});
        const  registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" ,"Welcome To WanderLust");
            res.redirect("/listings");
        });
        
        }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
};

module.exports.renderLoginForm =  (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome Back To wanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res,next)=>{
    req.logout((error) =>{
        if(error){
          return  next (error);
        }
        req.flash("success","You are logout ");
        res.redirect("/listings");
    });
};
