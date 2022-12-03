const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

//Port
app.listen(5000,()=>{
    console.log("Running on Port 5000")
});


//connect to db
mongoose.connect(
    "mongodb://localhost:27017/newdb",
    {
        useNewUrlParser: true,
        useUnifiedTopology:true

    },()=>{console.log('Connected to database')});

// Schema
const sch={

    name:String,
    img:String,
    summary:String
}
const monmodel = mongoose.model("movies", sch);

//Post
app.post("/post", async(req, res) => {
    console.log("Inside/post")
    const data = new monmodel({
        name:req.body.name,
        img:req.body.img,
        summary:req.body.summary
    });
     
    try{
        const val=await data.save();
        res.json(val);  
    }catch{
        console.log("error")
    }

});

// UpdateById
app.put("/update/:id", async(req, res)=>{
    let _id = req.params.id;
    let upname = req.body.name;
    let upimg = req.body.img;
    let upsummary = req.body.summary;

    //To Find and update
    monmodel.findOneAndUpdate({id:_id}, {$set:{name:upname, img:upimg, summary:upsummary}},
        {new:true},(err, data)=>{
            
        if(err){
            res.send("Error")
        }else{

            if(data==null)
            {
                res.send("nothing found")  // if id or data is missing
            }
            else{
                res.send(data)
            }
        }
    })
})


//Fetch  
app.get('/fetch/:id', function(req, res){
    fetchid=req.params.id;
    monmodel.find(({id:fetchid}), function(err, val){

    if(err){
         res.send("error")
    }
    else{
         if (val.length==0){
            res.send("data does not exist")
    
         }else{
            
            res.send(val);
        }
        
    }
        
    })
})
 

// Delete
app.delete('/del/:id', function(req, res){
    let delid=req.params.id;
    monmodel.findOneAndDelete(({id:delid}), function(err, docs){
        if(err)
        {
            res.send("Error")
        }
        else{

            if(docs==null)
            {
                
                res.send(" Id does not found")
            }
            else{
            res.send(docs);
            }
        }
    })
})

