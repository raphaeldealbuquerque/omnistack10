
const axios = require('axios');
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
    async index(request,response) {
        //buscar todos os devs em um raio de 10km
        //filtrar por tecnologia
        const {github_username, techs, latitude, longitude} = request.query;
        const techsArray = parseStringAsArray(techs);

        //console.log(request.query,techsArray);
        
        let devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude,latitude], 
                    },
                    $maxDistance: 10000,
                }
            }
        });
        
        
        return response.json({ devs: devs });

        /*
        const {github_username, techs, latitude, longitude} = request.body;
    
        let dev = await Dev.findOne({github_username,longitude,latitude});
        
        return response.json(devs);*/
    }
}