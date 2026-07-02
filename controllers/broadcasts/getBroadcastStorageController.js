const pool=require('../../config/db');

const getBroadcastStorage=async(req,res)=>{

try{

const{

broadcastId,

}=req.params;

const result=

await pool.query(

`

SELECT

COALESCE(

SUM(file_size),

0

) AS total_storage,

COUNT(*) AS total_files

FROM broadcast_files

WHERE

broadcast_id=$1;

`,

[

broadcastId,

],

);

return res.json({

success:true,

storage:result.rows[0],

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

getBroadcastStorage;