require([
         "dojo/dom",
         "dojo/dom-construct",
         "dojo/on",
         "dojo/query",
         "dojo/request/script",
         "dojo/_base/array",
         "dijit/registry",
         "dojox/mobile/RoundRectList",
		"dojox/mobile/ListItem",
		"dojo/NodeList-manipulate",
		"dojo/domReady!"
	],
	function(dom, con, on, $, script, array, registry, RoundRectList, ListItem){
		var search = dom.byId('search'),
			searchButton = dom.byId('searchButton');

		on(searchButton, 'click', searchTwitter);

		function searchTwitter(evt){
			var query = search.value;

			if(query){
				script.get('http://search.twitter.com/search.json', {
					jsonp: 'callback',
					query: {
						q: query
					}
				}).then(
					function(data){
						var results = data.results,
							list = registry.byId('list'),
							item;

						if(list){
							list.destroy();
						}
						$('#searchBox').after(con.create('ul', {id: 'list'}));
						list = new RoundRectList(null, dom.byId('list'));
						$(list.containerNode).appendTo('body');
						array.forEach(results, function(obj){
							item = new ListItem({
								icon: location.protocol == 'http:' ? obj.profile_image_url : obj.profile_image_url_https
							});
							$(item.labelNode)
								.append(con.create('em', {innerHTML: obj.from_user_name}))
								.append(con.create('span', {innerHTML: '@' + obj.from_user}))
								.append(con.create('div', {innerHTML: obj.text}));
							list.addChild(item);
						});
					}
				);
			}
		}
	}
);