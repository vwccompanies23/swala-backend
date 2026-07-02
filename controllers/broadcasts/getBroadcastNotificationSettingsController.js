const pool = require('../../config/db');

const getBroadcastNotificationSettings=async(req,res)=>{

try{

const{

broadcastId,

userId,

}=req.params;

const result=

await pool.query(

`

SELECT *

FROM broadcast_notification_settings

WHERE

broadcast_id=$1

AND

user_id=$2

LIMIT 1;

`,

[

broadcastId,

userId,

],

);

return res.json({

success:true,

settings:

result.rows[0]??null,

});

}

catch(error){

console.error(error);

return res.status(500).json({

success:false,

error:error.message,

});

}

};

module.exports=

getBroadcastNotificationSettings;