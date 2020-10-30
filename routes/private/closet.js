const path = require("path");
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const Item = require('../../models/Item')
const topCloud = require('../../config/cloudinary');
const withAuth = require("../../middleware/auth");

router.get('/', withAuth, async (req,res,next) =>{
  if (req.userID) {
    try {
  
      const userUpdated = await User.findById(req.userID)
      .populate('items')
      .exec()
      res.locals.currentUserInfo = userUpdated;
      console.log( res.locals.currentUserInfo)
      // let itemQuery = {items: res.locals.currentUserInfo.items}
      

      // const itemDocs = await User.find(itemQuery)
      // .populate('items')
      // .exec()

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
    res.render('private/closet/create.hbs')
})

router.post('/add-item', withAuth, topCloud.single("photo"), async (req,res,next) =>{
    const {name, description, type, brand, price} = req.body
    const image = req.file.url
    try {
      console.log(req.userID)
      const newItem = await Item.create({name, description, image, type, brand, price})
      await User.findByIdAndUpdate(req.userID, {items: newItem})
      res.redirect('/mycloset/add-item')
    } catch (error) {
      console.log(error);
    }
})

router.get('/:id/edit', withAuth,async (req, res, next) => {
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

router.get('/:id', withAuth, async (req, res, next) => {
    try{
      let item = await Item.findById(req.params.id)
        res.render('private/closet/show.hbs', {item});
    }catch(err){
        // console.log('Error while getting the celebrity: ', err);
    }
});

module.exports = router;