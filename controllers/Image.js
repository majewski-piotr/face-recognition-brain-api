const deepai = require('deepai');

const handleDeepAi = async (req,res)=>{
    const { url } = req.body;
    deepai.setApiKey('42c0a275-1d51-4594-aa35-b2df2d943610');
    try {
    const resp =  await deepai.callStandardApi("facial-recognition",{image:url} );
    res.json(resp)
    } catch(err){
         res.status(400).json('deepai unavailable')
    }
    
}

const handleImage =(req, res,db)=>{
    const { id } = req.body;
    db('users').where('id','=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries);
    })
    .catch(err=>{
        res.status(400).json(err)
    })
}
module.exports ={
    handleImage:handleImage,
    handleDeepAi:handleDeepAi
}