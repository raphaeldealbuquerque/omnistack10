const axios = require('axios');
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
    async index(request,response) {
        const devs = await Dev.find();
        return response.json(devs);
    },
    async store(request,response) {
        
        const {github_username, techs, latitude, longitude} = request.body;
    
        let dev = await Dev.findOne({github_username});

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
    
            const { name = login, avatar_url, bio } = apiResponse.data; 
            
            const location = {
                type: 'Point',
                coordinates:[longitude, latitude]
            }
            const techsArray = parseStringAsArray(techs);
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray, 
                location
            }); 
        }
    
        return response.json(dev);
    },
    async update(request,response){
        const {github_username} = request.body;
        let dev = await Dev.findOne({github_username});
        
        if(dev){
            let {
                techs,
                latitude = dev.location.coordinates[1],
                longitude = dev.location.coordinates[0],
                name = dev.name,
                avatar_url = dev.avatar_url,
                bio = dev.bio,

            } = request.body; 
           techs = techs == '' || techs == undefined ? dev.techs :  parseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates:[longitude, latitude]
            }
       
            dev = await Dev.update({github_username}, {
                    name,
                    bio,
                    avatar_url,
                    techs,
                    location
                }
            );
        }
        
        /*var query = {github_username}
            , update ={ $inc: {
                name: name && dev.name,
                avatar_url: avatar_url && dev.avatar_url,
                bio: bio && dev.bio,
                techs: techsArray && dev.techs,
                location: location ,
             }}
            , options = { multi: true };
          */  

        //dev = await Dev.update(query,update, options, null)
        //console.log(query,update);
        
        return response.json( dev );
    },
    async destroy(request,response){
        const {github_username} = request.query;
        let dev = await Dev.findOne({github_username});
        
        if(dev){
            dev = await Dev.deleteOne({github_username})
        }
        return response.json( dev );
    }

}