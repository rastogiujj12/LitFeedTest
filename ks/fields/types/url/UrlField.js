import React from 'react';
import Field from '../Field';
import { GlyphButton, FormInput } from '../../../admin/client/App/elemental';

module.exports = Field.create({
	displayName: 'URLField',
	statics: {
		type: 'Url',
	},
	openValue () {
		var href = this.props.value;
		if (!href) return;
		if (!/^(mailto\:)|(\w+\:\/\/)/.test(href)) {
			href = 'http://' + href;
		}
		window.open(href);
	},
	renderLink () {
		if (!this.props.value) return null;

		return (
			<GlyphButton
				className="keystone-relational-button"
				glyph="link"
				onClick={this.openValue}
				title={'Open ' + this.props.value + ' in a new tab'}
				variant="link"
			/>
		);
	},
	renderField () {
		const styles = {
			flexbox: {
				display:'flex',
				alignItems: 'center',
    			justifyContent: 'space-between'
			},
			formInput:{
				width:'95%'
			}
		}
		return (
			<div style={styles.flexbox}>
			<FormInput
				autoComplete="off"
				name={this.getInputName(this.props.path)}
				onChange={this.valueChanged}
				ref="focusTarget"
				type="url"
				value={this.props.value}
				style={styles.formInput}
			/>
			<a href={this.props.value} target="_new"><img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEtSURBVDiNjdO/K8VRGMfx13UZiMLiHzBbWMjgv5ABi1IGpRQGYVAW+VEGxUApUvwJRkpKoqwMkkT5nYXBczlu93KfOsPn8zzv5zznfM+X0qIXR3jGBWZRWwqYwRI+Cqyz/5pksJgAW2hHN27Cm/urwWwCL0fDXHSHf1kMHkzgVZTl5Vsj91oIrsJ9FGyiEcN5TdYif5yCFRhPur+gBiehR6NuOpmuLweXYxv7aIvkfew6Evo2pnsIvS7uJYONMO9QjafQQ8jiMXQTDuNo2dzuA8lIU+FNht5DHd5Ct2AiJv6O00iuJF4WY2jAbnKkSgXiPQqa8/yyOGduuv5CMFxFQWcevJrAM8Vgfp7rNXrQgZ0Env8LhnqcJ0C6Fvx+wkWjztePceHrkx2gqxTwE0l3YlQ4P9K2AAAAAElFTkSuQmCC" alt="open link" /></a>

			</div>
		);
	},
	wrapField () {
		return (
			<div style={{ position: 'relative' }}>
				{this.renderField()}
				{this.renderLink()}
			</div>
		);
	},
	renderValue () {
		const { value } = this.props;
		return (
			<FormInput noedit onClick={value && this.openValue}>
				{value}
			</FormInput>
		);
	},
});
