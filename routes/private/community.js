const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Item = require("../../models/Item");
const Outfit = require("../../models/Outfit");
const Collection = require("../../models/Collection");
const topCloud = require("../../config/cloudinary");
const withAuth = require("../../middleware/auth");


router.get("/", withAuth, async (req, res, next) => {
    const allUsers = await User.find()
    const allButMe =[]
    allUsers.forEach(function(user){
        if(user.id !== req.userID){
            allButMe.push(user)
        }
    })

    // console.log(allButMe)
    res.render("private/community/index.hbs", {allButMe});
});

router.get("/:id/closet", withAuth, async (req, res, next) => {
    const thisUser = await User.findById(req.params.id)
    .populate('items')
    .populate('outfits')
    .populate('collections')
    .exec()
    res.render("private/community/closet.hbs", {thisUser});
});

router.get("/:id/view-collection", withAuth, async (req, res, next) => {
    const thisCollection = await Collection.findById(req.params.id)
    .populate('outfits')
    .exec()
    res.render("private/community/collection.hbs", {thisCollection});
});

router.post("/:id/closet/:item/add-item", withAuth, async (req, res, next) => {
        const user = await User.findById(req.params.id)
        const item = await Item.findById(req.params.item)
        const name = item.name
        const description = item.description
        const image = item.image
        const type = item.type
        const brand = item.brand
        const price = item.price

        const copyItem = await Item.create({name,description,image,type,brand,price})

        await User.findByIdAndUpdate(req.userID, {$push:{items: copyItem}})

        console.log('This is the item I want to add ' + copyItem)
    res.redirect(`/mycommunity/${user.id}/closet`);
});

router.post("/:id/closet/:outfit/add-outfit", withAuth, async (req, res, next) => {
    const user = await User.findById(req.params.id)
    const outfit = await Outfit.findById(req.params.outfit)
    const name = outfit.name
    const description = outfit.description
    const imageTop = outfit.imageTop
    const imageBottom = outfit.imageBottom
    const imageFeet = outfit.imageFeet

    const copyOutfit = await Outfit.create({name,description,imageTop, imageBottom, imageFeet})

    await User.findByIdAndUpdate(req.userID, {$push:{outfits: copyOutfit}})

    console.log('This is the item I want to add ' + copyOutfit)
    res.redirect(`/mycommunity/${user.id}/closet`);
});

router.post("/:id/add-collection", withAuth, async (req, res, next) => {
    const collection = await Collection.findById(req.params.id)
    .populate('outfits')
    .exec()
    const outfits= []
    const name = collection.name
    const description = collection.description
    
    
    for(let i=0; i < collection.outfits.length; i++){
        let name = collection.outfits[i].name
        let description = collection.outfits[i].description
        let imageTop = collection.outfits[i].imageTop
        let imageBottom = collection.outfits[i].imageBottom
        let imageFeet = collection.outfits[i].imageFeet
        let oneOutfit = await Outfit.create({name,description,imageTop, imageBottom, imageFeet})
        outfits.push(oneOutfit)
    }
    
    const copyCollection = await Collection.create({name,description,outfits}) 

    await User.findByIdAndUpdate(req.userID, {$push:{collections: copyCollection}})

    console.log('This is the collection I want to add ' + copyCollection)
    res.redirect("/mycloset");
});

router.post("/:id/follow", withAuth, async (req, res, next) => {
    await User.findByIdAndUpdate(req.userID, {$push:{following: req.params.id}})
    res.redirect(`/mycommunity/${req.params.id}/closet`)
})

module.exports = router;