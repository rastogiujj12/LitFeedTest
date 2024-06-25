/* eslint-disable react/jsx-no-bind */

import assign from 'object-assign';
import { css, StyleSheet } from 'aphrodite/no-important';
import React from 'react';
import Field from '../Field';
import Domify from 'react-domify';

import { Fields } from 'FieldTypes';
import { Button, GlyphButton } from '../../../admin/client/App/elemental';
import InvalidFieldType from '../../../admin/client/App/shared/InvalidFieldType';


let i = 0;
function generateId () {
	return i++;
};

const ItemDom = ({ name, id, onRemove, children }) => (
	<div style={{
		borderTop: '2px solid #eee',
		paddingTop: 15,
	}}>
		{name && <input type="hidden" name={name} value={id}/>}
		{children}
		<div style={{ textAlign: 'right', paddingBottom: 10 }}>
			<Button size="xsmall" color="danger" onClick={onRemove}>
				Remove
			</Button>
		</div>
	</div>
);

module.exports = Field.create({
	displayName: 'ListField',
	statics: {
		type: 'List',
	},
	propTypes: {
		fields: React.PropTypes.object.isRequired,
		label: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		path: React.PropTypes.string.isRequired,
		value: React.PropTypes.array,
	},
	addItem () {
		const { path, value, onChange } = this.props;
		onChange({
			path,
			value: [
				...value,
				{
					id: generateId(),
					_isNew: true,
				},
			],
		});
	},
	removeItem (index) {
		const { value: oldValue, path, onChange } = this.props;
		const value = oldValue.slice(0, index).concat(oldValue.slice(index + 1));
		onChange({ path, value });
	},
	handleFieldChange (index, event) {
		const { value: oldValue, path, onChange } = this.props;
		const head = oldValue.slice(0, index);
		const item = {
			...oldValue[index],
			[event.path]: event.value,
		};
		const tail = oldValue.slice(index + 1);
		const value = [...head, item, ...tail];
		onChange({ path, value });
	},
	renderFieldsForItem (index, value) {
		// console.log("?", index, value, this.props.fields)
		return Object.keys(this.props.fields).map((path) => {
			const field = this.props.fields[path];
			if (typeof Fields[field.type] !== 'function') {
				return React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
			}
			const props = assign({}, field);
			props.value = value[field.path];
			props.values = value;
			props.onChange = this.handleFieldChange.bind(this, index);
			props.mode = 'edit';
			props.inputNamePrefix = `${this.props.path}[${index}]`;
			props.key = field.path;
			// TODO ?
			// if (props.dependsOn) {
			// 	props.currentDependencies = {};
			// 	Object.keys(props.dependsOn).forEach(dep => {
			// 		props.currentDependencies[dep] = this.state.values[dep];
			// 	});
			// }
			console.log("props", props, field.type);
			// if(field.type=='url') return (
			// 	<div style={styles.flexbox}>
			// 		{React.createElement(Fields[field.type], props)} 
			// 		<a href={props.value} target="_new"><img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEtSURBVDiNjdO/K8VRGMfx13UZiMLiHzBbWMjgv5ABi1IGpRQGYVAW+VEGxUApUvwJRkpKoqwMkkT5nYXBczlu93KfOsPn8zzv5zznfM+X0qIXR3jGBWZRWwqYwRI+Cqyz/5pksJgAW2hHN27Cm/urwWwCL0fDXHSHf1kMHkzgVZTl5Vsj91oIrsJ9FGyiEcN5TdYif5yCFRhPur+gBiehR6NuOpmuLweXYxv7aIvkfew6Evo2pnsIvS7uJYONMO9QjafQQ8jiMXQTDuNo2dzuA8lIU+FNht5DHd5Ct2AiJv6O00iuJF4WY2jAbnKkSgXiPQqa8/yyOGduuv5CMFxFQWcevJrAM8Vgfp7rNXrQgZ0Env8LhnqcJ0C6Fvx+wkWjztePceHrkx2gqxTwE0l3YlQ4P9K2AAAAAElFTkSuQmCC" alt="open link" /></a>
			// 	</div>
			// );
			// else 
			return React.createElement(Fields[field.type], props); 
		}, this);
	},
	renderItems () {
		const { value = [], path } = this.props;
		const onAdd = this.addItem;
		return (
			<div>
				{value.map((value, index) => {
					const { id, _isNew } = value;
					const name = !_isNew && `${path}[${index}][id]`;
					const onRemove = e => this.removeItem(index);

					return (
						<ItemDom key={id} {...{ id, name, onRemove }}>
							{this.renderFieldsForItem(index, value)}
						</ItemDom>
					);
				})}
				<GlyphButton color="success" glyph="plus" position="left" onClick={onAdd}>
					Add
				</GlyphButton>
			</div>
		);
	},
	renderUI () {
		const { label, value } = this.props;
		return (
			<div className={css(classes.container)}>
				<h3 data-things="whatever">{label}</h3>
				{this.shouldRenderField() ? (
					this.renderItems()
				) : (
					<Domify value={value} />
				)}
				{this.renderNote()}
			</div>
		);
	},
});

const classes = StyleSheet.create({
	container: {
		marginTop: '2em',
		paddingLeft: '2em',
		boxShadow: '-3px 0 0 rgba(0, 0, 0, 0.1)',
	},
});
