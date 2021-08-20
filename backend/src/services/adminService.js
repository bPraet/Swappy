const User = require("../models/User");
const Product = require("../models/Product");
const Match = require("../models/Match");
const Message = require("../models/Message");
const Swap = require("../models/Swap");
const { userTypes } = require("../services/userTypes");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      console.log(err);
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

module.exports = {
  adminControl(role) {
    if (role.toString() !== userTypes.ADMIN) {
      return false;
    }
    return true;
  },

  async getUsers() {
    const users = await User.find({});

    return users;
  },

  async getProducts(userId) {
    const products = await Product.find({ user: userId })
      .populate("transport")
      .populate("condition");

    return products;
  },

  async deleteUser(userId) {
    await User.deleteMany({ _id: userId });
    await Match.deleteMany({ consignee: userId });
    await Match.deleteMany({ owner: userId });
    await Message.deleteMany({ user1: userId });
    await Message.deleteMany({ user2: userId });
    await Swap.deleteMany({ consignee: userId });
    await Swap.deleteMany({ owner: userId });

    await Product.find({ user: userId }).then(async (products) => {
      for (const product of products) {
        await Product.deleteOne({ _id: product._id });
        fs.unlink(`./files/${product.image}`, () => {});
      }
    });
  },

  mailControl(email, message) {
    if (!email || !message || email === "" || message === "") {
      return false;
    }
    return true;
  },

  sendEmail(email, message) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "swappy.contact@gmail.com",
        pass: "Password1$",
      },
    });

    readHTMLFile("email/index.html", async (err, html) => {
      try {
        const template = handlebars.compile(html);
        const replacements = {
          message: message,
        };
        const htmlToSend = template(replacements);

        await transporter.sendMail({
          from: "Swappy",
          to: email,
          subject: "Message administrateur",
          html: htmlToSend,
        });
      } catch (error) {
        return false;
      }
    });

    return true;
  },
};
