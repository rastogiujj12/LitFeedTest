import React, { PropTypes } from 'react';
import { Button } from '../../App/elemental';

// TODO Figure out if we should change "Keystone" to "Admin area"

const UserInfo = ({
	adminPath,
	signoutPath,
	userCanAccessKeystone,
	userName,
	isSuperAdmin
}) => {
	const adminButton = userCanAccessKeystone ? (
		<Button href={adminPath} color="primary">
			Open Keystone
		</Button>
	) : null;
		console.log("is super admin", isSuperAdmin)
	return (
		<div className="auth-box__col">
			<p>Hi {userName},</p>
			<p>You're already signed in.</p>
			{adminButton}
			<Button href={signoutPath} variant="link" color="cancel">
				Sign Out
			</Button>
		</div>
	);
};

UserInfo.propTypes = {
	adminPath: PropTypes.string.isRequired,
	signoutPath: PropTypes.string.isRequired,
	userCanAccessKeystone: PropTypes.bool,
	userName: PropTypes.string.isRequired,
	isSuperAdmin:PropTypes.bool,
};

module.exports = UserInfo;
