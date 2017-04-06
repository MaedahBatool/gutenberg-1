import TinyMCEAlignmentToolbar from '../../../controls/tinymce-alignment-toolbar';
import AbsolutePosition from './AbsolutePosition';
/**
 * External dependencies
 */
import Portal from 'react-portal';

const Editable = wp.blocks.Editable;
const { html, prop } = wp.blocks.query;

function List( { nodeName, children } ) {
	// nodeName.toLowerCase() is used to map DOM nodeName values to proper tag.
	return wp.element.createElement( nodeName.toLowerCase(), null, children );
}

const ListBlock = ( { attributes, isSelected, rect, onChange } ) => {
	const { listType = 'ol', items = [] } = attributes;
	const value = items.map( i => {
		return `<li>${ i.value }</li>`;
	} ).join( '' );

	return (
		<div>
			<Editable
				nodeName={ listType }
				value={ value }
				onChange={ onChange } />
			<Portal isOpened={ isSelected } >
				<AbsolutePosition top={ rect && ( rect.top - 36 + window.scrollY ) } left={ rect && rect.left } >
					<TinyMCEAlignmentToolbar />
				</AbsolutePosition>
			</Portal>
		</div>
	);
};

wp.blocks.registerBlock( 'core/list', {
	title: 'List',
	icon: 'editor-ul',
	category: 'common',

	attributes: {
		listType: prop( 'ol,ul', 'nodeName' ),
		items: wp.blocks.query.query(
			'li',
			{
				value: html()
			}
		)
	},

	edit( props ) {
		return <ListBlock { ...props } />;
	},

	save( { attributes } ) {
		const { listType = 'ol', items = [] } = attributes;
		const children = items.map( ( i, index ) => <li key={ index }>{i.value}</li> );
		return <List nodeName={ listType }>{children}</List>;
	}
} );

ListBlock.propTypes = {
	attributes: wp.element.PropTypes.object,
	isSelected: wp.element.PropTypes.bool,
	rect: wp.element.PropTypes.shape( {
		top: wp.element.PropTypes.number,
		left: wp.element.PropTypes.number
	} ),
	onChange: wp.element.PropTypes.func
};
