function ResponsiveTabs(responsiveTabsContainerClass) {
	if (typeof responsiveTabsContainerClass != 'string') {
		return;
	}

	var responsiveTabs = document.querySelectorAll(responsiveTabsContainerClass);
	var isItemOpen = false;

	(function init() {
		setPanelDefaultHeight();

		[].forEach.call(responsiveTabs, function (accordion) {
			[].forEach.call(accordion.querySelectorAll('.responsive-tabs__tab'), function (tab) {
				tab.addEventListener('click', function (event) {
					panelEL = document.getElementById(event.target.getAttribute('aria-controls'));

					removeActiveAccordionClass(accordion);
					removeClosedAccordionOnlyClass(accordion);

					tab.classList.add('responsive-tabs__tab-active');
					panelEL.classList.add('responsive-tabs__item-active');
					panelEL.querySelector('.responsive-tabs__content').style.maxHeight = '9999px';
				});
			});

			[].forEach.call(accordion.querySelectorAll('.responsive-tabs__title'), function (accordionTitle) {
				if (!accordionTitle.parentNode.classList.contains('responsive-tabs__item-active')) {
					accordionTitle.nextElementSibling.style.maxHeight = 0;
				} else {
					accordionTitle.nextElementSibling.style.maxHeight = accordionTitle.nextElementSibling.getAttribute('data-default-height');
				}

				accordionTitle.addEventListener('click', function (event) {
					isItemOpen = event.target.parentNode.classList.contains('responsive-tabs__item-active');

					removeActiveAccordionClass(accordion);
					removeClosedAccordionOnlyClass(accordion);

					if (!isItemOpen) {
						event.target.parentNode.classList.add('responsive-tabs__item-active');
						event.target.nextElementSibling.style.maxHeight = event.target.nextElementSibling.getAttribute('data-default-height');
					} else {
						event.target.parentNode.classList.remove('responsive-tabs__item-active');
						event.target.parentNode.classList.add('responsive-tabs__item-closed-accordion-only');
						event.target.nextElementSibling.style.maxHeight = 0;
					}

					document.getElementById(event.target.parentNode.getAttribute('id').replace('item', 'tab')).classList.add('responsive-tabs__tab-active');
				});
			});
		});
	})();

	window.addEventListener('resize', setPanelDefaultHeight, false);

	function setPanelDefaultHeight() {
		[].forEach.call(document.querySelectorAll('.responsive-tabs__content'), function (accordionContent) {
			accordionContent.setAttribute('data-default-height', window.getComputedStyle(accordionContent.children[0]).height);
		});
	}

	function removeActiveAccordionClass(accordionContainer) {
		[].forEach.call(accordionContainer.querySelectorAll('.responsive-tabs__item-active'), function (accordionActiveItem) {
			accordionActiveItem.classList.remove('responsive-tabs__item-active');
			accordionActiveItem.querySelector('.responsive-tabs__content').style.maxHeight = 0;
		});

		[].forEach.call(accordionContainer.querySelectorAll('.responsive-tabs__tab-active'), function (accordionActiveTab) {
			accordionActiveTab.classList.remove('responsive-tabs__tab-active');
		});
	}

	function removeClosedAccordionOnlyClass(accordionContainer) {
		// remove hidden mobile class from any other panel as we'll want that panel to be open at mobile size
		[].forEach.call(accordionContainer.querySelectorAll('.responsive-tabs__item-closed-accordion-only'), function (closedAccordionOnly) {
			closedAccordionOnly.classList.remove('responsive-tabs__item-closed-accordion-only');
		});
	}
}
