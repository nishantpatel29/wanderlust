
initdata=require("./data");
listing=require("../models/listing");
const mongoose = require('mongoose');


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
}
main().catch(err => console.log(err));

const initDB=async ()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"66784515a9d47b4e7ced8ea4"}))
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initDB();