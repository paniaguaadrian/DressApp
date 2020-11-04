const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Item = require("../../models/Item");
const Outfit = require("../../models/Outfit");
const Collection = require("../../models/Collection");
const Notification = require("../../models/Notification");
const withAuth = require("../../middleware/auth");

router.get("/", withAuth, async (req, res, next) => {
    const allUsers = await User.find()
    .populate('items')
    .exec()
    const allButMe =[]
    allUsers.forEach(function(user){
        if(user.id !== req.userID){
            allButMe.push(user)
        }
    })

    const me = await User.findById(req.userID)
    .populate('following')
    .populate('notification')
    .populate('items')
    .exec()

    const notes = me.notification
    
    const notifications = []

    for(let i = 0; i < notes.length; i++){

        const notice = await Notification.findById(notes[i]._id)
        .populate('name')
        .populate('item')
        .populate('outfit')
        .populate('collections')
        notifications.push(notice)
    }

    console.log(me.notification, ' these are the items I want to notify')
   
    res.render("private/community/index.hbs", {allButMe, me, notifications});
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
    const theUser = await User.findById(req.userID)
    const follower = theUser.following.filter(data => data == req.params.id)

    if(follower.includes(req.params.id)){
        await User.findByIdAndUpdate(req.userID, {$pull:{following: req.params.id}})
        await User.findByIdAndUpdate(req.params.id, {$pull:{followers: req.userID}})
        res.redirect(`/mycommunity`)
    } else {
        await User.findByIdAndUpdate(req.userID, {$push:{following: req.params.id}})
        await User.findByIdAndUpdate(req.params.id, {$push:{followers: req.userID}})
        res.redirect(`/mycommunity`)
    }

    //comprobar que se sube el ID en followers (luis). Hay que hacer cuando suba un outfit, traer los followers, map y push de la notificación
    res.redirect(`/mycommunity/${req.params.id}/closet`)
})

router.post("/:id/closet/:item/like-item", withAuth, async (req, res, next) => {
    const awesomeItem = await Item.findByIdAndUpdate(req.params.item, {$push:{likes: req.userID}})
    res.redirect(`/mycommunity/${req.params.id}/closet`)
})

router.post("/:id/closet/:outfit/like-outfit", withAuth, async (req, res, next) => {
    const awesomeOutfit = await Outfit.findByIdAndUpdate(req.params.outfit, {$push:{likes: req.userID}})
    res.redirect(`/mycommunity/${req.params.id}/closet`)
})

router.post("/:id/closet/:collection/like-collection", withAuth, async (req, res, next) => {
    const theCollection = await Collection.findById(req.params.collection)
    const like = theCollection.likes.filter(data => data == req.userID)
    console.log(req.userID, ' user ID' , like , ' like')
    if(like.includes(req.userID)){
        console.log('Estoy entrando en el pull de like')
        await Collection.findByIdAndUpdate(req.params.collection, {$pull:{likes: req.userID}})
        res.redirect(`/mycommunity/${req.params.id}/closet`)
    }else {
        console.log('Estoy entrando en el push de like')
        await Collection.findByIdAndUpdate(req.params.collection, {$push:{likes: req.userID}})
        res.redirect(`/mycommunity/${req.params.id}/closet`)
    }
    
})

router.post("/:id/delete-notification", withAuth, async (req, res, next) => {
    const tiredNotif = await Notification.findById(req.params.id)
    console.log(tiredNotif, 'this is the notification I want to eliminate')
    await User.update({ _id: req.userID }, { $pull: { notification: tiredNotif._id } });
    await Notification.findByIdAndRemove(tiredNotif)
    res.redirect(`/mycommunity/${req.params.id}/closet`)
})

module.exports = router;