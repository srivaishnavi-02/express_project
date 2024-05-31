const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    attendees: {type: Schema.Types.ObjectId, ref: 'User'},
    story: {type: Schema.Types.ObjectId, ref: 'Story'},
    status: {type: String, required: [true, 'Status is required']},
},
{timestamps: true}
);



module.exports = mongoose.model('Rsvp', rsvpSchema);