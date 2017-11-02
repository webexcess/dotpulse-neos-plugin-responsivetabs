import Gator from 'gator';
import scroller from './Scroller.js';
import './PushState.js';

let tabContainers = [];
scroller.defaults.offset = -210;

Element.prototype.responsiveTabs = function (options) {
	tabContainers[tabContainers.length] = new ResponsiveTabs(this, options);
	return this;
};

Object.defineProperty(Object.prototype, 'responsiveTabs', {
	value: function (options) {
		ResponsiveTabs.cleanArray(this).forEach(element => {
			tabContainers[tabContainers.length] = new ResponsiveTabs(element, options);
		});
		return this;
	}
});

class ResponsiveTabs {
	constructor(container, properties) {
		let opt = properties || {};

		if (!opt.useHash) {
			opt.useHash = false;
		}
		if (!opt.tablist) {
			opt.tablist = '.responsive-tabs__tablist';
		}
		if (!opt.wrapper) {
			opt.wrapper = '.responsive-tabs__wrapper';
		}
		if (!opt.content) {
			opt.content = '.responsive-tabs__content';
		}

		if (!opt.tabClass) {
			opt.tabClass = 'responsive-tabs__tab';
		}
		if (!opt.tabAcitveClass) {
			opt.tabAcitveClass = 'responsive-tabs__tab-active';
		}
		if (!opt.accordionTitleClass) {
			opt.accordionTitleClass = 'responsive-tabs__title';
		}
		if (!opt.itemClass) {
			opt.itemClass = 'responsive-tabs__item';
		}
		if (!opt.itemAcitveClass) {
			opt.itemAcitveClass = 'responsive-tabs__item-active';
		}
		if (!opt.itemClosedAccordionClass) {
			opt.itemClosedAccordionClass = 'responsive-tabs__item-closed-accordion-only';
		}

		this.element = container;
		this.properties = opt;

		this.tabs = ResponsiveTabs.cleanArray(container.querySelector(opt.tablist).children);
		this.items = ResponsiveTabs.cleanArray(container.querySelector(opt.wrapper).children);

		this.hashItemId = getPushState().hash;

		this.setPanelDefaultHeight();
		this.itemClick();

		if (opt.useHash) {
			this.openByHash();
		}

		window.onresize = ()=>this.resize();
	}

	static cleanArray(DirtyArray) {
		return Array.prototype.slice.call(DirtyArray);
	}

	setPanelDefaultHeight() {
		this.items.forEach(item => {
			let itemContent = item.querySelector(this.properties.content);
			let defaultHeight = window.getComputedStyle(itemContent.children[0]).height;

			itemContent.setAttribute('data-default-height', defaultHeight);
			if (itemContent.parentNode.classList.contains(this.properties.itemAcitveClass) || itemContent.style.maxHeight.replace('px', '') > 0) {
				itemContent.style.maxHeight = defaultHeight;
			}
		});
	}

	openByHash() {
		if (this.hashItemId) {
			let itemContainer = this.element.querySelector('#' + this.hashItemId);
			if (itemContainer) {
				itemContainer.querySelector('.' + this.properties.accordionTitleClass).click();
			}
		}
	}

	itemClick() {
		Gator(this.element).on('click', '.' + this.properties.tabClass + ',.' + this.properties.accordionTitleClass, event => {
			let clickArea = event.target;
			if (event.target.nodeName == 'SPAN') {
				clickArea = event.target.parentNode;
			}

			let type = clickArea.classList.contains(this.properties.accordionTitleClass) ? 'accordion' : 'tab';
			let itemContainer = (type == 'accordion') ? clickArea.parentNode : document.getElementById(clickArea.getAttribute('aria-controls'));
			let isItemOpen = itemContainer.classList.contains(this.properties.itemAcitveClass);

			if (this.properties.useHash) {
				if (this.items.indexOf(itemContainer) > 0) {
					setPushState({hash: itemContainer.id});
				} else {
					setPushState();
				}
			}

			// close all accordionItems if attribute 'data-close-others' is set
			this.items.forEach(item => {
				if (item.id != itemContainer.id) {
					this.closeItem(item);
					document.getElementById(item.getAttribute('aria-labelledby')).classList.remove(this.properties.tabAcitveClass);
					item.classList.remove(this.properties.itemClosedAccordionClass);
				}
			});

			if (!isItemOpen) {
				this.openItem(itemContainer);
			} else {
				if (type == 'accordion') {
					this.closeItem(itemContainer);
					itemContainer.classList.add(this.properties.itemClosedAccordionClass);
				}
			}
		});
	}

	resize() {
		this.setPanelDefaultHeight();
	}

	openItem(item) {
		item.classList.add(this.properties.itemAcitveClass);
		item.classList.remove(this.properties.itemClosedAccordionClass);
		item.querySelector(this.properties.content).style.maxHeight = item.querySelector(this.properties.content).getAttribute('data-default-height');
		document.getElementById(item.getAttribute('aria-labelledby')).classList.add(this.properties.tabAcitveClass);

		setTimeout(function () {
			scroller(item);
		}, 500);
	}

	closeItem(item) {
		item.classList.remove(this.properties.itemAcitveClass);
		item.querySelector(this.properties.content).style.maxHeight = 0;
	}
}

module.exports = ResponsiveTabs;
