const Story = require('../models/story');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    } else {
        req.flash('error','You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    } else {
        req.flash('error','You need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is host of the connection
exports.isHost = (req, res, next)=>{
    let id = req.params.id;
    Story.findById(id)
    .then(story => {
        if(story){
            if(story.host == req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err=>next(err));
};


exports.isNotHost = (req, res, next)=>{
    let id = req.params.id;
    Story.findById(id)
    .then(story=>{
        if(story){
            if(story.host != req.session.user){
                return next();
        }
        else{
            let err = new Error('You are the Host of this story');
            err.status = 401;
            return next(err);
            req.flash('error', 'You are not the author of this story');
        }
        }
        else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
};