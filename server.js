const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const Pet = require('./models/pet.js');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080; //store config

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/updog'

mongoose.connect(dbURL);

app.use(express.static('public'));

app.use(bodyParser.json());

router.route('/').get((req, res) => {
  res.json({ 
  	message: 'Success'
  });
});

router.route('/pets').get((req,res) => {
	Pet.find({},(err,docs) => {
		if(err !== null){
			res.status(400).json({
				message: "Errrroooorrr"
			});
			return;
		}
		res.status(200).json(docs);
	});
}).post((req,res) => {
	const body = req.body;
	const pet = new Pet();

	pet.name = body.name;
	pet.description = body.description;
	pet.photo = body.photo;
	pet.score = 0;

	console.log(body);
	pet.save((err,doc) => {
		if(err !== null){
			res.status(400).json({
				message: "Errrroooorrr"
			});
			return;
		}
		res.status(200).json(doc);
	});	
});

router.route('/pets/:pet_id').get((req,res) => {
	const petId = req.params.pet_id;
	
	Pet.findById(petId, (err,doc) => {
		if(err !== null){
			res.status(400).json({
				message: "Errrroooorrr"
			});
			return;
		}

		res.status(200).json(doc);
	});
}).put((req,res) => {
	const petId = req.params.pet_id;

	Pet.findById(petId, (err,doc) => {
		if(err !== null){
			res.status(400).json({
				message: "Errrroooorrr"
			})
			return;
		}

		Object.assign(doc,req.body,{score: doc.score + 1});

		doc.save((err,savedDoc) => {
			if(err !== null){
				res.status(400).json({
					message: "Errrroooorrr"
				})
				return;
			}
			res.status(203).json(savedDoc);
		});

	});
}).delete((req,res) => {
	const petId = req.params.pet_id;

	Pet.findByIdAndRemove(petId, (err,doc) => {
		if(err !== null){
			res.status(400).json({
				message: "Errrroooorrr"
			});
			return;
		}
		res.status(200).json(doc);
	});
});

app.use('/api',router); //use router in api url

app.listen(port);




