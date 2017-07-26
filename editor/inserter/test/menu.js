/**
 * External dependencies
 */
import { shallow } from 'enzyme';
import { noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { registerBlockType, unregisterBlockType, getBlockTypes } from 'blocks';

/**
 * Internal dependencies
 */
import { InserterMenu } from '../menu';

const textBlock = {
	name: 'core/text-block',
	title: 'Text',
	save: noop,
	edit: noop,
	category: 'common',
};

const advancedTextBlock = {
	name: 'core/advanced-text-block',
	title: 'Advanced Text',
	save: noop,
	edit: noop,
	category: 'common',
};

const moreBlock = {
	name: 'core/more-block',
	title: 'More',
	save: noop,
	edit: noop,
	category: 'layout',
	useOnce: 'true',
};

const youtubeBlock = {
	name: 'core/youtube-block',
	title: 'Youtube',
	save: noop,
	edit: noop,
	category: 'embed',
};

describe( 'InserterMenu', () => {
	afterEach( () => {
		getBlockTypes().forEach( ( block ) => {
			unregisterBlockType( block.name );
		} );
	} );

	beforeEach( () => {
		registerBlockType( textBlock.name, textBlock );
		registerBlockType( advancedTextBlock.name, advancedTextBlock );
		registerBlockType( moreBlock.name, moreBlock );
		registerBlockType( youtubeBlock.name, youtubeBlock );
	} );

	it( 'Should show the recent tab by default', () => {
		const wrapper = shallow(
			<InserterMenu
				instanceId={ 1 }
				blocks={ [] }
				recentlyUsedBlocks={ [] }
			/>
		);
		const activeCategory = wrapper.find( '.editor-inserter__tab .is-active' );
		const visibleBlocks = wrapper.find( '.editor-inserter__block' );
		expect( activeCategory.text() ).toBe( 'Recent' );
		expect( visibleBlocks.length ).toBe( 0 );
	} );

	it( 'Should show the recently used blocks in the recent tab', () => {
		const wrapper = shallow(
			<InserterMenu
				instanceId={ 1 }
				blocks={ [] }
				recentlyUsedBlocks={ [ advancedTextBlock ] }
			/>
		);
		const visibleBlocks = wrapper.find( '.editor-inserter__block' );
		expect( visibleBlocks.length ).toBe( 1 );
		expect( visibleBlocks.text() ).toBe( '<Dashicon />Advanced Text' );
	} );

	it( 'The embed tab should show blocks from the embed category', () => {
		const wrapper = shallow(
			<InserterMenu
				instanceId={ 1 }
				blocks={ [] }
				recentlyUsedBlocks={ [] }
			/>
		);
		const embedTab = wrapper.find( '.editor-inserter__tab' ).filterWhere( ( node ) => node.text() === 'Embeds' );
		embedTab.simulate( 'click' );
		const activeCategory = wrapper.find( '.editor-inserter__tab .is-active' );
		const visibleBlocks = wrapper.find( '.editor-inserter__block' );
		expect( activeCategory.text() ).toBe( 'Embeds' );
		expect( visibleBlocks.length ).toBe( 1 );
		expect( visibleBlocks.text() ).toBe( '<Dashicon />Youtube' );
	} );

	it( 'The blocks tab should show show all the blocks except the embeds', () => {
		const wrapper = shallow(
			<InserterMenu
				instanceId={ 1 }
				blocks={ [] }
				recentlyUsedBlocks={ [] }
			/>
		);
		const embedTab = wrapper.find( '.editor-inserter__tab' ).filterWhere( ( node ) => node.text() === 'Blocks' );
		embedTab.simulate( 'click' );
		const activeCategory = wrapper.find( '.editor-inserter__tab .is-active' );
		const visibleBlocks = wrapper.find( '.editor-inserter__block' );
		expect( activeCategory.text() ).toBe( 'Blocks' );
		expect( visibleBlocks.length ).toBe( 3 );
	} );

	it( 'Should disable the block allowed to be used only once', () => {
		const wrapper = shallow(
			<InserterMenu
				instanceId={ 1 }
				blocks={ [ { name: moreBlock.name } ] }
				recentlyUsedBlocks={ [] }
			/>
		);
		const embedTab = wrapper.find( '.editor-inserter__tab' ).filterWhere( ( node ) => node.text() === 'Blocks' );
		embedTab.simulate( 'click' );
		const visibleBlocks = wrapper.find( '.editor-inserter__block[disabled]' );
		expect( visibleBlocks.length ).toBe( 1 );
		expect( visibleBlocks.text() ).toBe( '<Dashicon />More' );
	} );
} );
