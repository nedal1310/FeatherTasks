import Logs from "../models/StudyLogModel.js"

//crud operations

//get all logs for user
export const getLogs= async(req , res)=>{
    const userId=req.user.id;
    const logs=await Logs.find({userId}).sort({order:1});
    res.json(logs);
}

//adding new log
// studylogController.js
export const addLog = async (req, res) => {
  const { subject, hours, notes, date } = req.body;

  // Normalize to YYYY-MM-DD string regardless of what arrives
  const normalizedDate = date
    ? new Date(date).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const log = await Logs.create({
    userId: req.user.id,
    subject,
    hours,
    notes,
    date: normalizedDate,
  });

  res.status(201).json(log);
};
//delete a log
export const deleteLog= async(req, res)=>{
    const {id} = req.params;
    await Logs.findByIdAndDelete(id);
    res.json({msg:"deleted"});
};
//update a log
export const updateLog=async(req, res)=>{
    const {id}=req.params;
    const {subject,hours,notes}=req.body;
    const log= await Logs.findIdAndUpdate(id,
        {subject},
        {hours},
        {notes},
        {new:true}
    );
    res.json(log)
}