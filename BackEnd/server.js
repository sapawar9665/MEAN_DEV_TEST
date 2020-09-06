var express = require('express');
var path = require("path");
var bodyParser = require('body-parser');
var mongo = require("mongoose");
var multer = require('multer')
var   router = express.Router();

var db = mongo.connect("mongodb://localhost:27017/AngularCRUD", function (err, response) {
    if (err) { console.log(err); }
    else { console.log('Connected to ' + db, ' + ', response); }
});


var app = express()
app.use(bodyParser());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Multer File upload settings
const DIR = './public/uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

var upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5
  // },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

var Schema = mongo.Schema;

var UsersSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    profileUrl : { type: String },
}, { versionKey: false });


var model = mongo.model('users', UsersSchema, 'users');

app.post("/api/SaveUser", async function (req, res) {
    var mod = new model(req.body);
    if (req.body.mode == "Save") {
        var checkFlag = await checkIfPresent(req.body.email);
        if(checkFlag){
            res.send({ data: "Email Id already exist!!!" });
        }else{
            mod.save(async function (err, data) {
                if (err) {
                    res.send(err);
                }
                else {res.send({ data: "Record has been Inserted..!!", value : data});
                }
            });
        }
    }
    else {
        model.findByIdAndUpdate(req.body.id, { firstName: req.body.firstName,lastName: req.body.lastName,phone: req.body.phone, address: req.body.address },
            function (err, data) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send({ data: "Record has been Updated..!!", value : data});
                }
            });


    }
})

function checkIfPresent(email) {
   return model.findOne({ email: email },
        function (err, data) {
            if (err) {
                res.send(err);
            }
            else {
                if(data != null){
                    return true;
                }else{
                    return false;
                }
            }
        })
}

app.post("/api/deleteUser", function (req, res) {
    model.remove({ _id: req.body.id }, function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send({ data: "Record has been Deleted..!!"});
        }
    });
})

app.post("/api/upload", upload.single('avatar'), function (req, res) {
    model.findByIdAndUpdate(req.body.id, { profileUrl: req.file.path },
        function (err, data) {
            if (err) {
                res.send(err);
            }
            else {
                res.send({ data: "Profile picture uploaded successfully", value : data});
            }
        });
})



app.get("/api/getUser", function (req, res) {
    model.find({}, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
})

app.post("/api/getUserById", function (req, res) {
    console.log("-=-sa-=-=getUserById-=-=",req.body)
    model.findOne({ _id: req.body.id }, function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(data);
        }
    });
})










app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})  