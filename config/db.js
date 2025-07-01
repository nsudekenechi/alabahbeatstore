const mongoose = require("mongoose")
async  function DB(){
   
    try {
   await mongoose.connect(process.env.MONGO_URI);
    // console.log("DB connected:", process.env.MONGO_URI);
} catch (err) {
    console.error(err)
}
}

module.exports = DB;