const mongoose = require('mongoose');
const studentSchema = require('../schema/studentSchema');

module.exports = mongoose.model('Assignment11Student', studentSchema);
