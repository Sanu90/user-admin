const user = require("../models/database");
const bcrypt = require("bcrypt");

const checkAdmin = async (req, res) => {
  try {
    const adminIn = await user.findOne({ username: req.body.username });
    if (adminIn) {
      console.log("Success");
      const adminPass = await bcrypt.compare(
        req.body.password,
        adminIn.password
      );
      if (adminPass) {
        console.log("Password found");
        if (adminIn.isAdmin == 1) {
          console.log("Admin found");
          req.session.isAdmin = true;
          req.session.name = req.body.username;
          res.redirect(`/admin/logged/${req.session.name}`);
        } else {
          console.log("Admin not found");
          res.redirect("/admin?notAdmin=Not-authorized!!!!");
        }
      } else {
        console.log("Invalid password");
        res.redirect("/admin?notPass=Invalid-password");
      }
    } else {
      console.log("Invalid username");
      res.redirect("/admin?adminNot=Sorry-No Access");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/error?message=something-went-wrong!");
  }
};

const listUser = async (req, res) => {
  try {
    const allUsers = await user.find({ isAdmin: 0 });
    if (allUsers) {
      return allUsers;
    } else {
      console.log("User details not found");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/error?message= Something went wrong!");
  }
};

const searchUser = async (req, res) => {
  try {
    welcome = req.session.name;
    console.log(req.body.userfind);
    if (req.body.userfind) {
      console.log("1");
      userFind = req.body.userfind;
      console.log("2");
      const regex = new RegExp(`^${userFind}`);
      console.log("3");

      const userSearch = await user.find({ username: { $regex: regex } });
      //const filteredUser = await user.find({username:{$regex: regex}})
      //console.log("!!!!!!")
      welcome = req.session.name;
      console.log(welcome);
      console.log(req.session.name);
      res.render("adminHome", {
        userDetails: userSearch,
        welcome,
        searchedValue: userFind,
        name: req.session.name,
      });
    } else {
      console.log(req.session.name);
      console.log("das found");
      res.redirect(`/admin/logged/${req.session.name}`);
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/error?message= something went wrong!");
  }
};

const editUser = async (req, res) => {
  try {
    console.log("Not able to fetch data");
    console.log(req.body.username);
    console.log(req.body.oldusername);
    const moreUser = await user
      .find({ username: req.body.username })
      .countDocuments();
    if (moreUser == 0) {
      await user.updateOne(
        { username: req.body.oldusername },
        { $set: { username: req.body.username } }
      );
      res.redirect(`/admin/logged/${req.session.name}`);
    } else {
      res.redirect("/admin/edit?morethanUser=usernameFound");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/error?message= something went wrong!");
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log("User deleted" + req.query.username);
    console.log("User not found");
    await user.deleteOne({ username: req.query.username });
    res.redirect(`/admin/logged/${req.session.name}`);
  } catch (error) {
    console.log(error.message);
    res.redirect("/error?message= something went wrong!");
  }
};

const signOut = async (req, res) => {
  await req.session.destroy();
  console.log("Admin session destroyed!");
  res.redirect("/admin");
};

module.exports = {
  checkAdmin,
  listUser,
  editUser,
  deleteUser,
  searchUser,
  signOut,
};
