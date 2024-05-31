const Story = require('../models/story');
const Rsvp = require('../models/rsvp');
const { DateTime } = require("luxon");

exports.home= (req,res)=>{
    res.render('index')    
};

exports.index = (req, res, next) => {
    Promise.all([
        Story.distinct("category"),
        Story.find()
    ])
    .then(([categories, stories]) => {
        res.render('./story/events', { stories, categories });
    })
    .catch(err => next(err));
};

exports.contact = (req, res) => {
    res.render('contact')
};

exports.about = (req, res) => {
    res.render('about')
};
// get /stories/new
exports.new = (req,res)=>{
    res.render('./story/newEvents') 
};

// post /stories
exports.create = (req, res, next)=>{
    console.log(req.body);

    let today = new Date(DateTime.now().toFormat("yyyy-LL-dd"));;
    let date = new Date(req.body.date);

    if(date.getTime() < today.getTime()){
        req.flash('error', 'Selected date must be greater than today\'s');
        res.redirect('back');
    }
    

    let image =  "/images/" + req.file.filename;
    console.log(image);
    let story = new Story(req.body);
    story.image = image;
    story.host = req.session.user;
    story.save()
    .then(story=> {
        req.flash('success', 'You have successfully created a new connection');
        res.redirect('/stories');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    console.log(id);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    Story.findById(id).populate('host', 'firstName')
    .then(raw_story => {
            if (!raw_story) {
                let err = new Error("Cannot find story with id: " + id);
                err.status = 404;
                return next(err);
            }
            let story = raw_story.toObject();     
            console.log(story);
            console.log(story.host);

            Rsvp.countDocuments({ status: 'Yes', story: id })
            .then(rsvpCount=>{
                return res.render('./story/eventlist', {story, rsvpCount});
            })
            .catch(err=>next(err));

            // console.log(story);
            // res.render('./story/eventlist', { story });
        })
        .catch(err => {
            console.error(err); 
            err.status = 500;
            next(err);
        });
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    Story.findById(id).exec()
        .then(raw_story => {
            if (raw_story) {
                const story = raw_story.toObject();
                story.startTime = DateTime.fromJSDate(story.startTime).setZone('America/New_York').toFormat("yyyy-MM-dd'T'HH:mm");
                story.endTime = DateTime.fromJSDate(story.endTime).setZone('America/New_York').toFormat("yyyy-MM-dd'T'HH:mm");
                console.log(story);
                return res.render('./story/edit', { story });
            } else {
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => {
            console.error(err);
            return next(err);
        });
};

exports.update = (req, res, next)=>{
    let story = req.body;
    let id = req.params.id;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    if (req.file) {
        updatedStory_image = "/images/" + req.file.filename; 
    } else {
        updatedStory_image = req.body.currentimage; 
    }
    story.image = updatedStory_image;
    Story.findByIdAndUpdate(id, story, {useFindAndModify: false, runValidators: true})
    .then(story=>{
        if(story) {
            req.flash('success', 'Event has been successfully updated');
            res.redirect('/stories/'+id);
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            next(err);
        }
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    Story.findByIdAndDelete(id,{useFindAndModify: false}), Rsvp.deleteMany({story:id})
    // Story.findByIdAndDelete(id, {useFindAndModify: false})
    .then(story =>{
        if(story) {
            res.redirect('/stories');
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};


// exports.editrsvp = (req, res, next)=>{
//     console.log(req.body.rsvp);
//     let id = req.params.id;
//     rsvp.findOne({ story: id, user: req.session.user }).then(Rsvp=>{
//         if(Rsvp){
//             //update
//             rsvp.findByIdAndUpdate(Rsvp._id,{Rsvp:req.body.rsvp},{useFindAndModify: false, runValidators: true}).then(Rsvp=>{
//                 req.flash('success', 'Updated RSVP');
//                 res.redirect('/users/profile/');
//             })
//             .catch(err=>{
//                 console.log(err);
//                 if (err.name === 'ValidationError'){
//                     req.flash('error', err.message);
//                     return res.redirect('/back');
//                 }
//                 next(err);
//             })
//         }
//         else {
//             //create
//             let Rsvp_C = new rsvp({
//                 rsvp: req.body.rsvp,
//                 story: id,
//                 user : req.session.user
//             });
//             Rsvp_C.save()
//             .then(Rsvp=>{
//                 req.flash('success', 'Created RSVP');
//                 res.redirect('/users/profile/');
//             })
//             .catch(err=>{
//                 req.flash('error', err.message);
//                 next(err);
//             })

//         }
//     })
// }

exports.editrsvp = (req, res, next) => {
    let attendees = req.session.user;
    let id = req.params.id;
    let status = req.body.status;
    console.log()
    Story.findById(id)
    .then(story=>{
        if(story) {
            if(story.host==attendees){
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }else{
                Rsvp.updateOne({ story: id, attendees: attendees}, 
                    { $set: { story: id, attendees: attendees, status: status }}, 
                    { upsert: true })
                .then(rsvp=>{
                    if(rsvp) {
                        if(rsvp.upsertedId){
                            req.flash('success', 'Successfully created an RSVP for this connection!');
                        }else{
                            req.flash('success', 'Successfully updated an RSVP for this connection!');
                        }
                        res.redirect('/users/profile');
                    } else {
                        req.flash('error', 'There is some problem in creating an RSVP for this connection');
                        res.redirect('back');
                    }
                })
                .catch(err=> {
                    if(err.name === 'ValidationError'){
                        req.flash('error', err.message);
                        res.redirect('back');
                    }else{
                        next(err);
                    }
                });
            }
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
    
};



exports.deletersvp = (req, res, next) => {
    let id = req.params.id;
    Rsvp.findByIdAndDelete(id, {useFindAndModify: false})
    .then(rsvp =>{
        if(rsvp) {
            req.flash('success', 'RSVP has been sucessfully deleted!');
            res.redirect('/users/profile');
        } else {
            let err = new Error('Cannot find an RSVP with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>{
        console.log(err);
        if (err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }

        next(err);
    })
};


// exports.deletersvp = (req, res, next)=>{
//     let id = req.params.id;
//     Rsvp.findOneAndDelete({ story: id, user: req.session.user })
//     .then(Rsvp=>{
//         req.flash('success', 'Deleted RSVP');
//         res.redirect('/users/profile/');
        
//     })
//     .catch(err=>{
//         console.log(err);
//         if (err.name === 'ValidationError'){
//             req.flash('error', err.message);
//             return res.redirect('/back');
//         }
//         next(err);
//     })
// }