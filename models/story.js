const {DateTime} = require('luxon')
const {v4:uuidv4} = require('uuid')
const categories = ['Conference','Recycle Challenge'];


const stories = [
    {
        id:'1',
        title:'Green Innovation Conference', 
        category: 'Conference',
        host:"ADK",
        location:"512",
        date:'2020-08-13',
        startTime:'05:15',
        enddate:'2020-08-13',
        endTime:'06:15', 
        image:'/images/digital_innovation.png',
        content:"The Green Innovation Conference showcases advanced eco-friendly technologies and fosters collaboration for a sustainable future.",
        created: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'2',
        title:'Digital Recycling Symposium', 
        category: 'Conference',
        host:"SVM",
        location:"513",
        date:'2020-08-14',
        startTime:'05:17',
        enddate:'2020-08-13',
        endTime:'06:17', 
        image:'/images/recycling_digital.png',
        content:"The Digital Recycling Symposium brings together leaders to tackle electronic waste challenges and drive innovation for sustainable technology disposal and recycling.",
        created: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'3',
        title:'Sustainable Living Forum', 
        category: 'Conference',
        host:"SHP",
        location:"514",
        date:'2020-08-15',
        enddate:'2020-08-13',
        startTime:'05:19',
        endTime:'06:19', 
        image:'/images/sus_living.png',
        content:"The Sustainable Living Forum gathers experts and enthusiasts to share eco-friendly practices and innovative solutions, inspiring collective action for environmental conservation and promoting sustainable lifestyles.",
        created: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id:'4',
        title:'Eco-Friendly Product Fair', 
        category: 'Recycle Challenge',
        host:"MR",
        location:"515",
        date:'2020-08-16',
        startTime:'05:20',
        enddate:'2020-08-13',
        endTime:'06:20', 
        image:'/images/ecofriendly.png',
        content:"The Eco-Friendly Product Fair features a range of sustainable offerings from diverse companies, promoting green alternatives and responsible consumption while supporting businesses committed to sustainability.",
        created: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    
    },
    {
        id:'5',
        title:'Green Tech Hackathon', 
        category: 'Recycle Challenge',
        host:"MP",
        location:"516",
        date:'2020-08-17',
        startTime:'05:21',
        enddate:'2020-08-13',
        endTime:'23:21', 
        image:'/images/green_tech.png',
        content:"The Green Tech Hackathon fosters collaboration among participants to create innovative technology solutions tackling environmental challenges, promoting sustainability and creativity in a competitive atmosphere..",
        created: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)

    },
    {
        id:'6',
        title:'Digital Recycling Challenge', 
        category: 'Recycle Challenge',
        host:"MLC",
        location:"517",
        date:'2020-08-18',
        startTime:'05:22',
        enddate:'2020-08-13',
        endTime:'06:22', 
        image:'/images/recycle.png',
        content:"The Digital Recycling Challenge promotes inventive approaches to repurpose electronic waste, fostering sustainability and responsible disposal practices in technology consumption.",
        created: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    }
];

exports.find = () => stories;
exports.categories = () => categories;

exports.findById = id => stories.find(story => story.id === id)
exports.save = function(story, image){
    story.id = uuidv4();
    story.created = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);

    story.date = DateTime.fromISO(story.startTime).toFormat('yyyy-MM-dd'); 
    story.startTime = DateTime.fromISO(story.startTime).toFormat('HH:mm'); 
    story.enddate = DateTime.fromISO(story.endTime).toFormat('yyyy-MM-dd'); 
    story.endTime = DateTime.fromISO(story.endTime).toFormat('HH:mm'); 
    story.image = image;
    stories.push(story);
    if(categories.indexOf(story.category) === -1){
        categories.push(story.category);
    }
}
exports.update = function(id,newStory, image){
    let story = stories.find(story => story.id === id)
    if(story){
        story.title = newStory.title;
        story.content = newStory.content;
        story.host = newStory.host;
        story.location = newStory.location;
        story.date = DateTime.fromISO(newStory.startTime).toFormat('yyyy-MM-dd'); 
        story.startTime = DateTime.fromISO(newStory.startTime).toFormat('HH:mm'); 
        story.enddate = DateTime.fromISO(newStory.endTime).toFormat('yyyy-MM-dd'); 
        story.endTime = DateTime.fromISO(newStory.endTime).toFormat('HH:mm'); 
        story.category = newStory.category;
        if (image) {
            story.image = image;
        }
        if(categories.indexOf(newStory.category) === -1){
            categories.push(newStory.category);
        }
        
        categories.forEach(category => { 
            if(!stories.some(story => story.category === category)){
                let categoryIndex = categories.indexOf(category);
                if(categoryIndex !== -1){
                    categories.splice(categoryIndex, 1);
                }
            }
        }); 
        
        console.log(story);
        return true;
    }
    else{
        return false;
    }
}

exports.deleteById = function(id){
    let index = stories.findIndex(story=> story.id===id)
    if(index !== -1){
        stories.splice(index,1);
        return true
    }
    else{
        return false;
    }
}
