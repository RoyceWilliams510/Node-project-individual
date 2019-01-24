console.log("here we go")
const MongoClient = require('mongodb').MongoClient

var db
MongoClient.connect('mongodb://510royce:password1@ds129393.mlab.com:29393/royce',{useNewUrlParser:true}, (err, client) => {
    if(err) { console.log(err) }
    console.log("Connected successfully to server");
    db = client.db('royce');
    app.listen(3000, () => {
        console.log('meow')
    })
})

var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs')

var router = express.Router()

app.use('/api', router)

router.post('/create', function(req,res){
  db.collection('todo').find().toArray(function(err,result){
      var id = result.length+1
      var task = req.body.task
      var day = req.body.theDay
      console.log(day)
      if(task != ""){
        db.collection('todo').insertOne({task:task, id:id, day:day})
        console.log("shit is in")
      }
    res.redirect('/api')
    })
})

var mondayThings =[];
var tuesdayThings=[];
var wendsdayThings=[];
var thursdayThings=[];
var fridayThings=[];
var saturdayThings=[];
var sundayThings=[];

router.get('/',function (req,res){
//var allDays =["Monday","Tueday","Wendsday","Thursday","Friday"]
//for(var i =0; i<allDays.length;i++){}

  db.collection('todo').find({ day:"Monday"}).toArray(function(err,Things1){
     mondayThings=Things1
     db.collection('todo').find({ day:"Tuesday"}).toArray(function(err,Things2){
       tuesdayThings=Things2
       db.collection('todo').find({ day:"Wendsday"}).toArray(function(err,Things3){
         wendsdayThings=Things3
         db.collection('todo').find({ day:"Thursday"}).toArray(function(err,Things4){
           thursdayThings=Things4
           db.collection('todo').find({ day:"Friday"}).toArray(function(err,Things5){
             fridayThings=Things5
              db.collection('todo').find({ day:"Saturday"}).toArray(function(err,Things6){
                saturdayThings=Things6
                db.collection('todo').find({ day:"Sunday"}).toArray(function(err,Things7){
                 sundayThings=Things7
                 res.render('index.ejs',{mondayTasks:mondayThings,tuesdayTasks:tuesdayThings, wendsdayTasks: wendsdayThings,thursdayTasks: thursdayThings,fridayTasks: fridayThings,saturdayTasks:saturdayThings,sundayTasks:sundayThings })
})})})})})})})})
router.post('/delete', function(req,res){
  var id = parseInt(req.body.id)
  db.collection('todo').findOneAndDelete({id:id})
  res.redirect('/api')
})

router.post('/edit',function(req,res){
  var id =parseInt(req.body.id)
  db.collection('todo').find({id:id}).toArray(function(err,result){
    var id1 =parseInt(req.body.id)
    console.log(result)
    var task= result[0].task
    console.log(task)
    console.log(id)
    res.render('edit.ejs',{task:task,taskId:id})
  })

})


router.post('/processEdit',function(req,res) {
  var newTask = req.body.task
  var newDay = req.body.theDay
  var id=parseInt(req.body.taskId)
  console.log(id)
  db.collection('todo').updateOne(
        { "id" : parseInt(req.body.taskId) },
        { $set: { task:req.body.task, day:req.body.theDay  } }
     );
  res.redirect('/api')
})
