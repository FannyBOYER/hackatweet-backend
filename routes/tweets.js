var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const { getFormattedDate } = require("../modules/formatDate");

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
      const newTweet = new Tweet({
        idUser: data._id,
        text: req.body.text,
        hashtag: ['essai', 'jeudi'] ,
        likes: [],
        date: Date.now(),
      });

      newTweet.save().then((data) => {
        res.json({ result: true, comment: `Tweet de ${username} ajouté le ${getFormattedDate(newTweet.date)}` });
      });
    }
  });
});

module.exports = router;
