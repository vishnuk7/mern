const express = require("express");
const router = express.Router();

//@router GET api/posts/test
//@desc   Test posts route
//access  public

router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
