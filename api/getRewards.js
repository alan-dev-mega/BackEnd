import redis from 'redis';

// getWeek Date prototype
Date.prototype.getWeek = function(){
    return [new Date(new Date(this.setDate(this.getDate() - this.getDay())).setHours(0,0,0))]
        .concat(
            String(Array(6)).split(',')
                .map ( function(){
                        return new Date(new Date(this.setDate(this.getDate() + 1)).setHours(0,0,0));
                    }, this )
        );
}
// getWeekExpires Date prototype
Date.prototype.getWeekExpires = function(){
    return [new Date(new Date(this.setDate(this.getDate() - this.getDay() + 1)).setHours(0,0,0))]
        .concat(
            String(Array(6)).split(',')
                .map ( function(){
                        return new Date(new Date(this.setDate(this.getDate() + 1)).setHours(0,0,0));
                    }, this )
        );
}

// class Rewards 
class Rewards {
    // Constructor
    constructor(user){
        this.id = user.id;
        this.date = user.date;
    }

    // getValue Function that returns the data in the case is not in the store
    getValue(){
        let dateAt = this.date;
        let dates = new Date(dateAt).getWeek();
        let datesExpires = new Date(dateAt).getWeekExpires();
        let data = [];
        for(let i = 0; i < dates.length; i++){
            data.push({
                "availableAt": this.toUTCDate(dates[i]),
                "redeemedAt": null,
                "expiresAt": this.toUTCDate(datesExpires[i]),
            });
        }
        let response = {data: data};
        return JSON.stringify(response);
    }
    
    // getId Function that returns the Id stored in Redis 
    getId(){
        // The id will be build form the user id and the start
        // and end dates,
        let id = this.id;
        let dateAt = this.date;
        let dates = new Date(dateAt).getWeek();
        return id + '-' + Date.parse(new Date(dates[0]).toISOString()) + "-" + Date.parse(new Date(dates[6]).toISOString());
    }

    
    toUTCDate(date){
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
    }
}
    
export default Rewards;