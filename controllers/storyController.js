const model = require('../models/story')
const { DateTime } = require("luxon");

exports.home= (req,res)=>{
    // res.send("Stories are displayed");
    res.render('index')
    
};

exports.index= (req,res)=>{
    // res.send("Stories are displayed");
    let stories = model.find();
    let categories = model.categories();
    console.log(categories)
    console.log(stories)
    console.log(categories)
    res.render('./story/events',{stories, categories})
    
};

exports.contact = (req, res) => {
    res.render('contact')
};

exports.about = (req, res) => {
    res.render('about')
};
// get /stories/new
exports.new = (req,res)=>{
    // res.send('send a form to create a story')
    res.render('./story/newEvents') 
};

// post /stories
exports.create = (req,res)=>{
    //  res.send("stories created")
    let story = req.body;
    let image =  "/images/" + req.file.filename;
    model.save(story, image);
    res.redirect('/stories/')
};

//get /stories/id get stories by id
exports.show  = (req,res,next)=>{
    let id = req.params.id
    console.log(id)
    let raw_story = model.findById(id)
   if(raw_story){
    let story = Object.assign({}, raw_story);
    story.date = DateTime.fromSQL(story.date).toFormat('LLLL dd, yyyy');
    story.startTime = DateTime.fromSQL(story.startTime).toFormat('hh:mm a');
    story.enddate = DateTime.fromSQL(story.enddate).toFormat('LLLL dd, yyyy');
    story.endTime = DateTime.fromSQL(story.endTime).toFormat('hh:mm a');
    res.render('./story/eventlist',{story})
   }
   else{
    let err = new Error("Cannot find story with id:"+ id)
    err.status = 404
    next(err)
   }
   
};

//update /stories/:id/edit update form by id
exports.edit = (req,res,next)=>{
    let id = req.params.id
    let story = model.findById(id)
    
   if(story){
    res.render('./story/edit',{story})
   }
   else{
    let err = new Error("Cannot find story with id:"+ id)
    err.status = 404
    next(err)
   }
};

//update /stories/:id/edit update story identified by id
exports.update = (req,res,next)=>{
    // res.send("update the existing story")
    let id =req.params.id;
    let story = req.body;
    if (req.file) {
        updatedStory_image = "/images/" + req.file.filename; 
    } else {
        updatedStory_image = req.body.currentimage; 
    }
    console.log("imagesss");
    if(model.update(id,story, updatedStory_image)){
        res.redirect('/stories/'+id)
    }
    else{
        let err = new Error("Cannot find story with id:"+ id)
    err.status = 404
    next(err)
    }
    
};

//delete /stories/:id delete existing story by id
exports.delete = (req,res,next)=>{
    let id = req.params.id;
    console.log(id);
    console.log("delete");

    if(model.deleteById(id)){
        res.redirect('/stories')
    }
    else{
        let err = new Error("Cannot find story with id:"+ id)
    err.status = 404
    next(err)
    }
};

