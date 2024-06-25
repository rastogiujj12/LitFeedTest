const keystone = require('../ks');
const User   = keystone.list('User').model;

const sendRequest = async (req, res) => {
    // let user = await User.findOne({_id:req.user._id});
    console.log("user", req.user._id, "followUser", req.body.followUser)
    await User.update({_id:req.user._id}, {$push:{outgoingRequests:req.body.followUser}})
    await User.update({_id:req.body.followUser}, {$push:{incomingRequests:req.user._id}})

    res.send({message:"success"})
}

const checkOutgoingRequest = async (req, res) => {
    let followRequests = await User.findOne({_id:req.user._id}).populate('outgoingRequests');
    res.send({requests:followRequests.outgoingRequests})
}

const checkIncomingRequest = async (req, res) => {
    let followRequests = await User.findOne({_id:req.user._id}).populate('incomingRequests');
    res.send({requests:followRequests.incomingRequests})
}

const cancelIncomingRequest = async (req, res) => {
    let request = req.body.request
    await User.update({_id:req.user._id}, {$pull:{incomingRequests:request}})
}

const acceptIncomingRequest = async (req, res) => {
    let request = req.body.request
    console.log("request", request)
    await User.update({_id:req.user._id}, {$pull:{incomingRequests:request}}, {$push:{followers:request}})
    await User.update({_id:request}, {$push:{follows:req.user._id}}, {$pull:{outgoingRequests:req.user._id}})
}

module.exports = {
  sendRequest, //checked
  checkOutgoingRequest, //checked
  checkIncomingRequest, // kinda checked
  acceptIncomingRequest, //
  cancelIncomingRequest
}