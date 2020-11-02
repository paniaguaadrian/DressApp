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
    console.log(allUsers)
    res.render("private/community/index.hbs", {allUsers});
});

router.get("/:id/closet", withAuth, async (req, res, next) => {
    const thisUser = await User.findById(req.params.id)
    .populate('items')
    .populate('outfits')
    .populate('collections')
    .exec()
    res.render("private/community/closet.hbs", {thisUser});
});

router.post("/:id/add-item", withAuth, async (req, res, next) => {
        const item = await Item.findById(req.params.id)
        const name = item.name
        const description = item.description
        const image = item.image
        const type = item.type
        const brand = item.brand
        const price = item.price

        const copyItem = await Item.create({name,description,image,type,brand,price})

        await User.findByIdAndUpdate(req.userID, {$push:{items: copyItem}})

        console.log('This is the item I want to add ' + copyItem)
    res.redirect("/mycommunity");
});

router.post("/:id/add-outfit", withAuth, async (req, res, next) => {
    const outfit = await Outfit.findById(req.params.id)
    const name = outfit.name
    const description = outfit.description
    const imageTop = outfit.imageTop
    const imageBottom = outfit.imageBottom
    const imageFeet = outfit.imageFeet

    const copyOutfit = await Outfit.create({name,description,imageTop, imageBottom, imageFeet})

    await User.findByIdAndUpdate(req.userID, {$push:{outfits: copyOutfit}})

    console.log('This is the item I want to add ' + copyOutfit)
res.redirect("/mycommunity");
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
    res.redirect("/mycommunity");
});

module.exports = router;