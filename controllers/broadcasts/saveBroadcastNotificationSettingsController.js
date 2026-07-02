const pool = require('../../config/db');

const saveBroadcastNotificationSettings = async (req,res)=>{

try{

const{

broadcastId,

userId,

notificationsEnabled,

muted,

vibration,

popup,

preview,

notificationSound,

}=req.body;

const result=

await pool.query(

`

INSERT INTO broadcast_notification_settings(

broadcast_id,

user_id,

notifications_enabled,

muted,

vibration,

popup,

preview,

notification_sound

)

VALUES(

$1,

$2,

$3,

$4,

$5,

$6,

$7,

$8

)

ON CONFLICT(

broadcast_id,

user_id

)

DO UPDATE SET

notifications_enabled=EXCLUDED.notifications_enabled,

muted=EXCLUDED.muted,

vibration=EXCLUDED.vibration,

popup=EXCLUDED.popup,

preview=EXCLUDED.preview,

notification_sound=EXCLUDED.notification_sound,

updated_at=CURRENT_TIMESTAMP

RETURNING *;

`,

[

broadcastId,

userId,

notificationsEnabled,

muted,

vibration,

popup,

preview,

notificationSound,

],

);

return res.json({

success:true,

settings:result.rows[0],

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

saveBroadcastNotificationSettings;