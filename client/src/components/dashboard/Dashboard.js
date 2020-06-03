import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';
import { getCurrentProfile } from '../../actions/profile';
const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) => {
	useEffect(
		() => {
			getCurrentProfile();
		},
		[ getCurrentProfile ]
	);
	return loading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className='large text-primary'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user' /> Welcome {user && user.name}
			</p>
			{profile !== null ? (
				<Fragment>
					<DashboardActions />
					{''}
					<Experience experience={profile.experience} />
					<Education education={profile.education} />
					{''}
					<br />
					<button onClick={() => deleteAccount()} className='btn btn-danger'>
						<i className='fas fa-user-minus' /> {''} Delete Account
					</button>
				</Fragment>
			) : (
				<Fragment>
					You have not setup a profile, please add some info <br />
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create profile
					</Link>{' '}
				</Fragment>
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	deleteAccount: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
