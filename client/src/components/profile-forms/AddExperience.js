import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../actions/profile';
const AddExperience = ({ addExperience, history }) => {
	const [ formData, setFormData ] = useState({
		company: '',
		title: '',
		location: '',
		from: '',
		to: '',
		current: false,
		description: ''
	});

	const { company, title, location, from, to, current, description } = formData;

	const [ toDateDisable, toggleDisable ] = useState(false);
	const onChange = (event) => {
		setFormData({
			...formData,
			[event.target.name]: event.target.value
		});
	};

	return (
		<Fragment>
			<h1 className='large text-primary'>Add An Experience</h1>
			<p className='lead'>
				<i className='fas fa-code-branch' /> Add any developer/programming positions that you have had in the
				past
			</p>
			<small>* = required field</small>
			<form
				className='form'
				onSubmit={(event) => {
					event.preventDefault();
					addExperience(formData, history);
				}}
			>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Job Title'
						name='title'
						value={title}
						onChange={(event) => onChange(event)}
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Company'
						name='company'
						value={company}
						onChange={(event) => onChange(event)}
						required
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Location'
						name='location'
						location={location}
						onChange={(event) => onChange(event)}
					/>
				</div>
				<div className='form-group'>
					<h4>From Date</h4>
					<input type='date' name='from' value={from} onChange={(event) => onChange(event)} />
				</div>
				<div className='form-group'>
					<p>
						<input
							type='checkbox'
							name='current'
							checked={current}
							value={current}
							onChange={(event) => {
								setFormData({
									...formData,
									current: !current
								});
								toggleDisable(!toDateDisable);
							}}
						/>
						{''}Current Job
					</p>
				</div>
				<div className='form-group'>
					<h4>To Date</h4>
					<input
						type='date'
						name='to'
						value={to}
						onChange={(event) => onChange(event)}
						disabled={toDateDisable ? 'disabled' : ''}
					/>
				</div>
				<div className='form-group'>
					<textarea
						name='description'
						cols='30'
						rows='5'
						placeholder='Job Description'
						value={description}
						onChange={(event) => onChange(event)}
					/>
				</div>
				<input type='submit' className='btn btn-primary my-1' />
				<Link className='btn btn-light my-1' to='/dashboard'>
					Go Back
				</Link>
			</form>
		</Fragment>
	);
};

AddExperience.propTypes = {
	addExperience: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(withRouter(AddExperience));
