const mongoose = require('mongoose')
const moment = require('moment')
const data = moment(new Date()).format('LL');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  title: {
    type: String,
  },
  autor: {
    type: String,
  },
  imagem: {
    type: String,
  },
  createdAt:{
    type: String,
    default: data
  }
});

module.exports = mongoose.model('Imagedata', UserSchema);