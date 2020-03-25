import express from 'express';
import redis from 'redis';
import Rewards from '../getRewards.js';

var router = express.Router();
var redisClient = redis.createClient();

/**
 * @api {get} /users/:id/rewards Get and create the user rewards.
 * @apiGroup Users
 * 
 * @apiParam {String} User's id.
 * @apiParam {String} at Date of rewards availability.
 * 
 * @apiSuccess {Object} JSON rewards of the week response.
  
 * @apiError {String[]} errors Error messages about what went wrong.
 * 
 */

 router.get('/:userId/rewards', (req, res) => {
     let at = req.query.at;
     let id = req.params.userId;

     if(!at){
        res.status(400).json({errors: ['Not found']});
     }else{
        let dateObject = new Date(at);
        if(dateObject instanceof Date){
            // Fisrt check if the id (user and date) are already on the store
            let user = { id: id, date: dateObject };
            let rewards = new Rewards(user);
            let dbId = rewards.getId();
            redisClient.get(dbId, (err, resGet) => {
                 if(err){
                    res.status(500).json({error: err});                             
                    return;    
                 }
                if(resGet){
                    res.status(200).json(JSON.parse(resGet));                             
                }else{
                    // if not in the store create and set
                    let value = rewards.getValue();
                    redisClient.set(dbId, value, (errSet, resSet) => {
                        if(err){
                            res.status(500).json({error: errSet});                             
                            return;    
                        }else{
                            res.status(200).json(JSON.parse(value));      
                        }
                    });
                }
            });
        }else{
            res.send("Not a valid Date Format");
        }    
     }
 });

 export default router;
