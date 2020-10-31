const path = require("path");
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const Item = require('../../models/Item')
const Outfit = require('../../models/Outfit')
const Collection = require('../../models/Collection')
const topCloud = require('../../config/cloudinary');
const withAuth = require("../../middleware/auth");

router.get('/', withAuth, async (req,res,next) =>{
  if (req.userID) {
    try {
  
      const userUpdated = await User.findById(req.userID)
      .populate('items')
      .populate('outfits')
      .populate('collections')
      .exec()
      res.locals.currentUserInfo = userUpdated;

    res.render('private/closet/index.hbs', {userUpdated})
    } catch (error) {
        next(error);
        return;
    }
  } else {
    res.redirect('/')
  // en caso contrario (si no hay token) redirigimos a la home
  // otra opción es definir la respuesta con status 401, y renderizamos nuestra vista 'home' con un errorMessage ('Unauthorized: No token provided')

  }
})

router.get('/add-item', withAuth, async (req,res,next) =>{
    res.render('private/closet/item/create.hbs')
})

router.post('/add-item', withAuth, topCloud.single("photo"), async (req,res,next) =>{
    const {name, description, type, brand, price} = req.body
    const image = req.file.url
    try {
      const newItem = await Item.create({name, description, image, type, brand, price})
      await User.findByIdAndUpdate(req.userID, {$push:{items: newItem}})
      res.render('private/closet/item/create.hbs')
    } catch (error) {
      console.log(error);
    }
})

router.get('/add-outfit', withAuth, async (req,res,next) =>{
  const allOutfits = await Outfit.find()
  .populate('items')
  .exec()
  const topItems = await Item.find({type: 'top'})
  const bottomItems = await Item.find({type: 'bottom'})
  const feetItems = await Item.find({type: 'feet'})
  res.render('private/closet/outfit/create.hbs', {topItems, bottomItems,feetItems})
})

router.post('/add-outfit', withAuth, topCloud.single("photo"), async (req,res,next) =>{
  const {name, description, imageTop, imageBottom, imageFeet} = req.body
  try {
    const newOutfit= await Outfit.create({name, description, imageTop, imageBottom, imageFeet})
    await User.findByIdAndUpdate(req.userID, {$push:{outfits: newOutfit}})
    res.render('private/closet/outfit/create.hbs')
  } catch (error) {
    console.log(error);
  }
})

router.get('/add-collection', withAuth, async (req,res,next) =>{
  res.render('private/closet/collection/create.hbs')
})

router.post('/add-collection', withAuth, topCloud.single("photo"), async (req,res,next) =>{
  const {name, description, outfits} = req.body
  try {
    const newCollection = await Collection.create({name, description, outfits})
    await User.findByIdAndUpdate(req.userID, {$push:{collection: newCollection}})
    res.render('private/closet/collection/create.hbs')
  } catch (error) {
    console.log(error);
  }
})

router.get('/:id/edit-item', withAuth, async (req, res, next) => {
    try{
       let item = await Item.findById(req.params.id)
        console.log('Retrieved item with id:', item);
        res.render('private/closet/item/edit.hbs', {item});
    }catch(err){
        console.log('Error while editing the item: ', err);
    }
  });
  
  router.post('/:id/edit-item', topCloud.single("photo"), async (req, res, next) => {
    console.log(req.body)
    let {name, description, image, type, brand, price} = req.body;
    if(req.file){
      image = req.file.url
      console.log(image)
    }
    await Item.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { name, description, image, type, brand, price} })
          res.redirect("/mycloset");  
  });
  
router.post('/:id/delete-item', withAuth, async (req, res, next) => {
    try{
        const itemID = req.params.id
        await User.update({_id: req.userID}, { $pull: {items: itemID}})
        await Item.findByIdAndRemove(itemID)
        res.redirect('/mycloset');
    }catch(err){
        console.log('Error while deleting the item: ', err);
    }
});


module.exports = router;