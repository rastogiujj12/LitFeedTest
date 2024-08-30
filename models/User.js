var keystone = require('./../ks');
var Types = keystone.Field.Types;
var User = new keystone.List('User', {
	track:true
});


/**
 * User Model
 * ==========
 */

User.add({
	name:                { type: Types.Name, required: true, initial:true },
	email:               { type: Types.Email, initial: true, required: true, unique: true },
	password:            { type: Types.Password, initial: true, required: true },
	isVerified:          { type: Boolean, default: false },
	incomingRequests:    { type: Types.Relationship, ref: 'User', many: true },
	followers:           { type: Types.Relationship, ref: 'User', many: true },
	follows:             { type: Types.Relationship, ref: 'User', many: true },
	outgoingRequests:    { type: Types.Relationship, ref: 'User', many: true },
	isPrivate:           { type: Boolean, default: false }
}, 'Permissions', {
	isAdmin:      { type: Boolean, label: 'Can access Keystone', default:false },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin, isPrivate';
User.register();
