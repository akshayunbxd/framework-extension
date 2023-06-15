// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// // 	console.log("inside content script");
// // 	if (request.message === "insertScript") {
// // 		const script = document.createElement("script");
// // 		script.textContent = "console.log('Inline script injected!');";
// // 		document.body.document.bodyendChild(script);
// // 	}
// // });




// // document.body.style.display = "none";
// chrome.runtime.onMessage.addListener(
// 	function (request, sender, sendResponse) {
// 		if (request.message === "apply_changes") {
// 			fetch_script();
// 		}
// 	}
// );

// function fetch_script() {
// 	(function () {

// 		// // just place a div at top right
// 		// var div = document.createElement('div');
// 		// div.style.position = 'fixed';
// 		// div.style.top = 0;
// 		// div.style.right = 0;
// 		// div.textContent = 'Injected!';
// 		// document.body.appendChild(div);
// 		// const script = document.createElement("script");
// 		// script.src = chrome.runtime.getURL('https://libraries.unbxdapi.com/search-sdk/v2.0.30-bevilles/vanillaSearch.min.js')
// 		// // script.src = chrome.runtime.getURL('public/scripts/vanillaSearch.min.js')
// 		// document.head.appendChild(script);

// 		window.unbxdSearch = new UnbxdSearch({
// 			siteKey: "ss-unbxd-betta-prod35741656525409",
// 			apiKey: "aed56fa947d16c170c4b66a8e558ec49",
// 			// siteKey: "demo-unbxd700181503576558",
// 			// apiKey: "fb853e3332f2645fac9d71dc63e09ec1",
// 			updateUrls: true,
// 			hashMode: true,
// 			searchBoxEl: document.getElementById("unbxdInput"),
// 			searchTrigger: "click",
// 			searchButtonEl: document.getElementById("searchBtn"),
// 			unbxdAnalytics: true,
// 			allowExternalUrlParams: false,
// 			setCategoryId: function (param, self) {
// 				const {
// 					level,
// 					parent,
// 					name,
// 					action
// 				} = param;
// 				let page = ``;
// 				let pathArr = [];
// 				const l = Number(level);
// 				const breadCrumbs = self.getBreadCrumbsList("categoryPath");
// 				breadCrumbs.forEach((element, i) => {
// 					const {
// 						level,
// 						value
// 					} = element;
// 					if (l > Number(level) || Number(level) === 1) {
// 						pathArr.push(value);
// 					}
// 				});
// 				if (action !== "clearCategoryFilter") {
// 					pathArr.push(decodeURIComponent(name));
// 				}
// 				page = pathArr.join(">");
// 				if (window.UnbxdAnalyticsConf) {
// 					window.UnbxdAnalyticsConf.page = "categoryPath:\"" + page + "\"";
// 				}
// 			},
// 			products: {
// 				el: document.getElementById("searchResultsWrapper"),
// 				productType: productType,
// 				onProductClick: function (product, e) {
// 					localStorage.setItem('unx_product_clicked', product.uniqueId);
// 					window.location.href = 'https://www.google.com';
// 			}
// 			},
// 			spellCheck: {
// 				enabled: true,
// 				el: document.getElementById("didYouMeanWrapper")
// 			},
// 			noResults: {
// 				el: document.getElementById("noResultWrapper")
// 			},
// 			selectedFacets: {
// 				el: document.getElementById("selectedFacetWrapper")
// 			},
// 			facet: {
// 				isCollapsible: true,
// 				defaultOpen: "NONE",
// 				facetsEl: document.getElementById("facetsWrapper"),
// 				selectedFacetsEl: document.getElementById("selectedFacetWrapper"),
// 				selectedFacetClass: "UNX-selected-facet-btn",
// 				facetTemplate: function(facetInfo, facets, isExpanded,facetSearchTxt, facet){
// 					const urlSearchParams = new URLSearchParams(window.location.search);
// 					const params = Object.fromEntries(urlSearchParams.entries());
// 					var name = facetInfo.displayName;
// 					var filterField = facetInfo.filterField;
// 					// var isSelected = (facetInfo.isSelected) ? 'is-expanded' : '';
// 					var searchStr = window.location.search || '';
// 					var isSelected = searchStr.includes(facetInfo.facetName) ? 'is-expanded' : '';
					
// 					  return[`<div id="${facetInfo.facetName}" class="facets__filters facets__filters--size js-filter-expand UNX_facet_open ${isSelected}">
// 							<span aria-label="Filter: ${filterField}" role="text" class="facets__filters-label">${name}</span>
// 							 <ul data-search-facet-container="" class="facets__filters-values facets__filters-values--size list-reset js-filter-values UNX_facet_open ${isSelected}">
// 							  ${facets}
// 							</ul>
// 							</div>                 
// 							`].join('');
// 						  },
// 				facetItemTemplate : function(facet, value, facetSearchTxt){
// 					  const {
// 						facetName,
// 						isSelected,
// 						multiLevelFacetSelectorClass,
// 						displayName
// 						} = facet;
// 					  const {
// 						name,
// 						count,
// 						dataId
// 						} = value;
// 					  let {
// 						facetClass,
// 						selectedFacetClass
// 						} = this.options.facet;
// 					  const {
// 						UNX_uFilter
// 						  } = this.testIds;
		  
// 					   let action =  "changeFacet";
// 							  let selectedFacet = 'disable';
// 							  let liCss = '';
// 							  let hightlighted = '';
// 							  if(isSelected) {
// 								  selectedFacet = 'checked';
// 								  hightlighted = 'highlight';
// 								  facetClass += ` ${selectedFacetClass} `
// 								  action = "deleteFacetValue";
// 								  liCss = (isSelected) ? 'selected' : '';
// 							  }
// 					return [`<li class="facets__item facets__item--comfort level js-filter-item js-filter-item-${displayName} count-${count} ${liCss} ${facetName}" data-search-facet-value="${dataId}">
// 						<label data-search-facet-label="${name}" data-id="${dataId}" class="facet-checkbox facet-checkbox-${displayName} UNX-change-facet ${facetClass} " data-facet-action="${action}" data-test-id="${UNX_uFilter}" data-facet-name="${facetName}" data-handler-init="true">
// 						  <input data-search-facet-input="" ${selectedFacet} class="js-filter-checkbox" type="checkbox" value="${name}">
// 						<span class="${hightlighted}">${name} (${count})</span>
// 						</label>
// 						</li>`].join(''); 
// 					  },
// 				selectedFacetTemplate: function(selections, facet, selectedFacetsConfig) {
// 				  const {
// 					  clearAllText,
// 					  clearFacetsSelectorClass
// 				  } = facet;
// 				  const selectedFClass = (this.selectedFacetClass) ? this.selectedFacetClass : selectedFacetsConfig.selectedFacetClass;
		
// 				  if(selections.length > 0) {
// 					return [`<div class="collection__active-filters UNX-facets-selections">`,
// 							  `${selections}`,
// 							`</div>`].join('');
// 				  } else {
// 					  return ``;
// 				  }
// 			  },
// 				selectedFacetItemTemplate:function(selectedFacet, selectedFacetItem, facetConfig, selectedFacetsConfig){
// 					const {
// 						facetName,
// 						facetType
// 					} = selectedFacet;
// 					const  {
// 						name,
// 						count,
// 						dataId
// 					} = selectedFacetItem;
// 					const {
// 						facetClass,
// 						selectedFacetClass,
// 						removeFacetsSelectorClass
// 					} = this.options.facet;
// 					const {
// 						UNX_uFilter
// 					} = this.testIds;
// 					let action = "deleteSelectedFacetValue";
				  
// 					const css = ` ${facetClass} ${selectedFacetClass} `;
					
// 					return [`<a data-test-id="${UNX_uFilter}" class="collection__active-filters-btn btn btn--tertiary search-facet-display-name search-facet-remove-only ${css}" data-facet-name-value="metaf_${facetName}" data-facet-action="${action}" 
// 							 data-facet-name="${facetName}" data-facet-value="${facetName}" data-id="${dataId}" data-handler-init="true">${name}
// 							 <i class="collection__active-filters-icon icon icon--close-blue" 
// 							 data-facet-action="${action}" data-facet-name="${facetName}" data-facet-value="${facetName}" data-id="${dataId}" >
// 							 </i> </a>`].join('');
// 				},
// 			  },
		
			
// 			pagination: {
// 				// type: 'CLICK_N_SCROLL',
// 				type: 'INFINITE_SCROLL',
// 				// el: document.querySelector('.unxPagination'),
// 				usePageAndCount: false,
// 				heightDiffToTriggerNextPage: 100,
// 				infiniteScrollTriggerEl: document.getElementById('searchResultsWrapper'),
// 				onPaginate: function (data) { console.log(data, "data") }
// 			},
// 			breadcrumb: {
// 				el: document.getElementById("breadcrumpContainer")
// 			},
// 			pagesize: {
// 				enabled: false,
// 				el: document.getElementById("changeNoOfProducts")
// 			},
		
// 			sort: {
// 				enabled: false,
// 				el: document.getElementById("sortWrapper"),
// 				options: [ {
// 					value: "price desc",
// 					text: "Price High to Low"
// 				},
// 				{
// 					value: "price asc",
// 					text: " Price Low to High"
// 				}
// 				]
// 			},
// 			loader: {
// 				el: document.getElementById("loaderEl")
// 			},
// 			productView: {
// 				el: document.getElementById("productViewTypeContainer"),
// 				defaultViewType: "GRID"
// 			},
// 			banner: {
// 				el: document.getElementById("bannerContainer"),
// 				count: 1
// 			},
// 			swatches: {
// 				enabled: true,
// 				attributesMap: {
// 					swatchList: "color",
// 					swatchImgs: "unbxd_color_mapping",
// 					swatchColors: "color"
// 				}
// 			},
// 			onAction: function (e, ctx) { },
// 			onEvent: unbxdCallbackEcma
// 		});
		
// 		window.unbxdSearch.getResults('*')

// 		alert('donejgdddd')


// 	})();

// 	// document.body.style.backgroundColor = "orange";
// 	// fetch('https://libraries.unbxdapi.com/search-sdk/v2.0.30-bevilles/vanillaSearch.min.js')
// 	// .then(response => response.text())
// 	// .then(scriptText => {
// 	//   chrome.tabs.executeScript(tabId, {
// 	//     code: scriptText
// 	//   });


// 	//   if(window.UnbxdSearch){
// 	//     alert('yess')
// 	//   }
// 	// });
// }

// // function apply_changes(){
// //   console.log('hello');
// //   // console.log('document', document);
// //   // debugger
// //   		const script = document.createElement("script");
// // 		script.src = "https://libraries.unbxdapi.com/search-sdk/v2.0.30-bevilles/vanillaSearch.min.js";
// // 		document.body.appendChild(script);
// //   //  if(document.body.style.display === "none"){
// //   //    document.body.style.display = "block";
// //   //  }else{
// //   //    document.body.style.display = "none";
// //   //  }
// // }


// // // This script will be injected into the website by the extension
// // // You can modify this script to perform specific tasks on the website
// // console.log('Injected script is executed');

// // // Example: Sending a message from the content script to the extension
// // chrome.runtime.sendMessage({ action: 'messageFromContentScript', data: 'Hello from content script!' }, (response) => {
// //   console.log('Response from extension:', response);
// // });








 ( function(){
	console.log('window', window)

	let injectScript = function (text, data) {
		var parent = document.documentElement,
		  script = document.createElement('script');
	  
		script.text = text;
		script.async = false;
	  
		for (var key in data) {
		  script.setAttribute('data-' + key.replace(/_/g, '-'), data[key]);
		}
	  
		parent.insertBefore(script, parent.firstChild);
		parent.removeChild(script);
	  };


	function fetch_script() {
		const scriptUrl = 'https://libraries.unbxdapi.com/search-sdk/v2.0.30-bevilles/vanillaSearch.min.js';
	  
		fetch(scriptUrl)
		  .then(response => response.text())
		  .then(scriptText => {
			// const script = document.createElement('script');
			// script.textContent = scriptText;
			// document.head.appendChild(script);
			// var win = chrome.extension.getViews()[0].contentWindow;
			console.log('var win = chrome.extension.getViews()[0].contentWindow;')
			injectScript(scriptText);

		  })
		  .catch(console.error);
	  }
	  
	  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.message === 'apply_changes') {
			console.log('received', request.config)

			fetch_script()
			// window.unbxdSearch = new UnbxdSearch(config);


		//   fetch_script();
		// chrome.runtime.sendMessage('dhdgffkkebhmkfjojejmpbldmpobfkfo', { message: 'Hello from sender extension', config: request.config });
	
		}

		if (request.message === 'on_cdn_url') {
			
	
		}


	  });

  })(window)