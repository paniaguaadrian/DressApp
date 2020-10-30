const path = require("path");
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const Item = require('../../models/Item')
const topCloud = require('../../config/cloudinary');

router.get('/mycloset', async (req,res,next) =>{
    const allItems = await Item.find()
    res.render('private/closet/index.hbs', {allItems})
})

router.get('/add-item', async (req,res,next) =>{
    res.render('private/closet/create.hbs')
})

router.post('/add-item', topCloud.single("photo"), async (req,res,next) =>{
    const {name, description, type, brand, price} = req.body
    console.log(req.file, 'lo que quieras')
    const image = req.file.url
    console.log(image)
    try {
      const newItem = await Item.create({name, description, image, type, brand, price})
      res.redirect('/add-item')
    } catch (error) {
      console.log(error);
    }
})

router.get('/:id/edit', async (req, res, next) => {
    try{
       let item = await Item.findById(req.params.id)
        console.log('Retrieved item with id:', req.params.id);
        res.render('private/closet/edit.hbs', {item});
    }catch(err){
        console.log('Error while editing the item: ', err);
    }
  });
  
  router.post('/:id', async (req, res, next) => {
    const {name, description, image, type, brand, price} = req.body;
    Item.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { name, description, image, type, brand, price} }
      )
        .then((item) => {
          res.redirect("/mycloset");
        })
        .catch((error) => {
          console.log(error);
        });
    
  });
  
router.post('/:id/delete', async (req, res, next) => {
    try{
       let item = await Item.findByIdAndRemove(req.params.id)
        //console.log('Retrieved celebrities from DB:', req.params.id);
        res.redirect('/mycloset');
    }catch(err){
        console.log('Error while deleting the item: ', err);
    }
});

router.get('/:id', async (req, res, next) => {
    try{
      let item = await Item.findById(req.params.id)
        res.render('private/closet/show.hbs', {item});
    }catch(err){
        // console.log('Error while getting the celebrity: ', err);
    }
});

module.exports = router;