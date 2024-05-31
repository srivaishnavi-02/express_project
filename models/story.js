const mongoose = require('mongoose');
const Rsvp = require('./rsvp');
const Schema = mongoose.Schema;

const storySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Virtual Fair', 'Conference', 'Webinar', 'Hackathon', 'Recycle Challenge'],
  },
  // host: {type: Schema.Types.ObjectId, ref: 'User', required:true},

  host: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  }
}, { timestamps: true });

storySchema.pre('deleteOne', function(next) {
  let id = this.getQuery()['_id'];
  Rsvp.deleteMany({ story: id}).exec();
  next();
});

module.exports = mongoose.model('Story', storySchema);
