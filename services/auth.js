const keystone = require('../ks');
const jwt = require("jsonwebtoken");
const User = keystone.list('User').model;


const login = async(req, res) => {
	let {email, password} = req.body;
	email = email.toLowerCase() //to make case-insensitive;

	try {
		let user = await User.findOne({
			email
		});
		// console.log(user._.password.compare.toString());
		if (!user){
			return res.status(200).json({
				message: "Email or password is incorrect"
			});
		}		

		// compare password and call userFound if found
		user._.password.compare(password, function (err, isMatch) {
			if (!err && isMatch) {
				const payload = {
					user: {
						id: user.id
					}
				};

				jwt.sign(
					payload,
					process.env.JWT_SECRET,
					{
						expiresIn: 360000
					},
					(err, token) => {
						if (err) throw err;
						// console.log('token', token)
						res.status(200).json({
							token
						});
					}
				);
			} else {
				return res.status(200).json({
					message: "Email or password is incorrect"
				});
			}
		})
	} catch (e) {
		console.log('login error', e);
		res.status(500).json({
			message: "Server Error"
		});
	}
}

const getUser = (req, res) =>{
	let user = req.user;
	// console.log("user", user)
	res.send({user:req.user});
}

// const updateUser = async (req, res) =>{
// 	const {user} = req.body;

// 	let newUser = await User.findOneAndUpdate({_id:req.user._id}, {
// 		constantContactUniversalCodeSrc: user.constantContactUniversalCodeSrc,
// 		constantContactUniversalCodeCTCTMSrc: user.constantContactUniversalCodeCTCTMSrc
// 	})

// 	if(newUser)
//         res.send({user:"user updated", error:false})
//     else 
//         res.send({user:null, error:'Some error occured'})
// }

const signup = async (req, res) =>{
	let {firstName, lastName, email, password} = req.body;
	email = email.toLowerCase() //to make case-insensitive;

	try {
		let user = await User.findOne({
			email
		});
		if (user) {
			return res.send({error:"Some error occured"})
		}

		user = new User({
			name:{ first: firstName, last: lastName },
			email,
			password
		});

		await user.save();

		const payload = {
			user: {
				id: user.id
			}
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET, {
				expiresIn: 900000
			},
			(err, token) => {
				if (err) throw err;
				// res.cookie('xsrf-token', token, {maxAge: 900000, httpOnly: true});
				res.send({token});
			}
		);
	} 
	catch (err) {
		console.log(err);
		res.send({error:"Some error occured"});
	}
}

const changePassword = async (req, res) =>{
	let password = req.body.password;
	let user = await User.findOne({_id:req.user._id});
	user.isVerified = true;
	user.password = password;
	await user.save();
	res.send({message:"success"})
}
const forgotPassword = async (req, res)=>{
	let user = await User.findOne({email:req.body.email})
	await verification.verifyUser(user)
	res.send({message:"success"})
}
module.exports = {
    login,
	getUser,
	signup,
	changePassword,
	forgotPassword
}
