import express from 'express';
import redis from 'redis';
import Rewards from '../getRewards.js';

var router = express.Router();
var redisClient = redis.createClient();

/**
 * @api {patch} /:id/rewards/:date/redeem Update the redeemeAt value
 * based in the input date.
 * @apiGroup Users
 * 
 * @apiParam {String} id User's id.
 * @apiParam {String} date Date of availability reward.
 * 
 * @apiSuccess {Object} JSON with the updated rewards.
  
 * @apiError {String[]} errors Error messages about what went wrong.
 * 
 */

 router.patch('/:userId/rewards/:date/redeem', (req, res) => {
    let id = req.params.userId;
    let date = req.params.date;
    let dateObject = new Date(date);
    if(dateObject instanceof Date){
        let user = { id: id, date: dateObject };
        let rewards = new Rewards(user);
        let dbId = rewards.getId();        
        redisClient.get(dbId, (err, resGet) => {
            if(err){
                res.status(500).json({error: err});                             
                return;    
            }
            if(resGet){
                let data = JSON.parse(resGet);
                let updated = null;
                let inputDateString = dateObject.toISOString();
                let expired = false;
                //  Look for the data availableAt as id
                data.data.forEach((value) => {
                    if(value.redeemedAt === null && inputDateString === value.availableAt){
                        // Check if the current time is less than expiresAt value
                        let currentTime = Date.parse(new Date().toISOString());
                        let expiresAt = Date.parse(value.expiresAt);
                        if(currentTime <= expiresAt){
                            //Update redeemedAt value to the current time;
                            value.redeemedAt = new Date().toISOString();
                            updated = {data: [value]};
                        }else{
                            expired = true;
                        }
                    }
                });
                // Send that the reward has expired
                if(expired){
                    res.status(400).json({ "error": { "message": "This reward is already expired" } });
                    return;
                }
                // If updated set to the store
                if(updated !== null){
                    redisClient.set(dbId, JSON.stringify(data), (errSet, resSet) => {
                        if(errSet){
                            res.status(500).json({error: errSet});                             
                            return;    
                        }else{
                            res.status(200).json(updated);      
                        }
                    });
                }else{
                    res.status(400).json({ "error": { "message": "Already redeemed!" } });
                }
            }else{
                res.status(400).json({errors: ['Not found']});
            }                
        });
    }else{
        res.send("Not a valid Date Format");
    }
 });

 export default router;
