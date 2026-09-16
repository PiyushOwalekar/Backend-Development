const mongoose = require('mongoose');
const teacherSchema = require('../schema/teacherSchema');

module.exports = mongoose.model('Assignment11Teacher', teacherSchema);
