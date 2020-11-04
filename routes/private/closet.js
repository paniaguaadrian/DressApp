const path = require("path");
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Item = require("../../models/Item");
const Outfit = require("../../models/Outfit");
const Collection = require("../../models/Collection");
const topCloud = require("../../config/cloudinary");
const withAuth = require("../../middleware/auth");
const { collection } = require("../../models/User");

router.get("/", withAuth, async (req, res, next) => {
  if (req.userID) {
    try {
      const userUpdated = await User.findById(req.userID)
        .populate("items")
        .populate("outfits")
        .populate("collections")
        .exec();
      res.locals.currentUserInfo = userUpdated;

      res.render("private/closet/index.hbs", { userUpdated });
    } catch (error) {
      next(error);
      return;
    }
  } else {
    res.redirect("/");
    // en caso contrario (si no hay token) redirigimos a la home
    // otra opción es definir la respuesta con status 401, y renderizamos nuestra vista 'home' con un errorMessage ('Unauthorized: No token provided')
  }
});

router.get("/add-item", withAuth, async (req, res, next) => {
  res.render("private/closet/item/create.hbs");
});

router.post(
  "/add-item",
  withAuth,
  topCloud.single("photo"),
  async (req, res, next) => {
    const { name, description, type, brand, price } = req.body;
    const image = req.file.url;
    try {
      const newItem = await Item.create({
        name,
        description,
        image,
        type,
        brand,
        price,
      });
      await User.findByIdAndUpdate(req.userID, { $push: { items: newItem } });
      res.render("private/closet/item/create.hbs", {
        successMessage: `${newItem.name} has been added successfully`,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/add-outfit", withAuth, async (req, res, next) => {
  const thisUser = await User.findById(req.userID).populate("items").exec();
  let topItems = [];
  let bottomItems = [];
  let feetItems = [];
  const userItems = thisUser.items;
  userItems.forEach(function (item) {
    if (item.type === "top") {
      topItems.push(item);
    } else if (item.type === "bottom") {
      bottomItems.push(item);
    } else if (item.type === "feet") {
      feetItems.push(item);
    }
  });
  res.render("private/closet/outfit/create.hbs", {
    topItems,
    bottomItems,
    feetItems,
  });
});

router.post("/add-outfit", withAuth, async (req, res, next) => {
  const { name, description, imageTop, imageBottom, imageFeet } = req.body;
  try {
    console.log(
      "These are the outfits " +
        imageTop +
        " and " +
        imageBottom +
        " and " +
        imageFeet
    );
    const newOutfit = await Outfit.create({
      name,
      description,
      imageTop,
      imageBottom,
      imageFeet,
    });
    await User.findByIdAndUpdate(req.userID, { $push: { outfits: newOutfit } });

    res.redirect("/mycloset/add-outfit");
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-collection", withAuth, async (req, res, next) => {
  const thisUser = await User.findById(req.userID).populate("outfits").exec();
  res.render("private/closet/collection/create.hbs", { thisUser });
});

router.post("/add-collection", withAuth, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newCollection = await Collection.create({ name, description });
    await User.findByIdAndUpdate(req.userID, {
      $push: { collections: newCollection },
    });
    res.redirect("/mycloset/add-collection");
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/edit-item", withAuth, async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);
    console.log("Retrieved item with id:", item);
    res.render("private/closet/item/edit.hbs", { item });
  } catch (err) {
    console.log("Error while editing the item: ", err);
  }
});

router.post(
  "/:id/edit-item",
  topCloud.single("photo"),
  async (req, res, next) => {
    let { name, description, imageBefore, type, brand, price } = req.body;

    if (req.file) {
      image = req.file.url;
    } else if (!req.file || req.file === "") {
      image = imageBefore;
    }

    await Item.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { name, description, image, type, brand, price } }
    );
    res.redirect("/mycloset");
  }
);

router.get("/:id/edit-outfit", withAuth, async (req, res, next) => {
  const thisUser = await User.findById(req.userID).populate("items").exec();
  const outfit = await Outfit.findById(req.params.id);
  let topItems = [];
  let bottomItems = [];
  let feetItems = [];
  const userItems = thisUser.items;
  userItems.forEach(function (item) {
    if (item.type === "top") {
      topItems.push(item);
    } else if (item.type === "bottom") {
      bottomItems.push(item);
    } else if (item.type === "feet") {
      feetItems.push(item);
    }
  });
  try {
    res.render("private/closet/outfit/edit.hbs", {
      outfit,
      topItems,
      bottomItems,
      feetItems,
    });
  } catch (err) {
    console.log("Error while editing the item: ", err);
  }
});

router.post("/:id/edit-outfit", async (req, res, next) => {
  console.log(req.body);
  let { name, description, imageTop, imageBottom, imageFeet } = req.body;
  await Outfit.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { name, description, imageTop, imageBottom, imageFeet } }
  );
  res.redirect("/mycloset");
});

router.post("/:id/edit-outfit", async (req, res, next) => {
  console.log(req.body);
  let { name, description, imageTop, imageBottom, imageFeet } = req.body;
  await Outfit.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { name, description, imageTop, imageBottom, imageFeet } }
  );
  res.redirect("/mycloset");
});

router.get("/:id/edit-collection", async (req, res, next) => {
  const theCollection = await Collection.findById(req.params.id).populate(
    "outfits"
  );
  res.render("private/closet/collection/edit.hbs", { theCollection });
});

router.post("/:id/edit-collection", async (req, res, next) => {
  console.log("req body de edit collection " + req.body);
  let { name, description } = req.body;
  await Collection.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { name, description } }
  );
  res.redirect("/mycloset");
});

router.get("/:id/add-collection", withAuth, async (req, res, next) => {
  const thisUser = await User.findById(req.userID).populate("outfits").exec();
  try {
    const collection = await Collection.findById(req.params.id);
    res.render(`private/closet/collection/add.hbs`, { thisUser, collection });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/add-collection", withAuth, async (req, res, next) => {
  const { outfit } = req.body;
  try {
    await Collection.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { outfits: outfit } }
    );
    res.redirect(`/mycloset/${req.params.id}/add-collection`);
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/delete-item", withAuth, async (req, res, next) => {
  try {
    const itemID = req.params.id;
    await User.update({ _id: req.userID }, { $pull: { items: itemID } });
    await Item.findByIdAndRemove(itemID);
    res.redirect("/mycloset");
  } catch (err) {
    console.log("Error while deleting the item: ", err);
  }
});

router.post("/:id/delete-outfit", withAuth, async (req, res, next) => {
  try {
    const outfitID = req.params.id;
    await User.update({ _id: req.userID }, { $pull: { outfits: outfitID } });
    await Outfit.findByIdAndRemove(outfitID);
    res.redirect("/mycloset");
  } catch (err) {
    console.log("Error while deleting the item: ", err);
  }
});

router.post("/:id/delete-collection", withAuth, async (req, res, next) => {
  try {
    const collectionID = req.params.id;
    await User.update(
      { _id: req.userID },
      { $pull: { collections: collectionID } }
    );
    await Collection.findByIdAndRemove(collectionID);
    res.redirect("/mycloset");
  } catch (err) {
    console.log("Error while deleting the item: ", err);
  }
});

router.post(
  "/:id/delete-outfit-collection",
  withAuth,
  async (req, res, next) => {
    const _id = req.body.outfitID;
    try {
      const collectionID = req.params.id;
      await Collection.findByIdAndUpdate(collectionID, {
        $pull: { outfits: _id },
      });
      res.redirect(`/mycloset/${req.params.id}/edit-collection`);
    } catch (err) {
      console.log("Error while deleting the item: ", err);
    }
  }
);

module.exports = router;
