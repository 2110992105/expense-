const model = require('../modules/model');

// POST: https://localhost:8080/api/categories
// Create a new category
async function create_Categories(req, res) {
    try {
        const newCategory = new model.Categories({
            // type: "Savings",
            // color: "1F3B5C"
            type: "Expenses",
            color: "#FCBE44"
        });

        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: `Error while creating category: ${err}` });
    }
}

// GET: https://localhost:8080/api/categories
async function get_Categories(req, res) {
    try {
        let data = await model.Categories.find({});
        let filter = data.map(v => Object.assign({}, { type: v.type, color: v.color }));
        res.json(filter);
    } catch (err) {
        res.status(400).json({ message: `Error while retrieving categories: ${err}` });
    }
}

// POST: https://localhost:8080/api/transaction
async function create_Transaction(req, res) {
    if (!req.body) return res.status(400).json("Post http data not provided");

    let { name, type, amount } = req.body;
    try {
        const create = new model.Transaction({
            name,
            type,
            amount,
            date: new Date()
        });

        const savedTransaction = await create.save();
        res.json(savedTransaction);
    } catch (err) {
        res.status(400).json({ message: `Error while creating transaction: ${err}` });
    }
}
// get:http://localhost:8080/api/transaction
async function get_Transaction(req,res){
    let data=await model.Transaction.find({});
    return res.json(data);
}
// delete:http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
    if (!req.body) {
      return res.status(400).json({ message: "Request body not found" });
    }
  
    try {
      const result = await model.Transaction.deleteOne(req.body).exec();
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.json({ message: "Record Deleted..!" });
    } catch (err) {
      res.status(500).json({ message: "Error while deleting Transaction", error: err.message });
    }
  }
//   get:http://localhost:8080/api/labels
async function get_Labels(req,res){
   model.Transaction.aggregate([
    {
        $lookup:{
            from:"categories",
            localField:'type',
            foreignField:"type",
            as:"categories_info"
        }
    },
    {
        $unwind:"$categories_info"
    }
   ]).then(result=>{
    let data=result.map(v=>Object.assign({},{_id:v._id,name:v.name,type:v.type,amount:v.amount,color:v.categories_info['color']}))
    res.json(data);
   }).catch(err=>{
    res.status(400).json("Lookup collection error");
   })
}
  

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
};
