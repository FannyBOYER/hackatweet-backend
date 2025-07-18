var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { getFormattedDate } = require("../modules/tools");

const User = require("../models/users");
const Tweet = require("../models/tweets");

/* Add un tweet dans la BDD */
router.post("/", (req, res) => {
  if (!checkBody(req.body, ["text", "token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) {
      res.json({ result: false, error: "User not found or wrong password" });
    } else {
      const username = data.username;
      let hashtag = req.body.text.match(/#\w+/g);
      console.log(hashtag)
      hashtag = hashtag ? hashtag.map((tag) => tag.slice(1)) : [];
      const newTweet = new Tweet({
        idUser: data._id,
        text: req.body.text,
        hashtag: hashtag,
        likes: [],
        date: Date.now(),
      });

      newTweet.save().then((data) => {
        res.json({
          result: true,
          comment: `Tweet de ${username} ajouté le ${getFormattedDate(
            newTweet.date
          )}`,
        });
      });
    }
  });
});

/* Delete un tweet dans la BDD */
router.delete("/", (req, res) => {
  if (!checkBody(req.body, ["id", "token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
    if (!data) {
      res.json({ result: false, error: "User not found or wrong password" });
    } else {
      const username = data.username;
      console.log(data)
      Tweet.deleteOne({ _id: req.body.id , idUser:data._id }).then((result) => {
        if (result.deletedCount === 1) {
            res.json({
            result: true,
            comment: `Tweet supprimé par ${username} le ${getFormattedDate(Date.now())}`,
            });
        } else {
            res.json({
            result: false,
            comment: `Impossible de supprimer ce Tweet le ${getFormattedDate(Date.now())}`,
            });
        }       
      });
    }
  });
});

module.exports = router;
