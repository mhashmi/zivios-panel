/*
	Copyright (c) 2004-2008, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(!dojo._hasResource["zivios.TabHandler"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["zivios.TabHandler"] = true;
/**
 * Copyright (c) 2008-2010 Zivios, LLC.
 *
 * This file is part of Zivios.
 *
 * Zivios is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Zivios is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Zivios.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     Zivios
 * @copyright   Copyright (c) 2008-2010 Zivios, LLC. (http://www.zivios.org)
 * @license     http://www.zivios.org/legal/license
 **/
dojo.provide("zivios.TabHandler");
dojo.declare("zivios.TabHandler", null, {
    constructor: function(baseUrl) {
        this.baseUrl     = baseUrl;
        this.ziviosTab   = null;
    },

    createApplicationTab: function(baseUrl,ptab,ctab,url,title,dynRefresh) {
        
        var ros = 1; // unless dynRefresh is defined, refresh on show will 
                     // will default to false.

        if (dijit.byId(ctab)) {
            this.ziviosTab = dijit.byId(ctab);
        } else {
            // apply defaults as required.
            if (undefined === title) {
                title = 'Zivios Application';
            }
            if (undefined === dynRefresh) {
               var ros = 0;
            }

            this.ziviosTab = new dijit.layout.ContentPane({
                    id: ctab,
                    parseOnLoad: true,
                    title: title,
                    href: url,
                    closable: true,
                    refreshOnShow: ros,
                },
                dojo.doc.createElement("div")
            );
            
            this.getAppContainer(ptab).addChild(this.ziviosTab);
        }
        
        this.getAppContainer(ptab).selectChild(this.ziviosTab);
    },

    getAppContainer: function(parentTab) {
        return dijit.byId(parentTab);
    },
});


}

if(!dojo._hasResource["dojo.string"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.string"] = true;
dojo.provide("dojo.string");

/*=====
dojo.string = { 
	// summary: String utilities for Dojo
};
=====*/

dojo.string.rep = function(/*String*/str, /*Integer*/num){
	//	summary:
	//		Efficiently replicate a string `n` times.
	//	str:
	//		the string to replicate
	//	num:
	//		number of times to replicate the string
	
	if(num <= 0 || !str){ return ""; }
	
	var buf = [];
	for(;;){
		if(num & 1){
			buf.push(str);
		}
		if(!(num >>= 1)){ break; }
		str += str;
	}
	return buf.join("");	// String
};

dojo.string.pad = function(/*String*/text, /*Integer*/size, /*String?*/ch, /*Boolean?*/end){
	//	summary:
	//		Pad a string to guarantee that it is at least `size` length by
	//		filling with the character `ch` at either the start or end of the
	//		string. Pads at the start, by default.
	//	text:
	//		the string to pad
	//	size:
	//		length to provide padding
	//	ch:
	//		character to pad, defaults to '0'
	//	end:
	//		adds padding at the end if true, otherwise pads at start
	//	example:
	//	|	// Fill the string to length 10 with "+" characters on the right.  Yields "Dojo++++++".
	//	|	dojo.string.pad("Dojo", 10, "+", true);

	if(!ch){
		ch = '0';
	}
	var out = String(text),
		pad = dojo.string.rep(ch, Math.ceil((size - out.length) / ch.length));
	return end ? out + pad : pad + out;	// String
};

dojo.string.substitute = function(	/*String*/		template, 
									/*Object|Array*/map, 
									/*Function?*/	transform, 
									/*Object?*/		thisObject){
	//	summary:
	//		Performs parameterized substitutions on a string. Throws an
	//		exception if any parameter is unmatched.
	//	template: 
	//		a string with expressions in the form `${key}` to be replaced or
	//		`${key:format}` which specifies a format function.
	//	map:
	//		hash to search for substitutions
	//	transform: 
	//		a function to process all parameters before substitution takes
	//		place, e.g. dojo.string.encodeXML
	//	thisObject: 
	//		where to look for optional format function; default to the global
	//		namespace
	//	example:
	//	|	// returns "File 'foo.html' is not found in directory '/temp'."
	//	|	dojo.string.substitute(
	//	|		"File '${0}' is not found in directory '${1}'.",
	//	|		["foo.html","/temp"]
	//	|	);
	//	|
	//	|	// also returns "File 'foo.html' is not found in directory '/temp'."
	//	|	dojo.string.substitute(
	//	|		"File '${name}' is not found in directory '${info.dir}'.",
	//	|		{ name: "foo.html", info: { dir: "/temp" } }
	//	|	);
	//	example:
	//		use a transform function to modify the values:
	//	|	// returns "file 'foo.html' is not found in directory '/temp'."
	//	|	dojo.string.substitute(
	//	|		"${0} is not found in ${1}.",
	//	|		["foo.html","/temp"],
	//	|		function(str){
	//	|			// try to figure out the type
	//	|			var prefix = (str.charAt(0) == "/") ? "directory": "file";
	//	|			return prefix + " '" + str + "'";
	//	|		}
	//	|	);
	//	example:
	//		use a formatter
	//	|	// returns "thinger -- howdy"
	//	|	dojo.string.substitute(
	//	|		"${0:postfix}", ["thinger"], null, {
	//	|			postfix: function(value, key){
	//	|				return value + " -- howdy";
	//	|			}
	//	|		}
	//	|	);

	thisObject = thisObject||dojo.global;
	transform = (!transform) ? 
					function(v){ return v; } : 
					dojo.hitch(thisObject, transform);

	return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match, key, format){
		var value = dojo.getObject(key, false, map);
		if(format){
			value = dojo.getObject(format, false, thisObject).call(thisObject, value, key);
		}
		return transform(value, key).toString();
	}); // string
};

dojo.string.trim = function(/*String*/ str){
	// summary:
	//		trims whitespaces from both sides of the string
	// description:
	//		This version of trim() was taken from [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript).
	//		The short yet performant version of this function is dojo.trim(),
	//		which is part of Dojo base.
	str = str.replace(/^\s+/, '');
	for(var i = str.length - 1; i >= 0; i--){
		if(/\S/.test(str.charAt(i))){
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;	// String
};

}

if(!dojo._hasResource["dojo.data.util.sorter"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.data.util.sorter"] = true;
dojo.provide("dojo.data.util.sorter");

dojo.data.util.sorter.basicComparator = function(	/*anything*/ a, 
													/*anything*/ b){
	//	summary:  
	//		Basic comparision function that compares if an item is greater or less than another item
	//	description:  
	//		returns 1 if a > b, -1 if a < b, 0 if equal.
	//		undefined values are treated as larger values so that they're pushed to the end of the list.

	var ret = 0;
	if(a > b || typeof a === "undefined" || a === null){
		ret = 1;
	}else if(a < b || typeof b === "undefined" || b === null){
		ret = -1;
	}
	return ret; //int, {-1,0,1}
};

dojo.data.util.sorter.createSortFunction = function(	/* attributes array */sortSpec,
														/*dojo.data.core.Read*/ store){
	//	summary:  
	//		Helper function to generate the sorting function based off the list of sort attributes.
	//	description:  
	//		The sort function creation will look for a property on the store called 'comparatorMap'.  If it exists
	//		it will look in the mapping for comparisons function for the attributes.  If one is found, it will
	//		use it instead of the basic comparator, which is typically used for strings, ints, booleans, and dates.
	//		Returns the sorting function for this particular list of attributes and sorting directions.
	//
	//	sortSpec: array
	//		A JS object that array that defines out what attribute names to sort on and whether it should be descenting or asending.
	//		The objects should be formatted as follows:
	//		{
	//			attribute: "attributeName-string" || attribute,
	//			descending: true|false;   // Default is false.
	//		}
	//	store: object
	//		The datastore object to look up item values from.
	//
	var sortFunctions=[];   

	function createSortFunction(attr, dir){
		return function(itemA, itemB){
			var a = store.getValue(itemA, attr);
			var b = store.getValue(itemB, attr);
			//See if we have a override for an attribute comparison.
			var comparator = null;
			if(store.comparatorMap){
				if(typeof attr !== "string"){
					 attr = store.getIdentity(attr);
				}
				comparator = store.comparatorMap[attr]||dojo.data.util.sorter.basicComparator;
			}
			comparator = comparator||dojo.data.util.sorter.basicComparator; 
			return dir * comparator(a,b); //int
		};
	}
	var sortAttribute;
	for(var i = 0; i < sortSpec.length; i++){
		sortAttribute = sortSpec[i];
		if(sortAttribute.attribute){
			var direction = (sortAttribute.descending) ? -1 : 1;
			sortFunctions.push(createSortFunction(sortAttribute.attribute, direction));
		}
	}

	return function(rowA, rowB){
		var i=0;
		while(i < sortFunctions.length){
			var ret = sortFunctions[i++](rowA, rowB);
			if(ret !== 0){
				return ret;//int
			}
		}
		return 0; //int  
	};  //  Function
};

}

if(!dojo._hasResource["dojox.data.QueryReadStore"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.data.QueryReadStore"] = true;
dojo.provide("dojox.data.QueryReadStore");




dojo.declare("dojox.data.QueryReadStore",
	null,
	{
		//	summary:
		//		This class provides a store that is mainly intended to be used
		//		for loading data dynamically from the server, used i.e. for
		//		retreiving chunks of data from huge data stores on the server (by server-side filtering!).
		//		Upon calling the fetch() method of this store the data are requested from
		//		the server if they are not yet loaded for paging (or cached).
		//
		//		For example used for a combobox which works on lots of data. It
		//		can be used to retreive the data partially upon entering the
		//		letters "ac" it returns only items like "action", "acting", etc.
		//
		// note:
		//		The field name "id" in a query is reserved for looking up data
		//		by id. This is necessary as before the first fetch, the store
		//		has no way of knowing which field the server will declare as
		//		identifier.
		//
		//	example:
		// |	// The parameter "query" contains the data that are sent to the server.
		// |	var store = new dojox.data.QueryReadStore({url:'/search.php'});
		// |	store.fetch({query:{name:'a'}, queryOptions:{ignoreCase:false}});
		//
		// |	// Since "serverQuery" is given, it overrules and those data are
		// |	// sent to the server.
		// |	var store = new dojox.data.QueryReadStore({url:'/search.php'});
		// |	store.fetch({serverQuery:{name:'a'}, queryOptions:{ignoreCase:false}});
		//
		// |	<div dojoType="dojox.data.QueryReadStore"
		// |		jsId="store2"
		// |		url="../tests/stores/QueryReadStore.php"
		// |		requestMethod="post"></div>
		// |	<div dojoType="dojox.grid.data.DojoData"
		// |		jsId="model2"
		// |		store="store2"
		// |		sortFields="[{attribute: 'name', descending: true}]"
		// |		rowsPerPage="30"></div>
		// |	<div dojoType="dojox.Grid" id="grid2"
		// |		model="model2"
		// |		structure="gridLayout"
		// |		style="height:300px; width:800px;"></div>
	
		//
		//	todo:
		//		- there is a bug in the paging, when i set start:2, count:5 after an initial fetch() and doClientPaging:true
		//		  it returns 6 elemetns, though count=5, try it in QueryReadStore.html
		//		- add optional caching
		//		- when the first query searched for "a" and the next for a subset of
		//		  the first, i.e. "ab" then we actually dont need a server request, if
		//		  we have client paging, we just need to filter the items we already have
		//		  that might also be tooo much logic
		
		url:"",
		requestMethod:"get",
		//useCache:false,
		
		// We use the name in the errors, once the name is fixed hardcode it, may be.
		_className:"dojox.data.QueryReadStore",
		
		// This will contain the items we have loaded from the server.
		// The contents of this array is optimized to satisfy all read-api requirements
		// and for using lesser storage, so the keys and their content need some explaination:
		// 		this._items[0].i - the item itself 
		//		this._items[0].r - a reference to the store, so we can identify the item
		//			securly. We set this reference right after receiving the item from the
		//			server.
		_items:[],
		
		// Store the last query that triggered xhr request to the server.
		// So we can compare if the request changed and if we shall reload 
		// (this also depends on other factors, such as is caching used, etc).
		_lastServerQuery:null,
		
		// Store how many rows we have so that we can pass it to a clientPaging handler
		_numRows:-1,
		
		// Store a hash of the last server request. Actually I introduced this
		// for testing, so I can check if no unnecessary requests were issued for
		// client-side-paging.
		lastRequestHash:null,
		
		// summary:
		//		By default every request for paging is sent to the server.
		doClientPaging:false,
	
		// summary:
		//		By default all the sorting is done serverside before the data is returned
		//		which is the proper place to be doing it for really large datasets.
		doClientSorting:false,
	
		// Items by identify for Identify API
		_itemsByIdentity:null,
		
		// Identifier used
		_identifier:null,
	
		_features: {'dojo.data.api.Read':true, 'dojo.data.api.Identity':true},
	
		_labelAttr: "label",
		
		constructor: function(/* Object */ params){
			dojo.mixin(this,params);
		},
		
		getValue: function(/* item */ item, /* attribute-name-string */ attribute, /* value? */ defaultValue){
			//	According to the Read API comments in getValue() and exception is
			//	thrown when an item is not an item or the attribute not a string!
			this._assertIsItem(item);
			if (!dojo.isString(attribute)) {
				throw new Error(this._className+".getValue(): Invalid attribute, string expected!");
			}
			if(!this.hasAttribute(item, attribute)){
				// read api says: return defaultValue "only if *item* does not have a value for *attribute*." 
				// Is this the case here? The attribute doesn't exist, but a defaultValue, sounds reasonable.
				if(defaultValue){
					return defaultValue;
				}
				console.log(this._className+".getValue(): Item does not have the attribute '"+attribute+"'.");
			}
			return item.i[attribute];
		},
		
		getValues: function(/* item */ item, /* attribute-name-string */ attribute){
			this._assertIsItem(item);
			var ret = [];
			if(this.hasAttribute(item, attribute)){
				ret.push(item.i[attribute]);
			}
			return ret;
		},
		
		getAttributes: function(/* item */ item){
			this._assertIsItem(item);
			var ret = [];
			for(var i in item.i){
				ret.push(i);
			}
			return ret;
		},
	
		hasAttribute: function(/* item */ item,	/* attribute-name-string */ attribute) {
			//	summary: 
			//		See dojo.data.api.Read.hasAttribute()
			return this.isItem(item) && typeof item.i[attribute]!="undefined";
		},
		
		containsValue: function(/* item */ item, /* attribute-name-string */ attribute, /* anything */ value){
			var values = this.getValues(item, attribute);
			var len = values.length;
			for(var i=0; i<len; i++){
				if(values[i]==value){
					return true;
				}
			}
			return false;
		},
		
		isItem: function(/* anything */ something){
			// Some basic tests, that are quick and easy to do here.
			// >>> var store = new dojox.data.QueryReadStore({});
			// >>> store.isItem("");
			// false
			//
			// >>> var store = new dojox.data.QueryReadStore({});
			// >>> store.isItem({});
			// false
			//
			// >>> var store = new dojox.data.QueryReadStore({});
			// >>> store.isItem(0);
			// false
			//
			// >>> var store = new dojox.data.QueryReadStore({});
			// >>> store.isItem({name:"me", label:"me too"});
			// false
			//
			if(something){
				return typeof something.r!="undefined" && something.r==this;
			}
			return false;
		},
		
		isItemLoaded: function(/* anything */ something) {
			// Currently we dont have any state that tells if an item is loaded or not
			// if the item exists its also loaded.
			// This might change when we start working with refs inside items ...
			return this.isItem(something);
		},
	
		loadItem: function(/* object */ args){
			if(this.isItemLoaded(args.item)){
				return;
			}
			// Actually we have nothing to do here, or at least I dont know what to do here ...
		},
	
		fetch:function(/* Object? */ request){
			//	summary:
			//		See dojo.data.util.simpleFetch.fetch() this is just a copy and I adjusted
			//		only the paging, since it happens on the server if doClientPaging is
			//		false, thx to http://trac.dojotoolkit.org/ticket/4761 reporting this.
			//		Would be nice to be able to use simpleFetch() to reduce copied code,
			//		but i dont know how yet. Ideas please!
			request = request || {};
			if(!request.store){
				request.store = this;
			}
			var self = this;
		
			var _errorHandler = function(errorData, requestObject){
				if(requestObject.onError){
					var scope = requestObject.scope || dojo.global;
					requestObject.onError.call(scope, errorData, requestObject);
				}
			};
		
			var _fetchHandler = function(items, requestObject, numRows){
				var oldAbortFunction = requestObject.abort || null;
				var aborted = false;
				
				var startIndex = requestObject.start?requestObject.start:0;
				if (self.doClientPaging==false) {
					// For client paging we dont need no slicing of the result.
					startIndex = 0;
				}
				var endIndex   = requestObject.count?(startIndex + requestObject.count):items.length;
		
				requestObject.abort = function(){
					aborted = true;
					if(oldAbortFunction){
						oldAbortFunction.call(requestObject);
					}
				};
		
				var scope = requestObject.scope || dojo.global;
				if(!requestObject.store){
					requestObject.store = self;
				}
				if(requestObject.onBegin){
					requestObject.onBegin.call(scope, numRows, requestObject);
				}
				if(requestObject.sort && self.doClientSorting){
					items.sort(dojo.data.util.sorter.createSortFunction(requestObject.sort, self));
				}
				if(requestObject.onItem){
					for(var i = startIndex; (i < items.length) && (i < endIndex); ++i){
						var item = items[i];
						if(!aborted){
							requestObject.onItem.call(scope, item, requestObject);
						}
					}
				}
				if(requestObject.onComplete && !aborted){
					var subset = null;
					if (!requestObject.onItem) {
						subset = items.slice(startIndex, endIndex);
					}
					requestObject.onComplete.call(scope, subset, requestObject);   
				}
			};
			this._fetchItems(request, _fetchHandler, _errorHandler);
			return request;	// Object
		},
	
		getFeatures: function(){
			return this._features;
		},
	
		close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
			// I have no idea if this is really needed ... 
		},
	
		getLabel: function(/* item */ item){
			//	summary:
			//		See dojo.data.api.Read.getLabel()
			if(this._labelAttr && this.isItem(item)){
				return this.getValue(item, this._labelAttr); //String
			}
			return undefined; //undefined
		},
	
		getLabelAttributes: function(/* item */ item){
			//	summary:
			//		See dojo.data.api.Read.getLabelAttributes()
			if(this._labelAttr){
				return [this._labelAttr]; //array
			}
			return null; //null
		},
		
		_xhrFetchHandler: function(data, request, fetchHandler, errorHandler){
			data = this._filterResponse(data);
			if (data.label){
				this._labelAttr = data.label;
			}
			var numRows = data.numRows || -1;

			this._items = [];
			// Store a ref to "this" in each item, so we can simply check if an item
			// really origins form here (idea is from ItemFileReadStore, I just don't know
			// how efficient the real storage use, garbage collection effort, etc. is).
			dojo.forEach(data.items,function(e){ 
				this._items.push({i:e, r:this}); 
			},this); 
			
			var identifier = data.identifier;
			this._itemsByIdentity = {};
			if(identifier){
				this._identifier = identifier;
				var i;
				for(i = 0; i < this._items.length; ++i){
					var item = this._items[i].i;
					var identity = item[identifier];
					if(!this._itemsByIdentity[identity]){
						this._itemsByIdentity[identity] = item;
					}else{
						throw new Error(this._className+":  The json data as specified by: [" + this.url + "] is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}
				}
			}else{
				this._identifier = Number;
				for(i = 0; i < this._items.length; ++i){
					this._items[i].n = i;
				}
			}
			
			// TODO actually we should do the same as dojo.data.ItemFileReadStore._getItemsFromLoadedData() to sanitize
			// (does it really sanititze them) and store the data optimal. should we? for security reasons???
			numRows = this._numRows = (numRows === -1) ? this._items.length : numRows;
			fetchHandler(this._items, request, numRows);
			this._numRows = numRows;		
		},
		
		_fetchItems: function(request, fetchHandler, errorHandler){
			//	summary:
			// 		The request contains the data as defined in the Read-API.
			// 		Additionally there is following keyword "serverQuery".
			//
			//	The *serverQuery* parameter, optional.
			//		This parameter contains the data that will be sent to the server.
			//		If this parameter is not given the parameter "query"'s
			//		data are sent to the server. This is done for some reasons:
			//		- to specify explicitly which data are sent to the server, they
			//		  might also be a mix of what is contained in "query", "queryOptions"
			//		  and the paging parameters "start" and "count" or may be even
			//		  completely different things.
			//		- don't modify the request.query data, so the interface using this
			//		  store can rely on unmodified data, as the combobox dijit currently
			//		  does it, it compares if the query has changed
			//		- request.query is required by the Read-API
			//
			// 		I.e. the following examples might be sent via GET:
			//		  fetch({query:{name:"abc"}, queryOptions:{ignoreCase:true}})
			//		  the URL will become:   /url.php?name=abc
			//
			//		  fetch({serverQuery:{q:"abc", c:true}, query:{name:"abc"}, queryOptions:{ignoreCase:true}})
			//		  the URL will become:   /url.php?q=abc&c=true
			//		  // The serverQuery-parameter has overruled the query-parameter
			//		  // but the query parameter stays untouched, but is not sent to the server!
			//		  // The serverQuery contains more data than the query, so they might differ!
			//
	
			var serverQuery = request.serverQuery || request.query || {};
			//Need to add start and count
			if(!this.doClientPaging){
				serverQuery.start = request.start || 0;
				// Count might not be sent if not given.
				if (request.count) {
					serverQuery.count = request.count;
				}
			}
			if(!this.doClientSorting){
				if(request.sort){
					var sort = request.sort[0];
					if(sort && sort.attribute){
						var sortStr = sort.attribute;
						if(sort.descending){
							sortStr = "-" + sortStr;
						}
						serverQuery.sort = sortStr;
					}
				}
			}
			// Compare the last query and the current query by simply json-encoding them,
			// so we dont have to do any deep object compare ... is there some dojo.areObjectsEqual()???
			if(this.doClientPaging && this._lastServerQuery!==null &&
				dojo.toJson(serverQuery)==dojo.toJson(this._lastServerQuery)
				){
				this._numRows = (this._numRows === -1) ? this._items.length : this._numRows;
				fetchHandler(this._items, request, this._numRows);
			}else{
				var xhrFunc = this.requestMethod.toLowerCase()=="post" ? dojo.xhrPost : dojo.xhrGet;
				var xhrHandler = xhrFunc({url:this.url, handleAs:"json-comment-optional", content:serverQuery});
				xhrHandler.addCallback(dojo.hitch(this, function(data){
					this._xhrFetchHandler(data, request, fetchHandler, errorHandler);
				}));
				xhrHandler.addErrback(function(error){
					errorHandler(error, request);
				});
				// Generate the hash using the time in milliseconds and a randon number.
				// Since Math.randon() returns something like: 0.23453463, we just remove the "0."
				// probably just for esthetic reasons :-).
				this.lastRequestHash = new Date().getTime()+"-"+String(Math.random()).substring(2);
				this._lastServerQuery = dojo.mixin({}, serverQuery);
			}
		},
		
		_filterResponse: function(data){
			//	summary:
			//		If the data from servers needs to be processed before it can be processed by this
			//		store, then this function should be re-implemented in subclass. This default 
			//		implementation just return the data unchanged.
			//	data:
			//		The data received from server
			return data;
		},
	
		_assertIsItem: function(/* item */ item){
			//	summary:
			//		It throws an error if item is not valid, so you can call it in every method that needs to
			//		throw an error when item is invalid.
			//	item: 
			//		The item to test for being contained by the store.
			if(!this.isItem(item)){
				throw new Error(this._className+": Invalid item argument.");
			}
		},
	
		_assertIsAttribute: function(/* attribute-name-string */ attribute){
			//	summary:
			//		This function tests whether the item passed in is indeed a valid 'attribute' like type for the store.
			//	attribute: 
			//		The attribute to test for being contained by the store.
			if(typeof attribute !== "string"){ 
				throw new Error(this._className+": Invalid attribute argument ('"+attribute+"').");
			}
		},
	
		fetchItemByIdentity: function(/* Object */ keywordArgs){
			//	summary: 
			//		See dojo.data.api.Identity.fetchItemByIdentity()
	
			// See if we have already loaded the item with that id
			// In case there hasn't been a fetch yet, _itemsByIdentity is null
			// and thus a fetch will be triggered below.
			if(this._itemsByIdentity){
				var item = this._itemsByIdentity[keywordArgs.identity];
				if(!(item === undefined)){
					if(keywordArgs.onItem){
						var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
						keywordArgs.onItem.call(scope, {i:item, r:this});
					}
					return;
				}
			}
	
			// Otherwise we need to go remote
			// Set up error handler
			var _errorHandler = function(errorData, requestObject){
				var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
				if(keywordArgs.onError){
					keywordArgs.onError.call(scope, errorData);
				}
			};
			
			// Set up fetch handler
			var _fetchHandler = function(items, requestObject){
				var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
				try{
					// There is supposed to be only one result
					var item = null;
					if(items && items.length == 1){
						item = items[0];
					}
					
					// If no item was found, item is still null and we'll
					// fire the onItem event with the null here
					if(keywordArgs.onItem){
						keywordArgs.onItem.call(scope, item);
					}
				}catch(error){
					if(keywordArgs.onError){
						keywordArgs.onError.call(scope, error);
					}
				}
			};
			
			// Construct query
			var request = {serverQuery:{id:keywordArgs.identity}};
			
			// Dispatch query
			this._fetchItems(request, _fetchHandler, _errorHandler);
		},
		
		getIdentity: function(/* item */ item){
			//	summary: 
			//		See dojo.data.api.Identity.getIdentity()
			var identifier = null;
			if(this._identifier === Number){
				identifier = item.n; // Number
			}else{
				identifier = item.i[this._identifier];
			}
			return identifier;
		},
		
		getIdentityAttributes: function(/* item */ item){
			//	summary:
			//		See dojo.data.api.Identity.getIdentityAttributes()
			return [this._identifier];
		}
	}
);

}

if(!dojo._hasResource["zivios.AutocompleteReadStore"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["zivios.AutocompleteReadStore"] = true;
/**
 * Copyright (c) 2008 Zivios, LLC.
 *
 * This file is part of Zivios.
 *
 * Zivios is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Zivios is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Zivios.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     Zivios
 * @copyright   Copyright (c) 2008 Zivios, LLC. (http://www.zivios.org)
 * @license     http://www.zivios.org/legal/license
 **/

dojo.provide("zivios.AutocompleteReadStore");

dojo.declare("zivios.AutocompleteReadStore", dojox.data.QueryReadStore,
{
    fetch: function(request) {
        request.serverQuery = {q: request.query.name};
        return this.inherited("fetch", arguments);
    }
});


}

if(!dojo._hasResource["dijit._base.focus"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.focus"] = true;
dojo.provide("dijit._base.focus");

// summary:
//		These functions are used to query or set the focus and selection.
//
//		Also, they trace when widgets become actived/deactivated,
//		so that the widget can fire _onFocus/_onBlur events.
//		"Active" here means something similar to "focused", but
//		"focus" isn't quite the right word because we keep track of
//		a whole stack of "active" widgets.  Example:  Combobutton --> Menu -->
//		MenuItem.   The onBlur event for Combobutton doesn't fire due to focusing
//		on the Menu or a MenuItem, since they are considered part of the
//		Combobutton widget.  It only happens when focus is shifted
//		somewhere completely different.

dojo.mixin(dijit,
{
	// _curFocus: DomNode
	//		Currently focused item on screen
	_curFocus: null,

	// _prevFocus: DomNode
	//		Previously focused item on screen
	_prevFocus: null,

	isCollapsed: function(){
		// summary: tests whether the current selection is empty
		var _document = dojo.doc;
		if(_document.selection){ // IE
			var s=_document.selection;
			if(s.type=='Text'){
				return !s.createRange().htmlText.length; // Boolean
			}else{ //Control range
				return !s.createRange().length; // Boolean
			}
		}else{
			var _window = dojo.global;
			var selection = _window.getSelection();
			if(dojo.isString(selection)){ // Safari
				return !selection; // Boolean
			}else{ // Mozilla/W3
				return selection.isCollapsed || !selection.toString(); // Boolean
			}
		}
	},

	getBookmark: function(){
		// summary: Retrieves a bookmark that can be used with moveToBookmark to return to the same range
		var bookmark, selection = dojo.doc.selection;
		if(selection){ // IE
			var range = selection.createRange();
			if(selection.type.toUpperCase()=='CONTROL'){
				if(range.length){
					bookmark=[];
					var i=0,len=range.length;
					while(i<len){
						bookmark.push(range.item(i++));
					}
				}else{
					bookmark=null;
				}
			}else{
				bookmark = range.getBookmark();
			}
		}else{
			if(window.getSelection){
				selection = dojo.global.getSelection();
				if(selection){
					range = selection.getRangeAt(0);
					bookmark = range.cloneRange();
				}
			}else{
				console.warn("No idea how to store the current selection for this browser!");
			}
		}
		return bookmark; // Array
	},

	moveToBookmark: function(/*Object*/bookmark){
		// summary: Moves current selection to a bookmark
		// bookmark: This should be a returned object from dojo.html.selection.getBookmark()
		var _document = dojo.doc;
		if(_document.selection){ // IE
			var range;
			if(dojo.isArray(bookmark)){
				range = _document.body.createControlRange();
				//range.addElement does not have call/apply method, so can not call it directly
				//range is not available in "range.addElement(item)", so can't use that either
				dojo.forEach(bookmark, function(n){
					range.addElement(n);
				});
			}else{
				range = _document.selection.createRange();
				range.moveToBookmark(bookmark);
			}
			range.select();
		}else{ //Moz/W3C
			var selection = dojo.global.getSelection && dojo.global.getSelection();
			if(selection && selection.removeAllRanges){
				selection.removeAllRanges();
				selection.addRange(bookmark);
			}else{
				console.warn("No idea how to restore selection for this browser!");
			}
		}
	},

	getFocus: function(/*Widget?*/menu, /*Window?*/openedForWindow){
		// summary:
		//	Returns the current focus and selection.
		//	Called when a popup appears (either a top level menu or a dialog),
		//	or when a toolbar/menubar receives focus
		//
		// menu:
		//	The menu that's being opened
		//
		// openedForWindow:
		//	iframe in which menu was opened
		//
		// returns:
		//	A handle to restore focus/selection

		return {
			// Node to return focus to
			node: menu && dojo.isDescendant(dijit._curFocus, menu.domNode) ? dijit._prevFocus : dijit._curFocus,

			// Previously selected text
			bookmark:
				!dojo.withGlobal(openedForWindow||dojo.global, dijit.isCollapsed) ?
				dojo.withGlobal(openedForWindow||dojo.global, dijit.getBookmark) :
				null,

			openedForWindow: openedForWindow
		}; // Object
	},

	focus: function(/*Object || DomNode */ handle){
		// summary:
		//		Sets the focused node and the selection according to argument.
		//		To set focus to an iframe's content, pass in the iframe itself.
		// handle:
		//		object returned by get(), or a DomNode

		if(!handle){ return; }

		var node = "node" in handle ? handle.node : handle,		// because handle is either DomNode or a composite object
			bookmark = handle.bookmark,
			openedForWindow = handle.openedForWindow;

		// Set the focus
		// Note that for iframe's we need to use the <iframe> to follow the parentNode chain,
		// but we need to set focus to iframe.contentWindow
		if(node){
			var focusNode = (node.tagName.toLowerCase()=="iframe") ? node.contentWindow : node;
			if(focusNode && focusNode.focus){
				try{
					// Gecko throws sometimes if setting focus is impossible,
					// node not displayed or something like that
					focusNode.focus();
				}catch(e){/*quiet*/}
			}			
			dijit._onFocusNode(node);
		}

		// set the selection
		// do not need to restore if current selection is not empty
		// (use keyboard to select a menu item)
		if(bookmark && dojo.withGlobal(openedForWindow||dojo.global, dijit.isCollapsed)){
			if(openedForWindow){
				openedForWindow.focus();
			}
			try{
				dojo.withGlobal(openedForWindow||dojo.global, dijit.moveToBookmark, null, [bookmark]);
			}catch(e){
				/*squelch IE internal error, see http://trac.dojotoolkit.org/ticket/1984 */
			}
		}
	},

	// _activeStack: Array
	//		List of currently active widgets (focused widget and it's ancestors)
	_activeStack: [],

	registerWin: function(/*Window?*/targetWindow){
		// summary:
		//		Registers listeners on the specified window (either the main
		//		window or an iframe) to detect when the user has clicked somewhere.
		//		Anyone that creates an iframe should call this function.

		if(!targetWindow){
			targetWindow = window;
		}

		dojo.connect(targetWindow.document, "onmousedown", function(evt){
			dijit._justMouseDowned = true;
			setTimeout(function(){ dijit._justMouseDowned = false; }, 0);
			dijit._onTouchNode(evt.target||evt.srcElement);
		});
		//dojo.connect(targetWindow, "onscroll", ???);

		// Listen for blur and focus events on targetWindow's body
		var doc = targetWindow.document;
		if(doc){
			if(dojo.isIE){
				doc.attachEvent('onactivate', function(evt){
					if(evt.srcElement.tagName.toLowerCase() != "#document"){
						dijit._onFocusNode(evt.srcElement);
					}
				});
				doc.attachEvent('ondeactivate', function(evt){
					dijit._onBlurNode(evt.srcElement);
				});
			}else{
				doc.addEventListener('focus', function(evt){
					dijit._onFocusNode(evt.target);
				}, true);
				doc.addEventListener('blur', function(evt){
					dijit._onBlurNode(evt.target);
				}, true);
			}
		}
		doc = null;	// prevent memory leak (apparent circular reference via closure)
	},

	_onBlurNode: function(/*DomNode*/ node){
		// summary:
		// 		Called when focus leaves a node.
		//		Usually ignored, _unless_ it *isn't* follwed by touching another node,
		//		which indicates that we tabbed off the last field on the page,
		//		in which case every widget is marked inactive
		dijit._prevFocus = dijit._curFocus;
		dijit._curFocus = null;

		if(dijit._justMouseDowned){
			// the mouse down caused a new widget to be marked as active; this blur event
			// is coming late, so ignore it.
			return;
		}

		// if the blur event isn't followed by a focus event then mark all widgets as inactive.
		if(dijit._clearActiveWidgetsTimer){
			clearTimeout(dijit._clearActiveWidgetsTimer);
		}
		dijit._clearActiveWidgetsTimer = setTimeout(function(){
			delete dijit._clearActiveWidgetsTimer;
			dijit._setStack([]);
			dijit._prevFocus = null;
		}, 100);
	},

	_onTouchNode: function(/*DomNode*/ node){
		// summary:
		//		Callback when node is focused or mouse-downed

		// ignore the recent blurNode event
		if(dijit._clearActiveWidgetsTimer){
			clearTimeout(dijit._clearActiveWidgetsTimer);
			delete dijit._clearActiveWidgetsTimer;
		}

		// compute stack of active widgets (ex: ComboButton --> Menu --> MenuItem)
		var newStack=[];
		try{
			while(node){
				if(node.dijitPopupParent){
					node=dijit.byId(node.dijitPopupParent).domNode;
				}else if(node.tagName && node.tagName.toLowerCase()=="body"){
					// is this the root of the document or just the root of an iframe?
					if(node===dojo.body()){
						// node is the root of the main document
						break;
					}
					// otherwise, find the iframe this node refers to (can't access it via parentNode,
					// need to do this trick instead). window.frameElement is supported in IE/FF/Webkit
					node=dijit.getDocumentWindow(node.ownerDocument).frameElement;
				}else{
					var id = node.getAttribute && node.getAttribute("widgetId");
					if(id){
						newStack.unshift(id);
					}
					node=node.parentNode;
				}
			}
		}catch(e){ /* squelch */ }

		dijit._setStack(newStack);
	},

	_onFocusNode: function(/*DomNode*/ node){
		// summary
		//		Callback when node is focused

		if(!node){
			return;
		}

		if(node.nodeType == 9){
			// Ignore focus events on the document itself.  This is here so that
			// (for example) clicking the up/down arrows of a spinner
			//  (which don't get focus) won't cause that widget to blur. (FF issue)
			return;
		}

		if(node.nodeType == 9){
			// We focused on (the body of) the document itself, either the main document
			// or an iframe
			var iframe = dijit.getDocumentWindow(node).frameElement;
			if(!iframe){
				// Ignore focus events on main document.  This is specifically here
				// so that clicking the up/down arrows of a spinner (which don't get focus)
				// won't cause that widget to blur.
				return;
			}

			node = iframe;
		}

		dijit._onTouchNode(node);

		if(node==dijit._curFocus){ return; }
		if(dijit._curFocus){
			dijit._prevFocus = dijit._curFocus;
		}
		dijit._curFocus = node;
		dojo.publish("focusNode", [node]);
	},

	_setStack: function(newStack){
		// summary
		//	The stack of active widgets has changed.  Send out appropriate events and record new stack

		var oldStack = dijit._activeStack;
		dijit._activeStack = newStack;

		// compare old stack to new stack to see how many elements they have in common
		for(var nCommon=0; nCommon<Math.min(oldStack.length, newStack.length); nCommon++){
			if(oldStack[nCommon] != newStack[nCommon]){
				break;
			}
		}

		// for all elements that have gone out of focus, send blur event
		for(var i=oldStack.length-1; i>=nCommon; i--){
			var widget = dijit.byId(oldStack[i]);
			if(widget){
				widget._focused = false;
				widget._hasBeenBlurred = true;
				if(widget._onBlur){
					widget._onBlur();
				}
				if (widget._setStateClass){
					widget._setStateClass();
				}
				dojo.publish("widgetBlur", [widget]);
			}
		}

		// for all element that have come into focus, send focus event
		for(i=nCommon; i<newStack.length; i++){
			widget = dijit.byId(newStack[i]);
			if(widget){
				widget._focused = true;
				if(widget._onFocus){
					widget._onFocus();
				}
				if (widget._setStateClass){
					widget._setStateClass();
				}
				dojo.publish("widgetFocus", [widget]);
			}
		}
	}
});

// register top window and all the iframes it contains
dojo.addOnLoad(dijit.registerWin);

}

if(!dojo._hasResource["dijit._base.manager"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.manager"] = true;
dojo.provide("dijit._base.manager");

dojo.declare("dijit.WidgetSet", null, {
	// summary:
	//	A set of widgets indexed by id

	constructor: function(){
		this._hash={};
	},

	add: function(/*Widget*/ widget){
		if(this._hash[widget.id]){
			throw new Error("Tried to register widget with id==" + widget.id + " but that id is already registered");
		}
		this._hash[widget.id]=widget;
	},

	remove: function(/*String*/ id){
		delete this._hash[id];
	},

	forEach: function(/*Function*/ func){
		for(var id in this._hash){
			func(this._hash[id]);
		}
	},

	filter: function(/*Function*/ filter){
		var res = new dijit.WidgetSet();
		this.forEach(function(widget){
			if(filter(widget)){ res.add(widget); }
		});
		return res;		// dijit.WidgetSet
	},

	byId: function(/*String*/ id){
		return this._hash[id];
	},

	byClass: function(/*String*/ cls){
		return this.filter(function(widget){ return widget.declaredClass==cls; });	// dijit.WidgetSet
	}
	});

/*=====
dijit.registry = {
	// summary: A list of widgets on a page.
	// description: Is an instance of dijit.WidgetSet
};
=====*/
dijit.registry = new dijit.WidgetSet();

dijit._widgetTypeCtr = {};

dijit.getUniqueId = function(/*String*/widgetType){
	// summary
	//	Generates a unique id for a given widgetType

	var id;
	do{
		id = widgetType + "_" +
			(widgetType in dijit._widgetTypeCtr ?
				++dijit._widgetTypeCtr[widgetType] : dijit._widgetTypeCtr[widgetType] = 0);
	}while(dijit.byId(id));
	return id; // String
};


if(dojo.isIE){
	// Only run this for IE because we think it's only necessary in that case,
	// and because it causes problems on FF.  See bug #3531 for details.
	dojo.addOnWindowUnload(function(){
		dijit.registry.forEach(function(widget){ widget.destroy(); });
	});
}

dijit.byId = function(/*String|Widget*/id){
	// summary:
	//		Returns a widget by its id, or if passed a widget, no-op (like dojo.byId())
	return (dojo.isString(id)) ? dijit.registry.byId(id) : id; // Widget
};

dijit.byNode = function(/* DOMNode */ node){
	// summary:
	//		Returns the widget as referenced by node
	return dijit.registry.byId(node.getAttribute("widgetId")); // Widget
};

dijit.getEnclosingWidget = function(/* DOMNode */ node){
	// summary:
	//		Returns the widget whose dom tree contains node or null if
	//		the node is not contained within the dom tree of any widget
	while(node){
		if(node.getAttribute && node.getAttribute("widgetId")){
			return dijit.registry.byId(node.getAttribute("widgetId"));
		}
		node = node.parentNode;
	}
	return null;
};

// elements that are tab-navigable if they have no tabindex value set
// (except for "a", which must have an href attribute)
dijit._tabElements = {
	area: true,
	button: true,
	input: true,
	object: true,
	select: true,
	textarea: true
};

dijit._isElementShown = function(/*Element*/elem){
	var style = dojo.style(elem);
	return (style.visibility != "hidden")
		&& (style.visibility != "collapsed")
		&& (style.display != "none")
		&& (dojo.attr(elem, "type") != "hidden");
}

dijit.isTabNavigable = function(/*Element*/elem){
	// summary:
	//		Tests if an element is tab-navigable
	if(dojo.hasAttr(elem, "disabled")){ return false; }
	var hasTabindex = dojo.hasAttr(elem, "tabindex");
	var tabindex = dojo.attr(elem, "tabindex");
	if(hasTabindex && tabindex >= 0) {
		return true; // boolean
	}
	var name = elem.nodeName.toLowerCase();
	if(((name == "a" && dojo.hasAttr(elem, "href"))
			|| dijit._tabElements[name])
		&& (!hasTabindex || tabindex >= 0)){
		return true; // boolean
	}
	return false; // boolean
};

dijit._getTabNavigable = function(/*DOMNode*/root){
	// summary:
	//		Finds the following descendants of the specified root node:
	//		* the first tab-navigable element in document order
	//		  without a tabindex or with tabindex="0"
	//		* the last tab-navigable element in document order
	//		  without a tabindex or with tabindex="0"
	//		* the first element in document order with the lowest
	//		  positive tabindex value
	//		* the last element in document order with the highest
	//		  positive tabindex value
	var first, last, lowest, lowestTabindex, highest, highestTabindex;
	var walkTree = function(/*DOMNode*/parent){
		dojo.query("> *", parent).forEach(function(child){
			var isShown = dijit._isElementShown(child);
			if(isShown && dijit.isTabNavigable(child)){
				var tabindex = dojo.attr(child, "tabindex");
				if(!dojo.hasAttr(child, "tabindex") || tabindex == 0){
					if(!first){ first = child; }
					last = child;
				}else if(tabindex > 0){
					if(!lowest || tabindex < lowestTabindex){
						lowestTabindex = tabindex;
						lowest = child;
					}
					if(!highest || tabindex >= highestTabindex){
						highestTabindex = tabindex;
						highest = child;
					}
				}
			}
			if(isShown && child.nodeName.toUpperCase() != 'SELECT'){ walkTree(child) }
		});
	};
	if(dijit._isElementShown(root)){ walkTree(root) }
	return { first: first, last: last, lowest: lowest, highest: highest };
}
dijit.getFirstInTabbingOrder = function(/*String|DOMNode*/root){
	// summary:
	//		Finds the descendant of the specified root node
	//		that is first in the tabbing order
	var elems = dijit._getTabNavigable(dojo.byId(root));
	return elems.lowest ? elems.lowest : elems.first; // Element
};

dijit.getLastInTabbingOrder = function(/*String|DOMNode*/root){
	// summary:
	//		Finds the descendant of the specified root node
	//		that is last in the tabbing order
	var elems = dijit._getTabNavigable(dojo.byId(root));
	return elems.last ? elems.last : elems.highest; // Element
};

// dijit.defaultDuration
//	Default duration for wipe and fade animations within dijits
dijit.defaultDuration = dojo.config["defaultDuration"] || 200;

}

if(!dojo._hasResource["dojo.AdapterRegistry"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.AdapterRegistry"] = true;
dojo.provide("dojo.AdapterRegistry");

dojo.AdapterRegistry = function(/*Boolean?*/ returnWrappers){
	//	summary:
	//		A registry to make contextual calling/searching easier.
	//	description:
	//		Objects of this class keep list of arrays in the form [name, check,
	//		wrap, directReturn] that are used to determine what the contextual
	//		result of a set of checked arguments is. All check/wrap functions
	//		in this registry should be of the same arity.
	//	example:
	//	|	// create a new registry
	//	|	var reg = new dojo.AdapterRegistry();
	//	|	reg.register("handleString",
	//	|		dojo.isString,
	//	|		function(str){
	//	|			// do something with the string here
	//	|		}
	//	|	);
	//	|	reg.register("handleArr",
	//	|		dojo.isArray,
	//	|		function(arr){
	//	|			// do something with the array here
	//	|		}
	//	|	);
	//	|
	//	|	// now we can pass reg.match() *either* an array or a string and
	//	|	// the value we pass will get handled by the right function
	//	|	reg.match("someValue"); // will call the first function
	//	|	reg.match(["someValue"]); // will call the second

	this.pairs = [];
	this.returnWrappers = returnWrappers || false; // Boolean
}

dojo.extend(dojo.AdapterRegistry, {
	register: function(/*String*/ name, /*Function*/ check, /*Function*/ wrap, /*Boolean?*/ directReturn, /*Boolean?*/ override){
		//	summary: 
		//		register a check function to determine if the wrap function or
		//		object gets selected
		//	name:
		//		a way to identify this matcher.
		//	check:
		//		a function that arguments are passed to from the adapter's
		//		match() function.  The check function should return true if the
		//		given arguments are appropriate for the wrap function.
		//	directReturn:
		//		If directReturn is true, the value passed in for wrap will be
		//		returned instead of being called. Alternately, the
		//		AdapterRegistry can be set globally to "return not call" using
		//		the returnWrappers property. Either way, this behavior allows
		//		the registry to act as a "search" function instead of a
		//		function interception library.
		//	override:
		//		If override is given and true, the check function will be given
		//		highest priority. Otherwise, it will be the lowest priority
		//		adapter.
		this.pairs[((override) ? "unshift" : "push")]([name, check, wrap, directReturn]);
	},

	match: function(/* ... */){
		// summary:
		//		Find an adapter for the given arguments. If no suitable adapter
		//		is found, throws an exception. match() accepts any number of
		//		arguments, all of which are passed to all matching functions
		//		from the registered pairs.
		for(var i = 0; i < this.pairs.length; i++){
			var pair = this.pairs[i];
			if(pair[1].apply(this, arguments)){
				if((pair[3])||(this.returnWrappers)){
					return pair[2];
				}else{
					return pair[2].apply(this, arguments);
				}
			}
		}
		throw new Error("No match found");
	},

	unregister: function(name){
		// summary: Remove a named adapter from the registry

		// FIXME: this is kind of a dumb way to handle this. On a large
		// registry this will be slow-ish and we can use the name as a lookup
		// should we choose to trade memory for speed.
		for(var i = 0; i < this.pairs.length; i++){
			var pair = this.pairs[i];
			if(pair[0] == name){
				this.pairs.splice(i, 1);
				return true;
			}
		}
		return false;
	}
});

}

if(!dojo._hasResource["dijit._base.place"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.place"] = true;
dojo.provide("dijit._base.place");



// ported from dojo.html.util

dijit.getViewport = function(){
	//	summary
	//	Returns the dimensions and scroll position of the viewable area of a browser window

	var _window = dojo.global;
	var _document = dojo.doc;

	// get viewport size
	var w = 0, h = 0;
	var de = _document.documentElement;
	var dew = de.clientWidth, deh = de.clientHeight;
	if(dojo.isMozilla){
		// mozilla
		// _window.innerHeight includes the height taken by the scroll bar
		// clientHeight is ideal but has DTD issues:
		// #4539: FF reverses the roles of body.clientHeight/Width and documentElement.clientHeight/Width based on the DTD!
		// check DTD to see whether body or documentElement returns the viewport dimensions using this algorithm:
		var minw, minh, maxw, maxh;
		var dbw = _document.body.clientWidth;
		if(dbw > dew){
			minw = dew;
			maxw = dbw;
		}else{
			maxw = dew;
			minw = dbw;
		}
		var dbh = _document.body.clientHeight;
		if(dbh > deh){
			minh = deh;
			maxh = dbh;
		}else{
			maxh = deh;
			minh = dbh;
		}
		w = (maxw > _window.innerWidth) ? minw : maxw;
		h = (maxh > _window.innerHeight) ? minh : maxh;
	}else if(!dojo.isOpera && _window.innerWidth){
		//in opera9, dojo.body().clientWidth should be used, instead
		//of window.innerWidth/document.documentElement.clientWidth
		//so we have to check whether it is opera
		w = _window.innerWidth;
		h = _window.innerHeight;
	}else if(dojo.isIE && de && deh){
		w = dew;
		h = deh;
	}else if(dojo.body().clientWidth){
		// IE5, Opera
		w = dojo.body().clientWidth;
		h = dojo.body().clientHeight;
	}

	// get scroll position
	var scroll = dojo._docScroll();

	return { w: w, h: h, l: scroll.x, t: scroll.y };	//	object
};

/*=====
dijit.__Position = function(){
	//	x: Integer
	//		horizontal coordinate in pixels, relative to document body
	//	y: Integer
	//		vertical coordinate in pixels, relative to document body

	thix.x = x;
	this.y = y;
}
=====*/


dijit.placeOnScreen = function(
	/* DomNode */			node,
	/* dijit.__Position */	pos,
	/* String[] */			corners,
	/* boolean? */			tryOnly){
	//	summary:
	//		Positions one of the node's corners at specified position
	//		such that node is fully visible in viewport.
	//	description:
	//		NOTE: node is assumed to be absolutely or relatively positioned.
	//	pos:
	//		Object like {x: 10, y: 20}
	//	corners:
	//		Array of Strings representing order to try corners in, like ["TR", "BL"].
	//		Possible values are:
	//			* "BL" - bottom left
	//			* "BR" - bottom right
	//			* "TL" - top left
	//			* "TR" - top right
	//	example:	
	//		Try to place node's top right corner at (10,20).
	//		If that makes node go (partially) off screen, then try placing
	//		bottom left corner at (10,20).
	//	|	placeOnScreen(node, {x: 10, y: 20}, ["TR", "BL"])

	var choices = dojo.map(corners, function(corner){ return { corner: corner, pos: pos }; });

	return dijit._place(node, choices);
}

dijit._place = function(/*DomNode*/ node, /* Array */ choices, /* Function */ layoutNode){
	// summary:
	//		Given a list of spots to put node, put it at the first spot where it fits,
	//		of if it doesn't fit anywhere then the place with the least overflow
	// choices: Array
	//		Array of elements like: {corner: 'TL', pos: {x: 10, y: 20} }
	//		Above example says to put the top-left corner of the node at (10,20)
	//	layoutNode: Function(node, aroundNodeCorner, nodeCorner)
	//		for things like tooltip, they are displayed differently (and have different dimensions)
	//		based on their orientation relative to the parent.   This adjusts the popup based on orientation.

	// get {x: 10, y: 10, w: 100, h:100} type obj representing position of
	// viewport over document
	var view = dijit.getViewport();

	// This won't work if the node is inside a <div style="position: relative">,
	// so reattach it to dojo.doc.body.   (Otherwise, the positioning will be wrong
	// and also it might get cutoff)
	if(!node.parentNode || String(node.parentNode.tagName).toLowerCase() != "body"){
		dojo.body().appendChild(node);
	}

	var best = null;
	dojo.some(choices, function(choice){
		var corner = choice.corner;
		var pos = choice.pos;

		// configure node to be displayed in given position relative to button
		// (need to do this in order to get an accurate size for the node, because
		// a tooltips size changes based on position, due to triangle)
		if(layoutNode){
			layoutNode(node, choice.aroundCorner, corner);
		}

		// get node's size
		var style = node.style;
		var oldDisplay = style.display;
		var oldVis = style.visibility;
		style.visibility = "hidden";
		style.display = "";
		var mb = dojo.marginBox(node);
		style.display = oldDisplay;
		style.visibility = oldVis;

		// coordinates and size of node with specified corner placed at pos,
		// and clipped by viewport
		var startX = (corner.charAt(1) == 'L' ? pos.x : Math.max(view.l, pos.x - mb.w)),
			startY = (corner.charAt(0) == 'T' ? pos.y : Math.max(view.t, pos.y -  mb.h)),
			endX = (corner.charAt(1) == 'L' ? Math.min(view.l + view.w, startX + mb.w) : pos.x),
			endY = (corner.charAt(0) == 'T' ? Math.min(view.t + view.h, startY + mb.h) : pos.y),
			width = endX - startX,
			height = endY - startY,
			overflow = (mb.w - width) + (mb.h - height);

		if(best == null || overflow < best.overflow){
			best = {
				corner: corner,
				aroundCorner: choice.aroundCorner,
				x: startX,
				y: startY,
				w: width,
				h: height,
				overflow: overflow
			};
		}
		return !overflow;
	});

	node.style.left = best.x + "px";
	node.style.top = best.y + "px";
	if(best.overflow && layoutNode){
		layoutNode(node, best.aroundCorner, best.corner);
	}
	return best;
}

dijit.placeOnScreenAroundNode = function(
	/* DomNode */		node,
	/* DomNode */		aroundNode,
	/* Object */		aroundCorners,
	/* Function? */		layoutNode){

	//	summary:
	//		Position node adjacent or kitty-corner to aroundNode
	//		such that it's fully visible in viewport.
	//
	//	description:
	//		Place node such that corner of node touches a corner of
	//		aroundNode, and that node is fully visible.
	//
	//	aroundCorners:
	//		Ordered list of pairs of corners to try matching up.
	//		Each pair of corners is represented as a key/value in the hash,
	//		where the key corresponds to the aroundNode's corner, and
	//		the value corresponds to the node's corner:
	//
	//	|	{ aroundNodeCorner1: nodeCorner1, aroundNodeCorner2: nodeCorner2,  ...}
	//
	//		The following strings are used to represent the four corners:
	//			* "BL" - bottom left
	//			* "BR" - bottom right
	//			* "TL" - top left
	//			* "TR" - top right
	//
	//	layoutNode: Function(node, aroundNodeCorner, nodeCorner)
	//		For things like tooltip, they are displayed differently (and have different dimensions)
	//		based on their orientation relative to the parent.   This adjusts the popup based on orientation.
	//
	//	example:
	//	|	dijit.placeOnScreenAroundNode(node, aroundNode, {'BL':'TL', 'TR':'BR'}); 
	//		This will try to position node such that node's top-left corner is at the same position
	//		as the bottom left corner of the aroundNode (ie, put node below
	//		aroundNode, with left edges aligned).  If that fails it will try to put
	// 		the bottom-right corner of node where the top right corner of aroundNode is
	//		(ie, put node above aroundNode, with right edges aligned)
	//

	// get coordinates of aroundNode
	aroundNode = dojo.byId(aroundNode);
	var oldDisplay = aroundNode.style.display;
	aroundNode.style.display="";
	// #3172: use the slightly tighter border box instead of marginBox
	var aroundNodeW = aroundNode.offsetWidth; //mb.w;
	var aroundNodeH = aroundNode.offsetHeight; //mb.h;
	var aroundNodePos = dojo.coords(aroundNode, true);
	aroundNode.style.display=oldDisplay;

	// place the node around the calculated rectangle
	return dijit._placeOnScreenAroundRect(node, 
		aroundNodePos.x, aroundNodePos.y, aroundNodeW, aroundNodeH,	// rectangle
		aroundCorners, layoutNode);
};

/*=====
dijit.__Rectangle = function(){
	//	x: Integer
	//		horizontal offset in pixels, relative to document body
	//	y: Integer
	//		vertical offset in pixels, relative to document body
	//	width: Integer
	//		width in pixels
	//	height: Integer
	//		height in pixels

	thix.x = x;
	this.y = y;
	thix.width = width;
	this.height = height;
}
=====*/


dijit.placeOnScreenAroundRectangle = function(
	/* DomNode */			node,
	/* dijit.__Rectangle */	aroundRect,
	/* Object */			aroundCorners,
	/* Function */			layoutNode){

	//	summary:
	//		Like dijit.placeOnScreenAroundNode(), except that the "around"
	//		parameter is an arbitrary rectangle on the screen (x, y, width, height)
	//		instead of a dom node.

	return dijit._placeOnScreenAroundRect(node, 
		aroundRect.x, aroundRect.y, aroundRect.width, aroundRect.height,	// rectangle
		aroundCorners, layoutNode);
};

dijit._placeOnScreenAroundRect = function(
	/* DomNode */		node,
	/* Number */		x,
	/* Number */		y,
	/* Number */		width,
	/* Number */		height,
	/* Object */		aroundCorners,
	/* Function */		layoutNode){

	//	summary:
	//		Like dijit.placeOnScreenAroundNode(), except it accepts coordinates
	//		of a rectangle to place node adjacent to.

	// TODO: combine with placeOnScreenAroundRectangle()

	// Generate list of possible positions for node
	var choices = [];
	for(var nodeCorner in aroundCorners){
		choices.push( {
			aroundCorner: nodeCorner,
			corner: aroundCorners[nodeCorner],
			pos: {
				x: x + (nodeCorner.charAt(1) == 'L' ? 0 : width),
				y: y + (nodeCorner.charAt(0) == 'T' ? 0 : height)
			}
		});
	}

	return dijit._place(node, choices, layoutNode);
};

dijit.placementRegistry = new dojo.AdapterRegistry();
dijit.placementRegistry.register("node",
	function(n, x){
		return typeof x == "object" &&
			typeof x.offsetWidth != "undefined" && typeof x.offsetHeight != "undefined";
	},
	dijit.placeOnScreenAroundNode);
dijit.placementRegistry.register("rect",
	function(n, x){
		return typeof x == "object" &&
			"x" in x && "y" in x && "width" in x && "height" in x;
	},
	dijit.placeOnScreenAroundRectangle);

dijit.placeOnScreenAroundElement = function(
	/* DomNode */		node,
	/* Object */		aroundElement,
	/* Object */		aroundCorners,
	/* Function */		layoutNode){

	//	summary:
	//		Like dijit.placeOnScreenAroundNode(), except it accepts an arbitrary object
	//		for the "around" argument and finds a proper processor to place a node.

	return dijit.placementRegistry.match.apply(dijit.placementRegistry, arguments);
};

}

if(!dojo._hasResource["dijit._base.window"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.window"] = true;
dojo.provide("dijit._base.window");

dijit.getDocumentWindow = function(doc){
	// summary:
	// 		Get window object associated with document doc

	// In some IE versions (at least 6.0), document.parentWindow does not return a
	// reference to the real window object (maybe a copy), so we must fix it as well
	// We use IE specific execScript to attach the real window reference to
	// document._parentWindow for later use
	if(dojo.isIE && window !== document.parentWindow && !doc._parentWindow){
		/*
		In IE 6, only the variable "window" can be used to connect events (others
		may be only copies).
		*/
		doc.parentWindow.execScript("document._parentWindow = window;", "Javascript");
		//to prevent memory leak, unset it after use
		//another possibility is to add an onUnload handler which seems overkill to me (liucougar)
		var win = doc._parentWindow;
		doc._parentWindow = null;
		return win;	//	Window
	}

	return doc._parentWindow || doc.parentWindow || doc.defaultView;	//	Window
}

}

if(!dojo._hasResource["dijit._base.popup"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.popup"] = true;
dojo.provide("dijit._base.popup");





dijit.popup = new function(){
	// summary:
	//		This class is used to show/hide widgets as popups.
	//

	var stack = [],
		beginZIndex=1000,
		idGen = 1;

	this.prepare = function(/*DomNode*/ node){
		// summary:
		//		Prepares a node to be used as a popup
		//
		// description:
		//		Attaches node to dojo.doc.body, and
		//		positions it off screen, but not display:none, so that
		//		the widget doesn't appear in the page flow and/or cause a blank
		//		area at the bottom of the viewport (making scrollbar longer), but
		//		initialization of contained widgets works correctly
	
		dojo.body().appendChild(node);
		var s = node.style;
		if(s.display == "none"){
			s.display="";
		}
		s.visibility = "hidden";	// not needed for hiding, but used as flag that node is off-screen
		s.position = "absolute";
		s.top = "-9999px";
	};

	this.open = function(/*Object*/ args){
		// summary:
		//		Popup the widget at the specified position
		//
		// args: Object
		//		popup: Widget
		//			widget to display,
		//		parent: Widget
		//			the button etc. that is displaying this popup
		//		around: DomNode
		//			DOM node (typically a button); place popup relative to this node
		//		orient: Object
		//			structure specifying possible positions of popup relative to "around" node
		//		onCancel: Function
		//			callback when user has canceled the popup by
		//				1. hitting ESC or
		//				2. by using the popup widget's proprietary cancel mechanism (like a cancel button in a dialog);
		//				   ie: whenever popupWidget.onCancel() is called, args.onCancel is called
		//		onClose: Function
		//			callback whenever this popup is closed
		//		onExecute: Function
		//			callback when user "executed" on the popup/sub-popup by selecting a menu choice, etc. (top menu only)
		//
		// examples:
		//		1. opening at the mouse position
		//			dijit.popup.open({popup: menuWidget, x: evt.pageX, y: evt.pageY});
		//		2. opening the widget as a dropdown
		//			dijit.popup.open({parent: this, popup: menuWidget, around: this.domNode, onClose: function(){...}  });
		//
		//	Note that whatever widget called dijit.popup.open() should also listen to it's own _onBlur callback
		//	(fired from _base/focus.js) to know that focus has moved somewhere else and thus the popup should be closed.

		var widget = args.popup,
			orient = args.orient || {'BL':'TL', 'TL':'BL'},
			around = args.around,
			id = (args.around && args.around.id) ? (args.around.id+"_dropdown") : ("popup_"+idGen++);

		// make wrapper div to hold widget and possibly hold iframe behind it.
		// we can't attach the iframe as a child of the widget.domNode because
		// widget.domNode might be a <table>, <ul>, etc.
		var wrapper = dojo.doc.createElement("div");
		dijit.setWaiRole(wrapper, "presentation");
		wrapper.id = id;
		wrapper.className="dijitPopup";
		wrapper.style.zIndex = beginZIndex + stack.length;
		wrapper.style.left = wrapper.style.top = "0px";		// prevent transient scrollbar causing misalign (#5776)
		wrapper.style.visibility = "hidden";
		if(args.parent){
			wrapper.dijitPopupParent=args.parent.id;
		}
		dojo.body().appendChild(wrapper);

		var s = widget.domNode.style;
		s.display = "";
		s.visibility = "";
		s.position = "";
		wrapper.appendChild(widget.domNode);

		var iframe = new dijit.BackgroundIframe(wrapper);

		// position the wrapper node
		var best = around ?
			dijit.placeOnScreenAroundElement(wrapper, around, orient, widget.orient ? dojo.hitch(widget, "orient") : null) :
			dijit.placeOnScreen(wrapper, args, orient == 'R' ? ['TR','BR','TL','BL'] : ['TL','BL','TR','BR']);

		wrapper.style.visibility = "visible";
		// TODO: use effects to fade in wrapper

		var handlers = [];

		// Compute the closest ancestor popup that's *not* a child of another popup.
		// Ex: For a TooltipDialog with a button that spawns a tree of menus, find the popup of the button.
		var getTopPopup = function(){
			for(var pi=stack.length-1; pi > 0 && stack[pi].parent === stack[pi-1].widget; pi--){
				/* do nothing, just trying to get right value for pi */
			}
			return stack[pi];
		}

		// provide default escape and tab key handling
		// (this will work for any widget, not just menu)
		handlers.push(dojo.connect(wrapper, "onkeypress", this, function(evt){
			if(evt.charOrCode == dojo.keys.ESCAPE && args.onCancel){
				dojo.stopEvent(evt);
				args.onCancel();
			}else if(evt.charOrCode === dojo.keys.TAB){
				dojo.stopEvent(evt);
				var topPopup = getTopPopup();
				if(topPopup && topPopup.onCancel){
					topPopup.onCancel();
				}
			}
		}));

		// watch for cancel/execute events on the popup and notify the caller
		// (for a menu, "execute" means clicking an item)
		if(widget.onCancel){
			handlers.push(dojo.connect(widget, "onCancel", null, args.onCancel));
		}

		handlers.push(dojo.connect(widget, widget.onExecute ? "onExecute" : "onChange", null, function(){
			var topPopup = getTopPopup();
			if(topPopup && topPopup.onExecute){
				topPopup.onExecute();
			}
		}));

		stack.push({
			wrapper: wrapper,
			iframe: iframe,
			widget: widget,
			parent: args.parent,
			onExecute: args.onExecute,
			onCancel: args.onCancel,
 			onClose: args.onClose,
			handlers: handlers
		});

		if(widget.onOpen){
			widget.onOpen(best);
		}

		return best;
	};

	this.close = function(/*Widget*/ popup){
		// summary:
		//		Close specified popup and any popups that it parented
		while(dojo.some(stack, function(elem){return elem.widget == popup;})){
			var top = stack.pop(),
				wrapper = top.wrapper,
				iframe = top.iframe,
				widget = top.widget,
				onClose = top.onClose;
	
			if(widget.onClose){
				widget.onClose();
			}
			dojo.forEach(top.handlers, dojo.disconnect);
	
			// #2685: check if the widget still has a domNode so ContentPane can change its URL without getting an error
			if(!widget||!widget.domNode){ return; }
			
			this.prepare(widget.domNode);

			iframe.destroy();
			dojo._destroyElement(wrapper);
	
			if(onClose){
				onClose();
			}
		}
	};
}();

dijit._frames = new function(){
	// summary: cache of iframes
	var queue = [];

	this.pop = function(){
		var iframe;
		if(queue.length){
			iframe = queue.pop();
			iframe.style.display="";
		}else{
			if(dojo.isIE){
				var burl = dojo.config["dojoBlankHtmlUrl"] || (dojo.moduleUrl("dojo", "resources/blank.html")+"") || "javascript:\"\"";
				var html="<iframe src='" + burl + "'"
					+ " style='position: absolute; left: 0px; top: 0px;"
					+ "z-index: -1; filter:Alpha(Opacity=\"0\");'>";
				iframe = dojo.doc.createElement(html);
			}else{
			 	iframe = dojo.doc.createElement("iframe");
				iframe.src = 'javascript:""';
				iframe.className = "dijitBackgroundIframe";
			}
			iframe.tabIndex = -1; // Magic to prevent iframe from getting focus on tab keypress - as style didnt work.
			dojo.body().appendChild(iframe);
		}
		return iframe;
	};

	this.push = function(iframe){
		iframe.style.display="";
		if(dojo.isIE){
			iframe.style.removeExpression("width");
			iframe.style.removeExpression("height");
		}
		queue.push(iframe);
	}
}();

// fill the queue
if(dojo.isIE < 7){
	dojo.addOnLoad(function(){
		var f = dijit._frames;
		dojo.forEach([f.pop()], f.push);
	});
}


dijit.BackgroundIframe = function(/* DomNode */node){
	//	summary:
	//		For IE z-index schenanigans. id attribute is required.
	//
	//	description:
	//		new dijit.BackgroundIframe(node)
	//			Makes a background iframe as a child of node, that fills
	//			area (and position) of node

	if(!node.id){ throw new Error("no id"); }
	if((dojo.isIE && dojo.isIE < 7) || (dojo.isFF && dojo.isFF < 3 && dojo.hasClass(dojo.body(), "dijit_a11y"))){
		var iframe = dijit._frames.pop();
		node.appendChild(iframe);
		if(dojo.isIE){
			iframe.style.setExpression("width", dojo._scopeName + ".doc.getElementById('" + node.id + "').offsetWidth");
			iframe.style.setExpression("height", dojo._scopeName + ".doc.getElementById('" + node.id + "').offsetHeight");
		}
		this.iframe = iframe;
	}
};

dojo.extend(dijit.BackgroundIframe, {
	destroy: function(){
		//	summary: destroy the iframe
		if(this.iframe){
			dijit._frames.push(this.iframe);
			delete this.iframe;
		}
	}
});

}

if(!dojo._hasResource["dijit._base.scroll"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.scroll"] = true;
dojo.provide("dijit._base.scroll");

dijit.scrollIntoView = function(/* DomNode */node){
	//	summary
	//	Scroll the passed node into view, if it is not.

	// don't rely on that node.scrollIntoView works just because the function is there
	// it doesnt work in Konqueror or Opera even though the function is there and probably
	//	not safari either
	// native scrollIntoView() causes FF3's whole window to scroll if there is no scroll bar 
	//	on the immediate parent
	// dont like browser sniffs implementations but sometimes you have to use it
	// It's not enough just to scroll the menu node into view if
	// node.scrollIntoView hides part of the parent's scrollbar,
	// so just manage the parent scrollbar ourselves

	node = dojo.byId(node);
	var body = node.ownerDocument.body;
	var html = body.parentNode;
	if(dojo.isFF == 2 || node == body || node == html){ // FF2 is perfect, too bad FF3 is not
		node.scrollIntoView(false); // short-circuit to native if possible
		return;
	}
	var rtl = !dojo._isBodyLtr();
	var strict = dojo.doc.compatMode != 'BackCompat'; // not the same as !dojo.isQuirks
	var scrollRoot = (strict && !dojo.isSafari)? html : body;

	function addPseudoAttrs(element){
		var parent = element.parentNode;
		var offsetParent = element.offsetParent;
		if(offsetParent == null){ // process only 1 of BODY/HTML
			element = scrollRoot;
			offsetParent = html;
			parent = null;
		}
		// all the V/H object members below are to reuse code for both directions
		element._offsetParent = (offsetParent == body)? scrollRoot : offsetParent;
		element._parent = (parent == body)? scrollRoot : parent;
		element._start = { H:element.offsetLeft, V:element.offsetTop };
		element._scroll = { H:element.scrollLeft, V:element.scrollTop };
		element._renderedSize = { H: element.offsetWidth, V: element.offsetHeight };
		var bp = dojo._getBorderExtents(element);
		element._borderStart = { H:bp.l, V:bp.t };
		element._borderSize = { H:bp.w, V:bp.h };
		element._clientSize = (element._offsetParent == html && dojo.isSafari && strict)? { H:html.clientWidth, V:html.clientHeight } : { H:element.clientWidth, V:element.clientHeight };
		element._scrollBarSize = { V: null, H: null };
		for(var dir in element._scrollBarSize){ // for both x and y directions
			var scrollBar = element._renderedSize[dir] - element._clientSize[dir] - element._borderSize[dir];
			element._scrollBarSize[dir] = (element._clientSize[dir] > 0 && scrollBar >= 15 && scrollBar <= 17)? scrollBar : 0; // sanity check
		}
		element._isScrollable = { V: null, H: null };
		for(dir in element._isScrollable){ // for both x and y directions
			var otherDir = dir=="H"? "V" : "H";
			element._isScrollable[dir] = element == scrollRoot || element._scroll[dir] || element._scrollBarSize[otherDir];
		}
	}

	var parent = node;
	while(parent != null){
		addPseudoAttrs(parent);
		var next = parent._parent;
		if(next){
			next._child = parent;
		}
		parent = next;
	}
	for(var dir in scrollRoot._renderedSize){ scrollRoot._renderedSize[dir] = Math.min(scrollRoot._clientSize[dir], scrollRoot._renderedSize[dir]); }
	var element = node;
	while(element != scrollRoot){
		parent = element._parent;
		if(parent.tagName == "TD"){
			var table = parent._parent._parent._parent; // point to TABLE
			if(table._offsetParent == element._offsetParent && parent._offsetParent != element._offsetParent){
				parent = table; // child of TD has the same offsetParent as TABLE, so skip TD, TR, and TBODY (ie. verticalslider)
			}
		}
		// check if this node and its parent share the same offsetParent
		var startIsRelative = element == scrollRoot || (parent._offsetParent != element._offsetParent);

		for(dir in element._start){ // for both x and y directions
			var otherDir = dir=="H"? "V" : "H";
			if(rtl && dir=="H" && (dojo.isSafari || dojo.isIE) && parent._clientSize.H > 0){ // scroll starts on the right
				var delta = parent.scrollWidth - parent._clientSize.H;
				if(delta > 0){ parent._scroll.H -= delta; } // match FF3 which has cool negative scrollLeft values
			}
			if(dojo.isIE && parent._offsetParent.tagName == "TABLE"){ // make it consistent with Safari and FF3 and exclude the starting TABLE border of TABLE children
				parent._start[dir] -= parent._offsetParent._borderStart[dir];
				parent._borderStart[dir] = parent._borderSize[dir] = 0;
			}
			if(parent._clientSize[dir] == 0){ // TABLE on Safari3/FF3, and TBODY on IE6/7
				parent._renderedSize[dir] = parent._clientSize[dir] = parent._child._clientSize[dir];
				if(rtl && dir=="H"){ parent._start[dir] -= parent._renderedSize[dir]; }
			}else{
				parent._renderedSize[dir] -= parent._borderSize[dir] + parent._scrollBarSize[dir];
			}
			parent._start[dir] += parent._borderStart[dir];

			// underflow = visible gap between parent and this node taking scrolling into account
			// if negative, part of the node is obscured by the parent's beginning and should be scrolled to become visible
			var underflow = element._start[dir] - (startIsRelative? 0 : parent._start[dir]) - parent._scroll[dir];
			// if positive, number of pixels obscured by the parent's end
			var overflow = underflow + element._renderedSize[dir] - parent._renderedSize[dir];
			var scrollAmount, scrollAttr = (dir=="H")? "scrollLeft" : "scrollTop";
			// see if we should scroll forward or backward
			var reverse = (dir=="H" && rtl); // flip everything
			var underflowScroll = reverse? -overflow : underflow;
			var overflowScroll = reverse? -underflow : overflow;
			if(underflowScroll <= 0){
				scrollAmount = underflowScroll;
			}else if(overflowScroll <= 0){
				scrollAmount = 0;
			}else if(underflowScroll < overflowScroll){
				scrollAmount = underflowScroll;
			}else{
				scrollAmount = overflowScroll;
			}
			var scrolledAmount = 0;
			if(scrollAmount != 0){
				var oldScroll = parent[scrollAttr];
				parent[scrollAttr] += reverse? -scrollAmount : scrollAmount; // actually perform the scroll
				scrolledAmount = parent[scrollAttr] - oldScroll; // in case the scroll failed
				underflow -= scrolledAmount;
				overflowScroll -= reverse? -scrolledAmount : scrolledAmount;
			}
			parent._renderedSize[dir] = element._renderedSize[dir] + parent._scrollBarSize[dir] - 
				// check for isScrollable since a nonscrolling parent could be smaller than the child but the child is fully visible
				((parent._isScrollable[dir] && overflowScroll > 0)? overflowScroll : 0); // only show portion of the parent
			parent._start[dir] += (underflow >= 0 || !parent._isScrollable[dir])? underflow : 0;
		}
		element = parent; // now see if the parent needs to be scrolled as well
	}
};

}

if(!dojo._hasResource["dijit._base.sniff"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.sniff"] = true;
//	summary:
//		Applies pre-set CSS classes to the top-level HTML node, based on:
// 			- browser (ex: dj_ie)
//			- browser version (ex: dj_ie6)
//			- box model (ex: dj_contentBox)
//			- text direction (ex: dijitRtl)
//
//		In addition, browser, browser version, and box model are
//		combined with an RTL flag when browser text is RTL.  ex: dj_ie-rtl.
//
//		Simply doing a require on this module will
//		establish this CSS.  Modified version of Morris' CSS hack.

dojo.provide("dijit._base.sniff");

(function(){
	var d = dojo;
	var ie = d.isIE;
	var opera = d.isOpera;
	var maj = Math.floor;
	var ff = d.isFF;
	var boxModel = d.boxModel.replace(/-/,'');
	var classes = {
		dj_ie: ie,
//		dj_ie55: ie == 5.5,
		dj_ie6: maj(ie) == 6,
		dj_ie7: maj(ie) == 7,
		dj_iequirks: ie && d.isQuirks,
// NOTE: Opera not supported by dijit
		dj_opera: opera,
		dj_opera8: maj(opera) == 8,
		dj_opera9: maj(opera) == 9,
		dj_khtml: d.isKhtml,
		dj_safari: d.isSafari,
		dj_gecko: d.isMozilla,
		dj_ff2: maj(ff) == 2,
		dj_ff3: maj(ff) == 3
	}; // no dojo unsupported browsers
	classes["dj_" + boxModel] = true;

	var html = dojo.doc.documentElement;

	// apply browser, browser version, and box model class names
	for(var p in classes){
		if(classes[p]){
			if(html.className){
				html.className += " " + p;
			}else{
				html.className = p;
			}
		}
	}

	// If RTL mode then add dijitRtl flag plus repeat existing classes
	// with -rtl extension
	// (unshift is to make this code run after <body> node is loaded but before parser runs)
	dojo._loaders.unshift(function(){
		if(!dojo._isBodyLtr()){
			html.className += " dijitRtl";
			for(var p in classes){
				if(classes[p]){
					html.className += " " + p+"-rtl";
				}
			}
		}
	});
})();

}

if(!dojo._hasResource["dijit._base.typematic"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.typematic"] = true;
dojo.provide("dijit._base.typematic");

dijit.typematic = {
	// summary:
	//	These functions are used to repetitively call a user specified callback
	//	method when a specific key or mouse click over a specific DOM node is
	//	held down for a specific amount of time.
	//	Only 1 such event is allowed to occur on the browser page at 1 time.

	_fireEventAndReload: function(){
		this._timer = null;
		this._callback(++this._count, this._node, this._evt);
		this._currentTimeout = (this._currentTimeout < 0) ? this._initialDelay : ((this._subsequentDelay > 1) ? this._subsequentDelay : Math.round(this._currentTimeout * this._subsequentDelay));
		this._timer = setTimeout(dojo.hitch(this, "_fireEventAndReload"), this._currentTimeout);
	},

	trigger: function(/*Event*/ evt, /* Object */ _this, /*DOMNode*/ node, /* Function */ callback, /* Object */ obj, /* Number */ subsequentDelay, /* Number */ initialDelay){
		// summary:
		//      Start a timed, repeating callback sequence.
		//      If already started, the function call is ignored.
		//      This method is not normally called by the user but can be
		//      when the normal listener code is insufficient.
		//	Parameters:
		//	evt: key or mouse event object to pass to the user callback
		//	_this: pointer to the user's widget space.
		//	node: the DOM node object to pass the the callback function
		//	callback: function to call until the sequence is stopped called with 3 parameters:
		//		count: integer representing number of repeated calls (0..n) with -1 indicating the iteration has stopped
		//		node: the DOM node object passed in
		//		evt: key or mouse event object
		//	obj: user space object used to uniquely identify each typematic sequence
		//	subsequentDelay: if > 1, the number of milliseconds until the 3->n events occur
		//		or else the fractional time multiplier for the next event's delay, default=0.9
		//	initialDelay: the number of milliseconds until the 2nd event occurs, default=500ms
		if(obj != this._obj){
			this.stop();
			this._initialDelay = initialDelay || 500;
			this._subsequentDelay = subsequentDelay || 0.90;
			this._obj = obj;
			this._evt = evt;
			this._node = node;
			this._currentTimeout = -1;
			this._count = -1;
			this._callback = dojo.hitch(_this, callback);
			this._fireEventAndReload();
		}
	},

	stop: function(){
		// summary:
		//	  Stop an ongoing timed, repeating callback sequence.
		if(this._timer){
			clearTimeout(this._timer);
			this._timer = null;
		}
		if(this._obj){
			this._callback(-1, this._node, this._evt);
			this._obj = null;
		}
	},

	addKeyListener: function(/*DOMNode*/ node, /*Object*/ keyObject, /*Object*/ _this, /*Function*/ callback, /*Number*/ subsequentDelay, /*Number*/ initialDelay){
		// summary: Start listening for a specific typematic key.
		//	keyObject: an object defining the key to listen for.
		//		charOrCode: the printable character (string) or keyCode (number) to listen for.
		//			keyCode: (deprecated - use charOrCode) the keyCode (number) to listen for (implies charCode = 0).
		//			charCode: (deprecated - use charOrCode) the charCode (number) to listen for.
		//		ctrlKey: desired ctrl key state to initiate the calback sequence:
		//			pressed (true)
		//			released (false)
		//			either (unspecified)
		//		altKey: same as ctrlKey but for the alt key
		//		shiftKey: same as ctrlKey but for the shift key
		//	See the trigger method for other parameters.
		//	Returns an array of dojo.connect handles
		if(keyObject.keyCode){
			keyObject.charOrCode = keyObject.keyCode;
			dojo.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.", "", "2.0");
		}else if(keyObject.charCode){
			keyObject.charOrCode = String.fromCharCode(keyObject.charCode);
			dojo.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.", "", "2.0");
		}
		return [
			dojo.connect(node, "onkeypress", this, function(evt){
				if(evt.charOrCode == keyObject.charOrCode &&
				(keyObject.ctrlKey === undefined || keyObject.ctrlKey == evt.ctrlKey) &&
				(keyObject.altKey === undefined || keyObject.altKey == evt.ctrlKey) &&
				(keyObject.shiftKey === undefined || keyObject.shiftKey == evt.ctrlKey)){
					dojo.stopEvent(evt);
					dijit.typematic.trigger(keyObject, _this, node, callback, keyObject, subsequentDelay, initialDelay);
				}else if(dijit.typematic._obj == keyObject){
					dijit.typematic.stop();
				}
			}),
			dojo.connect(node, "onkeyup", this, function(evt){
				if(dijit.typematic._obj == keyObject){
					dijit.typematic.stop();
				}
			})
		];
	},

	addMouseListener: function(/*DOMNode*/ node, /*Object*/ _this, /*Function*/ callback, /*Number*/ subsequentDelay, /*Number*/ initialDelay){
		// summary: Start listening for a typematic mouse click.
		//	See the trigger method for other parameters.
		//	Returns an array of dojo.connect handles
		var dc = dojo.connect;
		return [
			dc(node, "mousedown", this, function(evt){
				dojo.stopEvent(evt);
				dijit.typematic.trigger(evt, _this, node, callback, node, subsequentDelay, initialDelay);
			}),
			dc(node, "mouseup", this, function(evt){
				dojo.stopEvent(evt);
				dijit.typematic.stop();
			}),
			dc(node, "mouseout", this, function(evt){
				dojo.stopEvent(evt);
				dijit.typematic.stop();
			}),
			dc(node, "mousemove", this, function(evt){
				dojo.stopEvent(evt);
			}),
			dc(node, "dblclick", this, function(evt){
				dojo.stopEvent(evt);
				if(dojo.isIE){
					dijit.typematic.trigger(evt, _this, node, callback, node, subsequentDelay, initialDelay);
					setTimeout(dojo.hitch(this, dijit.typematic.stop), 50);
				}
			})
		];
	},

	addListener: function(/*Node*/ mouseNode, /*Node*/ keyNode, /*Object*/ keyObject, /*Object*/ _this, /*Function*/ callback, /*Number*/ subsequentDelay, /*Number*/ initialDelay){
		// summary: Start listening for a specific typematic key and mouseclick.
		//	This is a thin wrapper to addKeyListener and addMouseListener.
		//	mouseNode: the DOM node object to listen on for mouse events.
		//	keyNode: the DOM node object to listen on for key events.
		//	See the addMouseListener and addKeyListener methods for other parameters.
		//	Returns an array of dojo.connect handles
		return this.addKeyListener(keyNode, keyObject, _this, callback, subsequentDelay, initialDelay).concat(
			this.addMouseListener(mouseNode, _this, callback, subsequentDelay, initialDelay));
	}
};

}

if(!dojo._hasResource["dijit._base.wai"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base.wai"] = true;
dojo.provide("dijit._base.wai");

dijit.wai = {
	onload: function(){
		// summary:
		//		Detects if we are in high-contrast mode or not

		// This must be a named function and not an anonymous
		// function, so that the widget parsing code can make sure it
		// registers its onload function after this function.
		// DO NOT USE "this" within this function.

		// create div for testing if high contrast mode is on or images are turned off
		var div = dojo.doc.createElement("div");
		div.id = "a11yTestNode";
		div.style.cssText = 'border: 1px solid;'
			+ 'border-color:red green;'
			+ 'position: absolute;'
			+ 'height: 5px;'
			+ 'top: -999px;'
			+ 'background-image: url("' + (dojo.config.blankGif || dojo.moduleUrl("dojo", "resources/blank.gif")) + '");';
		dojo.body().appendChild(div);

		// test it
		var cs = dojo.getComputedStyle(div);
		if(cs){
			var bkImg = cs.backgroundImage;
			var needsA11y = (cs.borderTopColor==cs.borderRightColor) || (bkImg != null && (bkImg == "none" || bkImg == "url(invalid-url:)" ));
			dojo[needsA11y ? "addClass" : "removeClass"](dojo.body(), "dijit_a11y");
			if(dojo.isIE){
				div.outerHTML = "";		// prevent mixed-content warning, see http://support.microsoft.com/kb/925014
			}else{
				dojo.body().removeChild(div);
			}
		}
	}
};

// Test if computer is in high contrast mode.
// Make sure the a11y test runs first, before widgets are instantiated.
if(dojo.isIE || dojo.isMoz){	// NOTE: checking in Safari messes things up
	dojo._loaders.unshift(dijit.wai.onload);
}

dojo.mixin(dijit,
{
	_XhtmlRoles: /banner|contentinfo|definition|main|navigation|search|note|secondary|seealso/,

	hasWaiRole: function(/*Element*/ elem, /*String*/ role){
		// summary: Determines if an element has a particular non-XHTML role.
		// returns: true if elem has the specific non-XHTML role attribute and false if not.
		// 		for backwards compatibility if role parameter not provided, 
		// 		returns true if has non XHTML role 
		var waiRole = this.getWaiRole(elem);		
		if (role){
			return (waiRole.indexOf(role) > -1);
		}else{
			return (waiRole.length >0);
		}
	},

	getWaiRole: function(/*Element*/ elem){
		// summary: Gets the non-XHTML role for an element (which should be a wai role).
		// returns:
		//		The non-XHTML role of elem or an empty string if elem
		//		does not have a role.
		 return dojo.trim((dojo.attr(elem, "role") || "").replace(this._XhtmlRoles,"").replace("wairole:",""));
	},

	setWaiRole: function(/*Element*/ elem, /*String*/ role){
		// summary: Sets the role on an element.
		// description:
		//  	in other than FF2 replace existing role attribute with new role
		//		FF3 supports XHTML and ARIA roles so    
		//		If elem already has an XHTML role, append this role to XHTML role 
		//		and remove other ARIA roles
		//		On Firefox 2 and below, "wairole:" is
		//		prepended to the provided role value.

		var curRole = dojo.attr(elem, "role") || "";
		if (dojo.isFF<3 || !this._XhtmlRoles.test(curRole)){
			dojo.attr(elem, "role", dojo.isFF<3 ? "wairole:" + role : role);
		}else{
			if((" "+ curRole +" ").indexOf(" " + role + " ") < 0){
				var clearXhtml = dojo.trim(curRole.replace(this._XhtmlRoles, ""));
				var cleanRole = dojo.trim(curRole.replace(clearXhtml, ""));	 
         		dojo.attr(elem, "role", cleanRole + (cleanRole ? ' ' : '') + role);
			}
		}
	},

	removeWaiRole: function(/*Element*/ elem, /*String*/ role){
		// summary: Removes the specified non-XHTML role from an element.
		// 		removes role attribute if no specific role provided (for backwards compat.)
		
		var roleValue = dojo.attr(elem, "role"); 
		if (!roleValue){ return; }
		if(role){
			var searchRole = dojo.isFF < 3 ? "wairole:" + role : role;
			var t = dojo.trim((" " + roleValue + " ").replace(" " + searchRole + " ", " "));
			dojo.attr(elem, "role", t);
		}else{
			elem.removeAttribute("role");	
		}
	},

	hasWaiState: function(/*Element*/ elem, /*String*/ state){
		// summary: Determines if an element has a given state.
		// description:
		//		On Firefox 2 and below, we check for an attribute in namespace
		//		"http://www.w3.org/2005/07/aaa" with a name of the given state.
		//		On all other browsers, we check for an attribute
		//		called "aria-"+state.
		// returns:
		//		true if elem has a value for the given state and
		//		false if it does not.
		if(dojo.isFF < 3){
			return elem.hasAttributeNS("http://www.w3.org/2005/07/aaa", state);
		}else{
			return elem.hasAttribute ? elem.hasAttribute("aria-"+state) : !!elem.getAttribute("aria-"+state);
		}
	},

	getWaiState: function(/*Element*/ elem, /*String*/ state){
		// summary: Gets the value of a state on an element.
		// description:
		//		On Firefox 2 and below, we check for an attribute in namespace
		//		"http://www.w3.org/2005/07/aaa" with a name of the given state.
		//		On all other browsers, we check for an attribute called
		//		"aria-"+state.
		// returns:
		//		The value of the requested state on elem
		//		or an empty string if elem has no value for state.
		if(dojo.isFF < 3){
			return elem.getAttributeNS("http://www.w3.org/2005/07/aaa", state);
		}else{
			var value = elem.getAttribute("aria-"+state);
			return value ? value : "";
		}
	},

	setWaiState: function(/*Element*/ elem, /*String*/ state, /*String*/ value){
		// summary: Sets a state on an element.
		// description:
		//		On Firefox 2 and below, we set an attribute in namespace
		//		"http://www.w3.org/2005/07/aaa" with a name of the given state.
		//		On all other browsers, we set an attribute called
		//		"aria-"+state.
		if(dojo.isFF < 3){
			elem.setAttributeNS("http://www.w3.org/2005/07/aaa",
				"aaa:"+state, value);
		}else{
			elem.setAttribute("aria-"+state, value);
		}
	},

	removeWaiState: function(/*Element*/ elem, /*String*/ state){
		// summary: Removes a state from an element.
		// description:
		//		On Firefox 2 and below, we remove the attribute in namespace
		//		"http://www.w3.org/2005/07/aaa" with a name of the given state.
		//		On all other browsers, we remove the attribute called
		//		"aria-"+state.
		if(dojo.isFF < 3){
			elem.removeAttributeNS("http://www.w3.org/2005/07/aaa", state);
		}else{
			elem.removeAttribute("aria-"+state);
		}
	}
});

}

if(!dojo._hasResource["dijit._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._base"] = true;
dojo.provide("dijit._base");











}

if(!dojo._hasResource["dijit._Widget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Widget"] = true;
dojo.provide("dijit._Widget");

dojo.require( "dijit._base" );

dojo.connect(dojo, "connect", 
	function(/*Widget*/ widget, /*String*/ event){
		if(widget && dojo.isFunction(widget._onConnect)){
			widget._onConnect(event);
		}
	});

dijit._connectOnUseEventHandler = function(/*Event*/ event){};

(function(){

var _attrReg = {};
var getAttrReg = function(dc){
	if(!_attrReg[dc]){
		var r = [];
		var attrs;
		var proto = dojo.getObject(dc).prototype;
		for(var fxName in proto){
			if(dojo.isFunction(proto[fxName]) && (attrs = fxName.match(/^_set([a-zA-Z]*)Attr$/)) && attrs[1]){
				r.push(attrs[1].charAt(0).toLowerCase() + attrs[1].substr(1));
			}
		}
		_attrReg[dc] = r;
	}
	return _attrReg[dc]||[];
}

dojo.declare("dijit._Widget", null, {
	//	summary:
	//		The foundation of dijit widgets. 	
	//
	//	id: String
	//		a unique, opaque ID string that can be assigned by users or by the
	//		system. If the developer passes an ID which is known not to be
	//		unique, the specified ID is ignored and the system-generated ID is
	//		used instead.
	id: "",

	//	lang: String
	//		Rarely used.  Overrides the default Dojo locale used to render this widget,
	//		as defined by the [HTML LANG](http://www.w3.org/TR/html401/struct/dirlang.html#adef-lang) attribute.
	//		Value must be among the list of locales specified during by the Dojo bootstrap,
	//		formatted according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt) (like en-us).
	lang: "",

	//	dir: String
	//		Unsupported by Dijit, but here for completeness.  Dijit only supports setting text direction on the
	//		entire document.
	//		Bi-directional support, as defined by the [HTML DIR](http://www.w3.org/TR/html401/struct/dirlang.html#adef-dir)
	//		attribute. Either left-to-right "ltr" or right-to-left "rtl".
	dir: "",

	// class: String
	//		HTML class attribute
	"class": "",

	// style: String
	//		HTML style attribute
	style: "",

	// title: String
	//		HTML title attribute
	title: "",

	// srcNodeRef: DomNode
	//		pointer to original dom node
	srcNodeRef: null,

	// domNode: DomNode
	//		This is our visible representation of the widget! Other DOM
	//		Nodes may by assigned to other properties, usually through the
	//		template system's dojoAttachPoint syntax, but the domNode
	//		property is the canonical "top level" node in widget UI.
	domNode: null,

	// containerNode: DomNode
	//		Designates where children of the source dom node will be placed.
	//		"Children" in this case refers to both dom nodes and widgets.
	//		For example, for myWidget:
	//
	//		|	<div dojoType=myWidget>
	//		|		<b> here's a plain dom node
	//		|		<span dojoType=subWidget>and a widget</span>
	//		|		<i> and another plain dom node </i>
	//		|	</div>
	//
	//		containerNode would point to:
	//
	//		|		<b> here's a plain dom node
	//		|		<span dojoType=subWidget>and a widget</span>
	//		|		<i> and another plain dom node </i>
	//
	//		In templated widgets, "containerNode" is set via a
	//		dojoAttachPoint assignment.
	//
	//		containerNode must be defined for any widget that accepts innerHTML
	//		(like ContentPane or BorderContainer or even Button), and conversely
	//		is null for widgets that don't, like TextBox.
	containerNode: null,

	// attributeMap: Object
	//		attributeMap sets up a "binding" between attributes (aka properties)
	//		of the widget and the widget's DOM.
	//		Changes to widget attributes listed in attributeMap will be 
	//		reflected into the DOM.
	//
	//		For example, calling attr('title', 'hello')
	//		on a TitlePane will automatically cause the TitlePane's DOM to update
	//		with the new title.
	//
	//		attributeMap is a hash where the key is an attribute of the widget,
	//		and the value reflects a binding to a:
	//
	//		- DOM node attribute
	// |		focus: {node: "focusNode", type: "attribute"}
	// 		Maps this.focus to this.focusNode.focus
	//
	//		- DOM node innerHTML
	//	|		title: { node: "titleNode", type: "innerHTML" }
	//		Maps this.title to this.titleNode.innerHTML
	//
	//		- DOM node CSS class
	// |		myClass: { node: "domNode", type: "class" }
	//		Maps this.myClass to this.domNode.className
	//
	//		If the value is an array, then each element in the array matches one of the
	//		formats of the above list.
	//
	//		There are also some shorthands for backwards compatibility:
	//		- string --> { node: string, type: "attribute" }, for example:
	//	|	"focusNode" ---> { node: "focusNode", type: "attribute" }
	//		- "" --> { node: "domNode", type: "attribute" }
	attributeMap: {id:"", dir:"", lang:"", "class":"", style:"", title:""},

	// _deferredConnects: Object
	//		attributeMap addendum for event handlers that should be connected only on first use
	_deferredConnects: {
		onClick: "",
		onDblClick: "",
		onKeyDown: "",
		onKeyPress: "",
		onKeyUp: "",
		onMouseMove: "",
		onMouseDown: "",
		onMouseOut: "",
		onMouseOver: "",
		onMouseLeave: "",
		onMouseEnter: "",
		onMouseUp: ""},

	onClick: dijit._connectOnUseEventHandler,
	/*=====
	onClick: function(event){
		// summary: 
		//	Connect to this function to receive notifications of mouse click events.
		//	event: mouse Event
	},
	=====*/
	onDblClick: dijit._connectOnUseEventHandler,
	/*=====
	onDblClick: function(event){
		// summary: 
		//	Connect to this function to receive notifications of mouse double click events.
		//	event: mouse Event
	},
	=====*/
	onKeyDown: dijit._connectOnUseEventHandler,
	/*=====
	onKeyDown: function(event){
		// summary: 
		//	Connect to this function to receive notifications of keys being pressed down.
		//	event: key Event
	},
	=====*/
	onKeyPress: dijit._connectOnUseEventHandler,
	/*=====
	onKeyPress: function(event){
		// summary: 
		//	Connect to this function to receive notifications of printable keys being typed.
		//	event: key Event
	},
	=====*/
	onKeyUp: dijit._connectOnUseEventHandler,
	/*=====
	onKeyUp: function(event){
		// summary: 
		//	Connect to this function to receive notifications of keys being released.
		//	event: key Event
	},
	=====*/
	onMouseDown: dijit._connectOnUseEventHandler,
	/*=====
	onMouseDown: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse button is pressed down.
		//	event: mouse Event
	},
	=====*/
	onMouseMove: dijit._connectOnUseEventHandler,
	/*=====
	onMouseMove: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse moves over nodes contained within this widget.
		//	event: mouse Event
	},
	=====*/
	onMouseOut: dijit._connectOnUseEventHandler,
	/*=====
	onMouseOut: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse moves off of nodes contained within this widget.
		//	event: mouse Event
	},
	=====*/
	onMouseOver: dijit._connectOnUseEventHandler,
	/*=====
	onMouseOver: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse moves onto nodes contained within this widget.
		//	event: mouse Event
	},
	=====*/
	onMouseLeave: dijit._connectOnUseEventHandler,
	/*=====
	onMouseLeave: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse moves off of this widget.
		//	event: mouse Event
	},
	=====*/
	onMouseEnter: dijit._connectOnUseEventHandler,
	/*=====
	onMouseEnter: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse moves onto this widget.
		//	event: mouse Event
	},
	=====*/
	onMouseUp: dijit._connectOnUseEventHandler,
	/*=====
	onMouseUp: function(event){
		// summary: 
		//	Connect to this function to receive notifications of when the mouse button is released.
		//	event: mouse Event
	},
	=====*/

	// Constants used in templates
	_blankGif: (dojo.config.blankGif || dojo.moduleUrl("dojo", "resources/blank.gif")),

	//////////// INITIALIZATION METHODS ///////////////////////////////////////

	postscript: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
		// summary: kicks off widget instantiation, see create() for details.
		this.create(params, srcNodeRef);
	},

	create: function(/*Object?*/params, /*DomNode|String?*/srcNodeRef){
		//	summary:
		//		Kick off the life-cycle of a widget
		//	params:
		//		Hash of initialization parameters for widget, including
		//		scalar values (like title, duration etc.) and functions,
		//		typically callbacks like onClick.
		//	srcNodeRef:
		//		If a srcNodeRef (dom node) is specified:
		//			- use srcNodeRef.innerHTML as my contents
		//			- if this is a behavioral widget then apply behavior
		//			  to that srcNodeRef 
		//			- otherwise, replace srcNodeRef with my generated DOM
		//			  tree
		//	description:
		//		To understand the process by which widgets are instantiated, it
		//		is critical to understand what other methods create calls and
		//		which of them you'll want to override. Of course, adventurous
		//		developers could override create entirely, but this should
		//		only be done as a last resort.
		//
		//		Below is a list of the methods that are called, in the order
		//		they are fired, along with notes about what they do and if/when
		//		you should over-ride them in your widget:
		//
		// * postMixInProperties:
		//	|	* a stub function that you can over-ride to modify
		//		variables that may have been naively assigned by
		//		mixInProperties
		// * widget is added to manager object here
		// * buildRendering:
		//	|	* Subclasses use this method to handle all UI initialization
		//		Sets this.domNode.  Templated widgets do this automatically
		//		and otherwise it just uses the source dom node.
		// * postCreate:
		//	|	* a stub function that you can over-ride to modify take
		//		actions once the widget has been placed in the UI

		// store pointer to original dom tree
		this.srcNodeRef = dojo.byId(srcNodeRef);

		// For garbage collection.  An array of handles returned by Widget.connect()
		// Each handle returned from Widget.connect() is an array of handles from dojo.connect()
		this._connects = [];

		// To avoid double-connects, remove entries from _deferredConnects
		// that have been setup manually by a subclass (ex, by dojoAttachEvent).
		// If a subclass has redefined a callback (ex: onClick) then assume it's being
		// connected to manually.
		this._deferredConnects = dojo.clone(this._deferredConnects);
		for(var attr in this.attributeMap){
			delete this._deferredConnects[attr]; // can't be in both attributeMap and _deferredConnects
		}
		for(attr in this._deferredConnects){
			if(this[attr] !== dijit._connectOnUseEventHandler){
				delete this._deferredConnects[attr];	// redefined, probably dojoAttachEvent exists
			}
		}

		//mixin our passed parameters
		if(this.srcNodeRef && (typeof this.srcNodeRef.id == "string")){ this.id = this.srcNodeRef.id; }
		if(params){
			this.params = params;
			dojo.mixin(this,params);
		}
		this.postMixInProperties();

		// generate an id for the widget if one wasn't specified
		// (be sure to do this before buildRendering() because that function might
		// expect the id to be there.)
		if(!this.id){
			this.id = dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
		}
		dijit.registry.add(this);

		this.buildRendering();

		if(this.domNode){
			// Copy attributes listed in attributeMap into the [newly created] DOM for the widget.
			this._applyAttributes();

			// If the developer has specified a handler as a widget parameter
			// (ex: new Button({onClick: ...})
			// then naturally need to connect from dom node to that handler immediately, 
			for(attr in this.params){
				this._onConnect(attr);
			}
		}
		
		if(this.domNode){
			this.domNode.setAttribute("widgetId", this.id);
		}
		this.postCreate();

		// If srcNodeRef has been processed and removed from the DOM (e.g. TemplatedWidget) then delete it to allow GC.
		if(this.srcNodeRef && !this.srcNodeRef.parentNode){
			delete this.srcNodeRef;
		}	

		this._created = true;
	},

	_applyAttributes: function(){
		// summary:
		//		Step during widget creation to copy all widget attributes to the
		//		DOM as per attributeMap and _setXXXAttr functions.
		// description:
		//		Skips over blank/false attribute values, unless they were explicitly specified
		//		as parameters to the widget, since those are the default anyway,
		//		and setting tabIndex="" is different than not setting tabIndex at all.
		//
		//		It processes the attributes in the attribute map first, ant then
		//		it goes through and processes the attributes for the _setXXXAttr
		//		functions that have been specified
		var condAttrApply = function(attr, scope){
			if( (scope.params && attr in scope.params) || scope[attr]){
				scope.attr(attr, scope[attr]);
			}
		};
		for(var attr in this.attributeMap){
			condAttrApply(attr, this);
		}
		dojo.forEach(getAttrReg(this.declaredClass), function(a){
			if(!(a in this.attributeMap)){
				condAttrApply(a, this);
			}
		}, this);
	},

	postMixInProperties: function(){
		// summary:
		//		Called after the parameters to the widget have been read-in,
		//		but before the widget template is instantiated. Especially
		//		useful to set properties that are referenced in the widget
		//		template.
	},

	buildRendering: function(){
		// summary:
		//		Construct the UI for this widget, setting this.domNode.  Most
		//		widgets will mixin dijit._Templated, which implements this
		//		method.
		this.domNode = this.srcNodeRef || dojo.doc.createElement('div');
	},

	postCreate: function(){
		// summary:
		//		Called after a widget's dom has been setup
	},

	startup: function(){
		// summary:
		//		Called after a widget's children, and other widgets on the page, have been created.
		//		Provides an opportunity to manipulate any children before they are displayed.
		//		This is useful for composite widgets that need to control or layout sub-widgets.
		//		Many layout widgets can use this as a wiring phase.
		this._started = true;
	},

	//////////// DESTROY FUNCTIONS ////////////////////////////////

	destroyRecursive: function(/*Boolean?*/ preserveDom){
		// summary:
		// 		Destroy this widget and it's descendants. This is the generic
		// 		"destructor" function that all widget users should call to
		// 		cleanly discard with a widget. Once a widget is destroyed, it's
		// 		removed from the manager object.
		// preserveDom:
		//		If true, this method will leave the original Dom structure
		//		alone of descendant Widgets. Note: This will NOT work with
		//		dijit._Templated widgets.
		//
		this.destroyDescendants(preserveDom);
		this.destroy(preserveDom);
	},

	destroy: function(/*Boolean*/ preserveDom){
		// summary:
		// 		Destroy this widget, but not its descendants.
		//		Will, however, destroy internal widgets such as those used within a template.
		// preserveDom: Boolean
		//		If true, this method will leave the original Dom structure alone.
		//		Note: This will not yet work with _Templated widgets

		this.uninitialize();
		dojo.forEach(this._connects, function(array){
			dojo.forEach(array, dojo.disconnect);
		});

		// destroy widgets created as part of template, etc.
		dojo.forEach(this._supportingWidgets||[], function(w){ 
			if(w.destroy){
				w.destroy();
			}
		});
		
		this.destroyRendering(preserveDom);
		dijit.registry.remove(this.id);
	},

	destroyRendering: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Destroys the DOM nodes associated with this widget
		// preserveDom:
		//		If true, this method will leave the original Dom structure alone
		//		during tear-down. Note: this will not work with _Templated
		//		widgets yet. 
		
		if(this.bgIframe){
			this.bgIframe.destroy(preserveDom);
			delete this.bgIframe;
		}

		if(this.domNode){
			if(!preserveDom){
				dojo._destroyElement(this.domNode);
			}
			delete this.domNode;
		}

		if(this.srcNodeRef){
			if(!preserveDom){
				dojo._destroyElement(this.srcNodeRef);
			}
			delete this.srcNodeRef;
		}
	},

	destroyDescendants: function(/*Boolean?*/ preserveDom){
		// summary:
		//		Recursively destroy the children of this widget and their
		//		descendants.
		// preserveDom:
		//		If true, the preserveDom attribute is passed to all descendant
		//		widget's .destroy() method. Not for use with _Templated
		//		widgets.
		
		// TODO: should I destroy in the reverse order, to go bottom up?
		dojo.forEach(this.getDescendants(), function(widget){ 
			if(widget.destroy){
				widget.destroy(preserveDom);
			}
		});
	},


	uninitialize: function(){
		// summary:
		//		stub function. Override to implement custom widget tear-down
		//		behavior.
		return false;
	},

	////////////////// MISCELLANEOUS METHODS ///////////////////

	onFocus: function(){
		// summary:
		//		stub function. Override or connect to this method to receive
		//		notifications for when the widget moves into focus.
	},

	onBlur: function(){
		// summary:
		//		stub function. Override or connect to this method to receive
		//		notifications for when the widget moves out of focus.
	},

	_onFocus: function(e){
		this.onFocus();
	},

	_onBlur: function(){
		this.onBlur();
	},

	_onConnect: function(/*String*/ event){
		// summary:
		//		Called when someone connects to one of my handlers.
		//		"Turn on" that handler if it isn't active yet.
		if(event in this._deferredConnects){
			var mapNode = this[this._deferredConnects[event]||'domNode'];
			this.connect(mapNode, event.toLowerCase(), this[event]);
			delete this._deferredConnects[event];
		}
	},

	_setClassAttr: function(/*String*/ value){
		var mapNode = this[this.attributeMap["class"]||'domNode'];
		dojo.removeClass(mapNode, this["class"])
		this["class"] = value;
		dojo.addClass(mapNode, value);
	},

	_setStyleAttr: function(/*String*/ value){
		var mapNode = this[this.attributeMap["style"]||'domNode'];
		if(mapNode.style.cssText){
			// TODO: remove old value
			mapNode.style.cssText += "; " + value; // FIXME: Opera
		}else{
			mapNode.style.cssText = value;
		}
		this["style"] = value;
	},

	setAttribute: function(/*String*/ attr, /*anything*/ value){
		dojo.deprecated(this.declaredClass+"::setAttribute() is deprecated. Use attr() instead.", "", "2.0");
		this.attr(attr, value);
	},
	
	_attrToDom: function(/*String*/ attr, /*String*/ value){
		//	summary:
		//		Reflect a widget attribute (title, tabIndex, duration etc.) to
		//		the widget DOM, as specified in attributeMap.
		//
		//	description:
		//		Also sets this["attr"] to the new value.
		//		Note some attributes like "type"
		//		cannot be processed this way as they are not mutable.

		var commands = this.attributeMap[attr];
		dojo.forEach( dojo.isArray(commands) ? commands : [commands], function(command){

			// Get target node and what we are doing to that node
			var mapNode = this[command.node || command || "domNode"];	// DOM node
			var type = command.type || "attribute";	// class, innerHTML, or attribute
	
			switch(type){
				case "attribute":
					if(dojo.isFunction(value)){ // functions execute in the context of the widget
						value = dojo.hitch(this, value);
					}
					if(/^on[A-Z][a-zA-Z]*$/.test(attr)){ // eg. onSubmit needs to be onsubmit
						attr = attr.toLowerCase();
					}
					dojo.attr(mapNode, attr, value);
					break;
				case "innerHTML":
					mapNode.innerHTML = value;
					break;
				case "class":
					dojo.removeClass(mapNode, this[attr]);
					dojo.addClass(mapNode, value);
					break;
			}
		}, this);
		this[attr] = value;
	},

	attr: function(/*String|Object*/name, /*Object?*/value){
		//	summary:
		//		Set or get properties on a widget instance.
		//	name:
		//		The property to get or set. If an object is passed here and not
		//		a string, its keys are used as names of attributes to be set
		//		and the value of the object as values to set in the widget.
		//	value:
		//		Optional. If provided, attr() operates as a setter. If omitted,
		//		the current value of the named property is returned.
		//	description:
		//		Get or set named properties on a widget. If no value is
		//		provided, the current value of the attribute is returned,
		//		potentially via a getter method. If a value is provided, then
		//		the method acts as a setter, assigning the value to the name,
		//		potentially calling any explicitly provided setters to handle
		//		the operation. For instance, if the widget has properties "foo"
		//		and "bar" and a method named "_setFooAttr", calling:
		//	|	myWidget.attr("foo", "Howdy!");
		//		would be equivalent to calling:
		//	|	widget._setFooAttr("Howdy!");
		//		while calling:
		//	|	myWidget.attr("bar", "Howdy!");
		//		would be the same as writing:
		//	|	widget.bar = "Howdy!";
		//		It also tries to copy the changes to the widget's DOM according
		//		to settings in attributeMap (see description of attributeMap
		//		for details)
		//		For example, calling:
		//	|	myTitlePane.attr("title", "Howdy!");
		//		will do
		//	|	myTitlePane.title = "Howdy!";
		//	|	myTitlePane.title.innerHTML = "Howdy!";
		//		It works for dom node attributes too.  Calling
		//	|	widget.attr("disabled", true)
		//		will set the disabled attribute on the widget's focusNode,
		//		among other housekeeping for a change in disabled state.

		//	open questions:
		//		- how to handle build shortcut for attributes which want to map
		//		into DOM attributes?
		//		- what relationship should setAttribute()/attr() have to
		//		layout() calls?
		var args = arguments.length;
		if(args == 1 && !dojo.isString(name)){
			for(var x in name){ this.attr(x, name[x]); }
			return this;
		}
		var names = this._getAttrNames(name);
		if(args == 2){ // setter
			if(this[names.s]){
				// use the explicit setter
				return this[names.s](value) || this;
			}else{
				// if param is specified as DOM node attribute, copy it
				if(name in this.attributeMap){
					this._attrToDom(name, value);
				}

				// FIXME: what about function assignments? Any way to connect() here?
				this[name] = value;
			}
			return this;
		}else{ // getter
			if(this[names.g]){
				return this[names.g]();
			}else{
				return this[name];
			}
		}
	},

	_attrPairNames: {},		// shared between all widgets
	_getAttrNames: function(name){
		// summary: helper function for Widget.attr()
		// cache attribute name values so we don't do the string ops every time
		var apn = this._attrPairNames;
		if(apn[name]){ return apn[name]; }
		var uc = name.charAt(0).toUpperCase() + name.substr(1);
		return apn[name] = {
			n: name+"Node",
			s: "_set"+uc+"Attr",
			g: "_get"+uc+"Attr"
		};
	},

	toString: function(){
		// summary:
		//		returns a string that represents the widget. When a widget is
		//		cast to a string, this method will be used to generate the
		//		output. Currently, it does not implement any sort of reversable
		//		serialization.
		return '[Widget ' + this.declaredClass + ', ' + (this.id || 'NO ID') + ']'; // String
	},

	getDescendants: function(){
		// summary:
		//		Returns all the widgets that contained by this, i.e., all widgets underneath this.containerNode.
		// description:
		//		This method is designed to *not* return widgets that are, for example,
		//		used as part of a template, but rather to just return widgets that are defined in the
		//		original markup as descendants of this widget, for example w/this markup:
		//
		//		|	<div dojoType=myWidget>
		//		|		<b> hello world </b>
		//		|		<div>
		//		|			<span dojoType=subwidget>
		//		|				<span dojoType=subwidget2>how's it going?</span>
		//		|			</span>
		//		|		</div>
		//		|	</div>
		//
		//		getDescendants() will return subwidget, but not anything that's part of the template
		//		of myWidget.

		if(this.containerNode){
			var list = dojo.query('[widgetId]', this.containerNode);
			return list.map(dijit.byNode);		// Array
		}else{
			return [];
		}
	},

	// TODOC
	nodesWithKeyClick: ["input", "button"],

	connect: function(
			/*Object|null*/ obj,
			/*String|Function*/ event,
			/*String|Function*/ method){
		//	summary:
		//		Connects specified obj/event to specified method of this object
		//		and registers for disconnect() on widget destroy.
		//	description:
		//		Provide widget-specific analog to dojo.connect, except with the
		//		implicit use of this widget as the target object.
		//		This version of connect also provides a special "ondijitclick"
		//		event which triggers on a click or space-up, enter-down in IE
		//		or enter press in FF (since often can't cancel enter onkeydown
		//		in FF)
		//	example:
		//	|	var btn = new dijit.form.Button();
		//	|	// when foo.bar() is called, call the listener we're going to
		//	|	// provide in the scope of btn
		//	|	btn.connect(foo, "bar", function(){ 
		//	|		console.debug(this.toString());
		//	|	});

		var d = dojo;
		var dco = d.hitch(d, "connect", obj);
		var handles =[];
		if(event == "ondijitclick"){
			// add key based click activation for unsupported nodes.
			if(!this.nodesWithKeyClick[obj.nodeName]){
				var m = d.hitch(this, method);
				handles.push(
					dco("onkeydown", this, function(e){
						if(!d.isFF && e.keyCode == d.keys.ENTER){
							return m(e);
						}else if(e.keyCode == d.keys.SPACE){
							// stop space down as it causes IE to scroll
							// the browser window
							d.stopEvent(e);
						}
			 		}),
					dco("onkeyup", this, function(e){
						if(e.keyCode == d.keys.SPACE){ return m(e); }
					})
				);
			 	if(d.isFF){
					handles.push(
						dco("onkeypress", this, function(e){
							if(e.keyCode == d.keys.ENTER){ return m(e); }
						})
					);
			 	}
			}
			event = "onclick";
		}
		handles.push(dco(event, this, method));

		// return handles for FormElement and ComboBox
		this._connects.push(handles);
		return handles;
	},

	disconnect: function(/*Object*/ handles){
		// summary:
		//		Disconnects handle created by this.connect.
		//		Also removes handle from this widget's list of connects
		for(var i=0; i<this._connects.length; i++){
			if(this._connects[i]==handles){
				dojo.forEach(handles, dojo.disconnect);
				this._connects.splice(i, 1);
				return;
			}
		}
	},

	isLeftToRight: function(){
		// summary:
		//		Checks the page for text direction
		return dojo._isBodyLtr(); //Boolean
	},

	isFocusable: function(){
		// summary:
		//		Return true if this widget can currently be focused
		//		and false if not
		return this.focus && (dojo.style(this.domNode, "display") != "none");
	},
	
	placeAt: function(/* String|DomNode|_Widget */reference, /* String?|Int? */position){
		// summary: Place this widget's domNode reference somewhere in the DOM based
		//		on standard dojo.place conventions, or passing a Widget reference that
		//		contains and addChild member.
		//
		// description:
		//		A convenience function provided in all _Widgets, providing a simple
		//		shorthand mechanism to put an existing (or newly created) Widget
		//		somewhere in the dom, and allow chaining.
		//
		//	reference: 
		//		The String id of a domNode, a domNode reference, or a reference to a Widget posessing 
		//		an addChild method.
		//
		//	position: 
		//		If passed a string or domNode reference, the position argument
		//		accepts a string just as dojo.place does, one of: "first", "last", 
		//		"before", or "after". 
		//
		//		If passed a _Widget reference, and that widget reference has an ".addChild" method, 
		//		it will be called passing this widget instance into that method, supplying the optional
		//		position index passed.
		//
		// example:
		// | 	// create a Button with no srcNodeRef, and place it in the body:
		// | 	var button = new dijit.form.Button({ label:"click" }).placeAt(dojo.body());
		// | 	// now, 'button' is still the widget reference to the newly created button
		// | 	dojo.connect(button, "onClick", function(e){ console.log('click'); });
		//
		// example:
		// |	// create a button out of a node with id="src" and append it to id="wrapper":
		// | 	var button = new dijit.form.Button({},"src").placeAt("wrapper");
		//
		// example:
		// |	// place a new button as the first element of some div
		// |	var button = new dijit.form.Button({ label:"click" }).placeAt("wrapper","first");
		//
		// example: 
		// |	// create a contentpane and add it to a TabContainer
		// |	var tc = dijit.byId("myTabs");
		// |	new dijit.layout.ContentPane({ href:"foo.html", title:"Wow!" }).placeAt(tc)

		if(reference["declaredClass"] && reference["addChild"]){
			reference.addChild(this, position);
		}else{
			dojo.place(this.domNode, reference, position);
		}
		return this;
	}

});

})();

}

if(!dojo._hasResource["dijit._Container"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Container"] = true;
dojo.provide("dijit._Container");

dojo.declare("dijit._Contained",
	null,
	{
		// summary
		//		Mixin for widgets that are children of a container widget
		//
		// example:
		// | 	// make a basic custom widget that knows about it's parents
		// |	dojo.declare("my.customClass",[dijit._Widget,dijit._Contained],{});
		// 
		getParent: function(){
			// summary:
			//		Returns the parent widget of this widget, assuming the parent
			//		implements dijit._Container
			for(var p=this.domNode.parentNode; p; p=p.parentNode){
				var id = p.getAttribute && p.getAttribute("widgetId");
				if(id){
					var parent = dijit.byId(id);
					return parent.isContainer ? parent : null;
				}
			}
			return null;
		},

		_getSibling: function(which){
			var node = this.domNode;
			do{
				node = node[which+"Sibling"];
			}while(node && node.nodeType != 1);
			if(!node){ return null; } // null
			var id = node.getAttribute("widgetId");
			return dijit.byId(id);
		},

		getPreviousSibling: function(){
			// summary:
			//		Returns null if this is the first child of the parent,
			//		otherwise returns the next element sibling to the "left".

			return this._getSibling("previous"); // Mixed
		},

		getNextSibling: function(){
			// summary:
			//		Returns null if this is the last child of the parent,
			//		otherwise returns the next element sibling to the "right".

			return this._getSibling("next"); // Mixed
		},
		
		getIndexInParent: function(){
			// summary:
			//		Returns the index of this widget within its container parent.
			//		It returns -1 if the parent does not exist, or if the parent
			//		is not a dijit._Container
			
			var p = this.getParent();
			if(!p || !p.getIndexOfChild){
				return -1; // int
			}
			return p.getIndexOfChild(this); // int
		}
	}
);

dojo.declare("dijit._Container",
	null,
	{
		// summary:
		//		Mixin for widgets that contain a set of widget children.
		// description:
		//		Use this mixin for widgets that needs to know about and
		//		keep track of their widget children. Suitable for widgets like BorderContainer
		//		and TabContainer which contain (only) a set of child widgets.
		//
		//		It's not suitable for widgets like ContentPane
		//		which contains mixed HTML (plain DOM nodes in addition to widgets),
		//		and where contained widgets are not necessarily directly below
		//		this.containerNode.   In that case calls like addChild(node, position)
		//		wouldn't make sense.

		// isContainer: Boolean
		//		Just a flag indicating that this widget descends from dijit._Container
		isContainer: true,

		buildRendering: function(){
			this.inherited(arguments);
			if(!this.containerNode){
				// all widgets with descendants must set containerNode
   				this.containerNode = this.domNode;
			}
		},

		addChild: function(/*Widget*/ widget, /*int?*/ insertIndex){
			// summary:
			//		Makes the given widget a child of this widget.
			// description:
			//		Inserts specified child widget's dom node as a child of this widget's
			//		container node, and possibly does otherprocessing (such as layout).

			var refNode = this.containerNode;
			if(insertIndex && typeof insertIndex == "number"){
				var children = dojo.query("> [widgetId]", refNode);
				if(children && children.length >= insertIndex){
					refNode = children[insertIndex-1];
					insertIndex = "after";
				}
			}
			dojo.place(widget.domNode, refNode, insertIndex);

			// If I've been started but the child widget hasn't been started,
			// start it now.  Make sure to do this after widget has been
			// inserted into the DOM tree, so it can see that it's being controlled by me,
			// so it doesn't try to size itself.
			if(this._started && !widget._started){
				widget.startup();
			}
		},

		removeChild: function(/*Widget or int*/ widget){
			// summary:
			//		Removes the passed widget instance from this widget but does
			//		not destroy it.  You can also pass in an integer indicating
			//		the index within the container to remove
			if(typeof widget == "number" && widget > 0){
				widget = this.getChildren()[widget];
			}
			// If we cannot find the widget, just return
			if(!widget || !widget.domNode){ return; }
			
			var node = widget.domNode;
			node.parentNode.removeChild(node);	// detach but don't destroy
		},

		_nextElement: function(node){
			do{
				node = node.nextSibling;
			}while(node && node.nodeType != 1);
			return node;
		},

		_firstElement: function(node){
			node = node.firstChild;
			if(node && node.nodeType != 1){
				node = this._nextElement(node);
			}
			return node;
		},

		getChildren: function(){
			// summary:
			//		Returns array of children widgets.
			// description:
			//		Returns the widgets that are directly under this.containerNode.
			return dojo.query("> [widgetId]", this.containerNode).map(dijit.byNode); // Widget[]
		},

		hasChildren: function(){
			// summary:
			//		Returns true if widget has children, i.e. if this.containerNode contains something.
			return !!this._firstElement(this.containerNode); // Boolean
		},

		destroyDescendants: function(/*Boolean*/ preserveDom){
			dojo.forEach(this.getChildren(), function(child){ child.destroyRecursive(preserveDom); });
		},
	
		_getSiblingOfChild: function(/*Widget*/ child, /*int*/ dir){
			// summary:
			//		Get the next or previous widget sibling of child
			// dir:
			//		if 1, get the next sibling
			//		if -1, get the previous sibling
			var node = child.domNode;
			var which = (dir>0 ? "nextSibling" : "previousSibling");
			do{
				node = node[which];
			}while(node && (node.nodeType != 1 || !dijit.byNode(node)));
			return node ? dijit.byNode(node) : null;
		},
		
		getIndexOfChild: function(/*Widget*/ child){
			// summary:
			//		Gets the index of the child in this container or -1 if not found
			var children = this.getChildren();
			for(var i=0, c; c=children[i]; i++){
				if(c == child){ 
					return i; // int
				}
			}
			return -1; // int
		}
	}
);

dojo.declare("dijit._KeyNavContainer",
	[dijit._Container],
	{

		// summary: A _Container with keyboard navigation of its children.
		// decscription:
		//		To use this mixin, call connectKeyNavHandlers() in
		//		postCreate() and call startupKeyNavChildren() in startup().
		//		It provides normalized keyboard and focusing code for Container
		//		widgets.
/*=====
		// focusedChild: Widget
		//		The currently focused child widget, or null if there isn't one
		focusedChild: null,
=====*/

		_keyNavCodes: {},

		connectKeyNavHandlers: function(/*Array*/ prevKeyCodes, /*Array*/ nextKeyCodes){
			// summary:
			//		Call in postCreate() to attach the keyboard handlers
			//		to the container.
			// preKeyCodes: Array
			//		Key codes for navigating to the previous child.
			// nextKeyCodes: Array
			//		Key codes for navigating to the next child.

			var keyCodes = this._keyNavCodes = {};
			var prev = dojo.hitch(this, this.focusPrev);
			var next = dojo.hitch(this, this.focusNext);
			dojo.forEach(prevKeyCodes, function(code){ keyCodes[code] = prev });
			dojo.forEach(nextKeyCodes, function(code){ keyCodes[code] = next });
			this.connect(this.domNode, "onkeypress", "_onContainerKeypress");
			this.connect(this.domNode, "onfocus", "_onContainerFocus");
		},

		startupKeyNavChildren: function(){
			// summary:
			//		Call in startup() to set child tabindexes to -1
			dojo.forEach(this.getChildren(), dojo.hitch(this, "_startupChild"));
		},

		addChild: function(/*Widget*/ widget, /*int?*/ insertIndex){
			// summary: Add a child to our _Container
			dijit._KeyNavContainer.superclass.addChild.apply(this, arguments);
			this._startupChild(widget);
		},

		focus: function(){
			// summary: Default focus() implementation: focus the first child.
			this.focusFirstChild();
		},

		focusFirstChild: function(){
			// summary: Focus the first focusable child in the container.
			this.focusChild(this._getFirstFocusableChild());
		},

		focusNext: function(){
			// summary: Focus the next widget or focal node (for widgets
			//		with multiple focal nodes) within this container.
			if(this.focusedChild && this.focusedChild.hasNextFocalNode
					&& this.focusedChild.hasNextFocalNode()){
				this.focusedChild.focusNext();
				return;
			}
			var child = this._getNextFocusableChild(this.focusedChild, 1);
			if(child.getFocalNodes){
				this.focusChild(child, child.getFocalNodes()[0]);
			}else{
				this.focusChild(child);
			}
		},

		focusPrev: function(){
			// summary: Focus the previous widget or focal node (for widgets
			//		with multiple focal nodes) within this container.
			if(this.focusedChild && this.focusedChild.hasPrevFocalNode
					&& this.focusedChild.hasPrevFocalNode()){
				this.focusedChild.focusPrev();
				return;
			}
			var child = this._getNextFocusableChild(this.focusedChild, -1);
			if(child.getFocalNodes){
				var nodes = child.getFocalNodes();
				this.focusChild(child, nodes[nodes.length-1]);
			}else{
				this.focusChild(child);
			}
		},

		focusChild: function(/*Widget*/ widget, /*Node?*/ node){
			// summary: Focus widget. Optionally focus 'node' within widget.
			if(widget){
				if(this.focusedChild && widget !== this.focusedChild){
					this._onChildBlur(this.focusedChild);
				}
				this.focusedChild = widget;
				if(node && widget.focusFocalNode){
					widget.focusFocalNode(node);
				}else{
					widget.focus();
				}
			}
		},

		_startupChild: function(/*Widget*/ widget){
			// summary:
			//		Set tabindex="-1" on focusable widgets so that we
			// 		can focus them programmatically and by clicking.
			//		Connect focus and blur handlers.
			if(widget.getFocalNodes){
				dojo.forEach(widget.getFocalNodes(), function(node){
					dojo.attr(node, "tabindex", -1);
					this._connectNode(node);
				}, this);
			}else{
				var node = widget.focusNode || widget.domNode;
				if(widget.isFocusable()){
					dojo.attr(node, "tabindex", -1);
				}
				this._connectNode(node);
			}
		},

		_connectNode: function(/*Element*/ node){
			this.connect(node, "onfocus", "_onNodeFocus");
			this.connect(node, "onblur", "_onNodeBlur");
		},

		_onContainerFocus: function(evt){
			// focus bubbles on Firefox,
			// so just make sure that focus has really gone to the container
			if(evt.target === this.domNode){
				this.focusFirstChild();
			}
		},

		_onContainerKeypress: function(evt){
			if(evt.ctrlKey || evt.altKey){ return; }
			var func = this._keyNavCodes[evt.charOrCode];
			if(func){
				func();
				dojo.stopEvent(evt);
			}
		},

		_onNodeFocus: function(evt){
			// while focus is on a child,
			// take the container out of the tab order so that
			// we can shift-tab to the element before the container
			dojo.attr(this.domNode, "tabindex", -1);
			// record the child that has been focused
			var widget = dijit.getEnclosingWidget(evt.target);
			if(widget && widget.isFocusable()){
				this.focusedChild = widget;
			}
			dojo.stopEvent(evt);
		},

		_onNodeBlur: function(evt){
			// when focus leaves a child,
			// reinstate the container's tabindex
			if(this.tabIndex){
				dojo.attr(this.domNode, "tabindex", this.tabIndex);
			}
			dojo.stopEvent(evt);
		},

		_onChildBlur: function(/*Widget*/ widget){
			// summary:
			//		Called when focus leaves a child widget to go
			//		to a sibling widget.
		},

		_getFirstFocusableChild: function(){
			return this._getNextFocusableChild(null, 1);
		},

		_getNextFocusableChild: function(child, dir){
			if(child){
				child = this._getSiblingOfChild(child, dir);
			}
			var children = this.getChildren();
			for(var i=0; i < children.length; i++){
				if(!child){
					child = children[(dir>0) ? 0 : (children.length-1)];
				}
				if(child.isFocusable()){
					return child;
				}
				child = this._getSiblingOfChild(child, dir);
			}
			// no focusable child found
			return null;
		}
	}
);

}

if(!dojo._hasResource["dijit.layout._LayoutWidget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout._LayoutWidget"] = true;
dojo.provide("dijit.layout._LayoutWidget");




dojo.declare("dijit.layout._LayoutWidget",
	[dijit._Widget, dijit._Container, dijit._Contained],
	{
		// summary
		//		Mixin for widgets that contain a list of children like SplitContainer.
		//		Widgets which mixin this code must define layout() to lay out the children

		// baseClass: String
		//		This class name is applied to the widget's domNode
		//		and also may be used to generate names for sub nodes,
		//		like for example dijitTabContainer-content.
		baseClass: "dijitLayoutContainer",

		isLayoutContainer: true,

		postCreate: function(){
			dojo.addClass(this.domNode, "dijitContainer");
			dojo.addClass(this.domNode, this.baseClass);
		},

		startup: function(){
			// summary:
			//		Called after all the widgets have been instantiated and their
			//		dom nodes have been inserted somewhere under dojo.doc.body.
			//
			//		Widgets should override this method to do any initialization
			//		dependent on other widgets existing, and then call
			//		this superclass method to finish things off.
			//
			//		startup() in subclasses shouldn't do anything
			//		size related because the size of the widget hasn't been set yet.

			if(this._started){ return; }

			dojo.forEach(this.getChildren(), function(child){ child.startup(); });

			// If I am a top level widget
			if(!this.getParent || !this.getParent()){
				// Do recursive sizing and layout of all my descendants
				// (passing in no argument to resize means that it has to glean the size itself)
				this.resize();

				// since my parent isn't a layout container, and my style is width=height=100% (or something similar),
				// then I need to watch when the window resizes, and size myself accordingly
				// (passing in no argument to resize means that it has to glean the size itself)
				this.connect(dojo.global, 'onresize', 'resize');
			}
			
			this.inherited(arguments);
		},

		resize: function(changeSize, resultSize){
			// summary:
			//		Call this to resize a widget, or after it's size has changed.
			// description:
			//		Change size mode:
			//			When changeSize is specified, changes the marginBox of this widget
			//			 and forces it to relayout it's contents accordingly.
			//			changeSize may specify height, width, or both.
			//
			//			If resultSize is specified it indicates the size the widget will
			//			become after changeSize has been applied.
			//
			//		Notification mode:
			//			When changeSize is null, indicates that the caller has already changed
			//			the size of the widget, or perhaps it changed because the browser
			//			window was resized.  Tells widget to relayout it's contents accordingly.
			//
			//			If resultSize is also specified it indicates the size the widget has
			//			become.
			//
			//		In either mode, this method also:
			//			1. Sets this._borderBox and this._contentBox to the new size of
			//				the widget.  Queries the current domNode size if necessary.
			//			2. Calls layout() to resize contents (and maybe adjust child widgets).	
			//
			// changeSize: Object?
			//		Sets the widget to this margin-box size and position.
			//		May include any/all of the following properties:
			//	|	{w: int, h: int, l: int, t: int}
			//
			// resultSize: Object?
			//		The margin-box size of this widget after applying changeSize (if 
			//		changeSize is specified).  If caller knows this size and
			//		passes it in, we don't need to query the browser to get the size.
			//	|	{w: int, h: int}

			var node = this.domNode;

			// set margin box size, unless it wasn't specified, in which case use current size
			if(changeSize){
				dojo.marginBox(node, changeSize);

				// set offset of the node
				if(changeSize.t){ node.style.top = changeSize.t + "px"; }
				if(changeSize.l){ node.style.left = changeSize.l + "px"; }
			}

			// If either height or width wasn't specified by the user, then query node for it.
			// But note that setting the margin box and then immediately querying dimensions may return
			// inaccurate results, so try not to depend on it.
			var mb = resultSize || {};
			dojo.mixin(mb, changeSize || {});	// changeSize overrides resultSize
			if ( !("h" in mb) || !("w" in mb) ){
				mb = dojo.mixin(dojo.marginBox(node), mb);	// just use dojo.marginBox() to fill in missing values
			}

			// Compute and save the size of my border box and content box
			// (w/out calling dojo.contentBox() since that may fail if size was recently set)
			var cs = dojo.getComputedStyle(node);
			var me = dojo._getMarginExtents(node, cs);
			var be = dojo._getBorderExtents(node, cs);
			var bb = this._borderBox = {
				w: mb.w - (me.w + be.w),
				h: mb.h - (me.h + be.h)
			};
			var pe = dojo._getPadExtents(node, cs);
			this._contentBox = {
				l: dojo._toPixelValue(node, cs.paddingLeft),
				t: dojo._toPixelValue(node, cs.paddingTop),
				w: bb.w - pe.w,
				h: bb.h - pe.h
			};

			// Callback for widget to adjust size of it's children
			this.layout();
		},

		layout: function(){
			//	summary
			//		Widgets override this method to size & position their contents/children.
			//		When this is called this._contentBox is guaranteed to be set (see resize()).
			//
			//		This is called after startup(), and also when the widget's size has been
			//		changed.
		},

		_setupChild: function(/*Widget*/child){
			// summary: common setup for initial children or children which are added after startup
			if(child.baseClass){
				dojo.addClass(child.domNode, this.baseClass+"-"+child.baseClass);
			}
		},

		addChild: function(/*Widget*/ child, /*Integer?*/ insertIndex){
			this.inherited(arguments);
			if(this._started){
				this._setupChild(child);
			}
		},

		removeChild: function(/*Widget*/ child){
			if(child.baseClass){
				dojo.removeClass(child.domNode, this.baseClass+"-"+child.baseClass);
			}
			this.inherited(arguments);
		}
	}
);

dijit.layout.marginBox2contentBox = function(/*DomNode*/ node, /*Object*/ mb){
	// summary:
	//		Given the margin-box size of a node, return it's content box size.
	//		Functions like dojo.contentBox() but is more reliable since it doesn't have
	//		to wait for the browser to compute sizes.
	var cs = dojo.getComputedStyle(node);
	var me = dojo._getMarginExtents(node, cs);
	var pb = dojo._getPadBorderExtents(node, cs);
	return {
		l: dojo._toPixelValue(node, cs.paddingLeft),
		t: dojo._toPixelValue(node, cs.paddingTop),
		w: mb.w - (me.w + pb.w),
		h: mb.h - (me.h + pb.h)
	};
};

(function(){
	var capitalize = function(word){
		return word.substring(0,1).toUpperCase() + word.substring(1);
	};

	var size = function(widget, dim){
		// size the child
		widget.resize ? widget.resize(dim) : dojo.marginBox(widget.domNode, dim);

		// record child's size, but favor our own numbers when we have them.
		// the browser lies sometimes
		dojo.mixin(widget, dojo.marginBox(widget.domNode));
		dojo.mixin(widget, dim);
	};

	dijit.layout.layoutChildren = function(/*DomNode*/ container, /*Object*/ dim, /*Object[]*/ children){
		/**
		 * summary
		 *		Layout a bunch of child dom nodes within a parent dom node
		 * container:
		 *		parent node
		 * dim:
		 *		{l, t, w, h} object specifying dimensions of container into which to place children
		 * children:
		 *		an array like [ {domNode: foo, layoutAlign: "bottom" }, {domNode: bar, layoutAlign: "client"} ]
		 */

		// copy dim because we are going to modify it
		dim = dojo.mixin({}, dim);

		dojo.addClass(container, "dijitLayoutContainer");

		// Move "client" elements to the end of the array for layout.  a11y dictates that the author
		// needs to be able to put them in the document in tab-order, but this algorithm requires that
		// client be last.
		children = dojo.filter(children, function(item){ return item.layoutAlign != "client"; })
			.concat(dojo.filter(children, function(item){ return item.layoutAlign == "client"; }));

		// set positions/sizes
		dojo.forEach(children, function(child){
			var elm = child.domNode,
				pos = child.layoutAlign;

			// set elem to upper left corner of unused space; may move it later
			var elmStyle = elm.style;
			elmStyle.left = dim.l+"px";
			elmStyle.top = dim.t+"px";
			elmStyle.bottom = elmStyle.right = "auto";

			dojo.addClass(elm, "dijitAlign" + capitalize(pos));

			// set size && adjust record of remaining space.
			// note that setting the width of a <div> may affect it's height.
			if(pos == "top" || pos == "bottom"){
				size(child, { w: dim.w });
				dim.h -= child.h;
				if(pos=="top"){
					dim.t += child.h;
				}else{
					elmStyle.top = dim.t + dim.h + "px";
				}
			}else if(pos == "left" || pos == "right"){
				size(child, { h: dim.h });
				dim.w -= child.w;
				if(pos == "left"){
					dim.l += child.w;
				}else{
					elmStyle.left = dim.l + dim.w + "px";
				}
			}else if(pos == "client"){
				size(child, dim);
			}
		});
	};

})();

}

if(!dojo._hasResource["dojo.date.stamp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date.stamp"] = true;
dojo.provide("dojo.date.stamp");

// Methods to convert dates to or from a wire (string) format using well-known conventions

dojo.date.stamp.fromISOString = function(/*String*/formattedString, /*Number?*/defaultTime){
	//	summary:
	//		Returns a Date object given a string formatted according to a subset of the ISO-8601 standard.
	//
	//	description:
	//		Accepts a string formatted according to a profile of ISO8601 as defined by
	//		[RFC3339](http://www.ietf.org/rfc/rfc3339.txt), except that partial input is allowed.
	//		Can also process dates as specified [by the W3C](http://www.w3.org/TR/NOTE-datetime)
	//		The following combinations are valid:
	//
	//			* dates only
	//			|	* yyyy
	//			|	* yyyy-MM
	//			|	* yyyy-MM-dd
	// 			* times only, with an optional time zone appended
	//			|	* THH:mm
	//			|	* THH:mm:ss
	//			|	* THH:mm:ss.SSS
	// 			* and "datetimes" which could be any combination of the above
	//
	//		timezones may be specified as Z (for UTC) or +/- followed by a time expression HH:mm
	//		Assumes the local time zone if not specified.  Does not validate.  Improperly formatted
	//		input may return null.  Arguments which are out of bounds will be handled
	// 		by the Date constructor (e.g. January 32nd typically gets resolved to February 1st)
	//		Only years between 100 and 9999 are supported.
	//
  	//	formattedString:
	//		A string such as 2005-06-30T08:05:00-07:00 or 2005-06-30 or T08:05:00
	//
	//	defaultTime:
	//		Used for defaults for fields omitted in the formattedString.
	//		Uses 1970-01-01T00:00:00.0Z by default.

	if(!dojo.date.stamp._isoRegExp){
		dojo.date.stamp._isoRegExp =
//TODO: could be more restrictive and check for 00-59, etc.
			/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
	}

	var match = dojo.date.stamp._isoRegExp.exec(formattedString);
	var result = null;

	if(match){
		match.shift();
		if(match[1]){match[1]--;} // Javascript Date months are 0-based
		if(match[6]){match[6] *= 1000;} // Javascript Date expects fractional seconds as milliseconds

		if(defaultTime){
			// mix in defaultTime.  Relatively expensive, so use || operators for the fast path of defaultTime === 0
			defaultTime = new Date(defaultTime);
			dojo.map(["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds", "Milliseconds"], function(prop){
				return defaultTime["get" + prop]();
			}).forEach(function(value, index){
				if(match[index] === undefined){
					match[index] = value;
				}
			});
		}
		result = new Date(match[0]||1970, match[1]||0, match[2]||1, match[3]||0, match[4]||0, match[5]||0, match[6]||0);
//		result.setFullYear(match[0]||1970); // for year < 100

		var offset = 0;
		var zoneSign = match[7] && match[7].charAt(0);
		if(zoneSign != 'Z'){
			offset = ((match[8] || 0) * 60) + (Number(match[9]) || 0);
			if(zoneSign != '-'){ offset *= -1; }
		}
		if(zoneSign){
			offset -= result.getTimezoneOffset();
		}
		if(offset){
			result.setTime(result.getTime() + offset * 60000);
		}
	}

	return result; // Date or null
}

/*=====
	dojo.date.stamp.__Options = function(){
		//	selector: String
		//		"date" or "time" for partial formatting of the Date object.
		//		Both date and time will be formatted by default.
		//	zulu: Boolean
		//		if true, UTC/GMT is used for a timezone
		//	milliseconds: Boolean
		//		if true, output milliseconds
		this.selector = selector;
		this.zulu = zulu;
		this.milliseconds = milliseconds;
	}
=====*/

dojo.date.stamp.toISOString = function(/*Date*/dateObject, /*dojo.date.stamp.__Options?*/options){
	//	summary:
	//		Format a Date object as a string according a subset of the ISO-8601 standard
	//
	//	description:
	//		When options.selector is omitted, output follows [RFC3339](http://www.ietf.org/rfc/rfc3339.txt)
	//		The local time zone is included as an offset from GMT, except when selector=='time' (time without a date)
	//		Does not check bounds.  Only years between 100 and 9999 are supported.
	//
	//	dateObject:
	//		A Date object

	var _ = function(n){ return (n < 10) ? "0" + n : n; };
	options = options || {};
	var formattedDate = [];
	var getter = options.zulu ? "getUTC" : "get";
	var date = "";
	if(options.selector != "time"){
		var year = dateObject[getter+"FullYear"]();
		date = ["0000".substr((year+"").length)+year, _(dateObject[getter+"Month"]()+1), _(dateObject[getter+"Date"]())].join('-');
	}
	formattedDate.push(date);
	if(options.selector != "date"){
		var time = [_(dateObject[getter+"Hours"]()), _(dateObject[getter+"Minutes"]()), _(dateObject[getter+"Seconds"]())].join(':');
		var millis = dateObject[getter+"Milliseconds"]();
		if(options.milliseconds){
			time += "."+ (millis < 100 ? "0" : "") + _(millis);
		}
		if(options.zulu){
			time += "Z";
		}else if(options.selector != "time"){
			var timezoneOffset = dateObject.getTimezoneOffset();
			var absOffset = Math.abs(timezoneOffset);
			time += (timezoneOffset > 0 ? "-" : "+") + 
				_(Math.floor(absOffset/60)) + ":" + _(absOffset%60);
		}
		formattedDate.push(time);
	}
	return formattedDate.join('T'); // String
}

}

if(!dojo._hasResource["dojo.parser"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.parser"] = true;
dojo.provide("dojo.parser");


dojo.parser = new function(){
	// summary: The Dom/Widget parsing package

	var d = dojo;
	var dtName = d._scopeName + "Type";
	var qry = "[" + dtName + "]";

	function val2type(/*Object*/ value){
		// summary:
		//		Returns name of type of given value.

		if(d.isString(value)){ return "string"; }
		if(typeof value == "number"){ return "number"; }
		if(typeof value == "boolean"){ return "boolean"; }
		if(d.isFunction(value)){ return "function"; }
		if(d.isArray(value)){ return "array"; } // typeof [] == "object"
		if(value instanceof Date) { return "date"; } // assume timestamp
		if(value instanceof d._Url){ return "url"; }
		return "object";
	}

	function str2obj(/*String*/ value, /*String*/ type){
		// summary:
		//		Convert given string value to given type
		switch(type){
			case "string":
				return value;
			case "number":
				return value.length ? Number(value) : NaN;
			case "boolean":
				// for checked/disabled value might be "" or "checked".  interpret as true.
				return typeof value == "boolean" ? value : !(value.toLowerCase()=="false");
			case "function":
				if(d.isFunction(value)){
					// IE gives us a function, even when we say something like onClick="foo"
					// (in which case it gives us an invalid function "function(){ foo }"). 
					//  Therefore, convert to string
					value=value.toString();
					value=d.trim(value.substring(value.indexOf('{')+1, value.length-1));
				}
				try{
					if(value.search(/[^\w\.]+/i) != -1){
						// TODO: "this" here won't work
						value = d.parser._nameAnonFunc(new Function(value), this);
					}
					return d.getObject(value, false);
				}catch(e){ return new Function(); }
			case "array":
				return value ? value.split(/\s*,\s*/) : [];
			case "date":
				switch(value){
					case "": return new Date("");	// the NaN of dates
					case "now": return new Date();	// current date
					default: return d.date.stamp.fromISOString(value);
				}
			case "url":
				return d.baseUrl + value;
			default:
				return d.fromJson(value);
		}
	}

	var instanceClasses = {
		// map from fully qualified name (like "dijit.Button") to structure like
		// { cls: dijit.Button, params: {label: "string", disabled: "boolean"} }
	};
	
	function getClassInfo(/*String*/ className){
		// className:
		//		fully qualified name (like "dijit.Button")
		// returns:
		//		structure like
		//			{ 
		//				cls: dijit.Button, 
		//				params: { label: "string", disabled: "boolean"}
		//			}

		if(!instanceClasses[className]){
			// get pointer to widget class
			var cls = d.getObject(className);
			if(!d.isFunction(cls)){
				throw new Error("Could not load class '" + className +
					"'. Did you spell the name correctly and use a full path, like 'dijit.form.Button'?");
			}
			var proto = cls.prototype;
	
			// get table of parameter names & types
			var params={};
			for(var name in proto){
				if(name.charAt(0)=="_"){ continue; } 	// skip internal properties
				var defVal = proto[name];
				params[name]=val2type(defVal);
			}

			instanceClasses[className] = { cls: cls, params: params };
		}
		return instanceClasses[className];
	}

	this._functionFromScript = function(script){
		var preamble = "";
		var suffix = "";
		var argsStr = script.getAttribute("args");
		if(argsStr){
			d.forEach(argsStr.split(/\s*,\s*/), function(part, idx){
				preamble += "var "+part+" = arguments["+idx+"]; ";
			});
		}
		var withStr = script.getAttribute("with");
		if(withStr && withStr.length){
			d.forEach(withStr.split(/\s*,\s*/), function(part){
				preamble += "with("+part+"){";
				suffix += "}";
			});
		}
		return new Function(preamble+script.innerHTML+suffix);
	}

	this.instantiate = function(/* Array */nodes){
		// summary:
		//		Takes array of nodes, and turns them into class instances and
		//		potentially calls a layout method to allow them to connect with
		//		any children		
		var thelist = [];
		d.forEach(nodes, function(node){
			if(!node){ return; }
			var type = node.getAttribute(dtName);
			if((!type)||(!type.length)){ return; }
			var clsInfo = getClassInfo(type);
			var clazz = clsInfo.cls;
			var ps = clazz._noScript||clazz.prototype._noScript;

			// read parameters (ie, attributes).
			// clsInfo.params lists expected params like {"checked": "boolean", "n": "number"}
			var params = {};
			var attributes = node.attributes;
			for(var name in clsInfo.params){
				var item = attributes.getNamedItem(name);
				if(!item || (!item.specified && (!dojo.isIE || name.toLowerCase()!="value"))){ continue; }
				var value = item.value;
				// Deal with IE quirks for 'class' and 'style'
				switch(name){
				case "class":
					value = node.className;
					break;
				case "style":
					value = node.style && node.style.cssText; // FIXME: Opera?
				}
				var _type = clsInfo.params[name];
				params[name] = str2obj(value, _type);
			}

			// Process <script type="dojo/*"> script tags
			// <script type="dojo/method" event="foo"> tags are added to params, and passed to
			// the widget on instantiation.
			// <script type="dojo/method"> tags (with no event) are executed after instantiation
			// <script type="dojo/connect" event="foo"> tags are dojo.connected after instantiation
			// note: dojo/* script tags cannot exist in self closing widgets, like <input />
			if(!ps){
				var connects = [],	// functions to connect after instantiation
					calls = [];		// functions to call after instantiation

				d.query("> script[type^='dojo/']", node).orphan().forEach(function(script){
					var event = script.getAttribute("event"),
						type = script.getAttribute("type"),
						nf = d.parser._functionFromScript(script);
					if(event){
						if(type == "dojo/connect"){
							connects.push({event: event, func: nf});
						}else{
							params[event] = nf;
						}
					}else{
						calls.push(nf);
					}
				});
			}

			var markupFactory = clazz["markupFactory"];
			if(!markupFactory && clazz["prototype"]){
				markupFactory = clazz.prototype["markupFactory"];
			}
			// create the instance
			var instance = markupFactory ? markupFactory(params, node, clazz) : new clazz(params, node);
			thelist.push(instance);

			// map it to the JS namespace if that makes sense
			var jsname = node.getAttribute("jsId");
			if(jsname){
				d.setObject(jsname, instance);
			}

			// process connections and startup functions
			if(!ps){
				d.forEach(connects, function(connect){
					d.connect(instance, connect.event, null, connect.func);
				});
				d.forEach(calls, function(func){
					func.call(instance);
				});
			}
		});

		// Call startup on each top level instance if it makes sense (as for
		// widgets).  Parent widgets will recursively call startup on their
		// (non-top level) children
		d.forEach(thelist, function(instance){
			if(	instance  && 
				instance.startup &&
				!instance._started && 
				(!instance.getParent || !instance.getParent())
			){
				instance.startup();
			}
		});
		return thelist;
	};

	this.parse = function(/*DomNode?*/ rootNode){
		// summary:
		//		Search specified node (or root node) recursively for class instances,
		//		and instantiate them Searches for
		//		dojoType="qualified.class.name"
		var list = d.query(qry, rootNode);
		// go build the object instances
		var instances = this.instantiate(list);
		return instances;
	};
}();

//Register the parser callback. It should be the first callback
//after the a11y test.

(function(){
	var parseRunner = function(){ 
		if(dojo.config["parseOnLoad"] == true){
			dojo.parser.parse(); 
		}
	};

	// FIXME: need to clobber cross-dependency!!
	if(dojo.exists("dijit.wai.onload") && (dijit.wai.onload === dojo._loaders[0])){
		dojo._loaders.splice(1, 0, parseRunner);
	}else{
		dojo._loaders.unshift(parseRunner);
	}
})();

//TODO: ported from 0.4.x Dojo.  Can we reduce this?
dojo.parser._anonCtr = 0;
dojo.parser._anon = {}; // why is this property required?
dojo.parser._nameAnonFunc = function(/*Function*/anonFuncPtr, /*Object*/thisObj){
	// summary:
	//		Creates a reference to anonFuncPtr in thisObj with a completely
	//		unique name. The new name is returned as a String. 
	var jpn = "$joinpoint";
	var nso = (thisObj|| dojo.parser._anon);
	if(dojo.isIE){
		var cn = anonFuncPtr["__dojoNameCache"];
		if(cn && nso[cn] === anonFuncPtr){
			return anonFuncPtr["__dojoNameCache"];
		}
	}
	var ret = "__"+dojo.parser._anonCtr++;
	while(typeof nso[ret] != "undefined"){
		ret = "__"+dojo.parser._anonCtr++;
	}
	nso[ret] = anonFuncPtr;
	return ret; // String
}

}

if(!dojo._hasResource["dojo.html"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.html"] = true;
dojo.provide("dojo.html");

// the parser might be needed..
 

(function(){ // private scope, sort of a namespace

	// idCounter is incremented with each instantiation to allow asignment of a unique id for tracking, logging purposes
	var idCounter = 0; 

	dojo.html._secureForInnerHtml = function(/*String*/ cont){
		// summary:
		//		removes !DOCTYPE and title elements from the html string.
		// 
		//		khtml is picky about dom faults, you can't attach a style or <title> node as child of body
		//		must go into head, so we need to cut out those tags
		//	cont:
		//		An html string for insertion into the dom
		//	
		return cont.replace(/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/ig, ""); // String
	};

	dojo.html._emptyNode = function(/* DomNode */ node){
		// summary:
		//		removes all child nodes from the given node
		//	node:
		//		the parent element

		while(node.firstChild){
			dojo._destroyElement(node.firstChild);
		}
	};

	dojo.html._setNodeContent = function(/* DomNode */ node, /* String|DomNode|NodeList */ cont, /* Boolean? */ shouldEmptyFirst){
		// summary:
		//		inserts the given content into the given node
		//		overlaps similiar functionality in dijit.layout.ContentPane._setContent
		//	node:
		//		the parent element
		//	content:
		//		the content to be set on the parent element. 
		//		This can be an html string, a node reference or a NodeList, dojo.NodeList, Array or other enumerable list of nodes
		// shouldEmptyFirst
		//		if shouldEmptyFirst is true, the node will first be emptied of all content before the new content is inserted
		//		defaults to false
		if(shouldEmptyFirst){
			dojo.html._emptyNode(node); 
		}

		if(typeof cont == "string"){
			// there's some hoops to jump through before we can set innerHTML on the would-be parent element. 
	
			// rationale for this block:
			// if node is a table derivate tag, some browsers dont allow innerHTML on those
			// TODO: <select>, <dl>? what other elements will give surprises if you naively set innerHTML?
			
			var pre = '', post = '', walk = 0, name = node.nodeName.toLowerCase();
			switch(name){
				case 'tr':
					pre = '<tr>'; post = '</tr>';
					walk += 1;//fallthrough
				case 'tbody': case 'thead':// children of THEAD is of same type as TBODY
					pre = '<tbody>' + pre; post += '</tbody>';
					walk += 1;// falltrough
				case 'table':
					pre = '<table>' + pre; post += '</table>';
					walk += 1;
					break;
			}
			if(walk){
				var n = node.ownerDocument.createElement('div');
				n.innerHTML = pre + cont + post;
				do{
					n = n.firstChild;
				}while(--walk);
				// now we can safely add the child nodes...
				dojo.forEach(n.childNodes, function(n){
					node.appendChild(n.cloneNode(true));
				});
			}else{
				// innerHTML the content as-is into the node (element)
				// should we ever support setting content on non-element node types? 
				// e.g. text nodes, comments, etc.?
				node.innerHTML = cont;
			}

		}else{
			// DomNode or NodeList
			if(cont.nodeType){ // domNode (htmlNode 1 or textNode 3)
				node.appendChild(cont);
			}else{// nodelist or array such as dojo.Nodelist
				dojo.forEach(cont, function(n){
					node.appendChild(n.cloneNode(true));
				});
			}
		}
		// return DomNode
		return node;
	};

	// we wrap up the content-setting operation in a object
	dojo.declare("dojo.html._ContentSetter", null, 
		{
			// node: DomNode|String
			//		An node which will be the parent element that we set content into
			node: "",

			// content: String|DomNode|DomNode[]
			//		The content to be placed in the node. Can be an HTML string, a node reference, or a enumerable list of nodes
			content: "",
			
			// id: String?
			//		Usually only used internally, and auto-generated with each instance 
			id: "",

			// cleanContent: Boolean
			//		Should the content be treated as a full html document, 
			//		and the real content stripped of <html>, <body> wrapper before injection
			cleanContent: false,
			
			// extractContent: Boolean
			//		Should the content be treated as a full html document, and the real content stripped of <html>, <body> wrapper before injection
			extractContent: false,

			// parseContent: Boolean
			//		Should the node by passed to the parser after the new content is set
			parseContent: false,
			
			// lifecyle methods
			constructor: function(/* Object */params, /* String|DomNode */node){
				//	summary:
				//		Provides a configurable, extensible object to wrap the setting on content on a node
				//		call the set() method to actually set the content..
 
				// the original params are mixed directly into the instance "this"
				dojo.mixin(this, params || {});

				// give precedence to params.node vs. the node argument
				// and ensure its a node, not an id string
				node = this.node = dojo.byId( this.node || node );
	
				if(!this.id){
					this.id = [
						"Setter",
						(node) ? node.id || node.tagName : "", 
						idCounter++
					].join("_");
				}

				if(! (this.node || node)){
					new Error(this.declaredClass + ": no node provided to " + this.id);
				}
			},
			set: function(/* String|DomNode|NodeList? */ cont, /* Object? */ params){
				// summary:
				//		front-end to the set-content sequence 
				//	cont:
				//		An html string, node or enumerable list of nodes for insertion into the dom
				//		If not provided, the object's content property will be used
				if(undefined !== cont){
					this.content = cont;
				}
				// in the re-use scenario, set needs to be able to mixin new configuration
				if(params){
					this._mixin(params);
				}

				this.onBegin();
				this.setContent();
				this.onEnd();

				return this.node;
			},
			setContent: function(){
				// summary:
				//		sets the content on the node 

				var node = this.node; 
				if(!node) {
					console.error("setContent given no node");
				}
				try{
					node = dojo.html._setNodeContent(node, this.content);
				}catch(e){
					// check if a domfault occurs when we are appending this.errorMessage
					// like for instance if domNode is a UL and we try append a DIV
	
					// FIXME: need to allow the user to provide a content error message string
					var errMess = this.onContentError(e); 
					try{
						node.innerHTML = errMess;
					}catch(e){
						console.error('Fatal ' + this.declaredClass + '.setContent could not change content due to '+e.message, e);
					}
				}
				// always put back the node for the next method
				this.node = node; // DomNode
			},
			
			empty: function() {
				// summary
				//	cleanly empty out existing content

				// destroy any widgets from a previous run
				// NOTE: if you dont want this you'll need to empty 
				// the parseResults array property yourself to avoid bad things happenning
				if(this.parseResults && this.parseResults.length) {
					dojo.forEach(this.parseResults, function(w) {
						if(w.destroy){
							w.destroy();
						}
					});
					delete this.parseResults;
				}
				// this is fast, but if you know its already empty or safe, you could 
				// override empty to skip this step
				dojo.html._emptyNode(this.node);
			},
	
			onBegin: function(){
				// summary
				//		Called after instantiation, but before set(); 
				//		It allows modification of any of the object properties 
				//		- including the node and content provided - before the set operation actually takes place
				//		This default implementation checks for cleanContent and extractContent flags to 
				//		optionally pre-process html string content
				var cont = this.content;
	
				if(dojo.isString(cont)){
					if(this.cleanContent){
						cont = dojo.html._secureForInnerHtml(cont);
					}
  
					if(this.extractContent){
						var match = cont.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
						if(match){ cont = match[1]; }
					}
				}

				// clean out the node and any cruft associated with it - like widgets
				this.empty();
				
				this.content = cont;
				return this.node; /* DomNode */
			},
	
			onEnd: function(){
				// summary
				//		Called after set(), when the new content has been pushed into the node
				//		It provides an opportunity for post-processing before handing back the node to the caller
				//		This default implementation checks a parseContent flag to optionally run the dojo parser over the new content
				if(this.parseContent){
					// populates this.parseResults if you need those..
					this._parse();
				}
				return this.node; /* DomNode */
			},
	
			tearDown: function(){
				// summary
				//		manually reset the Setter instance if its being re-used for example for another set()
				// description
				//		tearDown() is not called automatically. 
				//		In normal use, the Setter instance properties are simply allowed to fall out of scope
				//		but the tearDown method can be called to explicitly reset this instance.
				delete this.parseResults; 
				delete this.node; 
				delete this.content; 
			},
  
			onContentError: function(err){
				return "Error occured setting content: " + err; 
			},
			
			_mixin: function(params){
				// mix properties/methods into the instance
				// TODO: the intention with tearDown is to put the Setter's state 
				// back to that of the original constructor (vs. deleting/resetting everything regardless of ctor params)
				// so we could do something here to move the original properties aside for later restoration
				var empty = {}, key;
				for(key in params){
					if(key in empty){ continue; }
					// TODO: here's our opportunity to mask the properties we dont consider configurable/overridable
					// .. but history shows we'll almost always guess wrong
					this[key] = params[key]; 
				}
			},
			_parse: function(){
				// summary: 
				//		runs the dojo parser over the node contents, storing any results in this.parseResults
				//		Any errors resulting from parsing are passed to _onError for handling

				var rootNode = this.node;
				try{
					// store the results (widgets, whatever) for potential retrieval
					this.parseResults = dojo.parser.parse(rootNode, true);
				}catch(e){
					this._onError('Content', e, "Error parsing in _ContentSetter#"+this.id);
				}
			},
  
			_onError: function(type, err, consoleText){
				// summary:
				//		shows user the string that is returned by on[type]Error
				//		overide/implement on[type]Error and return your own string to customize
				var errText = this['on' + type + 'Error'].call(this, err);
				if(consoleText){
					console.error(consoleText, err);
				}else if(errText){ // a empty string won't change current content
					dojo.html._setNodeContent(this.node, errText, true);
				}
			}
	}); // end dojo.declare()

	dojo.html.set = function(/* DomNode */ node, /* String|DomNode|NodeList */ cont, /* Object? */ params){
			// summary:
			//		inserts (replaces) the given content into the given node
			//	node:
			//		the parent element that will receive the content
			//	cont:
			//		the content to be set on the parent element. 
			//		This can be an html string, a node reference or a NodeList, dojo.NodeList, Array or other enumerable list of nodes
			//	params: 
			//		Optional flags/properties to configure the content-setting. See dojo.html._ContentSetter
			//	example:
			//		A safe string/node/nodelist content replacement/injection with hooks for extension
			//		Example Usage: 
			//		dojo.html.set(node, "some string"); 
			//		dojo.html.set(node, contentNode, {options}); 
			//		dojo.html.set(node, myNode.childNodes, {options}); 
		if(undefined == cont){
			console.warn("dojo.html.set: no cont argument provided, using empty string");
			cont = "";
		}	
		if(!params){
			// simple and fast
			return dojo.html._setNodeContent(node, cont, true);
		}else{ 
			// more options but slower
			// note the arguments are reversed in order, to match the convention for instantiation via the parser
			var op = new dojo.html._ContentSetter(dojo.mixin( 
					params, 
					{ content: cont, node: node } 
			));
			return op.set();
		}
	};
})();

}

if(!dojo._hasResource["dojo.i18n"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.i18n"] = true;
dojo.provide("dojo.i18n");

/*=====
dojo.i18n = {
	// summary: Utility classes to enable loading of resources for internationalization (i18n)
};
=====*/

dojo.i18n.getLocalization = function(/*String*/packageName, /*String*/bundleName, /*String?*/locale){
	//	summary:
	//		Returns an Object containing the localization for a given resource
	//		bundle in a package, matching the specified locale.
	//	description:
	//		Returns a hash containing name/value pairs in its prototypesuch
	//		that values can be easily overridden.  Throws an exception if the
	//		bundle is not found.  Bundle must have already been loaded by
	//		`dojo.requireLocalization()` or by a build optimization step.  NOTE:
	//		try not to call this method as part of an object property
	//		definition (`var foo = { bar: dojo.i18n.getLocalization() }`).  In
	//		some loading situations, the bundle may not be available in time
	//		for the object definition.  Instead, call this method inside a
	//		function that is run after all modules load or the page loads (like
	//		in `dojo.addOnLoad()`), or in a widget lifecycle method.
	//	packageName:
	//		package which is associated with this resource
	//	bundleName:
	//		the base filename of the resource bundle (without the ".js" suffix)
	//	locale:
	//		the variant to load (optional).  By default, the locale defined by
	//		the host environment: dojo.locale

	locale = dojo.i18n.normalizeLocale(locale);

	// look for nearest locale match
	var elements = locale.split('-');
	var module = [packageName,"nls",bundleName].join('.');
	var bundle = dojo._loadedModules[module];
	if(bundle){
		var localization;
		for(var i = elements.length; i > 0; i--){
			var loc = elements.slice(0, i).join('_');
			if(bundle[loc]){
				localization = bundle[loc];
				break;
			}
		}
		if(!localization){
			localization = bundle.ROOT;
		}

		// make a singleton prototype so that the caller won't accidentally change the values globally
		if(localization){
			var clazz = function(){};
			clazz.prototype = localization;
			return new clazz(); // Object
		}
	}

	throw new Error("Bundle not found: " + bundleName + " in " + packageName+" , locale=" + locale);
};

dojo.i18n.normalizeLocale = function(/*String?*/locale){
	//	summary:
	//		Returns canonical form of locale, as used by Dojo.
	//
	//  description:
	//		All variants are case-insensitive and are separated by '-' as specified in [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
	//		If no locale is specified, the dojo.locale is returned.  dojo.locale is defined by
	//		the user agent's locale unless overridden by djConfig.

	var result = locale ? locale.toLowerCase() : dojo.locale;
	if(result == "root"){
		result = "ROOT";
	}
	return result; // String
};

dojo.i18n._requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
	//	summary:
	//		See dojo.requireLocalization()
	//	description:
	// 		Called by the bootstrap, but factored out so that it is only
	// 		included in the build when needed.

	var targetLocale = dojo.i18n.normalizeLocale(locale);
 	var bundlePackage = [moduleName, "nls", bundleName].join(".");
	// NOTE: 
	//		When loading these resources, the packaging does not match what is
	//		on disk.  This is an implementation detail, as this is just a
	//		private data structure to hold the loaded resources.  e.g.
	//		`tests/hello/nls/en-us/salutations.js` is loaded as the object
	//		`tests.hello.nls.salutations.en_us={...}` The structure on disk is
	//		intended to be most convenient for developers and translators, but
	//		in memory it is more logical and efficient to store in a different
	//		order.  Locales cannot use dashes, since the resulting path will
	//		not evaluate as valid JS, so we translate them to underscores.
	
	//Find the best-match locale to load if we have available flat locales.
	var bestLocale = "";
	if(availableFlatLocales){
		var flatLocales = availableFlatLocales.split(",");
		for(var i = 0; i < flatLocales.length; i++){
			//Locale must match from start of string.
			//Using ["indexOf"] so customBase builds do not see
			//this as a dojo._base.array dependency.
			if(targetLocale["indexOf"](flatLocales[i]) == 0){
				if(flatLocales[i].length > bestLocale.length){
					bestLocale = flatLocales[i];
				}
			}
		}
		if(!bestLocale){
			bestLocale = "ROOT";
		}		
	}

	//See if the desired locale is already loaded.
	var tempLocale = availableFlatLocales ? bestLocale : targetLocale;
	var bundle = dojo._loadedModules[bundlePackage];
	var localizedBundle = null;
	if(bundle){
		if(dojo.config.localizationComplete && bundle._built){return;}
		var jsLoc = tempLocale.replace(/-/g, '_');
		var translationPackage = bundlePackage+"."+jsLoc;
		localizedBundle = dojo._loadedModules[translationPackage];
	}

	if(!localizedBundle){
		bundle = dojo["provide"](bundlePackage);
		var syms = dojo._getModuleSymbols(moduleName);
		var modpath = syms.concat("nls").join("/");
		var parent;

		dojo.i18n._searchLocalePath(tempLocale, availableFlatLocales, function(loc){
			var jsLoc = loc.replace(/-/g, '_');
			var translationPackage = bundlePackage + "." + jsLoc;
			var loaded = false;
			if(!dojo._loadedModules[translationPackage]){
				// Mark loaded whether it's found or not, so that further load attempts will not be made
				dojo["provide"](translationPackage);
				var module = [modpath];
				if(loc != "ROOT"){module.push(loc);}
				module.push(bundleName);
				var filespec = module.join("/") + '.js';
				loaded = dojo._loadPath(filespec, null, function(hash){
					// Use singleton with prototype to point to parent bundle, then mix-in result from loadPath
					var clazz = function(){};
					clazz.prototype = parent;
					bundle[jsLoc] = new clazz();
					for(var j in hash){ bundle[jsLoc][j] = hash[j]; }
				});
			}else{
				loaded = true;
			}
			if(loaded && bundle[jsLoc]){
				parent = bundle[jsLoc];
			}else{
				bundle[jsLoc] = parent;
			}
			
			if(availableFlatLocales){
				//Stop the locale path searching if we know the availableFlatLocales, since
				//the first call to this function will load the only bundle that is needed.
				return true;
			}
		});
	}

	//Save the best locale bundle as the target locale bundle when we know the
	//the available bundles.
	if(availableFlatLocales && targetLocale != bestLocale){
		bundle[targetLocale.replace(/-/g, '_')] = bundle[bestLocale.replace(/-/g, '_')];
	}
};

(function(){
	// If other locales are used, dojo.requireLocalization should load them as
	// well, by default. 
	// 
	// Override dojo.requireLocalization to do load the default bundle, then
	// iterate through the extraLocale list and load those translations as
	// well, unless a particular locale was requested.

	var extra = dojo.config.extraLocale;
	if(extra){
		if(!extra instanceof Array){
			extra = [extra];
		}

		var req = dojo.i18n._requireLocalization;
		dojo.i18n._requireLocalization = function(m, b, locale, availableFlatLocales){
			req(m,b,locale, availableFlatLocales);
			if(locale){return;}
			for(var i=0; i<extra.length; i++){
				req(m,b,extra[i], availableFlatLocales);
			}
		};
	}
})();

dojo.i18n._searchLocalePath = function(/*String*/locale, /*Boolean*/down, /*Function*/searchFunc){
	//	summary:
	//		A helper method to assist in searching for locale-based resources.
	//		Will iterate through the variants of a particular locale, either up
	//		or down, executing a callback function.  For example, "en-us" and
	//		true will try "en-us" followed by "en" and finally "ROOT".

	locale = dojo.i18n.normalizeLocale(locale);

	var elements = locale.split('-');
	var searchlist = [];
	for(var i = elements.length; i > 0; i--){
		searchlist.push(elements.slice(0, i).join('-'));
	}
	searchlist.push(false);
	if(down){searchlist.reverse();}

	for(var j = searchlist.length - 1; j >= 0; j--){
		var loc = searchlist[j] || "ROOT";
		var stop = searchFunc(loc);
		if(stop){ break; }
	}
};

dojo.i18n._preloadLocalizations = function(/*String*/bundlePrefix, /*Array*/localesGenerated){
	//	summary:
	//		Load built, flattened resource bundles, if available for all
	//		locales used in the page. Only called by built layer files.

	function preload(locale){
		locale = dojo.i18n.normalizeLocale(locale);
		dojo.i18n._searchLocalePath(locale, true, function(loc){
			for(var i=0; i<localesGenerated.length;i++){
				if(localesGenerated[i] == loc){
					dojo["require"](bundlePrefix+"_"+loc);
					return true; // Boolean
				}
			}
			return false; // Boolean
		});
	}
	preload();
	var extra = dojo.config.extraLocale||[];
	for(var i=0; i<extra.length; i++){
		preload(extra[i]);
	}
};

}

if(!dojo._hasResource["dijit.layout.ContentPane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.ContentPane"] = true;
dojo.provide("dijit.layout.ContentPane");









dojo.declare(
    "dijit.layout.ContentPane",
    dijit._Widget,
{
    // summary:
    //      A widget that acts as a Container for other widgets, and includes a ajax interface
    // description:
    //      A widget that can be used as a standalone widget
    //      or as a baseclass for other widgets
    //      Handles replacement of document fragment using either external uri or javascript
    //      generated markup or DOM content, instantiating widgets within that content.
    //      Don't confuse it with an iframe, it only needs/wants document fragments.
    //      It's useful as a child of LayoutContainer, SplitContainer, or TabContainer.
    //      But note that those classes can contain any widget as a child.
    // example:
    //      Some quick samples:
    //      To change the innerHTML use .attr('content', '<b>new content</b>')
    //
    //      Or you can send it a NodeList, .attr('content', dojo.query('div [class=selected]', userSelection))
    //      please note that the nodes in NodeList will copied, not moved
    //
    //      To do a ajax update use .attr('href', url)

    // href: String
    //      The href of the content that displays now.
    //      Set this at construction if you want to load data externally when the
    //      pane is shown.  (Set preload=true to load it immediately.)
    //      Changing href after creation doesn't have any effect; use attr('href', ...);
    href: "",

/*=====
    // content: String
    //      The innerHTML of the ContentPane.
    //      Note that the initialization parameter / argument to attr("content", ...)
    //      can be a String, DomNode, Nodelist, or widget.
    content: "",
=====*/

    // extractContent: Boolean
    //  Extract visible content from inside of <body> .... </body>
    extractContent: false,

    // parseOnLoad: Boolean
    //  parse content and create the widgets, if any
    parseOnLoad:    true,

    // preventCache: Boolean
    //      Cache content retreived externally
    preventCache:   false,

    // preload: Boolean
    //  Force load of data even if pane is hidden.
    preload: false,

    // refreshOnShow: Boolean
    //      Refresh (re-download) content when pane goes from hidden to shown
    refreshOnShow: false,

    // loadingMessage: String
    //  Message that shows while downloading
    loadingMessage: "<span class='dijitContentPaneLoading'>${loadingState}</span>", 

    // errorMessage: String
    //  Message that shows if an error occurs
    errorMessage: "<span class='dijitContentPaneError'>${errorState}</span>", 

    // isLoaded: Boolean
    //  Tells loading status see onLoad|onUnload for event hooks
    isLoaded: false,

    baseClass: "dijitContentPane",

    // doLayout: Boolean
    //      - false - don't adjust size of children
    //      - true - if there is a single visible child widget, set it's size to
    //              however big the ContentPane is
    doLayout: true,

    // whether current content is something the user specified, or just a "Loading..." message
    _isRealContent: true,

    postMixInProperties: function(){
        this.inherited(arguments);
        var messages = dojo.i18n.getLocalization("dijit", "loading", this.lang);
        this.loadingMessage = dojo.string.substitute(this.loadingMessage, messages);
        this.errorMessage = dojo.string.substitute(this.errorMessage, messages);
    },

    buildRendering: function(){
        this.inherited(arguments);
        if(!this.containerNode){
            // make getDescendants() work
            this.containerNode = this.domNode;
        }
    },

    postCreate: function(){
        // remove the title attribute so it doesn't show up when i hover
        // over a node
        this.domNode.title = "";

        if (!dijit.hasWaiRole(this.domNode)){
            dijit.setWaiRole(this.domNode, "group");
        }

        dojo.addClass(this.domNode, this.baseClass);
    },

    startup: function(){
        if(this._started){ return; }
        if(this.doLayout != "false" && this.doLayout !== false){
            this._checkIfSingleChild();
            if(this._singleChild){
                this._singleChild.startup();
            }
        }
        this._loadCheck();
        this.inherited(arguments);
    },

    _checkIfSingleChild: function(){
        // summary:
        //      Test if we have exactly one visible widget as a child,
        //      and if so assume that we are a container for that widget,
        //      and should propogate startup() and resize() calls to it.
        //      Skips over things like data stores since they aren't visible.

        var childNodes = dojo.query(">", this.containerNode),
            childWidgetNodes = childNodes.filter(function(node){
                return dojo.hasAttr(node, "dojoType") || dojo.hasAttr(node, "widgetId");
            }),
            candidateWidgets = dojo.filter(childWidgetNodes.map(dijit.byNode), function(widget){
                return widget && widget.domNode && widget.resize;
            });

        if(
            // all child nodes are widgets
            childNodes.length == childWidgetNodes.length &&

            // all but one are invisible (like dojo.data)
            candidateWidgets.length == 1
        ){
            this.isContainer = true;
            this._singleChild = candidateWidgets[0];
        }else{
            delete this.isContainer;
            delete this._singleChild;
        }
    },

    refresh: function(){
        // summary:
        //  Force a refresh (re-download) of content, be sure to turn off cache

        // we return result of _prepareLoad here to avoid code dup. in dojox.layout.ContentPane
        return this._prepareLoad(true);
    },

    setHref: function(/*String|Uri*/ href){
        dojo.deprecated("dijit.layout.ContentPane.setHref() is deprecated.  Use attr('href', ...) instead.", "", "2.0");
        return this.attr("href", href);
    },
    _setHrefAttr: function(/*String|Uri*/ href){
        // summary:
        //      Hook so attr("href", ...) works.
        // description:
        //      Reset the (external defined) content of this pane and replace with new url
        //      Note: It delays the download until widget is shown if preload is false.
        //  href:
        //      url to the page you want to get, must be within the same domain as your mainpage
        this.href = href;

        // _setHrefAttr() is called during creation and by the user, after creation.
        // only in the second case do we actually load the URL; otherwise it's done in startup()
        if(this._created){
            // we return result of _prepareLoad here to avoid code dup. in dojox.layout.ContentPane
            return this._prepareLoad();
        }
    },

    setContent: function(/*String|DomNode|Nodelist*/data){
        dojo.deprecated("dijit.layout.ContentPane.setContent() is deprecated.  Use attr('content', ...) instead.", "", "2.0");
        this.attr("content", data);
    },
    _setContentAttr: function(/*String|DomNode|Nodelist*/data){
        // summary:
        //      Hook to make attr("content", ...) work.
        //      Replaces old content with data content, include style classes from old content
        //  data:
        //      the new Content may be String, DomNode or NodeList
        //
        //      if data is a NodeList (or an array of nodes) nodes are copied
        //      so you can import nodes from another document implicitly

        // clear href so we cant run refresh and clear content
        // refresh should only work if we downloaded the content
        this.href = "";

        // Cancel any in-flight requests (an attr('content') will cancel any in-flight attr('href', ...))
        this.cancel();

        this._setContent(data || "");

        this._isDownloaded = false; // mark that content is from a attr('content') not an attr('href')
    },
    _getContentAttr: function(){
        // summary: hook to make attr("content") work
        return this.containerNode.innerHTML;
    },

    cancel: function(){
        // summary:
        //      Cancels a inflight download of content
        if(this._xhrDfd && (this._xhrDfd.fired == -1)){
            console.debug('cancelling inflight download');
            this._xhrDfd.cancel();
        }
        delete this._xhrDfd; // garbage collect
    },

    destroyRecursive: function(/*Boolean*/ preserveDom){
        // summary:
        //      Destroy the ContentPane and it's contents

        // if we have multiple controllers destroying us, bail after the first
        if(this._beingDestroyed){
            return;
        }
        this._beingDestroyed = true;
        this.inherited(arguments);
    },

    resize: function(size){
        dojo.marginBox(this.domNode, size);

        // Compute content box size in case we [later] need to size child
        // If either height or width wasn't specified by the user, then query node for it.
        // But note that setting the margin box and then immediately querying dimensions may return
        // inaccurate results, so try not to depend on it.
        var node = this.containerNode,
            mb = dojo.mixin(dojo.marginBox(node), size||{});

        var cb = this._contentBox = dijit.layout.marginBox2contentBox(node, mb);

        // If we have a single widget child then size it to fit snugly within my borders
        if(this._singleChild && this._singleChild.resize){
            // note: if widget has padding this._contentBox will have l and t set,
            // but don't pass them to resize() or it will doubly-offset the child
            this._singleChild.resize({w: cb.w, h: cb.h});
        }
    },

    _prepareLoad: function(forceLoad){
        // sets up for a xhrLoad, load is deferred until widget onShow
        // cancels a inflight download
        this.cancel();
        this.isLoaded = false;
        this._loadCheck(forceLoad);
    },

    _isShown: function(){
        // summary: returns true if the content is currently shown
        if("open" in this){
            return this.open;       // for TitlePane, etc.
        }else{
            var node = this.domNode;
            return (node.style.display != 'none')  && (node.style.visibility != 'hidden');
        }
    },

    _loadCheck: function(/*Boolean*/ forceLoad){
        // call this when you change onShow (onSelected) status when selected in parent container
        // it's used as a trigger for href download when this.domNode.display != 'none'

        // sequence:
        // if no href -> bail
        // forceLoad -> always load
        // this.preload -> load when download not in progress, domNode display doesn't matter
        // this.refreshOnShow -> load when download in progress bails, domNode display !='none' AND
        //                      this.open !== false (undefined is ok), isLoaded doesn't matter
        // else -> load when download not in progress, if this.open !== false (undefined is ok) AND
        //                      domNode display != 'none', isLoaded must be false

        var displayState = this._isShown();

        if(this.href && 
            (
                forceLoad ||
                (this.preload && !this.isLoaded && !this._xhrDfd) ||
                (this.refreshOnShow && displayState && !this._xhrDfd) ||
                (!this.isLoaded && displayState && !this._xhrDfd)
            )
        ){
            this._downloadExternalContent();
        }
    },

    _downloadExternalContent: function(){
        // display loading message
        this._setContent(this.onDownloadStart(), true);

        var self = this;
        var getArgs = {
            preventCache: (this.preventCache || this.refreshOnShow),
            url: this.href,
            handleAs: "text"
        };
        if(dojo.isObject(this.ioArgs)){
            dojo.mixin(getArgs, this.ioArgs);
        }

        var hand = this._xhrDfd = (this.ioMethod || dojo.xhrGet)(getArgs);

        hand.addCallback(function(html){
            try{
                self._isDownloaded = true;
                self._setContent(html, false); // onload event is called from here
                self.onDownloadEnd();
            }catch(err){
                self._onError('Content', err); // onContentError
            }
            delete self._xhrDfd;
            return html;
        });

        hand.addErrback(function(err){
            if(!hand.cancelled){
                // show error message in the pane
                self._onError('Download', err); // onDownloadError
            }
            delete self._xhrDfd;
            return err;
        });
    },

    _onLoadHandler: function(data){
        // summary:
        //      This is called whenever new content is being loaded
        this.isLoaded = true;
        try{
            this.onLoad(data);
        }catch(e){
            console.error('Error '+this.widgetId+' running custom onLoad code');
        }
    },

    _onUnloadHandler: function(){
        // summary:
        //      This is called whenever the content is being unloaded
        this.isLoaded = false;
        try{
            this.onUnload();
        }catch(e){
            console.error('Error '+this.widgetId+' running custom onUnload code');
        }
    },

    destroy: function() {
        // summary:
        //      adding destory to contentpane.
        //      fkhan@zivios.org
        dojo.forEach(this.getDescendants(), function(widget){
            widget.destroyRecursive();
        });

        this.cancel();
        this.inherited(arguments);
    },

    destroyDescendants: function(){
        // summary:
        //      Destroy all the widgets inside the ContentPane and empty containerNode

        // Make sure we call onUnload (but only when the ContentPane has real content)
        if(this._isRealContent){
            this._onUnloadHandler();
        }

        // dojo.html._ContentSetter keeps track of child widgets, so we should use it to
        // destroy them.
        //
        // Only exception is when those child widgets were specified in original page markup
        // and created by the parser (in which case _ContentSetter doesn't know what the widgets
        // are).  Then we need to call Widget.destroyDescendants().
        //
        // Note that calling Widget.destroyDescendants() has various issues (#6954),
        //  namely that popup widgets aren't destroyed (#2056, #4980)
        // and the widgets in templates are destroyed twice (#7706)
        var setter = this._contentSetter; 
        if(setter){
            // calling empty destroys all child widgets as well as emptying the containerNode
            setter.empty();
        }else{
            this.inherited(arguments);
            dojo.html._emptyNode(this.containerNode);
        }
    },

    _setContent: function(cont, isFakeContent){
        // summary: 
        //      Insert the content into the container node

        // first get rid of child widgets
        this.destroyDescendants();

        // mark whether this should be calling the unloadHandler
        // for the content we are about to set
        this._isRealContent = !isFakeContent;
        
        // dojo.html.set will take care of the rest of the details
        // we provide an overide for the error handling to ensure the widget gets the errors 
        // configure the setter instance with only the relevant widget instance properties
        // NOTE: unless we hook into attr, or provide property setters for each property, 
        // we need to re-configure the ContentSetter with each use
        var setter = this._contentSetter; 
        if(! (setter && setter instanceof dojo.html._ContentSetter)) {
            setter = this._contentSetter = new dojo.html._ContentSetter({
                node: this.containerNode,
                _onError: dojo.hitch(this, this._onError),
                onContentError: dojo.hitch(this, function(e){
                    // fires if a domfault occurs when we are appending this.errorMessage
                    // like for instance if domNode is a UL and we try append a DIV
                    var errMess = this.onContentError(e);
                    try{
                        this.containerNode.innerHTML = errMess;
                    }catch(e){
                        console.error('Fatal '+this.id+' could not change content due to '+e.message, e);
                    }
                })/*,
                _onError */
            });
        };

        var setterParams = dojo.mixin({
            cleanContent: this.cleanContent, 
            extractContent: this.extractContent, 
            parseContent: this.parseOnLoad 
        }, this._contentSetterParams || {});
        
        dojo.mixin(setter, setterParams); 

        setter.set( (dojo.isObject(cont) && cont.domNode) ? cont.domNode : cont );

        // setter params must be pulled afresh from the ContentPane each time
        delete this._contentSetterParams;
        
        if(!isFakeContent){
            if(this.doLayout != "false" && this.doLayout !== false){
                this._checkIfSingleChild();
                if(this._singleChild && this._singleChild.resize){
                    this._singleChild.startup();
                    var cb = this._contentBox || dojo.contentBox(this.containerNode);
                    this._singleChild.resize({w: cb.w, h: cb.h});
                }
            }

            this._onLoadHandler(cont);
        }
    },

    _onError: function(type, err, consoleText){
        // shows user the string that is returned by on[type]Error
        // overide on[type]Error and return your own string to customize
        var errText = this['on' + type + 'Error'].call(this, err);
        if(consoleText){
            console.error(consoleText, err);
        }else if(errText){// a empty string won't change current content
            this._setContent(errText, true);
        }
    },

    _createSubWidgets: function(){
        // summary: scan my contents and create subwidgets
        try{
            dojo.parser.parse(this.containerNode, true);
        }catch(e){
            this._onError('Content', e, "Couldn't create widgets in "+this.id
                +(this.href ? " from "+this.href : ""));
        }
    },


    // EVENT's, should be overide-able
    onLoad: function(data){
        // summary:
        //      Event hook, is called after everything is loaded and widgetified
    },

    onUnload: function(){
        // summary:
        //      Event hook, is called before old content is cleared
    },

    onDownloadStart: function(){
        // summary:
        //      called before download starts
        //      the string returned by this function will be the html
        //      that tells the user we are loading something
        //      override with your own function if you want to change text
        return this.loadingMessage;
    },

    onContentError: function(/*Error*/ error){
        // summary:
        //      called on DOM faults, require fault etc in content
        //      default is to display errormessage inside pane
    },

    onDownloadError: function(/*Error*/ error){
        // summary:
        //      Called when download error occurs, default is to display
        //      errormessage inside pane. Overide function to change that.
        //      The string returned by this function will be the html
        //      that tells the user a error happend
        return this.errorMessage;
    },

    onDownloadEnd: function(){
        // summary:
        //      called when download is finished
    }
});

}

if(!dojo._hasResource["dojo.regexp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.regexp"] = true;
dojo.provide("dojo.regexp");

/*=====
dojo.regexp = {
	// summary: Regular expressions and Builder resources
};
=====*/

dojo.regexp.escapeString = function(/*String*/str, /*String?*/except){
	//	summary:
	//		Adds escape sequences for special characters in regular expressions
	// except:
	//		a String with special characters to be left unescaped

//	return str.replace(/([\f\b\n\t\r[\^$|?*+(){}])/gm, "\\$1"); // string
	return str.replace(/([\.$?*!=:|{}\(\)\[\]\\\/^])/g, function(ch){
		if(except && except.indexOf(ch) != -1){
			return ch;
		}
		return "\\" + ch;
	}); // String
}

dojo.regexp.buildGroupRE = function(/*Object|Array*/arr, /*Function*/re, /*Boolean?*/nonCapture){
	//	summary:
	//		Builds a regular expression that groups subexpressions
	//	description:
	//		A utility function used by some of the RE generators. The
	//		subexpressions are constructed by the function, re, in the second
	//		parameter.  re builds one subexpression for each elem in the array
	//		a, in the first parameter. Returns a string for a regular
	//		expression that groups all the subexpressions.
	// arr:
	//		A single value or an array of values.
	// re:
	//		A function. Takes one parameter and converts it to a regular
	//		expression. 
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. Defaults to false

	// case 1: a is a single value.
	if(!(arr instanceof Array)){
		return re(arr); // String
	}

	// case 2: a is an array
	var b = [];
	for(var i = 0; i < arr.length; i++){
		// convert each elem to a RE
		b.push(re(arr[i]));
	}

	 // join the REs as alternatives in a RE group.
	return dojo.regexp.group(b.join("|"), nonCapture); // String
}

dojo.regexp.group = function(/*String*/expression, /*Boolean?*/nonCapture){
	// summary:
	//		adds group match to expression
	// nonCapture:
	//		If true, uses non-capturing match, otherwise matches are retained
	//		by regular expression. 
	return "(" + (nonCapture ? "?:":"") + expression + ")"; // String
}

}

if(!dojo._hasResource["dojo.cookie"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cookie"] = true;
dojo.provide("dojo.cookie");



/*=====
dojo.__cookieProps = function(){
	//	expires: Date|String|Number?
	//		If a number, the number of days from today at which the cookie
	//		will expire. If a date, the date past which the cookie will expire.
	//		If expires is in the past, the cookie will be deleted.
	//		If expires is omitted or is 0, the cookie will expire when the browser closes. << FIXME: 0 seems to disappear right away? FF3.
	//	path: String?
	//		The path to use for the cookie.
	//	domain: String?
	//		The domain to use for the cookie.
	//	secure: Boolean?
	//		Whether to only send the cookie on secure connections
	this.expires = expires;
	this.path = path;
	this.domain = domain;
	this.secure = secure;
}
=====*/


dojo.cookie = function(/*String*/name, /*String?*/value, /*dojo.__cookieProps?*/props){
	//	summary: 
	//		Get or set a cookie.
	//	description:
	// 		If one argument is passed, returns the value of the cookie
	// 		For two or more arguments, acts as a setter.
	//	name:
	//		Name of the cookie
	//	value:
	//		Value for the cookie
	//	props: 
	//		Properties for the cookie
	//	example:
	//		set a cookie with the JSON-serialized contents of an object which
	//		will expire 5 days from now:
	//	|	dojo.cookie("configObj", dojo.toJson(config), { expires: 5 });
	//	
	//	example:
	//		de-serialize a cookie back into a JavaScript object:
	//	|	var config = dojo.fromJson(dojo.cookie("configObj"));
	//	
	//	example:
	//		delete a cookie:
	//	|	dojo.cookie("configObj", null, {expires: -1});
	var c = document.cookie;
	if(arguments.length == 1){
		var matches = c.match(new RegExp("(?:^|; )" + dojo.regexp.escapeString(name) + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined; // String or undefined
	}else{
		props = props || {};
// FIXME: expires=0 seems to disappear right away, not on close? (FF3)  Change docs?
		var exp = props.expires;
		if(typeof exp == "number"){ 
			var d = new Date();
			d.setTime(d.getTime() + exp*24*60*60*1000);
			exp = props.expires = d;
		}
		if(exp && exp.toUTCString){ props.expires = exp.toUTCString(); }

		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value, propName;
		for(propName in props){
			updatedCookie += "; " + propName;
			var propValue = props[propName];
			if(propValue !== true){ updatedCookie += "=" + propValue; }
		}
		document.cookie = updatedCookie;
	}
};

dojo.cookie.isSupported = function(){
	//	summary:
	//		Use to determine if the current browser supports cookies or not.
	//		
	//		Returns true if user allows cookies.
	//		Returns false if user doesn't allow cookies.

	if(!("cookieEnabled" in navigator)){
		this("__djCookieTest__", "CookiesAllowed");
		navigator.cookieEnabled = this("__djCookieTest__") == "CookiesAllowed";
		if(navigator.cookieEnabled){
			this("__djCookieTest__", "", {expires: -1});
		}
	}
	return navigator.cookieEnabled;
};

}

if(!dojo._hasResource["dijit._Templated"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Templated"] = true;
dojo.provide("dijit._Templated");





dojo.declare("dijit._Templated",
	null,
	{
		//	summary:
		//		Mixin for widgets that are instantiated from a template
		// 
		// templateNode: DomNode
		//		a node that represents the widget template. Pre-empts both templateString and templatePath.
		templateNode: null,

		// templateString: String
		//		a string that represents the widget template. Pre-empts the
		//		templatePath. In builds that have their strings "interned", the
		//		templatePath is converted to an inline templateString, thereby
		//		preventing a synchronous network call.
		templateString: null,

		// templatePath: String
		//	Path to template (HTML file) for this widget relative to dojo.baseUrl
		templatePath: null,

		// widgetsInTemplate: Boolean
		//		should we parse the template to find widgets that might be
		//		declared in markup inside it? false by default.
		widgetsInTemplate: false,

		// skipNodeCache: Boolean
		//		if using a cached widget template node poses issues for a
		//		particular widget class, it can set this property to ensure
		//		that its template is always re-built from a string
		_skipNodeCache: false,

		_stringRepl: function(tmpl){
			var className = this.declaredClass, _this = this;
			// Cache contains a string because we need to do property replacement
			// do the property replacement
			return dojo.string.substitute(tmpl, this, function(value, key){
				if(key.charAt(0) == '!'){ value = _this[key.substr(1)]; }
				if(typeof value == "undefined"){ throw new Error(className+" template:"+key); } // a debugging aide
				if(value == null){ return ""; }

				// Substitution keys beginning with ! will skip the transform step,
				// in case a user wishes to insert unescaped markup, e.g. ${!foo}
				return key.charAt(0) == "!" ? value :
					// Safer substitution, see heading "Attribute values" in
					// http://www.w3.org/TR/REC-html40/appendix/notes.html#h-B.3.2
					value.toString().replace(/"/g,"&quot;"); //TODO: add &amp? use encodeXML method?
			}, this);
		},

		// method over-ride
		buildRendering: function(){
			// summary:
			//		Construct the UI for this widget from a template, setting this.domNode.

			// Lookup cached version of template, and download to cache if it
			// isn't there already.  Returns either a DomNode or a string, depending on
			// whether or not the template contains ${foo} replacement parameters.
			var cached = dijit._Templated.getCachedTemplate(this.templatePath, this.templateString, this._skipNodeCache);

			var node;
			if(dojo.isString(cached)){
				node = dijit._Templated._createNodesFromText(this._stringRepl(cached))[0];
			}else{
				// if it's a node, all we have to do is clone it
				node = cached.cloneNode(true);
			}

			this.domNode = node;

			// recurse through the node, looking for, and attaching to, our
			// attachment points and events, which should be defined on the template node.
			this._attachTemplateNodes(node);

			var source = this.srcNodeRef;
			if(source && source.parentNode){
				source.parentNode.replaceChild(node, source);
			}

			if(this.widgetsInTemplate){
				var cw = (this._supportingWidgets = dojo.parser.parse(node));
				this._attachTemplateNodes(cw, function(n,p){
					return n[p];
				});
			}

			this._fillContent(source);
		},

		_fillContent: function(/*DomNode*/ source){
			// summary:
			//		relocate source contents to templated container node
			//		this.containerNode must be able to receive children, or exceptions will be thrown
			var dest = this.containerNode;
			if(source && dest){
				while(source.hasChildNodes()){
					dest.appendChild(source.firstChild);
				}
			}
		},

		_attachTemplateNodes: function(rootNode, getAttrFunc){
			// summary: Iterate through the template and attach functions and nodes accordingly.	
			// description:		
			//		Map widget properties and functions to the handlers specified in
			//		the dom node and it's descendants. This function iterates over all
			//		nodes and looks for these properties:
			//			* dojoAttachPoint
			//			* dojoAttachEvent	
			//			* waiRole
			//			* waiState
			// rootNode: DomNode|Array[Widgets]
			//		the node to search for properties. All children will be searched.
			// getAttrFunc: function?
			//		a function which will be used to obtain property for a given
			//		DomNode/Widget

			getAttrFunc = getAttrFunc || function(n,p){ return n.getAttribute(p); };

			var nodes = dojo.isArray(rootNode) ? rootNode : (rootNode.all || rootNode.getElementsByTagName("*"));
			var x = dojo.isArray(rootNode) ? 0 : -1;
			var attrs = {};
			for(; x<nodes.length; x++){
				var baseNode = (x == -1) ? rootNode : nodes[x];
				if(this.widgetsInTemplate && getAttrFunc(baseNode, "dojoType")){
					continue;
				}
				// Process dojoAttachPoint
				var attachPoint = getAttrFunc(baseNode, "dojoAttachPoint");
				if(attachPoint){
					var point, points = attachPoint.split(/\s*,\s*/);
					while((point = points.shift())){
						if(dojo.isArray(this[point])){
							this[point].push(baseNode);
						}else{
							this[point]=baseNode;
						}
					}
				}

				// Process dojoAttachEvent
				var attachEvent = getAttrFunc(baseNode, "dojoAttachEvent");
				if(attachEvent){
					// NOTE: we want to support attributes that have the form
					// "domEvent: nativeEvent; ..."
					var event, events = attachEvent.split(/\s*,\s*/);
					var trim = dojo.trim;
					while((event = events.shift())){
						if(event){
							var thisFunc = null;
							if(event.indexOf(":") != -1){
								// oh, if only JS had tuple assignment
								var funcNameArr = event.split(":");
								event = trim(funcNameArr[0]);
								thisFunc = trim(funcNameArr[1]);
							}else{
								event = trim(event);
							}
							if(!thisFunc){
								thisFunc = event;
							}
							this.connect(baseNode, event, thisFunc);
						}
					}
				}

				// waiRole, waiState
				var role = getAttrFunc(baseNode, "waiRole");
				if(role){
					dijit.setWaiRole(baseNode, role);
				}
				var values = getAttrFunc(baseNode, "waiState");
				if(values){
					dojo.forEach(values.split(/\s*,\s*/), function(stateValue){
						if(stateValue.indexOf('-') != -1){
							var pair = stateValue.split('-');
							dijit.setWaiState(baseNode, pair[0], pair[1]);
						}
					});
				}
			}
		}
	}
);

// key is either templatePath or templateString; object is either string or DOM tree
dijit._Templated._templateCache = {};

dijit._Templated.getCachedTemplate = function(templatePath, templateString, alwaysUseString){
	// summary:
	//		Static method to get a template based on the templatePath or
	//		templateString key
	// templatePath: String
	//		The URL to get the template from. dojo.uri.Uri is often passed as well.
	// templateString: String?
	//		a string to use in lieu of fetching the template from a URL. Takes precedence
	//		over templatePath
	// Returns: Mixed
	//	Either string (if there are ${} variables that need to be replaced) or just
	//	a DOM tree (if the node can be cloned directly)

	// is it already cached?
	var tmplts = dijit._Templated._templateCache;
	var key = templateString || templatePath;
	var cached = tmplts[key];
	if(cached){
		if(!cached.ownerDocument || cached.ownerDocument == dojo.doc){
			// string or node of the same document
			return cached;
		}
		// destroy the old cached node of a different document
		dojo._destroyElement(cached);
	}

	// If necessary, load template string from template path
	if(!templateString){
		templateString = dijit._Templated._sanitizeTemplateString(dojo._getText(templatePath));
	}

	templateString = dojo.string.trim(templateString);

	if(alwaysUseString || templateString.match(/\$\{([^\}]+)\}/g)){
		// there are variables in the template so all we can do is cache the string
		return (tmplts[key] = templateString); //String
	}else{
		// there are no variables in the template so we can cache the DOM tree
		return (tmplts[key] = dijit._Templated._createNodesFromText(templateString)[0]); //Node
	}
};

dijit._Templated._sanitizeTemplateString = function(/*String*/tString){
	// summary: 
	//		Strips <?xml ...?> declarations so that external SVG and XML
	// 		documents can be added to a document without worry. Also, if the string
	//		is an HTML document, only the part inside the body tag is returned.
	if(tString){
		tString = tString.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, "");
		var matches = tString.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
		if(matches){
			tString = matches[1];
		}
	}else{
		tString = "";
	}
	return tString; //String
};


if(dojo.isIE){
	dojo.addOnWindowUnload(function(){
		var cache = dijit._Templated._templateCache;
		for(var key in cache){
			var value = cache[key];
			if(!isNaN(value.nodeType)){ // isNode equivalent
				dojo._destroyElement(value);
			}
			delete cache[key];
		}
	});
}

(function(){
	var tagMap = {
		cell: {re: /^<t[dh][\s\r\n>]/i, pre: "<table><tbody><tr>", post: "</tr></tbody></table>"},
		row: {re: /^<tr[\s\r\n>]/i, pre: "<table><tbody>", post: "</tbody></table>"},
		section: {re: /^<(thead|tbody|tfoot)[\s\r\n>]/i, pre: "<table>", post: "</table>"}
	};

	// dummy container node used temporarily to hold nodes being created
	var tn;

	dijit._Templated._createNodesFromText = function(/*String*/text){
		// summary:
		//	Attempts to create a set of nodes based on the structure of the passed text.

		if(tn && tn.ownerDocument != dojo.doc){
			// destroy dummy container of a different document
			dojo._destroyElement(tn);
			tn = undefined;
		}
		if(!tn){
			tn = dojo.doc.createElement("div");
			tn.style.display="none";
			dojo.body().appendChild(tn);
		}
		var tableType = "none";
		var rtext = text.replace(/^\s+/, "");
		for(var type in tagMap){
			var map = tagMap[type];
			if(map.re.test(rtext)){
				tableType = type;
				text = map.pre + text + map.post;
				break;
			}
		}

		tn.innerHTML = text;
		if(tn.normalize){
			tn.normalize();
		}

		var tag = { cell: "tr", row: "tbody", section: "table" }[tableType];
		var _parent = (typeof tag != "undefined") ?
						tn.getElementsByTagName(tag)[0] :
						tn;

		var nodes = [];
		while(_parent.firstChild){
			nodes.push(_parent.removeChild(_parent.firstChild));
		}
		tn.innerHTML="";
		return nodes;	//	Array
	}
})();

// These arguments can be specified for widgets which are used in templates.
// Since any widget can be specified as sub widgets in template, mix it
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget,{
	dojoAttachEvent: "",
	dojoAttachPoint: "",
	waiRole: "",
	waiState:""
})

}

if(!dojo._hasResource["dijit.layout.BorderContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.BorderContainer"] = true;
dojo.provide("dijit.layout.BorderContainer");




dojo.declare(
	"dijit.layout.BorderContainer",
//	[dijit._Widget, dijit._Container, dijit._Contained],
	dijit.layout._LayoutWidget,
{
	// summary:
	//	Provides layout in 5 regions, a center and borders along its 4 sides.
	//
	// description:
	//	A BorderContainer is a box with a specified size (like style="width: 500px; height: 500px;"),
	//	that contains a child widget marked region="center" and optionally children widgets marked
	//	region equal to "top", "bottom", "leading", "trailing", "left" or "right".
	//	Children along the edges will be laid out according to width or height dimensions.  The remaining
	//	space is designated for the center region.
	//	The outer size must be specified on the BorderContainer node.  Width must be specified for the sides
	//  and height for the top and bottom, respectively.  No dimensions should be specified on the center;
	//	it will fill the remaining space.  Regions named "leading" and "trailing" may be used just like
	//	"left" and "right" except that they will be reversed in right-to-left environments.
	//  Optional splitters may be specified on the edge widgets only to make them resizable by the user.
	//  NOTE: Splitters must not be more than 50 pixels in width.
	//
	// example:
	// |	<style>
	// |		html, body { height: 100%; width: 100%; }
	// |	</style>
	// |	<div dojoType="BorderContainer" design="sidebar" style="width: 100%; height: 100%">
	// |		<div dojoType="ContentPane" region="top">header text</div>
	// |		<div dojoType="ContentPane" region="right" style="width: 200px;">table of contents</div>
	// |		<div dojoType="ContentPane" region="center">client area</div>
	// |	</div>

	// design: String
	//  choose which design is used for the layout: "headline" (default) where the top and bottom extend
	//  the full width of the container, or "sidebar" where the left and right sides extend from top to bottom.
	design: "headline",

	// gutters: Boolean
	//	Give each pane a border and margin.
	//	Margin determined by domNode.paddingLeft.
	//	When false, only resizable panes have a gutter (i.e. draggable splitter) for resizing.
	gutters: true,

	// liveSplitters: Boolean
	//  specifies whether splitters resize as you drag (true) or only upon mouseup (false)
	liveSplitters: true,

	// persist: Boolean
	//		Save splitter positions in a cookie.
	persist: false,	// Boolean

	baseClass: "dijitBorderContainer",

	// _splitterClass: String
	// 		Optional hook to override the default Splitter widget used by BorderContainer
	_splitterClass: "dijit.layout._Splitter",

	postMixInProperties: function(){
		// change class name to indicate that BorderContainer is being used purely for
		// layout (like LayoutContainer) rather than for pretty formatting.
		if(!this.gutters){
			this.baseClass += "NoGutter";
		}
		this.inherited(arguments);
	},

	postCreate: function(){
		this.inherited(arguments);

		this._splitters = {};
		this._splitterThickness = {};
	},

	startup: function(){
		if(this._started){ return; }
		dojo.forEach(this.getChildren(), this._setupChild, this);
		this.inherited(arguments);
	},

	_setupChild: function(/*Widget*/child){
		var region = child.region;
		if(region){
			this.inherited(arguments);

			dojo.addClass(child.domNode, this.baseClass+"Pane");

			var ltr = this.isLeftToRight();
			if(region == "leading"){ region = ltr ? "left" : "right"; }
			if(region == "trailing"){ region = ltr ? "right" : "left"; }

			//FIXME: redundant?
			this["_"+region] = child.domNode;
			this["_"+region+"Widget"] = child;

			// Create draggable splitter for resizing pane,
			// or alternately if splitter=false but BorderContainer.gutters=true then
			// insert dummy div just for spacing
			if((child.splitter || this.gutters) && !this._splitters[region]){
				var _Splitter = dojo.getObject(child.splitter ? this._splitterClass : "dijit.layout._Gutter");
				var flip = {left:'right', right:'left', top:'bottom', bottom:'top', leading:'trailing', trailing:'leading'};
				var splitter = new _Splitter({
					container: this,
					child: child,
					region: region,
					oppNode: dojo.query('[region=' + flip[child.region] + ']', this.domNode)[0],
					live: this.liveSplitters
				});
				splitter.isSplitter = true;
				this._splitters[region] = splitter.domNode;
				dojo.place(this._splitters[region], child.domNode, "after");

				// Splitters arent added as Contained children, so we need to call startup explicitly
				splitter.startup();
			}
			child.region = region;
		}
	},

	_computeSplitterThickness: function(region){
		this._splitterThickness[region] = this._splitterThickness[region] ||
			dojo.marginBox(this._splitters[region])[(/top|bottom/.test(region) ? 'h' : 'w')];
	},

	layout: function(){
		for(var region in this._splitters){ this._computeSplitterThickness(region); }
		this._layoutChildren();
	},

	addChild: function(/*Widget*/ child, /*Integer?*/ insertIndex){
		this.inherited(arguments);
		if(this._started){
			this._layoutChildren(); //OPT
		}
	},

	removeChild: function(/*Widget*/ child){
		var region = child.region;
		var splitter = this._splitters[region];
		if(splitter){
			dijit.byNode(splitter).destroy();
			delete this._splitters[region];
			delete this._splitterThickness[region];
		}
		this.inherited(arguments);
		delete this["_"+region];
		delete this["_" +region+"Widget"];
		if(this._started){
			this._layoutChildren(child.region);
		}
		dojo.removeClass(child.domNode, this.baseClass+"Pane");
	},

	getChildren: function(){
		return dojo.filter(this.inherited(arguments), function(widget){
			return !widget.isSplitter;
		});
	},

	getSplitter: function(/*String*/region){
		// summary: returns the widget responsible for rendering the splitter associated with region 
		var splitter = this._splitters[region];
		return splitter ? dijit.byNode(splitter) : null;
	},

	resize: function(newSize, currentSize){
		// resetting potential padding to 0px to provide support for 100% width/height + padding
		// TODO: this hack doesn't respect the box model and is a temporary fix
		if (!this.cs || !this.pe){
			var node = this.domNode;
			this.cs = dojo.getComputedStyle(node);
			this.pe = dojo._getPadExtents(node, this.cs);
			this.pe.r = dojo._toPixelValue(node, this.cs.paddingRight);
			this.pe.b = dojo._toPixelValue(node, this.cs.paddingBottom);

			dojo.style(node, "padding", "0px");
		}

		this.inherited(arguments);
	},

	_layoutChildren: function(/*String?*/changedRegion){
		var sidebarLayout = (this.design == "sidebar");
		var topHeight = 0, bottomHeight = 0, leftWidth = 0, rightWidth = 0;
		var topStyle = {}, leftStyle = {}, rightStyle = {}, bottomStyle = {},
			centerStyle = (this._center && this._center.style) || {};

		var changedSide = /left|right/.test(changedRegion);

		var layoutSides = !changedRegion || (!changedSide && !sidebarLayout);
		var layoutTopBottom = !changedRegion || (changedSide && sidebarLayout);

		// Ask browser for width/height of side panes.
		// Would be nice to cache this but height can change according to width
		// (because words wrap around).  I don't think width will ever change though
		// (except when the user drags a splitter). 
		if(this._top){
			topStyle = layoutTopBottom && this._top.style;
			topHeight = dojo.marginBox(this._top).h;
		}
		if(this._left){
			leftStyle = layoutSides && this._left.style;
			leftWidth = dojo.marginBox(this._left).w;
		}
		if(this._right){
			rightStyle = layoutSides && this._right.style;
			rightWidth = dojo.marginBox(this._right).w;
		}
		if(this._bottom){
			bottomStyle = layoutTopBottom && this._bottom.style;
			bottomHeight = dojo.marginBox(this._bottom).h;
		}

		var splitters = this._splitters;
		var topSplitter = splitters.top, bottomSplitter = splitters.bottom,
			leftSplitter = splitters.left, rightSplitter = splitters.right;
		var splitterThickness = this._splitterThickness;
		var topSplitterThickness = splitterThickness.top || 0,
			leftSplitterThickness = splitterThickness.left || 0,
			rightSplitterThickness = splitterThickness.right || 0,
			bottomSplitterThickness = splitterThickness.bottom || 0;

		// Check for race condition where CSS hasn't finished loading, so
		// the splitter width == the viewport width (#5824)
		if(leftSplitterThickness > 50 || rightSplitterThickness > 50){
			setTimeout(dojo.hitch(this, function(){
				// Results are invalid.  Clear them out.
				this._splitterThickness = {};

				for(var region in this._splitters){
					this._computeSplitterThickness(region);
				}
				this._layoutChildren();
			}), 50);
			return false;
		}

		var pe = this.pe;

		var splitterBounds = {
			left: (sidebarLayout ? leftWidth + leftSplitterThickness: 0) + pe.l + "px",
			right: (sidebarLayout ? rightWidth + rightSplitterThickness: 0) + pe.r + "px"
		};

		if(topSplitter){
			dojo.mixin(topSplitter.style, splitterBounds);
			topSplitter.style.top = topHeight + pe.t + "px";
		}

		if(bottomSplitter){
			dojo.mixin(bottomSplitter.style, splitterBounds);
			bottomSplitter.style.bottom = bottomHeight + pe.b + "px";
		}

		splitterBounds = {
			top: (sidebarLayout ? 0 : topHeight + topSplitterThickness) + pe.t + "px",
			bottom: (sidebarLayout ? 0 : bottomHeight + bottomSplitterThickness) + pe.b + "px"
		};

		if(leftSplitter){
			dojo.mixin(leftSplitter.style, splitterBounds);
			leftSplitter.style.left = leftWidth + pe.l + "px";
		}

		if(rightSplitter){
			dojo.mixin(rightSplitter.style, splitterBounds);
			rightSplitter.style.right = rightWidth + pe.r +  "px";
		}

		dojo.mixin(centerStyle, {
			top: pe.t + topHeight + topSplitterThickness + "px",
			left: pe.l + leftWidth + leftSplitterThickness + "px",
			right: pe.r + rightWidth + rightSplitterThickness + "px",
			bottom: pe.b + bottomHeight + bottomSplitterThickness + "px"
		});

		var bounds = {
			top: sidebarLayout ? pe.t + "px" : centerStyle.top,
			bottom: sidebarLayout ? pe.b + "px" : centerStyle.bottom
		};
		dojo.mixin(leftStyle, bounds);
		dojo.mixin(rightStyle, bounds);
		leftStyle.left = pe.l + "px"; rightStyle.right = pe.r + "px"; topStyle.top = pe.t + "px"; bottomStyle.bottom = pe.b + "px";
		if(sidebarLayout){
			topStyle.left = bottomStyle.left = leftWidth + leftSplitterThickness + pe.l + "px";
			topStyle.right = bottomStyle.right = rightWidth + rightSplitterThickness + pe.r + "px";
		}else{
			topStyle.left = bottomStyle.left = pe.l + "px";
			topStyle.right = bottomStyle.right = pe.r + "px";
		}

		// More calculations about sizes of panes
		var containerHeight = this._borderBox.h - pe.t - pe.b,
			middleHeight = containerHeight - ( topHeight + topSplitterThickness + bottomHeight + bottomSplitterThickness),
			sidebarHeight = sidebarLayout ? containerHeight : middleHeight;

		var containerWidth = this._borderBox.w - pe.l - pe.r,
			middleWidth = containerWidth - (leftWidth  + leftSplitterThickness + rightWidth + rightSplitterThickness),
			sidebarWidth = sidebarLayout ? middleWidth : containerWidth;

		// New margin-box size of each pane
		var dim = {
			top:	{ w: sidebarWidth, h: topHeight },
			bottom: { w: sidebarWidth, h: bottomHeight },
			left:	{ w: leftWidth, h: sidebarHeight },
			right:	{ w: rightWidth, h: sidebarHeight },
			center:	{ h: middleHeight, w: middleWidth }
		};

		// Nodes in IE don't respond to t/l/b/r, and TEXTAREA doesn't respond in any browser
		var janky = dojo.isIE || dojo.some(this.getChildren(), function(child){
			return child.domNode.tagName == "TEXTAREA" || child.domNode.tagName == "INPUT";
		});
		if(janky){
			// Set the size of the children the old fashioned way, by setting
			// CSS width and height

			var resizeWidget = function(widget, changes, result){
				if(widget){
					(widget.resize ? widget.resize(changes, result) : dojo.marginBox(widget.domNode, changes));
				}
			};

			if(leftSplitter){ leftSplitter.style.height = sidebarHeight; }
			if(rightSplitter){ rightSplitter.style.height = sidebarHeight; }
			resizeWidget(this._leftWidget, {h: sidebarHeight}, dim.left);
			resizeWidget(this._rightWidget, {h: sidebarHeight}, dim.right);

			if(topSplitter){ topSplitter.style.width = sidebarWidth; }
			if(bottomSplitter){ bottomSplitter.style.width = sidebarWidth; }
			resizeWidget(this._topWidget, {w: sidebarWidth}, dim.top);
			resizeWidget(this._bottomWidget, {w: sidebarWidth}, dim.bottom);

			resizeWidget(this._centerWidget, dim.center);
		}else{
			// We've already sized the children by setting style.top/bottom/left/right...
			// Now just need to call resize() on those children telling them their new size,
			// so they can re-layout themselves

			// Calculate which panes need a notification
			var resizeList = {};
			if(changedRegion){
				resizeList[changedRegion] = resizeList.center = true;
				if(/top|bottom/.test(changedRegion) && this.design != "sidebar"){
					resizeList.left = resizeList.right = true;
				}else if(/left|right/.test(changedRegion) && this.design == "sidebar"){
					resizeList.top = resizeList.bottom = true;
				}
			}

			dojo.forEach(this.getChildren(), function(child){
				if(child.resize && (!changedRegion || child.region in resizeList)){
					child.resize(null, dim[child.region]);
				}
			}, this);
		}
	},

	destroy: function(){
		for(region in this._splitters){
			var splitter = this._splitters[region];
			dijit.byNode(splitter).destroy();
			dojo._destroyElement(splitter);
		}
		delete this._splitters;
		delete this._splitterThickness;
		this.inherited(arguments);
	}
});

// This argument can be specified for the children of a BorderContainer.
// Since any widget can be specified as a LayoutContainer child, mix it
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget, {
	// region: String
	//		"top", "bottom", "leading", "trailing", "left", "right", "center".
	//		See the BorderContainer description for details on this parameter.
	region: '',

	// splitter: Boolean
	splitter: false,

	// minSize: Number
	minSize: 0,

	// maxSize: Number
	maxSize: Infinity
});



dojo.declare("dijit.layout._Splitter", [ dijit._Widget, dijit._Templated ],
{
/*=====
	container: null,
	child: null,
	region: null,
=====*/

	// live: Boolean
	//		If true, the child's size changes and the child widget is redrawn as you drag the splitter;
	//		otherwise, the size doesn't change until you drop the splitter (by mouse-up)
	live: true,

	// summary: A draggable spacer between two items in a BorderContainer
	templateString: '<div class="dijitSplitter" dojoAttachEvent="onkeypress:_onKeyPress,onmousedown:_startDrag" tabIndex="0" waiRole="separator"><div class="dijitSplitterThumb"></div></div>',

	postCreate: function(){
		this.inherited(arguments);
		this.horizontal = /top|bottom/.test(this.region);
		dojo.addClass(this.domNode, "dijitSplitter" + (this.horizontal ? "H" : "V"));
//		dojo.addClass(this.child.domNode, "dijitSplitterPane");
//		dojo.setSelectable(this.domNode, false); //TODO is this necessary?

		this._factor = /top|left/.test(this.region) ? 1 : -1;
		this._minSize = this.child.minSize;

		// trigger constraints calculations
		this.child.domNode._recalc = true;
		this.connect(this.container, "resize", function(){ this.child.domNode._recalc = true; });

		this._cookieName = this.container.id + "_" + this.region;
		if(this.container.persist){
			// restore old size
			var persistSize = dojo.cookie(this._cookieName);
			if(persistSize){
				this.child.domNode.style[this.horizontal ? "height" : "width"] = persistSize;
			}
		}
	},

	_computeMaxSize: function(){
		var dim = this.horizontal ? 'h' : 'w',
			thickness = this.container._splitterThickness[this.region];
		var available = dojo.contentBox(this.container.domNode)[dim] -
			(this.oppNode ? dojo.marginBox(this.oppNode)[dim] : 0) -
			20 - thickness * 2;
		this._maxSize = Math.min(this.child.maxSize, available);
	},

	_startDrag: function(e){
		if(this.child.domNode._recalc){
			this._computeMaxSize();
			this.child.domNode._recalc = false;
		}

		if(!this.cover){
			this.cover = dojo.doc.createElement('div');
			dojo.addClass(this.cover, "dijitSplitterCover");
			dojo.place(this.cover, this.child.domNode, "after");
		}else{
			this.cover.style.zIndex = 1;
		}

		// Safeguard in case the stop event was missed.  Shouldn't be necessary if we always get the mouse up.
		if(this.fake){ dojo._destroyElement(this.fake); }
		if(!(this._resize = this.live)){ //TODO: disable live for IE6?
			// create fake splitter to display at old position while we drag
			(this.fake = this.domNode.cloneNode(true)).removeAttribute("id");
			dojo.addClass(this.domNode, "dijitSplitterShadow");
			dojo.place(this.fake, this.domNode, "after");
		}
		dojo.addClass(this.domNode, "dijitSplitterActive");

		//Performance: load data info local vars for onmousevent function closure
		var factor = this._factor,
			max = this._maxSize,
			min = this._minSize || 20,
			isHorizontal = this.horizontal,
			axis = isHorizontal ? "pageY" : "pageX",
			pageStart = e[axis],
			splitterStyle = this.domNode.style,
			dim = isHorizontal ? 'h' : 'w',
			childStart = dojo.marginBox(this.child.domNode)[dim],
			region = this.region,
			splitterStart = parseInt(this.domNode.style[region], 10),
			resize = this._resize,
			mb = {},
			childNode = this.child.domNode,
			layoutFunc = dojo.hitch(this.container, this.container._layoutChildren),
			de = dojo.doc.body;

		this._handlers = (this._handlers || []).concat([
			dojo.connect(de, "onmousemove", this._drag = function(e, forceResize){
				var delta = e[axis] - pageStart,
					childSize = factor * delta + childStart,
					boundChildSize = Math.max(Math.min(childSize, max), min);

				if(resize || forceResize){
					mb[dim] = boundChildSize;
					// TODO: inefficient; we set the marginBox here and then immediately layoutFunc() needs to query it
					dojo.marginBox(childNode, mb);
					layoutFunc(region);
				}
				splitterStyle[region] = factor * delta + splitterStart + (boundChildSize - childSize) + "px";
			}),
			dojo.connect(de, "onmouseup", this, "_stopDrag")
		]);
		dojo.stopEvent(e);
	},

	_stopDrag: function(e){
		try{
			if(this.cover){ this.cover.style.zIndex = -1; }
			if(this.fake){ dojo._destroyElement(this.fake); }
			dojo.removeClass(this.domNode, "dijitSplitterActive");
			dojo.removeClass(this.domNode, "dijitSplitterShadow");
			this._drag(e); //TODO: redundant with onmousemove?
			this._drag(e, true);
		}finally{
			this._cleanupHandlers();
			if(this.oppNode){ this.oppNode._recalc = true; }
			delete this._drag;
		}

		if(this.container.persist){
			dojo.cookie(this._cookieName, this.child.domNode.style[this.horizontal ? "height" : "width"], {expires:365});
		}
	},

	_cleanupHandlers: function(){
		dojo.forEach(this._handlers, dojo.disconnect);
		delete this._handlers;
	},

	_onKeyPress: function(/*Event*/ e){
		if(this.child.domNode._recalc){
			this._computeMaxSize();
			this.child.domNode._recalc = false;
		}

		// should we apply typematic to this?
		this._resize = true;
		var horizontal = this.horizontal;
		var tick = 1;
		var dk = dojo.keys;
		switch(e.charOrCode){
			case horizontal ? dk.UP_ARROW : dk.LEFT_ARROW:
				tick *= -1;
//				break;
			case horizontal ? dk.DOWN_ARROW : dk.RIGHT_ARROW:
				break;
			default:
//				this.inherited(arguments);
				return;
		}
		var childSize = dojo.marginBox(this.child.domNode)[ horizontal ? 'h' : 'w' ] + this._factor * tick;
		var mb = {};
		mb[ this.horizontal ? "h" : "w"] = Math.max(Math.min(childSize, this._maxSize), this._minSize);
		dojo.marginBox(this.child.domNode, mb);
		if(this.oppNode){ this.oppNode._recalc = true; }
		this.container._layoutChildren(this.region);
		dojo.stopEvent(e);
	},

	destroy: function(){
		this._cleanupHandlers();
		delete this.child;
		delete this.container;
		delete this.fake;
		this.inherited(arguments);
	}
});

dojo.declare("dijit.layout._Gutter", [dijit._Widget, dijit._Templated ],
{
	// summary:
	// 		Just a spacer div to separate side pane from center pane.
	//		Basically a trick to lookup the gutter/splitter width from the theme.

	templateString: '<div class="dijitGutter" waiRole="presentation"></div>',

	postCreate: function(){
		this.horizontal = /top|bottom/.test(this.region);
		dojo.addClass(this.domNode, "dijitGutter" + (this.horizontal ? "H" : "V"));
	}
});

}

if(!dojo._hasResource["dijit.form._FormWidget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._FormWidget"] = true;
dojo.provide("dijit.form._FormWidget");




dojo.declare("dijit.form._FormWidget", [dijit._Widget, dijit._Templated],
	{
	//
	// summary:
	//	_FormWidget's correspond to native HTML elements such as <checkbox> or <button>.
	//
	// description:
	//		Each _FormWidget represents a single HTML element.
	//		All these widgets should have these attributes just like native HTML input elements.
	//		You can set them during widget construction.
	//
	//	They also share some common methods.
	//
	// baseClass: String
	//		Root CSS class of the widget (ex: dijitTextBox), used to add CSS classes of widget
	//		(ex: "dijitTextBox dijitTextBoxInvalid dijitTextBoxFocused dijitTextBoxInvalidFocused")
	//		See _setStateClass().
	baseClass: "",

	// name: String
	//		Name used when submitting form; same as "name" attribute or plain HTML elements
	name: "",

	// alt: String
	//		Corresponds to the native HTML <input> element's attribute.
	alt: "",

	// value: String
	//		Corresponds to the native HTML <input> element's attribute.
	value: "",

	// type: String
	//		Corresponds to the native HTML <input> element's attribute.
	type: "text",

	// tabIndex: Integer
	//		Order fields are traversed when user hits the tab key
	tabIndex: "0",

	// disabled: Boolean
	//		Should this widget respond to user input?
	//		In markup, this is specified as "disabled='disabled'", or just "disabled".
	disabled: false,

	// readOnly: Boolean
	//		Should this widget respond to user input?
	//		In markup, this is specified as "readOnly".
	//		Similar to disabled except readOnly form values are submitted
	readOnly: false,

	// intermediateChanges: Boolean
	//		Fires onChange for each value change or only on demand
	intermediateChanges: false,

	// These mixins assume that the focus node is an INPUT, as many but not all _FormWidgets are.
	// Don't attempt to mixin the 'type', 'name' attributes here programatically -- they must be declared
	// directly in the template as read by the parser in order to function. IE is known to specifically 
	// require the 'name' attribute at element creation time.
	attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap),
		{value:"focusNode", disabled:"focusNode", readOnly:"focusNode", id:"focusNode", tabIndex:"focusNode", alt:"focusNode"}),

	_setDisabledAttr: function(/*Boolean*/ value){
		this.disabled = value;
		dojo.attr(this.focusNode, 'disabled', value);
		dijit.setWaiState(this.focusNode, "disabled", value);

				if(value){
					//reset those, because after the domNode is disabled, we can no longer receive
					//mouse related events, see #4200
					this._hovering = false;
					this._active = false;
					// remove the tabIndex, especially for FF
					this.focusNode.removeAttribute('tabIndex');
				}else{
					this.focusNode.setAttribute('tabIndex', this.tabIndex);
				}
				this._setStateClass();
	},

	setDisabled: function(/*Boolean*/ disabled){
		// summary:
		//		Set disabled state of widget (Deprecated).
		dojo.deprecated("setDisabled("+disabled+") is deprecated. Use attr('disabled',"+disabled+") instead.", "", "2.0");
		this.attr('disabled', disabled);
	},


	_scroll: true,
	_onFocus: function(e){
		if(this._scroll){
			dijit.scrollIntoView(this.domNode);
		}
		this.inherited(arguments);
	},

	_onMouse : function(/*Event*/ event){
		// summary:
		//	Sets _hovering, _active, and stateModifier properties depending on mouse state,
		//	then calls setStateClass() to set appropriate CSS classes for this.domNode.
		//
		//	To get a different CSS class for hover, send onmouseover and onmouseout events to this method.
		//	To get a different CSS class while mouse button is depressed, send onmousedown to this method.

		var mouseNode = event.currentTarget;
		if(mouseNode && mouseNode.getAttribute){
			this.stateModifier = mouseNode.getAttribute("stateModifier") || "";
		}

		if(!this.disabled){
			switch(event.type){
				case "mouseenter":	
				case "mouseover":
					this._hovering = true;
					this._active = this._mouseDown;
					break;

				case "mouseout":
				case "mouseleave":
					this._hovering = false;
					this._active = false;
					break;

				case "mousedown" :
					this._active = true;
					this._mouseDown = true;
					// set a global event to handle mouseup, so it fires properly
					//	even if the cursor leaves the button
					var mouseUpConnector = this.connect(dojo.body(), "onmouseup", function(){
						//if user clicks on the button, even if the mouse is released outside of it,
						//this button should get focus (which mimics native browser buttons)
						if(this._mouseDown && this.isFocusable()){
							this.focus();
						}
						this._active = false;
						this._mouseDown = false;
						this._setStateClass();
						this.disconnect(mouseUpConnector);
					});
					break;
			}
			this._setStateClass();
		}
	},

	isFocusable: function(){
		return !this.disabled && !this.readOnly && this.focusNode && (dojo.style(this.domNode, "display") != "none");
	},

	focus: function(){
		dijit.focus(this.focusNode);
	},

	_setStateClass: function(){
		// summary
		//	Update the visual state of the widget by setting the css classes on this.domNode
		//  (or this.stateNode if defined) by combining this.baseClass with
		//	various suffixes that represent the current widget state(s).
		//
		//	In the case where a widget has multiple
		//	states, it sets the class based on all possible
		//  combinations.  For example, an invalid form widget that is being hovered
		//	will be "dijitInput dijitInputInvalid dijitInputHover dijitInputInvalidHover".
		//
		//	For complex widgets with multiple regions, there can be various hover/active states,
		//	such as "Hover" or "CloseButtonHover" (for tab buttons).
		//	This is controlled by a stateModifier="CloseButton" attribute on the close button node.
		//
		//	The widget may have one or more of the following states, determined
		//	by this.state, this.checked, this.valid, and this.selected:
		//		Error - ValidationTextBox sets this.state to "Error" if the current input value is invalid
		//		Checked - ex: a checkmark or a ToggleButton in a checked state, will have this.checked==true
		//		Selected - ex: currently selected tab will have this.selected==true
		//
		//	In addition, it may have one or more of the following states,
		//	based on this.disabled and flags set in _onMouse (this._active, this._hovering, this._focused):
		//		Disabled	- if the widget is disabled
		//		Active		- if the mouse (or space/enter key?) is being pressed down
		//		Focused		- if the widget has focus
		//		Hover		- if the mouse is over the widget

		// Compute new set of classes
		var newStateClasses = this.baseClass.split(" ");

		function multiply(modifier){
			newStateClasses = newStateClasses.concat(dojo.map(newStateClasses, function(c){ return c+modifier; }), "dijit"+modifier);
		}

		if(this.checked){
			multiply("Checked");
		}
		if(this.state){
			multiply(this.state);
		}
		if(this.selected){
			multiply("Selected");
		}

		if(this.disabled){
			multiply("Disabled");
		}else if(this.readOnly){
			multiply("ReadOnly");
		}else if(this._active){
			multiply(this.stateModifier+"Active");
		}else{
			if(this._focused){
				multiply("Focused");
			}
			if(this._hovering){
				multiply(this.stateModifier+"Hover");
			}
		}

		// Remove old state classes and add new ones.
		// For performance concerns we only write into domNode.className once.
		var tn = this.stateNode || this.domNode,
			classHash = {};	// set of all classes (state and otherwise) for node

		dojo.forEach(tn.className.split(" "), function(c){ classHash[c] = true; });

		if("_stateClasses" in this){
			dojo.forEach(this._stateClasses, function(c){ delete classHash[c]; });
		}

		dojo.forEach(newStateClasses, function(c){ classHash[c] = true; });

		var newClasses = [];
		for(var c in classHash){
			newClasses.push(c);
		}
		tn.className = newClasses.join(" ");

		this._stateClasses = newStateClasses;
	},

	compare: function(/*anything*/val1, /*anything*/val2){
		// summary: compare 2 values
		if((typeof val1 == "number") && (typeof val2 == "number")){
			return (isNaN(val1) && isNaN(val2))? 0 : (val1-val2);
		}else if(val1 > val2){ return 1; }
		else if(val1 < val2){ return -1; }
		else { return 0; }
	},

	onChange: function(newValue){
		// summary: callback when value is changed
	},

	_onChangeActive: false,

	_handleOnChange: function(/*anything*/ newValue, /*Boolean, optional*/ priorityChange){
		// summary: set the value of the widget.
		this._lastValue = newValue;
		if(this._lastValueReported == undefined && (priorityChange === null || !this._onChangeActive)){
			// this block executes not for a change, but during initialization,
			// and is used to store away the original value (or for ToggleButton, the original checked state)
			this._resetValue = this._lastValueReported = newValue;
		}
		if((this.intermediateChanges || priorityChange || priorityChange === undefined) && 
			((typeof newValue != typeof this._lastValueReported) ||
				this.compare(newValue, this._lastValueReported) != 0)){
			this._lastValueReported = newValue;
			if(this._onChangeActive){ this.onChange(newValue); }
		}
	},

	create: function(){
		this.inherited(arguments);
		this._onChangeActive = true;
		this._setStateClass();
	},
	
	destroy: function(){
		if(this._layoutHackHandle){
			clearTimeout(this._layoutHackHandle);
		}
		this.inherited(arguments);
	},

	setValue: function(/*String*/ value){
		dojo.deprecated("dijit.form._FormWidget:setValue("+value+") is deprecated.  Use attr('value',"+value+") instead.", "", "2.0");
		this.attr('value', value);
	},

	getValue: function(){
		dojo.deprecated(this.declaredClass+"::getValue() is deprecated. Use attr('value') instead.", "", "2.0");
		return this.attr('value');
	},

	_layoutHack: function(){
		// summary: work around table sizing bugs on FF2 by forcing redraw
		if(dojo.isFF == 2 && !this._layoutHackHandle){
			var node=this.domNode;
			var old = node.style.opacity;
			node.style.opacity = "0.999";
			this._layoutHackHandle = setTimeout(dojo.hitch(this, function(){
				this._layoutHackHandle = null;
				node.style.opacity = old;
			}), 0);
		}
	}
});

dojo.declare("dijit.form._FormValueWidget", dijit.form._FormWidget,
{
	/*
	Summary:
		_FormValueWidget's correspond to native HTML elements such as <input> or <select> that have user changeable values.
		Each _ValueWidget represents a single input value, and has a (possibly hidden) <input> element,
		to which it serializes its input value, so that form submission (either normal submission or via FormBind?)
		works as expected.
	*/

	// TODO: unclear what that {value: ""} is for; FormWidget.attributeMap copies value to focusNode,
	// so maybe {value: ""} is so the value *doesn't* get copied to focusNode?
	// Seems like we really want value removed from attributeMap altogether
	// (although there's no easy way to do that now)
	attributeMap: dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap),
		{value:""}),

	postCreate: function(){
		if(dojo.isIE || dojo.isSafari){ // IE won't stop the event with keypress and Safari won't send an ESCAPE to keypress at all
			this.connect(this.focusNode || this.domNode, "onkeydown", this._onKeyDown);
		}
		// Update our reset value if it hasn't yet been set (because this.attr
		// is only called when there *is* a value
		if(this._resetValue === undefined){
			this._resetValue = this.value;
		}
	},

	_setValueAttr: function(/*anything*/ newValue, /*Boolean, optional*/ priorityChange){
		// summary:
		//		Hook so attr('value', value) works.
		// description:
		//		Sets the value of the widget.
		//		If the value has changed, then fire onChange event, unless priorityChange
		//		is specified as null (or false?)
		this.value = newValue;
		this._handleOnChange(newValue, priorityChange);
	},

	_getValueAttr: function(/*String*/ value){
		// summary:
		//		Hook so attr('value') works.
		return this._lastValue;
	},

	undo: function(){
		// summary: restore the value to the last value passed to onChange
		this._setValueAttr(this._lastValueReported, false);
	},

	reset: function(){
		this._hasBeenBlurred = false;
		this._setValueAttr(this._resetValue, true);
	},

	_valueChanged: function(){
		var v = this.attr('value');
		var lv = this._lastValueReported;
		// Equality comparison of objects such as dates are done by reference so
		// two distinct objects are != even if they have the same data. So use
		// toStrings in case the values are objects.
		return ((v !== null && (v !== undefined) && v.toString)?v.toString():'') !== ((lv !== null && (lv !== undefined) && lv.toString)?lv.toString():'');
	},

	_onKeyDown: function(e){
		if(e.keyCode == dojo.keys.ESCAPE && !e.ctrlKey && !e.altKey){
			var te;
			if(dojo.isIE){ 
				e.preventDefault(); // default behavior needs to be stopped here since keypress is too late
				te = document.createEventObject();
				te.keyCode = dojo.keys.ESCAPE;
				te.shiftKey = e.shiftKey;
				e.srcElement.fireEvent('onkeypress', te);
			}else if(dojo.isSafari){ // ESCAPE needs help making it into keypress
				te = document.createEvent('Events');
				te.initEvent('keypress', true, true);
				te.keyCode = dojo.keys.ESCAPE;
				te.shiftKey = e.shiftKey;
				e.target.dispatchEvent(te);
			}
		}
	},

	_onKeyPress: function(e){
		if(e.charOrCode == dojo.keys.ESCAPE && !e.ctrlKey && !e.altKey && this._valueChanged()){
			this.undo();
			dojo.stopEvent(e);
			return false;
		}else if(this.intermediateChanges){
			var _this = this;
			// the setTimeout allows the key to post to the widget input box
			setTimeout(function(){ _this._handleOnChange(_this.attr('value'), false); }, 0);
		}
		return true;
	}
});

}

if(!dojo._hasResource["dijit.form.Button"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.Button"] = true;
dojo.provide("dijit.form.Button");




dojo.declare("dijit.form.Button",
	dijit.form._FormWidget,
	{
	// summary:
	//		Basically the same thing as a normal HTML button, but with special styling.
	// description:
	//		Buttons can display a label, an icon, or both.
	//		A label should always be specified (through innerHTML) or the label
	//		attribute.  It can be hidden via showLabel=false.
	// example:
	// |	<button dojoType="dijit.form.Button" onClick="...">Hello world</button>
	// 
	// example:
	// |	var button1 = new dijit.form.Button({label: "hello world", onClick: foo});
	// |	dojo.body().appendChild(button1.domNode);

	// label: HTML String
	//		Text to display in button.
	//		If the label is hidden (showLabel=false) then and no title has
	//		been specified, then label is also set as title attribute of icon.
	label: "",

	// showLabel: Boolean
	//		Set this to true to hide the label text and display only the icon.
	//		(If showLabel=false then iconClass must be specified.)
	//		Especially useful for toolbars.  
	//		If showLabel=true, the label will become the title (a.k.a. tooltip/hint) of the icon.
	//
	//		The exception case is for computers in high-contrast mode, where the label
	//		will still be displayed, since the icon doesn't appear.
	showLabel: true,

	// iconClass: String
	//		Class to apply to div in button to make it display an icon
	iconClass: "",

	type: "button",
	baseClass: "dijitButton",
	templateString:"<span class=\"dijit dijitReset dijitLeft dijitInline\"\n\tdojoAttachEvent=\"ondijitclick:_onButtonClick,onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\"\n\t><span class=\"dijitReset dijitRight dijitInline\"\n\t\t><span class=\"dijitReset dijitInline dijitButtonNode\"\n\t\t\t><button class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\t\tdojoAttachPoint=\"titleNode,focusNode\" \n\t\t\t\tname=\"${name}\" type=\"${type}\" waiRole=\"button\" waiState=\"labelledby-${id}_label\"\n\t\t\t\t><span class=\"dijitReset dijitInline\" dojoAttachPoint=\"iconNode\" \n\t\t\t\t\t><span class=\"dijitReset dijitToggleButtonIconChar\">&#10003;</span \n\t\t\t\t></span \n\t\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\" \n\t\t\t\t\tid=\"${id}_label\"  \n\t\t\t\t\tdojoAttachPoint=\"containerNode\"\n\t\t\t\t></span\n\t\t\t></button\n\t\t></span\n\t></span\n></span>\n",

	attributeMap: dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap), {
		label: {node: "containerNode", type: "innerHTML" },
		iconClass: {node: "iconNode", type: "class" }
	}),
		

	_onClick: function(/*Event*/ e){
		// summary: internal function to handle click actions
		if(this.disabled || this.readOnly){
			return false;
		}
		this._clicked(); // widget click actions
		return this.onClick(e); // user click actions
	},

	_onButtonClick: function(/*Event*/ e){
		// summary: callback when the user activates the button portion
		// if is activated via a keystroke, stop the event 
		if(e.type!='click'){
			dojo.stopEvent(e);
		}
		if(this._onClick(e) === false){ // returning nothing is same as true
			e.preventDefault(); // needed for checkbox
		}else if(this.type=="submit" && !this.focusNode.form){ // see if a nonform widget needs to be signalled
			for(var node=this.domNode; node.parentNode/*#5935*/; node=node.parentNode){
				var widget=dijit.byNode(node);
				if(widget && typeof widget._onSubmit == "function"){
					widget._onSubmit(e);
					break;
				}
			}
		}
	},

	_fillContent: function(/*DomNode*/ source){
		// summary:
		//		If button label is specified as srcNodeRef.innerHTML rather than
		//		this.params.label, handle it here.
		if(source && !("label" in this.params)){
			this.attr('label', source.innerHTML);
		}
	},

	postCreate: function(){
		if (this.showLabel == false){
			dojo.addClass(this.containerNode,"dijitDisplayNone");
		}
		dojo.setSelectable(this.focusNode, false);
		this.inherited(arguments);
	},

	onClick: function(/*Event*/ e){
		// summary: user callback for when button is clicked
		//      if type="submit", return true to perform submit
		return true;
	},

	_clicked: function(/*Event*/ e){
		// summary: internal replaceable function for when the button is clicked
	},

	setLabel: function(/*String*/ content){
		dojo.deprecated("dijit.form.Button.setLabel() is deprecated.  Use attr('label', ...) instead.", "", "2.0");
		this.attr("label", content);
	},
	_setLabelAttr: function(/*String*/ content){
		// summary:
		//		Hook for attr('label', ...) to work.
		// description:
		//		Set the label (text) of the button; takes an HTML string.
		this.containerNode.innerHTML = this.label = content;
		this._layoutHack();
		if (this.showLabel == false && !this.params.title){
			this.titleNode.title = dojo.trim(this.containerNode.innerText || this.containerNode.textContent || '');
		}
	}		
});


dojo.declare("dijit.form.DropDownButton", [dijit.form.Button, dijit._Container], {
	// summary: A button with a popup
	//
	// example:
	// |	<button dojoType="dijit.form.DropDownButton" label="Hello world">
	// |		<div dojotype="dijit.Menu">...</div>
	// |	</button>
	//
	// example:
	// |	var button1 = new dijit.form.DropDownButton({ label: "hi", dropDown: new dijit.Menu(...) });
	// |	dojo.body().appendChild(button1);
	// 	
	
	baseClass : "dijitDropDownButton",

	templateString:"<span class=\"dijit dijitReset dijitLeft dijitInline\"\n\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse,onclick:_onDropDownClick,onkeydown:_onDropDownKeydown,onblur:_onDropDownBlur,onkeypress:_onKey\"\n\t><span class='dijitReset dijitRight dijitInline'\n\t\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\t\t><button class=\"dijitReset dijitStretch dijitButtonContents\" \n\t\t\t\ttype=\"${type}\" name=\"${name}\"\n\t\t\t\tdojoAttachPoint=\"focusNode,titleNode\" \n\t\t\t\twaiRole=\"button\" waiState=\"haspopup-true,labelledby-${id}_label\"\n\t\t\t\t><span class=\"dijitReset dijitInline\" \n\t\t\t\t\tdojoAttachPoint=\"iconNode\"\n\t\t\t\t></span\n\t\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"  \n\t\t\t\t\tdojoAttachPoint=\"containerNode,popupStateNode\" \n\t\t\t\t\tid=\"${id}_label\"\n\t\t\t\t></span\n\t\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\">&thinsp;</span\n\t\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\n\t\t\t></button\n\t\t></span\n\t></span\n></span>\n",

	_fillContent: function(){
		// my inner HTML contains both the button contents and a drop down widget, like
		// <DropDownButton>  <span>push me</span>  <Menu> ... </Menu> </DropDownButton>
		// The first node is assumed to be the button content. The widget is the popup.
		if(this.srcNodeRef){ // programatically created buttons might not define srcNodeRef
			//FIXME: figure out how to filter out the widget and use all remaining nodes as button
			//	content, not just nodes[0]
			var nodes = dojo.query("*", this.srcNodeRef);
			dijit.form.DropDownButton.superclass._fillContent.call(this, nodes[0]);

			// save pointer to srcNode so we can grab the drop down widget after it's instantiated
			this.dropDownContainer = this.srcNodeRef;
		}
	},

	startup: function(){
		if(this._started){ return; }

		// the child widget from srcNodeRef is the dropdown widget.  Insert it in the page DOM,
		// make it invisible, and store a reference to pass to the popup code.
		if(!this.dropDown){
			var dropDownNode = dojo.query("[widgetId]", this.dropDownContainer)[0];
			this.dropDown = dijit.byNode(dropDownNode);
			delete this.dropDownContainer;
		}
		dijit.popup.prepare(this.dropDown.domNode);

		this.inherited(arguments);
	},

	destroyDescendants: function(){
		if(this.dropDown){
			this.dropDown.destroyRecursive();
			delete this.dropDown;
		}
		this.inherited(arguments);
	},

	_onArrowClick: function(/*Event*/ e){
		// summary: callback when the user mouse clicks on menu popup node
		if(this.disabled || this.readOnly){ return; }
		this._toggleDropDown();
	},

	_onDropDownClick: function(/*Event*/ e){
		// on Firefox 2 on the Mac it is possible to fire onclick
		// by pressing enter down on a second element and transferring
		// focus to the DropDownButton;
		// we want to prevent opening our menu in this situation
		// and only do so if we have seen a keydown on this button;
		// e.detail != 0 means that we were fired by mouse
		var isMacFFlessThan3 = dojo.isFF && dojo.isFF < 3
			&& navigator.appVersion.indexOf("Macintosh") != -1;
		if(!isMacFFlessThan3 || e.detail != 0 || this._seenKeydown){
			this._onArrowClick(e);
		}
		this._seenKeydown = false;
	},

	_onDropDownKeydown: function(/*Event*/ e){
		this._seenKeydown = true;
	},

	_onDropDownBlur: function(/*Event*/ e){
		this._seenKeydown = false;
	},

	_onKey: function(/*Event*/ e){
		// summary: callback when the user presses a key on menu popup node
		if(this.disabled || this.readOnly){ return; }
		if(e.charOrCode == dojo.keys.DOWN_ARROW){
			if(!this.dropDown || this.dropDown.domNode.style.visibility=="hidden"){
				dojo.stopEvent(e);
				this._toggleDropDown();
			}
		}
	},

	_onBlur: function(){
		// summary: called magically when focus has shifted away from this widget and it's dropdown
		this._closeDropDown();
		// don't focus on button.  the user has explicitly focused on something else.
		this.inherited(arguments);
	},

	_toggleDropDown: function(){
		// summary: toggle the drop-down widget; if it is up, close it, if not, open it
		if(this.disabled || this.readOnly){ return; }
		dijit.focus(this.popupStateNode);
		var dropDown = this.dropDown;
		if(!dropDown){ return; }
		if(!this._opened){
			// If there's an href, then load that first, so we don't get a flicker
			if(dropDown.href && !dropDown.isLoaded){
				var self = this;
				var handler = dojo.connect(dropDown, "onLoad", function(){
					dojo.disconnect(handler);
					self._openDropDown();
				});
				dropDown._loadCheck(true);
				return;
			}else{
				this._openDropDown();
			}
		}else{
			this._closeDropDown();
		}
	},

	_openDropDown: function(){
		var dropDown = this.dropDown;
		var oldWidth=dropDown.domNode.style.width;
		var self = this;

		dijit.popup.open({
			parent: this,
			popup: dropDown,
			around: this.domNode,
			orient:
				// TODO: add user-defined positioning option, like in Tooltip.js
				this.isLeftToRight() ? {'BL':'TL', 'BR':'TR', 'TL':'BL', 'TR':'BR'}
				: {'BR':'TR', 'BL':'TL', 'TR':'BR', 'TL':'BL'},
			onExecute: function(){
				self._closeDropDown(true);
			},
			onCancel: function(){
				self._closeDropDown(true);
			},
			onClose: function(){
				dropDown.domNode.style.width = oldWidth;
				self.popupStateNode.removeAttribute("popupActive");
				self._opened = false;
			}
		});
		if(this.domNode.offsetWidth > dropDown.domNode.offsetWidth){
			var adjustNode = null;
			if(!this.isLeftToRight()){
				adjustNode = dropDown.domNode.parentNode;
				var oldRight = adjustNode.offsetLeft + adjustNode.offsetWidth;
			}
			// make menu at least as wide as the button
			dojo.marginBox(dropDown.domNode, {w: this.domNode.offsetWidth});
			if(adjustNode){
				adjustNode.style.left = oldRight - this.domNode.offsetWidth + "px";
			}
		}
		this.popupStateNode.setAttribute("popupActive", "true");
		this._opened=true;
		if(dropDown.focus){
			dropDown.focus();
		}
		// TODO: set this.checked and call setStateClass(), to affect button look while drop down is shown
	},
	
	_closeDropDown: function(/*Boolean*/ focus){
		if(this._opened){
			dijit.popup.close(this.dropDown);
			if(focus){ this.focus(); }
			this._opened = false;			
		}
	}
});

dojo.declare("dijit.form.ComboButton", dijit.form.DropDownButton, {
	// summary: A Normal Button with a DropDown
	//
	// example:
	// |	<button dojoType="dijit.form.ComboButton" onClick="...">
	// |		<span>Hello world</span>
	// |		<div dojoType="dijit.Menu">...</div>
	// |	</button>
	//
	// example:
	// |	var button1 = new dijit.form.ComboButton({label: "hello world", onClick: foo, dropDown: "myMenu"});
	// |	dojo.body().appendChild(button1.domNode);
	// 

	templateString:"<table class='dijit dijitReset dijitInline dijitLeft'\n\tcellspacing='0' cellpadding='0' waiRole=\"presentation\"\n\t><tbody waiRole=\"presentation\"><tr waiRole=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonContents dijitButtonNode\"\n\t\t\tdojoAttachEvent=\"ondijitclick:_onButtonClick,onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\"  dojoAttachPoint=\"titleNode\"\n\t\t\twaiRole=\"button\" waiState=\"labelledby-${id}_label\"\n\t\t\t><div class=\"dijitReset dijitInline\" dojoAttachPoint=\"iconNode\" waiRole=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitInline dijitButtonText\" id=\"${id}_label\" dojoAttachPoint=\"containerNode\" waiRole=\"presentation\"></div\n\t\t></td\n\t\t><td class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton'\n\t\t\tdojoAttachPoint=\"popupStateNode,focusNode\"\n\t\t\tdojoAttachEvent=\"ondijitclick:_onArrowClick, onkeypress:_onKey,onmouseenter:_onMouse,onmouseleave:_onMouse\"\n\t\t\tstateModifier=\"DownArrow\"\n\t\t\ttitle=\"${optionsTitle}\" name=\"${name}\"\n\t\t\twaiRole=\"button\" waiState=\"haspopup-true\"\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" waiRole=\"presentation\">&thinsp;</div\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" waiRole=\"presentation\">&#9660;</div\n\t\t></td\n\t></tr></tbody\n></table>\n",

	attributeMap: dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap), {
		id:"",
		name:"",
		tabIndex: ["focusNode", "titleNode"]
	}),

	// optionsTitle: String
	//  text that describes the options menu (accessibility)
	optionsTitle: "",

	baseClass: "dijitComboButton",

	_focusedNode: null,

	postCreate: function(){
		this.inherited(arguments);
		this._focalNodes = [this.titleNode, this.popupStateNode];
		dojo.forEach(this._focalNodes, dojo.hitch(this, function(node){
			if(dojo.isIE){
				this.connect(node, "onactivate", this._onNodeFocus);
				this.connect(node, "ondeactivate", this._onNodeBlur);
			}else{
				this.connect(node, "onfocus", this._onNodeFocus);
				this.connect(node, "onblur", this._onNodeBlur);
			}
		}));
	},

	focusFocalNode: function(node){
		// summary: Focus the focal node node.
		this._focusedNode = node;
		dijit.focus(node);
	},

	hasNextFocalNode: function(){
		// summary: Returns true if this widget has no node currently
		//		focused or if there is a node following the focused one.
		//		False is returned if the last node has focus.
		return this._focusedNode !== this.getFocalNodes()[1];
	},

	focusNext: function(){
		// summary: Focus the focal node following the current node with focus
		//		or the first one if no node currently has focus.
		this._focusedNode = this.getFocalNodes()[this._focusedNode ? 1 : 0];
		dijit.focus(this._focusedNode);
	},

	hasPrevFocalNode: function(){
		// summary: Returns true if this widget has no node currently
		//		focused or if there is a node before the focused one.
		//		False is returned if the first node has focus.
		return this._focusedNode !== this.getFocalNodes()[0];
	},

	focusPrev: function(){
		// summary: Focus the focal node before the current node with focus
		//		or the last one if no node currently has focus.
		this._focusedNode = this.getFocalNodes()[this._focusedNode ? 0 : 1];
		dijit.focus(this._focusedNode);
	},

	getFocalNodes: function(){
		// summary: Returns an array of focal nodes for this widget.
		return this._focalNodes;
	},

	_onNodeFocus: function(evt){
		this._focusedNode = evt.currentTarget;
		var fnc = this._focusedNode == this.focusNode ? "dijitDownArrowButtonFocused" : "dijitButtonContentsFocused";
		dojo.addClass(this._focusedNode, fnc);
	},

	_onNodeBlur: function(evt){
		var fnc = evt.currentTarget == this.focusNode ? "dijitDownArrowButtonFocused" : "dijitButtonContentsFocused";
		dojo.removeClass(evt.currentTarget, fnc);
	},

	_onBlur: function(){
		this.inherited(arguments);
		this._focusedNode = null;
	}
});

dojo.declare("dijit.form.ToggleButton", dijit.form.Button, {
	// summary:
	//	A button that can be in two states (checked or not).
	//	Can be base class for things like tabs or checkbox or radio buttons

	baseClass: "dijitToggleButton",

	// checked: Boolean
	//		Corresponds to the native HTML <input> element's attribute.
	//		In markup, specified as "checked='checked'" or just "checked".
	//		True if the button is depressed, or the checkbox is checked,
	//		or the radio button is selected, etc.
	checked: false,

	attributeMap: dojo.mixin(dojo.clone(dijit.form.Button.prototype.attributeMap),
		{checked:"focusNode"}),

	_clicked: function(/*Event*/ evt){
		this.attr('checked', !this.checked);
	},

	_setCheckedAttr: function(/*Boolean*/ value){
		this.checked = value;
		dojo.attr(this.focusNode || this.domNode, "checked", value);
		dijit.setWaiState(this.focusNode || this.domNode, "pressed", value);
		this._setStateClass();		
		this._handleOnChange(value, true);
	},

	setChecked: function(/*Boolean*/ checked){
		// summary:
		//	Programatically deselect the button
		dojo.deprecated("setChecked("+checked+") is deprecated. Use attr('checked',"+checked+") instead.", "", "2.0");
		this.attr('checked', checked);
	},
	
	reset: function(){
		this._hasBeenBlurred = false;

		// set checked state to original setting
		this.attr('checked', this.params.checked || false);
	}
});

}

if(!dojo._hasResource["dijit.Menu"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Menu"] = true;
dojo.provide("dijit.Menu");





dojo.declare("dijit.Menu",
	[dijit._Widget, dijit._Templated, dijit._KeyNavContainer],
	{
	// summary
	//	A context menu you can assign to multiple elements

	constructor: function(){
		this._bindings = [];
	},

	templateString:
			'<table class="dijit dijitMenu dijitReset dijitMenuTable" waiRole="menu" dojoAttachEvent="onkeypress:_onKeyPress">' +
				'<tbody class="dijitReset" dojoAttachPoint="containerNode"></tbody>'+
			'</table>',

	// targetNodeIds: String[]
	//	Array of dom node ids of nodes to attach to.
	//	Fill this with nodeIds upon widget creation and it becomes context menu for those nodes.
	targetNodeIds: [],

	// contextMenuForWindow: Boolean
	//	if true, right clicking anywhere on the window will cause this context menu to open;
	//	if false, must specify targetNodeIds
	contextMenuForWindow: false,

	// leftClickToOpen: Boolean
	//	If true, menu will open on left click instead of right click, similiar to a file menu.
	leftClickToOpen: false,
	
	// parentMenu: Widget
	// pointer to menu that displayed me
	parentMenu: null,

	// popupDelay: Integer
	//	number of milliseconds before hovering (without clicking) causes the popup to automatically open
	popupDelay: 500,

	// _contextMenuWithMouse: Boolean
	//	used to record mouse and keyboard events to determine if a context
	//	menu is being opened with the keyboard or the mouse
	_contextMenuWithMouse: false,

	postCreate: function(){
		if(this.contextMenuForWindow){
			this.bindDomNode(dojo.body());
		}else{
			dojo.forEach(this.targetNodeIds, this.bindDomNode, this);
		}
		this.connectKeyNavHandlers([dojo.keys.UP_ARROW], [dojo.keys.DOWN_ARROW]);
	},

	startup: function(){
		if(this._started){ return; }

		dojo.forEach(this.getChildren(), function(child){ child.startup(); });
		this.startupKeyNavChildren();

		this.inherited(arguments);
	},

	onExecute: function(){
		// summary: attach point for notification about when a menu item has been executed
	},

	onCancel: function(/*Boolean*/ closeAll){
		// summary: attach point for notification about when the user cancels the current menu
	},

	_moveToPopup: function(/*Event*/ evt){
		if(this.focusedChild && this.focusedChild.popup && !this.focusedChild.disabled){
			this.focusedChild._onClick(evt);
		}
	},

	_onKeyPress: function(/*Event*/ evt){
		// summary: Handle keyboard based menu navigation.
		if(evt.ctrlKey || evt.altKey){ return; }

		switch(evt.charOrCode){
			case dojo.keys.RIGHT_ARROW:
				this._moveToPopup(evt);
				dojo.stopEvent(evt);
				break;
			case dojo.keys.LEFT_ARROW:
				if(this.parentMenu){
					this.onCancel(false);
				}else{
					dojo.stopEvent(evt);
				}
				break;
		}
	},

	onItemHover: function(/*MenuItem*/ item){
		// summary: Called when cursor is over a MenuItem
		this.focusChild(item);

		if(this.focusedChild.popup && !this.focusedChild.disabled && !this.hover_timer){
			this.hover_timer = setTimeout(dojo.hitch(this, "_openPopup"), this.popupDelay);
		}
	},

	_onChildBlur: function(item){
		// summary: Close all popups that are open and descendants of this menu
		dijit.popup.close(item.popup);
		item._blur();
		this._stopPopupTimer();
	},

	onItemUnhover: function(/*MenuItem*/ item){
		// summary: Callback fires when mouse exits a MenuItem
	},

	_stopPopupTimer: function(){
		if(this.hover_timer){
			clearTimeout(this.hover_timer);
			this.hover_timer = null;
		}
	},

	_getTopMenu: function(){
		for(var top=this; top.parentMenu; top=top.parentMenu);
		return top;
	},

	onItemClick: function(/*Widget*/ item, /*Event*/ evt){
		// summary: user defined function to handle clicks on an item
		if(item.disabled){ return false; }

		if(item.popup){
			if(!this.is_open){
				this._openPopup();
			}
		}else{
			// before calling user defined handler, close hierarchy of menus
			// and restore focus to place it was when menu was opened
			this.onExecute();

			// user defined handler for click
			item.onClick(evt);
		}
	},

	// thanks burstlib!
	_iframeContentWindow: function(/* HTMLIFrameElement */iframe_el){
		// summary:
		//	Returns the window reference of the passed iframe
		var win = dijit.getDocumentWindow(dijit.Menu._iframeContentDocument(iframe_el)) ||
			// Moz. TODO: is this available when defaultView isn't?
			dijit.Menu._iframeContentDocument(iframe_el)['__parent__'] ||
			(iframe_el.name && dojo.doc.frames[iframe_el.name]) || null;
		return win;	//	Window
	},

	_iframeContentDocument: function(/* HTMLIFrameElement */iframe_el){
		// summary:
		//	Returns a reference to the document object inside iframe_el
		var doc = iframe_el.contentDocument // W3
			|| (iframe_el.contentWindow && iframe_el.contentWindow.document) // IE
			|| (iframe_el.name && dojo.doc.frames[iframe_el.name] && dojo.doc.frames[iframe_el.name].document)
			|| null;
		return doc;	//	HTMLDocument
	},

	bindDomNode: function(/*String|DomNode*/ node){
		// summary: attach menu to given node
		node = dojo.byId(node);

		//TODO: this is to support context popups in Editor.  Maybe this shouldn't be in dijit.Menu
		var win = dijit.getDocumentWindow(node.ownerDocument);
		if(node.tagName.toLowerCase()=="iframe"){
			win = this._iframeContentWindow(node);
			node = dojo.withGlobal(win, dojo.body);
		}

		// to capture these events at the top level,
		// attach to document, not body
		var cn = (node == dojo.body() ? dojo.doc : node);

		node[this.id] = this._bindings.push([
			dojo.connect(cn, (this.leftClickToOpen)?"onclick":"oncontextmenu", this, "_openMyself"),
			dojo.connect(cn, "onkeydown", this, "_contextKey"),
			dojo.connect(cn, "onmousedown", this, "_contextMouse")
		]);
	},

	unBindDomNode: function(/*String|DomNode*/ nodeName){
		// summary: detach menu from given node
		var node = dojo.byId(nodeName);
		if(node){
			var bid = node[this.id]-1, b = this._bindings[bid];
			dojo.forEach(b, dojo.disconnect);
			delete this._bindings[bid];
		}
	},

	_contextKey: function(e){
		this._contextMenuWithMouse = false;
		if(e.keyCode == dojo.keys.F10){
			dojo.stopEvent(e);
			if(e.shiftKey && e.type=="keydown"){
				// FF: copying the wrong property from e will cause the system
				// context menu to appear in spite of stopEvent. Don't know
				// exactly which properties cause this effect.
				var _e = { target: e.target, pageX: e.pageX, pageY: e.pageY };
				_e.preventDefault = _e.stopPropagation = function(){};
				// IE: without the delay, focus work in "open" causes the system
				// context menu to appear in spite of stopEvent.
				window.setTimeout(dojo.hitch(this, function(){ this._openMyself(_e); }), 1);
			}
		}
	},

	_contextMouse: function(e){
		this._contextMenuWithMouse = true;
	},

	_openMyself: function(/*Event*/ e){
		// summary:
		//		Internal function for opening myself when the user
		//		does a right-click or something similar

		if(this.leftClickToOpen&&e.button>0){
			return;
		}
		dojo.stopEvent(e);

		// Get coordinates.
		// if we are opening the menu with the mouse or on safari open
		// the menu at the mouse cursor
		// (Safari does not have a keyboard command to open the context menu
		// and we don't currently have a reliable way to determine
		// _contextMenuWithMouse on Safari)
		var x,y;
		if(dojo.isSafari || this._contextMenuWithMouse){
			x=e.pageX;
			y=e.pageY;
		}else{
			// otherwise open near e.target
			var coords = dojo.coords(e.target, true);
			x = coords.x + 10;
			y = coords.y + 10;
		}

		var self=this;
		var savedFocus = dijit.getFocus(this);
		function closeAndRestoreFocus(){
			// user has clicked on a menu or popup
			dijit.focus(savedFocus);
			dijit.popup.close(self);
		}
		dijit.popup.open({
			popup: this,
			x: x,
			y: y,
			onExecute: closeAndRestoreFocus,
			onCancel: closeAndRestoreFocus,
			orient: this.isLeftToRight() ? 'L' : 'R'
		});
		this.focus();

		this._onBlur = function(){
			this.inherited('_onBlur', arguments);
			// Usually the parent closes the child widget but if this is a context
			// menu then there is no parent
			dijit.popup.close(this);
			// don't try to restore focus; user has clicked another part of the screen
			// and set focus there
		}
	},

	onOpen: function(/*Event*/ e){
		// summary: Open menu relative to the mouse
		this.isShowingNow = true;
	},

	onClose: function(){
		// summary: callback when this menu is closed
		this._stopPopupTimer();
		this.parentMenu = null;
		this.isShowingNow = false;
		this.currentPopup = null;
		if(this.focusedChild){
			this._onChildBlur(this.focusedChild);
			this.focusedChild = null;
		}
	},

	_openPopup: function(){
		// summary: open the popup to the side of the current menu item
		this._stopPopupTimer();
		var from_item = this.focusedChild;
		var popup = from_item.popup;

		if(popup.isShowingNow){ return; }
		popup.parentMenu = this;
		var self = this;
		dijit.popup.open({
			parent: this,
			popup: popup,
			around: from_item.domNode,
			orient: this.isLeftToRight() ? {'TR': 'TL', 'TL': 'TR'} : {'TL': 'TR', 'TR': 'TL'},
			onCancel: function(){
				// called when the child menu is canceled
				dijit.popup.close(popup);
				from_item.focus();	// put focus back on my node
				self.currentPopup = null;
			}
		});

		this.currentPopup = popup;

		if(popup.focus){
			popup.focus();
		}
	},
	
	uninitialize: function(){
 		dojo.forEach(this.targetNodeIds, this.unBindDomNode, this);
 		this.inherited(arguments);
	}
}
);

dojo.declare("dijit.MenuItem",
	[dijit._Widget, dijit._Templated, dijit._Contained],
	{
	// summary: A line item in a Menu Widget

	// Make 3 columns
	//   icon, label, and expand arrow (BiDi-dependent) indicating sub-menu
	templateString:
		 '<tr class="dijitReset dijitMenuItem" dojoAttachPoint="focusNode" waiRole="menuitem" tabIndex="-1"'
		+'dojoAttachEvent="onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick">'
		+'<td class="dijitReset" waiRole="presentation"><div class="dijitMenuItemIcon" dojoAttachPoint="iconNode"></div></td>'
		+'<td class="dijitReset dijitMenuItemLabel" dojoAttachPoint="containerNode"></td>'
		+'<td class="dijitReset dijitMenuArrowCell" waiRole="presentation">'
			+'<div dojoAttachPoint="arrowWrapper" style="display: none">'
				+'<div class="dijitMenuExpand"></div>'
				+'<span class="dijitMenuExpandA11y">+</span>'
			+'</div>'
		+'</td>'
		+'</tr>',

	attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap), {
		label: {node: "containerNode", type: "innerHTML"},
		iconClass: {node: "iconNode", type: "class" }
	}),

	// label: String
	//	menu text
	label: '',

	// iconClass: String
	//		Class to apply to div in button to make it display an icon
	iconClass: "",

	// disabled: Boolean
	//  if true, the menu item is disabled
	//  if false, the menu item is enabled
	disabled: false,

	_fillContent: function(/*DomNode*/ source){
		// If button label is specified as srcNodeRef.innerHTML rather than
		// this.params.label, handle it here.
		if(source && !("label" in this.params)){
			this.attr('label', source.innerHTML);
		}
	},

	postCreate: function(){
		dojo.setSelectable(this.domNode, false);
		dojo.attr(this.containerNode, "id", this.id+"_text");
		dijit.setWaiState(this.domNode, "labelledby", this.id+"_text");
	},

	_onHover: function(){
		// summary: callback when mouse is moved onto menu item
		this.getParent().onItemHover(this);
	},

	_onUnhover: function(){
		// summary: callback when mouse is moved off of menu item

		// if we are unhovering the currently selected item
		// then unselect it
		this.getParent().onItemUnhover(this);
	},

	_onClick: function(evt){
		this.getParent().onItemClick(this, evt);
		dojo.stopEvent(evt);
	},

	onClick: function(/*Event*/ evt){
		// summary: User defined function to handle clicks
	},

	focus: function(){
		dojo.addClass(this.domNode, 'dijitMenuItemHover');
		try{
			dijit.focus(this.focusNode);
		}catch(e){
			// this throws on IE (at least) in some scenarios
		}
	},

	_blur: function(){
		dojo.removeClass(this.domNode, 'dijitMenuItemHover');
	},

	setLabel: function(/*String*/ content){
		dojo.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use attr('label', ...) instead.", "", "2.0");
		this.attr("label", content);
	},

	setDisabled: function(/*Boolean*/ disabled){
		dojo.deprecated("dijit.Menu.setDisabled() is deprecated.  Use attr('disabled', bool) instead.", "", "2.0");
		this.attr('disabled', disabled);
	},
	_setDisabledAttr: function(/*Boolean*/ value){
		// summary:
		//		Hook for attr('disabled', ...) to work.
		//		Enable or disable this menu item.
		this.disabled = value;
		dojo[value ? "addClass" : "removeClass"](this.domNode, 'dijitMenuItemDisabled');
		dijit.setWaiState(this.focusNode, 'disabled', value ? 'true' : 'false');
	}
});

dojo.declare("dijit.PopupMenuItem",
	dijit.MenuItem,
	{
	_fillContent: function(){
		// summary: The innerHTML contains both the menu item text and a popup widget
		// description: the first part holds the menu item text and the second part is the popup
		// example: 
		// |	<div dojoType="dijit.PopupMenuItem">
		// |		<span>pick me</span>
		// |		<popup> ... </popup>
		// |	</div>
		if(this.srcNodeRef){
			var nodes = dojo.query("*", this.srcNodeRef);
			dijit.PopupMenuItem.superclass._fillContent.call(this, nodes[0]);

			// save pointer to srcNode so we can grab the drop down widget after it's instantiated
			this.dropDownContainer = this.srcNodeRef;
		}
	},

	startup: function(){
		if(this._started){ return; }
		this.inherited(arguments);

		// we didn't copy the dropdown widget from the this.srcNodeRef, so it's in no-man's
		// land now.  move it to dojo.doc.body.
		if(!this.popup){
			var node = dojo.query("[widgetId]", this.dropDownContainer)[0];
			this.popup = dijit.byNode(node);
		}
		dojo.body().appendChild(this.popup.domNode);

		this.popup.domNode.style.display="none";
		dojo.style(this.arrowWrapper, "display", "");
		dijit.setWaiState(this.focusNode, "haspopup", "true");
	},
	
	destroyDescendants: function(){
		if(this.popup){
			this.popup.destroyRecursive();
			delete this.popup;
		}
		this.inherited(arguments);
	}
});

dojo.declare("dijit.MenuSeparator",
	[dijit._Widget, dijit._Templated, dijit._Contained],
	{
	// summary: A line between two menu items

	templateString: '<tr class="dijitMenuSeparator"><td colspan=3>'
			+'<div class="dijitMenuSeparatorTop"></div>'
			+'<div class="dijitMenuSeparatorBottom"></div>'
			+'</td></tr>',

	postCreate: function(){
		dojo.setSelectable(this.domNode, false);
	},
	
	isFocusable: function(){
		// summary: over ride to always return false
		return false; // Boolean
	}
});

dojo.declare("dijit.CheckedMenuItem",
	dijit.MenuItem,
	{
	// summary: a checkbox-like menu item for toggling on and off
	
	templateString:
		 '<tr class="dijitReset dijitMenuItem" dojoAttachPoint="focusNode" waiRole="menuitemcheckbox" tabIndex="-1"'
		+'dojoAttachEvent="onmouseenter:_onHover,onmouseleave:_onUnhover,ondijitclick:_onClick">'
		+'<td class="dijitReset" waiRole="presentation"><div class="dijitMenuItemIcon dijitCheckedMenuItemIcon" dojoAttachPoint="iconNode">'
		+'<div class="dijitCheckedMenuItemIconChar">&#10003;</div>'
		+'</div></td>'
		+'<td class="dijitReset dijitMenuItemLabel" dojoAttachPoint="containerNode,labelNode"></td>'
		+'<td class="dijitReset dijitMenuArrowCell" waiRole="presentation">'
			+'<div dojoAttachPoint="arrowWrapper" style="display: none">'
				+'<div class="dijitMenuExpand"></div>'
				+'<span class="dijitMenuExpandA11y">+</span>'
			+'</div>'
		+'</td>'
		+'</tr>',

	// checked: Boolean
	//		Our checked state
	checked: false,
	_setCheckedAttr: function(/*Boolean*/ checked){
		// summary:
		//		Hook so attr('checked', bool) works.
		//		Sets the class and state for the check box.
		dojo.toggleClass(this.iconNode, "dijitCheckedMenuItemIconChecked", checked);
		dijit.setWaiState(this.domNode, "checked", checked);
		this.checked = checked;
	},

	onChange: function(/*Boolean*/ checked){
		// summary: User defined function to handle change events
	},

	_onClick: function(/*Event*/ e){
		// summary: Clicking this item just toggles its state
		if(!this.disabled){
			this.attr("checked", !this.checked);
			this.onChange(this.checked);
		}
		this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dijit.layout.StackContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.StackContainer"] = true;
dojo.provide("dijit.layout.StackContainer");







dojo.declare(
	"dijit.layout.StackContainer",
	dijit.layout._LayoutWidget,
	{
	// summary: 
	//	A container that has multiple children, but shows only
	//	one child at a time
	//
	// description:
	// 	A container for widgets (ContentPanes, for example) That displays
	//	only one Widget at a time.
	//	
	//	Publishes topics [widgetId]-addChild, [widgetId]-removeChild, and [widgetId]-selectChild
	//
	//	Can be base class for container, Wizard, Show, etc.

	// doLayout: Boolean
	//  if true, change the size of my currently displayed child to match my size
	doLayout: true,

	baseClass: "dijitStackContainer",

	_started: false,
/*=====
	// selectedChildWidget: Widget
	//	References the currently selected child widget, if any
	//
	selectedChildWidget: null,
=====*/
	postCreate: function(){
		this.inherited(arguments);
		dijit.setWaiRole(this.containerNode, "tabpanel");
		this.connect(this.domNode, "onkeypress", this._onKeyPress);
	},
	
	startup: function(){
		if(this._started){ return; }

		var children = this.getChildren();

		// Setup each page panel
		dojo.forEach(children, this._setupChild, this);

		// Figure out which child to initially display
		dojo.some(children, function(child){
			if(child.selected){
				this.selectedChildWidget = child;
			}
			return child.selected;
		}, this);

		var selected = this.selectedChildWidget;

		// Default to the first child
		if(!selected && children[0]){
			selected = this.selectedChildWidget = children[0];
			selected.selected = true;
		}
		if(selected){
			this._showChild(selected);
		}

		// Now publish information about myself so any StackControllers can initialize..
		dojo.publish(this.id+"-startup", [{children: children, selected: selected}]);

		this.inherited(arguments);
	},

	_setupChild: function(/*Widget*/ child){
		// Summary: prepare the given child

		this.inherited(arguments);

		child.domNode.style.display = "none";

		// since we are setting the width/height of the child elements, they need
		// to be position:relative, or IE has problems (See bug #2033)
		child.domNode.style.position = "relative";

		// remove the title attribute so it doesn't show up when i hover
		// over a node
		child.domNode.title = "";

		return child; // dijit._Widget
	},

	addChild: function(/*Widget*/ child, /*Integer?*/ insertIndex){
		// summary: Adds a widget to the stack
		 
		this.inherited(arguments);

		if(this._started){
			dojo.publish(this.id+"-addChild", [child, insertIndex]);

			// in case the tab titles have overflowed from one line to two lines
			// (or, if this if first child, from zero lines to one line)
			this.layout();

			// if this is the first child, then select it
			if(!this.selectedChildWidget){
				this.selectChild(child);
			}
		}
	},

	removeChild: function(/*Widget*/ page){
		// summary: Removes the pane from the stack

		this.inherited(arguments);

		// If we are being destroyed than don't run the code below (to select another page), because we are deleting
		// every page one by one
		if(this._beingDestroyed){ return; }

		if(this._started){
			// this will notify any tablists to remove a button; do this first because it may affect sizing
			dojo.publish(this.id+"-removeChild", [page]);

			// in case the tab titles now take up one line instead of two lines
			this.layout();
		}

		if(this.selectedChildWidget === page){
			this.selectedChildWidget = undefined;
			if(this._started){
				var children = this.getChildren();
				if(children.length){
					this.selectChild(children[0]);
				}
			}
		}
	},

	selectChild: function(/*Widget*/ page){
		// summary:
		//	Show the given widget (which must be one of my children)

		page = dijit.byId(page);

		if(this.selectedChildWidget != page){
			// Deselect old page and select new one
			this._transition(page, this.selectedChildWidget);
			this.selectedChildWidget = page;
			dojo.publish(this.id+"-selectChild", [page]);
		}
	},

	_transition: function(/*Widget*/newWidget, /*Widget*/oldWidget){
		if(oldWidget){
			this._hideChild(oldWidget);
		}
		this._showChild(newWidget);

		// Size the new widget, in case this is the first time it's being shown,
		// or I have been resized since the last time it was shown.
		// page must be visible for resizing to work
		if(this.doLayout && newWidget.resize){
			newWidget.resize(this._containerContentBox || this._contentBox);
		}
	},

	_adjacent: function(/*Boolean*/ forward){
		// summary: Gets the next/previous child widget in this container from the current selection
		var children = this.getChildren();
		var index = dojo.indexOf(children, this.selectedChildWidget);
		index += forward ? 1 : children.length - 1;
		return children[ index % children.length ]; // dijit._Widget
	},

	forward: function(){
		// Summary: advance to next page
		this.selectChild(this._adjacent(true));
	},

	back: function(){
		// Summary: go back to previous page
		this.selectChild(this._adjacent(false));
	},

	_onKeyPress: function(e){
		dojo.publish(this.id+"-containerKeyPress", [{ e: e, page: this}]);
	},

	layout: function(){
		if(this.doLayout && this.selectedChildWidget && this.selectedChildWidget.resize){
			this.selectedChildWidget.resize(this._contentBox);
		}
	},

	_showChild: function(/*Widget*/ page){
		var children = this.getChildren();
		page.isFirstChild = (page == children[0]);
		page.isLastChild = (page == children[children.length-1]);
		page.selected = true;

		page.domNode.style.display="";
		if(page._loadCheck){
			page._loadCheck(); // trigger load in ContentPane
		}
		if(page.onShow){
			page.onShow();
		}
	},

	_hideChild: function(/*Widget*/ page){
		page.selected=false;
		page.domNode.style.display="none";
		if(page.onHide){
			page.onHide();
		}
	},

	closeChild: function(/*Widget*/ page){
		// summary:
		//	callback when user clicks the [X] to remove a page
		//	if onClose() returns true then remove and destroy the child
		var remove = page.onClose(this, page);
		if(remove){
			this.removeChild(page);
			// makes sure we can clean up executeScripts in ContentPane onUnLoad
			page.destroyRecursive();
		}
	},

	destroy: function(){
		this._beingDestroyed = true;
		this.inherited(arguments);
	}
});

dojo.declare(
	"dijit.layout.StackController",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	// summary:
	//	Set of buttons to select a page in a page list.
	//	Monitors the specified StackContainer, and whenever a page is
	//	added, deleted, or selected, updates itself accordingly.

		templateString: "<span wairole='tablist' dojoAttachEvent='onkeypress' class='dijitStackController'></span>",

		// containerId: String
		//	the id of the page container that I point to
		containerId: "",

		// buttonWidget: String
		//	the name of the button widget to create to correspond to each page
		buttonWidget: "dijit.layout._StackButton",

		postCreate: function(){
			dijit.setWaiRole(this.domNode, "tablist");

			// TODO: change key from object to id, to get more separation from StackContainer
			this.pane2button = {};		// mapping from panes to buttons
			this.pane2handles = {};		// mapping from panes to dojo.connect() handles
			this.pane2menu = {};		// mapping from panes to close menu

			this._subscriptions=[
				dojo.subscribe(this.containerId+"-startup", this, "onStartup"),
				dojo.subscribe(this.containerId+"-addChild", this, "onAddChild"),
				dojo.subscribe(this.containerId+"-removeChild", this, "onRemoveChild"),
				dojo.subscribe(this.containerId+"-selectChild", this, "onSelectChild"),
				dojo.subscribe(this.containerId+"-containerKeyPress", this, "onContainerKeyPress")
			];
		},

		onStartup: function(/*Object*/ info){
			// summary: called after StackContainer has finished initializing
			dojo.forEach(info.children, this.onAddChild, this);
			this.onSelectChild(info.selected);
		},

		destroy: function(){
			for(var pane in this.pane2button){
				this.onRemoveChild(pane);
			}
			dojo.forEach(this._subscriptions, dojo.unsubscribe);
			this.inherited(arguments);
		},

		onAddChild: function(/*Widget*/ page, /*Integer?*/ insertIndex){
			// summary:
			//   Called whenever a page is added to the container.
			//   Create button corresponding to the page.

			// add a node that will be promoted to the button widget
			var refNode = dojo.doc.createElement("span");
			this.domNode.appendChild(refNode);
			// create an instance of the button widget
			var cls = dojo.getObject(this.buttonWidget);
			var button = new cls({label: page.title, closeButton: page.closable}, refNode);
			this.addChild(button, insertIndex);
			this.pane2button[page] = button;
			page.controlButton = button;	// this value might be overwritten if two tabs point to same container

			var handles = [];
			handles.push(dojo.connect(button, "onClick", dojo.hitch(this,"onButtonClick",page)));
			if(page.closable){
				handles.push(dojo.connect(button, "onClickCloseButton", dojo.hitch(this,"onCloseButtonClick",page)));
				// add context menu onto title button
				var _nlsResources = dojo.i18n.getLocalization("dijit", "common");
				var closeMenu = new dijit.Menu({targetNodeIds:[button.id], id:button.id+"_Menu"});
				var mItem = new dijit.MenuItem({label:_nlsResources.itemClose});
				handles.push(dojo.connect(mItem, "onClick", dojo.hitch(this, "onCloseButtonClick", page)));
				closeMenu.addChild(mItem);
				this.pane2menu[page] = closeMenu;
			}
			this.pane2handles[page] = handles;
			if(!this._currentChild){ // put the first child into the tab order
				button.focusNode.setAttribute("tabIndex", "0");
				this._currentChild = page;
			}
			//make sure all tabs have the same length
			if(!this.isLeftToRight() && dojo.isIE && this._rectifyRtlTabList){
				this._rectifyRtlTabList();
			}
		},

		onRemoveChild: function(/*Widget*/ page){
			// summary:
			//   Called whenever a page is removed from the container.
			//   Remove the button corresponding to the page.
			if(this._currentChild === page){ this._currentChild = null; }
			dojo.forEach(this.pane2handles[page], dojo.disconnect);
			delete this.pane2handles[page];
			var menu = this.pane2menu[page];
			if (menu){
				menu.destroyRecursive();
				delete this.pane2menu[page];
			}
			var button = this.pane2button[page];
			if(button){
				// TODO? if current child { reassign }
				button.destroy();
				delete this.pane2button[page];
			}
		},

		onSelectChild: function(/*Widget*/ page){
			// summary:
			//	Called when a page has been selected in the StackContainer, either by me or by another StackController

			if(!page){ return; }

			if(this._currentChild){
				var oldButton=this.pane2button[this._currentChild];
				oldButton.attr('checked', false);
				oldButton.focusNode.setAttribute("tabIndex", "-1");
			}

			var newButton=this.pane2button[page];
			newButton.attr('checked', true);
			this._currentChild = page;
			newButton.focusNode.setAttribute("tabIndex", "0");
			var container = dijit.byId(this.containerId);
			dijit.setWaiState(container.containerNode, "labelledby", newButton.id);
		},

		onButtonClick: function(/*Widget*/ page){
			// summary:
			//   Called whenever one of my child buttons is pressed in an attempt to select a page
			var container = dijit.byId(this.containerId);	// TODO: do this via topics?
			container.selectChild(page); 
		},

		onCloseButtonClick: function(/*Widget*/ page){
			// summary:
			//   Called whenever one of my child buttons [X] is pressed in an attempt to close a page
			var container = dijit.byId(this.containerId);
			container.closeChild(page);
			var b = this.pane2button[this._currentChild];
			if(b){
				dijit.focus(b.focusNode || b.domNode);
			}
		},
		
		// TODO: this is a bit redundant with forward, back api in StackContainer
		adjacent: function(/*Boolean*/ forward){
			if(!this.isLeftToRight() && (!this.tabPosition || /top|bottom/.test(this.tabPosition))){ forward = !forward; }
			// find currently focused button in children array
			var children = this.getChildren();
			var current = dojo.indexOf(children, this.pane2button[this._currentChild]);
			// pick next button to focus on
			var offset = forward ? 1 : children.length - 1;
			return children[ (current + offset) % children.length ]; // dijit._Widget
		},

		onkeypress: function(/*Event*/ e){
			// summary:
			//   Handle keystrokes on the page list, for advancing to next/previous button
			//   and closing the current page if the page is closable.

			if(this.disabled || e.altKey ){ return; }
			var forward = null;
			if(e.ctrlKey || !e._djpage){
				var k = dojo.keys;
				switch(e.charOrCode){
					case k.LEFT_ARROW:
					case k.UP_ARROW:
						if(!e._djpage){ forward = false; }
						break;
					case k.PAGE_UP:
						if(e.ctrlKey){ forward = false; }
						break;
					case k.RIGHT_ARROW:
					case k.DOWN_ARROW:
						if(!e._djpage){ forward = true; }
						break;
					case k.PAGE_DOWN:
						if(e.ctrlKey){ forward = true; }
						break;
					case k.DELETE:
						if(this._currentChild.closable){
							this.onCloseButtonClick(this._currentChild);
						}
						dojo.stopEvent(e);
						break;
					default:
						if(e.ctrlKey){
							if(e.charOrCode === k.TAB){
								this.adjacent(!e.shiftKey).onClick();
								dojo.stopEvent(e);
							}else if(e.charOrCode == "w"){
								if(this._currentChild.closable){
									this.onCloseButtonClick(this._currentChild);
								}
								dojo.stopEvent(e); // avoid browser tab closing.
							}
						}
				}
				// handle page navigation
				if(forward !== null){
					this.adjacent(forward).onClick();
					dojo.stopEvent(e);
				}
			}
		},

		onContainerKeyPress: function(/*Object*/ info){
			info.e._djpage = info.page;
			this.onkeypress(info.e);
		}
});

dojo.declare("dijit.layout._StackButton",
	dijit.form.ToggleButton,
	{
	// summary
	//	Internal widget used by StackContainer.
	//	The button-like or tab-like object you click to select or delete a page
	
	tabIndex: "-1", // StackContainer buttons are not in the tab order by default
	
	postCreate: function(/*Event*/ evt){
		dijit.setWaiRole((this.focusNode || this.domNode), "tab");
		this.inherited(arguments);
	},
	
	onClick: function(/*Event*/ evt){
		// summary: This is for TabContainer where the tabs are <span> rather than button,
		// 	so need to set focus explicitly (on some browsers)
		dijit.focus(this.focusNode);

		// ... now let StackController catch the event and tell me what to do
	},

	onClickCloseButton: function(/*Event*/ evt){
		// summary
		//	StackContainer connects to this function; if your widget contains a close button
		//	then clicking it should call this function.
		evt.stopPropagation();
	}
});

// These arguments can be specified for the children of a StackContainer.
// Since any widget can be specified as a StackContainer child, mix them
// into the base widget class.  (This is a hack, but it's effective.)
dojo.extend(dijit._Widget, {
	// title: String
	//		Title of this widget.  Used by TabContainer to the name the tab, etc.
	title: "",

	// selected: Boolean
	//		Is this child currently selected?
	selected: false,

	// closable: Boolean
	//		True if user can close (destroy) this child, such as (for example) clicking the X on the tab.
	closable: false,	// true if user can close this tab pane

	onClose: function(){
		// summary: Callback if someone tries to close the child, child will be closed if func returns true
		return true;
	}
});

}

if(!dojo._hasResource["dijit.layout.TabContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.TabContainer"] = true;
dojo.provide("dijit.layout.TabContainer");





dojo.declare("dijit.layout.TabContainer",
	[dijit.layout.StackContainer, dijit._Templated],
	{	
	// summary: 
	//	A Container with Title Tabs, each one pointing at a pane in the container.
	// description:
	//	A TabContainer is a container that has multiple panes, but shows only
	//	one pane at a time.  There are a set of tabs corresponding to each pane,
	//	where each tab has the title (aka title) of the pane, and optionally a close button.
	//
	//	Publishes topics [widgetId]-addChild, [widgetId]-removeChild, and [widgetId]-selectChild
	//	(where [widgetId] is the id of the TabContainer itself.

	// tabPosition: String
	//   Defines where tabs go relative to tab content.
	//   "top", "bottom", "left-h", "right-h"
	tabPosition: "top",

	baseClass: "dijitTabContainer",
	
	// tabStrip: bool
	//   Defines whether the tablist gets an extra class for layouting
	tabStrip: false,

	templateString: null,	// override setting in StackContainer
	templateString:"<div class=\"dijitTabContainer\">\n\t<div dojoAttachPoint=\"tablistNode\"></div>\n\t<div dojoAttachPoint=\"tablistSpacer\" class=\"dijitTabSpacer ${baseClass}-spacer\"></div>\n\t<div class=\"dijitTabPaneWrapper ${baseClass}-container\" dojoAttachPoint=\"containerNode\"></div>\n</div>\n",

	// _controllerWidget: String
	//		An optional parameter to overrider the default TabContainer controller used.
	_controllerWidget: "dijit.layout.TabController",

	postMixInProperties: function(){
		// set class name according to tab position, ex: dijiTabContainerTop
		this.baseClass += this.tabPosition.charAt(0).toUpperCase() + this.tabPosition.substr(1).replace(/-.*/, "");
		this.inherited(arguments);
	},

	postCreate: function(){
		this.inherited(arguments);

		// create the tab list that will have a tab (a.k.a. tab button) for each tab panel
		var TabController = dojo.getObject(this._controllerWidget);
		this.tablist = new TabController({
			id: this.id + "_tablist",
			tabPosition: this.tabPosition,
			doLayout: this.doLayout,
			containerId: this.id,
			"class": this.baseClass + "-tabs" + (this.doLayout ? "" : " dijitTabNoLayout")
		}, this.tablistNode);
		
		// add Class for tabstrip
		if (this.tabStrip){	dojo.addClass(this.tablist.domNode, this.baseClass+"Strip"); }			
	},

	_setupChild: function(/* Widget */tab){
		dojo.addClass(tab.domNode, "dijitTabPane");
		this.inherited(arguments);
		return tab; // Widget
	},

	startup: function(){
		if(this._started){ return; }

		// wire up the tablist and its tabs
		this.tablist.startup();
		this.inherited(arguments);
	},

	layout: function(){
		// Summary: Configure the content pane to take up all the space except for where the tabs are
		if(!this.doLayout){ return; }

		// position and size the titles and the container node
		var titleAlign = this.tabPosition.replace(/-h/,"");
		var children = [
			{ domNode: this.tablist.domNode, layoutAlign: titleAlign },
			{ domNode: this.tablistSpacer, layoutAlign: titleAlign },
			{ domNode: this.containerNode, layoutAlign: "client" }
		];
		dijit.layout.layoutChildren(this.domNode, this._contentBox, children);

		// Compute size to make each of my children.
		// children[2] is the margin-box size of this.containerNode, set by layoutChildren() call above
		this._containerContentBox = dijit.layout.marginBox2contentBox(this.containerNode, children[2]);

		if(this.selectedChildWidget){
			this._showChild(this.selectedChildWidget);
			if(this.doLayout && this.selectedChildWidget.resize){
				this.selectedChildWidget.resize(this._containerContentBox);
			}
		}
	},

	destroy: function(){
		if(this.tablist){
			this.tablist.destroy();
		}
		this.inherited(arguments);
	}
});

//TODO: make private?
dojo.declare("dijit.layout.TabController",
	dijit.layout.StackController,
	{
	// summary:
	// 	Set of tabs (the things with titles and a close button, that you click to show a tab panel).
	// description:
	//	Lets the user select the currently shown pane in a TabContainer or StackContainer.
	//	TabController also monitors the TabContainer, and whenever a pane is
	//	added or deleted updates itself accordingly.

	templateString: "<div wairole='tablist' dojoAttachEvent='onkeypress:onkeypress'></div>",

	// tabPosition: String
	//   Defines where tabs go relative to the content.
	//   "top", "bottom", "left-h", "right-h"
	tabPosition: "top",

	// doLayout: Boolean
	doLayout: true,

	// buttonWidget: String
	//	The name of the tab widget to create to correspond to each page
	buttonWidget: "dijit.layout._TabButton",

	_rectifyRtlTabList: function(){
		//summary: Rectify the width of all tabs in rtl, otherwise the tab widths are different in IE
		if(0 >= this.tabPosition.indexOf('-h')){ return; }
		if(!this.pane2button){ return; }

		var maxWidth = 0;
		for(var pane in this.pane2button){
			var ow = this.pane2button[pane].innerDiv.scrollWidth;
			maxWidth = Math.max(maxWidth, ow);
		}
		//unify the length of all the tabs
		for(pane in this.pane2button){
			this.pane2button[pane].innerDiv.style.width = maxWidth + 'px';
		}	
	}
});

dojo.declare("dijit.layout._TabButton",
	dijit.layout._StackButton,
	{
	// summary:
	//	A tab (the thing you click to select a pane).
	// description:
	//	Contains the title of the pane, and optionally a close-button to destroy the pane.
	//	This is an internal widget and should not be instantiated directly.

	baseClass: "dijitTab",

	templateString:"<div waiRole=\"presentation\" dojoAttachEvent='onclick:onClick,onmouseenter:_onMouse,onmouseleave:_onMouse'>\n    <div waiRole=\"presentation\" class='dijitTabInnerDiv' dojoAttachPoint='innerDiv'>\n        <div waiRole=\"presentation\" class='dijitTabContent' dojoAttachPoint='tabContent'>\n\t        <span dojoAttachPoint='containerNode,focusNode' class='tabLabel'>${!label}</span><img class =\"dijitTabButtonSpacer\" src=\"${_blankGif}\" />\n\t        <div class=\"dijitInline closeNode\" dojoAttachPoint='closeNode' dojoAttachEvent='onclick:onClickCloseButton'>\n\t        \t<img src=\"${_blankGif}\" alt=\"\" dojoAttachPoint='closeButtonNode' class='closeImage' dojoAttachEvent='onmouseenter:_onMouse, onmouseleave:_onMouse' stateModifier='CloseButton' waiRole=\"presentation\"/>\n\t            <span dojoAttachPoint='closeText' class='closeText'>x</span>\n\t        </div>\n        </div>\n    </div>\n</div>\n",

	_scroll: false, // don't scroll the whole tab container into view when the button is focused

	postCreate: function(){
		if(this.closeButton){
			dojo.addClass(this.innerDiv, "dijitClosable");
			var _nlsResources = dojo.i18n.getLocalization("dijit", "common");
			if(this.closeNode){
				dojo.attr(this.closeNode,"title", _nlsResources.itemClose);
				// IE needs title set directly on image
				dojo.attr(this.closeButtonNode,"title", _nlsResources.itemClose);
			}
		}else{
			this.closeNode.style.display="none";		
		}
		this.inherited(arguments); 
		dojo.setSelectable(this.containerNode, false);
	}
});

}

if(!dojo._hasResource["dojo.fx"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.fx"] = true;
dojo.provide("dojo.fx");
dojo.provide("dojo.fx.Toggler");

/*=====
dojo.fx = {
	// summary: Effects library on top of Base animations
};
=====*/

(function(){
	var _baseObj = {
			_fire: function(evt, args){
				if(this[evt]){
					this[evt].apply(this, args||[]);
				}
				return this;
			}
		};

	var _chain = function(animations){
		this._index = -1;
		this._animations = animations||[];
		this._current = this._onAnimateCtx = this._onEndCtx = null;

		this.duration = 0;
		dojo.forEach(this._animations, function(a){
			this.duration += a.duration;
			if(a.delay){ this.duration += a.delay; }
		}, this);
	};
	dojo.extend(_chain, {
		_onAnimate: function(){
			this._fire("onAnimate", arguments);
		},
		_onEnd: function(){
			dojo.disconnect(this._onAnimateCtx);
			dojo.disconnect(this._onEndCtx);
			this._onAnimateCtx = this._onEndCtx = null;
			if(this._index + 1 == this._animations.length){
				this._fire("onEnd");
			}else{
				// switch animations
				this._current = this._animations[++this._index];
				this._onAnimateCtx = dojo.connect(this._current, "onAnimate", this, "_onAnimate");
				this._onEndCtx = dojo.connect(this._current, "onEnd", this, "_onEnd");
				this._current.play(0, true);
			}
		},
		play: function(/*int?*/ delay, /*Boolean?*/ gotoStart){
			if(!this._current){ this._current = this._animations[this._index = 0]; }
			if(!gotoStart && this._current.status() == "playing"){ return this; }
			var beforeBegin = dojo.connect(this._current, "beforeBegin", this, function(){
					this._fire("beforeBegin");
				}),
				onBegin = dojo.connect(this._current, "onBegin", this, function(arg){
					this._fire("onBegin", arguments);
				}),
				onPlay = dojo.connect(this._current, "onPlay", this, function(arg){
					this._fire("onPlay", arguments);
					dojo.disconnect(beforeBegin);
					dojo.disconnect(onBegin);
					dojo.disconnect(onPlay);
				});
			if(this._onAnimateCtx){
				dojo.disconnect(this._onAnimateCtx);
			}
			this._onAnimateCtx = dojo.connect(this._current, "onAnimate", this, "_onAnimate");
			if(this._onEndCtx){
				dojo.disconnect(this._onEndCtx);
			}
			this._onEndCtx = dojo.connect(this._current, "onEnd", this, "_onEnd");
			this._current.play.apply(this._current, arguments);
			return this;
		},
		pause: function(){
			if(this._current){
				var e = dojo.connect(this._current, "onPause", this, function(arg){
						this._fire("onPause", arguments);
						dojo.disconnect(e);
					});
				this._current.pause();
			}
			return this;
		},
		gotoPercent: function(/*Decimal*/percent, /*Boolean?*/ andPlay){
			this.pause();
			var offset = this.duration * percent;
			this._current = null;
			dojo.some(this._animations, function(a){
				if(a.duration <= offset){
					this._current = a;
					return true;
				}
				offset -= a.duration;
				return false;
			});
			if(this._current){
				this._current.gotoPercent(offset / this._current.duration, andPlay);
			}
			return this;
		},
		stop: function(/*boolean?*/ gotoEnd){
			if(this._current){
				if(gotoEnd){
					for(; this._index + 1 < this._animations.length; ++this._index){
						this._animations[this._index].stop(true);
					}
					this._current = this._animations[this._index];
				}
				var e = dojo.connect(this._current, "onStop", this, function(arg){
						this._fire("onStop", arguments);
						dojo.disconnect(e);
					});
				this._current.stop();
			}
			return this;
		},
		status: function(){
			return this._current ? this._current.status() : "stopped";
		},
		destroy: function(){
			if(this._onAnimateCtx){ dojo.disconnect(this._onAnimateCtx); }
			if(this._onEndCtx){ dojo.disconnect(this._onEndCtx); }
		}
	});
	dojo.extend(_chain, _baseObj);

	dojo.fx.chain = function(/*dojo._Animation[]*/ animations){
		// summary: Chain a list of dojo._Animation s to run in sequence
		// example:
		//	|	dojo.fx.chain([
		//	|		dojo.fadeIn({ node:node }),
		//	|		dojo.fadeOut({ node:otherNode })
		//	|	]).play();
		//
		return new _chain(animations) // dojo._Animation
	};

	var _combine = function(animations){
		this._animations = animations||[];
		this._connects = [];
		this._finished = 0;

		this.duration = 0;
		dojo.forEach(animations, function(a){
			var duration = a.duration;
			if(a.delay){ duration += a.delay; }
			if(this.duration < duration){ this.duration = duration; }
			this._connects.push(dojo.connect(a, "onEnd", this, "_onEnd"));
		}, this);
		
		this._pseudoAnimation = new dojo._Animation({curve: [0, 1], duration: this.duration});
		dojo.forEach(["beforeBegin", "onBegin", "onPlay", "onAnimate", "onPause", "onStop"], 
			function(evt){
				this._connects.push(dojo.connect(this._pseudoAnimation, evt, dojo.hitch(this, "_fire", evt)));
			},
			this
		);
	};
	dojo.extend(_combine, {
		_doAction: function(action, args){
			dojo.forEach(this._animations, function(a){
				a[action].apply(a, args);
			});
			return this;
		},
		_onEnd: function(){
			if(++this._finished == this._animations.length){
				this._fire("onEnd");
			}
		},
		_call: function(action, args){
			var t = this._pseudoAnimation;
			t[action].apply(t, args);
		},
		play: function(/*int?*/ delay, /*Boolean?*/ gotoStart){
			this._finished = 0;
			this._doAction("play", arguments);
			this._call("play", arguments);
			return this;
		},
		pause: function(){
			this._doAction("pause", arguments);
			this._call("pause", arguments);
			return this;
		},
		gotoPercent: function(/*Decimal*/percent, /*Boolean?*/ andPlay){
			var ms = this.duration * percent;
			dojo.forEach(this._animations, function(a){
				a.gotoPercent(a.duration < ms ? 1 : (ms / a.duration), andPlay);
			});
			this._call("gotoPercent", arguments);
			return this;
		},
		stop: function(/*boolean?*/ gotoEnd){
			this._doAction("stop", arguments);
			this._call("stop", arguments);
			return this;
		},
		status: function(){
			return this._pseudoAnimation.status();
		},
		destroy: function(){
			dojo.forEach(this._connects, dojo.disconnect);
		}
	});
	dojo.extend(_combine, _baseObj);

	dojo.fx.combine = function(/*dojo._Animation[]*/ animations){
		// summary: Combine a list of dojo._Animation s to run in parallel
		// example:
		//	|	dojo.fx.combine([
		//	|		dojo.fadeIn({ node:node }),
		//	|		dojo.fadeOut({ node:otherNode })
		//	|	]).play();
		return new _combine(animations); // dojo._Animation
	};
})();

dojo.declare("dojo.fx.Toggler", null, {
	// summary:
	//		class constructor for an animation toggler. It accepts a packed
	//		set of arguments about what type of animation to use in each
	//		direction, duration, etc.
	//
	// example:
	//	|	var t = new dojo.fx.Toggler({
	//	|		node: "nodeId",
	//	|		showDuration: 500,
	//	|		// hideDuration will default to "200"
	//	|		showFunc: dojo.wipeIn, 
	//	|		// hideFunc will default to "fadeOut"
	//	|	});
	//	|	t.show(100); // delay showing for 100ms
	//	|	// ...time passes...
	//	|	t.hide();

	// FIXME: need a policy for where the toggler should "be" the next
	// time show/hide are called if we're stopped somewhere in the
	// middle.

	constructor: function(args){
		var _t = this;

		dojo.mixin(_t, args);
		_t.node = args.node;
		_t._showArgs = dojo.mixin({}, args);
		_t._showArgs.node = _t.node;
		_t._showArgs.duration = _t.showDuration;
		_t.showAnim = _t.showFunc(_t._showArgs);

		_t._hideArgs = dojo.mixin({}, args);
		_t._hideArgs.node = _t.node;
		_t._hideArgs.duration = _t.hideDuration;
		_t.hideAnim = _t.hideFunc(_t._hideArgs);

		dojo.connect(_t.showAnim, "beforeBegin", dojo.hitch(_t.hideAnim, "stop", true));
		dojo.connect(_t.hideAnim, "beforeBegin", dojo.hitch(_t.showAnim, "stop", true));
	},

	// node: DomNode
	//	the node to toggle
	node: null,

	// showFunc: Function
	//	The function that returns the dojo._Animation to show the node
	showFunc: dojo.fadeIn,

	// hideFunc: Function	
	//	The function that returns the dojo._Animation to hide the node
	hideFunc: dojo.fadeOut,

	// showDuration:
	//	Time in milliseconds to run the show Animation
	showDuration: 200,

	// hideDuration:
	//	Time in milliseconds to run the hide Animation
	hideDuration: 200,

	/*=====
	_showArgs: null,
	_showAnim: null,

	_hideArgs: null,
	_hideAnim: null,

	_isShowing: false,
	_isHiding: false,
	=====*/

	show: function(delay){
		// summary: Toggle the node to showing
		return this.showAnim.play(delay || 0);
	},

	hide: function(delay){
		// summary: Toggle the node to hidden
		return this.hideAnim.play(delay || 0);
	}
});

dojo.fx.wipeIn = function(/*Object*/ args){
	// summary
	//		Returns an animation that will expand the
	//		node defined in 'args' object from it's current height to
	//		it's natural height (with no scrollbar).
	//		Node must have no margin/border/padding.
	args.node = dojo.byId(args.node);
	var node = args.node, s = node.style, o;

	var anim = dojo.animateProperty(dojo.mixin({
		properties: {
			height: {
				// wrapped in functions so we wait till the last second to query (in case value has changed)
				start: function(){
					// start at current [computed] height, but use 1px rather than 0
					// because 0 causes IE to display the whole panel
					o = s.overflow;
					s.overflow="hidden";
					if(s.visibility=="hidden"||s.display=="none"){
						s.height="1px";
						s.display="";
						s.visibility="";
						return 1;
					}else{
						var height = dojo.style(node, "height");
						return Math.max(height, 1);
					}
				},
				end: function(){
					return node.scrollHeight;
				}
			}
		}
	}, args));

	dojo.connect(anim, "onEnd", function(){ 
		s.height = "auto";
		s.overflow = o;
	});

	return anim; // dojo._Animation
}

dojo.fx.wipeOut = function(/*Object*/ args){
	// summary
	//		Returns an animation that will shrink node defined in "args"
	//		from it's current height to 1px, and then hide it.
	var node = args.node = dojo.byId(args.node);
	var s = node.style;
	var o;

	var anim = dojo.animateProperty(dojo.mixin({
		properties: {
			height: {
				end: 1 // 0 causes IE to display the whole panel
			}
		}
	}, args));

	dojo.connect(anim, "beforeBegin", function(){
		o = s.overflow;
		s.overflow = "hidden";
		s.display = "";
	});
	dojo.connect(anim, "onEnd", function(){
		s.overflow = o;
		s.height = "auto";
		s.display = "none";
	});

	return anim; // dojo._Animation
}

dojo.fx.slideTo = function(/*Object?*/ args){
	// summary
	//		Returns an animation that will slide "node" 
	//		defined in args Object from its current position to
	//		the position defined by (args.left, args.top).
	// example:
	//	|	dojo.fx.slideTo({ node: node, left:"40", top:"50", unit:"px" }).play()

	var node = (args.node = dojo.byId(args.node));
	
	var top = null;
	var left = null;
	
	var init = (function(n){
		return function(){
			var cs = dojo.getComputedStyle(n);
			var pos = cs.position;
			top = (pos == 'absolute' ? n.offsetTop : parseInt(cs.top) || 0);
			left = (pos == 'absolute' ? n.offsetLeft : parseInt(cs.left) || 0);
			if(pos != 'absolute' && pos != 'relative'){
				var ret = dojo.coords(n, true);
				top = ret.y;
				left = ret.x;
				n.style.position="absolute";
				n.style.top=top+"px";
				n.style.left=left+"px";
			}
		};
	})(node);
	init();

	var anim = dojo.animateProperty(dojo.mixin({
		properties: {
			top: { end: args.top||0 },
			left: { end: args.left||0 }
		}
	}, args));
	dojo.connect(anim, "beforeBegin", anim, init);

	return anim; // dojo._Animation
}

}

if(!dojo._hasResource["dijit.layout.AccordionContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.AccordionContainer"] = true;
dojo.provide("dijit.layout.AccordionContainer");








dojo.declare(
	"dijit.layout.AccordionContainer",
	dijit.layout.StackContainer,
	{
		// summary:
		//		Holds a set of panes where every pane's title is visible, but only one pane's content is visible at a time,
		//		and switching between panes is visualized by sliding the other panes up/down.
		// example:
		// | 	<div dojoType="dijit.layout.AccordionContainer">
		// |		<div dojoType="dijit.layout.AccordionPane" title="pane 1">
		// |			<div dojoType="dijit.layout.ContentPane">...</div>
		// | 	</div>
		// |		<div dojoType="dijit.layout.AccordionPane" title="pane 2">
		// |			<p>This is some text</p>
		// ||		...
		// |	</div>
		//
		// duration: Integer
		//		Amount of time (in ms) it takes to slide panes
		duration: dijit.defaultDuration,

		_verticalSpace: 0,

		baseClass: "dijitAccordionContainer",
		
		postCreate: function(){
			this.domNode.style.overflow = "hidden";
			this.inherited(arguments); 
			dijit.setWaiRole(this.domNode, "tablist");
		},

		startup: function(){
			if(this._started){ return; }
			this.inherited(arguments);	
			if(this.selectedChildWidget){
				var style = this.selectedChildWidget.containerNode.style;
				style.display = "";
				style.overflow = "auto";
				this.selectedChildWidget._setSelectedState(true);
			}
		},
		
		_getTargetHeight: function(/* Node */ node){
			// summary:
			//		For the given node, returns the height that should be
			//		set to achieve our vertical space (subtract any padding
			//		we may have)
			var cs = dojo.getComputedStyle(node);
			return Math.max(this._verticalSpace - dojo._getPadBorderExtents(node, cs).h, 0);
		},
		
		layout: function(){
			// summary: 
			//		Set the height of the open pane based on what room remains

			var openPane = this.selectedChildWidget;

			// get cumulative height of all the title bars
			var totalCollapsedHeight = 0;
			dojo.forEach(this.getChildren(), function(child){
				totalCollapsedHeight += child.getTitleHeight();
			});
			var mySize = this._contentBox;
			this._verticalSpace = mySize.h - totalCollapsedHeight;

			// Memo size to make displayed child, including content and title pane
			this._containerContentBox = {
				h: this._verticalSpace + openPane.getTitleHeight(),
				w: mySize.w
			};

			if(openPane){
				openPane.resize(this._containerContentBox);
			}
		},

		_setupChild: function(/*Widget*/ page){
			// Summary: prepare the given child
			return page;
		},

		_transition: function(/*Widget?*/newWidget, /*Widget?*/oldWidget){
//TODO: should be able to replace this with calls to slideIn/slideOut
			if(this._inTransition){ return; }
			this._inTransition = true;
			var animations = [];
			var paneHeight = this._verticalSpace;
			if(newWidget){
				newWidget.setSelected(true);
				var newContents = newWidget.containerNode;
				newContents.style.display = "";
				paneHeight = this._getTargetHeight(newWidget.containerNode)
				animations.push(dojo.animateProperty({
					node: newContents,
					duration: this.duration,
					properties: {
						height: { start: 1, end: paneHeight }
					},
					onEnd: function(){
						newContents.style.overflow = "auto";
					}
				}));
			}
			if(oldWidget){
				oldWidget.setSelected(false);
				var oldContents = oldWidget.containerNode;
				oldContents.style.overflow = "hidden";
				paneHeight = this._getTargetHeight(oldWidget.containerNode);
				animations.push(dojo.animateProperty({
					node: oldContents,
					duration: this.duration,
					properties: {
						height: { start: paneHeight, end: "1" }
					},
					onEnd: function(){
						oldContents.style.display = "none";
					}
				}));
			}

			this._inTransition = false;

			dojo.fx.combine(animations).play();
		},

		// note: we are treating the container as controller here
		_onKeyPress: function(/*Event*/ e){
			if(this.disabled || e.altKey || !(e._dijitWidget || e.ctrlKey)){ return; }
			var k = dojo.keys;
			var fromTitle = e._dijitWidget;
			switch(e.charOrCode){
				case k.LEFT_ARROW:
				case k.UP_ARROW:
					if (fromTitle){
						this._adjacent(false)._onTitleClick();
						dojo.stopEvent(e);
					}
					break;
				case k.PAGE_UP:
					if (e.ctrlKey){
						this._adjacent(false)._onTitleClick();
						dojo.stopEvent(e);
					}
					break;
				case k.RIGHT_ARROW:
				case k.DOWN_ARROW:
					if (fromTitle){
						this._adjacent(true)._onTitleClick();
						dojo.stopEvent(e);
					}
					break;
				case k.PAGE_DOWN:
					if (e.ctrlKey){
						this._adjacent(true)._onTitleClick();
						dojo.stopEvent(e);
					}
					break;
				default:
					if(e.ctrlKey && e.charOrCode === k.TAB){
						this._adjacent(e._dijitWidget, !e.shiftKey)._onTitleClick();
						dojo.stopEvent(e);
					}
				
			}
		}
	}
);

dojo.declare("dijit.layout.AccordionPane",
	[dijit.layout.ContentPane, dijit._Templated, dijit._Contained],
	{
	// summary:
	//		AccordionPane is a ContentPane with a title that may contain another widget.
	//		Nested layout widgets, such as SplitContainer, are not supported at this time.
	// example: 
	// | see dijit.layout.AccordionContainer

	templateString:"<div waiRole=\"presentation\"\n\t><div dojoAttachPoint='titleNode,focusNode' dojoAttachEvent='ondijitclick:_onTitleClick,onkeypress:_onTitleKeyPress,onfocus:_handleFocus,onblur:_handleFocus,onmouseenter:_onTitleEnter,onmouseleave:_onTitleLeave'\n\t\tclass='dijitAccordionTitle' wairole=\"tab\" waiState=\"expanded-false\"\n\t\t><span class='dijitInline dijitAccordionArrow' waiRole=\"presentation\"></span\n\t\t><span class='arrowTextUp' waiRole=\"presentation\">+</span\n\t\t><span class='arrowTextDown' waiRole=\"presentation\">-</span\n\t\t><span waiRole=\"presentation\" dojoAttachPoint='titleTextNode' class='dijitAccordionText'></span></div\n\t><div waiRole=\"presentation\"><div dojoAttachPoint='containerNode' style='overflow: hidden; height: 1px; display: none'\n\t\tclass='dijitAccordionBody' wairole=\"tabpanel\"\n\t></div></div>\n</div>\n",
	attributeMap: dojo.mixin(dojo.clone(dijit.layout.ContentPane.prototype.attributeMap), {
		title: {node: "titleTextNode", type: "innerHTML" }
	}),

	baseClass: "dijitAccordionPane",
	
	postCreate: function(){
		this.inherited(arguments)
		dojo.setSelectable(this.titleNode, false);
		this.setSelected(this.selected);
		dojo.attr(this.titleTextNode, "id", this.domNode.id+"_title");
		dijit.setWaiState(this.focusNode, "labelledby", dojo.attr(this.titleTextNode, "id"));
	},

	getTitleHeight: function(){
		// summary: returns the height of the title dom node
		return dojo.marginBox(this.titleNode).h;	// Integer
	},

	_onTitleClick: function(){
		// summary: callback when someone clicks my title
		var parent = this.getParent();
		if(!parent._inTransition){
			parent.selectChild(this);
			dijit.focus(this.focusNode);
		}
	},

	_onTitleEnter: function(){
		// summary: callback when someone hovers over my title
		dojo.addClass(this.focusNode, "dijitAccordionTitle-hover");
	},

	_onTitleLeave: function(){
		// summary: callback when someone stops hovering over my title
		dojo.removeClass(this.focusNode, "dijitAccordionTitle-hover");
	},

	_onTitleKeyPress: function(/*Event*/ evt){
		evt._dijitWidget = this;
		return this.getParent()._onKeyPress(evt);
	},

	_setSelectedState: function(/*Boolean*/ isSelected){
		this.selected = isSelected;
		dojo[(isSelected ? "addClass" : "removeClass")](this.titleNode,"dijitAccordionTitle-selected");
		dijit.setWaiState(this.focusNode, "expanded", isSelected);
		this.focusNode.setAttribute("tabIndex", isSelected ? "0" : "-1");
	},

	_handleFocus: function(/*Event*/e){
		// summary: handle the blur and focus state of this widget
		dojo[(e.type=="focus" ? "addClass" : "removeClass")](this.focusNode,"dijitAccordionFocused");		
	},

	setSelected: function(/*Boolean*/ isSelected){
		// summary: change the selected state on this pane
		this._setSelectedState(isSelected);
		if(isSelected){
			this.onSelected();
			this._loadCheck(); // if href specified, trigger load
		}
	},

	onSelected: function(){
		// summary: called when this pane is selected
	},
	
	resize: function(size){
		// summary:
		//		Resize AccordionPane to the specified size

		// rather than setting the size of the outer domNode, we just set the
		// size of our container

		var cb = this._contentBox = {
			h: size.h - this.getTitleHeight(),
			w: size.w
		};

		dojo.marginBox(this.containerNode, {h: cb.h});
	}
});

}

if(!dojo._hasResource["dijit.form.TextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.TextBox"] = true;
dojo.provide("dijit.form.TextBox");



dojo.declare(
	"dijit.form.TextBox",
	dijit.form._FormValueWidget,
	{
		//	summary:
		//		A base class for textbox form inputs

		//	trim: Boolean
		//		Removes leading and trailing whitespace if true.  Default is false.
		trim: false,

		//	uppercase: Boolean
		//		Converts all characters to uppercase if true.  Default is false.
		uppercase: false,

		//	lowercase: Boolean
		//		Converts all characters to lowercase if true.  Default is false.
		lowercase: false,

		//	propercase: Boolean
		//		Converts the first character of each word to uppercase if true.
		propercase: false,

		//	maxLength: String
		//		HTML INPUT tag maxLength declaration.
		maxLength: "",

		templateString:"<input class=\"dijit dijitReset dijitLeft\" dojoAttachPoint='textbox,focusNode' name=\"${name}\"\n\tdojoAttachEvent='onmouseenter:_onMouse,onmouseleave:_onMouse,onfocus:_onMouse,onblur:_onMouse,onkeypress:_onKeyPress'\n\tautocomplete=\"off\" type=\"${type}\"\n\t/>\n",
		baseClass: "dijitTextBox",

		attributeMap: dojo.mixin(dojo.clone(dijit.form._FormValueWidget.prototype.attributeMap),
			{maxLength:"focusNode"}),

		_getValueAttr: function(){
			// summary:
			//		Hook so attr('value') works as we like.
			// description:
			//		For TextBox this simply returns the value of the <input>,
			//		but the parse() call is so subclasses can change this
			//		behavior w/out overriding this method.
			return this.parse(this.attr('displayedValue'), this.constraints);
		},

		_setValueAttr: function(value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
			//	summary:
			//		Hook so attr('value', ...) works.
			//
			//	description: 
			//		Sets the value of the widget to "value" which can be of
			//		any type as determined by the widget.
			//
			//	value:
			//		The visual element value is also set to a corresponding,
			//		but not necessarily the same, value.
			//
			//	formattedValue:
			//		If specified, used to set the visual element value,
			//		otherwise a computed visual value is used.
			//
			//	priorityChange:
			//		If true, an onChange event is fired immediately instead of 
			//		waiting for the next blur event.

			var filteredValue;
			if(value !== undefined){
				filteredValue = this.filter(value);
				if(filteredValue !== null && ((typeof filteredValue != "number") || !isNaN(filteredValue))){
					if(typeof formattedValue != "string"){
						formattedValue = this.format(filteredValue, this.constraints);
					}
				}else{ formattedValue = ''; }
			}
			if(formattedValue != null && formattedValue != undefined){
				this.textbox.value = formattedValue;
			}
			dijit.form.TextBox.superclass._setValueAttr.call(this, filteredValue, priorityChange);
		},

		// displayedValue: String
		//		For subclasses like ComboBox where the displayed value
		//		(ex: Kentucky) and the serialized value (ex: KY) are different,
		//		this represents the displayed value.
		//
		//		Setting 'displayedValue' through attr('displayedValue', ...)
		//		updates 'value', and vice-versa.  Othewise 'value' is updated
		//		from 'displayedValue' periodically, like onBlur etc.
		//
		//		TODO: move declaration to MappedTextBox?
		//		Problem is that ComboBox references displayedValue,
		//		for benefit of FilteringSelect.
		displayedValue: "",

		getDisplayedValue: function(){
			dojo.deprecated(this.declaredClass+"::getDisplayedValue() is deprecated. Use attr('displayedValue') instead.", "", "2.0");
			return this.attr('displayedValue');
		},

		_getDisplayedValueAttr: function(){
			//	summary:
			//		Hook so attr('displayedValue') works.
			//	description:
			//		Returns the displayed value (what the user sees on the screen),
			// 		after filtering (ie, trimming spaces etc.).
			//
			//		For some subclasses of TextBox (like ComboBox), the displayed value
			//		is different from the serialized value that's actually 
			//		sent to the server (see dijit.form.ValidationTextBox.serialize)
			
			return this.filter(this.textbox.value);
		},

		setDisplayedValue: function(/*String*/value){
			dojo.deprecated(this.declaredClass+"::setDisplayedValue() is deprecated. Use attr('displayedValue', ...) instead.", "", "2.0");
			this.attr('displayedValue', value);
		},
			
		_setDisplayedValueAttr: function(/*String*/value){
			// summary:
			//		Hook so attr('displayedValue', ...) works.
			//	description: 
			//		Sets the value of the visual element to the string "value".
			//		The widget value is also set to a corresponding,
			//		but not necessarily the same, value.

			this.textbox.value = value;
			this._setValueAttr(this.attr('value'));
		},

		format: function(/* String */ value, /* Object */ constraints){
			//	summary:
			//		Replacable function to convert a value to a properly formatted string
			return ((value == null || value == undefined) ? "" : (value.toString ? value.toString() : value));
		},

		parse: function(/* String */ value, /* Object */ constraints){
			//	summary:
			//		Replacable function to convert a formatted string to a value
			return value;
		},

		postCreate: function(){
			// setting the value here is needed since value="" in the template causes "undefined"
			// and setting in the DOM (instead of the JS object) helps with form reset actions
			this.textbox.setAttribute("value", this.textbox.value); // DOM and JS values should be the same
			this.inherited(arguments);

			/*#5297:if(this.srcNodeRef){
				dojo.style(this.textbox, "cssText", this.style);
				this.textbox.className += " " + this["class"];
			}*/
			this._layoutHack();
		},

		filter: function(val){
			//	summary:
			//		Auto-corrections (such as trimming) that are applied to textbox
			//		value on blur or form submit
			if(typeof val != "string"){ return val; }
			if(this.trim){
				val = dojo.trim(val);
			}
			if(this.uppercase){
				val = val.toUpperCase();
			}
			if(this.lowercase){
				val = val.toLowerCase();
			}
			if(this.propercase){
				val = val.replace(/[^\s]+/g, function(word){
					return word.substring(0,1).toUpperCase() + word.substring(1);
				});
			}
			return val;
		},

		_setBlurValue: function(){
			this._setValueAttr(this.attr('value'), (this.isValid ? this.isValid() : true));
		},

		_onBlur: function(){
			this._setBlurValue();
			this.inherited(arguments);
		}

	}
);

dijit.selectInputText = function(/*DomNode*/element, /*Number?*/ start, /*Number?*/ stop){
	//	summary:
	//		Select text in the input element argument, from start (default 0), to stop (default end).

	// TODO: use functions in _editor/selection.js?
	var _window = dojo.global;
	var _document = dojo.doc;
	element = dojo.byId(element);
	if(isNaN(start)){ start = 0; }
	if(isNaN(stop)){ stop = element.value ? element.value.length : 0; }
	element.focus();
	if(_document["selection"] && dojo.body()["createTextRange"]){ // IE
		if(element.createTextRange){
			var range = element.createTextRange();
			with(range){
				collapse(true);
				moveStart("character", start);
				moveEnd("character", stop);
				select();
			}
		}
	}else if(_window["getSelection"]){
		var selection = _window.getSelection();
		// FIXME: does this work on Safari?
		if(element.setSelectionRange){
			element.setSelectionRange(start, stop);
		}
	}
}

}

if(!dojo._hasResource["dijit.Tooltip"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Tooltip"] = true;
dojo.provide("dijit.Tooltip");




dojo.declare(
	"dijit._MasterTooltip",
	[dijit._Widget, dijit._Templated],
	{
		// summary
		//		Internal widget that holds the actual tooltip markup,
		//		which occurs once per page.
		//		Called by Tooltip widgets which are just containers to hold
		//		the markup

		// duration: Integer
		//		Milliseconds to fade in/fade out
		duration: dijit.defaultDuration,

		templateString:"<div class=\"dijitTooltip dijitTooltipLeft\" id=\"dojoTooltip\">\n\t<div class=\"dijitTooltipContainer dijitTooltipContents\" dojoAttachPoint=\"containerNode\" waiRole='alert'></div>\n\t<div class=\"dijitTooltipConnector\"></div>\n</div>\n",

		postCreate: function(){
			dojo.body().appendChild(this.domNode);

			this.bgIframe = new dijit.BackgroundIframe(this.domNode);

			// Setup fade-in and fade-out functions.
			this.fadeIn = dojo.fadeIn({ node: this.domNode, duration: this.duration, onEnd: dojo.hitch(this, "_onShow") });
			this.fadeOut = dojo.fadeOut({ node: this.domNode, duration: this.duration, onEnd: dojo.hitch(this, "_onHide") });

		},

		show: function(/*String*/ innerHTML, /*DomNode*/ aroundNode, /*String[]?*/ position){
			// summary:
			//	Display tooltip w/specified contents to right specified node
			//	(To left if there's no space on the right, or if LTR==right)

			if(this.aroundNode && this.aroundNode === aroundNode){
				return;
			}

			if(this.fadeOut.status() == "playing"){
				// previous tooltip is being hidden; wait until the hide completes then show new one
				this._onDeck=arguments;
				return;
			}
			this.containerNode.innerHTML=innerHTML;

			// Firefox bug. when innerHTML changes to be shorter than previous
			// one, the node size will not be updated until it moves.
			this.domNode.style.top = (this.domNode.offsetTop + 1) + "px";

			// position the element and change CSS according to position[] (a list of positions to try)
			var align = {};
			var ltr = this.isLeftToRight();
			dojo.forEach( (position && position.length) ? position : dijit.Tooltip.defaultPosition, function(pos){
				switch(pos){
					case "after":				
						align[ltr ? "BR" : "BL"] = ltr ? "BL" : "BR";
						break;
					case "before":
						align[ltr ? "BL" : "BR"] = ltr ? "BR" : "BL";
						break;
					case "below":
						// first try to align left borders, next try to align right borders (or reverse for RTL mode)
						align[ltr ? "BL" : "BR"] = ltr ? "TL" : "TR";
						align[ltr ? "BR" : "BL"] = ltr ? "TR" : "TL";
						break;
					case "above":
					default:
						// first try to align left borders, next try to align right borders (or reverse for RTL mode)
						align[ltr ? "TL" : "TR"] = ltr ? "BL" : "BR";
						align[ltr ? "TR" : "TL"] = ltr ? "BR" : "BL";
						break;
				}
			});
			var pos = dijit.placeOnScreenAroundElement(this.domNode, aroundNode, align, dojo.hitch(this, "orient"));

			// show it
			dojo.style(this.domNode, "opacity", 0);
			this.fadeIn.play();
			this.isShowingNow = true;
			this.aroundNode = aroundNode;
		},

		orient: function(/* DomNode */ node, /* String */ aroundCorner, /* String */ tooltipCorner){
			// summary: private function to set CSS for tooltip node based on which position it's in
			node.className = "dijitTooltip " +
				{
					"BL-TL": "dijitTooltipBelow dijitTooltipABLeft",
					"TL-BL": "dijitTooltipAbove dijitTooltipABLeft",
					"BR-TR": "dijitTooltipBelow dijitTooltipABRight",
					"TR-BR": "dijitTooltipAbove dijitTooltipABRight",
					"BR-BL": "dijitTooltipRight",
					"BL-BR": "dijitTooltipLeft"
				}[aroundCorner + "-" + tooltipCorner];
		},

		_onShow: function(){
			if(dojo.isIE){
				// the arrow won't show up on a node w/an opacity filter
				this.domNode.style.filter="";
			}
		},

		hide: function(aroundNode){
			// summary: hide the tooltip
			if(this._onDeck && this._onDeck[1] == aroundNode){
				// this hide request is for a show() that hasn't even started yet;
				// just cancel the pending show()
				this._onDeck=null;
			}else if(this.aroundNode === aroundNode){
				// this hide request is for the currently displayed tooltip
				this.fadeIn.stop();
				this.isShowingNow = false;
				this.aroundNode = null;
				this.fadeOut.play();
			}else{
				// just ignore the call, it's for a tooltip that has already been erased
			}
		},

		_onHide: function(){
			this.domNode.style.cssText="";	// to position offscreen again
			if(this._onDeck){
				// a show request has been queued up; do it now
				this.show.apply(this, this._onDeck);
				this._onDeck=null;
			}
		}

	}
);

dijit.showTooltip = function(/*String*/ innerHTML, /*DomNode*/ aroundNode, /*String[]?*/ position){
	// summary:
	//	Display tooltip w/specified contents in specified position.
	//	See description of dijit.Tooltip.defaultPosition for details on position parameter.
	//	If position is not specified then dijit.Tooltip.defaultPosition is used.
	if(!dijit._masterTT){ dijit._masterTT = new dijit._MasterTooltip(); }
	return dijit._masterTT.show(innerHTML, aroundNode, position);
};

dijit.hideTooltip = function(aroundNode){
	// summary: hide the tooltip
	if(!dijit._masterTT){ dijit._masterTT = new dijit._MasterTooltip(); }
	return dijit._masterTT.hide(aroundNode);
};

dojo.declare(
	"dijit.Tooltip",
	dijit._Widget,
	{
		// summary
		//		Pops up a tooltip (a help message) when you hover over a node.

		// label: String
		//		Text to display in the tooltip.
		//		Specified as innerHTML when creating the widget from markup.
		label: "",

		// showDelay: Integer
		//		Number of milliseconds to wait after hovering over/focusing on the object, before
		//		the tooltip is displayed.
		showDelay: 400,

		// connectId: String[]
		//		Id(s) of domNodes to attach the tooltip to.
		//		When user hovers over any of the specified dom nodes, the tooltip will appear.
		connectId: [],

		//	position: String[]
		//		See description of dijit.Tooltip.defaultPosition for details on position parameter.
		position: [],

		postCreate: function(){
			
			dojo.addClass(this.domNode,"dijitTooltipData");

			this._connectNodes = [];
			
			dojo.forEach(this.connectId, function(id) {
				var node = dojo.byId(id);
				if (node) {
					this._connectNodes.push(node);
					dojo.forEach(["onMouseEnter", "onMouseLeave", "onFocus", "onBlur"], function(event){
						this.connect(node, event.toLowerCase(), "_"+event);
					}, this);
					if(dojo.isIE){
						// BiDi workaround
						node.style.zoom = 1;
					}
				}
			}, this);
		},

		_onMouseEnter: function(/*Event*/ e){
			this._onHover(e);
		},

		_onMouseLeave: function(/*Event*/ e){
			this._onUnHover(e);
		},

		_onFocus: function(/*Event*/ e){
			this._focus = true;
			this._onHover(e);
			this.inherited(arguments);
		},
		
		_onBlur: function(/*Event*/ e){
			this._focus = false;
			this._onUnHover(e);
			this.inherited(arguments);
		},

		_onHover: function(/*Event*/ e){
			if(!this._showTimer){
				var target = e.target;
				this._showTimer = setTimeout(dojo.hitch(this, function(){this.open(target)}), this.showDelay);
			}
		},

		_onUnHover: function(/*Event*/ e){
			// keep a tooltip open if the associated element has focus
			if(this._focus){ return; }
			if(this._showTimer){
				clearTimeout(this._showTimer);
				delete this._showTimer;
			}
			this.close();
		},

		open: function(/*DomNode*/ target){
 			// summary: display the tooltip; usually not called directly.
			target = target || this._connectNodes[0];
			if(!target){ return; }

			if(this._showTimer){
				clearTimeout(this._showTimer);
				delete this._showTimer;
			}
			dijit.showTooltip(this.label || this.domNode.innerHTML, target, this.position);
			
			this._connectNode = target;
		},

		close: function(){
			// summary: hide the tooltip or cancel timer for show of tooltip
			if(this._connectNode){
				// if tooltip is currently shown
				dijit.hideTooltip(this._connectNode);
				delete this._connectNode;
			}
			if(this._showTimer){
				// if tooltip is scheduled to be shown (after a brief delay)
				clearTimeout(this._showTimer);
				delete this._showTimer;
			}
		},

		uninitialize: function(){
			this.close();
		}
	}
);

// dijit.Tooltip.defaultPosition: String[]
//		This variable controls the position of tooltips, if the position is not specified to
//		the Tooltip widget or *TextBox widget itself.  It's an array of strings with the following values:
//
//			* before: places tooltip to the left of the target node/widget, or to the right in
//			  the case of RTL scripts like Hebrew and Arabic
//			* after: places tooltip to the right of the target node/widget, or to the left in
//			  the case of RTL scripts like Hebrew and Arabic
//			* above: tooltip goes above target node
//			* below: tooltip goes below target node
//
//		The list is positions is tried, in order, until a position is found where the tooltip fits
//		within the viewport.
//
//		Be careful setting this parameter.  A value of "above" may work fine until the user scrolls
//		the screen so that there's no room above the target node.   Nodes with drop downs, like
//		DropDownButton or FilteringSelect, are especially problematic, in that you need to be sure
//		that the drop down and tooltip don't overlap, even when the viewport is scrolled so that there
//		is only room below (or above) the target node, but not both.
dijit.Tooltip.defaultPosition = ["after", "before"];

}

if(!dojo._hasResource["dijit.form.ValidationTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.ValidationTextBox"] = true;
dojo.provide("dijit.form.ValidationTextBox");








/*=====
	dijit.form.ValidationTextBox.__Constraints = function(){
		// locale: String
		//		locale used for validation, picks up value from this widget's lang attribute
		// _flags_: anything
		//		various flags passed to regExpGen function
		this.locale = "";
		this._flags_ = "";
	}
=====*/

dojo.declare(
	"dijit.form.ValidationTextBox",
	dijit.form.TextBox,
	{
		// summary:
		//		A TextBox subclass with the ability to validate content of various types and provide user feedback.

		templateString:"<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\" waiRole=\"presentation\"\n\t><div style=\"overflow:hidden;\"\n\t\t><div class=\"dijitReset dijitValidationIcon\"><br></div\n\t\t><div class=\"dijitReset dijitValidationIconText\">&Chi;</div\n\t\t><div class=\"dijitReset dijitInputField\"\n\t\t\t><input class=\"dijitReset\" dojoAttachPoint='textbox,focusNode' dojoAttachEvent='onfocus:_update,onkeyup:_update,onblur:_onMouse,onkeypress:_onKeyPress' autocomplete=\"off\"\n\t\t\ttype='${type}' name='${name}'\n\t\t/></div\n\t></div\n></div>\n",
		baseClass: "dijitTextBox",

		// default values for new subclass properties
		// required: Boolean
		//		Can be true or false, default is false.
		required: false,

		// promptMessage: String
		//		Hint string
		promptMessage: "",

		// invalidMessage: String
		// 		The message to display if value is invalid.
		invalidMessage: "$_unset_$", // read from the message file if not overridden

		// constraints: dijit.form.ValidationTextBox.__Constraints
		//		user-defined object needed to pass parameters to the validator functions
		constraints: {},

		// regExp: String
		//		regular expression string used to validate the input
		//		Do not specify both regExp and regExpGen
		regExp: ".*",

		// regExpGen: Function
		//		user replaceable function used to generate regExp when dependent on constraints
		//		Do not specify both regExp and regExpGen
		regExpGen: function(/*dijit.form.ValidationTextBox.__Constraints*/constraints){ return this.regExp; },

		// state: String
		//		Shows current state (ie, validation result) of input (Normal, Warning, or Error)
		state: "",

		//	tooltipPosition: String[]
		//		See description of dijit.Tooltip.defaultPosition for details on this parameter.
		tooltipPosition: [],

		_setValueAttr: function(){
			// summary:
			//		Hook so attr('value', ...) works.
			this.inherited(arguments);
			this.validate(this._focused);
		},

		validator: function(/*anything*/value, /*dijit.form.ValidationTextBox.__Constraints*/constraints){
			// summary: user replaceable function used to validate the text input against the regular expression.
			return (new RegExp("^(?:" + this.regExpGen(constraints) + ")"+(this.required?"":"?")+"$")).test(value) &&
				(!this.required || !this._isEmpty(value)) &&
				(this._isEmpty(value) || this.parse(value, constraints) !== undefined); // Boolean
		},

		_isValidSubset: function(){
			// summary:
			//	Returns true if the value is either already valid or could be made valid by appending characters.
			return this.textbox.value.search(this._partialre) == 0;
		},

		isValid: function(/*Boolean*/ isFocused){
			// summary: Need to over-ride with your own validation code in subclasses
			return this.validator(this.textbox.value, this.constraints);
		},

		_isEmpty: function(value){
			// summary: Checks for whitespace
			return /^\s*$/.test(value); // Boolean
		},

		getErrorMessage: function(/*Boolean*/ isFocused){
			// summary: return an error message to show if appropriate
			return this.invalidMessage; // String
		},

		getPromptMessage: function(/*Boolean*/ isFocused){
			// summary: return a hint to show if appropriate
			return this.promptMessage; // String
		},

		_maskValidSubsetError: true,
		validate: function(/*Boolean*/ isFocused){
			// summary:
			//		Called by oninit, onblur, and onkeypress.
			// description:
			//		Show missing or invalid messages if appropriate, and highlight textbox field.
			var message = "";
			var isValid = this.disabled || this.isValid(isFocused);
			if(isValid){ this._maskValidSubsetError = true; }
			var isValidSubset = !isValid && isFocused && this._isValidSubset();
			var isEmpty = this._isEmpty(this.textbox.value);
			this.state = (isValid || (!this._hasBeenBlurred && isEmpty) || isValidSubset) ? "" : "Error";
			if(this.state == "Error"){ this._maskValidSubsetError = false; }
			this._setStateClass();
			dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");
			if(isFocused){
				if(isEmpty){
					message = this.getPromptMessage(true);
				}
				if(!message && (this.state == "Error" || (isValidSubset && !this._maskValidSubsetError))){
					message = this.getErrorMessage(true);
				}
			}
			this.displayMessage(message);
			return isValid;
		},

		// currently displayed message
		_message: "",

		displayMessage: function(/*String*/ message){
			// summary:
			//		User overridable method to display validation errors/hints.
			//		By default uses a tooltip.
			if(this._message == message){ return; }
			this._message = message;
			dijit.hideTooltip(this.domNode);
			if(message){
				dijit.showTooltip(message, this.domNode, this.tooltipPosition);
			}
		},

		_refreshState: function(){
			this.validate(this._focused);
		},

		_update: function(/*Event*/e){
			this._refreshState();
			this._onMouse(e);	// update CSS classes
		},

		//////////// INITIALIZATION METHODS ///////////////////////////////////////

		constructor: function(){
			this.constraints = {};
		},

		postMixInProperties: function(){
			this.inherited(arguments);
			this.constraints.locale = this.lang;
			this.messages = dojo.i18n.getLocalization("dijit.form", "validate", this.lang);
			if(this.invalidMessage == "$_unset_$"){ this.invalidMessage = this.messages.invalidMessage; }
			var p = this.regExpGen(this.constraints);
			this.regExp = p;
			var partialre = "";
			// parse the regexp and produce a new regexp that matches valid subsets
			// if the regexp is .* then there's no use in matching subsets since everything is valid
			if(p != ".*"){ this.regExp.replace(/\\.|\[\]|\[.*?[^\\]{1}\]|\{.*?\}|\(\?[=:!]|./g,
				function (re){
					switch(re.charAt(0)){
						case '{':
						case '+':
						case '?':
						case '*':
						case '^':
						case '$':
						case '|':
						case '(': partialre += re; break;
						case ")": partialre += "|$)"; break;
						 default: partialre += "(?:"+re+"|$)"; break;
					}
				}
			);}
			try{ // this is needed for now since the above regexp parsing needs more test verification
				"".search(partialre);
			}catch(e){ // should never be here unless the original RE is bad or the parsing is bad
				partialre = this.regExp;
				console.debug('RegExp error in ' + this.declaredClass + ': ' + this.regExp);
			} // should never be here unless the original RE is bad or the parsing is bad
			this._partialre = "^(?:" + partialre + ")$";
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			this.inherited(arguments);	// call FormValueWidget._setDisabledAttr()
					if(this.valueNode){
				this.valueNode.disabled = value;
					}
					this._refreshState();
		},
		
		_setRequiredAttr: function(/*Boolean*/ value){
			this.required = value;
			dijit.setWaiState(this.focusNode,"required", value);
					this._refreshState();				
		},

		postCreate: function(){
			if(dojo.isIE){ // IE INPUT tag fontFamily has to be set directly using STYLE
				var s = dojo.getComputedStyle(this.focusNode);
				if(s){
					var ff = s.fontFamily;
					if(ff){
						this.focusNode.style.fontFamily = ff;
					}
				}
			}
			this.inherited(arguments);
		}
	}
);

dojo.declare(
	"dijit.form.MappedTextBox",
	dijit.form.ValidationTextBox,
	{
		// summary:
		//		A dijit.form.ValidationTextBox subclass which provides a visible formatted display and a serializable
		//		value in a hidden input field which is actually sent to the server.  The visible display may
		//		be locale-dependent and interactive.  The value sent to the server is stored in a hidden
		//		input field which uses the `name` attribute declared by the original widget.  That value sent
		//		to the serveris defined by the dijit.form.MappedTextBox.serialize method and is typically
		//		locale-neutral.

		serialize: function(/*anything*/val, /*Object?*/options){
			// summary: user replaceable function used to convert the attr('value') result to a String
			return val.toString ? val.toString() : ""; // String
		},

		toString: function(){
			// summary: display the widget as a printable string using the widget's value
			
			// TODO: seems like the filter() call here is unnecessary as attr('value') should do that
			var val = this.filter(this.attr('value'));
			return val != null ? (typeof val == "string" ? val : this.serialize(val, this.constraints)) : ""; // String
		},

		validate: function(){
			this.valueNode.value = this.toString();
			return this.inherited(arguments);
		},

		buildRendering: function(){
			this.inherited(arguments);

			// Create a hidden <input> node with the serialized value used for submit
			// (as opposed to the displayed value)
			var textbox = this.textbox;
			var valueNode = (this.valueNode = dojo.doc.createElement("input"));
			valueNode.setAttribute("type", textbox.type);
			dojo.style(valueNode, "display", "none");
			this.valueNode.name = this.textbox.name;
			dojo.place(valueNode, textbox, "after");

			// try to give the displayed node a different name, or ideally
			// remove that attribute altogether
			this.textbox.name = this.textbox.name + "_displayed_";
			this.textbox.removeAttribute("name");
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			this.inherited(arguments);
			dojo.attr(this.valueNode, 'disabled', value);
		}
	}
);

/*=====
	dijit.form.RangeBoundTextBox.__Constraints = function(){
		// min: Number
		//		Minimum signed value.  Default is -Infinity
		// max: Number
		//		Maximum signed value.  Default is +Infinity
		this.min = min;
		this.max = max;
	}
=====*/

dojo.declare(
	"dijit.form.RangeBoundTextBox",
	dijit.form.MappedTextBox,
	{
		// summary:
		//		A dijit.form.MappedTextBox subclass which defines a range of valid values
		//
		// constraints: dijit.form.RangeBoundTextBox.__Constraints
		//
		// rangeMessage: String
		//		The message to display if value is out-of-range

		/*=====
		constraints: {},
		======*/
		rangeMessage: "",

		rangeCheck: function(/*Number*/ primitive, /*dijit.form.RangeBoundTextBox.__Constraints*/ constraints){
			// summary: user replaceable function used to validate the range of the numeric input value
			var isMin = "min" in constraints;
			var isMax = "max" in constraints;
			if(isMin || isMax){
				return (!isMin || this.compare(primitive,constraints.min) >= 0) &&
					(!isMax || this.compare(primitive,constraints.max) <= 0);
			}
			return true; // Boolean
		},

		isInRange: function(/*Boolean*/ isFocused){
			// summary: Need to over-ride with your own validation code in subclasses
			return this.rangeCheck(this.attr('value'), this.constraints);
		},

		_isDefinitelyOutOfRange: function(){
			// summary:
			//	Returns true if the value is out of range and will remain
			//	out of range even if the user types more characters
			var val = this.attr('value');
			var isTooLittle = false;
			var isTooMuch = false;
			if("min" in this.constraints){
				var min = this.constraints.min;
				val = this.compare(val, ((typeof min == "number") && min >= 0 && val !=0)? 0 : min);
				isTooLittle = (typeof val == "number") && val < 0;
			}
			if("max" in this.constraints){
				var max = this.constraints.max;
				val = this.compare(val, ((typeof max != "number") || max > 0)? max : 0);
				isTooMuch = (typeof val == "number") && val > 0;
			}
			return isTooLittle || isTooMuch;
		},

		_isValidSubset: function(){
			return this.inherited(arguments) && !this._isDefinitelyOutOfRange();
		},

		isValid: function(/*Boolean*/ isFocused){
			return this.inherited(arguments) &&
				((this._isEmpty(this.textbox.value) && !this.required) || this.isInRange(isFocused)); // Boolean
		},

		getErrorMessage: function(/*Boolean*/ isFocused){
			if(dijit.form.RangeBoundTextBox.superclass.isValid.call(this, false) && !this.isInRange(isFocused)){ return this.rangeMessage; } // String
			return this.inherited(arguments);
		},

		postMixInProperties: function(){
			this.inherited(arguments);
			if(!this.rangeMessage){
				this.messages = dojo.i18n.getLocalization("dijit.form", "validate", this.lang);
				this.rangeMessage = this.messages.rangeMessage;
			}
		},

		postCreate: function(){
			this.inherited(arguments);
			if(this.constraints.min !== undefined){
				dijit.setWaiState(this.focusNode, "valuemin", this.constraints.min);
			}
			if(this.constraints.max !== undefined){
				dijit.setWaiState(this.focusNode, "valuemax", this.constraints.max);
			}
		},
		
		_setValueAttr: function(/*Number*/ value, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so attr('value', ...) works.
			dijit.setWaiState(this.focusNode, "valuenow", value);
			this.inherited(arguments);
		}
	}
);

}

if(!dojo._hasResource["dojo.data.util.simpleFetch"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.data.util.simpleFetch"] = true;
dojo.provide("dojo.data.util.simpleFetch");


dojo.data.util.simpleFetch.fetch = function(/* Object? */ request){
	//	summary:
	//		The simpleFetch mixin is designed to serve as a set of function(s) that can
	//		be mixed into other datastore implementations to accelerate their development.  
	//		The simpleFetch mixin should work well for any datastore that can respond to a _fetchItems() 
	//		call by returning an array of all the found items that matched the query.  The simpleFetch mixin
	//		is not designed to work for datastores that respond to a fetch() call by incrementally
	//		loading items, or sequentially loading partial batches of the result
	//		set.  For datastores that mixin simpleFetch, simpleFetch 
	//		implements a fetch method that automatically handles eight of the fetch()
	//		arguments -- onBegin, onItem, onComplete, onError, start, count, sort and scope
	//		The class mixing in simpleFetch should not implement fetch(),
	//		but should instead implement a _fetchItems() method.  The _fetchItems() 
	//		method takes three arguments, the keywordArgs object that was passed 
	//		to fetch(), a callback function to be called when the result array is
	//		available, and an error callback to be called if something goes wrong.
	//		The _fetchItems() method should ignore any keywordArgs parameters for
	//		start, count, onBegin, onItem, onComplete, onError, sort, and scope.  
	//		The _fetchItems() method needs to correctly handle any other keywordArgs
	//		parameters, including the query parameter and any optional parameters 
	//		(such as includeChildren).  The _fetchItems() method should create an array of 
	//		result items and pass it to the fetchHandler along with the original request object 
	//		-- or, the _fetchItems() method may, if it wants to, create an new request object 
	//		with other specifics about the request that are specific to the datastore and pass 
	//		that as the request object to the handler.
	//
	//		For more information on this specific function, see dojo.data.api.Read.fetch()
	request = request || {};
	if(!request.store){
		request.store = this;
	}
	var self = this;

	var _errorHandler = function(errorData, requestObject){
		if(requestObject.onError){
			var scope = requestObject.scope || dojo.global;
			requestObject.onError.call(scope, errorData, requestObject);
		}
	};

	var _fetchHandler = function(items, requestObject){
		var oldAbortFunction = requestObject.abort || null;
		var aborted = false;

		var startIndex = requestObject.start?requestObject.start:0;
		var endIndex   = (requestObject.count && (requestObject.count !== Infinity))?(startIndex + requestObject.count):items.length;

		requestObject.abort = function(){
			aborted = true;
			if(oldAbortFunction){
				oldAbortFunction.call(requestObject);
			}
		};

		var scope = requestObject.scope || dojo.global;
		if(!requestObject.store){
			requestObject.store = self;
		}
		if(requestObject.onBegin){
			requestObject.onBegin.call(scope, items.length, requestObject);
		}
		if(requestObject.sort){
			items.sort(dojo.data.util.sorter.createSortFunction(requestObject.sort, self));
		}
		if(requestObject.onItem){
			for(var i = startIndex; (i < items.length) && (i < endIndex); ++i){
				var item = items[i];
				if(!aborted){
					requestObject.onItem.call(scope, item, requestObject);
				}
			}
		}
		if(requestObject.onComplete && !aborted){
			var subset = null;
			if (!requestObject.onItem) {
				subset = items.slice(startIndex, endIndex);
			}
			requestObject.onComplete.call(scope, subset, requestObject);   
		}
	};
	this._fetchItems(request, _fetchHandler, _errorHandler);
	return request;	// Object
};

}

if(!dojo._hasResource["dojo.data.util.filter"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.data.util.filter"] = true;
dojo.provide("dojo.data.util.filter");

dojo.data.util.filter.patternToRegExp = function(/*String*/pattern, /*boolean?*/ ignoreCase){
	//	summary:  
	//		Helper function to convert a simple pattern to a regular expression for matching.
	//	description:
	//		Returns a regular expression object that conforms to the defined conversion rules.
	//		For example:  
	//			ca*   -> /^ca.*$/
	//			*ca*  -> /^.*ca.*$/
	//			*c\*a*  -> /^.*c\*a.*$/
	//			*c\*a?*  -> /^.*c\*a..*$/
	//			and so on.
	//
	//	pattern: string
	//		A simple matching pattern to convert that follows basic rules:
	//			* Means match anything, so ca* means match anything starting with ca
	//			? Means match single character.  So, b?b will match to bob and bab, and so on.
	//      	\ is an escape character.  So for example, \* means do not treat * as a match, but literal character *.
	//				To use a \ as a character in the string, it must be escaped.  So in the pattern it should be 
	//				represented by \\ to be treated as an ordinary \ character instead of an escape.
	//
	//	ignoreCase:
	//		An optional flag to indicate if the pattern matching should be treated as case-sensitive or not when comparing
	//		By default, it is assumed case sensitive.

	var rxp = "^";
	var c = null;
	for(var i = 0; i < pattern.length; i++){
		c = pattern.charAt(i);
		switch (c) {
			case '\\':
				rxp += c;
				i++;
				rxp += pattern.charAt(i);
				break;
			case '*':
				rxp += ".*"; break;
			case '?':
				rxp += "."; break;
			case '$':
			case '^':
			case '/':
			case '+':
			case '.':
			case '|':
			case '(':
			case ')':
			case '{':
			case '}':
			case '[':
			case ']':
				rxp += "\\"; //fallthrough
			default:
				rxp += c;
		}
	}
	rxp += "$";
	if(ignoreCase){
		return new RegExp(rxp,"mi"); //RegExp
	}else{
		return new RegExp(rxp,"m"); //RegExp
	}
	
};

}

if(!dojo._hasResource["dijit.form.ComboBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.ComboBox"] = true;
dojo.provide("dijit.form.ComboBox");







dojo.declare(
	"dijit.form.ComboBoxMixin",
	null,
	{
		// summary:
		//		Implements the base functionality for ComboBox/FilteringSelect
		// description:
		//		All widgets that mix in dijit.form.ComboBoxMixin must extend dijit.form._FormValueWidget

		// item: Object
		//		This is the item returned by the dojo.data.store implementation that
		//		provides the data for this cobobox, it's the currently selected item.
		item: null,

		// pageSize: Integer
		//		Argument to data provider.
		//		Specifies number of search results per page (before hitting "next" button)
		pageSize: Infinity,

		// store: Object
		//		Reference to data provider object used by this ComboBox
		store: null,

		// fetchProperties: Object
		//		Mixin to the dojo.data store's fetch.
		//		For example, to set the sort order of the ComboBox menu, pass:
		//		{sort:{attribute:"name",descending:true}}
		fetchProperties:{},

		// query: Object
		//		A query that can be passed to 'store' to initially filter the items,
		//		before doing further filtering based on `searchAttr` and the key.
		//		Any reference to the `searchAttr` is ignored.
		query: {},

		// autoComplete: Boolean
		//		If you type in a partial string, and then tab out of the `<input>` box,
		//		automatically copy the first entry displayed in the drop down list to
		//		the `<input>` field
		autoComplete: true,

		// highlightMatch: String
		// 		One of: "first", "all" or "none".
		//		If the ComboBox opens with the serach results and the searched
		//		string can be found it will be highlighted.
		//		This value is not considered when labelType!="text" to not
		//		screw up any mark up the label might contain.
		highlightMatch: "first",
		
		// searchDelay: Integer
		//		Delay in milliseconds between when user types something and we start
		//		searching based on that value
		searchDelay: 100,

		// searchAttr: String
		//		Searches pattern match against this field
		searchAttr: "name",

		// labelAttr: String
		//		Optional.  The text that actually appears in the drop down.
		//		If not specified, the searchAttr text is used instead.
		labelAttr: "",

		// labelType: String
		//		"html" or "text"
		labelType: "text",

		// queryExpr: String
		//		dojo.data query expression pattern.
		//		`${0}` will be substituted for the user text.
		//		`*` is used for wildcards.
		//		`${0}*` means "starts with", `*${0}*` means "contains", `${0}` means "is"
		queryExpr: "${0}*",

		// ignoreCase: Boolean
		//		Set true if the ComboBox should ignore case when matching possible items
		ignoreCase: true,

		// hasDownArrow: Boolean
		//		Set this textbox to have a down arrow button.
		//		Defaults to true.
		hasDownArrow:true,

		templateString:"<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\" dojoAttachPoint=\"comboNode\" waiRole=\"combobox\" tabIndex=\"-1\"\n\t><div style=\"overflow:hidden;\"\n\t\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton'\n\t\t\tdojoAttachPoint=\"downArrowNode\" waiRole=\"presentation\"\n\t\t\tdojoAttachEvent=\"onmousedown:_onArrowMouseDown,onmouseup:_onMouse,onmouseenter:_onMouse,onmouseleave:_onMouse\"\n\t\t\t><div class=\"dijitArrowButtonInner\">&thinsp;</div\n\t\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div\n\t\t></div\n\t\t><div class=\"dijitReset dijitValidationIcon\"><br></div\n\t\t><div class=\"dijitReset dijitValidationIconText\">&Chi;</div\n\t\t><div class=\"dijitReset dijitInputField\"\n\t\t\t><input type=\"text\" autocomplete=\"off\" name=\"${name}\" class='dijitReset'\n\t\t\tdojoAttachEvent=\"onkeypress:_onKeyPress, onfocus:_update, compositionend\"\n\t\t\tdojoAttachPoint=\"textbox,focusNode\" waiRole=\"textbox\" waiState=\"haspopup-true,autocomplete-list\"\n\t\t/></div\n\t></div\n></div>\n",

		baseClass:"dijitComboBox",

		_getCaretPos: function(/*DomNode*/ element){
			// khtml 3.5.2 has selection* methods as does webkit nightlies from 2005-06-22
			var pos = 0;
			if(typeof(element.selectionStart)=="number"){
				// FIXME: this is totally borked on Moz < 1.3. Any recourse?
				pos = element.selectionStart;
			}else if(dojo.isIE){
				// in the case of a mouse click in a popup being handled,
				// then the dojo.doc.selection is not the textarea, but the popup
				// var r = dojo.doc.selection.createRange();
				// hack to get IE 6 to play nice. What a POS browser.
				var tr = dojo.doc.selection.createRange().duplicate();
				var ntr = element.createTextRange();
				tr.move("character",0);
				ntr.move("character",0);
				try{
					// If control doesnt have focus, you get an exception.
					// Seems to happen on reverse-tab, but can also happen on tab (seems to be a race condition - only happens sometimes).
					// There appears to be no workaround for this - googled for quite a while.
					ntr.setEndPoint("EndToEnd", tr);
					pos = String(ntr.text).replace(/\r/g,"").length;
				}catch(e){
					// If focus has shifted, 0 is fine for caret pos.
				}
			}
			return pos;
		},

		_setCaretPos: function(/*DomNode*/ element, /*Number*/ location){
			location = parseInt(location);
			dijit.selectInputText(element, location, location);
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			// summary:
			//		Call this from superclass as part of _setDisabledAttr() method.
			//		Superclass _must_ define _setDisabledAttr().
			// description:
			//		Additional code to set disabled state of combobox node
				dijit.setWaiState(this.comboNode, "disabled", value);
		},	
		
		_onKeyPress: function(/*Event*/ evt){
			// summary: handles keyboard events
			var key = evt.charOrCode;
			//except for cutting/pasting case - ctrl + x/v
			if(evt.altKey || (evt.ctrlKey && (key != 'x' && key != 'v')) || evt.key == dojo.keys.SHIFT){
				return; // throw out weird key combinations and spurious events
			}
			var doSearch = false;
			var pw = this._popupWidget;
			var dk = dojo.keys;
			if(this._isShowingNow){
				pw.handleKey(key);
			}
			switch(key){
				case dk.PAGE_DOWN:
				case dk.DOWN_ARROW:
					if(!this._isShowingNow||this._prev_key_esc){
						this._arrowPressed();
						doSearch=true;
					}else{
						this._announceOption(pw.getHighlightedOption());
					}
					dojo.stopEvent(evt);
					this._prev_key_backspace = false;
					this._prev_key_esc = false;
					break;

				case dk.PAGE_UP:
				case dk.UP_ARROW:
					if(this._isShowingNow){
						this._announceOption(pw.getHighlightedOption());
					}
					dojo.stopEvent(evt);
					this._prev_key_backspace = false;
					this._prev_key_esc = false;
					break;

				case dk.ENTER:
					// prevent submitting form if user presses enter. Also
					// prevent accepting the value if either Next or Previous
					// are selected
					var highlighted;
					if(this._isShowingNow && 
						(highlighted = pw.getHighlightedOption())
					){
						// only stop event on prev/next
						if(highlighted == pw.nextButton){
							this._nextSearch(1);
							dojo.stopEvent(evt);
							break;
						}else if(highlighted == pw.previousButton){
							this._nextSearch(-1);
							dojo.stopEvent(evt);
							break;
						}
					}else{
						// Update 'value' (ex: KY) according to currently displayed text
						this._setDisplayedValueAttr(this.attr('displayedValue'), true);
					}
					// default case:
					// prevent submit, but allow event to bubble
					evt.preventDefault();
					// fall through

				case dk.TAB:
					var newvalue = this.attr('displayedValue');
					// #4617: 
					//		if the user had More Choices selected fall into the
					//		_onBlur handler
					if(pw && (
						newvalue == pw._messages["previousMessage"] ||
						newvalue == pw._messages["nextMessage"])
					){
						break;
					}
					if(this._isShowingNow){
						this._prev_key_backspace = false;
						this._prev_key_esc = false;
						if(pw.getHighlightedOption()){
							pw.attr('value', { target: pw.getHighlightedOption() });
						}
						this._lastQuery = null; // in case results come back later
						this._hideResultList();
					}
					break;

				case ' ':
					this._prev_key_backspace = false;
					this._prev_key_esc = false;
					if(this._isShowingNow && pw.getHighlightedOption()){
						dojo.stopEvent(evt);
						this._selectOption();
						this._hideResultList();
					}else{
						doSearch = true;
					}
					break;

				case dk.ESCAPE:
					this._prev_key_backspace = false;
					this._prev_key_esc = true;
					if(this._isShowingNow){
						dojo.stopEvent(evt);
						this._hideResultList();
					}else{
						this.inherited(arguments);
					}
					break;

				case dk.DELETE:
				case dk.BACKSPACE:
					this._prev_key_esc = false;
					this._prev_key_backspace = true;
					doSearch = true;
					break;

				case dk.RIGHT_ARROW: // fall through
				case dk.LEFT_ARROW: 
					this._prev_key_backspace = false;
					this._prev_key_esc = false;
					break;

				default: // non char keys (F1-F12 etc..)  shouldn't open list
					this._prev_key_backspace = false;
					this._prev_key_esc = false;
					doSearch = typeof key == 'string';
			}
			if(this.searchTimer){
				clearTimeout(this.searchTimer);
			}
			if(doSearch){
				// need to wait a tad before start search so that the event
				// bubbles through DOM and we have value visible
				setTimeout(dojo.hitch(this, "_startSearchFromInput"),1);
			}
		},

		_autoCompleteText: function(/*String*/ text){
			// summary:
			// 		Fill in the textbox with the first item from the drop down
			// 		list, and highlight the characters that were
			// 		auto-completed. For example, if user typed "CA" and the
			// 		drop down list appeared, the textbox would be changed to
			// 		"California" and "ifornia" would be highlighted.

			var fn = this.focusNode;

			// IE7: clear selection so next highlight works all the time
			dijit.selectInputText(fn, fn.value.length);
			// does text autoComplete the value in the textbox?
			var caseFilter = this.ignoreCase? 'toLowerCase' : 'substr';
			if(text[caseFilter](0).indexOf(this.focusNode.value[caseFilter](0)) == 0){
				var cpos = this._getCaretPos(fn);
				// only try to extend if we added the last character at the end of the input
				if((cpos+1) > fn.value.length){
					// only add to input node as we would overwrite Capitalisation of chars
					// actually, that is ok
					fn.value = text;//.substr(cpos);
					// visually highlight the autocompleted characters
					dijit.selectInputText(fn, cpos);
				}
			}else{
				// text does not autoComplete; replace the whole value and highlight
				fn.value = text;
				dijit.selectInputText(fn);
			}
		},

		_openResultList: function(/*Object*/ results, /*Object*/ dataObject){
			if(	this.disabled || 
				this.readOnly || 
				(dataObject.query[this.searchAttr] != this._lastQuery)
			){
				return;
			}
			this._popupWidget.clearResultList();
			if(!results.length){
				this._hideResultList();
				return;
			}

			// Fill in the textbox with the first item from the drop down list,
			// and highlight the characters that were auto-completed. For
			// example, if user typed "CA" and the drop down list appeared, the
			// textbox would be changed to "California" and "ifornia" would be
			// highlighted.

			var zerothvalue = new String(this.store.getValue(results[0], this.searchAttr));
			if(zerothvalue && this.autoComplete && !this._prev_key_backspace &&
				(dataObject.query[this.searchAttr] != "*")){
				// when the user clicks the arrow button to show the full list,
				// startSearch looks for "*".
				// it does not make sense to autocomplete
				// if they are just previewing the options available.
				this._autoCompleteText(zerothvalue);
			}
			dataObject._maxOptions = this._maxOptions;
			this._popupWidget.createOptions(
				results, 
				dataObject, 
				dojo.hitch(this, "_getMenuLabelFromItem")
			);

			// show our list (only if we have content, else nothing)
			this._showResultList();

			// #4091:
			//		tell the screen reader that the paging callback finished by
			//		shouting the next choice
			if(dataObject.direction){
				if(1 == dataObject.direction){
					this._popupWidget.highlightFirstOption();
				}else if(-1 == dataObject.direction){
					this._popupWidget.highlightLastOption();
				}
				this._announceOption(this._popupWidget.getHighlightedOption());
			}
		},

		_showResultList: function(){
			this._hideResultList();
			var items = this._popupWidget.getItems(),
				visibleCount = Math.min(items.length,this.maxListLength);
			this._arrowPressed();
			// hide the tooltip
			this.displayMessage("");
			
			// Position the list and if it's too big to fit on the screen then
			// size it to the maximum possible height
			// Our dear friend IE doesnt take max-height so we need to
			// calculate that on our own every time

			// TODO: want to redo this, see 
			//		http://trac.dojotoolkit.org/ticket/3272
			//	and
			//		http://trac.dojotoolkit.org/ticket/4108


			// natural size of the list has changed, so erase old
			// width/height settings, which were hardcoded in a previous
			// call to this function (via dojo.marginBox() call)
			dojo.style(this._popupWidget.domNode, {width: "", height: ""});

			var best = this.open();
			// #3212:
			//		only set auto scroll bars if necessary prevents issues with
			//		scroll bars appearing when they shouldn't when node is made
			//		wider (fractional pixels cause this)
			var popupbox = dojo.marginBox(this._popupWidget.domNode);
			this._popupWidget.domNode.style.overflow = 
				((best.h==popupbox.h)&&(best.w==popupbox.w)) ? "hidden" : "auto";
			// #4134:
			//		borrow TextArea scrollbar test so content isn't covered by
			//		scrollbar and horizontal scrollbar doesn't appear
			var newwidth = best.w;
			if(best.h < this._popupWidget.domNode.scrollHeight){
				newwidth += 16;
			}
			dojo.marginBox(this._popupWidget.domNode, {
				h: best.h,
				w: Math.max(newwidth, this.domNode.offsetWidth)
			});
			dijit.setWaiState(this.comboNode, "expanded", "true");
		},

		_hideResultList: function(){
			if(this._isShowingNow){
				dijit.popup.close(this._popupWidget);
				this._arrowIdle();
				this._isShowingNow=false;
				dijit.setWaiState(this.comboNode, "expanded", "false");
				dijit.removeWaiState(this.focusNode,"activedescendant");
			}
		},

		_setBlurValue: function(){
			// if the user clicks away from the textbox OR tabs away, set the
			// value to the textbox value
			// #4617: 
			//		if value is now more choices or previous choices, revert
			//		the value
			var newvalue=this.attr('displayedValue');
			var pw = this._popupWidget;
			if(pw && (
				newvalue == pw._messages["previousMessage"] ||
				newvalue == pw._messages["nextMessage"]
				)
			){
				this._setValueAttr(this._lastValueReported, true);
			}else{
				// Update 'value' (ex: KY) according to currently displayed text
				this.attr('displayedValue', newvalue);
			}
		},

		_onBlur: function(){
			// summary: called magically when focus has shifted away from this widget and it's dropdown
			this._hideResultList();
			this._arrowIdle();
			this.inherited(arguments);
		},

		_announceOption: function(/*Node*/ node){
			// summary:
			//		a11y code that puts the highlighted option in the textbox
			//		This way screen readers will know what is happening in the
			//		menu

			if(node == null){
				return;
			}
			// pull the text value from the item attached to the DOM node
			var newValue;
			if( node == this._popupWidget.nextButton ||
				node == this._popupWidget.previousButton){
				newValue = node.innerHTML;
			}else{
				newValue = this.store.getValue(node.item, this.searchAttr);
			}
			// get the text that the user manually entered (cut off autocompleted text)
			this.focusNode.value = this.focusNode.value.substring(0, this._getCaretPos(this.focusNode));
			//set up ARIA activedescendant
			dijit.setWaiState(this.focusNode, "activedescendant", dojo.attr(node, "id")); 
			// autocomplete the rest of the option to announce change
			this._autoCompleteText(newValue);
		},

		_selectOption: function(/*Event*/ evt){
			var tgt = null;
			if(!evt){
				evt ={ target: this._popupWidget.getHighlightedOption()};
			}
				// what if nothing is highlighted yet?
			if(!evt.target){
				// handle autocompletion where the the user has hit ENTER or TAB
				this.attr('displayedValue', this.attr('displayedValue'));
				return;
			// otherwise the user has accepted the autocompleted value
			}else{
				tgt = evt.target;
			}
			if(!evt.noHide){
				this._hideResultList();
				this._setCaretPos(this.focusNode, this.store.getValue(tgt.item, this.searchAttr).length);
			}
			this._doSelect(tgt);
		},

		_doSelect: function(tgt){
			this.item = tgt.item;
			this.attr('value', this.store.getValue(tgt.item, this.searchAttr));
		},

		_onArrowMouseDown: function(evt){
			// summary: callback when arrow is clicked
			if(this.disabled || this.readOnly){
				return;
			}
			dojo.stopEvent(evt);
			this.focus();
			if(this._isShowingNow){
				this._hideResultList();
			}else{
				// forces full population of results, if they click
				// on the arrow it means they want to see more options
				this._startSearch("");
			}
		},

		_startSearchFromInput: function(){
			this._startSearch(this.focusNode.value.replace(/([\\\*\?])/g, "\\$1"));
		},

		_getQueryString: function(/*String*/ text){
			return dojo.string.substitute(this.queryExpr, [text]);
		},

		_startSearch: function(/*String*/ key){
			if(!this._popupWidget){
				var popupId = this.id + "_popup";
				this._popupWidget = new dijit.form._ComboBoxMenu({
					onChange: dojo.hitch(this, this._selectOption),
					id:popupId
				});
				dijit.removeWaiState(this.focusNode,"activedescendant");
				dijit.setWaiState(this.textbox,"owns",popupId); // associate popup with textbox
			}
			// create a new query to prevent accidentally querying for a hidden
			// value from FilteringSelect's keyField
			this.item = null; // #4872
			var query = dojo.clone(this.query); // #5970
			this._lastInput = key; // Store exactly what was entered by the user.
			this._lastQuery = query[this.searchAttr] = this._getQueryString(key);
			// #5970: set _lastQuery, *then* start the timeout
			// otherwise, if the user types and the last query returns before the timeout,
			// _lastQuery won't be set and their input gets rewritten
			this.searchTimer=setTimeout(dojo.hitch(this, function(query, _this){
				var fetch = {
					queryOptions: {
						ignoreCase: this.ignoreCase, 
						deep: true
					},
					query: query,
					onBegin: dojo.hitch(this, "_setMaxOptions"),
					onComplete: dojo.hitch(this, "_openResultList"), 
					onError: function(errText){
						console.error('dijit.form.ComboBox: ' + errText);
						dojo.hitch(_this, "_hideResultList")();
					},
					start:0,
					count:this.pageSize
				};
				dojo.mixin(fetch, _this.fetchProperties);
				var dataObject = _this.store.fetch(fetch);

				var nextSearch = function(dataObject, direction){
					dataObject.start += dataObject.count*direction;
					// #4091:
					//		tell callback the direction of the paging so the screen
					//		reader knows which menu option to shout
					dataObject.direction = direction;
					this.store.fetch(dataObject);
				};
				this._nextSearch = this._popupWidget.onPage = dojo.hitch(this, nextSearch, dataObject);
			}, query, this), this.searchDelay);
		},

		_setMaxOptions: function(size, request){
			 this._maxOptions = size;
		},

		_getValueField:function(){
			return this.searchAttr;
		},

		/////////////// Event handlers /////////////////////

		_arrowPressed: function(){
			if(!this.disabled && !this.readOnly && this.hasDownArrow){
				dojo.addClass(this.downArrowNode, "dijitArrowButtonActive");
			}
		},

		_arrowIdle: function(){
			if(!this.disabled && !this.readOnly && this.hasDownArrow){
				dojo.removeClass(this.downArrowNode, "dojoArrowButtonPushed");
			}
		},

		// FIXME: 
		//		this is public so we can't remove until 2.0, but the name
		//		SHOULD be "compositionEnd"

		compositionend: function(/*Event*/ evt){
			//	summary:
			//		When inputting characters using an input method, such as
			//		Asian languages, it will generate this event instead of
			//		onKeyDown event Note: this event is only triggered in FF
			//		(not in IE)
			this._onKeyPress({charCode:-1});
		},

		//////////// INITIALIZATION METHODS ///////////////////////////////////////

		constructor: function(){
			this.query={};
			this.fetchProperties={};
		},

		postMixInProperties: function(){
			if(!this.hasDownArrow){
				this.baseClass = "dijitTextBox";
			}
			if(!this.store){
				var srcNodeRef = this.srcNodeRef;

				// if user didn't specify store, then assume there are option tags
				this.store = new dijit.form._ComboBoxDataStore(srcNodeRef);

				// if there is no value set and there is an option list, set
				// the value to the first value to be consistent with native
				// Select

				// Firefox and Safari set value
				// IE6 and Opera set selectedIndex, which is automatically set
				// by the selected attribute of an option tag
				// IE6 does not set value, Opera sets value = selectedIndex
				if(	!this.value || (
						(typeof srcNodeRef.selectedIndex == "number") && 
						srcNodeRef.selectedIndex.toString() === this.value)
				){
					var item = this.store.fetchSelectedItem();
					if(item){
						this.value = this.store.getValue(item, this._getValueField());
					}
				}
			}
		},
		
		_postCreate:function(){
			//find any associated label element and add to combobox node.
			var label=dojo.query('label[for="'+this.id+'"]');
			if(label.length){
				label[0].id = (this.id+"_label");
				var cn=this.comboNode;
				dijit.setWaiState(cn, "labelledby", label[0].id);
				
			}
		},

		uninitialize:function(){
			if(this._popupWidget){
				this._hideResultList();
				this._popupWidget.destroy();
			}
		},

		_getMenuLabelFromItem:function(/*Item*/ item){
			var label = this.store.getValue(item, this.labelAttr || this.searchAttr);
			var labelType = this.labelType;
			// If labelType is not "text" we don't want to screw any markup ot whatever.
			if (this.highlightMatch!="none" && this.labelType=="text" && this._lastInput){
				label = this.doHighlight(label, this._escapeHtml(this._lastInput));
				labelType = "html";
			}
			return {html: labelType=="html", label: label};
		},
		
		doHighlight:function(/*String*/label, /*String*/find){
			// summary:
			//		Highlights the string entered by the user in the menu, by default this
			//		highlights the first occurence found. Override this method
			//		to implement your custom highlighing.
			// Add greedy when this.highlightMatch=="all"
			var modifiers = "i"+(this.highlightMatch=="all"?"g":"");
			var escapedLabel = this._escapeHtml(label);
			var ret = escapedLabel.replace(new RegExp("^("+ find +")", modifiers),
					'<span class="dijitComboBoxHighlightMatch">$1</span>');
			if (escapedLabel==ret){ // Nothing replaced, try to replace at word boundaries.
				ret = escapedLabel.replace(new RegExp(" ("+ find +")", modifiers),
					' <span class="dijitComboBoxHighlightMatch">$1</span>');
			}
			return ret;// returns String, (almost) valid HTML (entities encoded)
		},
		
		_escapeHtml:function(/*string*/str){
			// TODO Should become dojo.html.entities(), when exists use instead
			// summary:
			//		Adds escape sequences for special characters in XML: &<>"'
			str = String(str).replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
				.replace(/>/gm, "&gt;").replace(/"/gm, "&quot;");
			return str; // string
		},

		open:function(){
			this._isShowingNow=true;
			return dijit.popup.open({
				popup: this._popupWidget,
				around: this.domNode,
				parent: this
			});
		},
		
		reset:function(){
			//	summary:
			//		Additionally reset the .item (to clean up).
			this.item = null;
			this.inherited(arguments);
		}
		
	}
);

dojo.declare(
	"dijit.form._ComboBoxMenu",
	[dijit._Widget, dijit._Templated],
	{
		//	summary:
		//		Focus-less div based menu for internal use in ComboBox

		templateString: "<ul class='dijitReset dijitMenu' dojoAttachEvent='onmousedown:_onMouseDown,onmouseup:_onMouseUp,onmouseover:_onMouseOver,onmouseout:_onMouseOut' tabIndex='-1' style='overflow: \"auto\"; overflow-x: \"hidden\";'>"
				+"<li class='dijitMenuItem dijitMenuPreviousButton' dojoAttachPoint='previousButton'></li>"
				+"<li class='dijitMenuItem dijitMenuNextButton' dojoAttachPoint='nextButton'></li>"
			+"</ul>",
		_messages: null,

		postMixInProperties: function(){
			this._messages = dojo.i18n.getLocalization("dijit.form", "ComboBox", this.lang);
			this.inherited("postMixInProperties", arguments);
		},

		_setValueAttr: function(/*Object*/ value){
			this.value = value;
			this.onChange(value);
		},

		// stubs
		onChange: function(/*Object*/ value){},
		onPage: function(/*Number*/ direction){},

		postCreate:function(){
			// fill in template with i18n messages
			this.previousButton.innerHTML = this._messages["previousMessage"];
			this.nextButton.innerHTML = this._messages["nextMessage"];
			this.inherited(arguments);
		},

		onClose:function(){
			this._blurOptionNode();
		},

		_createOption:function(/*Object*/ item, labelFunc){
			//	summary: 
			//		creates an option to appear on the popup menu subclassed by
			//		FilteringSelect

			var labelObject = labelFunc(item);
			var menuitem = dojo.doc.createElement("li");
			dijit.setWaiRole(menuitem, "option");
			if(labelObject.html){
				menuitem.innerHTML = labelObject.label;
			}else{
				menuitem.appendChild(
					dojo.doc.createTextNode(labelObject.label)
				);
			}
			// #3250: in blank options, assign a normal height
			if(menuitem.innerHTML == ""){
				menuitem.innerHTML = "&nbsp;";
			}
			menuitem.item=item;
			return menuitem;
		},

		createOptions: function(results, dataObject, labelFunc){
			// TODOC: needs summary. What does this do and what are the params supposed to mean? 
			//this._dataObject=dataObject;
			//this._dataObject.onComplete=dojo.hitch(comboBox, comboBox._openResultList);
			// display "Previous . . ." button
			this.previousButton.style.display = (dataObject.start == 0) ? "none" : "";
			dojo.attr(this.previousButton, "id", this.id + "_prev");
			// create options using _createOption function defined by parent
			// ComboBox (or FilteringSelect) class
			// #2309:
			//		iterate over cache nondestructively
			dojo.forEach(results, function(item, i){
				var menuitem = this._createOption(item, labelFunc);
				menuitem.className = "dijitReset dijitMenuItem";
				dojo.attr(menuitem, "id", this.id + i);
				this.domNode.insertBefore(menuitem, this.nextButton);
			}, this);
			// display "Next . . ." button
			var displayMore = false;
			//Try to determine if we should show 'more'...
			if(dataObject._maxOptions && dataObject._maxOptions != -1){
				if((dataObject.start + dataObject.count) < dataObject._maxOptions){
					displayMore = true;
				}else if((dataObject.start + dataObject.count) > (dataObject._maxOptions - 1)){
					//Weird return from a datastore, where a start + count > maxOptions
					//implies maxOptions isn't really valid and we have to go into faking it.
					//And more or less assume more if count == results.length
					if(dataObject.count == results.length){
						displayMore = true;
					}
				}
			}else if(dataObject.count == results.length){
				//Don't know the size, so we do the best we can based off count alone.
				//So, if we have an exact match to count, assume more.
				displayMore = true;
			}

			this.nextButton.style.display = displayMore ? "" : "none";
			dojo.attr(this.nextButton,"id", this.id + "_next");
		},

		clearResultList: function(){
			// keep the previous and next buttons of course
			while(this.domNode.childNodes.length>2){
				this.domNode.removeChild(this.domNode.childNodes[this.domNode.childNodes.length-2]);
			}
		},

		// these functions are called in showResultList
		getItems: function(){
			return this.domNode.childNodes;
		},

		getListLength: function(){
			return this.domNode.childNodes.length-2;
		},

		_onMouseDown: function(/*Event*/ evt){
			dojo.stopEvent(evt);
		},

		_onMouseUp: function(/*Event*/ evt){
			if(evt.target === this.domNode){
				return;
			}else if(evt.target==this.previousButton){
				this.onPage(-1);
			}else if(evt.target==this.nextButton){
				this.onPage(1);
			}else{
				var tgt = evt.target;
				// while the clicked node is inside the div
				while(!tgt.item){
					// recurse to the top
					tgt = tgt.parentNode;
				}
				this._setValueAttr({ target: tgt }, true);
			}
		},

		_onMouseOver: function(/*Event*/ evt){
			if(evt.target === this.domNode){ return; }
			var tgt = evt.target;
			if(!(tgt == this.previousButton || tgt == this.nextButton)){
				// while the clicked node is inside the div
				while(!tgt.item){
					// recurse to the top
					tgt = tgt.parentNode;
				}
			}
			this._focusOptionNode(tgt);
		},

		_onMouseOut:function(/*Event*/ evt){
			if(evt.target === this.domNode){ return; }
			this._blurOptionNode();
		},

		_focusOptionNode:function(/*DomNode*/ node){
			// summary:
			//	does the actual highlight
			if(this._highlighted_option != node){
				this._blurOptionNode();
				this._highlighted_option = node;
				dojo.addClass(this._highlighted_option, "dijitMenuItemHover");
			}
		},

		_blurOptionNode:function(){
			// summary:
			//	removes highlight on highlighted option
			if(this._highlighted_option){
				dojo.removeClass(this._highlighted_option, "dijitMenuItemHover");
				this._highlighted_option = null;
			}
		},

		_highlightNextOption:function(){
			//	summary:
			// 		Highlight the item just below the current selection.
			// 		If nothing selected, highlight first option

			// because each press of a button clears the menu,
			// the highlighted option sometimes becomes detached from the menu!
			// test to see if the option has a parent to see if this is the case.
			var fc = this.domNode.firstChild;
			if(!this.getHighlightedOption()){
				this._focusOptionNode(fc.style.display=="none" ? fc.nextSibling : fc);
			}else{
				var ns = this._highlighted_option.nextSibling;
				if(ns && ns.style.display!="none"){
					this._focusOptionNode(ns);
				}
			}
			// scrollIntoView is called outside of _focusOptionNode because in IE putting it inside causes the menu to scroll up on mouseover
			dijit.scrollIntoView(this._highlighted_option);
		},

		highlightFirstOption:function(){
			//	summary:
			// 		Highlight the first real item in the list (not Previous Choices).
			this._focusOptionNode(this.domNode.firstChild.nextSibling);
			dijit.scrollIntoView(this._highlighted_option);
		},

		highlightLastOption:function(){
			//	summary:
			// 		Highlight the last real item in the list (not More Choices).
			this._focusOptionNode(this.domNode.lastChild.previousSibling);
			dijit.scrollIntoView(this._highlighted_option);
		},

		_highlightPrevOption:function(){
			//	summary:
			// 		Highlight the item just above the current selection.
			// 		If nothing selected, highlight last option (if
			// 		you select Previous and try to keep scrolling up the list)
			var lc = this.domNode.lastChild;
			if(!this.getHighlightedOption()){
				this._focusOptionNode(lc.style.display == "none" ? lc.previousSibling : lc);
			}else{
				var ps = this._highlighted_option.previousSibling;
				if(ps && ps.style.display != "none"){
					this._focusOptionNode(ps);
				}
			}
			dijit.scrollIntoView(this._highlighted_option);
		},

		_page:function(/*Boolean*/ up){
			var scrollamount = 0;
			var oldscroll = this.domNode.scrollTop;
			var height = dojo.style(this.domNode, "height");
			// if no item is highlighted, highlight the first option
			if(!this.getHighlightedOption()){
				this._highlightNextOption();
			}
			while(scrollamount<height){
				if(up){
					// stop at option 1
					if(!this.getHighlightedOption().previousSibling ||
						this._highlighted_option.previousSibling.style.display == "none"){
						break;
					}
					this._highlightPrevOption();
				}else{
					// stop at last option
					if(!this.getHighlightedOption().nextSibling ||
						this._highlighted_option.nextSibling.style.display == "none"){
						break;
					}
					this._highlightNextOption();
				}
				// going backwards
				var newscroll=this.domNode.scrollTop;
				scrollamount+=(newscroll-oldscroll)*(up ? -1:1);
				oldscroll=newscroll;
			}
		},

		pageUp: function(){ this._page(true); },

		pageDown: function(){ this._page(false); },

		getHighlightedOption: function(){
			//	summary:
			//		Returns the highlighted option.
			var ho = this._highlighted_option;
			return (ho && ho.parentNode) ? ho : null;
		},

		handleKey: function(key){
			switch(key){
				case dojo.keys.DOWN_ARROW:
					this._highlightNextOption();
					break;
				case dojo.keys.PAGE_DOWN:
					this.pageDown();
					break;	
				case dojo.keys.UP_ARROW:
					this._highlightPrevOption();
					break;
				case dojo.keys.PAGE_UP:
					this.pageUp();
					break;	
			}
		}
	}
);

dojo.declare(
	"dijit.form.ComboBox",
	[dijit.form.ValidationTextBox, dijit.form.ComboBoxMixin],
	{
		//	summary:
		//		Auto-completing text box, and base class for dijit.form.FilteringSelect.
		// 
		//	description:
		//		The drop down box's values are populated from an class called
		//		a data provider, which returns a list of values based on the characters
		//		that the user has typed into the input box.
		// 
		//		Some of the options to the ComboBox are actually arguments to the data
		//		provider.

		postMixInProperties: function(){
			// this.inherited(arguments); // ??
			dijit.form.ComboBoxMixin.prototype.postMixInProperties.apply(this, arguments);
			dijit.form.ValidationTextBox.prototype.postMixInProperties.apply(this, arguments);
		},

		postCreate: function(){
			dijit.form.ComboBoxMixin.prototype._postCreate.apply(this, arguments);
			dijit.form.ValidationTextBox.prototype.postCreate.apply(this, arguments);
		},

		_setDisabledAttr: function(/*Boolean*/ value){
			dijit.form.ValidationTextBox.prototype._setDisabledAttr.apply(this, arguments);
			dijit.form.ComboBoxMixin.prototype._setDisabledAttr.apply(this, arguments);
		},

		_setValueAttr: function(/*String*/ value, /*Boolean?*/ priorityChange){
			// summary:
			//              Hook so attr('value', value) works.
			// description:
			//              Sets the value of the select.
			if(!value){ value = ''; } // null translates to blank
			dijit.form.ValidationTextBox.prototype._setValueAttr.call(this, value, priorityChange);
		}
	}
);

dojo.declare("dijit.form._ComboBoxDataStore", null, {
	//	summary:
	//		Inefficient but small data store specialized for inlined ComboBox data
	//
	//	description:
	//		Provides a store for inlined data like:
	//
	//	|	<select>
	//	|		<option value="AL">Alabama</option>
	//	|		...
	//
	//		Actually. just implements the subset of dojo.data.Read/Notification
	//		needed for ComboBox and FilteringSelect to work.
	//
	//		Note that an item is just a pointer to the <option> DomNode.

	constructor: function( /*DomNode*/ root){
		this.root = root;

		dojo.query("> option", root).forEach(function(node){
			//	TODO: this was added in #3858 but unclear why/if it's needed;  doesn't seem to be.
			//	If it is needed then can we just hide the select itself instead?
			//node.style.display="none";
			node.innerHTML = dojo.trim(node.innerHTML);
		});

	},

	getValue: function(	/* item */ item, 
						/* attribute-name-string */ attribute, 
						/* value? */ defaultValue){
		return (attribute == "value") ? item.value : (item.innerText || item.textContent || '');
	},

	isItemLoaded: function(/* anything */ something) {
		return true;
	},

	getFeatures: function(){
		return {"dojo.data.api.Read": true, "dojo.data.api.Identity": true};
	},
	
	_fetchItems: function(	/* Object */ args,
							/* Function */ findCallback, 
							/* Function */ errorCallback){
		//	summary: 
		//		See dojo.data.util.simpleFetch.fetch()
		if(!args.query){ args.query = {}; }
		if(!args.query.name){ args.query.name = ""; }
		if(!args.queryOptions){ args.queryOptions = {}; }
		var matcher = dojo.data.util.filter.patternToRegExp(args.query.name, args.queryOptions.ignoreCase),
			items = dojo.query("> option", this.root).filter(function(option){
				return (option.innerText || option.textContent || '').match(matcher);
			} );
		if(args.sort){
			items.sort(dojo.data.util.sorter.createSortFunction(args.sort, this));
		}
		findCallback(items, args);
	},

	close: function(/*dojo.data.api.Request || args || null */ request){
		return;
	},

	getLabel: function(/* item */ item){
		return item.innerHTML;
	},

	getIdentity: function(/* item */ item){
		return dojo.attr(item, "value");
	},

	fetchItemByIdentity: function(/* Object */ args){
		//	summary:
		//		Given the identity of an item, this method returns the item that has
		//		that identity through the onItem callback.
		//		Refer to dojo.data.api.Identity.fetchItemByIdentity() for more details.
		//
		//	description:
		//		Given arguments like:
		//
		//	|		{identity: "CA", onItem: function(item){...}
		//
		//		Call `onItem()` with the DOM node `<option value="CA">California</option>`
		var item = dojo.query("option[value='" + args.identity + "']", this.root)[0];
		args.onItem(item);
	},
	
	fetchSelectedItem: function(){
		//	summary:
		//		Get the option marked as selected, like `<option selected>`.
		//		Not part of dojo.data API.
		var root = this.root,
			si = root.selectedIndex;
		return dojo.query("> option:nth-child(" +
			(si != -1 ? si+1 : 1) + ")",
			root)[0];	// dojo.data.Item
	}
});
//Mix in the simple fetch implementation to this class. 
dojo.extend(dijit.form._ComboBoxDataStore,dojo.data.util.simpleFetch);

}

if(!dojo._hasResource["dijit.form.FilteringSelect"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.FilteringSelect"] = true;
dojo.provide("dijit.form.FilteringSelect");



dojo.declare(
	"dijit.form.FilteringSelect",
	[dijit.form.MappedTextBox, dijit.form.ComboBoxMixin],
	{
		// summary
		// An enhanced version of the HTML SELECT tag, populated dynamically
		//
		// description
		// An enhanced version of the HTML SELECT tag, populated dynamically. It works
		// very nicely with very large data sets because it can load and page data as needed.
		// It also resembles ComboBox, but does not allow values outside of the provided ones.
		//  
		// Similar features:
		//  - There is a drop down list of possible values.
		//	- You can only enter a value from the drop down list.  (You can't
		//	  enter an arbitrary value.)
		//	- The value submitted with the form is the hidden value (ex: CA),
		//	  not the displayed value a.k.a. label (ex: California)
		// 
		//	Enhancements over plain HTML version:
		//	- If you type in some text then it will filter down the list of
		//	  possible values in the drop down list.
		//	- List can be specified either as a static list or via a javascript
		//	  function (that can get the list from a server)
		//
		_isvalid:true,

		required:true,

		_lastDisplayedValue: "",

		isValid:function(){
			return this._isvalid || (!this.required && this.attr('displayedValue') == ""); // #5974
		},

		_callbackSetLabel: function(	/*Array*/ result, 
						/*Object*/ dataObject, 
						/*Boolean?*/ priorityChange){
			// summary:
			//		Callback function that dynamically sets the label of the
			//		ComboBox

			// setValue does a synchronous lookup,
			// so it calls _callbackSetLabel directly,
			// and so does not pass dataObject
			// still need to test against _lastQuery in case it came too late
			if((dataObject && dataObject.query[this.searchAttr] != this._lastQuery)||(!dataObject && result.length && this.store.getIdentity(result[0])!= this._lastQuery)){
				return;
			}
			if(!result.length){
				//#3268: do nothing on bad input
				//this._setValue("", "");
				//#3285: change CSS to indicate error
				if(priorityChange || !this._focused){ this.valueNode.value=""; }
				dijit.form.TextBox.superclass._setValueAttr.call(this, "", priorityChange || !this._focused);
				this._isvalid=false;
				this.validate(this._focused);
				this.item=null;
			}else{
				this._setValueFromItem(result[0], priorityChange);
			}
		},

		_openResultList: function(/*Object*/ results, /*Object*/ dataObject){
			// #3285: tap into search callback to see if user's query resembles a match
			if(dataObject.query[this.searchAttr] != this._lastQuery){
				return;
			}
			this._isvalid = results.length != 0; // FIXME: should this be greater-than?
			this.validate(true);
			dijit.form.ComboBoxMixin.prototype._openResultList.apply(this, arguments);
		},

		_getValueAttr: function(){
			// summary:
			//		Hook for attr('value') to work.

			// don't get the textbox value but rather the previously set hidden value
			// TODO: seems suspicious that we need this; how is FilteringSelect different
			// than another MappedTextBox widget?
			return this.valueNode.value;
		},

		_getValueField:function(){
			// used for option tag selects
			return "value";
		},

		_setValue: function(	/*String*/ value, 
					/*String*/ displayedValue,
					/*Boolean?*/ priorityChange){
			this.valueNode.value = value;
			dijit.form.FilteringSelect.superclass._setValueAttr.call(this, value, priorityChange, displayedValue);
			this._lastDisplayedValue = displayedValue;
		},

		_setValueAttr: function(/*String*/ value, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so attr('value', value) works.
			// description:
			//		Sets the value of the select.
			//		Also sets the label to the corresponding value by reverse lookup.
			if(!this._onChangeActive){ priorityChange = null; }
			this._lastQuery=value;

			if(value === null){
				this._setDisplayedValueAttr('', priorityChange);
				return;
			}

			//#3347: fetchItemByIdentity if no keyAttr specified
			var self=this;
			var handleFetchByIdentity = function(item, priorityChange){
				if(item){
					if(self.store.isItemLoaded(item)){
						self._callbackSetLabel([item], undefined, priorityChange);
					}else{
						self.store.loadItem({
							item: item, 
							onItem: function(result, dataObject){
								self._callbackSetLabel(result, dataObject, priorityChange);
							}
						});
					}
				}else{
					self._isvalid=false;
					// prevent errors from Tooltip not being created yet
					self.validate(false);
				}
			}
			this.store.fetchItemByIdentity({
				identity: value, 
				onItem: function(item){
					handleFetchByIdentity(item, priorityChange);
				}
			});
		},

		_setValueFromItem: function(/*item*/ item, /*Boolean?*/ priorityChange){
			//	summary:
			//		Set the displayed valued in the input box, based on a
			//		selected item.
			//	description:
			//		Users shouldn't call this function; they should be calling
			//		attr('displayedValue', value) instead
			this._isvalid=true;
			this.item = item; // Fix #6381
			this._setValue(	this.store.getIdentity(item), 
							this.labelFunc(item, this.store), 
							priorityChange);
		},

		labelFunc: function(/*item*/ item, /*dojo.data.store*/ store){
			// summary: Event handler called when the label changes
			// return: the label that the ComboBox should display
			return store.getValue(item, this.searchAttr);
		},

		_doSelect: function(/*Event*/ tgt){
			// summary:
			//		ComboBox's menu callback function
			//	description:
			//		FilteringSelect overrides this to set both the visible and
			//		hidden value from the information stored in the menu
			this._setValueFromItem(tgt.item, true);
		},

		_setDisplayedValueAttr: function(/*String*/ label, /*Boolean?*/ priorityChange){
			// summary:
			//		Hook so attr('displayedValue', label) works.
			// description:
			//		Set textbox to display label. Also performs reverse lookup
			//		to set the hidden value.

			// When this is called during initialization it'll ping the datastore
			// for reverse lookup, and when that completes (after an XHR request)
			// will call setValueAttr()... but that shouldn't trigger an onChange()
			//  event, even when it happens after creation has finished
			if(!this._created){
				priorityChange = false;
			}

			if(this.store){
				var query = dojo.clone(this.query); // #6196: populate query with user-specifics
				// escape meta characters of dojo.data.util.filter.patternToRegExp().
				this._lastQuery = query[this.searchAttr] = label.replace(/([\\\*\?])/g, "\\$1");
				// if the label is not valid, the callback will never set it,
				// so the last valid value will get the warning textbox set the
				// textbox value now so that the impending warning will make
				// sense to the user
				this.textbox.value = label;
				this._lastDisplayedValue = label;
				var _this = this;
				var fetch = {
					query: query, 
					queryOptions: {
						ignoreCase: this.ignoreCase, 
						deep: true
					}, 
					onComplete: function(result, dataObject){
						        dojo.hitch(_this, "_callbackSetLabel")(result, dataObject, priorityChange);
					},
					onError: function(errText){
						console.error('dijit.form.FilteringSelect: ' + errText);
						dojo.hitch(_this, "_setValue")("", label, false);
					}
				};
				dojo.mixin(fetch, this.fetchProperties);
				this.store.fetch(fetch);
			}
		},

		postMixInProperties: function(){
			// FIXME: shouldn't this just be a call to inherited?
			dijit.form.ComboBoxMixin.prototype.postMixInProperties.apply(this, arguments);
			dijit.form.MappedTextBox.prototype.postMixInProperties.apply(this, arguments);
		},

		postCreate: function(){
			dijit.form.ComboBoxMixin.prototype._postCreate.apply(this, arguments);
			dijit.form.MappedTextBox.prototype.postCreate.apply(this, arguments);
		},
		
		_setDisabledAttr: function(/*String*/ attr, /*anything*/ value){
			dijit.form.MappedTextBox.prototype._setDisabledAttr.apply(this, arguments);
			dijit.form.ComboBoxMixin.prototype._setDisabledAttr.apply(this, arguments);
		},

		undo: function(){
			this.attr('displayedValue', this._lastDisplayedValue);
		},

		_valueChanged: function(){
			return this.attr('displayedValue')!=this._lastDisplayedValue;
		}
	}
);

}

if(!dojo._hasResource["dijit.form.SimpleTextarea"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.SimpleTextarea"] = true;
dojo.provide("dijit.form.SimpleTextarea");



dojo.declare("dijit.form.SimpleTextarea",
	dijit.form.TextBox,
{
	// summary:
	//		A simple textarea that degrades, and responds to
	// 		minimal LayoutContainer usage, and works with dijit.form.Form.
	//		Doesn't automatically size according to input, like Textarea.
	//
	// example:
	//	|	<textarea dojoType="dijit.form.SimpleTextarea" name="foo" value="bar" rows=30 cols=40/>
	//

	baseClass: "dijitTextArea",

	attributeMap: dojo.mixin(dojo.clone(dijit.form._FormValueWidget.prototype.attributeMap),
		{rows:"textbox", cols: "textbox"}),

	// rows: Number
	//		The number of rows of text.
	rows: "",

	// rows: Number
	//		The number of characters per line.
	cols: "",

	templatePath: null,
	templateString: "<textarea name='${name}' dojoAttachPoint='focusNode,containerNode,textbox' autocomplete='off'></textarea>",

	postMixInProperties: function(){
		if(this.srcNodeRef){
			this.value = this.srcNodeRef.value;
		}
	},

	filter: function(/*String*/ value){
		if(value){
			value = value.replace(/\r/g,"");
		}
		return this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dijit.form.CheckBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.CheckBox"] = true;
dojo.provide("dijit.form.CheckBox");



dojo.declare(
	"dijit.form.CheckBox",
	dijit.form.ToggleButton,
	{
		// summary:
		// 		Same as an HTML checkbox, but with fancy styling.
		//
		// description:
		// User interacts with real html inputs.
		// On onclick (which occurs by mouse click, space-bar, or
		// using the arrow keys to switch the selected radio button),
		// we update the state of the checkbox/radio.
		//
		// There are two modes:
		//   1. High contrast mode
		//   2. Normal mode
		// In case 1, the regular html inputs are shown and used by the user.
		// In case 2, the regular html inputs are invisible but still used by
		// the user. They are turned quasi-invisible and overlay the background-image.

		templateString:"<div class=\"dijitReset dijitInline\" waiRole=\"presentation\"\n\t><input\n\t \ttype=\"${type}\" name=\"${name}\"\n\t\tclass=\"dijitReset dijitCheckBoxInput\"\n\t\tdojoAttachPoint=\"focusNode\"\n\t \tdojoAttachEvent=\"onmouseover:_onMouse,onmouseout:_onMouse,onclick:_onClick\"\n/></div>\n",

		baseClass: "dijitCheckBox",

		//	Value of "type" attribute for <input>
		type: "checkbox",

		// value: String
		//		As an initialization parameter, equivalent to value field on normal checkbox
		//		(if checked, the value is passed as the value when form is submitted).
		//
		//		However, attr('value') will return either the string or false depending on
		//		whether or not the checkbox is checked.
		//
		//		attr('value', string) will check the checkbox and change the value to the
		//		specified string
		//
		//		attr('value', boolean) will change the checked state.
		value: "on",

		_setValueAttr: function(/*String or Boolean*/ newValue){
			// summary:
			//		Handler for value= attribute to constructor, and also calls to
			//		attr('value', val).
			// description:
			//		During initialization, just saves as attribute to the <input type=checkbox>.
			//		
			//		After initialization,
			//		when passed a boolean, controls whether or not the CheckBox is checked.
			//		If passed a string, changes the value attribute of the CheckBox (the one
			//		specified as "value" when the CheckBox was constructed (ex: <input
			//		dojoType="dijit.CheckBox" value="chicken">)
			if(typeof newValue == "string"){
				this.value = newValue;
				dojo.attr(this.focusNode, 'value', newValue);
				newValue = true;
			}
			if(this._created){
				this.attr('checked', newValue);
			}
		},

		_getValueAttr: function(){
			// summary:
			//		Hook so attr('value') works.
			// description:
			//		If the CheckBox is checked, returns the value attribute.
			//		Otherwise returns false.
			return (this.checked ? this.value : false);
		},

		postMixInProperties: function(){
			if(this.value == ""){
				this.value = "on";
			}
			this.inherited(arguments);
		},
		
		 _fillContent: function(/*DomNode*/ source){
			// Override Button::_fillContent() since it doesn't make sense for CheckBox,
			// since CheckBox doesn't even have a container
		},

		reset: function(){
			this._hasBeenBlurred = false;

			this.attr('checked', this.params.checked || false);

			// Handle unlikely event that the <input type=checkbox> value attribute has changed
			this.value = this.params.value || "on";
			dojo.attr(this.focusNode, 'value', this.value);
		},
		
		_onFocus: function(){
			if(this.id){
				dojo.query("label[for='"+this.id+"']").addClass("dijitFocusedLabel");
			}
		},

		_onBlur: function(){
			if(this.id){
				dojo.query("label[for='"+this.id+"']").removeClass("dijitFocusedLabel");
			}
		}
	}
);

dojo.declare(
	"dijit.form.RadioButton",
	dijit.form.CheckBox,
	{
		// summary:
		// 		Same as an HTML radio, but with fancy styling.

		type: "radio",
		baseClass: "dijitRadio",

		_setCheckedAttr: function(/*Boolean*/ value){
			// If I am being checked then have to deselect currently checked radio button
			this.inherited(arguments);
			if(!this._created){ return; }
			if(value){
				var _this = this;
				// search for radio buttons with the same name that need to be unchecked
				dojo.query('INPUT[type=radio][name='+this.name+']', this.focusNode.form||dojo.doc).forEach(
					function(inputNode){
						if(inputNode != _this.focusNode && inputNode.form == _this.focusNode.form){
							var widget = dijit.getEnclosingWidget(inputNode);
							if(widget && widget.checked){
								widget.attr('checked', false);
							}
						}
					}
				);
			}
		},

		_clicked: function(/*Event*/ e){
			if(!this.checked){
				this.attr('checked', true);
			}
		}
	}
);

}

if(!dojo._hasResource["dijit.form._Spinner"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._Spinner"] = true;
dojo.provide("dijit.form._Spinner");



dojo.declare(
	"dijit.form._Spinner",
	dijit.form.RangeBoundTextBox,
	{

		// summary: Mixin for validation widgets with a spinner
		// description: This class basically (conceptually) extends dijit.form.ValidationTextBox.
		//	It modifies the template to have up/down arrows, and provides related handling code.

		// defaultTimeout: Number
		//	  number of milliseconds before a held key or button becomes typematic
		defaultTimeout: 500,

		// timeoutChangeRate: Number
		//	  fraction of time used to change the typematic timer between events
		//	  1.0 means that each typematic event fires at defaultTimeout intervals
		//	  < 1.0 means that each typematic event fires at an increasing faster rate
		timeoutChangeRate: 0.90,

		// smallDelta: Number
		//	  adjust the value by this much when spinning using the arrow keys/buttons
		smallDelta: 1,
		// largeDelta: Number
		//	  adjust the value by this much when spinning using the PgUp/Dn keys
		largeDelta: 10,

		templateString:"<div class=\"dijit dijitReset dijitInlineTable dijitLeft\"\n\tid=\"widget_${id}\"\n\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\" waiRole=\"presentation\"\n\t><div class=\"dijitInputLayoutContainer\"\n\t\t><div class=\"dijitReset dijitSpinnerButtonContainer\"\n\t\t\t>&nbsp;<div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitUpArrowButton\"\n\t\t\t\tdojoAttachPoint=\"upArrowNode\"\n\t\t\t\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse\"\n\t\t\t\tstateModifier=\"UpArrow\"\n\t\t\t\t><div class=\"dijitArrowButtonInner\">&thinsp;</div\n\t\t\t\t><div class=\"dijitArrowButtonChar\">&#9650;</div\n\t\t\t></div\n\t\t\t><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitDownArrowButton\"\n\t\t\t\tdojoAttachPoint=\"downArrowNode\"\n\t\t\t\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse\"\n\t\t\t\tstateModifier=\"DownArrow\"\n\t\t\t\t><div class=\"dijitArrowButtonInner\">&thinsp;</div\n\t\t\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div\n\t\t\t></div\n\t\t></div\n\t\t><div class=\"dijitReset dijitValidationIcon\"><br></div\n\t\t><div class=\"dijitReset dijitValidationIconText\">&Chi;</div\n\t\t><div class=\"dijitReset dijitInputField\"\n\t\t\t><input class='dijitReset' dojoAttachPoint=\"textbox,focusNode\" type=\"${type}\" dojoAttachEvent=\"onfocus:_update,onkeyup:_update,onkeypress:_onKeyPress\"\n\t\t\t\twaiRole=\"spinbutton\" autocomplete=\"off\" name=\"${name}\"\n\t\t/></div\n\t></div\n></div>\n",
		baseClass: "dijitSpinner",

		adjust: function(/* Object */ val, /*Number*/ delta){
			// summary: user replaceable function used to adjust a primitive value(Number/Date/...) by the delta amount specified
			// the val is adjusted in a way that makes sense to the object type
			return val;
		},

		_arrowState: function(/*Node*/ node, /*Boolean*/ pressed){
			this._active = pressed;
			this.stateModifier = node.getAttribute("stateModifier") || "";
			this._setStateClass();
		},

		_arrowPressed: function(/*Node*/ nodePressed, /*Number*/ direction, /*Number*/ increment){
			if(this.disabled || this.readOnly){ return; }
			this._arrowState(nodePressed, true);
			this._setValueAttr(this.adjust(this.attr('value'), direction*increment), false);
			dijit.selectInputText(this.textbox, this.textbox.value.length);
		},

		_arrowReleased: function(/*Node*/ node){
			this._wheelTimer = null;
			if(this.disabled || this.readOnly){ return; }
			this._arrowState(node, false);
		},

		_typematicCallback: function(/*Number*/ count, /*DOMNode*/ node, /*Event*/ evt){
			var inc=this.smallDelta;
			if(node == this.textbox){
				k=dojo.keys;
				var key = evt.charOrCode; 
				inc = (key == k.PAGE_UP || key == k.PAGE_DOWN) ? this.largeDelta : this.smallDelta;
				node = (key == k.UP_ARROW ||key == k.PAGE_UP) ? this.upArrowNode : this.downArrowNode;
			}
			if(count == -1){ this._arrowReleased(node); }
			else{ this._arrowPressed(node, (node == this.upArrowNode) ? 1 : -1, inc); }
		},

		_wheelTimer: null,
		_mouseWheeled: function(/*Event*/ evt){
			// summary: Mouse wheel listener where supported
			dojo.stopEvent(evt);	
			// FIXME: Safari bubbles

			// be nice to DOH and scroll as much as the event says to
			var scrollAmount = evt.detail ? (evt.detail * -1) : (evt.wheelDelta / 120);
			if(scrollAmount !== 0){
				var node = this[(scrollAmount > 0 ? "upArrowNode" : "downArrowNode" )];
				
				this._arrowPressed(node, scrollAmount, this.smallDelta);

				if(!this._wheelTimer){
					clearTimeout(this._wheelTimer);
				}
				this._wheelTimer = setTimeout(dojo.hitch(this,"_arrowReleased",node), 50);
			}
			
		},

		postCreate: function(){
			this.inherited('postCreate', arguments);

			// extra listeners
			this.connect(this.domNode, !dojo.isMozilla ? "onmousewheel" : 'DOMMouseScroll', "_mouseWheeled");
			this._connects.push(dijit.typematic.addListener(this.upArrowNode, this.textbox, {charOrCode:dojo.keys.UP_ARROW,ctrlKey:false,altKey:false,shiftKey:false}, this, "_typematicCallback", this.timeoutChangeRate, this.defaultTimeout));
			this._connects.push(dijit.typematic.addListener(this.downArrowNode, this.textbox, {charOrCode:dojo.keys.DOWN_ARROW,ctrlKey:false,altKey:false,shiftKey:false}, this, "_typematicCallback", this.timeoutChangeRate, this.defaultTimeout));
			this._connects.push(dijit.typematic.addListener(this.upArrowNode, this.textbox, {charOrCode:dojo.keys.PAGE_UP,ctrlKey:false,altKey:false,shiftKey:false}, this, "_typematicCallback", this.timeoutChangeRate, this.defaultTimeout));
			this._connects.push(dijit.typematic.addListener(this.downArrowNode, this.textbox, {charOrCode:dojo.keys.PAGE_DOWN,ctrlKey:false,altKey:false,shiftKey:false}, this, "_typematicCallback", this.timeoutChangeRate, this.defaultTimeout));
			if(dojo.isIE){
				var _this = this;
				this.connect(this.domNode, "onresize",
					function(){ setTimeout(dojo.hitch(_this,
						function(){
				        		var sz = this.upArrowNode.parentNode.offsetHeight;
							if(sz){
								this.upArrowNode.style.height = sz >> 1;
								this.downArrowNode.style.height = sz - (sz >> 1);
								this.focusNode.parentNode.style.height = sz;
							}
							// cause IE to rerender when spinner is moved from hidden to visible
							this._setStateClass();
						}), 0);
					}
				);
			}
		}
});

}

if(!dojo._hasResource["dojo.number"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.number"] = true;
dojo.provide("dojo.number");







/*=====
dojo.number = {
	// summary: localized formatting and parsing routines for Number
}

dojo.number.__FormatOptions = function(){
	//	pattern: String?
	//		override [formatting pattern](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	//		with this string
	//	type: String?
	//		choose a format type based on the locale from the following:
	//		decimal, scientific, percent, currency. decimal by default.
	//	places: Number?
	//		fixed number of decimal places to show.  This overrides any
	//		information in the provided pattern.
	//	round: Number?
	//		5 rounds to nearest .5; 0 rounds to nearest whole (default). -1
	//		means don't round.
	//	currency: String?
	//		an [ISO4217](http://en.wikipedia.org/wiki/ISO_4217) currency code, a three letter sequence like "USD"
	//	symbol: String?
	//		localized currency symbol
	//	locale: String?
	//		override the locale used to determine formatting rules
	this.pattern = pattern;
	this.type = type;
	this.places = places;
	this.round = round;
	this.currency = currency;
	this.symbol = symbol;
	this.locale = locale;
}
=====*/

dojo.number.format = function(/*Number*/value, /*dojo.number.__FormatOptions?*/options){
	// summary:
	//		Format a Number as a String, using locale-specific settings
	// description:
	//		Create a string from a Number using a known localized pattern.
	//		Formatting patterns appropriate to the locale are chosen from the
	//		[CLDR](http://unicode.org/cldr) as well as the appropriate symbols and
	//		delimiters.  See <http://www.unicode.org/reports/tr35/#Number_Elements>
	// value:
	//		the number to be formatted.  If not a valid JavaScript number,
	//		return null.

	options = dojo.mixin({}, options || {});
	var locale = dojo.i18n.normalizeLocale(options.locale);
	var bundle = dojo.i18n.getLocalization("dojo.cldr", "number", locale);
	options.customs = bundle;
	var pattern = options.pattern || bundle[(options.type || "decimal") + "Format"];
	if(isNaN(value)){ return null; } // null
	return dojo.number._applyPattern(value, pattern, options); // String
};

//dojo.number._numberPatternRE = /(?:[#0]*,?)*[#0](?:\.0*#*)?/; // not precise, but good enough
dojo.number._numberPatternRE = /[#0,]*[#0](?:\.0*#*)?/; // not precise, but good enough

dojo.number._applyPattern = function(/*Number*/value, /*String*/pattern, /*dojo.number.__FormatOptions?*/options){
	// summary:
	//		Apply pattern to format value as a string using options. Gives no
	//		consideration to local customs.
	// value:
	//		the number to be formatted.
	// pattern:
	//		a pattern string as described by
	//		[unicode.org TR35](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	// options: dojo.number.__FormatOptions?
	//		_applyPattern is usually called via `dojo.number.format()` which
	//		populates an extra property in the options parameter, "customs".
	//		The customs object specifies group and decimal parameters if set.

	//TODO: support escapes
	options = options || {};
	var group = options.customs.group;
	var decimal = options.customs.decimal;

	var patternList = pattern.split(';');
	var positivePattern = patternList[0];
	pattern = patternList[(value < 0) ? 1 : 0] || ("-" + positivePattern);

	//TODO: only test against unescaped
	if(pattern.indexOf('%') != -1){
		value *= 100;
	}else if(pattern.indexOf('\u2030') != -1){
		value *= 1000; // per mille
	}else if(pattern.indexOf('\u00a4') != -1){
		group = options.customs.currencyGroup || group;//mixins instead?
		decimal = options.customs.currencyDecimal || decimal;// Should these be mixins instead?
		pattern = pattern.replace(/\u00a4{1,3}/, function(match){
			var prop = ["symbol", "currency", "displayName"][match.length-1];
			return options[prop] || options.currency || "";
		});
	}else if(pattern.indexOf('E') != -1){
		throw new Error("exponential notation not supported");
	}
	
	//TODO: support @ sig figs?
	var numberPatternRE = dojo.number._numberPatternRE;
	var numberPattern = positivePattern.match(numberPatternRE);
	if(!numberPattern){
		throw new Error("unable to find a number expression in pattern: "+pattern);
	}
	if(options.fractional === false){ options.places = 0; }
	return pattern.replace(numberPatternRE,
		dojo.number._formatAbsolute(value, numberPattern[0], {decimal: decimal, group: group, places: options.places, round: options.round}));
}

dojo.number.round = function(/*Number*/value, /*Number*/places, /*Number?*/multiple){
	//	summary:
	//		Rounds the number at the given number of places
	//	value:
	//		the number to round
	//	places:
	//		the number of decimal places where rounding takes place
	//	multiple:
	//		rounds next place to nearest multiple

	var pieces = String(value).split(".");
	var length = (pieces[1] && pieces[1].length) || 0;
	if(length > places){
		var factor = Math.pow(10, places);
		if(multiple > 0){factor *= 10/multiple;places++;} //FIXME
		value = Math.round(value * factor)/factor;

		// truncate to remove any residual floating point values
		pieces = String(value).split(".");
		length = (pieces[1] && pieces[1].length) || 0;
		if(length > places){
			pieces[1] = pieces[1].substr(0, places);
			value = Number(pieces.join("."));
		}
	}
	return value; //Number
}

/*=====
dojo.number.__FormatAbsoluteOptions = function(){
	//	decimal: String?
	//		the decimal separator
	//	group: String?
	//		the group separator
	//	places: Integer?|String?
	//		number of decimal places.  the range "n,m" will format to m places.
	//	round: Number?
	//		5 rounds to nearest .5; 0 rounds to nearest whole (default). -1
	//		means don't round.
	this.decimal = decimal;
	this.group = group;
	this.places = places;
	this.round = round;
}
=====*/

dojo.number._formatAbsolute = function(/*Number*/value, /*String*/pattern, /*dojo.number.__FormatAbsoluteOptions?*/options){
	// summary: 
	//		Apply numeric pattern to absolute value using options. Gives no
	//		consideration to local customs.
	// value:
	//		the number to be formatted, ignores sign
	// pattern:
	//		the number portion of a pattern (e.g. `#,##0.00`)
	options = options || {};
	if(options.places === true){options.places=0;}
	if(options.places === Infinity){options.places=6;} // avoid a loop; pick a limit

	var patternParts = pattern.split(".");
	var maxPlaces = (options.places >= 0) ? options.places : (patternParts[1] && patternParts[1].length) || 0;
	if(!(options.round < 0)){
		value = dojo.number.round(value, maxPlaces, options.round);
	}

	var valueParts = String(Math.abs(value)).split(".");
	var fractional = valueParts[1] || "";
	if(options.places){
		var comma = dojo.isString(options.places) && options.places.indexOf(",");
		if(comma){
			options.places = options.places.substring(comma+1);
		}
		valueParts[1] = dojo.string.pad(fractional.substr(0, options.places), options.places, '0', true);
	}else if(patternParts[1] && options.places !== 0){
		// Pad fractional with trailing zeros
		var pad = patternParts[1].lastIndexOf("0") + 1;
		if(pad > fractional.length){
			valueParts[1] = dojo.string.pad(fractional, pad, '0', true);
		}

		// Truncate fractional
		var places = patternParts[1].length;
		if(places < fractional.length){
			valueParts[1] = fractional.substr(0, places);
		}
	}else{
		if(valueParts[1]){ valueParts.pop(); }
	}

	// Pad whole with leading zeros
	var patternDigits = patternParts[0].replace(',', '');
	pad = patternDigits.indexOf("0");
	if(pad != -1){
		pad = patternDigits.length - pad;
		if(pad > valueParts[0].length){
			valueParts[0] = dojo.string.pad(valueParts[0], pad);
		}

		// Truncate whole
		if(patternDigits.indexOf("#") == -1){
			valueParts[0] = valueParts[0].substr(valueParts[0].length - pad);
		}
	}

	// Add group separators
	var index = patternParts[0].lastIndexOf(',');
	var groupSize, groupSize2;
	if(index != -1){
		groupSize = patternParts[0].length - index - 1;
		var remainder = patternParts[0].substr(0, index);
		index = remainder.lastIndexOf(',');
		if(index != -1){
			groupSize2 = remainder.length - index - 1;
		}
	}
	var pieces = [];
	for(var whole = valueParts[0]; whole;){
		var off = whole.length - groupSize;
		pieces.push((off > 0) ? whole.substr(off) : whole);
		whole = (off > 0) ? whole.slice(0, off) : "";
		if(groupSize2){
			groupSize = groupSize2;
			delete groupSize2;
		}
	}
	valueParts[0] = pieces.reverse().join(options.group || ",");

	return valueParts.join(options.decimal || ".");
};

/*=====
dojo.number.__RegexpOptions = function(){
	//	pattern: String?
	//		override pattern with this string.  Default is provided based on
	//		locale.
	//	type: String?
	//		choose a format type based on the locale from the following:
	//		decimal, scientific, percent, currency. decimal by default.
	//	locale: String?
	//		override the locale used to determine formatting rules
	//	strict: Boolean?
	//		strict parsing, false by default
	//	places: Number|String?
	//		number of decimal places to accept: Infinity, a positive number, or
	//		a range "n,m".  Defined by pattern or Infinity if pattern not provided.
	this.pattern = pattern;
	this.type = type;
	this.locale = locale;
	this.strict = strict;
	this.places = places;
}
=====*/
dojo.number.regexp = function(/*dojo.number.__RegexpOptions?*/options){
	//	summary:
	//		Builds the regular needed to parse a number
	//	description:
	//		Returns regular expression with positive and negative match, group
	//		and decimal separators
	return dojo.number._parseInfo(options).regexp; // String
}

dojo.number._parseInfo = function(/*Object?*/options){
	options = options || {};
	var locale = dojo.i18n.normalizeLocale(options.locale);
	var bundle = dojo.i18n.getLocalization("dojo.cldr", "number", locale);
	var pattern = options.pattern || bundle[(options.type || "decimal") + "Format"];
//TODO: memoize?
	var group = bundle.group;
	var decimal = bundle.decimal;
	var factor = 1;

	if(pattern.indexOf('%') != -1){
		factor /= 100;
	}else if(pattern.indexOf('\u2030') != -1){
		factor /= 1000; // per mille
	}else{
		var isCurrency = pattern.indexOf('\u00a4') != -1;
		if(isCurrency){
			group = bundle.currencyGroup || group;
			decimal = bundle.currencyDecimal || decimal;
		}
	}

	//TODO: handle quoted escapes
	var patternList = pattern.split(';');
	if(patternList.length == 1){
		patternList.push("-" + patternList[0]);
	}

	var re = dojo.regexp.buildGroupRE(patternList, function(pattern){
		pattern = "(?:"+dojo.regexp.escapeString(pattern, '.')+")";
		return pattern.replace(dojo.number._numberPatternRE, function(format){
			var flags = {
				signed: false,
				separator: options.strict ? group : [group,""],
				fractional: options.fractional,
				decimal: decimal,
				exponent: false};
			var parts = format.split('.');
			var places = options.places;
			if(parts.length == 1 || places === 0){flags.fractional = false;}
			else{
				if(places === undefined){ places = options.pattern ? parts[1].lastIndexOf('0')+1 : Infinity; }
				if(places && options.fractional == undefined){flags.fractional = true;} // required fractional, unless otherwise specified
				if(!options.places && (places < parts[1].length)){ places += "," + parts[1].length; }
				flags.places = places;
			}
			var groups = parts[0].split(',');
			if(groups.length>1){
				flags.groupSize = groups.pop().length;
				if(groups.length>1){
					flags.groupSize2 = groups.pop().length;
				}
			}
			return "("+dojo.number._realNumberRegexp(flags)+")";
		});
	}, true);

	if(isCurrency){
		// substitute the currency symbol for the placeholder in the pattern
		re = re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g, function(match, before, target, after){
			var prop = ["symbol", "currency", "displayName"][target.length-1];
			var symbol = dojo.regexp.escapeString(options[prop] || options.currency || "");
			before = before ? "[\\s\\xa0]" : "";
			after = after ? "[\\s\\xa0]" : "";
			if(!options.strict){
				if(before){before += "*";}
				if(after){after += "*";}
				return "(?:"+before+symbol+after+")?";
			}
			return before+symbol+after;
		});
	}

//TODO: substitute localized sign/percent/permille/etc.?

	// normalize whitespace and return
	return {regexp: re.replace(/[\xa0 ]/g, "[\\s\\xa0]"), group: group, decimal: decimal, factor: factor}; // Object
}

/*=====
dojo.number.__ParseOptions = function(){
	//	pattern: String
	//		override pattern with this string.  Default is provided based on
	//		locale.
	//	type: String?
	//		choose a format type based on the locale from the following:
	//		decimal, scientific, percent, currency. decimal by default.
	//	locale: String
	//		override the locale used to determine formatting rules
	//	strict: Boolean?
	//		strict parsing, false by default
	//	currency: Object
	//		object with currency information
	this.pattern = pattern;
	this.type = type;
	this.locale = locale;
	this.strict = strict;
	this.currency = currency;
}
=====*/
dojo.number.parse = function(/*String*/expression, /*dojo.number.__ParseOptions?*/options){
	// summary:
	//		Convert a properly formatted string to a primitive Number, using
	//		locale-specific settings.
	// description:
	//		Create a Number from a string using a known localized pattern.
	//		Formatting patterns are chosen appropriate to the locale
	//		and follow the syntax described by
	//		[unicode.org TR35](http://www.unicode.org/reports/tr35/#Number_Format_Patterns)
	// expression:
	//		A string representation of a Number
	var info = dojo.number._parseInfo(options);
	var results = (new RegExp("^"+info.regexp+"$")).exec(expression);
	if(!results){
		return NaN; //NaN
	}
	var absoluteMatch = results[1]; // match for the positive expression
	if(!results[1]){
		if(!results[2]){
			return NaN; //NaN
		}
		// matched the negative pattern
		absoluteMatch =results[2];
		info.factor *= -1;
	}

	// Transform it to something Javascript can parse as a number.  Normalize
	// decimal point and strip out group separators or alternate forms of whitespace
	absoluteMatch = absoluteMatch.
		replace(new RegExp("["+info.group + "\\s\\xa0"+"]", "g"), "").
		replace(info.decimal, ".");
	// Adjust for negative sign, percent, etc. as necessary
	return Number(absoluteMatch) * info.factor; //Number
};

/*=====
dojo.number.__RealNumberRegexpFlags = function(){
	//	places: Number?
	//		The integer number of decimal places or a range given as "n,m".  If
	//		not given, the decimal part is optional and the number of places is
	//		unlimited.
	//	decimal: String?
	//		A string for the character used as the decimal point.  Default
	//		is ".".
	//	fractional: Boolean|Array?
	//		Whether decimal places are allowed.  Can be true, false, or [true,
	//		false].  Default is [true, false]
	//	exponent: Boolean|Array?
	//		Express in exponential notation.  Can be true, false, or [true,
	//		false]. Default is [true, false], (i.e. will match if the
	//		exponential part is present are not).
	//	eSigned: Boolean|Array?
	//		The leading plus-or-minus sign on the exponent.  Can be true,
	//		false, or [true, false].  Default is [true, false], (i.e. will
	//		match if it is signed or unsigned).  flags in regexp.integer can be
	//		applied.
	this.places = places;
	this.decimal = decimal;
	this.fractional = fractional;
	this.exponent = exponent;
	this.eSigned = eSigned;
}
=====*/

dojo.number._realNumberRegexp = function(/*dojo.number.__RealNumberRegexpFlags?*/flags){
	// summary:
	//		Builds a regular expression to match a real number in exponential
	//		notation

	// assign default values to missing paramters
	flags = flags || {};
	//TODO: use mixin instead?
	if(!("places" in flags)){ flags.places = Infinity; }
	if(typeof flags.decimal != "string"){ flags.decimal = "."; }
	if(!("fractional" in flags) || /^0/.test(flags.places)){ flags.fractional = [true, false]; }
	if(!("exponent" in flags)){ flags.exponent = [true, false]; }
	if(!("eSigned" in flags)){ flags.eSigned = [true, false]; }

	// integer RE
	var integerRE = dojo.number._integerRegexp(flags);

	// decimal RE
	var decimalRE = dojo.regexp.buildGroupRE(flags.fractional,
		function(q){
			var re = "";
			if(q && (flags.places!==0)){
				re = "\\" + flags.decimal;
				if(flags.places == Infinity){ 
					re = "(?:" + re + "\\d+)?"; 
				}else{
					re += "\\d{" + flags.places + "}"; 
				}
			}
			return re;
		},
		true
	);

	// exponent RE
	var exponentRE = dojo.regexp.buildGroupRE(flags.exponent,
		function(q){ 
			if(q){ return "([eE]" + dojo.number._integerRegexp({ signed: flags.eSigned}) + ")"; }
			return ""; 
		}
	);

	// real number RE
	var realRE = integerRE + decimalRE;
	// allow for decimals without integers, e.g. .25
	if(decimalRE){realRE = "(?:(?:"+ realRE + ")|(?:" + decimalRE + "))";}
	return realRE + exponentRE; // String
};

/*=====
dojo.number.__IntegerRegexpFlags = function(){
	//	signed: Boolean?
	//		The leading plus-or-minus sign. Can be true, false, or `[true,false]`.
	//		Default is `[true, false]`, (i.e. will match if it is signed
	//		or unsigned).
	//	separator: String?
	//		The character used as the thousands separator. Default is no
	//		separator. For more than one symbol use an array, e.g. `[",", ""]`,
	//		makes ',' optional.
	//	groupSize: Number?
	//		group size between separators
	//	groupSize2: Number?
	//		second grouping, where separators 2..n have a different interval than the first separator (for India)
	this.signed = signed;
	this.separator = separator;
	this.groupSize = groupSize;
	this.groupSize2 = groupSize2;
}
=====*/

dojo.number._integerRegexp = function(/*dojo.number.__IntegerRegexpFlags?*/flags){
	// summary: 
	//		Builds a regular expression that matches an integer

	// assign default values to missing paramters
	flags = flags || {};
	if(!("signed" in flags)){ flags.signed = [true, false]; }
	if(!("separator" in flags)){
		flags.separator = "";
	}else if(!("groupSize" in flags)){
		flags.groupSize = 3;
	}
	// build sign RE
	var signRE = dojo.regexp.buildGroupRE(flags.signed,
		function(q){ return q ? "[-+]" : ""; },
		true
	);

	// number RE
	var numberRE = dojo.regexp.buildGroupRE(flags.separator,
		function(sep){
			if(!sep){
				return "(?:0|[1-9]\\d*)";
			}

			sep = dojo.regexp.escapeString(sep);
			if(sep == " "){ sep = "\\s"; }
			else if(sep == "\xa0"){ sep = "\\s\\xa0"; }

			var grp = flags.groupSize, grp2 = flags.groupSize2;
			if(grp2){
				var grp2RE = "(?:0|[1-9]\\d{0," + (grp2-1) + "}(?:[" + sep + "]\\d{" + grp2 + "})*[" + sep + "]\\d{" + grp + "})";
				return ((grp-grp2) > 0) ? "(?:" + grp2RE + "|(?:0|[1-9]\\d{0," + (grp-1) + "}))" : grp2RE;
			}
			return "(?:0|[1-9]\\d{0," + (grp-1) + "}(?:[" + sep + "]\\d{" + grp + "})*)";
		},
		true
	);

	// integer RE
	return signRE + numberRE; // String
}

}

if(!dojo._hasResource["dijit.form.NumberTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.NumberTextBox"] = true;
dojo.provide("dijit.form.NumberTextBox");




/*=====
dojo.declare(
	"dijit.form.NumberTextBox.__Constraints",
	[dijit.form.RangeBoundTextBox.__Constraints, dojo.number.__FormatOptions, dojo.number.__ParseOptions]
);
=====*/

dojo.declare(
	"dijit.form.NumberTextBoxMixin",
	null,
	{
		// summary:
		//		A mixin for all number textboxes

		regExpGen: dojo.number.regexp,

		/*=====
		// constraints: dijit.form.NumberTextBox.__Constraints 
		constraints: {},
		======*/

		// editOptions: Object
		//		properties to mix into constraints when the value is being edited
		editOptions: { pattern: '#.######' },

		_onFocus: function(){
			this._setValueAttr(this.attr('value'), false);	
			this.inherited(arguments);
		},

		_formatter: dojo.number.format,

		format: function(/*Number*/ value, /*dojo.number.__FormatOptions*/ constraints){
			//	summary: formats the value as a Number, according to constraints

			if(typeof value == "string") { return value; }
			if(isNaN(value)){ return ""; }
			if(this.editOptions && this._focused){
				constraints = dojo.mixin(dojo.mixin({}, this.editOptions), this.constraints);
			}
			return this._formatter(value, constraints);
		},

		parse: dojo.number.parse,
		/*=====
		parse: function(value, constraints){
			//	summary: parses the value as a Number, according to constraints
			//	value: String
			//
			//	constraints: dojo.number.__ParseOptions
		},
		=====*/

		filter: function(/*Number*/ value){
			return (value === null || value === '' || value === undefined)? NaN : this.inherited(arguments); // attr('value', null||''||undefined) should fire onChange(NaN)
		},

		serialize: function(/*Number*/ value, /*Object?*/options){
			return (typeof value != "number" || isNaN(value))? '' : this.inherited(arguments);
		},

		_getValueAttr: function(){
			// summary:
			//		Hook so attr('value') works.
			var v = this.inherited(arguments);
			if(isNaN(v) && this.textbox.value !== ''){ return undefined; }
			return v;
		},

		value: NaN
	}
);

dojo.declare(
	"dijit.form.NumberTextBox",
	[dijit.form.RangeBoundTextBox,dijit.form.NumberTextBoxMixin],
	{
		// summary:
		//		A validating, serializable, range-bound text box.
	}
);

}

if(!dojo._hasResource["dijit.form.NumberSpinner"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.NumberSpinner"] = true;
dojo.provide("dijit.form.NumberSpinner");




dojo.declare(
"dijit.form.NumberSpinner",
[dijit.form._Spinner, dijit.form.NumberTextBoxMixin],
{
	// summary:
	// extends NumberTextBox to add up/down arrows and pageup/pagedown for incremental change to the value

	required: true,

	adjust: function(/* Object */ val, /*Number*/ delta){
		// summary: change Number val by the given amount
		if(isNaN(val) && delta != 0){ // blank or invalid value and they want to spin, so create defaults
			var increasing = (delta > 0),
				gotMax = (typeof this.constraints.max == "number"),
				gotMin = (typeof this.constraints.min == "number");
			val = increasing? (gotMin? this.constraints.min : (gotMax? this.constraints.max : 0)) :
					(gotMax? this.constraints.max : (gotMin? this.constraints.min : 0));
		}
		var newval = val+delta;
		if(isNaN(val) || isNaN(newval)){ return val; }
		if((typeof this.constraints.max == "number") && (newval > this.constraints.max)){
			newval = this.constraints.max;
		}
		if((typeof this.constraints.min == "number") && (newval < this.constraints.min)){
			newval = this.constraints.min;
		}
		return newval;
	},
	_onKeyPress: function(e){
		if((e.charOrCode == dojo.keys.HOME || e.charOrCode == dojo.keys.END) && !e.ctrlKey && !e.altKey){
			var value = e.charOrCode == dojo.keys.HOME ? this.constraints["min"] : this.constraints["max"];
			if (value){
				this._setValueAttr(value,true);
			}
			// eat home or end key whether we change the value or not
			dojo.stopEvent(e);
			return false;
		}
		else{
			return this.inherited(arguments);
		}
	}
});

}

if(!dojo._hasResource["dojo.cldr.supplemental"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.cldr.supplemental"] = true;
dojo.provide("dojo.cldr.supplemental");



dojo.cldr.supplemental.getFirstDayOfWeek = function(/*String?*/locale){
// summary: Returns a zero-based index for first day of the week
// description:
//		Returns a zero-based index for first day of the week, as used by the local (Gregorian) calendar.
//		e.g. Sunday (returns 0), or Monday (returns 1)

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/firstDay
	var firstDay = {/*default is 1=Monday*/
		mv:5,
		ae:6,af:6,bh:6,dj:6,dz:6,eg:6,er:6,et:6,iq:6,ir:6,jo:6,ke:6,kw:6,lb:6,ly:6,ma:6,om:6,qa:6,sa:6,
		sd:6,so:6,tn:6,ye:6,
		as:0,au:0,az:0,bw:0,ca:0,cn:0,fo:0,ge:0,gl:0,gu:0,hk:0,ie:0,il:0,is:0,jm:0,jp:0,kg:0,kr:0,la:0,
		mh:0,mo:0,mp:0,mt:0,nz:0,ph:0,pk:0,sg:0,th:0,tt:0,tw:0,um:0,us:0,uz:0,vi:0,za:0,zw:0,
		et:0,mw:0,ng:0,tj:0,
// variant. do not use?		gb:0,
		sy:4
	};

	var country = dojo.cldr.supplemental._region(locale);
	var dow = firstDay[country];
	return (dow === undefined) ? 1 : dow; /*Number*/
};

dojo.cldr.supplemental._region = function(/*String?*/locale){
	locale = dojo.i18n.normalizeLocale(locale);
	var tags = locale.split('-');
	var region = tags[1];
	if(!region){
		// IE often gives language only (#2269)
		// Arbitrary mappings of language-only locales to a country:
		region = {de:"de", en:"us", es:"es", fi:"fi", fr:"fr", he:"il", hu:"hu", it:"it",
			ja:"jp", ko:"kr", nl:"nl", pt:"br", sv:"se", zh:"cn"}[tags[0]];
	}else if(region.length == 4){
		// The ISO 3166 country code is usually in the second position, unless a
		// 4-letter script is given. See http://www.ietf.org/rfc/rfc4646.txt
		region = tags[2];
	}
	return region;
}

dojo.cldr.supplemental.getWeekend = function(/*String?*/locale){
// summary: Returns a hash containing the start and end days of the weekend
// description:
//		Returns a hash containing the start and end days of the weekend according to local custom using locale,
//		or by default in the user's locale.
//		e.g. {start:6, end:0}

	// from http://www.unicode.org/cldr/data/common/supplemental/supplementalData.xml:supplementalData/weekData/weekend{Start,End}
	var weekendStart = {/*default is 6=Saturday*/
		eg:5,il:5,sy:5,
		'in':0,
		ae:4,bh:4,dz:4,iq:4,jo:4,kw:4,lb:4,ly:4,ma:4,om:4,qa:4,sa:4,sd:4,tn:4,ye:4		
	};

	var weekendEnd = {/*default is 0=Sunday*/
		ae:5,bh:5,dz:5,iq:5,jo:5,kw:5,lb:5,ly:5,ma:5,om:5,qa:5,sa:5,sd:5,tn:5,ye:5,af:5,ir:5,
		eg:6,il:6,sy:6
	};

	var country = dojo.cldr.supplemental._region(locale);
	var start = weekendStart[country];
	var end = weekendEnd[country];
	if(start === undefined){start=6;}
	if(end === undefined){end=0;}
	return {start:start, end:end}; /*Object {start,end}*/
};

}

if(!dojo._hasResource["dojo.date"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date"] = true;
dojo.provide("dojo.date");

/*=====
dojo.date = {
	// summary: Date manipulation utilities
}
=====*/

dojo.date.getDaysInMonth = function(/*Date*/dateObject){
	//	summary:
	//		Returns the number of days in the month used by dateObject
	var month = dateObject.getMonth();
	var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if(month == 1 && dojo.date.isLeapYear(dateObject)){ return 29; } // Number
	return days[month]; // Number
}

dojo.date.isLeapYear = function(/*Date*/dateObject){
	//	summary:
	//		Determines if the year of the dateObject is a leap year
	//	description:
	//		Leap years are years with an additional day YYYY-02-29, where the
	//		year number is a multiple of four with the following exception: If
	//		a year is a multiple of 100, then it is only a leap year if it is
	//		also a multiple of 400. For example, 1900 was not a leap year, but
	//		2000 is one.

	var year = dateObject.getFullYear();
	return !(year%400) || (!(year%4) && !!(year%100)); // Boolean
}

// FIXME: This is not localized
dojo.date.getTimezoneName = function(/*Date*/dateObject){
	//	summary:
	//		Get the user's time zone as provided by the browser
	// dateObject:
	//		Needed because the timezone may vary with time (daylight savings)
	//	description:
	//		Try to get time zone info from toString or toLocaleString method of
	//		the Date object -- UTC offset is not a time zone.  See
	//		http://www.twinsun.com/tz/tz-link.htm Note: results may be
	//		inconsistent across browsers.

	var str = dateObject.toString(); // Start looking in toString
	var tz = ''; // The result -- return empty string if nothing found
	var match;

	// First look for something in parentheses -- fast lookup, no regex
	var pos = str.indexOf('(');
	if(pos > -1){
		tz = str.substring(++pos, str.indexOf(')'));
	}else{
		// If at first you don't succeed ...
		// If IE knows about the TZ, it appears before the year
		// Capital letters or slash before a 4-digit year 
		// at the end of string
		var pat = /([A-Z\/]+) \d{4}$/;
		if((match = str.match(pat))){
			tz = match[1];
		}else{
		// Some browsers (e.g. Safari) glue the TZ on the end
		// of toLocaleString instead of putting it in toString
			str = dateObject.toLocaleString();
			// Capital letters or slash -- end of string, 
			// after space
			pat = / ([A-Z\/]+)$/;
			if((match = str.match(pat))){
				tz = match[1];
			}
		}
	}

	// Make sure it doesn't somehow end up return AM or PM
	return (tz == 'AM' || tz == 'PM') ? '' : tz; // String
}

// Utility methods to do arithmetic calculations with Dates

dojo.date.compare = function(/*Date*/date1, /*Date?*/date2, /*String?*/portion){
	//	summary:
	//		Compare two date objects by date, time, or both.
	//	description:
	//  	Returns 0 if equal, positive if a > b, else negative.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	portion:
	//		A string indicating the "date" or "time" portion of a Date object.
	//		Compares both "date" and "time" by default.  One of the following:
	//		"date", "time", "datetime"

	// Extra step required in copy for IE - see #3112
	date1 = new Date(Number(date1));
	date2 = new Date(Number(date2 || new Date()));

	if(portion !== "undefined"){
		if(portion == "date"){
			// Ignore times and compare dates.
			date1.setHours(0, 0, 0, 0);
			date2.setHours(0, 0, 0, 0);
		}else if(portion == "time"){
			// Ignore dates and compare times.
			date1.setFullYear(0, 0, 0);
			date2.setFullYear(0, 0, 0);
		}
	}
	
	if(date1 > date2){ return 1; } // int
	if(date1 < date2){ return -1; } // int
	return 0; // int
};

dojo.date.add = function(/*Date*/date, /*String*/interval, /*int*/amount){
	//	summary:
	//		Add to a Date in intervals of different size, from milliseconds to years
	//	date: Date
	//		Date object to start with
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//	amount:
	//		How much to add to the date.

	var sum = new Date(Number(date)); // convert to Number before copying to accomodate IE (#3112)
	var fixOvershoot = false;
	var property = "Date";

	switch(interval){
		case "day":
			break;
		case "weekday":
			//i18n FIXME: assumes Saturday/Sunday weekend, but this is not always true.  see dojo.cldr.supplemental

			// Divide the increment time span into weekspans plus leftover days
			// e.g., 8 days is one 5-day weekspan / and two leftover days
			// Can't have zero leftover days, so numbers divisible by 5 get
			// a days value of 5, and the remaining days make up the number of weeks
			var days, weeks;
			var mod = amount % 5;
			if(!mod){
				days = (amount > 0) ? 5 : -5;
				weeks = (amount > 0) ? ((amount-5)/5) : ((amount+5)/5);
			}else{
				days = mod;
				weeks = parseInt(amount/5);
			}
			// Get weekday value for orig date param
			var strt = date.getDay();
			// Orig date is Sat / positive incrementer
			// Jump over Sun
			var adj = 0;
			if(strt == 6 && amount > 0){
				adj = 1;
			}else if(strt == 0 && amount < 0){
			// Orig date is Sun / negative incrementer
			// Jump back over Sat
				adj = -1;
			}
			// Get weekday val for the new date
			var trgt = strt + days;
			// New date is on Sat or Sun
			if(trgt == 0 || trgt == 6){
				adj = (amount > 0) ? 2 : -2;
			}
			// Increment by number of weeks plus leftover days plus
			// weekend adjustments
			amount = (7 * weeks) + days + adj;
			break;
		case "year":
			property = "FullYear";
			// Keep increment/decrement from 2/29 out of March
			fixOvershoot = true;
			break;
		case "week":
			amount *= 7;
			break;
		case "quarter":
			// Naive quarter is just three months
			amount *= 3;
			// fallthrough...
		case "month":
			// Reset to last day of month if you overshoot
			fixOvershoot = true;
			property = "Month";
			break;
		case "hour":
		case "minute":
		case "second":
		case "millisecond":
			property = "UTC"+interval.charAt(0).toUpperCase() + interval.substring(1) + "s";
	}

	if(property){
		sum["set"+property](sum["get"+property]()+amount);
	}

	if(fixOvershoot && (sum.getDate() < date.getDate())){
		sum.setDate(0);
	}

	return sum; // Date
};

dojo.date.difference = function(/*Date*/date1, /*Date?*/date2, /*String?*/interval){
	//	summary:
	//		Get the difference in a specific unit of time (e.g., number of
	//		months, weeks, days, etc.) between two dates, rounded to the
	//		nearest integer.
	//	date1:
	//		Date object
	//	date2:
	//		Date object.  If not specified, the current Date is used.
	//	interval:
	//		A string representing the interval.  One of the following:
	//			"year", "month", "day", "hour", "minute", "second",
	//			"millisecond", "quarter", "week", "weekday"
	//		Defaults to "day".

	date2 = date2 || new Date();
	interval = interval || "day";
	var yearDiff = date2.getFullYear() - date1.getFullYear();
	var delta = 1; // Integer return value

	switch(interval){
		case "quarter":
			var m1 = date1.getMonth();
			var m2 = date2.getMonth();
			// Figure out which quarter the months are in
			var q1 = Math.floor(m1/3) + 1;
			var q2 = Math.floor(m2/3) + 1;
			// Add quarters for any year difference between the dates
			q2 += (yearDiff * 4);
			delta = q2 - q1;
			break;
		case "weekday":
			var days = Math.round(dojo.date.difference(date1, date2, "day"));
			var weeks = parseInt(dojo.date.difference(date1, date2, "week"));
			var mod = days % 7;

			// Even number of weeks
			if(mod == 0){
				days = weeks*5;
			}else{
				// Weeks plus spare change (< 7 days)
				var adj = 0;
				var aDay = date1.getDay();
				var bDay = date2.getDay();

				weeks = parseInt(days/7);
				mod = days % 7;
				// Mark the date advanced by the number of
				// round weeks (may be zero)
				var dtMark = new Date(date1);
				dtMark.setDate(dtMark.getDate()+(weeks*7));
				var dayMark = dtMark.getDay();

				// Spare change days -- 6 or less
				if(days > 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = -1;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 0;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = -1;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = -2;
							break;
						// Range contains weekend
						case (dayMark + mod) > 5:
							adj = -2;
					}
				}else if(days < 0){
					switch(true){
						// Range starts on Sat
						case aDay == 6:
							adj = 0;
							break;
						// Range starts on Sun
						case aDay == 0:
							adj = 1;
							break;
						// Range ends on Sat
						case bDay == 6:
							adj = 2;
							break;
						// Range ends on Sun
						case bDay == 0:
							adj = 1;
							break;
						// Range contains weekend
						case (dayMark + mod) < 0:
							adj = 2;
					}
				}
				days += adj;
				days -= (weeks*2);
			}
			delta = days;
			break;
		case "year":
			delta = yearDiff;
			break;
		case "month":
			delta = (date2.getMonth() - date1.getMonth()) + (yearDiff * 12);
			break;
		case "week":
			// Truncate instead of rounding
			// Don't use Math.floor -- value may be negative
			delta = parseInt(dojo.date.difference(date1, date2, "day")/7);
			break;
		case "day":
			delta /= 24;
			// fallthrough
		case "hour":
			delta /= 60;
			// fallthrough
		case "minute":
			delta /= 60;
			// fallthrough
		case "second":
			delta /= 1000;
			// fallthrough
		case "millisecond":
			delta *= date2.getTime() - date1.getTime();
	}

	// Round for fractional values and DST leaps
	return Math.round(delta); // Number (integer)
};

}

if(!dojo._hasResource["dojo.date.locale"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.date.locale"] = true;
dojo.provide("dojo.date.locale");

// Localization methods for Date.   Honor local customs using locale-dependent dojo.cldr data.







// Load the bundles containing localization information for
// names and formats


//NOTE: Everything in this module assumes Gregorian calendars.
// Other calendars will be implemented in separate modules.

(function(){
	// Format a pattern without literals
	function formatPattern(dateObject, bundle, fullYear, pattern){
		return pattern.replace(/([a-z])\1*/ig, function(match){
			var s, pad;
			var c = match.charAt(0);
			var l = match.length;
			var widthList = ["abbr", "wide", "narrow"];
			switch(c){
				case 'G':
					s = bundle[(l < 4) ? "eraAbbr" : "eraNames"][dateObject.getFullYear() < 0 ? 0 : 1];
					break;
				case 'y':
					s = dateObject.getFullYear();
					switch(l){
						case 1:
							break;
						case 2:
							if(!fullYear){
								s = String(s); s = s.substr(s.length - 2);
								break;
							}
							// fallthrough
						default:
							pad = true;
					}
					break;
				case 'Q':
				case 'q':
					s = Math.ceil((dateObject.getMonth()+1)/3);
//					switch(l){
//						case 1: case 2:
							pad = true;
//							break;
//						case 3: case 4: // unimplemented
//					}
					break;
				case 'M':
					var m = dateObject.getMonth();
					if(l<3){
						s = m+1; pad = true;
					}else{
						var propM = ["months", "format", widthList[l-3]].join("-");
						s = bundle[propM][m];
					}
					break;
				case 'w':
					var firstDay = 0;
					s = dojo.date.locale._getWeekOfYear(dateObject, firstDay); pad = true;
					break;
				case 'd':
					s = dateObject.getDate(); pad = true;
					break;
				case 'D':
					s = dojo.date.locale._getDayOfYear(dateObject); pad = true;
					break;
				case 'E':
					var d = dateObject.getDay();
					if(l<3){
						s = d+1; pad = true;
					}else{
						var propD = ["days", "format", widthList[l-3]].join("-");
						s = bundle[propD][d];
					}
					break;
				case 'a':
					var timePeriod = (dateObject.getHours() < 12) ? 'am' : 'pm';
					s = bundle[timePeriod];
					break;
				case 'h':
				case 'H':
				case 'K':
				case 'k':
					var h = dateObject.getHours();
					// strange choices in the date format make it impossible to write this succinctly
					switch (c){
						case 'h': // 1-12
							s = (h % 12) || 12;
							break;
						case 'H': // 0-23
							s = h;
							break;
						case 'K': // 0-11
							s = (h % 12);
							break;
						case 'k': // 1-24
							s = h || 24;
							break;
					}
					pad = true;
					break;
				case 'm':
					s = dateObject.getMinutes(); pad = true;
					break;
				case 's':
					s = dateObject.getSeconds(); pad = true;
					break;
				case 'S':
					s = Math.round(dateObject.getMilliseconds() * Math.pow(10, l-3)); pad = true;
					break;
				case 'v': // FIXME: don't know what this is. seems to be same as z?
				case 'z':
					// We only have one timezone to offer; the one from the browser
					s = dojo.date.getTimezoneName(dateObject);
					if(s){break;}
					l=4;
					// fallthrough... use GMT if tz not available
				case 'Z':
					var offset = dateObject.getTimezoneOffset();
					var tz = [
						(offset<=0 ? "+" : "-"),
						dojo.string.pad(Math.floor(Math.abs(offset)/60), 2),
						dojo.string.pad(Math.abs(offset)% 60, 2)
					];
					if(l==4){
						tz.splice(0, 0, "GMT");
						tz.splice(3, 0, ":");
					}
					s = tz.join("");
					break;
//				case 'Y': case 'u': case 'W': case 'F': case 'g': case 'A': case 'e':
//					console.debug(match+" modifier unimplemented");
				default:
					throw new Error("dojo.date.locale.format: invalid pattern char: "+pattern);
			}
			if(pad){ s = dojo.string.pad(s, l); }
			return s;
		});
	}

/*=====
	dojo.date.locale.__FormatOptions = function(){
	//	selector: String
	//		choice of 'time','date' (default: date and time)
	//	formatLength: String
	//		choice of long, short, medium or full (plus any custom additions).  Defaults to 'short'
	//	datePattern:String
	//		override pattern with this string
	//	timePattern:String
	//		override pattern with this string
	//	am: String
	//		override strings for am in times
	//	pm: String
	//		override strings for pm in times
	//	locale: String
	//		override the locale used to determine formatting rules
	//	fullYear: Boolean
	//		(format only) use 4 digit years whenever 2 digit years are called for
	//	strict: Boolean
	//		(parse only) strict parsing, off by default
		this.selector = selector;
		this.formatLength = formatLength;
		this.datePattern = datePattern;
		this.timePattern = timePattern;
		this.am = am;
		this.pm = pm;
		this.locale = locale;
		this.fullYear = fullYear;
		this.strict = strict;
	}
=====*/

dojo.date.locale.format = function(/*Date*/dateObject, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Format a Date object as a String, using locale-specific settings.
	//
	// description:
	//		Create a string from a Date object using a known localized pattern.
	//		By default, this method formats both date and time from dateObject.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//
	// dateObject:
	//		the date and/or time to be formatted.  If a time only is formatted,
	//		the values in the year, month, and day fields are irrelevant.  The
	//		opposite is true when formatting only dates.

	options = options || {};

	var locale = dojo.i18n.normalizeLocale(options.locale);
	var formatLength = options.formatLength || 'short';
	var bundle = dojo.date.locale._getGregorianBundle(locale);
	var str = [];
	var sauce = dojo.hitch(this, formatPattern, dateObject, bundle, options.fullYear);
	if(options.selector == "year"){
		// Special case as this is not yet driven by CLDR data
		var year = dateObject.getFullYear();
		if(locale.match(/^zh|^ja/)){
			year += "\u5E74";
		}
		return year;
	}
	if(options.selector != "time"){
		var datePattern = options.datePattern || bundle["dateFormat-"+formatLength];
		if(datePattern){str.push(_processPattern(datePattern, sauce));}
	}
	if(options.selector != "date"){
		var timePattern = options.timePattern || bundle["timeFormat-"+formatLength];
		if(timePattern){str.push(_processPattern(timePattern, sauce));}
	}
	var result = str.join(" "); //TODO: use locale-specific pattern to assemble date + time
	return result; // String
};

dojo.date.locale.regexp = function(/*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Builds the regular needed to parse a localized date

	return dojo.date.locale._parseInfo(options).regexp; // String
};

dojo.date.locale._parseInfo = function(/*dojo.date.locale.__FormatOptions?*/options){
	options = options || {};
	var locale = dojo.i18n.normalizeLocale(options.locale);
	var bundle = dojo.date.locale._getGregorianBundle(locale);
	var formatLength = options.formatLength || 'short';
	var datePattern = options.datePattern || bundle["dateFormat-" + formatLength];
	var timePattern = options.timePattern || bundle["timeFormat-" + formatLength];
	var pattern;
	if(options.selector == 'date'){
		pattern = datePattern;
	}else if(options.selector == 'time'){
		pattern = timePattern;
	}else{
		pattern = datePattern + ' ' + timePattern; //TODO: use locale-specific pattern to assemble date + time
	}

	var tokens = [];
	var re = _processPattern(pattern, dojo.hitch(this, _buildDateTimeRE, tokens, bundle, options));
	return {regexp: re, tokens: tokens, bundle: bundle};
};

dojo.date.locale.parse = function(/*String*/value, /*dojo.date.locale.__FormatOptions?*/options){
	// summary:
	//		Convert a properly formatted string to a primitive Date object,
	//		using locale-specific settings.
	//
	// description:
	//		Create a Date object from a string using a known localized pattern.
	//		By default, this method parses looking for both date and time in the string.
	//		Formatting patterns are chosen appropriate to the locale.  Different
	//		formatting lengths may be chosen, with "full" used by default.
	//		Custom patterns may be used or registered with translations using
	//		the dojo.date.locale.addCustomFormats method.
	//	
	//		Formatting patterns are implemented using [the syntax described at
	//		unicode.org](http://www.unicode.org/reports/tr35/tr35-4.html#Date_Format_Patterns)
	//		When two digit years are used, a century is chosen according to a sliding 
	//		window of 80 years before and 20 years after present year, for both `yy` and `yyyy` patterns.
	//		year < 100CE requires strict mode.
	//
	// value:
	//		A string representation of a date

	var info = dojo.date.locale._parseInfo(options);
	var tokens = info.tokens, bundle = info.bundle;
	var re = new RegExp("^" + info.regexp + "$", info.strict ? "" : "i");
	var match = re.exec(value);
	if(!match){ return null; } // null

	var widthList = ['abbr', 'wide', 'narrow'];
	var result = [1970,0,1,0,0,0,0]; // will get converted to a Date at the end
	var amPm = "";
	var valid = dojo.every(match, function(v, i){
		if(!i){return true;}
		var token=tokens[i-1];
		var l=token.length;
		switch(token.charAt(0)){
			case 'y':
				if(l != 2 && options.strict){
					//interpret year literally, so '5' would be 5 A.D.
					result[0] = v;
				}else{
					if(v<100){
						v = Number(v);
						//choose century to apply, according to a sliding window
						//of 80 years before and 20 years after present year
						var year = '' + new Date().getFullYear();
						var century = year.substring(0, 2) * 100;
						var cutoff = Math.min(Number(year.substring(2, 4)) + 20, 99);
						var num = (v < cutoff) ? century + v : century - 100 + v;
						result[0] = num;
					}else{
						//we expected 2 digits and got more...
						if(options.strict){
							return false;
						}
						//interpret literally, so '150' would be 150 A.D.
						//also tolerate '1950', if 'yyyy' input passed to 'yy' format
						result[0] = v;
					}
				}
				break;
			case 'M':
				if(l>2){
					var months = bundle['months-format-' + widthList[l-3]].concat();
					if(!options.strict){
						//Tolerate abbreviating period in month part
						//Case-insensitive comparison
						v = v.replace(".","").toLowerCase();
						months = dojo.map(months, function(s){ return s.replace(".","").toLowerCase(); } );
					}
					v = dojo.indexOf(months, v);
					if(v == -1){
//						console.debug("dojo.date.locale.parse: Could not parse month name: '" + v + "'.");
						return false;
					}
				}else{
					v--;
				}
				result[1] = v;
				break;
			case 'E':
			case 'e':
				var days = bundle['days-format-' + widthList[l-3]].concat();
				if(!options.strict){
					//Case-insensitive comparison
					v = v.toLowerCase();
					days = dojo.map(days, function(d){return d.toLowerCase();});
				}
				v = dojo.indexOf(days, v);
				if(v == -1){
//					console.debug("dojo.date.locale.parse: Could not parse weekday name: '" + v + "'.");
					return false;
				}

				//TODO: not sure what to actually do with this input,
				//in terms of setting something on the Date obj...?
				//without more context, can't affect the actual date
				//TODO: just validate?
				break;
			case 'D':
				result[1] = 0;
				// fallthrough...
			case 'd':
				result[2] = v;
				break;
			case 'a': //am/pm
				var am = options.am || bundle.am;
				var pm = options.pm || bundle.pm;
				if(!options.strict){
					var period = /\./g;
					v = v.replace(period,'').toLowerCase();
					am = am.replace(period,'').toLowerCase();
					pm = pm.replace(period,'').toLowerCase();
				}
				if(options.strict && v != am && v != pm){
//					console.debug("dojo.date.locale.parse: Could not parse am/pm part.");
					return false;
				}

				// we might not have seen the hours field yet, so store the state and apply hour change later
				amPm = (v == pm) ? 'p' : (v == am) ? 'a' : '';
				break;
			case 'K': //hour (1-24)
				if(v == 24){ v = 0; }
				// fallthrough...
			case 'h': //hour (1-12)
			case 'H': //hour (0-23)
			case 'k': //hour (0-11)
				//TODO: strict bounds checking, padding
				if(v > 23){
//					console.debug("dojo.date.locale.parse: Illegal hours value");
					return false;
				}

				//in the 12-hour case, adjusting for am/pm requires the 'a' part
				//which could come before or after the hour, so we will adjust later
				result[3] = v;
				break;
			case 'm': //minutes
				result[4] = v;
				break;
			case 's': //seconds
				result[5] = v;
				break;
			case 'S': //milliseconds
				result[6] = v;
//				break;
//			case 'w':
//TODO				var firstDay = 0;
//			default:
//TODO: throw?
//				console.debug("dojo.date.locale.parse: unsupported pattern char=" + token.charAt(0));
		}
		return true;
	});

	var hours = +result[3];
	if(amPm === 'p' && hours < 12){
		result[3] = hours + 12; //e.g., 3pm -> 15
	}else if(amPm === 'a' && hours == 12){
		result[3] = 0; //12am -> 0
	}

	//TODO: implement a getWeekday() method in order to test 
	//validity of input strings containing 'EEE' or 'EEEE'...

	var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
	if(options.strict){
		dateObject.setFullYear(result[0]);
	}

	// Check for overflow.  The Date() constructor normalizes things like April 32nd...
	//TODO: why isn't this done for times as well?
	var allTokens = tokens.join("");
	if(!valid ||
		(allTokens.indexOf('M') != -1 && dateObject.getMonth() != result[1]) ||
		(allTokens.indexOf('d') != -1 && dateObject.getDate() != result[2])){
		return null;
	}

	return dateObject; // Date
};

function _processPattern(pattern, applyPattern, applyLiteral, applyAll){
	//summary: Process a pattern with literals in it

	// Break up on single quotes, treat every other one as a literal, except '' which becomes '
	var identity = function(x){return x;};
	applyPattern = applyPattern || identity;
	applyLiteral = applyLiteral || identity;
	applyAll = applyAll || identity;

	//split on single quotes (which escape literals in date format strings) 
	//but preserve escaped single quotes (e.g., o''clock)
	var chunks = pattern.match(/(''|[^'])+/g); 
	var literal = pattern.charAt(0) == "'";

	dojo.forEach(chunks, function(chunk, i){
		if(!chunk){
			chunks[i]='';
		}else{
			chunks[i]=(literal ? applyLiteral : applyPattern)(chunk);
			literal = !literal;
		}
	});
	return applyAll(chunks.join(''));
}

function _buildDateTimeRE(tokens, bundle, options, pattern){
	pattern = dojo.regexp.escapeString(pattern);
	if(!options.strict){ pattern = pattern.replace(" a", " ?a"); } // kludge to tolerate no space before am/pm
	return pattern.replace(/([a-z])\1*/ig, function(match){
		// Build a simple regexp.  Avoid captures, which would ruin the tokens list
		var s;
		var c = match.charAt(0);
		var l = match.length;
		var p2 = '', p3 = '';
		if(options.strict){
			if(l > 1){ p2 = '0' + '{'+(l-1)+'}'; }
			if(l > 2){ p3 = '0' + '{'+(l-2)+'}'; }
		}else{
			p2 = '0?'; p3 = '0{0,2}';
		}
		switch(c){
			case 'y':
				s = '\\d{2,4}';
				break;
			case 'M':
				s = (l>2) ? '\\S+?' : p2+'[1-9]|1[0-2]';
				break;
			case 'D':
				s = p2+'[1-9]|'+p3+'[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-6]';
				break;
			case 'd':
				s = '[12]\\d|'+p2+'[1-9]|3[01]';
				break;
			case 'w':
				s = p2+'[1-9]|[1-4][0-9]|5[0-3]';
				break;
		    case 'E':
				s = '\\S+';
				break;
			case 'h': //hour (1-12)
				s = p2+'[1-9]|1[0-2]';
				break;
			case 'k': //hour (0-11)
				s = p2+'\\d|1[01]';
				break;
			case 'H': //hour (0-23)
				s = p2+'\\d|1\\d|2[0-3]';
				break;
			case 'K': //hour (1-24)
				s = p2+'[1-9]|1\\d|2[0-4]';
				break;
			case 'm':
			case 's':
				s = '[0-5]\\d';
				break;
			case 'S':
				s = '\\d{'+l+'}';
				break;
			case 'a':
				var am = options.am || bundle.am || 'AM';
				var pm = options.pm || bundle.pm || 'PM';
				if(options.strict){
					s = am + '|' + pm;
				}else{
					s = am + '|' + pm;
					if(am != am.toLowerCase()){ s += '|' + am.toLowerCase(); }
					if(pm != pm.toLowerCase()){ s += '|' + pm.toLowerCase(); }
					if(s.indexOf('.') != -1){ s += '|' + s.replace(/\./g, ""); }
				}
				s = s.replace(/\./g, "\\.");
				break;
			default:
			// case 'v':
			// case 'z':
			// case 'Z':
				s = ".*";
//				console.debug("parse of date format, pattern=" + pattern);
		}

		if(tokens){ tokens.push(match); }

		return "(" + s + ")"; // add capture
	}).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
}
})();

(function(){
var _customFormats = [];
dojo.date.locale.addCustomFormats = function(/*String*/packageName, /*String*/bundleName){
	// summary:
	//		Add a reference to a bundle containing localized custom formats to be
	//		used by date/time formatting and parsing routines.
	//
	// description:
	//		The user may add custom localized formats where the bundle has properties following the
	//		same naming convention used by dojo.cldr: `dateFormat-xxxx` / `timeFormat-xxxx`
	//		The pattern string should match the format used by the CLDR.
	//		See dojo.date.locale.format() for details.
	//		The resources must be loaded by dojo.requireLocalization() prior to use

	_customFormats.push({pkg:packageName,name:bundleName});
};

dojo.date.locale._getGregorianBundle = function(/*String*/locale){
	var gregorian = {};
	dojo.forEach(_customFormats, function(desc){
		var bundle = dojo.i18n.getLocalization(desc.pkg, desc.name, locale);
		gregorian = dojo.mixin(gregorian, bundle);
	}, this);
	return gregorian; /*Object*/
};
})();

dojo.date.locale.addCustomFormats("dojo.cldr","gregorian");

dojo.date.locale.getNames = function(/*String*/item, /*String*/type, /*String?*/use, /*String?*/locale){
	// summary:
	//		Used to get localized strings from dojo.cldr for day or month names.
	//
	// item:
	//	'months' || 'days'
	// type:
	//	'wide' || 'narrow' || 'abbr' (e.g. "Monday", "Mon", or "M" respectively, in English)
	// use:
	//	'standAlone' || 'format' (default)
	// locale:
	//	override locale used to find the names

	var label;
	var lookup = dojo.date.locale._getGregorianBundle(locale);
	var props = [item, use, type];
	if(use == 'standAlone'){
		var key = props.join('-');
		label = lookup[key];
		// Fall back to 'format' flavor of name
		if(label[0] == 1){ label = undefined; } // kludge, in the absense of real aliasing support in dojo.cldr
	}
	props[1] = 'format';

	// return by copy so changes won't be made accidentally to the in-memory model
	return (label || lookup[props.join('-')]).concat(); /*Array*/
};

dojo.date.locale.isWeekend = function(/*Date?*/dateObject, /*String?*/locale){
	// summary:
	//	Determines if the date falls on a weekend, according to local custom.

	var weekend = dojo.cldr.supplemental.getWeekend(locale);
	var day = (dateObject || new Date()).getDay();
	if(weekend.end < weekend.start){
		weekend.end += 7;
		if(day < weekend.start){ day += 7; }
	}
	return day >= weekend.start && day <= weekend.end; // Boolean
};

// These are used only by format and strftime.  Do they need to be public?  Which module should they go in?

dojo.date.locale._getDayOfYear = function(/*Date*/dateObject){
	// summary: gets the day of the year as represented by dateObject
	return dojo.date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject) + 1; // Number
};

dojo.date.locale._getWeekOfYear = function(/*Date*/dateObject, /*Number*/firstDayOfWeek){
	if(arguments.length == 1){ firstDayOfWeek = 0; } // Sunday

	var firstDayOfYear = new Date(dateObject.getFullYear(), 0, 1).getDay();
	var adj = (firstDayOfYear - firstDayOfWeek + 7) % 7;
	var week = Math.floor((dojo.date.locale._getDayOfYear(dateObject) + adj - 1) / 7);

	// if year starts on the specified day, start counting weeks at 1
	if(firstDayOfYear == firstDayOfWeek){ week++; }

	return week; // Number
};

}

if(!dojo._hasResource["dijit._Calendar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Calendar"] = true;
dojo.provide("dijit._Calendar");








dojo.declare(
	"dijit._Calendar",
	[dijit._Widget, dijit._Templated],
	{
	//	
	//	summary:
	//		A simple GUI for choosing a date in the context of a monthly calendar.
	//
	//	description:
	//		A simple GUI for choosing a date in the context of a monthly calendar.
	//		This widget is used internally by other widgets and is not accessible
	//		as a standalone widget.
	//		This widget can't be used in a form because it doesn't serialize the date to an
	//		`<input>` field.  For a form element, use dijit.form.DateTextBox instead.
	//
	//		Note that the parser takes all dates attributes passed in the
	//		[RFC 3339 format](http://www.faqs.org/rfcs/rfc3339.html), e.g. `2005-06-30T08:05:00-07:00`
	//		so that they are serializable and locale-independent.
	//
	//	example:
	//	|	var calendar = new dijit._Calendar({}, dojo.byId("calendarNode"));
	//
	//	example:
	//	|	<div dojoType="dijit._Calendar"></div>
	//	
		templateString:"<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset' dojoAttachPoint=\"decrementMonth\">\n\t\t\t\t<div class=\"dijitInline dijitCalendarIncrementControl dijitCalendarDecrease\"><span dojoAttachPoint=\"decreaseArrowNode\" class=\"dijitA11ySideArrow dijitCalendarIncrementControl dijitCalendarDecreaseInner\">-</span></div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div dojoAttachPoint=\"monthLabelSpacer\" class=\"dijitCalendarMonthLabelSpacer\"></div>\n\t\t\t\t<div dojoAttachPoint=\"monthLabelNode\" class=\"dijitCalendarMonthLabel\"></div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' dojoAttachPoint=\"incrementMonth\">\n\t\t\t\t<div class=\"dijitInline dijitCalendarIncrementControl dijitCalendarIncrease\"><span dojoAttachPoint=\"increaseArrowNode\" class=\"dijitA11ySideArrow dijitCalendarIncrementControl dijitCalendarIncreaseInner\">+</span></div>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th class=\"dijitReset dijitCalendarDayLabelTemplate\"><span class=\"dijitCalendarDayLabel\"></span></th>\n\t\t</tr>\n\t</thead>\n\t<tbody dojoAttachEvent=\"onclick: _onDayClick, onmouseover: _onDayMouseOver, onmouseout: _onDayMouseOut\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t<tr class=\"dijitReset dijitCalendarWeekTemplate\">\n\t\t\t<td class=\"dijitReset dijitCalendarDateTemplate\"><span class=\"dijitCalendarDateLabel\"></span></td>\n\t\t</tr>\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\">\n\t\t\t\t<h3 class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span dojoAttachPoint=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\"></span>\n\t\t\t\t\t<span dojoAttachPoint=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\"></span>\n\t\t\t\t</h3>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\t\n",

		// value: Date
		// 	the currently selected Date
		value: new Date(),

		// dayWidth: String
		// 	How to represent the days of the week in the calendar header. See dojo.date.locale
		dayWidth: "narrow",

		setValue: function(/*Date*/ value){
			dojo.deprecated("dijit.Calendar:setValue() is deprecated.  Use attr('value', ...) instead.", "", "2.0");
			this.attr('value', value);
		},
		_setValueAttr: function(/*Date*/ value){
			// summary:
			//		Hook to make attr("value", ...) work.
			// description:
			// 		Set the current date and update the UI.  If the date is disabled, the selection will
			//		not change, but the display will change to the corresponding month.
			if(!this.value || dojo.date.compare(value, this.value)){
				value = new Date(value);
				this.displayMonth = new Date(value);
				if(!this.isDisabledDate(value, this.lang)){
					this.value = value;
					this.value.setHours(0,0,0,0);
					this.onChange(this.value);
				}
				this._populateGrid();
			}
		},

		_setText: function(node, text){
			while(node.firstChild){
				node.removeChild(node.firstChild);
			}
			node.appendChild(dojo.doc.createTextNode(text));
		},

		_populateGrid: function(){
			var month = this.displayMonth;
			month.setDate(1);
			var firstDay = month.getDay();
			var daysInMonth = dojo.date.getDaysInMonth(month);
			var daysInPreviousMonth = dojo.date.getDaysInMonth(dojo.date.add(month, "month", -1));
			var today = new Date();
			var selected = this.value;

			var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
			if(dayOffset > firstDay){ dayOffset -= 7; }

			// Iterate through dates in the calendar and fill in date numbers and style info
			dojo.query(".dijitCalendarDateTemplate", this.domNode).forEach(function(template, i){
				i += dayOffset;
				var date = new Date(month);
				var number, clazz = "dijitCalendar", adj = 0;

				if(i < firstDay){
					number = daysInPreviousMonth - firstDay + i + 1;
					adj = -1;
					clazz += "Previous";
				}else if(i >= (firstDay + daysInMonth)){
					number = i - firstDay - daysInMonth + 1;
					adj = 1;
					clazz += "Next";
				}else{
					number = i - firstDay + 1;
					clazz += "Current";
				}

				if(adj){
					date = dojo.date.add(date, "month", adj);
				}
				date.setDate(number);

				if(!dojo.date.compare(date, today, "date")){
					clazz = "dijitCalendarCurrentDate " + clazz;
				}

				if(!dojo.date.compare(date, selected, "date")){
					clazz = "dijitCalendarSelectedDate " + clazz;
				}

				if(this.isDisabledDate(date, this.lang)){
					clazz = "dijitCalendarDisabledDate " + clazz;
				}

				var clazz2 = this.getClassForDate(date, this.lang);
				if(clazz2){
					clazz = clazz2 + " " + clazz;
				}

				template.className =  clazz + "Month dijitCalendarDateTemplate";
				template.dijitDateValue = date.valueOf();
				var label = dojo.query(".dijitCalendarDateLabel", template)[0];
				this._setText(label, date.getDate());
			}, this);

			// Fill in localized month name
			var monthNames = dojo.date.locale.getNames('months', 'wide', 'standAlone', this.lang);
			this._setText(this.monthLabelNode, monthNames[month.getMonth()]);

			// Fill in localized prev/current/next years
			var y = month.getFullYear() - 1;
			var d = new Date();
			dojo.forEach(["previous", "current", "next"], function(name){
				d.setFullYear(y++);
				this._setText(this[name+"YearLabelNode"],
					dojo.date.locale.format(d, {selector:'year', locale:this.lang}));
			}, this);

			// Set up repeating mouse behavior
			var _this = this;
			var typematic = function(nodeProp, dateProp, adj){
				_this._connects.push(
					dijit.typematic.addMouseListener(_this[nodeProp], _this, function(count){
						if(count >= 0){ _this._adjustDisplay(dateProp, adj); }
					}, 0.8, 500)
				);
			};
			typematic("incrementMonth", "month", 1);
			typematic("decrementMonth", "month", -1);
			typematic("nextYearLabelNode", "year", 1);
			typematic("previousYearLabelNode", "year", -1);
		},

		goToToday: function(){
			this.attr('value', new Date());
		},

		postCreate: function(){
			this.inherited(arguments);
			
			var cloneClass = dojo.hitch(this, function(clazz, n){
				var template = dojo.query(clazz, this.domNode)[0];
	 			for(var i=0; i<n; i++){
					template.parentNode.appendChild(template.cloneNode(true));
				}
			});

			// clone the day label and calendar day templates 6 times to make 7 columns
			cloneClass(".dijitCalendarDayLabelTemplate", 6);
			cloneClass(".dijitCalendarDateTemplate", 6);

			// now make 6 week rows
			cloneClass(".dijitCalendarWeekTemplate", 5);

			// insert localized day names in the header
			var dayNames = dojo.date.locale.getNames('days', this.dayWidth, 'standAlone', this.lang);
			var dayOffset = dojo.cldr.supplemental.getFirstDayOfWeek(this.lang);
			dojo.query(".dijitCalendarDayLabel", this.domNode).forEach(function(label, i){
				this._setText(label, dayNames[(i + dayOffset) % 7]);
			}, this);

			// Fill in spacer element with all the month names (invisible) so that the maximum width will affect layout
			var monthNames = dojo.date.locale.getNames('months', 'wide', 'standAlone', this.lang);
			dojo.forEach(monthNames, function(name){
				var monthSpacer = dojo.doc.createElement("div");
				this._setText(monthSpacer, name);
				this.monthLabelSpacer.appendChild(monthSpacer);
			}, this);

			this.value = null;
			this.attr('value', new Date());
		},

		_adjustDisplay: function(/*String*/part, /*int*/amount){
			this.displayMonth = dojo.date.add(this.displayMonth, part, amount);
			this._populateGrid();
		},

		_onDayClick: function(/*Event*/evt){
			var node = evt.target;
			dojo.stopEvent(evt);
			while(!node.dijitDateValue){
				node = node.parentNode;
			}
			if(!dojo.hasClass(node, "dijitCalendarDisabledDate")){
				this.attr('value', node.dijitDateValue);
				this.onValueSelected(this.value);
			}
		},

		_onDayMouseOver: function(/*Event*/evt){
			var node = evt.target;
			if(node && (node.dijitDateValue || node == this.previousYearLabelNode || node == this.nextYearLabelNode) ){
				dojo.addClass(node, "dijitCalendarHoveredDate");
				this._currentNode = node;
			}
		},

		_onDayMouseOut: function(/*Event*/evt){
			if(!this._currentNode){ return; }
			for(var node = evt.relatedTarget; node;){
				if(node == this._currentNode){ return; }
				try{
					node = node.parentNode;
				}catch(x){
					node = null;
				}
			}
			dojo.removeClass(this._currentNode, "dijitCalendarHoveredDate");
			this._currentNode = null;
		},

		onValueSelected: function(/*Date*/date){
			// summary: a date cell was selected.  It may be the same as the previous value.
		},

		onChange: function(/*Date*/date){
			// summary: called only when the selected date has changed
		},

		isDisabledDate: function(/*Date*/dateObject, /*String?*/locale){
			// summary:
			//	May be overridden to disable certain dates in the calendar e.g. `isDisabledDate=dojo.date.locale.isWeekend`
/*=====
			return false; // Boolean
=====*/
		},

		getClassForDate: function(/*Date*/dateObject, /*String?*/locale){
			// summary:
			//  May be overridden to return CSS classes to associate with the date entry for the given dateObject,
			//  for example to indicate a holiday in specified locale.

/*=====
			return ""; // String
=====*/
		}
	}
);

}

if(!dojo._hasResource["dijit.form._DateTimeTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form._DateTimeTextBox"] = true;
dojo.provide("dijit.form._DateTimeTextBox");






/*=====
dojo.declare(
	"dijit.form._DateTimeTextBox.__Constraints",
	[dijit.form.RangeBoundTextBox.__Constraints, dojo.date.locale.__FormatOptions]
);
=====*/

dojo.declare(
	"dijit.form._DateTimeTextBox",
	dijit.form.RangeBoundTextBox,
	{
		// summary:
		//		A validating, serializable, range-bound date or time text box.
		//
		// constraints: dijit.form._DateTimeTextBox.__Constraints 

		/*=====
		constraints: {},
		======*/
		regExpGen: dojo.date.locale.regexp,
		compare: dojo.date.compare,
		format: function(/*Date*/ value, /*dojo.date.locale.__FormatOptions*/ constraints){
			//	summary: formats the value as a Date, according to constraints
			if(!value){ return ''; }
			return dojo.date.locale.format(value, constraints);
		},
		parse: function(/*String*/ value, /*dojo.date.locale.__FormatOptions*/ constraints){
			//	summary: parses the value as a Date, according to constraints
			return dojo.date.locale.parse(value, constraints) || (this._isEmpty(value)? null : undefined);
		},

		serialize: dojo.date.stamp.toISOString,

		//	value: Date
		//		The value of this widget as a JavaScript Date object.  Use attr("value") / attr("value", val) to manipulate.
		//		When passed to the parser in markup, must be specified according to `dojo.date.stamp.fromISOString`
		value: new Date(""),	// value.toString()="NaN"

		//	popupClass: String
		//		Name of the popup widget class used to select a date/time
		popupClass: "", // default is no popup = text only
		
		_selector: "",

		postMixInProperties: function(){
			//dijit.form.RangeBoundTextBox.prototype.postMixInProperties.apply(this, arguments);
			this.inherited(arguments);
			if(!this.value || this.value.toString() == dijit.form._DateTimeTextBox.prototype.value.toString()){
				this.value = null;
			}
			var constraints = this.constraints;
			constraints.selector = this._selector;
			constraints.fullYear = true; // see #5465 - always format with 4-digit years
			var fromISO = dojo.date.stamp.fromISOString;
			if(typeof constraints.min == "string"){ constraints.min = fromISO(constraints.min); }
 			if(typeof constraints.max == "string"){ constraints.max = fromISO(constraints.max); }
		},
		
		_onFocus: function(/*Event*/ evt){
			// summary: open the TimePicker popup
			this._open();
		},

		_setValueAttr: function(/*Date*/ value, /*Boolean?*/ priorityChange, /*String?*/ formattedValue){
			// summary:
			//	Sets the date on this textbox.  Note that `value` must be a Javascript Date object.
			this.inherited(arguments);
			if(this._picker){
				// #3948: fix blank date on popup only
				if(!value){value=new Date();}
				this._picker.attr('value', value);
			}
		},

		_open: function(){
			// summary:
			//	opens the TimePicker, and sets the onValueSelected value

			if(this.disabled || this.readOnly || !this.popupClass){return;}

			var textBox = this;

			if(!this._picker){
				var PopupProto=dojo.getObject(this.popupClass, false);
				this._picker = new PopupProto({
					onValueSelected: function(value){
						if(textBox._tabbingAway){
							delete textBox._tabbingAway;
						}else{
							textBox.focus(); // focus the textbox before the popup closes to avoid reopening the popup
						}
						setTimeout(dojo.hitch(textBox, "_close"), 1); // allow focus time to take

						// this will cause InlineEditBox and other handlers to do stuff so make sure it's last
						dijit.form._DateTimeTextBox.superclass._setValueAttr.call(textBox, value, true);
					},
					lang: textBox.lang,
					constraints: textBox.constraints,
					isDisabledDate: function(/*Date*/ date){
						// summary:
						// 	disables dates outside of the min/max of the _DateTimeTextBox
						var compare = dojo.date.compare;
						var constraints = textBox.constraints;
						return constraints && (constraints.min && (compare(constraints.min, date, "date") > 0) || 
							(constraints.max && compare(constraints.max, date, "date") < 0));
					}
				});
				this._picker.attr('value', this.attr('value') || new Date());
			}
			if(!this._opened){
				dijit.popup.open({
					parent: this,
					popup: this._picker,
					around: this.domNode,
					onCancel: dojo.hitch(this, this._close),
					onClose: function(){ textBox._opened=false; }
				});
				this._opened=true;
			}
			
			dojo.marginBox(this._picker.domNode,{ w:this.domNode.offsetWidth });
		},

		_close: function(){
			if(this._opened){
				dijit.popup.close(this._picker);
				this._opened=false;
			}			
		},

		_onBlur: function(){
			// summary: called magically when focus has shifted away from this widget and it's dropdown
			this._close();
			if(this._picker){
				// teardown so that constraints will be rebuilt next time (redundant reference: #6002)
				this._picker.destroy();
				delete this._picker;
			}
			this.inherited(arguments);
			// don't focus on <input>.  the user has explicitly focused on something else.
		},

		_getDisplayedValueAttr: function(){
			return this.textbox.value;
		},

		_setDisplayedValueAttr: function(/*String*/ value, /*Boolean?*/ priorityChange){
			this._setValueAttr(this.parse(value, this.constraints), priorityChange, value);
		},

		destroy: function(){
			if(this._picker){
				this._picker.destroy();
				delete this._picker;
			}
			this.inherited(arguments);
		},

		_onKeyPress: function(/*Event*/e){
			var p = this._picker, dk = dojo.keys;
			// Handle the key in the picker, if it has a handler.  If the handler
			// returns false, then don't handle any other keys.
			if(p && this._opened && p.handleKey){
				if(p.handleKey(e) === false){ return; }
			}
			if(this._opened && e.charOrCode == dk.ESCAPE && !e.shiftKey && !e.ctrlKey && !e.altKey){
				this._close();
				dojo.stopEvent(e);
			}else if(!this._opened && e.charOrCode == dk.DOWN_ARROW){
				this._open();
				dojo.stopEvent(e);
			}else if(dijit.form._DateTimeTextBox.superclass._onKeyPress.apply(this, arguments)){
				if(e.charOrCode === dk.TAB){
					this._tabbingAway = true;
				}else if(this._opened && (e.keyChar || e.charOrCode === dk.BACKSPACE || e.charOrCode == dk.DELETE)){
					// Replace the element - but do it after a delay to allow for 
					// filtering to occur
					setTimeout(dojo.hitch(this, function(){
						dijit.placeOnScreenAroundElement(p.domNode.parentNode, this.domNode, {'BL':'TL', 'TL':'BL'}, p.orient ? dojo.hitch(p, "orient") : null);
					}), 1);
				}
			}
		}
	}
);

}

if(!dojo._hasResource["dijit.form.DateTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.DateTextBox"] = true;
dojo.provide("dijit.form.DateTextBox");




dojo.declare(
	"dijit.form.DateTextBox",
	dijit.form._DateTimeTextBox,
	{
		// summary:
		//		A validating, serializable, range-bound date text box with a popup calendar

		baseClass: "dijitTextBox dijitDateTextBox",
		popupClass: "dijit._Calendar",
		_selector: "date"
	}
);

}

if(!dojo._hasResource["dijit._TimePicker"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._TimePicker"] = true;
dojo.provide("dijit._TimePicker");




/*=====
dojo.declare(
	"dijit._TimePicker.__Constraints",
	[dojo.date.locale.__FormatOptions],
	{
		// clickableIncrement: String
		//		see dijit._TimePicker.clickableIncrement
		clickableIncrement: "T00:15:00",

		// visibleIncrement: String
		//		see dijit._TimePicker.visibleIncrement
		visibleIncrement: "T01:00:00",

		// visibleRange: String
		//		see dijit._TimePicker.visibleRange
		visibleRange: "T05:00:00"
	}
);
=====*/

dojo.declare("dijit._TimePicker",
	[dijit._Widget, dijit._Templated],
	{
		//	summary:
		//		A graphical time picker.
		//		This widget is used internally by other widgets and is not accessible
		//		as a standalone widget.

		templateString:"<div id=\"widget_${id}\" class=\"dijitMenu ${baseClass}\"\n    ><div dojoAttachPoint=\"upArrow\" class=\"dijitButtonNode dijitUpArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" wairole=\"presentation\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9650;</div></div\n    ><div dojoAttachPoint=\"timeMenu,focusNode\" dojoAttachEvent=\"onclick:_onOptionSelected,onmouseover,onmouseout\"></div\n    ><div dojoAttachPoint=\"downArrow\" class=\"dijitButtonNode dijitDownArrowButton\" dojoAttachEvent=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" wairole=\"presentation\" role=\"presentation\">&nbsp;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div></div\n></div>\n",
		baseClass: "dijitTimePicker",

		// clickableIncrement: String
		//		ISO-8601 string representing the amount by which
		//		every clickable element in the time picker increases.
		//		Set in local time, without a time zone.
		//		Example: `T00:15:00` creates 15 minute increments
		//		Must divide dijit._TimePicker.visibleIncrement evenly
		clickableIncrement: "T00:15:00",

		// visibleIncrement: String
		//		ISO-8601 string representing the amount by which
		//		every element with a visible time in the time picker increases.
		//		Set in local time, without a time zone.
		//		Example: `T01:00:00` creates text in every 1 hour increment
		visibleIncrement: "T01:00:00",

		// visibleRange: String
		//		ISO-8601 string representing the range of this TimePicker.
		//		The TimePicker will only display times in this range.
		//		Example: `T05:00:00` displays 5 hours of options
		visibleRange: "T05:00:00",

		// value: String
		//		Date to display.
		//		Defaults to current time and date.
		//		Can be a Date object or an ISO-8601 string.
		//		If you specify the GMT time zone (`-01:00`),
		//		the time will be converted to the local time in the local time zone.
		//		Otherwise, the time is considered to be in the local time zone.
		//		If you specify the date and isDate is true, the date is used.
		//		Example: if your local time zone is `GMT -05:00`,
		//		`T10:00:00` becomes `T10:00:00-05:00` (considered to be local time),
		//		`T10:00:00-01:00` becomes `T06:00:00-05:00` (4 hour difference),
		//		`T10:00:00Z` becomes `T05:00:00-05:00` (5 hour difference between Zulu and local time)
		//		`yyyy-mm-ddThh:mm:ss` is the format to set the date and time
		//		Example: `2007-06-01T09:00:00`
		value: new Date(),

		_visibleIncrement:2,
		_clickableIncrement:1,
		_totalIncrements:10,

		// constraints: dijit._TimePicker.__Constraints 
		constraints:{},

		serialize: dojo.date.stamp.toISOString,
		
		// _filterString: string
		//		The string to filter by
		_filterString: "",

		setValue: function(/*Date*/ value){
			dojo.deprecated("dijit._TimePicker:setValue() is deprecated.  Use attr('value') instead.", "", "2.0");
			this.attr('value', value);
		},
		_setValueAttr: function(/*Date*/ date){
			// summary:
			//		Hook so attr('value', ...) works.
			// description:
			//		Set the value of the TimePicker.
			//		Redraws the TimePicker around the new date.

			this.value = date;
			this._showText();
		},

		onOpen: function(best){
			if(this._beenOpened && this.domNode.parentNode){
				// We've been opened before - so set our filter to to the
				// currently-displayed value (or empty string if it's already
				// valid)
				var p = dijit.byId(this.domNode.parentNode.dijitPopupParent);
				if(p){
					var val = p.getDisplayedValue();
					if(val && !p.parse(val, p.constraints)){
						this._filterString = val;
					}else{
						this._filterString = "";
					}
					this._showText();
				}
			}
			this._beenOpened = true;
		},

		isDisabledDate: function(/*Date*/dateObject, /*String?*/locale){
			// summary:
			//	May be overridden to disable certain dates in the TimePicker e.g. `isDisabledDate=dojo.date.locale.isWeekend`
			return false; // Boolean
		},

		_getFilteredNodes: function(/*number*/start, /*number*/maxNum, /*Boolean*/before){
			// summary:
			//  Returns an array of nodes with the filter applied.  At most maxNum nodes
			//  will be returned - but fewer may be returned as well.  If the
			//  before parameter is set to true, then it will return the elements
			//  before the given index
			var nodes = [], n, i = start, max = this._maxIncrement + Math.abs(i),
				chk = before?-1:1, dec = before?1:0, inc = before?0:1;
			do{
				i = i - dec;
				n = this._createOption(i);
				if(n){nodes.push(n);}
				i = i + inc;
			}while(nodes.length < maxNum && (i*chk) < max);
			if(before){ nodes.reverse(); }
			return nodes; 
		},

		_showText:function(){
			this.timeMenu.innerHTML = "";
			var fromIso = dojo.date.stamp.fromISOString;
			this._clickableIncrementDate=fromIso(this.clickableIncrement);
			this._visibleIncrementDate=fromIso(this.visibleIncrement);
			this._visibleRangeDate=fromIso(this.visibleRange);
			// get the value of the increments and the range in seconds (since 00:00:00) to find out how many divs to create
			var sinceMidnight = function(/*Date*/ date){
				return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
			};

			var clickableIncrementSeconds = sinceMidnight(this._clickableIncrementDate);
			var visibleIncrementSeconds = sinceMidnight(this._visibleIncrementDate);
			var visibleRangeSeconds = sinceMidnight(this._visibleRangeDate);

			// round reference date to previous visible increment
			var time = this.value.getTime();
			this._refDate = new Date(time - time % (visibleIncrementSeconds*1000));
			this._refDate.setFullYear(1970,0,1); // match parse defaults

			// assume clickable increment is the smallest unit
			this._clickableIncrement = 1;
			// divide the visible range by the clickable increment to get the number of divs to create
			// example: 10:00:00/00:15:00 -> display 40 divs
			this._totalIncrements = visibleRangeSeconds / clickableIncrementSeconds;
			// divide the visible increments by the clickable increments to get how often to display the time inline
			// example: 01:00:00/00:15:00 -> display the time every 4 divs
			this._visibleIncrement = visibleIncrementSeconds / clickableIncrementSeconds;
			// divide the number of seconds in a day by the clickable increment in seconds to get the
			// absolute max number of increments.
			this._maxIncrement = (60 * 60 * 24) / clickableIncrementSeconds;

			// find the nodes we should display based on our filter
			var before = this._getFilteredNodes(0, this._totalIncrements >> 1, true);
			var after = this._getFilteredNodes(0, this._totalIncrements >> 1, false);
			if(before.length < this._totalIncrements >> 1){
				before = before.slice(before.length / 2);
				after = after.slice(0, after.length / 2);
			}
			dojo.forEach(before.concat(after), function(n){this.timeMenu.appendChild(n);}, this);
			
			// TODO:
			// I commented this out because it
			// causes problems for a TimeTextBox in a Dialog, or as the editor of an InlineEditBox,
			// because the timeMenu node isn't visible yet. -- Bill (Bug #????)
			// dijit.focus(this.timeMenu);
		},

		postCreate:function(){
			// instantiate constraints
			if(this.constraints===dijit._TimePicker.prototype.constraints){
				this.constraints={};
			}

			// brings in visibleRange, increments, etc.
			dojo.mixin(this, this.constraints);

			// dojo.date.locale needs the lang in the constraints as locale
			if(!this.constraints.locale){
				this.constraints.locale=this.lang;
			}

			// assign typematic mouse listeners to the arrow buttons
			this.connect(this.timeMenu, dojo.isIE ? "onmousewheel" : 'DOMMouseScroll', "_mouseWheeled");
			var _this = this;
			var typematic = function(){
				_this._connects.push(
					dijit.typematic.addMouseListener.apply(null, arguments)
				);
			};
			typematic(this.upArrow,this,this._onArrowUp, 0.8, 500);
			typematic(this.downArrow,this,this._onArrowDown, 0.8, 500);
			
			// Connect some callback functions to the hover event of the arrows
			var triggerFx = function(cb){
				return function(cnt){
					// don't run on the first firing
					if(cnt > 0){cb.call(this, arguments);}
				};
			};
			var hoverFx = function(node, cb){
				return function(e){
					dojo.stopEvent(e);
					dijit.typematic.trigger(e, this, node, triggerFx(cb), node, 0.85, 250);
				};
			};
			this.connect(this.upArrow, "onmouseover", hoverFx(this.upArrow, this._onArrowUp));
			this.connect(this.downArrow, "onmouseover", hoverFx(this.downArrow, this._onArrowDown));
			
			this.inherited(arguments);
		},

		_buttonMouse:function(/*Event*/ e){
			dojo.toggleClass(e.currentTarget, "dijitButtonNodeHover", e.type == "mouseover");
		},
		
		_createOption:function(/*Number*/ index){
			// summary: creates a clickable time option
			var date = new Date(this._refDate);
			var incrementDate = this._clickableIncrementDate;
			date.setHours(date.getHours() + incrementDate.getHours() * index,
				date.getMinutes() + incrementDate.getMinutes() * index,
				date.getSeconds() + incrementDate.getSeconds() * index);
			var dateString = dojo.date.locale.format(date, this.constraints);
			if(this._filterString && dateString.toLowerCase().indexOf(this._filterString) !== 0){
				// Doesn't match the filter - return null
				return null;
			}

			var div = dojo.doc.createElement("div");
			div.date = date;
			div.index = index;
			var innerDiv = dojo.doc.createElement('div');
			dojo.addClass(div,this.baseClass+"Item");
			dojo.addClass(innerDiv,this.baseClass+"ItemInner");
			innerDiv.innerHTML = dateString;
			div.appendChild(innerDiv);

			if(index%this._visibleIncrement<1 && index%this._visibleIncrement>-1){
				dojo.addClass(div, this.baseClass+"Marker");
			}else if(!(index%this._clickableIncrement)){
				dojo.addClass(div, this.baseClass+"Tick");
			}
						
			if(this.isDisabledDate(date)){
				// set disabled
				dojo.addClass(div, this.baseClass+"ItemDisabled");
			}
			if(!dojo.date.compare(this.value, date, this.constraints.selector)){
				div.selected = true;
				dojo.addClass(div, this.baseClass+"ItemSelected");
				if(dojo.hasClass(div, this.baseClass+"Marker")){
					dojo.addClass(div, this.baseClass+"MarkerSelected");
				}else{
					dojo.addClass(div, this.baseClass+"TickSelected");
				}
			}
			return div;
		},

		_onOptionSelected:function(/*Object*/ tgt){
			var tdate = tgt.target.date || tgt.target.parentNode.date;			
			if(!tdate || this.isDisabledDate(tdate)){ return; }
			this._highlighted_option = null;
			this.attr('value', tdate);
			this.onValueSelected(tdate);
		},

		onValueSelected:function(value){
		},


		_highlightOption: function(/*node*/node, /*Boolean*/ highlight){
			if(!node){return;}
			if(highlight){
				if(this._highlighted_option){
					this._highlightOption(this._highlighted_option, false);
				}
				this._highlighted_option = node;
			}else if(this._highlighted_option !== node){
				return;
			}else{
				this._highlighted_option = null;
			}
			dojo.toggleClass(node, this.baseClass+"ItemHover", highlight);
			if(dojo.hasClass(node, this.baseClass+"Marker")){
				dojo.toggleClass(node, this.baseClass+"MarkerHover", highlight);
			}else{
				dojo.toggleClass(node, this.baseClass+"TickHover", highlight);
			}
		},
		
		onmouseover:function(/*Event*/ e){
			var tgr = (e.target.parentNode === this.timeMenu) ? e.target : e.target.parentNode;			
			// if we aren't targeting an item, then we return
			if(!dojo.hasClass(tgr, this.baseClass+"Item")){return;}
			this._highlightOption(tgr, true);
		},

		onmouseout:function(/*Event*/ e){
			var tgr = (e.target.parentNode === this.timeMenu) ? e.target : e.target.parentNode;
			this._highlightOption(tgr, false);
		},

		_mouseWheeled:function(/*Event*/e){
			// summary: handle the mouse wheel listener
			dojo.stopEvent(e);
			// we're not _measuring_ the scroll amount, just direction
			var scrollAmount = (dojo.isIE ? e.wheelDelta : -e.detail);
			this[(scrollAmount>0 ? "_onArrowUp" : "_onArrowDown")](); // yes, we're making a new dom node every time you mousewheel, or click
		},

		_onArrowUp:function(){
			// summary: remove the bottom time and add one to the top
			var index = this.timeMenu.childNodes[0].index;
			var divs = this._getFilteredNodes(index, 1, true);
			if(divs.length){
				this.timeMenu.removeChild(this.timeMenu.childNodes[this.timeMenu.childNodes.length - 1]);
				this.timeMenu.insertBefore(divs[0], this.timeMenu.childNodes[0]);
			}
		},

		_onArrowDown:function(){
			// summary: remove the top time and add one to the bottom
			var index = this.timeMenu.childNodes[this.timeMenu.childNodes.length - 1].index + 1;
			var divs = this._getFilteredNodes(index, 1, false);
			if(divs.length){
				this.timeMenu.removeChild(this.timeMenu.childNodes[0]);
				this.timeMenu.appendChild(divs[0]);
			}
		},

		handleKey:function(/*Event*/e){
			var dk = dojo.keys;
			if(e.keyChar || e.charOrCode === dk.BACKSPACE || e.charOrCode == dk.DELETE){
				// Set a timeout to kick off our filter
				setTimeout(dojo.hitch(this, function(){
					this._filterString = e.target.value.toLowerCase();
					this._showText();
				}),1);
			}else if(e.charOrCode == dk.DOWN_ARROW || e.charOrCode == dk.UP_ARROW){
				dojo.stopEvent(e);
				// Figure out which option to highlight now and then highlight it
				if(this._highlighted_option && !this._highlighted_option.parentNode){
					this._highlighted_option = null;
				}
				var timeMenu = this.timeMenu, 
					tgt = this._highlighted_option || dojo.query("." + this.baseClass + "ItemSelected", timeMenu)[0];
				if(!tgt){
					tgt = timeMenu.childNodes[0];
				}else if(timeMenu.childNodes.length){
					if(e.charOrCode == dk.DOWN_ARROW && !tgt.nextSibling){
						this._onArrowDown();
					}else if(e.charOrCode == dk.UP_ARROW && !tgt.previousSibling){
						this._onArrowUp();
					}
					if(e.charOrCode == dk.DOWN_ARROW){
						tgt = tgt.nextSibling;
					}else{
						tgt = tgt.previousSibling;
					}
				}
				this._highlightOption(tgt, true);
			}else if(this._highlighted_option && (e.charOrCode == dk.ENTER || e.charOrCode === dk.TAB)){
				// Accept the currently-highlighted option as the value
				if(e.charOrCode == dk.ENTER){dojo.stopEvent(e);}
				setTimeout(dojo.hitch(this, function(){
					this._onOptionSelected({target: this._highlighted_option});
				}),1);
			}
		}
	}
);

}

if(!dojo._hasResource["dijit.form.TimeTextBox"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.TimeTextBox"] = true;
dojo.provide("dijit.form.TimeTextBox");




/*=====
dojo.declare(
	"dijit.form.TimeTextBox.__Constraints",
	[dijit.form._DateTimeTextBox.__Constraints, dijit._TimePicker.__Constraints]
);
=====*/

dojo.declare(
	"dijit.form.TimeTextBox",
	dijit.form._DateTimeTextBox,
	{
		// summary:
		//		A validating, serializable, range-bound time text box with a popup time picker

		baseClass: "dijitTextBox dijitTimeTextBox",
		popupClass: "dijit._TimePicker",
		_selector: "time"

/*=====
		,
		// constraints: dijit.form.TimeTextBox.__Constraints 
		constraints:{}
=====*/
	}
);

}

if(!dojo._hasResource["dojo.dnd.common"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.common"] = true;
dojo.provide("dojo.dnd.common");

dojo.dnd._isMac = navigator.appVersion.indexOf("Macintosh") >= 0;
dojo.dnd._copyKey = dojo.dnd._isMac ? "metaKey" : "ctrlKey";

dojo.dnd.getCopyKeyState = function(e) {
	// summary: abstracts away the difference between selection on Mac and PC,
	//	and returns the state of the "copy" key to be pressed.
	// e: Event: mouse event
	return e[dojo.dnd._copyKey];	// Boolean
};

dojo.dnd._uniqueId = 0;
dojo.dnd.getUniqueId = function(){
	// summary: returns a unique string for use with any DOM element
	var id;
	do{
		id = dojo._scopeName + "Unique" + (++dojo.dnd._uniqueId);
	}while(dojo.byId(id));
	return id;
};

dojo.dnd._empty = {};

dojo.dnd.isFormElement = function(/*Event*/ e){
	// summary: returns true, if user clicked on a form element
	var t = e.target;
	if(t.nodeType == 3 /*TEXT_NODE*/){
		t = t.parentNode;
	}
	return " button textarea input select option ".indexOf(" " + t.tagName.toLowerCase() + " ") >= 0;	// Boolean
};

}

if(!dojo._hasResource["dojo.dnd.autoscroll"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.autoscroll"] = true;
dojo.provide("dojo.dnd.autoscroll");

dojo.dnd.getViewport = function(){
	// summary: returns a viewport size (visible part of the window)

	// FIXME: need more docs!!
	var d = dojo.doc, dd = d.documentElement, w = window, b = dojo.body();
	if(dojo.isMozilla){
		return {w: dd.clientWidth, h: w.innerHeight};	// Object
	}else if(!dojo.isOpera && w.innerWidth){
		return {w: w.innerWidth, h: w.innerHeight};		// Object
	}else if (!dojo.isOpera && dd && dd.clientWidth){
		return {w: dd.clientWidth, h: dd.clientHeight};	// Object
	}else if (b.clientWidth){
		return {w: b.clientWidth, h: b.clientHeight};	// Object
	}
	return null;	// Object
};

dojo.dnd.V_TRIGGER_AUTOSCROLL = 32;
dojo.dnd.H_TRIGGER_AUTOSCROLL = 32;

dojo.dnd.V_AUTOSCROLL_VALUE = 16;
dojo.dnd.H_AUTOSCROLL_VALUE = 16;

dojo.dnd.autoScroll = function(e){
	// summary:
	//		a handler for onmousemove event, which scrolls the window, if
	//		necesary
	// e: Event:
	//		onmousemove event

	// FIXME: needs more docs!
	var v = dojo.dnd.getViewport(), dx = 0, dy = 0;
	if(e.clientX < dojo.dnd.H_TRIGGER_AUTOSCROLL){
		dx = -dojo.dnd.H_AUTOSCROLL_VALUE;
	}else if(e.clientX > v.w - dojo.dnd.H_TRIGGER_AUTOSCROLL){
		dx = dojo.dnd.H_AUTOSCROLL_VALUE;
	}
	if(e.clientY < dojo.dnd.V_TRIGGER_AUTOSCROLL){
		dy = -dojo.dnd.V_AUTOSCROLL_VALUE;
	}else if(e.clientY > v.h - dojo.dnd.V_TRIGGER_AUTOSCROLL){
		dy = dojo.dnd.V_AUTOSCROLL_VALUE;
	}
	window.scrollBy(dx, dy);
};

dojo.dnd._validNodes = {"div": 1, "p": 1, "td": 1};
dojo.dnd._validOverflow = {"auto": 1, "scroll": 1};

dojo.dnd.autoScrollNodes = function(e){
	// summary:
	//		a handler for onmousemove event, which scrolls the first avaialble
	//		Dom element, it falls back to dojo.dnd.autoScroll()
	// e: Event:
	//		onmousemove event

	// FIXME: needs more docs!
	for(var n = e.target; n;){
		if(n.nodeType == 1 && (n.tagName.toLowerCase() in dojo.dnd._validNodes)){
			var s = dojo.getComputedStyle(n);
			if(s.overflow.toLowerCase() in dojo.dnd._validOverflow){
				var b = dojo._getContentBox(n, s), t = dojo._abs(n, true);
				//console.debug(b.l, b.t, t.x, t.y, n.scrollLeft, n.scrollTop);
				var w = Math.min(dojo.dnd.H_TRIGGER_AUTOSCROLL, b.w / 2), 
					h = Math.min(dojo.dnd.V_TRIGGER_AUTOSCROLL, b.h / 2),
					rx = e.pageX - t.x, ry = e.pageY - t.y, dx = 0, dy = 0;
				if(dojo.isSafari || dojo.isOpera){
					// FIXME: this code should not be here, it should be taken into account 
					// either by the event fixing code, or the dojo._abs()
					// FIXME: this code doesn't work on Opera 9.5 Beta
					rx += dojo.body().scrollLeft, ry += dojo.body().scrollTop;
				}
				if(rx > 0 && rx < b.w){
					if(rx < w){
						dx = -w;
					}else if(rx > b.w - w){
						dx = w;
					}
				}
				//console.debug("ry =", ry, "b.h =", b.h, "h =", h);
				if(ry > 0 && ry < b.h){
					if(ry < h){
						dy = -h;
					}else if(ry > b.h - h){
						dy = h;
					}
				}
				var oldLeft = n.scrollLeft, oldTop = n.scrollTop;
				n.scrollLeft = n.scrollLeft + dx;
				n.scrollTop  = n.scrollTop  + dy;
				if(oldLeft != n.scrollLeft || oldTop != n.scrollTop){ return; }
			}
		}
		try{
			n = n.parentNode;
		}catch(x){
			n = null;
		}
	}
	dojo.dnd.autoScroll(e);
};

}

if(!dojo._hasResource["dojo.dnd.Mover"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Mover"] = true;
dojo.provide("dojo.dnd.Mover");




dojo.declare("dojo.dnd.Mover", null, {
	constructor: function(node, e, host){
		// summary: an object, which makes a node follow the mouse, 
		//	used as a default mover, and as a base class for custom movers
		// node: Node: a node (or node's id) to be moved
		// e: Event: a mouse event, which started the move;
		//	only pageX and pageY properties are used
		// host: Object?: object which implements the functionality of the move,
		//	 and defines proper events (onMoveStart and onMoveStop)
		this.node = dojo.byId(node);
		this.marginBox = {l: e.pageX, t: e.pageY};
		this.mouseButton = e.button;
		var h = this.host = host, d = node.ownerDocument, 
			firstEvent = dojo.connect(d, "onmousemove", this, "onFirstMove");
		this.events = [
			dojo.connect(d, "onmousemove", this, "onMouseMove"),
			dojo.connect(d, "onmouseup",   this, "onMouseUp"),
			// cancel text selection and text dragging
			dojo.connect(d, "ondragstart",   dojo.stopEvent),
			dojo.connect(d.body, "onselectstart", dojo.stopEvent),
			firstEvent
		];
		// notify that the move has started
		if(h && h.onMoveStart){
			h.onMoveStart(this);
		}
	},
	// mouse event processors
	onMouseMove: function(e){
		// summary: event processor for onmousemove
		// e: Event: mouse event
		dojo.dnd.autoScroll(e);
		var m = this.marginBox;
		this.host.onMove(this, {l: m.l + e.pageX, t: m.t + e.pageY});
		dojo.stopEvent(e);
	},
	onMouseUp: function(e){
		if(dojo.isSafari && dojo.dnd._isMac && this.mouseButton == 2 ? 
				e.button == 0 : this.mouseButton == e.button){
			this.destroy();
		}
		dojo.stopEvent(e);
	},
	// utilities
	onFirstMove: function(){
		// summary: makes the node absolute; it is meant to be called only once
		var s = this.node.style, l, t, h = this.host;
		switch(s.position){
			case "relative":
			case "absolute":
				// assume that left and top values are in pixels already
				l = Math.round(parseFloat(s.left));
				t = Math.round(parseFloat(s.top));
				break;
			default:
				s.position = "absolute";	// enforcing the absolute mode
				var m = dojo.marginBox(this.node);
				// event.pageX/pageY (which we used to generate the initial
				// margin box) includes padding and margin set on the body.
				// However, setting the node's position to absolute and then
				// doing dojo.marginBox on it *doesn't* take that additional
				// space into account - so we need to subtract the combined
				// padding and margin.  We use getComputedStyle and
				// _getMarginBox/_getContentBox to avoid the extra lookup of
				// the computed style. 
				var b = dojo.doc.body;
				var bs = dojo.getComputedStyle(b);
				var bm = dojo._getMarginBox(b, bs);
				var bc = dojo._getContentBox(b, bs);
				l = m.l - (bc.l - bm.l);
				t = m.t - (bc.t - bm.t);
				break;
		}
		this.marginBox.l = l - this.marginBox.l;
		this.marginBox.t = t - this.marginBox.t;
		if(h && h.onFirstMove){
			h.onFirstMove(this);
		}
		dojo.disconnect(this.events.pop());
	},
	destroy: function(){
		// summary: stops the move, deletes all references, so the object can be garbage-collected
		dojo.forEach(this.events, dojo.disconnect);
		// undo global settings
		var h = this.host;
		if(h && h.onMoveStop){
			h.onMoveStop(this);
		}
		// destroy objects
		this.events = this.node = this.host = null;
	}
});

}

if(!dojo._hasResource["dojo.dnd.Moveable"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.Moveable"] = true;
dojo.provide("dojo.dnd.Moveable");



dojo.declare("dojo.dnd.Moveable", null, {
	// object attributes (for markup)
	handle: "",
	delay: 0,
	skip: false,
	
	constructor: function(node, params){
		// summary: an object, which makes a node moveable
		// node: Node: a node (or node's id) to be moved
		// params: Object: an optional object with additional parameters;
		//	following parameters are recognized:
		//		handle: Node: a node (or node's id), which is used as a mouse handle
		//			if omitted, the node itself is used as a handle
		//		delay: Number: delay move by this number of pixels
		//		skip: Boolean: skip move of form elements
		//		mover: Object: a constructor of custom Mover
		this.node = dojo.byId(node);
		if(!params){ params = {}; }
		this.handle = params.handle ? dojo.byId(params.handle) : null;
		if(!this.handle){ this.handle = this.node; }
		this.delay = params.delay > 0 ? params.delay : 0;
		this.skip  = params.skip;
		this.mover = params.mover ? params.mover : dojo.dnd.Mover;
		this.events = [
			dojo.connect(this.handle, "onmousedown", this, "onMouseDown"),
			// cancel text selection and text dragging
			dojo.connect(this.handle, "ondragstart",   this, "onSelectStart"),
			dojo.connect(this.handle, "onselectstart", this, "onSelectStart")
		];
	},

	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.Moveable(node, params);
	},

	// methods
	destroy: function(){
		// summary: stops watching for possible move, deletes all references, so the object can be garbage-collected
		dojo.forEach(this.events, dojo.disconnect);
		this.events = this.node = this.handle = null;
	},
	
	// mouse event processors
	onMouseDown: function(e){
		// summary: event processor for onmousedown, creates a Mover for the node
		// e: Event: mouse event
		if(this.skip && dojo.dnd.isFormElement(e)){ return; }
		if(this.delay){
			this.events.push(
				dojo.connect(this.handle, "onmousemove", this, "onMouseMove"),
				dojo.connect(this.handle, "onmouseup", this, "onMouseUp")
			);
			this._lastX = e.pageX;
			this._lastY = e.pageY;
		}else{
			this.onDragDetected(e);
		}
		dojo.stopEvent(e);
	},
	onMouseMove: function(e){
		// summary: event processor for onmousemove, used only for delayed drags
		// e: Event: mouse event
		if(Math.abs(e.pageX - this._lastX) > this.delay || Math.abs(e.pageY - this._lastY) > this.delay){
			this.onMouseUp(e);
			this.onDragDetected(e);
		}
		dojo.stopEvent(e);
	},
	onMouseUp: function(e){
		// summary: event processor for onmouseup, used only for delayed drags
		// e: Event: mouse event
		for(var i = 0; i < 2; ++i){
			dojo.disconnect(this.events.pop());
		}
		dojo.stopEvent(e);
	},
	onSelectStart: function(e){
		// summary: event processor for onselectevent and ondragevent
		// e: Event: mouse event
		if(!this.skip || !dojo.dnd.isFormElement(e)){
			dojo.stopEvent(e);
		}
	},
	
	// local events
	onDragDetected: function(/* Event */ e){
		// summary: called when the drag is detected,
		// responsible for creation of the mover
		new this.mover(this.node, e, this);
	},
	onMoveStart: function(/* dojo.dnd.Mover */ mover){
		// summary: called before every move operation
		dojo.publish("/dnd/move/start", [mover]);
		dojo.addClass(dojo.body(), "dojoMove"); 
		dojo.addClass(this.node, "dojoMoveItem"); 
	},
	onMoveStop: function(/* dojo.dnd.Mover */ mover){
		// summary: called after every move operation
		dojo.publish("/dnd/move/stop", [mover]);
		dojo.removeClass(dojo.body(), "dojoMove");
		dojo.removeClass(this.node, "dojoMoveItem");
	},
	onFirstMove: function(/* dojo.dnd.Mover */ mover){
		// summary: called during the very first move notification,
		//	can be used to initialize coordinates, can be overwritten.
		
		// default implementation does nothing
	},
	onMove: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary: called during every move notification,
		//	should actually move the node, can be overwritten.
		this.onMoving(mover, leftTop);
		var s = mover.node.style;
		s.left = leftTop.l + "px";
		s.top  = leftTop.t + "px";
		this.onMoved(mover, leftTop);
	},
	onMoving: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary: called before every incremental move,
		//	can be overwritten.
		
		// default implementation does nothing
	},
	onMoved: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary: called after every incremental move,
		//	can be overwritten.
		
		// default implementation does nothing
	}
});

}

if(!dojo._hasResource["dojo.dnd.move"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.move"] = true;
dojo.provide("dojo.dnd.move");




dojo.declare("dojo.dnd.move.constrainedMoveable", dojo.dnd.Moveable, {
	// object attributes (for markup)
	constraints: function(){},
	within: false,
	
	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.move.constrainedMoveable(node, params);
	},

	constructor: function(node, params){
		// summary: an object, which makes a node moveable
		// node: Node: a node (or node's id) to be moved
		// params: Object: an optional object with additional parameters;
		//	following parameters are recognized:
		//		constraints: Function: a function, which calculates a constraint box,
		//			it is called in a context of the moveable object.
		//		within: Boolean: restrict move within boundaries.
		//	the rest is passed to the base class
		if(!params){ params = {}; }
		this.constraints = params.constraints;
		this.within = params.within;
	},
	onFirstMove: function(/* dojo.dnd.Mover */ mover){
		// summary: called during the very first move notification,
		//	can be used to initialize coordinates, can be overwritten.
		var c = this.constraintBox = this.constraints.call(this, mover);
		c.r = c.l + c.w;
		c.b = c.t + c.h;
		if(this.within){
			var mb = dojo.marginBox(mover.node);
			c.r -= mb.w;
			c.b -= mb.h;
		}
	},
	onMove: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
		// summary: called during every move notification,
		//	should actually move the node, can be overwritten.
		var c = this.constraintBox, s = mover.node.style;
		s.left = (leftTop.l < c.l ? c.l : c.r < leftTop.l ? c.r : leftTop.l) + "px";
		s.top  = (leftTop.t < c.t ? c.t : c.b < leftTop.t ? c.b : leftTop.t) + "px";
	}
});

dojo.declare("dojo.dnd.move.boxConstrainedMoveable", dojo.dnd.move.constrainedMoveable, {
	// object attributes (for markup)
	box: {},
	
	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.move.boxConstrainedMoveable(node, params);
	},

	constructor: function(node, params){
		// summary: an object, which makes a node moveable
		// node: Node: a node (or node's id) to be moved
		// params: Object: an optional object with additional parameters;
		//	following parameters are recognized:
		//		box: Object: a constraint box
		//	the rest is passed to the base class
		var box = params && params.box;
		this.constraints = function(){ return box; };
	}
});

dojo.declare("dojo.dnd.move.parentConstrainedMoveable", dojo.dnd.move.constrainedMoveable, {
	// object attributes (for markup)
	area: "content",

	// markup methods
	markupFactory: function(params, node){
		return new dojo.dnd.move.parentConstrainedMoveable(node, params);
	},

	constructor: function(node, params){
		// summary: an object, which makes a node moveable
		// node: Node: a node (or node's id) to be moved
		// params: Object: an optional object with additional parameters;
		//	following parameters are recognized:
		//		area: String: a parent's area to restrict the move,
		//			can be "margin", "border", "padding", or "content".
		//	the rest is passed to the base class
		var area = params && params.area;
		this.constraints = function(){
			var n = this.node.parentNode, 
				s = dojo.getComputedStyle(n), 
				mb = dojo._getMarginBox(n, s);
			if(area == "margin"){
				return mb;	// Object
			}
			var t = dojo._getMarginExtents(n, s);
			mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
			if(area == "border"){
				return mb;	// Object
			}
			t = dojo._getBorderExtents(n, s);
			mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
			if(area == "padding"){
				return mb;	// Object
			}
			t = dojo._getPadExtents(n, s);
			mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
			return mb;	// Object
		};
	}
});

// WARNING: below are obsolete objects, instead of custom movers use custom moveables (above)

dojo.dnd.move.constrainedMover = function(fun, within){
	// summary: returns a constrained version of dojo.dnd.Mover
	// description: this function produces n object, which will put a constraint on 
	//	the margin box of dragged object in absolute coordinates
	// fun: Function: called on drag, and returns a constraint box
	// within: Boolean: if true, constraints the whole dragged object withtin the rectangle, 
	//	otherwise the constraint is applied to the left-top corner
	dojo.deprecated("dojo.dnd.move.constrainedMover, use dojo.dnd.move.constrainedMoveable instead");
	var mover = function(node, e, notifier){
		dojo.dnd.Mover.call(this, node, e, notifier);
	};
	dojo.extend(mover, dojo.dnd.Mover.prototype);
	dojo.extend(mover, {
		onMouseMove: function(e){
			// summary: event processor for onmousemove
			// e: Event: mouse event
			dojo.dnd.autoScroll(e);
			var m = this.marginBox, c = this.constraintBox,
				l = m.l + e.pageX, t = m.t + e.pageY;
			l = l < c.l ? c.l : c.r < l ? c.r : l;
			t = t < c.t ? c.t : c.b < t ? c.b : t;
			this.host.onMove(this, {l: l, t: t});
		},
		onFirstMove: function(){
			// summary: called once to initialize things; it is meant to be called only once
			dojo.dnd.Mover.prototype.onFirstMove.call(this);
			var c = this.constraintBox = fun.call(this);
			c.r = c.l + c.w;
			c.b = c.t + c.h;
			if(within){
				var mb = dojo.marginBox(this.node);
				c.r -= mb.w;
				c.b -= mb.h;
			}
		}
	});
	return mover;	// Object
};

dojo.dnd.move.boxConstrainedMover = function(box, within){
	// summary: a specialization of dojo.dnd.constrainedMover, which constrains to the specified box
	// box: Object: a constraint box (l, t, w, h)
	// within: Boolean: if true, constraints the whole dragged object withtin the rectangle, 
	//	otherwise the constraint is applied to the left-top corner
	dojo.deprecated("dojo.dnd.move.boxConstrainedMover, use dojo.dnd.move.boxConstrainedMoveable instead");
	return dojo.dnd.move.constrainedMover(function(){ return box; }, within);	// Object
};

dojo.dnd.move.parentConstrainedMover = function(area, within){
	// summary: a specialization of dojo.dnd.constrainedMover, which constrains to the parent node
	// area: String: "margin" to constrain within the parent's margin box, "border" for the border box,
	//	"padding" for the padding box, and "content" for the content box; "content" is the default value.
	// within: Boolean: if true, constraints the whole dragged object withtin the rectangle, 
	//	otherwise the constraint is applied to the left-top corner
	dojo.deprecated("dojo.dnd.move.parentConstrainedMover, use dojo.dnd.move.parentConstrainedMoveable instead");
	var fun = function(){
		var n = this.node.parentNode, 
			s = dojo.getComputedStyle(n), 
			mb = dojo._getMarginBox(n, s);
		if(area == "margin"){
			return mb;	// Object
		}
		var t = dojo._getMarginExtents(n, s);
		mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
		if(area == "border"){
			return mb;	// Object
		}
		t = dojo._getBorderExtents(n, s);
		mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
		if(area == "padding"){
			return mb;	// Object
		}
		t = dojo._getPadExtents(n, s);
		mb.l += t.l, mb.t += t.t, mb.w -= t.w, mb.h -= t.h;
		return mb;	// Object
	};
	return dojo.dnd.move.constrainedMover(fun, within);	// Object
};

// patching functions one level up for compatibility

dojo.dnd.constrainedMover = dojo.dnd.move.constrainedMover;
dojo.dnd.boxConstrainedMover = dojo.dnd.move.boxConstrainedMover;
dojo.dnd.parentConstrainedMover = dojo.dnd.move.parentConstrainedMover;

}

if(!dojo._hasResource["dijit.form.Slider"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.Slider"] = true;
dojo.provide("dijit.form.Slider");








dojo.declare(
	"dijit.form.HorizontalSlider",
	[dijit.form._FormValueWidget, dijit._Container],
{
	// summary
	//	A form widget that allows one to select a value with a horizontally draggable image

	templateString:"<table class=\"dijit dijitReset dijitSlider\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" dojoAttachEvent=\"onkeypress:_onKeyPress\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t\t><td dojoAttachPoint=\"containerNode,topDecoration\" class=\"dijitReset\" style=\"text-align:center;width:100%;\"></td\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH\"\n\t\t\t><div class=\"dijitSliderDecrementIconH\" tabIndex=\"-1\" style=\"display:none\" dojoAttachPoint=\"decrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderLeftBumper dijitSliderLeftBumper\" dojoAttachEvent=\"onclick:_onClkDecBumper\"></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><input dojoAttachPoint=\"valueNode\" type=\"hidden\" name=\"${name}\"\n\t\t\t/><div class=\"dijitReset dijitSliderBarContainerH\" waiRole=\"presentation\" dojoAttachPoint=\"sliderBarContainer\"\n\t\t\t\t><div waiRole=\"presentation\" dojoAttachPoint=\"progressBar\" class=\"dijitSliderBar dijitSliderBarH dijitSliderProgressBar dijitSliderProgressBarH\" dojoAttachEvent=\"onclick:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable dijitSliderMoveableH\" \n\t\t\t\t\t\t><div dojoAttachPoint=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleH\" dojoAttachEvent=\"onmousedown:_onHandleClick\" waiRole=\"slider\" valuemin=\"${minimum}\" valuemax=\"${maximum}\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t\t><div waiRole=\"presentation\" dojoAttachPoint=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarH dijitSliderRemainingBar dijitSliderRemainingBarH\" dojoAttachEvent=\"onclick:_onBarClick\"></div\n\t\t\t></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderRightBumper dijitSliderRightBumper\" dojoAttachEvent=\"onclick:_onClkIncBumper\"></div\n\t\t></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH\" style=\"right:0px;\"\n\t\t\t><div class=\"dijitSliderIncrementIconH\" tabIndex=\"-1\" style=\"display:none\" dojoAttachPoint=\"incrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t\t><td dojoAttachPoint=\"containerNode,bottomDecoration\" class=\"dijitReset\" style=\"text-align:center;\"></td\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t></tr\n></table>\n",
	value: 0,

	// showButtons: boolean
	//	Show increment/decrement buttons at the ends of the slider?
	showButtons: true,

	// minimum:: integer
	//	The minimum value allowed.
	minimum: 0,

	// maximum: integer
	//	The maximum allowed value.
	maximum: 100,

	// discreteValues: integer
	//	The maximum allowed values dispersed evenly between minimum and maximum (inclusive).
	discreteValues: Infinity,

	// pageIncrement: integer
	//	The amount of change via pageup/down
	pageIncrement: 2,

	// clickSelect: boolean
	//	If clicking the progress bar changes the value or not
	clickSelect: true,

	// slideDuration: Number
	//	The time in ms to take to animate the slider handle from 0% to 100%
	slideDuration: dijit.defaultDuration,

	widgetsInTemplate: true,

	attributeMap: dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap),
		{id:"", name:"valueNode"}),

	baseClass: "dijitSlider",

	_mousePixelCoord: "pageX",
	_pixelCount: "w",
	_startingPixelCoord: "x",
	_startingPixelCount: "l",
	_handleOffsetCoord: "left",
	_progressPixelSize: "width",

	_onKeyPress: function(/*Event*/ e){
		if(this.disabled || this.readOnly || e.altKey || e.ctrlKey){ return; }
		switch(e.charOrCode){
			case dojo.keys.HOME:
				this._setValueAttr(this.minimum, true);
				break;
			case dojo.keys.END:
				this._setValueAttr(this.maximum, true);
				break;
			// this._descending === false: if ascending vertical (min on top)
			// (this._descending || this.isLeftToRight()): if left-to-right horizontal or descending vertical
			case ((this._descending || this.isLeftToRight()) ? dojo.keys.RIGHT_ARROW : dojo.keys.LEFT_ARROW):
			case (this._descending === false ? dojo.keys.DOWN_ARROW : dojo.keys.UP_ARROW):
			case (this._descending === false ? dojo.keys.PAGE_DOWN : dojo.keys.PAGE_UP):
				this.increment(e);
				break;
			case ((this._descending || this.isLeftToRight()) ? dojo.keys.LEFT_ARROW : dojo.keys.RIGHT_ARROW):
			case (this._descending === false ? dojo.keys.UP_ARROW : dojo.keys.DOWN_ARROW):
			case (this._descending === false ? dojo.keys.PAGE_UP : dojo.keys.PAGE_DOWN):
				this.decrement(e);
				break;
			default:
				this.inherited(arguments);
				return;
		}
		dojo.stopEvent(e);
	},

	_onHandleClick: function(e){
		if(this.disabled || this.readOnly){ return; }
		if(!dojo.isIE){
			// make sure you get focus when dragging the handle
			// (but don't do on IE because it causes a flicker on mouse up (due to blur then focus)
			dijit.focus(this.sliderHandle);
		}
		dojo.stopEvent(e);
	},
	
	_isReversed: function(){
		return !this.isLeftToRight();
	},

	_onBarClick: function(e){
		if(this.disabled || this.readOnly || !this.clickSelect){ return; }
		dijit.focus(this.sliderHandle);
		dojo.stopEvent(e);
		var abspos = dojo.coords(this.sliderBarContainer, true);
		var pixelValue = e[this._mousePixelCoord] - abspos[this._startingPixelCoord];
		this._setPixelValue(this._isReversed() ? (abspos[this._pixelCount] - pixelValue) : pixelValue, abspos[this._pixelCount], true);
	},

	_setPixelValue: function(/*Number*/ pixelValue, /*Number*/ maxPixels, /*Boolean, optional*/ priorityChange){
		if(this.disabled || this.readOnly){ return; }
		pixelValue = pixelValue < 0 ? 0 : maxPixels < pixelValue ? maxPixels : pixelValue;
		var count = this.discreteValues;
		if(count <= 1 || count == Infinity){ count = maxPixels; }
		count--;
		var pixelsPerValue = maxPixels / count;
		var wholeIncrements = Math.round(pixelValue / pixelsPerValue);
		this._setValueAttr((this.maximum-this.minimum)*wholeIncrements/count + this.minimum, priorityChange);
	},

	_setValueAttr: function(/*Number*/ value, /*Boolean, optional*/ priorityChange){
		// summary:
		//		Hook so attr('value', value) works.
		this.valueNode.value = this.value = value;
		dijit.setWaiState(this.focusNode, "valuenow", value);
		this.inherited(arguments);
		var percent = (value - this.minimum) / (this.maximum - this.minimum);
		var progressBar = (this._descending === false) ? this.remainingBar : this.progressBar;
		var remainingBar = (this._descending === false) ? this.progressBar : this.remainingBar;
		if(this._inProgressAnim && this._inProgressAnim.status != "stopped"){
			this._inProgressAnim.stop(true);
		}
		if(priorityChange && this.slideDuration > 0 && progressBar.style[this._progressPixelSize]){
			// animate the slider
			var _this = this;
			var props = {};
			var start = parseFloat(progressBar.style[this._progressPixelSize]);
			var duration = this.slideDuration * (percent-start/100);
			if(duration == 0){ return; }
			if(duration < 0){ duration = 0 - duration; }
			props[this._progressPixelSize] = { start: start, end: percent*100, units:"%" };
			this._inProgressAnim = dojo.animateProperty({ node: progressBar, duration: duration, 
				onAnimate: function(v){ remainingBar.style[_this._progressPixelSize] = (100-parseFloat(v[_this._progressPixelSize])) + "%"; },
				onEnd: function(){ delete _this._inProgressAnim; },
				properties: props
			})
			this._inProgressAnim.play();
		}
		else{
			progressBar.style[this._progressPixelSize] = (percent*100) + "%";
			remainingBar.style[this._progressPixelSize] = ((1-percent)*100) + "%";
		}
	},

	_bumpValue: function(signedChange){
		if(this.disabled || this.readOnly){ return; }
		var s = dojo.getComputedStyle(this.sliderBarContainer);
		var c = dojo._getContentBox(this.sliderBarContainer, s);
		var count = this.discreteValues;
		if(count <= 1 || count == Infinity){ count = c[this._pixelCount]; }
		count--;
		var value = (this.value - this.minimum) * count / (this.maximum - this.minimum) + signedChange;
		if(value < 0){ value = 0; }
		if(value > count){ value = count; }
		value = value * (this.maximum - this.minimum) / count + this.minimum;
		this._setValueAttr(value, true);
	},

	_onClkIncBumper: function(){
		this._setValueAttr(this._descending === false ? this.minimum : this.maximum, true);
	},

	_onClkDecBumper: function(){
		this._setValueAttr(this._descending === false ? this.maximum : this.minimum, true);
	},

	decrement: function(e){
		// summary
		//	decrement slider by 1 unit
		this._bumpValue(e.charOrCode == dojo.keys.PAGE_DOWN ? -this.pageIncrement : -1);
	},

	increment: function(e){
		// summary
		//	increment slider by 1 unit
		this._bumpValue(e.charOrCode == dojo.keys.PAGE_UP ? this.pageIncrement : 1);
	},

	_mouseWheeled: function(/*Event*/ evt){
		// summary: Event handler for mousewheel where supported
		dojo.stopEvent(evt);
		// FIXME: this adds mouse wheel support for safari, though stopEvent doesn't prevent
		// it from bleeding to window?!
		var janky = !dojo.isMozilla;
		var scroll = evt[(janky ? "wheelDelta" : "detail")] * (janky ? 1 : -1);
		this[(scroll < 0 ? "decrement" : "increment")](evt);
	},

	startup: function(){
		dojo.forEach(this.getChildren(), function(child){
			if(this[child.container] != this.containerNode){
				this[child.container].appendChild(child.domNode);
			}
		}, this);
	},

	_typematicCallback: function(/*Number*/ count, /*Object*/ button, /*Event*/ e){
		if(count == -1){ return; }
		this[(button == (this._descending? this.incrementButton : this.decrementButton))? "decrement" : "increment"](e);
	},

	postCreate: function(){
		if(this.showButtons){
			this.incrementButton.style.display="";
			this.decrementButton.style.display="";
			this._connects.push(dijit.typematic.addMouseListener(
				this.decrementButton, this, "_typematicCallback", 25, 500));
			this._connects.push(dijit.typematic.addMouseListener(
				this.incrementButton, this, "_typematicCallback", 25, 500));
		}
		this.connect(this.domNode, !dojo.isMozilla ? "onmousewheel" : "DOMMouseScroll", "_mouseWheeled");

		// define a custom constructor for a SliderMover that points back to me
		var _self = this;
		var mover = function(){
			dijit.form._SliderMover.apply(this, arguments);
			this.widget = _self;
		};
		dojo.extend(mover, dijit.form._SliderMover.prototype);

		this._movable = new dojo.dnd.Moveable(this.sliderHandle, {mover: mover});
		//find any associated label element and add to slider focusnode.
		var label=dojo.query('label[for="'+this.id+'"]');
		if(label.length){
			label[0].id = (this.id+"_label");
			dijit.setWaiState(this.focusNode, "labelledby", label[0].id);
		}
		dijit.setWaiState(this.focusNode, "valuemin", this.minimum);
		dijit.setWaiState(this.focusNode, "valuemax", this.maximum);

		this.inherited(arguments);
	},

	destroy: function(){
		this._movable.destroy();
		if(this._inProgressAnim && this._inProgressAnim.status != "stopped"){
			this._inProgressAnim.stop(true);
		}
		this.inherited(arguments);	
	}
});

dojo.declare(
	"dijit.form.VerticalSlider",
	dijit.form.HorizontalSlider,
{
	// summary
	//	A form widget that allows one to select a value with a vertically draggable image

	templateString:"<table class=\"dijitReset dijitSlider\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" dojoAttachEvent=\"onkeypress:_onKeyPress\"\n><tbody class=\"dijitReset\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderIncrementIconV\" tabIndex=\"-1\" style=\"display:none\" dojoAttachPoint=\"decrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderTopBumper dijitSliderTopBumper\" dojoAttachEvent=\"onclick:_onClkIncBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td dojoAttachPoint=\"leftDecoration\" class=\"dijitReset\" style=\"text-align:center;height:100%;\"></td\n\t\t><td class=\"dijitReset\" style=\"height:100%;\"\n\t\t\t><input dojoAttachPoint=\"valueNode\" type=\"hidden\" name=\"${name}\"\n\t\t\t/><center class=\"dijitReset dijitSliderBarContainerV\" waiRole=\"presentation\" dojoAttachPoint=\"sliderBarContainer\"\n\t\t\t\t><div waiRole=\"presentation\" dojoAttachPoint=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderRemainingBar dijitSliderRemainingBarV\" dojoAttachEvent=\"onclick:_onBarClick\"><!--#5629--></div\n\t\t\t\t><div waiRole=\"presentation\" dojoAttachPoint=\"progressBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderProgressBar dijitSliderProgressBarV\" dojoAttachEvent=\"onclick:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable\" style=\"vertical-align:top;\" \n\t\t\t\t\t\t><div dojoAttachPoint=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleV\" dojoAttachEvent=\"onmousedown:_onHandleClick\" waiRole=\"slider\" valuemin=\"${minimum}\" valuemax=\"${maximum}\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t></center\n\t\t></td\n\t\t><td dojoAttachPoint=\"containerNode,rightDecoration\" class=\"dijitReset\" style=\"text-align:center;height:100%;\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderBottomBumper dijitSliderBottomBumper\" dojoAttachEvent=\"onclick:_onClkDecBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderDecrementIconV\" tabIndex=\"-1\" style=\"display:none\" dojoAttachPoint=\"incrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n></tbody></table>\n",
	_mousePixelCoord: "pageY",
	_pixelCount: "h",
	_startingPixelCoord: "y",
	_startingPixelCount: "t",
	_handleOffsetCoord: "top",
	_progressPixelSize: "height",

	// _descending: boolean
	//      Specifies if the slider values go from high-on-top (true), or low-on-top (false)
	//	TODO: expose this in 1.2 - the css progress/remaining bar classes need to be reversed
	_descending: true,

	startup: function(){
		if(this._started){ return; }

		if(!this.isLeftToRight() && dojo.isMoz){
			if(this.leftDecoration){this._rtlRectify(this.leftDecoration);}
			if(this.rightDecoration){this._rtlRectify(this.rightDecoration);}
		}

		this.inherited(arguments);
	},
		
	_isReversed: function(){
		return this._descending;
	},

	_rtlRectify: function(decorationNode/*NodeList*/){
		// summary:
		//      Rectify children nodes for left/right decoration in rtl case.
		//		Simply switch the rule and label child for each decoration node.
		var childNodes = [];
		while(decorationNode.firstChild){
				childNodes.push(decorationNode.firstChild);
				decorationNode.removeChild(decorationNode.firstChild);
		}
		for(var i = childNodes.length-1; i >=0; i--){
			if(childNodes[i]){
				decorationNode.appendChild(childNodes[i]);
			}
		}
	}
});

dojo.declare("dijit.form._SliderMover",
	dojo.dnd.Mover,
{
	onMouseMove: function(e){
		var widget = this.widget;
		var abspos = widget._abspos;
		if(!abspos){
			abspos = widget._abspos = dojo.coords(widget.sliderBarContainer, true);
			widget._setPixelValue_ = dojo.hitch(widget, "_setPixelValue");
			widget._isReversed_ = widget._isReversed();
		}
		var pixelValue = e[widget._mousePixelCoord] - abspos[widget._startingPixelCoord];
		widget._setPixelValue_(widget._isReversed_ ? (abspos[widget._pixelCount]-pixelValue) : pixelValue, abspos[widget._pixelCount], false);
	},
	
	destroy: function(e){
		dojo.dnd.Mover.prototype.destroy.apply(this, arguments);
		var widget = this.widget;
		widget._abspos = null;
		widget._setValueAttr(widget.value, true);
	}
});


dojo.declare("dijit.form.HorizontalRule", [dijit._Widget, dijit._Templated],
{
	//	Summary:
	//		Create hash marks for the Horizontal slider
	templateString: '<div class="dijitRuleContainer dijitRuleContainerH"></div>',

	// count: Integer
	//		Number of hash marks to generate
	count: 3,

	// container: Node
	//		If this is a child widget, connect it to this parent node
	container: "containerNode",

	// ruleStyle: String
	//		CSS style to apply to individual hash marks
	ruleStyle: "",

	_positionPrefix: '<div class="dijitRuleMark dijitRuleMarkH" style="left:',
	_positionSuffix: '%;',
	_suffix: '"></div>',

	_genHTML: function(pos, ndx){
		return this._positionPrefix + pos + this._positionSuffix + this.ruleStyle + this._suffix;
	},
	
	_isHorizontal: true,

	postCreate: function(){
		var innerHTML;
		if(this.count==1){
			innerHTML = this._genHTML(50, 0);
		}else{
			var i;
			var interval = 100 / (this.count-1);
			if(!this._isHorizontal || this.isLeftToRight()){
				innerHTML = this._genHTML(0, 0);
				for(i=1; i < this.count-1; i++){
					innerHTML += this._genHTML(interval*i, i);
				}
				innerHTML += this._genHTML(100, this.count-1);
			}else{
				innerHTML = this._genHTML(100, 0);
				for(i=1; i < this.count-1; i++){
					innerHTML += this._genHTML(100-interval*i, i);
				}
				innerHTML += this._genHTML(0, this.count-1);
			}
		}
		this.domNode.innerHTML = innerHTML;
	}
});

dojo.declare("dijit.form.VerticalRule", dijit.form.HorizontalRule,
{
	//	Summary:
	//		Create hash marks for the Vertical slider
	templateString: '<div class="dijitRuleContainer dijitRuleContainerV"></div>',
	_positionPrefix: '<div class="dijitRuleMark dijitRuleMarkV" style="top:',
	
	_isHorizontal: false
});

dojo.declare("dijit.form.HorizontalRuleLabels", dijit.form.HorizontalRule,
{
	//	Summary:
	//		Create labels for the Horizontal slider
	templateString: '<div class="dijitRuleContainer dijitRuleContainerH dijitRuleLabelsContainer dijitRuleLabelsContainerH"></div>',

	// labelStyle: String
	//		CSS style to apply to individual text labels
	labelStyle: "",

	// labels: Array
	//	Array of text labels to render - evenly spaced from left-to-right or bottom-to-top
	labels: [],

	// numericMargin: Integer
	//	Number of generated numeric labels that should be rendered as '' on the ends when labels[] are not specified
	numericMargin: 0,

	// numericMinimum: Integer
	//	Leftmost label value for generated numeric labels when labels[] are not specified
	minimum: 0,

	// numericMaximum: Integer
	//	Rightmost label value for generated numeric labels when labels[] are not specified
	maximum: 1,

	// constraints: object
	//	pattern, places, lang, et al (see dojo.number) for generated numeric labels when labels[] are not specified
	constraints: {pattern:"#%"},

	_positionPrefix: '<div class="dijitRuleLabelContainer dijitRuleLabelContainerH" style="left:',
	_labelPrefix: '"><span class="dijitRuleLabel dijitRuleLabelH">',
	_suffix: '</span></div>',

	_calcPosition: function(pos){
		return pos;
	},

	_genHTML: function(pos, ndx){
		return this._positionPrefix + this._calcPosition(pos) + this._positionSuffix + this.labelStyle + this._labelPrefix + this.labels[ndx] + this._suffix;
	},

	getLabels: function(){
		// summary: user replaceable function to return the labels array

		// if the labels array was not specified directly, then see if <li> children were
		var labels = this.labels;
		if(!labels.length){
			// for markup creation, labels are specified as child elements
			labels = dojo.query("> li", this.srcNodeRef).map(function(node){
				return String(node.innerHTML);
			});
		}
		this.srcNodeRef.innerHTML = '';
		// if the labels were not specified directly and not as <li> children, then calculate numeric labels
		if(!labels.length && this.count > 1){
			var start = this.minimum;
			var inc = (this.maximum - start) / (this.count-1);
			for (var i=0; i < this.count; i++){
				labels.push((i<this.numericMargin||i>=(this.count-this.numericMargin))? '' : dojo.number.format(start, this.constraints));
				start += inc;
			}
		}
		return labels;
	},

	postMixInProperties: function(){
		this.inherited(arguments);
		this.labels = this.getLabels();
		this.count = this.labels.length;
	}
});

dojo.declare("dijit.form.VerticalRuleLabels", dijit.form.HorizontalRuleLabels,
{
	//	Summary:
	//		Create labels for the Vertical slider
	templateString: '<div class="dijitRuleContainer dijitRuleContainerV dijitRuleLabelsContainer dijitRuleLabelsContainerV"></div>',

	_positionPrefix: '<div class="dijitRuleLabelContainer dijitRuleLabelContainerV" style="top:',
	_labelPrefix: '"><span class="dijitRuleLabel dijitRuleLabelV">',

	_calcPosition: function(pos){
		return 100-pos;
	},
	
	_isHorizontal: false
});

}

if(!dojo._hasResource["dijit.form.Form"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.form.Form"] = true;
dojo.provide("dijit.form.Form");




dojo.declare("dijit.form._FormMixin", null,
	{
	//
	//	summary:
	//		Widget corresponding to HTML form tag, for validation and serialization
	//
	//	example:
	//	|	<form dojoType="dijit.form.Form" id="myForm">
	//	|		Name: <input type="text" name="name" />
	//	|	</form>
	//	|	myObj = {name: "John Doe"};
	//	|	dijit.byId('myForm').attr('value', myObj);
	//	|
	//	|	myObj=dijit.byId('myForm').attr('value');

/*=====
    // value: Object
	//		Name/value hash for each form element.
	//		If there are multiple elements w/the same name, value is an array,
	//		unless they are radio buttons in which case value is a scalar since only
	//		one can be checked at a time.
	//
	//		If the name is a dot separated list (like a.b.c.d), it's a nested structure.
	//		Only works on widget form elements.
	// example:
	//	| { name: "John Smith", interests: ["sports", "movies"] }
=====*/
	
	//	TODO:
	//	* Repeater
	//	* better handling for arrays.  Often form elements have names with [] like
	//	* people[3].sex (for a list of people [{name: Bill, sex: M}, ...])
	//
	//	

		reset: function(){
			dojo.forEach(this.getDescendants(), function(widget){
				if(widget.reset){
					widget.reset();
				}
			});
		},

		validate: function(){
			// summary: returns if the form is valid - same as isValid - but
			//			provides a few additional (ui-specific) features.
			//			1 - it will highlight any sub-widgets that are not
			//				valid
			//			2 - it will call focus() on the first invalid 
			//				sub-widget
			var didFocus = false;
			return dojo.every(dojo.map(this.getDescendants(), function(widget){
				// Need to set this so that "required" widgets get their 
				// state set.
				widget._hasBeenBlurred = true;
				var valid = widget.disabled || !widget.validate || widget.validate();
				if (!valid && !didFocus) {
					// Set focus of the first non-valid widget
					dijit.scrollIntoView(widget.containerNode||widget.domNode);
					widget.focus();
					didFocus = true;
				}
	 			return valid;
	 		}), function(item) { return item; });
		},
	
		setValues: function(val){
			dojo.deprecated(this.declaredClass+"::setValues() is deprecated. Use attr('value', val) instead.", "", "2.0");
			return this.attr('value', val);
		},
		_setValueAttr: function(/*object*/obj){
			// summary: Fill in form values from according to an Object (in the format returned by attr('value'))

			// generate map from name --> [list of widgets with that name]
			var map = { };
			dojo.forEach(this.getDescendants(), function(widget){
				if(!widget.name){ return; }
				var entry = map[widget.name] || (map[widget.name] = [] );
				entry.push(widget);
			});

			for(var name in map){
				if(!map.hasOwnProperty(name)){
					continue;
				}
				var widgets = map[name],						// array of widgets w/this name
					values = dojo.getObject(name, false, obj);	// list of values for those widgets

				if(values===undefined){
					continue;
				}
				if(!dojo.isArray(values)){
					values = [ values ];
				}
				if(typeof widgets[0].checked == 'boolean'){
					// for checkbox/radio, values is a list of which widgets should be checked
					dojo.forEach(widgets, function(w, i){
						w.attr('value', dojo.indexOf(values, w.value) != -1);
					});
				}else if(widgets[0]._multiValue){
					// it takes an array (e.g. multi-select)
					widgets[0].attr('value', values);
				}else{
					// otherwise, values is a list of values to be assigned sequentially to each widget
					dojo.forEach(widgets, function(w, i){
						w.attr('value', values[i]);
					});					
				}
			}

			/***
			 * 	TODO: code for plain input boxes (this shouldn't run for inputs that are part of widgets)

			dojo.forEach(this.containerNode.elements, function(element){
				if (element.name == ''){return};	// like "continue"	
				var namePath = element.name.split(".");
				var myObj=obj;
				var name=namePath[namePath.length-1];
				for(var j=1,len2=namePath.length;j<len2;++j){
					var p=namePath[j - 1];
					// repeater support block
					var nameA=p.split("[");
					if (nameA.length > 1){
						if(typeof(myObj[nameA[0]]) == "undefined"){
							myObj[nameA[0]]=[ ];
						} // if

						nameIndex=parseInt(nameA[1]);
						if(typeof(myObj[nameA[0]][nameIndex]) == "undefined"){
							myObj[nameA[0]][nameIndex] = { };
						}
						myObj=myObj[nameA[0]][nameIndex];
						continue;
					} // repeater support ends

					if(typeof(myObj[p]) == "undefined"){
						myObj=undefined;
						break;
					};
					myObj=myObj[p];
				}

				if (typeof(myObj) == "undefined"){
					return;		// like "continue"
				}
				if (typeof(myObj[name]) == "undefined" && this.ignoreNullValues){
					return;		// like "continue"
				}

				// TODO: widget values (just call attr('value', ...) on the widget)

				switch(element.type){
					case "checkbox":
						element.checked = (name in myObj) &&
							dojo.some(myObj[name], function(val){ return val==element.value; });
						break;
					case "radio":
						element.checked = (name in myObj) && myObj[name]==element.value;
						break;
					case "select-multiple":
						element.selectedIndex=-1;
						dojo.forEach(element.options, function(option){
							option.selected = dojo.some(myObj[name], function(val){ return option.value == val; });
						});
						break;
					case "select-one":
						element.selectedIndex="0";
						dojo.forEach(element.options, function(option){
							option.selected = option.value == myObj[name];
						});
						break;
					case "hidden":
					case "text":
					case "textarea":
					case "password":
						element.value = myObj[name] || "";
						break;
				}
	  		});
	  		*/
		},

		getValues: function(){
			dojo.deprecated(this.declaredClass+"::getValues() is deprecated. Use attr('value') instead.", "", "2.0");
			return this.attr('value');
		},
		_getValueAttr: function(){
			// summary:
			// 		Returns Object representing form values.
			// description:
			//		Returns name/value hash for each form element.
			//		If there are multiple elements w/the same name, value is an array,
			//		unless they are radio buttons in which case value is a scalar since only
			//		one can be checked at a time.
			//
			//		If the name is a dot separated list (like a.b.c.d), creates a nested structure.
			//		Only works on widget form elements.
			// example:
			//	| { name: "John Smith", interests: ["sports", "movies"] }

			// get widget values
			var obj = { };
			dojo.forEach(this.getDescendants(), function(widget){
				var name = widget.name;
				if(!name||widget.disabled){ return; }

				// Single value widget (checkbox, radio, or plain <input> type widget
				var value = widget.attr('value');

				// Store widget's value(s) as a scalar, except for checkboxes which are automatically arrays
				if(typeof widget.checked == 'boolean'){
					if(/Radio/.test(widget.declaredClass)){
						// radio button
						if(value !== false){
							dojo.setObject(name, value, obj);
						}
					}else{
						// checkbox/toggle button
						var ary=dojo.getObject(name, false, obj);
						if(!ary){
							ary=[];
							dojo.setObject(name, ary, obj);
						}
						if(value !== false){
							ary.push(value);
						}
					}
				}else{
					// plain input
					dojo.setObject(name, value, obj);
				}
			});

			/***
			 * code for plain input boxes (see also dojo.formToObject, can we use that instead of this code?
			 * but it doesn't understand [] notation, presumably)
			var obj = { };
			dojo.forEach(this.containerNode.elements, function(elm){
				if (!elm.name)	{
					return;		// like "continue"
				}
				var namePath = elm.name.split(".");
				var myObj=obj;
				var name=namePath[namePath.length-1];
				for(var j=1,len2=namePath.length;j<len2;++j){
					var nameIndex = null;
					var p=namePath[j - 1];
					var nameA=p.split("[");
					if (nameA.length > 1){
						if(typeof(myObj[nameA[0]]) == "undefined"){
							myObj[nameA[0]]=[ ];
						} // if
						nameIndex=parseInt(nameA[1]);
						if(typeof(myObj[nameA[0]][nameIndex]) == "undefined"){
							myObj[nameA[0]][nameIndex] = { };
						}
					} else if(typeof(myObj[nameA[0]]) == "undefined"){
						myObj[nameA[0]] = { }
					} // if

					if (nameA.length == 1){
						myObj=myObj[nameA[0]];
					} else{
						myObj=myObj[nameA[0]][nameIndex];
					} // if
				} // for

				if ((elm.type != "select-multiple" && elm.type != "checkbox" && elm.type != "radio") || (elm.type=="radio" && elm.checked)){
					if(name == name.split("[")[0]){
						myObj[name]=elm.value;
					} else{
						// can not set value when there is no name
					}
				} else if (elm.type == "checkbox" && elm.checked){
					if(typeof(myObj[name]) == 'undefined'){
						myObj[name]=[ ];
					}
					myObj[name].push(elm.value);
				} else if (elm.type == "select-multiple"){
					if(typeof(myObj[name]) == 'undefined'){
						myObj[name]=[ ];
					}
					for (var jdx=0,len3=elm.options.length; jdx<len3; ++jdx){
						if (elm.options[jdx].selected){
							myObj[name].push(elm.options[jdx].value);
						}
					}
				} // if
				name=undefined;
			}); // forEach
			***/
			return obj;
		},

		// TODO: ComboBox might need time to process a recently input value.  This should be async?
	 	isValid: function(){
	 		// summary: make sure that every widget that has a validator function returns true
			this._invalidWidgets = [];
	 		return dojo.every(this.getDescendants(), function(widget){
				var isValid = widget.disabled || !widget.isValid || widget.isValid();
				if(!isValid){
					this._invalidWidgets.push(widget);
				}
				return isValid;
	 		}, this);
		},
		
		
		onValidStateChange: function(isValid){
			// summary: stub function to connect to if you want to do something
			//			(like disable/enable a submit button) when the valid 
			//			state changes on the form as a whole.
		},
		
		_widgetChange: function(widget){
			// summary: connected to a widgets onChange function - update our 
			//			valid state, if needed.
			var isValid = this._lastValidState;
			if(!widget || this._lastValidState===undefined){
				// We have passed a null widget, or we haven't been validated
				// yet - let's re-check all our children
				// This happens when we connect (or reconnect) our children
				isValid = this.isValid();
				if(this._lastValidState===undefined){
					// Set this so that we don't fire an onValidStateChange 
					// the first time
					this._lastValidState = isValid;
				}
			}else if(widget.isValid){
				this._invalidWidgets = dojo.filter(this._invalidWidgets||[], function(w){
					return (w != widget);
				}, this);
				if(!widget.isValid() && !widget.attr("disabled")){
					this._invalidWidgets.push(widget);
				}
				isValid = (this._invalidWidgets.length === 0);
			}
			if (isValid !== this._lastValidState){
				this._lastValidState = isValid;
				this.onValidStateChange(isValid);
			}
		},
		
		connectChildren: function(){
			// summary: connects to the onChange function of all children to
			//			track valid state changes.  You can call this function
			//			directly, ie. in the event that you programmatically
			//			add a widget to the form *after* the form has been
			//			initialized
			dojo.forEach(this._changeConnections, dojo.hitch(this, "disconnect"));
			var _this = this;
			
			// we connect to validate - so that it better reflects the states
			// of the widgets - also, we only connect if it has a validate
			// function (to avoid too many unneeded connections)
			var conns = this._changeConnections = [];
			dojo.forEach(dojo.filter(this.getDescendants(),
				function(item){ return item.validate; }
			),
			function(widget){
				// We are interested in whenever the widget is validated - or
				// whenever the disabled attribute on that widget is changed
				conns.push(_this.connect(widget, "validate", 
									dojo.hitch(_this, "_widgetChange", widget)));
				conns.push(_this.connect(widget, "_setDisabledAttr", 
									dojo.hitch(_this, "_widgetChange", widget)));
			});

			// Call the widget change function to update the valid state, in 
			// case something is different now.
			this._widgetChange(null);
		},
		
		startup: function(){
			this.inherited(arguments);
			// Initialize our valid state tracking.  Needs to be done in startup
			//  because it's not guaranteed that our children are initialized 
			//  yet.
			this._changeConnections = [];
			this.connectChildren();
		}
	});

dojo.declare(
	"dijit.form.Form",
	[dijit._Widget, dijit._Templated, dijit.form._FormMixin],
	{
		// summary:
		// Adds conveniences to regular HTML form

		// HTML <FORM> attributes
		name: "",
		action: "",
		method: "",
		encType: "",
		"accept-charset": "",
		accept: "",
		target: "",

		templateString: "<form dojoAttachPoint='containerNode' dojoAttachEvent='onreset:_onReset,onsubmit:_onSubmit' name='${name}'></form>",

		attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap),
			{action: "", method: "", encType: "", "accept-charset": "", accept: "", target: ""}),

		execute: function(/*Object*/ formContents){
			//	summary:
			//		Deprecated: use submit()
		},

		onExecute: function(){
			// summary:
			//		Deprecated: use onSubmit()
		},

		_setEncTypeAttr: function(/*String*/ value){
			this.encType = value;
			dojo.attr(this.domNode, "encType", value);
			if(dojo.isIE){ this.domNode.encoding = value; }
		},

		postCreate: function(){
			// IE tries to hide encType
			// TODO: this code should be in parser, not here.
			if(dojo.isIE && this.srcNodeRef && this.srcNodeRef.attributes){
				var item = this.srcNodeRef.attributes.getNamedItem('encType');
				if(item && !item.specified && (typeof item.value == "string")){
					this.attr('encType', item.value);
				}
			}
			this.inherited(arguments);
		},

		onReset: function(/*Event?*/e){ 
			//	summary:
			//		Callback when user resets the form. This method is intended
			//		to be over-ridden. When the `reset` method is called
			//		programmatically, the return value from `onReset` is used
			//		to compute whether or not resetting should proceed
			return true; // Boolean
		},

		_onReset: function(e){
			// create fake event so we can know if preventDefault() is called
			var faux = {
				returnValue: true, // the IE way
				preventDefault: function(){  // not IE
							this.returnValue = false;
						},
				stopPropagation: function(){}, currentTarget: e.currentTarget, target: e.target
			};
			// if return value is not exactly false, and haven't called preventDefault(), then reset
			if(!(this.onReset(faux) === false) && faux.returnValue){
				this.reset();
			}
			dojo.stopEvent(e);
			return false;
		},

		_onSubmit: function(e){
			var fp = dijit.form.Form.prototype;
			// TODO: remove ths if statement beginning with 2.0
			if(this.execute != fp.execute || this.onExecute != fp.onExecute){
				dojo.deprecated("dijit.form.Form:execute()/onExecute() are deprecated. Use onSubmit() instead.", "", "2.0");
				this.onExecute();
				this.execute(this.getValues());
			}
			if(this.onSubmit(e) === false){ // only exactly false stops submit
				dojo.stopEvent(e);
			}
		},
		
		onSubmit: function(/*Event?*/e){ 
			//	summary:
			//		Callback when user submits the form. This method is
			//		intended to be over-ridden, but by default it checks and
			//		returns the validity of form elements. When the `submit`
			//		method is called programmatically, the return value from
			//		`onSubmit` is used to compute whether or not submission
			//		should proceed

			return this.isValid(); // Boolean
		},

		submit: function(){
			// summary:
			//		programmatically submit form if and only if the `onSubmit` returns true
			if(!(this.onSubmit() === false)){
				this.containerNode.submit();
			}
		}
	}
);

}

if(!dojo._hasResource["dojo.dnd.TimedMoveable"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.TimedMoveable"] = true;
dojo.provide("dojo.dnd.TimedMoveable");



(function(){
	// precalculate long expressions
	var oldOnMove = dojo.dnd.Moveable.prototype.onMove;
		
	dojo.declare("dojo.dnd.TimedMoveable", dojo.dnd.Moveable, {
		// summary:
		//	A specialized version of Moveable to support an FPS throttling.
		//	This class puts an upper restriction on FPS, which may reduce 
		//	the CPU load. The additional parameter "timeout" regulates
		//	the delay before actually moving the moveable object.
		
		// object attributes (for markup)
		timeout: 40,	// in ms, 40ms corresponds to 25 fps
	
		constructor: function(node, params){
			// summary: an object, which makes a node moveable with a timer
			// node: Node: a node (or node's id) to be moved
			// params: Object: an optional object with additional parameters.
			//	See dojo.dnd.Moveable for details on general parameters.
			//	Following parameters are specific for this class:
			//		timeout: Number: delay move by this number of ms
			//			accumulating position changes during the timeout
			
			// sanitize parameters
			if(!params){ params = {}; }
			if(params.timeout && typeof params.timeout == "number" && params.timeout >= 0){
				this.timeout = params.timeout;
			}
		},
	
		// markup methods
		markupFactory: function(params, node){
			return new dojo.dnd.TimedMoveable(node, params);
		},
	
		onMoveStop: function(/* dojo.dnd.Mover */ mover){
			if(mover._timer){
				// stop timer
				clearTimeout(mover._timer)
				// reflect the last received position
				oldOnMove.call(this, mover, mover._leftTop)
			}
			dojo.dnd.Moveable.prototype.onMoveStop.apply(this, arguments);
		},
		onMove: function(/* dojo.dnd.Mover */ mover, /* Object */ leftTop){
			mover._leftTop = leftTop;
			if(!mover._timer){
				var _t = this;	// to avoid using dojo.hitch()
				mover._timer = setTimeout(function(){
					// we don't have any pending requests
					mover._timer = null;
					// reflect the last received position
					oldOnMove.call(_t, mover, mover._leftTop);
				}, this.timeout);
			}
		}
	});
})();

}

if(!dojo._hasResource["dijit.Dialog"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Dialog"] = true;
dojo.provide("dijit.Dialog");











dojo.declare(
	"dijit.DialogUnderlay",
	[dijit._Widget, dijit._Templated],
	{
		// summary: The component that grays out the screen behind the dialog
	
		// Template has two divs; outer div is used for fade-in/fade-out, and also to hold background iframe.
		// Inner div has opacity specified in CSS file.
		templateString: "<div class='dijitDialogUnderlayWrapper' id='${id}_wrapper'><div class='dijitDialogUnderlay ${class}' id='${id}' dojoAttachPoint='node'></div></div>",

		attributeMap: {},

		postCreate: function(){
			// summary: Append the underlay to the body
			dojo.body().appendChild(this.domNode);
			this.bgIframe = new dijit.BackgroundIframe(this.domNode);
		},

		layout: function(){
			// summary: Sets the background to the size of the viewport
			//
			// description:
			//	Sets the background to the size of the viewport (rather than the size
			//	of the document) since we need to cover the whole browser window, even
			//	if the document is only a few lines long.

			var viewport = dijit.getViewport();
			var is = this.node.style,
				os = this.domNode.style;

			os.top = viewport.t + "px";
			os.left = viewport.l + "px";
			is.width = viewport.w + "px";
			is.height = viewport.h + "px";

			// process twice since the scroll bar may have been removed
			// by the previous resizing
			var viewport2 = dijit.getViewport();
			if(viewport.w != viewport2.w){ is.width = viewport2.w + "px"; }
			if(viewport.h != viewport2.h){ is.height = viewport2.h + "px"; }
		},

		show: function(){
			// summary: Show the dialog underlay
			this.domNode.style.display = "block";
			this.layout();
			if(this.bgIframe.iframe){
				this.bgIframe.iframe.style.display = "block";
			}
		},

		hide: function(){
			// summary: hides the dialog underlay
			this.domNode.style.display = "none";
			if(this.bgIframe.iframe){
				this.bgIframe.iframe.style.display = "none";
			}
		},

		uninitialize: function(){
			if(this.bgIframe){
				this.bgIframe.destroy();
			}
		}
	}
);


dojo.declare("dijit._DialogMixin", null,
	{
		attributeMap: dijit._Widget.prototype.attributeMap,

		// execute: Function
		//	User defined function to do stuff when the user hits the submit button
		execute: function(/*Object*/ formContents){},

		// onCancel: Function
		//      Callback when user has canceled dialog, to notify container
		//      (user shouldn't override)
		onCancel: function(){},

		// onExecute: Function
		//	Callback when user is about to execute dialog, to notify container
		//	(user shouldn't override)
		onExecute: function(){},

		_onSubmit: function(){
			// summary: callback when user hits submit button
			this.onExecute();	// notify container that we are about to execute
			this.execute(this.attr('value'));
		},

		_getFocusItems: function(/*Node*/ dialogNode){
			// find focusable Items each time a dialog is opened
			
			var elems = dijit._getTabNavigable(dojo.byId(dialogNode));
			this._firstFocusItem = elems.lowest || elems.first || dialogNode;
			this._lastFocusItem = elems.last || elems.highest || this._firstFocusItem;
			if(dojo.isMoz && this._firstFocusItem.tagName.toLowerCase() == "input" && dojo.attr(this._firstFocusItem, "type").toLowerCase() == "file"){
					//FF doesn't behave well when first element is input type=file, set first focusable to dialog container
					dojo.attr(dialogNode, "tabindex", "0");
					this._firstFocusItem = dialogNode;
			}
		}
	}
);

dojo.declare(
	"dijit.Dialog",
	[dijit.layout.ContentPane, dijit._Templated, dijit.form._FormMixin, dijit._DialogMixin],
	{
		// summary: A modal dialog Widget
		//
		// description:
		//	Pops up a modal dialog window, blocking access to the screen
		//	and also graying out the screen Dialog is extended from
		//	ContentPane so it supports all the same parameters (href, etc.)
		//
		// example:
		// |	<div dojoType="dijit.Dialog" href="test.html"></div>
		//
		// example:
		// |	var foo = new dijit.Dialog({ title: "test dialog", content: "test content" };
		// |	dojo.body().appendChild(foo.domNode);
		// |	foo.startup();
		
		templateString: null,
		templateString:"<div class=\"dijitDialog\" tabindex=\"-1\" waiRole=\"dialog\" waiState=\"labelledby-${id}_title\">\n\t<div dojoAttachPoint=\"titleBar\" class=\"dijitDialogTitleBar\">\n\t<span dojoAttachPoint=\"titleNode\" class=\"dijitDialogTitle\" id=\"${id}_title\"></span>\n\t<span dojoAttachPoint=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" dojoAttachEvent=\"onclick: onCancel\" title=\"${buttonCancel}\">\n\t\t<span dojoAttachPoint=\"closeText\" class=\"closeText\" title=\"${buttonCancel}\">x</span>\n\t</span>\n\t</div>\n\t\t<div dojoAttachPoint=\"containerNode\" class=\"dijitDialogPaneContent\"></div>\n</div>\n",
		attributeMap: dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap), {
			title: [{node: "titleNode", type: "innerHTML"}, {node: "titleBar", type: "attribute"}]
		}),

		// open: Boolean
		//		is True or False depending on state of dialog
		open: false,

		// duration: Integer
		//		The time in milliseconds it takes the dialog to fade in and out
		duration: dijit.defaultDuration,

		// refocus: Boolean
		// 		A Toggle to modify the default focus behavior of a Dialog, which
		// 		is to re-focus the element which had focus before being opened.
		//		False will disable refocusing. Default: true
		refocus: true,
		
		// autofocus: Boolean
		// 		A Toggle to modify the default focus behavior of a Dialog, which
		// 		is to focus on the first dialog element after opening the dialog.
		//		False will disable autofocusing. Default: true
		autofocus: true,

		// _firstFocusItem: DomNode
		//		The pointer to the first focusable node in the dialog
		_firstFocusItem:null,
		
		// _lastFocusItem: DomNode
		//		The pointer to which node has focus prior to our dialog
		_lastFocusItem:null,

		// doLayout: Boolean
		//		Don't change this parameter from the default value.
		//		This ContentPane parameter doesn't make sense for Dialog, since Dialog
		//		is never a child of a layout container, nor can you specify the size of
		//		Dialog in order to control the size of an inner widget. 
		doLayout: false,

		// draggable: Boolean
		//		Toggles the moveable aspect of the Dialog. If true, Dialog
		//		can be moved by it's title. If false it will remain centered
		//		in the viewport.
		draggable: true,

		postMixInProperties: function(){
			var _nlsResources = dojo.i18n.getLocalization("dijit", "common");
			dojo.mixin(this, _nlsResources);
			this.inherited(arguments);
		},

		postCreate: function(){
			var s = this.domNode.style;
			s.visibility = "hidden";
			s.position = "absolute";
			s.display = "";
			s.top = "-9999px";
			dojo.body().appendChild(this.domNode);

			this.inherited(arguments);

			this.connect(this, "onExecute", "hide");
			this.connect(this, "onCancel", "hide");
			this._modalconnects = [];
		},

		onLoad: function(){
			// summary: when href is specified we need to reposition the dialog after the data is loaded
			this._position();
			this.inherited(arguments);
		},

		_endDrag: function(e){
			// summary: Called after dragging the Dialog. Calculates the relative offset
			//		of the Dialog in relation to the viewport. 
			if(e && e.node && e.node === this.domNode){
				var vp = dijit.getViewport(); 
				var p = e._leftTop || dojo.coords(e.node,true);
				this._relativePosition = {
					t: p.t - vp.t,
					l: p.l - vp.l
				}			
			}
		},
		
		_setup: function(){
			// summary: 
			//		stuff we need to do before showing the Dialog for the first
			//		time (but we defer it until right beforehand, for
			//		performance reasons)

			var node = this.domNode;

			if(this.titleBar && this.draggable){
				this._moveable = (dojo.isIE == 6) ?
					new dojo.dnd.TimedMoveable(node, { handle: this.titleBar }) :	// prevent overload, see #5285
					new dojo.dnd.Moveable(node, { handle: this.titleBar, timeout: 0 });
				dojo.subscribe("/dnd/move/stop",this,"_endDrag");
			}else{
				dojo.addClass(node,"dijitDialogFixed"); 
			}

			this._underlay = new dijit.DialogUnderlay({
				id: this.id+"_underlay",
				"class": dojo.map(this["class"].split(/\s/), function(s){ return s+"_underlay"; }).join(" ")
			});

			var underlay = this._underlay;

			this._fadeIn = dojo.fadeIn({
				node: node,
				duration: this.duration,
				onBegin: dojo.hitch(underlay, "show")
			 });

			this._fadeOut = dojo.fadeOut({
				node: node,
				duration: this.duration,
				onEnd: function(){
					node.style.visibility="hidden";
					node.style.top = "-9999px";
					underlay.hide();
				}
			 });
		},

		uninitialize: function(){
			if(this._fadeIn && this._fadeIn.status() == "playing"){
				this._fadeIn.stop();
			}
			if(this._fadeOut && this._fadeOut.status() == "playing"){
				this._fadeOut.stop();
			}
			if(this._underlay){
				this._underlay.destroy();
			}
			if(this._moveable){
				this._moveable.destroy();
			}
		},

		_size: function(){
			// summary:
			// 		Make sure the dialog is small enough to fit in viewport.

			var mb = dojo.marginBox(this.domNode);
			var viewport = dijit.getViewport();
			if(mb.w >= viewport.w || mb.h >= viewport.h){
				dojo.style(this.containerNode, {
					width: Math.min(mb.w, Math.floor(viewport.w * 0.75))+"px",
					height: Math.min(mb.h, Math.floor(viewport.h * 0.75))+"px",
					overflow: "auto",
					position: "relative"	// workaround IE bug moving scrollbar or dragging dialog
				});
			}
		},

		_position: function(){
			// summary: Position modal dialog in the viewport. If no relative offset
			//		in the viewport has been determined (by dragging, for instance),
			//		center the node. Otherwise, use the Dialog's stored relative offset,
			//		and position the node to top: left: values based on the viewport.
			if(!dojo.hasClass(dojo.body(),"dojoMove")){
				
				var node = this.domNode;
				var viewport = dijit.getViewport();
				var p = this._relativePosition;
				var mb = p ? null : dojo.marginBox(node);
				dojo.style(node,{
					left: Math.floor(viewport.l + (p ? p.l : (viewport.w - mb.w) / 2)) + "px",
					top: Math.floor(viewport.t + (p ? p.t : (viewport.h - mb.h) / 2)) + "px"
				});
			}

		},

		_onKey: function(/*Event*/ evt){
			// summary: handles the keyboard events for accessibility reasons
			if(evt.charOrCode){
				var dk = dojo.keys;
				var node = evt.target;
				if (evt.charOrCode === dk.TAB){
					this._getFocusItems(this.domNode);
				}
				var singleFocusItem = (this._firstFocusItem == this._lastFocusItem);
				// see if we are shift-tabbing from first focusable item on dialog
				if(node == this._firstFocusItem && evt.shiftKey && evt.charOrCode === dk.TAB){
					if(!singleFocusItem){
						dijit.focus(this._lastFocusItem); // send focus to last item in dialog
					}
					dojo.stopEvent(evt);
				}else if(node == this._lastFocusItem && evt.charOrCode === dk.TAB && !evt.shiftKey){
					if (!singleFocusItem){
						dijit.focus(this._firstFocusItem); // send focus to first item in dialog
					}
					dojo.stopEvent(evt);
				}else{
					// see if the key is for the dialog
					while(node){
						if(node == this.domNode){
							if(evt.charOrCode == dk.ESCAPE){
								this.onCancel(); 
							}else{
								return; // just let it go
							}
						}
						node = node.parentNode;
					}
					// this key is for the disabled document window
					if(evt.charOrCode !== dk.TAB){ // allow tabbing into the dialog for a11y
						dojo.stopEvent(evt);
					// opera won't tab to a div
					}else if(!dojo.isOpera){
						try{
							this._firstFocusItem.focus();
						}catch(e){ /*squelch*/ }
					}
				}
			}
		},

		show: function(){
			// summary: display the dialog

			if(this.open){ return; }
			
			// first time we show the dialog, there's some initialization stuff to do			
			if(!this._alreadyInitialized){
				this._setup();
				this._alreadyInitialized=true;
			}

			if(this._fadeOut.status() == "playing"){
				this._fadeOut.stop();
			}

			this._modalconnects.push(dojo.connect(window, "onscroll", this, "layout"));
			this._modalconnects.push(dojo.connect(window, "onresize", this, "layout"));
			this._modalconnects.push(dojo.connect(dojo.doc.documentElement, "onkeypress", this, "_onKey"));

			dojo.style(this.domNode, {
				opacity:0,
				visibility:""
			});
			
			this.open = true;
			this._loadCheck(); // lazy load trigger

			this._size();
			this._position();

			this._fadeIn.play();

			this._savedFocus = dijit.getFocus(this);

			if(this.autofocus){
				// find focusable Items each time dialog is shown since if dialog contains a widget the 
				// first focusable items can change
				this._getFocusItems(this.domNode);
	
				// set timeout to allow the browser to render dialog
				setTimeout(dojo.hitch(dijit,"focus",this._firstFocusItem), 50);
			}
		},

		hide: function(){
			// summary: Hide the dialog

			// if we haven't been initialized yet then we aren't showing and we can just return		
			if(!this._alreadyInitialized){
				return;
			}

			if(this._fadeIn.status() == "playing"){
				this._fadeIn.stop();
			}
			this._fadeOut.play();

			if (this._scrollConnected){
				this._scrollConnected = false;
			}
			dojo.forEach(this._modalconnects, dojo.disconnect);
			this._modalconnects = [];
			if(this.refocus){
				this.connect(this._fadeOut,"onEnd",dojo.hitch(dijit,"focus",this._savedFocus));
			}
			if(this._relativePosition){
				delete this._relativePosition;	
			}
			this.open = false;
		},

		layout: function() {
			// summary: Position the Dialog and the underlay
			if(this.domNode.style.visibility != "hidden"){
				this._underlay.layout();
				this._position(); 
			}
		},
		
		destroy: function(){
			dojo.forEach(this._modalconnects, dojo.disconnect);
			if(this.refocus && this.open){
				setTimeout(dojo.hitch(dijit,"focus",this._savedFocus), 25);
			}
			this.inherited(arguments);			
		}
	}
);

dojo.declare(
	"dijit.TooltipDialog",
	[dijit.layout.ContentPane, dijit._Templated, dijit.form._FormMixin, dijit._DialogMixin],
	{
		// summary:
		//		Pops up a dialog that appears like a Tooltip
		//
		// title: String
		// 		Description of tooltip dialog (required for a11Y)
		title: "",

		// doLayout: Boolean
		//		Don't change this parameter from the default value.
		//		This ContentPane parameter doesn't make sense for TooltipDialog, since TooltipDialog
		//		is never a child of a layout container, nor can you specify the size of
		//		TooltipDialog in order to control the size of an inner widget. 
		doLayout: false,

		// autofocus: Boolean
		// 		A Toggle to modify the default focus behavior of a Dialog, which
		// 		is to focus on the first dialog element after opening the dialog.
		//		False will disable autofocusing. Default: true
		autofocus: true,

		"class": "dijitTooltipDialog",

		// _firstFocusItem: DomNode
		//		The pointer to the first focusable node in the dialog
		_firstFocusItem:null,
		
		// _lastFocusItem: DomNode
		//		The domNode that had focus before we took it.
		_lastFocusItem: null,

		templateString: null,
		templateString:"<div waiRole=\"presentation\">\n\t<div class=\"dijitTooltipContainer\" waiRole=\"presentation\">\n\t\t<div class =\"dijitTooltipContents dijitTooltipFocusNode\" dojoAttachPoint=\"containerNode\" tabindex=\"-1\" waiRole=\"dialog\"></div>\n\t</div>\n\t<div class=\"dijitTooltipConnector\" waiRole=\"presentation\"></div>\n</div>\n",

		postCreate: function(){
			this.inherited(arguments);
			this.connect(this.containerNode, "onkeypress", "_onKey");
			this.containerNode.title = this.title;
		},

		orient: function(/*DomNode*/ node, /*String*/ aroundCorner, /*String*/ corner){
			// summary: configure widget to be displayed in given position relative to the button
			this.domNode.className = this["class"] +" dijitTooltipAB"+(corner.charAt(1)=='L'?"Left":"Right")+" dijitTooltip"+(corner.charAt(0)=='T' ? "Below" : "Above");
		},

		onOpen: function(/*Object*/ pos){
			// summary: called when dialog is displayed
		
			this.orient(this.domNode,pos.aroundCorner, pos.corner);
			this._loadCheck(); // lazy load trigger
			
			if(this.autofocus){
				this._getFocusItems(this.containerNode);
				dijit.focus(this._firstFocusItem);
			}
		},
		
		_onKey: function(/*Event*/ evt){
			// summary: keep keyboard focus in dialog; close dialog on escape key
			var node = evt.target;
			var dk = dojo.keys;
			if (evt.charOrCode === dk.TAB){
				this._getFocusItems(this.containerNode);
			}
			var singleFocusItem = (this._firstFocusItem == this._lastFocusItem);
			if(evt.charOrCode == dk.ESCAPE){
				this.onCancel();
				dojo.stopEvent(evt);
			}else if(node == this._firstFocusItem && evt.shiftKey && evt.charOrCode === dk.TAB){
				if(!singleFocusItem){
					dijit.focus(this._lastFocusItem); // send focus to last item in dialog
				}
				dojo.stopEvent(evt);
			}else if(node == this._lastFocusItem && evt.charOrCode === dk.TAB && !evt.shiftKey){
				if(!singleFocusItem){
					dijit.focus(this._firstFocusItem); // send focus to first item in dialog
				}
				dojo.stopEvent(evt);
			}else if(evt.charOrCode === dk.TAB){
				// we want the browser's default tab handling to move focus
				// but we don't want the tab to propagate upwards
				evt.stopPropagation();
			}
		}
	}	
);


}

if(!dojo._hasResource["dijit.Toolbar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Toolbar"] = true;
dojo.provide("dijit.Toolbar");





dojo.declare("dijit.Toolbar",
	[dijit._Widget, dijit._Templated, dijit._KeyNavContainer],
	{
	// summary: A Toolbar widget, used to hold things like dijit.Editor buttons

	templateString:
		'<div class="dijit dijitToolbar" waiRole="toolbar" tabIndex="${tabIndex}" dojoAttachPoint="containerNode">' +
		//	'<table style="table-layout: fixed" class="dijitReset dijitToolbarTable">' + // factor out style
		//		'<tr class="dijitReset" dojoAttachPoint="containerNode"></tr>'+
		//	'</table>' +
		'</div>',

	tabIndex: "0",

	postCreate: function(){
		this.connectKeyNavHandlers(
			this.isLeftToRight() ? [dojo.keys.LEFT_ARROW] : [dojo.keys.RIGHT_ARROW],
			this.isLeftToRight() ? [dojo.keys.RIGHT_ARROW] : [dojo.keys.LEFT_ARROW]
		);
	},

	startup: function(){
		if(this._started){ return; }

		this.startupKeyNavChildren();

		this.inherited(arguments);
	}
}
);

// Combine with dijit.MenuSeparator??
dojo.declare("dijit.ToolbarSeparator",
	[ dijit._Widget, dijit._Templated ],
	{
	// summary: A spacer between two Toolbar items
	templateString: '<div class="dijitToolbarSeparator dijitInline"></div>',
	postCreate: function(){ dojo.setSelectable(this.domNode, false); },
	isFocusable: function(){ 
		// summary: This widget isn't focusable, so pass along that fact.
		return false; 
	}

});

}

if(!dojo._hasResource["dijit.ProgressBar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.ProgressBar"] = true;
dojo.provide("dijit.ProgressBar");







dojo.declare("dijit.ProgressBar", [dijit._Widget, dijit._Templated], {
	// summary: A progress indication widget
	//
	// example:
	// |	<div dojoType="ProgressBar"
	// |		 places="0"
	// |		 progress="..." maximum="...">
	// |	</div>
	//
	// progress: String (Percentage or Number)
	// 	initial progress value.
	// 	with "%": percentage value, 0% <= progress <= 100%
	// 	or without "%": absolute value, 0 <= progress <= maximum
	progress: "0",

	// maximum: Float
	// 	max sample number
	maximum: 100,

	// places: Number
	// 	number of places to show in values; 0 by default
	places: 0,

	// indeterminate: Boolean
	// 	If false: show progress.
	// 	If true: show that a process is underway but that the progress is unknown
	indeterminate: false,

	templateString:"<div class=\"dijitProgressBar dijitProgressBarEmpty\"\n\t><div waiRole=\"progressbar\" tabindex=\"0\" dojoAttachPoint=\"internalProgress\" class=\"dijitProgressBarFull\"\n\t\t><div class=\"dijitProgressBarTile\"></div\n\t\t><span style=\"visibility:hidden\">&nbsp;</span\n\t></div\n\t><div dojoAttachPoint=\"label\" class=\"dijitProgressBarLabel\" id=\"${id}_label\">&nbsp;</div\n\t><img dojoAttachPoint=\"inteterminateHighContrastImage\" class=\"dijitProgressBarIndeterminateHighContrastImage\"\n\t></img\n></div>\n",

	_indeterminateHighContrastImagePath:
		dojo.moduleUrl("dijit", "themes/a11y/indeterminate_progress.gif"),

	// public functions
	postCreate: function(){
		this.inherited(arguments);
		this.inteterminateHighContrastImage.setAttribute("src",
			this._indeterminateHighContrastImagePath);
		this.update();
	},

	update: function(/*Object?*/attributes){
		// summary: update progress information
		//
		// attributes: may provide progress and/or maximum properties on this parameter,
		//	see attribute specs for details.
		dojo.mixin(this, attributes || {});
		var tip = this.internalProgress;
		var percent = 1, classFunc;
		if(this.indeterminate){
			classFunc = "addClass";
			dijit.removeWaiState(tip, "valuenow");
			dijit.removeWaiState(tip, "valuemin");
			dijit.removeWaiState(tip, "valuemax");
		}else{
			classFunc = "removeClass";
			if(String(this.progress).indexOf("%") != -1){
				percent = Math.min(parseFloat(this.progress)/100, 1);
				this.progress = percent * this.maximum;
			}else{
				this.progress = Math.min(this.progress, this.maximum);
				percent = this.progress / this.maximum;
			}
			var text = this.report(percent);
			this.label.firstChild.nodeValue = text;
			dijit.setWaiState(tip, "describedby", this.label.id);
			dijit.setWaiState(tip, "valuenow", this.progress);
			dijit.setWaiState(tip, "valuemin", 0);
			dijit.setWaiState(tip, "valuemax", this.maximum);
		}
		dojo[classFunc](this.domNode, "dijitProgressBarIndeterminate");
		tip.style.width = (percent * 100) + "%";
		this.onChange();
	},

	report: function(/*float*/percent){
		// summary: Generates message to show; may be overridden by user
		return dojo.number.format(percent, { type: "percent", places: this.places, locale: this.lang });
	},

	onChange: function(){
		// summary: User definable function fired when progress updates.
	}
});

}

if(!dojo._hasResource["dijit.Tree"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.Tree"] = true;
dojo.provide("dijit.Tree");








dojo.declare(
	"dijit._TreeNode",
	[dijit._Widget, dijit._Templated, dijit._Container, dijit._Contained],
{
	// summary:
	//		Single node within a tree

	// item: dojo.data.Item
	//		the dojo.data entry this tree represents
	item: null,	

	isTreeNode: true,

	// label: String
	//		Text of this tree node
	label: "",
	
	isExpandable: null, // show expando node
	
	isExpanded: false,

	// state: String
	//		dynamic loading-related stuff.
	//		When an empty folder node appears, it is "UNCHECKED" first,
	//		then after dojo.data query it becomes "LOADING" and, finally "LOADED"	
	state: "UNCHECKED",
	
	templateString:"<div class=\"dijitTreeNode\" waiRole=\"presentation\"\n\t><div dojoAttachPoint=\"rowNode\" class=\"dijitTreeRow\" waiRole=\"presentation\"\n\t\t><img src=\"${_blankGif}\" alt=\"\" dojoAttachPoint=\"expandoNode\" class=\"dijitTreeExpando\" waiRole=\"presentation\"\n\t\t><span dojoAttachPoint=\"expandoNodeText\" class=\"dijitExpandoText\" waiRole=\"presentation\"\n\t\t></span\n\t\t><span dojoAttachPoint=\"contentNode\" dojoAttachEvent=\"onmouseenter:_onMouseEnter, onmouseleave:_onMouseLeave\"\n\t\t\tclass=\"dijitTreeContent\" waiRole=\"presentation\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" dojoAttachPoint=\"iconNode\" class=\"dijitTreeIcon\" waiRole=\"presentation\"\n\t\t\t><span dojoAttachPoint=\"labelNode\" class=\"dijitTreeLabel\" wairole=\"treeitem\" tabindex=\"-1\" waiState=\"selected-false\" dojoAttachEvent=\"onfocus:_onNodeFocus\"></span>\n\t\t</span\n\t></div>\n\t<div dojoAttachPoint=\"containerNode\" class=\"dijitTreeContainer\" waiRole=\"presentation\" style=\"display: none;\"></div>\n</div>\n",		

	postCreate: function(){
		// set label, escaping special characters
		this.setLabelNode(this.label);

		// set expand icon for leaf
		this._setExpando();

		// set icon and label class based on item
		this._updateItemClasses(this.item);

		if(this.isExpandable){
			dijit.setWaiState(this.labelNode, "expanded", this.isExpanded);
		}
	},

	markProcessing: function(){
		// summary: visually denote that tree is loading data, etc.
		this.state = "LOADING";
		this._setExpando(true);	
	},

	unmarkProcessing: function(){
		// summary: clear markup from markProcessing() call
		this._setExpando(false);	
	},

	_updateItemClasses: function(item){
		// summary: set appropriate CSS classes for icon and label dom node (used to allow for item updates to change respective CSS)
		var tree = this.tree, model = tree.model;
		if(tree._v10Compat && item === model.root){
			// For back-compat with 1.0, need to use null to specify root item (TODO: remove in 2.0)
			item = null;
		}
		this.iconNode.className = "dijitTreeIcon " + tree.getIconClass(item, this.isExpanded);
		this.labelNode.className = "dijitTreeLabel " + tree.getLabelClass(item, this.isExpanded);
	},

	_updateLayout: function(){
		// summary: set appropriate CSS classes for this.domNode
		var parent = this.getParent();
		if(!parent || parent.rowNode.style.display == "none"){
			/* if we are hiding the root node then make every first level child look like a root node */
			dojo.addClass(this.domNode, "dijitTreeIsRoot");
		}else{
			dojo.toggleClass(this.domNode, "dijitTreeIsLast", !this.getNextSibling());
		}
	},

	_setExpando: function(/*Boolean*/ processing){
		// summary: set the right image for the expando node

		// apply the appropriate class to the expando node
		var styles = ["dijitTreeExpandoLoading", "dijitTreeExpandoOpened",
			"dijitTreeExpandoClosed", "dijitTreeExpandoLeaf"];
		var _a11yStates = ["*","-","+","*"];
		
		var idx = processing ? 0 : (this.isExpandable ?	(this.isExpanded ? 1 : 2) : 3);
		dojo.forEach(styles,
			function(s){
				dojo.removeClass(this.expandoNode, s);
			}, this
		);
		dojo.addClass(this.expandoNode, styles[idx]);

		// provide a non-image based indicator for images-off mode
		this.expandoNodeText.innerHTML = _a11yStates[idx];

	},	

	expand: function(){
		// summary: show my children
		if(this.isExpanded){ return; }
		// cancel in progress collapse operation

		this._wipeOut && this._wipeOut.stop();

		this.isExpanded = true;
		dijit.setWaiState(this.labelNode, "expanded", "true");
		dijit.setWaiRole(this.containerNode, "group");
		this.contentNode.className = "dijitTreeContent dijitTreeContentExpanded";
		this._setExpando();
		this._updateItemClasses(this.item);

		if(!this._wipeIn){
			this._wipeIn = dojo.fx.wipeIn({
				node: this.containerNode, duration: dijit.defaultDuration
			});
		}
		this._wipeIn.play();
	},

	collapse: function(){					
		if(!this.isExpanded){ return; }

		// cancel in progress expand operation
		this._wipeIn && this._wipeIn.stop();

		this.isExpanded = false;
		dijit.setWaiState(this.labelNode, "expanded", "false");
		this.contentNode.className = "dijitTreeContent";
		this._setExpando();
		this._updateItemClasses(this.item);

		if(!this._wipeOut){
			this._wipeOut = dojo.fx.wipeOut({
				node: this.containerNode, duration: dijit.defaultDuration
			});
		}
		this._wipeOut.play();
	},

	setLabelNode: function(label){
		this.labelNode.innerHTML = "";
		this.labelNode.appendChild(dojo.doc.createTextNode(label));
	},

	setChildItems: function(/* Object[] */ items){
		// summary:
		//		Sets the child items of this node, removing/adding nodes
		//		from current children to match specified items[] array.

		var tree = this.tree,
			model = tree.model;

		// Orphan all my existing children.
		// If items contains some of the same items as before then we will reattach them.
		// Don't call this.removeChild() because that will collapse the tree etc.
		this.getChildren().forEach(function(child){
			dijit._Container.prototype.removeChild.call(this, child);
		}, this);

		this.state = "LOADED";

		if(items && items.length > 0){
			this.isExpandable = true;

			// Create _TreeNode widget for each specified tree node, unless one already
			// exists and isn't being used (presumably it's from a DnD move and was recently
			// released
			dojo.forEach(items, function(item){
				var id = model.getIdentity(item),
					existingNode = tree._itemNodeMap[id],
					node = 
						( existingNode && !existingNode.getParent() ) ?
						existingNode :
						this.tree._createTreeNode({
							item: item,
							tree: tree,
							isExpandable: model.mayHaveChildren(item),
							label: tree.getLabel(item)
						});
				this.addChild(node);
				// note: this won't work if there are two nodes for one item (multi-parented items); will be fixed later
				tree._itemNodeMap[id] = node;
				if(this.tree.persist){
					if(tree._openedItemIds[id]){
						tree._expandNode(node);
					}
				}
			}, this);

			// note that updateLayout() needs to be called on each child after
			// _all_ the children exist
			dojo.forEach(this.getChildren(), function(child, idx){
				child._updateLayout();
			});
		}else{
			this.isExpandable=false;
		}

		if(this._setExpando){
			// change expando to/from dot or + icon, as appropriate
			this._setExpando(false);
		}

		// On initial tree show, put focus on either the root node of the tree,
		// or the first child, if the root node is hidden
		if(this == tree.rootNode){
			var fc = this.tree.showRoot ? this : this.getChildren()[0],
				tabnode = fc ? fc.labelNode : this.domNode;
			tabnode.setAttribute("tabIndex", "0");
			tree.lastFocused = fc;
		}
	},

	removeChild: function(/* treeNode */ node){
		this.inherited(arguments);

		var children = this.getChildren();		
		if(children.length == 0){
			this.isExpandable = false;
			this.collapse();
		}

		dojo.forEach(children, function(child){
				child._updateLayout();
		});
	},

	makeExpandable: function(){
		//summary:
		//		if this node wasn't already showing the expando node,
		//		turn it into one and call _setExpando()
		this.isExpandable = true;
		this._setExpando(false);
	},

	_onNodeFocus: function(evt){
		var node = dijit.getEnclosingWidget(evt.target);
		this.tree._onTreeFocus(node);
	},
	
	_onMouseEnter: function(evt){
		dojo.addClass(this.contentNode, "dijitTreeNodeHover");
	},

	_onMouseLeave: function(evt){
		dojo.removeClass(this.contentNode, "dijitTreeNodeHover");
	}
});

dojo.declare(
	"dijit.Tree",
	[dijit._Widget, dijit._Templated],
{
	// summary:
	//	This widget displays hierarchical data from a store.  A query is specified
	//	to get the "top level children" from a data store, and then those items are
	//	queried for their children and so on (but lazily, as the user clicks the expand node).
	//
	//	Thus in the default mode of operation this widget is technically a forest, not a tree,
	//	in that there can be multiple "top level children".  However, if you specify label,
	//	then a special top level node (not corresponding to any item in the datastore) is
	//	created, to father all the top level children.

	// store: String||dojo.data.Store
	//	The store to get data to display in the tree.
	//	May remove for 2.0 in favor of "model".
	store: null,

	// model: dijit.Tree.model
	//	Alternate interface from store to access data (and changes to data) in the tree
	model: null,

	// query: anything
	//	Specifies datastore query to return the root item for the tree.
	//
	//	Deprecated functionality: if the query returns multiple items, the tree is given
	//	a fake root node (not corresponding to any item in the data store), 
	//	whose children are the items that match this query.
	//
	//	The root node is shown or hidden based on whether a label is specified.
	//
	//	Having a query return multiple items is deprecated.
	//	If your store doesn't have a root item, wrap the store with
	//	dijit.tree.ForestStoreModel, and specify model=myModel
	//
	// example:
	//		{type:'continent'}
	query: null,

	// label: String
	//	Deprecated.  Use dijit.tree.ForestStoreModel directly instead.
	//	Used in conjunction with query parameter.
	//	If a query is specified (rather than a root node id), and a label is also specified,
	//	then a fake root node is created and displayed, with this label.
	label: "",

	// showRoot: Boolean
	//	Should the root node be displayed, or hidden?
	showRoot: true,

	// childrenAttr: String[]
	//		one ore more attributes that holds children of a tree node
	childrenAttr: ["children"],

	// openOnClick: Boolean
	//		If true, clicking a folder node's label will open it, rather than calling onClick()
	openOnClick: false,

	templateString:"<div class=\"dijitTreeContainer\" waiRole=\"tree\"\n\tdojoAttachEvent=\"onclick:_onClick,onkeypress:_onKeyPress\">\n</div>\n",		

	isExpandable: true,

	isTree: true,

	// persist: Boolean
	//	enables/disables use of cookies for state saving.
	persist: true,
	
	// dndController: String
	//	class name to use as as the dnd controller
	dndController: null,

	//parameters to pull off of the tree and pass on to the dndController as its params
	dndParams: ["onDndDrop","itemCreator","onDndCancel","checkAcceptance", "checkItemAcceptance", "dragThreshold"],

	//declare the above items so they can be pulled from the tree's markup
	onDndDrop:null,
	itemCreator:null,
	onDndCancel:null,
	checkAcceptance:null,	
	checkItemAcceptance:null,
	dragThreshold:0,

	_publish: function(/*String*/ topicName, /*Object*/ message){
		// summary:
		//		Publish a message for this widget/topic
		dojo.publish(this.id, [dojo.mixin({tree: this, event: topicName}, message||{})]);
	},

	postMixInProperties: function(){
		this.tree = this;

		this._itemNodeMap={};

		if(!this.cookieName){
			this.cookieName = this.id + "SaveStateCookie";
		}
	},

	postCreate: function(){
		// load in which nodes should be opened automatically
		if(this.persist){
			var cookie = dojo.cookie(this.cookieName);
			this._openedItemIds = {};
			if(cookie){
				dojo.forEach(cookie.split(','), function(item){
					this._openedItemIds[item] = true;
				}, this);
			}
		}
		
		// Create glue between store and Tree, if not specified directly by user
		if(!this.model){
			this._store2model();
		}

		// monitor changes to items
		this.connect(this.model, "onChange", "_onItemChange");
		this.connect(this.model, "onChildrenChange", "_onItemChildrenChange");
		this.connect(this.model, "onDelete", "_onItemDelete");

		this._load();

		this.inherited(arguments);

		if(this.dndController){
			if(dojo.isString(this.dndController)){
				this.dndController = dojo.getObject(this.dndController);
			}	
			var params={};
			for (var i=0; i<this.dndParams.length;i++){
				if(this[this.dndParams[i]]){
					params[this.dndParams[i]] = this[this.dndParams[i]];
				}
			}
			this.dndController = new this.dndController(this, params);
		}
	},

	_store2model: function(){
		// summary: user specified a store&query rather than model, so create model from store/query
		this._v10Compat = true;
		dojo.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");

		var modelParams = {
			id: this.id + "_ForestStoreModel",
			store: this.store,
			query: this.query,
			childrenAttrs: this.childrenAttr
		};

		// Only override the model's mayHaveChildren() method if the user has specified an override
		if(this.params.mayHaveChildren){
			modelParams.mayHaveChildren = dojo.hitch(this, "mayHaveChildren");
		}
					
		if(this.params.getItemChildren){
			modelParams.getChildren = dojo.hitch(this, function(item, onComplete, onError){
				this.getItemChildren((this._v10Compat && item === this.model.root) ? null : item, onComplete, onError);
			});
		}
		this.model = new dijit.tree.ForestStoreModel(modelParams);
		
		// For backwards compatibility, the visibility of the root node is controlled by
		// whether or not the user has specified a label
		this.showRoot = Boolean(this.label);
	},

	_load: function(){
		// summary: initial load of the tree
		// load root node (possibly hidden) and it's children
		this.model.getRoot(
			dojo.hitch(this, function(item){
				var rn = this.rootNode = this.tree._createTreeNode({
					item: item,
					tree: this,
					isExpandable: true,
					label: this.label || this.getLabel(item)
				});
				if(!this.showRoot){
					rn.rowNode.style.display="none";
				}
				this.domNode.appendChild(rn.domNode);
				this._itemNodeMap[this.model.getIdentity(item)] = rn;

				rn._updateLayout();		// sets "dijitTreeIsRoot" CSS classname

				// load top level children
				this._expandNode(rn);
			}),
			function(err){
				console.error(this, ": error loading root: ", err);
			}
		);
	},

	////////////// Data store related functions //////////////////////
	// These just get passed to the model; they are here for back-compat

	mayHaveChildren: function(/*dojo.data.Item*/ item){
		// summary:
		//		User overridable function to tell if an item has or may have children.
		//		Controls whether or not +/- expando icon is shown.
		//		(For efficiency reasons we may not want to check if an element actually
		//		has children until user clicks the expando node)
	},

	getItemChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete){
		// summary:
		// 		User overridable function that return array of child items of given parent item,
		//		or if parentItem==null then return top items in tree
	},

	///////////////////////////////////////////////////////
	// Functions for converting an item to a TreeNode
	getLabel: function(/*dojo.data.Item*/ item){
		// summary: user overridable function to get the label for a tree node (given the item)
		return this.model.getLabel(item);	// String
	},

	getIconClass: function(/*dojo.data.Item*/ item, /*Boolean*/ opened){
		// summary: user overridable function to return CSS class name to display icon
		return (!item || this.model.mayHaveChildren(item)) ? (opened ? "dijitFolderOpened" : "dijitFolderClosed") : "dijitLeaf"
	},

	getLabelClass: function(/*dojo.data.Item*/ item, /*Boolean*/ opened){
		// summary: user overridable function to return CSS class name to display label
	},

	/////////// Keyboard and Mouse handlers ////////////////////

	_onKeyPress: function(/*Event*/ e){
		// summary: translates keypress events into commands for the controller
		if(e.altKey){ return; }
		var dk = dojo.keys;
		var treeNode = dijit.getEnclosingWidget(e.target);
		if(!treeNode){ return; }

		var key = e.charOrCode;
		if(typeof key == "string"){  // handle printables (letter navigation)
			// Check for key navigation.
			if(!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey){
				this._onLetterKeyNav( { node: treeNode, key: key.toLowerCase() } );
				dojo.stopEvent(e);
			}
		}else{  // handle non-printables (arrow keys)
			var map = this._keyHandlerMap;
			if(!map){
				// setup table mapping keys to events
				map = {};
				map[dk.ENTER]="_onEnterKey";
				map[this.isLeftToRight() ? dk.LEFT_ARROW : dk.RIGHT_ARROW]="_onLeftArrow";
				map[this.isLeftToRight() ? dk.RIGHT_ARROW : dk.LEFT_ARROW]="_onRightArrow";
				map[dk.UP_ARROW]="_onUpArrow";
				map[dk.DOWN_ARROW]="_onDownArrow";
				map[dk.HOME]="_onHomeKey";
				map[dk.END]="_onEndKey";
				this._keyHandlerMap = map;
			}
			if(this._keyHandlerMap[key]){
				this[this._keyHandlerMap[key]]( { node: treeNode, item: treeNode.item } );	
				dojo.stopEvent(e);
			}
		}
	},

	_onEnterKey: function(/*Object*/ message){
		this._publish("execute", { item: message.item, node: message.node} );
		this.onClick(message.item, message.node);
	},

	_onDownArrow: function(/*Object*/ message){
		// summary: down arrow pressed; get next visible node, set focus there
		var node = this._getNextNode(message.node);
		if(node && node.isTreeNode){
			this.focusNode(node);
		}	
	},

	_onUpArrow: function(/*Object*/ message){
		// summary: up arrow pressed; move to previous visible node

		var node = message.node;

		// if younger siblings		
		var previousSibling = node.getPreviousSibling();
		if(previousSibling){
			node = previousSibling;
			// if the previous node is expanded, dive in deep
			while(node.isExpandable && node.isExpanded && node.hasChildren()){
				// move to the last child
				var children = node.getChildren();
				node = children[children.length-1];
			}
		}else{
			// if this is the first child, return the parent
			// unless the parent is the root of a tree with a hidden root
			var parent = node.getParent();
			if(!(!this.showRoot && parent === this.rootNode)){
				node = parent;
			}
		}

		if(node && node.isTreeNode){
			this.focusNode(node);
		}
	},

	_onRightArrow: function(/*Object*/ message){
		// summary: right arrow pressed; go to child node
		var node = message.node;

		// if not expanded, expand, else move to 1st child
		if(node.isExpandable && !node.isExpanded){
			this._expandNode(node);
		}else if(node.hasChildren()){
			node = node.getChildren()[0];
			if(node && node.isTreeNode){
				this.focusNode(node);
			}
		}
	},

	_onLeftArrow: function(/*Object*/ message){
		// summary:
		//		Left arrow pressed.
		//		If not collapsed, collapse, else move to parent.

		var node = message.node;

		if(node.isExpandable && node.isExpanded){
			this._collapseNode(node);
		}else{
			var parent = node.getParent();
			if(parent && parent.isTreeNode && !(!this.showRoot && parent === this.rootNode)){
				this.focusNode(parent);
			}
		}
	},

	_onHomeKey: function(){
		// summary: home pressed; get first visible node, set focus there
		var node = this._getRootOrFirstNode();
		if(node){
			this.focusNode(node);
		}
	},

	_onEndKey: function(/*Object*/ message){
		// summary: end pressed; go to last visible node

		var node = this;
		while(node.isExpanded){
			var c = node.getChildren();
			node = c[c.length - 1];
		}

		if(node && node.isTreeNode){
			this.focusNode(node);
		}
	},

	_onLetterKeyNav: function(message){
		// summary: letter key pressed; search for node starting with first char = key
		var node = message.node, startNode = node, 
			key = message.key;
		do{
			node = this._getNextNode(node);
			//check for last node, jump to first node if necessary
			if(!node){
				node = this._getRootOrFirstNode();
			}
		}while(node !== startNode && (node.label.charAt(0).toLowerCase() != key));
		if(node && node.isTreeNode){
			// no need to set focus if back where we started
			if(node !== startNode){
				this.focusNode(node);
			}
		}
	},

	_onClick: function(/*Event*/ e){
		// summary: translates click events into commands for the controller to process
		var domElement = e.target;

		// find node
		var nodeWidget = dijit.getEnclosingWidget(domElement);	
		if(!nodeWidget || !nodeWidget.isTreeNode){
			return;
		}

		if( (this.openOnClick && nodeWidget.isExpandable) ||
			(domElement == nodeWidget.expandoNode || domElement == nodeWidget.expandoNodeText) ){
			// expando node was clicked, or label of a folder node was clicked; open it
			if(nodeWidget.isExpandable){
				this._onExpandoClick({node:nodeWidget});
			}
		}else{
			this._publish("execute", { item: nodeWidget.item, node: nodeWidget} );
			this.onClick(nodeWidget.item, nodeWidget);
			this.focusNode(nodeWidget);
		}
		dojo.stopEvent(e);
	},

	_onExpandoClick: function(/*Object*/ message){
		// summary: user clicked the +/- icon; expand or collapse my children.
		var node = message.node;
		
		// If we are collapsing, we might be hiding the currently focused node.
		// Also, clicking the expando node might have erased focus from the current node.
		// For simplicity's sake just focus on the node with the expando.
		this.focusNode(node);

		if(node.isExpanded){
			this._collapseNode(node);
		}else{
			this._expandNode(node);
		}
	},

	onClick: function(/* dojo.data */ item, /*TreeNode*/ node){
		// summary: user overridable function for executing a tree item
	},
	onOpen: function(/* dojo.data */ item, /*TreeNode*/ node){
		// summary: callback when a node is opened
	},
	onClose: function(/* dojo.data */ item, /*TreeNode*/ node){
		// summary: callback when a node is closed
	},

	_getNextNode: function(node){
		// summary: get next visible node

		if(node.isExpandable && node.isExpanded && node.hasChildren()){
			// if this is an expanded node, get the first child
			return node.getChildren()[0];		// _TreeNode	
		}else{
			// find a parent node with a sibling
			while(node && node.isTreeNode){
				var returnNode = node.getNextSibling();
				if(returnNode){
					return returnNode;		// _TreeNode
				}
				node = node.getParent();
			}
			return null;
		}
	},

	_getRootOrFirstNode: function(){
		// summary: get first visible node
		return this.showRoot ? this.rootNode : this.rootNode.getChildren()[0];
	},

	_collapseNode: function(/*_TreeNode*/ node){
		// summary: called when the user has requested to collapse the node

		if(node.isExpandable){
			if(node.state == "LOADING"){
				// ignore clicks while we are in the process of loading data
				return;
			}

			node.collapse();
			this.onClose(node.item, node);

			if(this.persist && node.item){
				delete this._openedItemIds[this.model.getIdentity(node.item)];
				this._saveState();
			}
		}
	},

	_expandNode: function(/*_TreeNode*/ node){
		// summary: called when the user has requested to expand the node

		if(!node.isExpandable){
			return;
		}

		var model = this.model,
			item = node.item;

		switch(node.state){
			case "LOADING":
				// ignore clicks while we are in the process of loading data
				return;

			case "UNCHECKED":
				// need to load all the children, and then expand
				node.markProcessing();
				var _this = this;
				model.getChildren(item, function(items){
						node.unmarkProcessing();
						node.setChildItems(items);
						_this._expandNode(node);
					},
					function(err){
						console.error(_this, ": error loading root children: ", err);
					});
				break;

			default:
				// data is already loaded; just proceed
				node.expand();
				this.onOpen(node.item, node);

				if(this.persist && item){
					this._openedItemIds[model.getIdentity(item)] = true;
					this._saveState();
				}
		}
	},

	////////////////// Miscellaneous functions ////////////////

	blurNode: function(){
		// summary:
		//	Removes focus from the currently focused node (which must be visible).
		//	Usually not called directly (just call focusNode() on another node instead)
		var node = this.lastFocused;
		if(!node){ return; }
		var labelNode = node.labelNode;
		dojo.removeClass(labelNode, "dijitTreeLabelFocused");
		labelNode.setAttribute("tabIndex", "-1");
		dijit.setWaiState(labelNode, "selected", false);
		this.lastFocused = null;
	},

	focusNode: function(/* _tree.Node */ node){
		// summary:
		//	Focus on the specified node (which must be visible)

		// set focus so that the label will be voiced using screen readers
		node.labelNode.focus();
	},

	_onBlur: function(){
		// summary:
		// 		We've moved away from the whole tree.  The currently "focused" node
		//		(see focusNode above) should remain as the lastFocused node so we can
		//		tab back into the tree.  Just change CSS to get rid of the dotted border
		//		until that time

		this.inherited(arguments);
		if(this.lastFocused){
			var labelNode = this.lastFocused.labelNode;
			dojo.removeClass(labelNode, "dijitTreeLabelFocused");	
		}
	},

	_onTreeFocus: function(/*Widget*/ node){
		// summary:
		//		called from onFocus handler of treeitem labelNode to set styles, wai state and tabindex
		//		for currently focused treeitem.
		
		if (node){
			if(node != this.lastFocused){
				this.blurNode();
			}
			var labelNode = node.labelNode;
			// set tabIndex so that the tab key can find this node
			labelNode.setAttribute("tabIndex", "0");
			dijit.setWaiState(labelNode, "selected", true);
			dojo.addClass(labelNode, "dijitTreeLabelFocused");
			this.lastFocused = node;
		}
	},

	//////////////// Events from the model //////////////////////////
	
	_onItemDelete: function(/*Object*/ item){
		//summary: delete event from the store
		// TODO: currently this isn't called, and technically doesn't need to be,
		// but it would help with garbage collection

		var identity = this.model.getIdentity(item);
		var node = this._itemNodeMap[identity];

		if(node){
			var parent = node.getParent();
			if(parent){
				// if node has not already been orphaned from a _onSetItem(parent, "children", ..) call...
				parent.removeChild(node);
			}
			delete this._itemNodeMap[identity];
			node.destroyRecursive();
		}
	},

	_onItemChange: function(/*Item*/ item){
		//summary: processes notification of a change to an item's scalar values like label
		var model = this.model,
			identity = model.getIdentity(item),
			node = this._itemNodeMap[identity];

		if(node){
			node.setLabelNode(this.getLabel(item));
			node._updateItemClasses(item);
		}
	},

	_onItemChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
		//summary: processes notification of a change to an item's children
		var model = this.model,
			identity = model.getIdentity(parent),
			parentNode = this._itemNodeMap[identity];

		if(parentNode){
			parentNode.setChildItems(newChildrenList);
		}
	},

	_onItemDelete: function(/*Item*/ item){
		//summary: processes notification of a deletion of an item
		var model = this.model,
			identity = model.getIdentity(item),
			node = this._itemNodeMap[identity];

		if(node){
			node.destroyRecursive();
			delete this._itemNodeMap[identity];
		}
	},

	/////////////// Miscellaneous funcs
	
	_saveState: function(){
		//summary: create and save a cookie with the currently expanded nodes identifiers
		if(!this.persist){
			return;
		}
		var ary = [];
		for(var id in this._openedItemIds){
			ary.push(id);
		}
		dojo.cookie(this.cookieName, ary.join(","), {expires:365});
	},

	destroy: function(){
		if(this.rootNode){
			this.rootNode.destroyRecursive();
		}
		if(this.dndController && !dojo.isString(this.dndController)){
			this.dndController.destroy();
		}
		this.rootNode = null;
		this.inherited(arguments);
	},
	
	destroyRecursive: function(){
		// A tree is treated as a leaf, not as a node with children (like a grid),
		// but defining destroyRecursive for back-compat.
		this.destroy();
	},

	_createTreeNode: function(/*Object*/ args){
		// summary:
		//		creates a TreeNode
		// description:
		//		Developers can override this method to define their own TreeNode class;
		//		However it will probably be removed in a future release in favor of a way
		//		of just specifying a widget for the label, rather than one that contains
		//		the children too.
		return new dijit._TreeNode(args);
	}
});


dojo.declare(
	"dijit.tree.TreeStoreModel",
	null,
{
	// summary:
	//		Implements dijit.Tree.model connecting to a store with a single
	//		root item.  Any methods passed into the constructor will override
	//		the ones defined here.

	// store: dojo.data.Store
	//		Underlying store
	store: null,

	// childrenAttrs: String[]
	//		one ore more attributes that holds children of a tree node
	childrenAttrs: ["children"],

	// labelAttr: String
	//		If specified, get label for tree node from this attribute, rather
	//		than by calling store.getLabel()
	labelAttr: "",
 
 	// root: dojo.data.Item
	//		Pointer to the root item (read only, not a parameter)
	root: null,

	// query: anything
	//		Specifies datastore query to return the root item for the tree.
	//		Must only return a single item.   Alternately can just pass in pointer
	//		to root item.
	// example:
	//		{id:'ROOT'}
	query: null,

	constructor: function(/* Object */ args){
		// summary: passed the arguments listed above (store, etc)
		dojo.mixin(this, args);

		this.connects = [];

		var store = this.store;
		if(!store.getFeatures()['dojo.data.api.Identity']){
			throw new Error("dijit.Tree: store must support dojo.data.Identity");			
		}

		// if the store supports Notification, subscribe to the notification events
		if(store.getFeatures()['dojo.data.api.Notification']){
			this.connects = this.connects.concat([
				dojo.connect(store, "onNew", this, "_onNewItem"),
				dojo.connect(store, "onDelete", this, "_onDeleteItem"),
				dojo.connect(store, "onSet", this, "_onSetItem")
			]);
		}
	},

	destroy: function(){
		dojo.forEach(this.connects, dojo.disconnect);
	},

	// =======================================================================
	// Methods for traversing hierarchy

	getRoot: function(onItem, onError){
		// summary:
		//		Calls onItem with the root item for the tree, possibly a fabricated item.
		//		Calls onError on error.
		if(this.root){
			onItem(this.root);
		}else{
			this.store.fetch({
				query: this.query,
				onComplete: dojo.hitch(this, function(items){
					if(items.length != 1){
						throw new Error(this.declaredClass + ": query " + dojo.toJson(this.query) + " returned " + items.length +
						 	" items, but must return exactly one item");
					}
					this.root = items[0];
					onItem(this.root);
				}),
				onError: onError
			});
		}
	},

	mayHaveChildren: function(/*dojo.data.Item*/ item){
		// summary:
		//		Tells if an item has or may have children.  Implementing logic here
		//		avoids showing +/- expando icon for nodes that we know don't have children.
		//		(For efficiency reasons we may not want to check if an element actually
		//		has children until user clicks the expando node)
		return dojo.some(this.childrenAttrs, function(attr){
			return this.store.hasAttribute(item, attr);
		}, this);
	},

	getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ onComplete, /*function*/ onError){
		// summary:
		// 		Calls onComplete() with array of child items of given parent item, all loaded.

		var store = this.store;

		// get children of specified item
		var childItems = [];
		for (var i=0; i<this.childrenAttrs.length; i++){
			var vals = store.getValues(parentItem, this.childrenAttrs[i]);
			childItems = childItems.concat(vals);
		}

		// count how many items need to be loaded
		var _waitCount = 0;
		dojo.forEach(childItems, function(item){ if(!store.isItemLoaded(item)){ _waitCount++; } });

		if(_waitCount == 0){
			// all items are already loaded.  proceed...
			onComplete(childItems);
		}else{
			// still waiting for some or all of the items to load
			var onItem = function onItem(item){
				if(--_waitCount == 0){
					// all nodes have been loaded, send them to the tree
					onComplete(childItems);
				}
			}
			dojo.forEach(childItems, function(item){
				if(!store.isItemLoaded(item)){
					store.loadItem({
						item: item,
						onItem: onItem,
						onError: onError
					});
				}
			});
		}
	},

	// =======================================================================
	// Inspecting items

	getIdentity: function(/* item */ item){
		return this.store.getIdentity(item);	// Object
	},

	getLabel: function(/*dojo.data.Item*/ item){
		// summary: get the label for an item
		if(this.labelAttr){
			return this.store.getValue(item,this.labelAttr);	// String
		}else{
			return this.store.getLabel(item);	// String
		}
	},

	// =======================================================================
	// Write interface

	newItem: function(/* Object? */ args, /*Item*/ parent){
		// summary:
		//		Creates a new item.   See dojo.data.api.Write for details on args.
		//		Used in drag & drop when item from external source dropped onto tree.
		var pInfo = {parent: parent, attribute: this.childrenAttrs[0]};
		return this.store.newItem(args, pInfo);
	},

	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy){
		// summary:
		//		Move or copy an item from one parent item to another.
		//		Used in drag & drop
		var store = this.store,
			parentAttr = this.childrenAttrs[0];	// name of "children" attr in parent item

		// remove child from source item, and record the attributee that child occurred in	
		if(oldParentItem){
			dojo.forEach(this.childrenAttrs, function(attr){
				if(store.containsValue(oldParentItem, attr, childItem)){
					if(!bCopy){
						var values = dojo.filter(store.getValues(oldParentItem, attr), function(x){
							return x != childItem;
						});
						store.setValues(oldParentItem, attr, values);
					}
					parentAttr = attr;
				}
			});
		}

		// modify target item's children attribute to include this item
		if(newParentItem){
			store.setValues(newParentItem, parentAttr,
				store.getValues(newParentItem, parentAttr).concat(childItem));
		}
	},

	// =======================================================================
	// Callbacks
	
	onChange: function(/*dojo.data.Item*/ item){
		// summary:
		//		Callback whenever an item has changed, so that Tree
		//		can update the label, icon, etc.   Note that changes
		//		to an item's children or parent(s) will trigger an
		//		onChildrenChange() so you can ignore those changes here.
	},

	onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
		// summary:
		//		Callback to do notifications about new, updated, or deleted items.
	},

	onDelete: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
		// summary:
		//		Callback when an item has been deleted.
		// description:
		//		Note that there will also be an onChildrenChange() callback for the parent
		//		of this item.
	},

	// =======================================================================
	///Events from data store

	_onNewItem: function(/* dojo.data.Item */ item, /* Object */ parentInfo){
		// summary: handler for when new items appear in the store.

		//	In this case there's no correspond onSet() call on the parent of this
		//	item, so need to get the new children list of the parent manually somehow.
		if(!parentInfo){
			return;
		}
		this.getChildren(parentInfo.item, dojo.hitch(this, function(children){
			// NOTE: maybe can be optimized since parentInfo contains the new and old attribute value
			this.onChildrenChange(parentInfo.item, children);
		}));
	},
	
	_onDeleteItem: function(/*Object*/ item){
		// summary: handler for delete notifications from underlying store
		this.onDelete(item);
	},

	_onSetItem: function(/* item */ item, 
					/* attribute-name-string */ attribute, 
					/* object | array */ oldValue,
					/* object | array */ newValue){
		//summary: set data event on an item in the store
	
		if(dojo.indexOf(this.childrenAttrs, attribute) != -1){
			// item's children list changed
			this.getChildren(item, dojo.hitch(this, function(children){
				// NOTE: maybe can be optimized since parentInfo contains the new and old attribute value
				this.onChildrenChange(item, children);
			}));
		}else{
			// item's label/icon/etc. changed.
			this.onChange(item);
		}
	}
});

dojo.declare("dijit.tree.ForestStoreModel", dijit.tree.TreeStoreModel, {
	// summary:
	//		Interface between Tree and a dojo.store that doesn't have a root item, ie,
	//		has multiple "top level" items.
	//
	// description
	//		Use this class to wrap a dojo.store, making all the items matching the specified query
	//		appear as children of a fabricated "root item".  If no query is specified then all the
	//		items returned by fetch() on the underlying store become children of the root item.
	//		It allows dijit.Tree to assume a single root item, even if the store doesn't have one.

	// Parameters to constructor

	// rootId: String
	//	ID of fabricated root item
	rootId: "$root$",

	// rootLabel: String
	//	Label of fabricated root item
	rootLabel: "ROOT",

	// query: String
	//	Specifies the set of children of the root item.
	// example:
	//		{type:'continent'}
	query: null,

	// End of parameters to constructor

	constructor: function(params){
		// Make dummy root item
		this.root = {
			store: this,
			root: true,
			id: params.rootId,
			label: params.rootLabel,
			children: params.rootChildren	// optional param
		};
	},

	// =======================================================================
	// Methods for traversing hierarchy

	mayHaveChildren: function(/*dojo.data.Item*/ item){
		// summary:
		//		Tells if an item has or may have children.  Implementing logic here
		//		avoids showing +/- expando icon for nodes that we know don't have children.
		//		(For efficiency reasons we may not want to check if an element actually
		//		has children until user clicks the expando node)
		return item === this.root || this.inherited(arguments);
	},

	getChildren: function(/*dojo.data.Item*/ parentItem, /*function(items)*/ callback, /*function*/ onError){
		// summary:
		// 		Calls onComplete() with array of child items of given parent item, all loaded.
		if(parentItem === this.root){
			if(this.root.children){
				// already loaded, just return
				callback(this.root.children);
			}else{
				this.store.fetch({
					query: this.query,
					onComplete: dojo.hitch(this, function(items){
						this.root.children = items;
						callback(items);
					}),
					onError: onError
				});
			}
		}else{
			this.inherited(arguments);
		}
	},

	// =======================================================================
	// Inspecting items

	getIdentity: function(/* item */ item){
		return (item === this.root) ? this.root.id : this.inherited(arguments);
	},

	getLabel: function(/* item */ item){
		return	(item === this.root) ? this.root.label : this.inherited(arguments);
	},

	// =======================================================================
	// Write interface

	newItem: function(/* Object? */ args, /*Item*/ parent){
		// summary:
		//		Creates a new item.   See dojo.data.api.Write for details on args.
		//		Used in drag & drop when item from external source dropped onto tree.
		if(parent===this.root){
			this.onNewRootItem(args);
			return this.store.newItem(args);
		}else{
			return this.inherited(arguments);
		}
	},
 
	onNewRootItem: function(args){
		// summary:
		//		User can override this method to modify a new element that's being
		//		added to the root of the tree, for example to add a flag like root=true
	},

	pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy){
		// summary:
		//		Move or copy an item from one parent item to another.
		//		Used in drag & drop
		if(oldParentItem === this.root){
			if(!bCopy){
				// It's onLeaveRoot()'s responsibility to modify the item so it no longer matches
				// this.query... thus triggering an onChildrenChange() event to notify the Tree
				// that this element is no longer a child of the root node
				this.onLeaveRoot(childItem);
			}
		}
		dijit.tree.TreeStoreModel.prototype.pasteItem.call(this, childItem,
			oldParentItem === this.root ? null : oldParentItem,
			newParentItem === this.root ? null : newParentItem
		);
		if(newParentItem === this.root){
			// It's onAddToRoot()'s responsibility to modify the item so it matches
			// this.query... thus triggering an onChildrenChange() event to notify the Tree
			// that this element is now a child of the root node
			this.onAddToRoot(childItem);
		}
	},

	// =======================================================================
	// Callbacks
	
	onAddToRoot: function(/* item */ item){
		// summary:
		//		Called when item added to root of tree; user must override
		//		to modify the item so that it matches the query for top level items
		// example
		//	|	store.setValue(item, "root", true);
		console.log(this, ": item ", item, " added to root");
	},

	onLeaveRoot: function(/* item */ item){
		// summary:
		//		Called when item removed from root of tree; user must override
		//		to modify the item so it doesn't match the query for top level items
		// example
		// 	|	store.unsetAttribute(item, "root");
		console.log(this, ": item ", item, " removed from root");
	},
	
	// =======================================================================
	// Events from data store

	_requeryTop: function(){
		// reruns the query for the children of the root node,
		// sending out an onSet notification if those children have changed
		var oldChildren = this.root.children || [];
		this.store.fetch({
			query: this.query,
			onComplete: dojo.hitch(this, function(newChildren){
				this.root.children = newChildren;

				// If the list of children or the order of children has changed...	
				if(oldChildren.length != newChildren.length ||
					dojo.some(oldChildren, function(item, idx){ return newChildren[idx] != item;})){
					this.onChildrenChange(this.root, newChildren);
				}
			})
		});
	},

	_onNewItem: function(/* dojo.data.Item */ item, /* Object */ parentInfo){
		// summary: handler for when new items appear in the store.

		//		In theory, any new item could be a top level item.
		//		Do the safe but inefficient thing by requerying the top
		//		level items.   User can override this function to do something
		//		more efficient.
		this._requeryTop();

		this.inherited(arguments);
	},

	_onDeleteItem: function(/*Object*/ item){
		// summary: handler for delete notifications from underlying store

		// check if this was a child of root, and if so send notification that root's children
		// have changed
		if(dojo.indexOf(this.root.children, item) != -1){
			this._requeryTop();
		}

		this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dojox.string.Builder"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.string.Builder"] = true;
dojo.provide("dojox.string.Builder");

dojox.string.Builder = function(/*String?*/str){
	//	summary:
	//		A fast buffer for creating large strings.
	//
	//	length: Number
	//		The current length of the internal string.

	//	N.B. the public nature of the internal buffer is no longer
	//	needed because the IE-specific fork is no longer needed--TRT.
	var b = "";
	this.length = 0;
	
	this.append = function(/* String... */s){ 
		// summary: Append all arguments to the end of the buffer 
		if(arguments.length>1){
			/*  
				This is a loop unroll was designed specifically for Firefox;
				it would seem that static index access on an Arguments
				object is a LOT faster than doing dynamic index access.
				Therefore, we create a buffer string and take advantage
				of JS's switch fallthrough.  The peformance of this method
				comes very close to straight up string concatenation (+=).

				If the arguments object length is greater than 9, we fall
				back to standard dynamic access.

				This optimization seems to have no real effect on either
				Safari or Opera, so we just use it for all.

				It turns out also that this loop unroll can increase performance
				significantly with Internet Explorer, particularly when 
				as many arguments are provided as possible.

				Loop unroll per suggestion from Kris Zyp, implemented by 
				Tom Trenka.

				Note: added empty string to force a string cast if needed.
			 */
			var tmp="", l=arguments.length;
			switch(l){
				case 9: tmp=""+arguments[8]+tmp;
				case 8: tmp=""+arguments[7]+tmp;
				case 7: tmp=""+arguments[6]+tmp;
				case 6: tmp=""+arguments[5]+tmp;
				case 5: tmp=""+arguments[4]+tmp;
				case 4: tmp=""+arguments[3]+tmp;
				case 3: tmp=""+arguments[2]+tmp;
				case 2: {
					b+=""+arguments[0]+arguments[1]+tmp;
					break;
				}
				default: {
					var i=0;
					while(i<arguments.length){
						tmp += arguments[i++];
					}
					b += tmp;
				}
			}
		} else {
			b += s;
		}
		this.length = b.length;
		return this;	//	dojox.string.Builder
	};
	
	this.concat = function(/*String...*/s){
		//	summary:
		//		Alias for append.
		return this.append.apply(this, arguments);	//	dojox.string.Builder
	};
	
	this.appendArray = function(/*Array*/strings) {
		//	summary:
		//		Append an array of items to the internal buffer.

		//	Changed from String.prototype.concat.apply because of IE.
		return this.append.apply(this, strings);	//	dojox.string.Builder
	};
	
	this.clear = function(){
		//	summary: 
		//		Remove all characters from the buffer.
		b = "";
		this.length = 0;
		return this;	//	dojox.string.Builder
	};
	
	this.replace = function(/* String */oldStr, /* String */ newStr){
		// 	summary: 
		//		Replace instances of one string with another in the buffer.
		b = b.replace(oldStr,newStr);
		this.length = b.length;
		return this;	//	dojox.string.Builder
	};
	
	this.remove = function(/* Number */start, /* Number? */len){
		//	summary:
		//		Remove len characters starting at index start.  If len
		//		is not provided, the end of the string is assumed.
		if(len===undefined){ len = b.length; }
		if(len == 0){ return this; }
		b = b.substr(0, start) + b.substr(start+len);
		this.length = b.length;
		return this;	//	dojox.string.Builder
	};
	
	this.insert = function(/* Number */index, /* String */str){
		//	summary: 
		//		Insert string str starting at index.
		if(index == 0){
			b = str + b;
		}else{
			b = b.slice(0, index) + str + b.slice(index);
		}
		this.length = b.length;
		return this;	//	dojox.string.Builder
	};
	
	this.toString = function(){
		//	summary:
		//		Return the string representation of the internal buffer.
		return b;	//	String
	};

	//	initialize the buffer.
	if(str){ this.append(str); }
};

}

if(!dojo._hasResource["dojox.string.tokenize"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.string.tokenize"] = true;
dojo.provide("dojox.string.tokenize");

dojox.string.tokenize = function(/*String*/ str, /*RegExp*/ re, /*Function?*/ parseDelim, /*Object?*/ instance){
	// summary:
	//		Split a string by a regular expression with the ability to capture the delimeters
	// parseDelim:
	//		Each group (excluding the 0 group) is passed as a parameter. If the function returns
	//		a value, it's added to the list of tokens.
	// instance:
	//		Used as the "this" instance when calling parseDelim
	var tokens = [];
	var match, content, lastIndex = 0;
	while(match = re.exec(str)){
		content = str.slice(lastIndex, re.lastIndex - match[0].length);
		if(content.length){
			tokens.push(content);
		}
		if(parseDelim){
			if(dojo.isOpera){
				var copy = match.slice(0);
				while(copy.length < match.length){
					copy.push(null);
				}
				match = copy;
			}
			var parsed = parseDelim.apply(instance, match.slice(1).concat(tokens.length));
			if(typeof parsed != "undefined"){
				tokens.push(parsed);
			}
		}
		lastIndex = re.lastIndex;
	}
	content = str.slice(lastIndex);
	if(content.length){
		tokens.push(content);
	}
	return tokens;
}

}

if(!dojo._hasResource["dojox.dtl._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.dtl._base"] = true;
dojo.provide("dojox.dtl._base");




(function(){
	var dd = dojox.dtl;

	dd.TOKEN_BLOCK = -1;
	dd.TOKEN_VAR = -2;
	dd.TOKEN_COMMENT = -3;
	dd.TOKEN_TEXT = 3;

	dd._Context = dojo.extend(function(dict){
		// summary: Pass one of these when rendering a template to tell the template what values to use.
		dojo._mixin(this, dict || {});
		this._dicts = [];
	},
	{
		push: function(){
			var last = this;
			var context = dojo.delegate(this);
			context.pop = function(){ return last; }
			return context;
		},
		pop: function(){
			throw new Error("pop() called on empty Context");
		},
		get: function(key, otherwise){
			if(typeof this[key] != "undefined"){
				return this._normalize(this[key]);
			}

			for(var i = 0, dict; dict = this._dicts[i]; i++){
				if(typeof dict[key] != "undefined"){
					return this._normalize(dict[key]);
				}
			}

			return otherwise;
		},
		_normalize: function(value){
			if(value instanceof Date){
				value.year = value.getFullYear();
				value.month = value.getMonth() + 1;
				value.day = value.getDate();
				value.date = value.year + "-" + ("0" + value.month).slice(-2) + "-" + ("0" + value.day).slice(-2);
				value.hour = value.getHours();
				value.minute = value.getMinutes();
				value.second = value.getSeconds();
				value.microsecond = value.getMilliseconds();
			}
			return value;
		},
		update: function(dict){
			var context = this.push();
			if(dict){
				dojo._mixin(this, dict);
			}
			return context;
		}
	});

	var smart_split_re = /("(?:[^"\\]*(?:\\.[^"\\]*)*)"|'(?:[^'\\]*(?:\\.[^'\\]*)*)'|[^\s]+)/g;           
	var split_re = /\s+/g;
	var split = function(/*String|RegExp?*/ splitter, /*Integer?*/ limit){
		splitter = splitter || split_re;
		if(!(splitter instanceof RegExp)){
			splitter = new RegExp(splitter, "g");
		}
		if(!splitter.global){
			throw new Error("You must use a globally flagged RegExp with split " + splitter);
		}
		splitter.exec(""); // Reset the global

		var part, parts = [], lastIndex = 0, i = 0;
		while(part = splitter.exec(this)){
			parts.push(this.slice(lastIndex, splitter.lastIndex - part[0].length));
			lastIndex = splitter.lastIndex;
			if(limit && (++i > limit - 1)){
				break;
			}
		}
		parts.push(this.slice(lastIndex));
		return parts;
	}

	dd.Token = function(token_type, contents){
		this.token_type = token_type;
		this.contents = new String(dojo.trim(contents));
		this.contents.split = split;
		this.split = function(){
			return String.prototype.split.apply(this.contents, arguments);
		}
	}
	dd.Token.prototype.split_contents = function(/*Integer?*/ limit){
		var bit, bits = [], i = 0;
		limit = limit || 999;
		while(i++ < limit && (bit = smart_split_re.exec(this.contents))){
			bit = bit[0];
			if(bit.charAt(0) == '"' && bit.slice(-1) == '"'){
				bits.push('"' + bit.slice(1, -1).replace('\\"', '"').replace('\\\\', '\\') + '"');
			}else if(bit.charAt(0) == "'" && bit.slice(-1) == "'"){
				bits.push("'" + bit.slice(1, -1).replace("\\'", "'").replace('\\\\', '\\') + "'");
			}else{
				bits.push(bit);
			}
		}
		return bits;
	}

	var ddt = dd.text = {
		_get: function(module, name, errorless){
			// summary: Used to find both tags and filters
			var params = dd.register.get(module, name.toLowerCase(), errorless);
			if(!params){
				if(!errorless){
					throw new Error("No tag found for " + name);
				}
				return null;
			}

			var fn = params[1];
			var require = params[2];

			var parts;
			if(fn.indexOf(":") != -1){
				parts = fn.split(":");
				fn = parts.pop();
			}

			dojo["require"](require);

			var parent = dojo.getObject(require);

			return parent[fn || name] || parent[name + "_"];
		},
		getTag: function(name, errorless){
			return ddt._get("tag", name, errorless);
		},
		getFilter: function(name, errorless){
			return ddt._get("filter", name, errorless);
		},
		getTemplate: function(file){
			return new dd.Template(ddt.getTemplateString(file));
		},
		getTemplateString: function(file){
			return dojo._getText(file.toString()) || "";
		},
		_resolveLazy: function(location, sync, json){
			if(sync){
				if(json){
					return dojo.fromJson(dojo._getText(location)) || {};
				}else{
					return dd.text.getTemplateString(location);
				}
			}else{
				return dojo.xhrGet({
					handleAs: (json) ? "json" : "text",
					url: location
				});
			}
		},
		_resolveTemplateArg: function(arg, sync){
			if(ddt._isTemplate(arg)){
				if(!sync){
					var d = new dojo.Deferred();
					d.callback(arg);
					return d;
				}
				return arg;
			}
			return ddt._resolveLazy(arg, sync);
		},
		_isTemplate: function(arg){
			return (typeof arg == "undefined") || (typeof arg == "string" && (arg.match(/^\s*[<{]/) || arg.indexOf(" ") != -1));
		},
		_resolveContextArg: function(arg, sync){
			if(arg.constructor == Object){
				if(!sync){
					var d = new dojo.Deferred;
					d.callback(arg);
					return d;
				}
				return arg;
			}
			return ddt._resolveLazy(arg, sync, true);
		},
		_re: /(?:\{\{\s*(.+?)\s*\}\}|\{%\s*(load\s*)?(.+?)\s*%\})/g,
		tokenize: function(str){
			return dojox.string.tokenize(str, ddt._re, ddt._parseDelims);
		},
		_parseDelims: function(varr, load, tag){
			if(varr){
				return [dd.TOKEN_VAR, varr];
			}else if(load){
				var parts = dojo.trim(tag).split(/\s+/g);
				for(var i = 0, part; part = parts[i]; i++){
					dojo["require"](part);
				}
			}else{
				return [dd.TOKEN_BLOCK, tag];
			}
		}
	}

	dd.Template = dojo.extend(function(/*String|dojo._Url*/ template, /*Boolean*/ isString){
		// template:
		//		The string or location of the string to
		//		use as a template
		var str = isString ? template : ddt._resolveTemplateArg(template, true) || "";
		var tokens = ddt.tokenize(str);
		var parser = new dd._Parser(tokens);
		this.nodelist = parser.parse();
	},
	{
		update: function(node, context){
			// node: DOMNode|String|dojo.NodeList
			//		A node reference or set of nodes
			// context: dojo._Url|String|Object
			//		The context object or location
			return ddt._resolveContextArg(context).addCallback(this, function(contextObject){
				var content = this.render(new dd._Context(contextObject));
				if(node.forEach){
					node.forEach(function(item){
						item.innerHTML = content;
					});
				}else{
					dojo.byId(node).innerHTML = content;
				}
				return this;
			});
		},
		render: function(context, /*concatenatable?*/ buffer){
			buffer = buffer || this.getBuffer();
			context = context || new dd._Context({});
			return this.nodelist.render(context, buffer) + "";
		},
		getBuffer: function(){
			
			return new dojox.string.Builder();
		}
	});

	var qfRe = /\{\{\s*(.+?)\s*\}\}/g;
	dd.quickFilter = function(str){
		if(!str){
			return new dd._NodeList();
		}

		if(str.indexOf("{%") == -1){
			return new dd._QuickNodeList(dojox.string.tokenize(str, qfRe, function(token){
				return new dd._Filter(token);
			}));
		}
	}

	dd._QuickNodeList = dojo.extend(function(contents){
		this.contents = contents;
	},
	{
		render: function(context, buffer){
			for(var i=0, l=this.contents.length; i<l; i++){
				if(this.contents[i].resolve){
					buffer = buffer.concat(this.contents[i].resolve(context));
				}else{
					buffer = buffer.concat(this.contents[i]);
				}
			}
			return buffer;
		},
		dummyRender: function(context){ return this.render(context, dd.Template.prototype.getBuffer()).toString(); },
		clone: function(buffer){ return this; }
	});

	dd._Filter = dojo.extend(function(token){
		// summary: Uses a string to find (and manipulate) a variable
		if(!token) throw new Error("Filter must be called with variable name");
		this.contents = token;

		var cache = this._cache[token];
		if(cache){
			this.key = cache[0];
			this.filters = cache[1];
		}else{
			this.filters = [];
			dojox.string.tokenize(token, this._re, this._tokenize, this);
			this._cache[token] = [this.key, this.filters];
		}
	},
	{
		_cache: {},
		_re: /(?:^_\("([^\\"]*(?:\\.[^\\"])*)"\)|^"([^\\"]*(?:\\.[^\\"]*)*)"|^([a-zA-Z0-9_.]+)|\|(\w+)(?::(?:_\("([^\\"]*(?:\\.[^\\"])*)"\)|"([^\\"]*(?:\\.[^\\"]*)*)"|([a-zA-Z0-9_.]+)|'([^\\']*(?:\\.[^\\']*)*)'))?|^'([^\\']*(?:\\.[^\\']*)*)')/g,
		_values: {
			0: '"', // _("text")
			1: '"', // "text"
			2: "", // variable
			8: '"' // 'text'
		},
		_args: {
			4: '"', // :_("text")
			5: '"', // :"text"
			6: "", // :variable
			7: "'"// :'text'
		},
		_tokenize: function(){
			var pos, arg;

			for(var i = 0, has = []; i < arguments.length; i++){
				has[i] = (typeof arguments[i] != "undefined" && typeof arguments[i] == "string" && arguments[i]);
			}

			if(!this.key){
				for(pos in this._values){
					if(has[pos]){
						this.key = this._values[pos] + arguments[pos] + this._values[pos];
						break;
					}
				}
			}else{
				for(pos in this._args){
					if(has[pos]){
						var value = arguments[pos];
						if(this._args[pos] == "'"){
							value = value.replace(/\\'/g, "'");
						}else if(this._args[pos] == '"'){
							value = value.replace(/\\"/g, '"');
						}
						arg = [!this._args[pos], value];
						break;
					}
				}
				// Get a named filter
				var fn = ddt.getFilter(arguments[3]);
				if(!dojo.isFunction(fn)) throw new Error(arguments[3] + " is not registered as a filter");
				this.filters.push([fn, arg]);
			}
		},
		getExpression: function(){
			return this.contents;
		},
		resolve: function(context){
			var str = this.resolvePath(this.key, context);

			for(var i = 0, filter; filter = this.filters[i]; i++){
				// Each filter has the function in [0], a boolean in [1][0] of whether it's a variable or a string
				// and [1][1] is either the variable name of the string content.
				if(filter[1]){
					if(filter[1][0]){
						str = filter[0](str, this.resolvePath(filter[1][1], context));
					}else{
						str = filter[0](str, filter[1][1]);
					}
				}else{
					str = filter[0](str);
				}
			}

			return str;
		},
		resolvePath: function(path, context){
			var current, parts;
			var first = path.charAt(0);
			var last = path.slice(-1);
			if(!isNaN(parseInt(first))){
				current = (path.indexOf(".") == -1) ? parseInt(path) : parseFloat(path);
			}else if(first == '"' && first == last){
				current = path.slice(1, -1);
			}else{
				if(path == "true"){ return true; }
				if(path == "false"){ return false; }
				if(path == "null" || path == "None"){ return null; }
				parts = path.split(".");
				current = context.get(parts[0]);
				for(var i = 1; i < parts.length; i++){
					var part = parts[i];
					if(current){
						var base = current;
						if(dojo.isObject(current) && part == "items" && typeof current[part] == "undefined"){
							var items = [];
							for(var key in current){
								items.push([key, current[key]]);
							}
							current = items;
							continue;
						}

						if(current.get && dojo.isFunction(current.get)){
							current = current.get(part);
						}else if(typeof current[part] == "undefined"){
							current = current[part];
							break;
						}else{
							current = current[part];
						}

						if(dojo.isFunction(current)){
							if(current.alters_data){
								current = "";
							}else{
								current = current.call(base);
							}
						}else if(current instanceof Date){
							current = dd._Context.prototype._normalize(current);
						}
					}else{
						return "";
					}
				}
			}
			return current;
		}
	});

	dd._TextNode = dd._Node = dojo.extend(function(/*Object*/ obj){
		// summary: Basic catch-all node
		this.contents = obj;
	},
	{
		set: function(data){
			this.contents = data;
			return this;
		},
		render: function(context, buffer){
			// summary: Adds content onto the buffer
			return buffer.concat(this.contents);
		},
		isEmpty: function(){
			return !dojo.trim(this.contents);
		},
		clone: function(){ return this; }
	});

	dd._NodeList = dojo.extend(function(/*Node[]*/ nodes){
		// summary: Allows us to render a group of nodes
		this.contents = nodes || [];
		this.last = "";
	},
	{
		push: function(node){
			// summary: Add a new node to the list
			this.contents.push(node);
			return this;
		},
		concat: function(nodes){
			this.contents = this.contents.concat(nodes);
			return this;
		},
		render: function(context, buffer){
			// summary: Adds all content onto the buffer
			for(var i = 0; i < this.contents.length; i++){
				buffer = this.contents[i].render(context, buffer);
				if(!buffer) throw new Error("Template must return buffer");
			}
			return buffer;
		},
		dummyRender: function(context){
			return this.render(context, dd.Template.prototype.getBuffer()).toString();
		},
		unrender: function(){ return arguments[1]; },
		clone: function(){ return this; },
		rtrim: function(){
			while(1){
				i = this.contents.length - 1;
				if(this.contents[i] instanceof dd._TextNode && this.contents[i].isEmpty()){
					this.contents.pop();
				}else{
					break;
				}
			}

			return this;
		}
	});

	dd._VarNode = dojo.extend(function(str){
		// summary: A node to be processed as a variable
		this.contents = new dd._Filter(str);
	},
	{
		render: function(context, buffer){
			var str = this.contents.resolve(context);
			if(!str.safe){
				str = dd._base.escape("" + str);
			}
			return buffer.concat(str);
		}
	});

	dd._noOpNode = new function(){
		// summary: Adds a no-op node. Useful in custom tags
		this.render = this.unrender = function(){ return arguments[1]; }
		this.clone = function(){ return this; }
	}

	dd._Parser = dojo.extend(function(tokens){
		// summary: Parser used during initialization and for tag groups.
		this.contents = tokens;
	},
	{
		i: 0,
		parse: function(/*Array?*/ stop_at){
			// summary: Turns tokens into nodes
			// description: Steps into tags are they're found. Blocks use the parse object
			//		to find their closing tag (the stop_at array). stop_at is inclusive, it
			//		returns the node that matched.
			var terminators = {};
			stop_at = stop_at || [];
			for(var i = 0; i < stop_at.length; i++){
				terminators[stop_at[i]] = true;
			}

			var nodelist = new dd._NodeList();
			while(this.i < this.contents.length){
				token = this.contents[this.i++];
				if(typeof token == "string"){
					nodelist.push(new dd._TextNode(token));
				}else{
					var type = token[0];
					var text = token[1];
					if(type == dd.TOKEN_VAR){
						nodelist.push(new dd._VarNode(text));
					}else if(type == dd.TOKEN_BLOCK){
						if(terminators[text]){
							--this.i;
							return nodelist;
						}
						var cmd = text.split(/\s+/g);
						if(cmd.length){
							cmd = cmd[0];
							var fn = ddt.getTag(cmd);
							if(fn){
								nodelist.push(fn(this, new dd.Token(type, text)));
							}
						}
					}
				}
			}

			if(stop_at.length){
				throw new Error("Could not find closing tag(s): " + stop_at.toString());
			}

			this.contents.length = 0;
			return nodelist;
		},
		next_token: function(){
			// summary: Returns the next token in the list.
			var token = this.contents[this.i++];
			return new dd.Token(token[0], token[1]);
		},
		delete_first_token: function(){
			this.i++;
		},
		skip_past: function(endtag){
			while(this.i < this.contents.length){
				var token = this.contents[this.i++];
				if(token[0] == dd.TOKEN_BLOCK && token[1] == endtag){
					return;
				}
			}
			throw new Error("Unclosed tag found when looking for " + endtag);
		},
		create_variable_node: function(expr){
			return new dd._VarNode(expr);
		},
		create_text_node: function(expr){
			return new dd._TextNode(expr || "");
		},
		getTemplate: function(file){
			return new dd.Template(file);
		}
	});

	dd.register = {
		_registry: {
			attributes: [],
			tags: [],
			filters: []
		},
		get: function(/*String*/ module, /*String*/ name){
			var registry = dd.register._registry[module + "s"];
			for(var i = 0, entry; entry = registry[i]; i++){
				if(typeof entry[0] == "string"){
					if(entry[0] == name){
						return entry;
					}
				}else if(name.match(entry[0])){
					return entry;
				}
			}
		},
		getAttributeTags: function(){
			var tags = [];
			var registry = dd.register._registry.attributes;
			for(var i = 0, entry; entry = registry[i]; i++){
				if(entry.length == 3){
					tags.push(entry);
				}else{
					var fn = dojo.getObject(entry[1]);
					if(fn && dojo.isFunction(fn)){
						entry.push(fn);
						tags.push(entry);
					}
				}
			}
			return tags;
		},
		_any: function(type, base, locations){
			for(var path in locations){
				for(var i = 0, fn; fn = locations[path][i]; i++){
					var key = fn;
					if(dojo.isArray(fn)){
						key = fn[0];
						fn = fn[1];
					}
					if(typeof key == "string"){
						if(key.substr(0, 5) == "attr:"){
							var attr = fn;
							if(attr.substr(0, 5) == "attr:"){
								attr = attr.slice(5);
							}
							dd.register._registry.attributes.push([attr, base + "." + path + "." + attr]);
						}
						key = key.toLowerCase();
					}
					dd.register._registry[type].push([
						key,
						fn,
						base + "." + path
					]);
				}
			}
		},
		tags: function(/*String*/ base, /*Object*/ locations){
			dd.register._any("tags", base, locations);
		},
		filters: function(/*String*/ base, /*Object*/ locations){
			dd.register._any("filters", base, locations);
		}
	}

	var escapeamp = /&/g;
	var escapelt = /</g;
	var escapegt = />/g;
	var escapeqt = /'/g;
	var escapedblqt = /"/g;
	dd._base.escape = function(value){
		// summary: Escapes a string's HTML
		return dd.mark_safe(value.replace(escapeamp, '&amp;').replace(escapelt, '&lt;').replace(escapegt, '&gt;').replace(escapedblqt, '&quot;').replace(escapeqt, '&#39;'));
	}

	dd._base.safe = function(value){
		if(typeof value == "string"){
			value = new String(value);
		}
		if(typeof value == "object"){
			value.safe = true;
		}
		return value;
	}
	dd.mark_safe = dd._base.safe;

	dd.register.tags("dojox.dtl.tag", {
		"date": ["now"],
		"logic": ["if", "for", "ifequal", "ifnotequal"],
		"loader": ["extends", "block", "include", "load", "ssi"],
		"misc": ["comment", "debug", "filter", "firstof", "spaceless", "templatetag", "widthratio", "with"],
		"loop": ["cycle", "ifchanged", "regroup"]
	});
	dd.register.filters("dojox.dtl.filter", {
		"dates": ["date", "time", "timesince", "timeuntil"],
		"htmlstrings": ["linebreaks", "linebreaksbr", "removetags", "striptags"],
		"integers": ["add", "get_digit"],
		"lists": ["dictsort", "dictsortreversed", "first", "join", "length", "length_is", "random", "slice", "unordered_list"],
		"logic": ["default", "default_if_none", "divisibleby", "yesno"],
		"misc": ["filesizeformat", "pluralize", "phone2numeric", "pprint"],
		"strings": ["addslashes", "capfirst", "center", "cut", "fix_ampersands", "floatformat", "iriencode", "linenumbers", "ljust", "lower", "make_list", "rjust", "slugify", "stringformat", "title", "truncatewords", "truncatewords_html", "upper", "urlencode", "urlize", "urlizetrunc", "wordcount", "wordwrap"]
	});
	dd.register.filters("dojox.dtl", {
		"_base": ["escape", "safe"]
	});
})();

}

if(!dojo._hasResource["dojox.dtl.Context"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.dtl.Context"] = true;
dojo.provide("dojox.dtl.Context");


dojox.dtl.Context = dojo.extend(function(dict){
	this._this = {};
	dojox.dtl._Context.call(this, dict);
}, dojox.dtl._Context.prototype,
{
	getKeys: function(){
		var keys = [];
		for(var key in this){
			if(this.hasOwnProperty(key) && key != "_dicts" && key != "_this"){
				keys.push(key);
			}
		}
		return keys;
	},
	extend: function(/*dojox.dtl.Context|Object*/ obj){
		// summary: Returns a clone of this context object, with the items from the
		//		passed objecct mixed in.
		return  dojo.delegate(this, obj);
	},
	filter: function(/*dojox.dtl.Context|Object|String...*/ filter){
		// summary: Returns a clone of this context, only containing the items
		//		defined in the filter.
		var context = new dojox.dtl.Context();
		var keys = [];
		var i, arg;
		if(filter instanceof dojox.dtl.Context){
			keys = filter.getKeys();
		}else if(typeof filter == "object"){
			for(var key in filter){
				keys.push(key);
			}
		}else{
			for(i = 0; arg = arguments[i]; i++){
				if(typeof arg == "string"){
					keys.push(arg);
				}
			}
		}

		for(i = 0, key; key = keys[i]; i++){
			context[key] = this[key];
		}

		return context;
	},
	setThis: function(/*Object*/ _this){
		this._this = _this;
	},
	getThis: function(){
		return this._this;
	},
	hasKey: function(key){
		if(typeof this[key] != "undefined"){
			return true;
		}

		for(var i = 0, dict; dict = this._dicts[i]; i++){
			if(typeof dict[key] != "undefined"){
				return true;
			}
		}

		return false;
	}
});

}

if(!dojo._hasResource["dojox.form._FormSelectWidget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.form._FormSelectWidget"] = true;
dojo.provide("dojox.form._FormSelectWidget");



dojo.declare("dojox.form._FormSelectWidget", dijit.form._FormValueWidget, {
	// multiple: Boolean
	//		Matches the select's "multiple=" value
	multiple: "",
	
	// _multiValue: Boolean
	//		Whether or not we are multi-valued (for form)
	_multiValue: false,

	/*=====
	dojox.form.__SelectOption = function(){
		//	value: String
		//		The value of the option.  Setting to empty (or missing) will
		//		place a separator at that location
		//	label: String
		//		The label for our option.  It can contain html tags.
		//  selected: Boolean
		//		Whether or not we are a selected option
		//	disabled: Boolean
		//		Whether or not this specific option is disabled
		this.value = value;
		this.label = label;
		this.selected = selected;
		this.disabled = disabled;
	}
	=====*/

	// options: dojox.form.__SelectOption[]
	//		The set of options for our select item.  Roughly corresponds to
	//      the html <option> tag.
	options: null,
	
	getOptions: function(/* anything */ valueOrIdx){
		// summary:
		//		Returns a given option (or options).
		// valueOrIdx:
		//		If passed in as a string, that string is used to look up the option
		//		in the array of options - based on the value property. 
		//		(See dojox.form.__SelectOption).
		//
		//		If passed in a number, then the option with the given index (0-based)
		//		within this select will be returned.
		//		
		//		If passed in a dojox.form.__SelectOption, the same option will be
		//		returned if and only if it exists within this select.
		//		
		//		If passed an array, then an array will be returned with each element
		//		in the array being looked up.
		//
		//		If not passed a value, then all options will be returned
		//
		// returns:
		//		The option corresponding with the given value or index.  null
		//		is returned if any of the following are true:
		//			- A string value is passed in which doesn't exist
		//			- An index is passed in which is outside the bounds of the array of options
		//			- A dojox.form.__SelectOption is passed in which is not a part of the select
		
		// NOTE: the compare for passing in a dojox.form.__SelectOption checks
		//		if the value property matches - NOT if the exact option exists
		// NOTE: if passing in an array, null elements will be placed in the returned
		//		array when a value is not found.
		var lookupValue = valueOrIdx, opts = this.options || [], l = opts.length;

		if(lookupValue === undefined){
			return opts; // dojox.form.__SelectOption[]
		}
		if(dojo.isArray(lookupValue)){
			return dojo.map(lookupValue, "return this.getOptions(item);", this); // dojox.form.__SelectOption[]
		}
		if(dojo.isObject(valueOrIdx)){
			// We were passed an option - so see if it's in our array (directly),
			// and if it's not, try and find it by value.
			if (!dojo.some(this.options, function(o, idx){
				if (o === lookupValue ||
					(o.value && o.value === lookupValue.value)){
					lookupValue = idx;
					return true;
				}
				return false;
			})){
				lookupValue = -1;
			}
		}
		if(typeof lookupValue == "string"){
			for(var i=0; i<l; i++){
				if(opts[i].value === lookupValue){
					lookupValue = i;
					break;
				}
			}
		}
		if(typeof lookupValue == "number" && lookupValue >= 0 && lookupValue < l){
			return this.options[lookupValue] // dojox.form.__SelectOption
		}
		return null; // null
	},
	
	addOption: function(/* dojox.form.__SelectOption, dojox.form.__SelectOption[] */ option){
		//	summary:
		//		Adds an option or options to the end of the select.  If value
		//		of the option is empty or missing, a separator is created instead.
		//		Passing in an array of options will yeild slightly better performance
		//		since the children are only loaded once.
		if(!dojo.isArray(option)){ option = [option]; }
		dojo.forEach(option, function(i){
			if(i && dojo.isObject(i)){
				this.options.push(i);
			}
		}, this);
		this._loadChildren();
	},
	
	removeOption: function(/* string, dojox.form.__SelectOption, number, or array */ valueOrIdx){
		// summary:
		//		Removes the given option or options.  You can remove by string 
		//		(in which case the value is removed), number (in which case the
		//		index in the options array is removed), or select option (in 
		//		which case, the select option with a matching value is removed).
		//		You can also pass in an array of those values for a slightly
		//		better performance since the children are only loaded once.
		if(!dojo.isArray(valueOrIdx)){ valueOrIdx = [valueOrIdx]; }
		var oldOpts = this.getOptions(valueOrIdx);
		dojo.forEach(oldOpts, function(i){
			this.options = dojo.filter(this.options, function(node, idx){
				return (node.value !== i.value);
			});
			this._removeOptionItem(i);
		}, this);
		this._loadChildren();
	},
	
	updateOption: function(/* dojox.form.__SelectOption, dojox.form.__SelectOption[] */ newOption){
		// summary:
		//		Updates the values of the given option.  The option to update
		//		is matched based on the value of the entered option.  Passing
		//		in an array of new options will yeild better performance since
		//		the children will only be loaded once.
		if(!dojo.isArray(newOption)){ newOption = [newOption]; }
		dojo.forEach(newOption, function(i){
			var oldOpt = this.getOptions(i), k;
			if(oldOpt){
				for(k in i){ oldOpt[k] = i[k]; }
			}
		}, this);
		this._loadChildren();
	},

	_setValueAttr: function(/*anything*/ newValue, /*Boolean, optional*/ priorityChange){
		// summary: set the value of the widget.
		// If a string is passed, then we set our value from looking it up.
		var opts = this.getOptions() || [];
		if(!dojo.isArray(newValue)){
			newValue = [newValue];
		}
		dojo.forEach(newValue, function(i, idx){
			if(!dojo.isObject(i)){
				i = i + "";
			}
			if(typeof i === "string"){
				newValue[idx] = dojo.filter(opts, function(node){
					return node.value === i;
				})[0] || {value: "", label: ""};
			}
		}, this);
		
		// Make sure some sane default is set
		newValue = dojo.filter(newValue, function(i){ return i && i.value; });
		if(!this._multiValue && (!newValue[0] || !newValue[0].value) && opts.length){
			newValue[0] = opts[0];
		}
		dojo.forEach(opts, function(i){
			i.selected = dojo.some(newValue, function(v){ return v.value === i.value; });
		});
		var val = dojo.map(newValue, function(i){ return i.value; }),
			disp = dojo.map(newValue, function(i){ return i.label; });
		
		this.value = this._multiValue ? val : val[0];
		this._setDisplay(this._multiValue ? disp : disp[0]);
		this._updateSelection();
		this._handleOnChange(this.value, priorityChange);
	},
	
	_getValueDeprecated: false, // remove when _FormWidget:getValue is removed
	getValue: function(){
		// summary: get the value of the widget.
		return this._lastValue;
	},

	undo: function(){
		// summary: restore the value to the last value passed to onChange
		this._setValueAttr(this._lastValueReported, false);
	},

	_loadChildren: function(){
		// summary: 
		//		Loads the children represented by this widget's optiosn.
		// reset the menu to make it "populatable on the next click
		dojo.forEach(this._getChildren(), function(child){
			child.destroyRecursive();
		});	
		// Add each menu item
		dojo.forEach(this.options, this._addOptionItem, this);
		
		// Update states
		this._updateSelection();
	},

	_updateSelection: function(){
		// summary:
		//		Sets the "selected" class on the item for styling purposes
		this.value = this._getValueFromOpts();
		var val = this.value;
		if(!dojo.isArray(val)){
			val = [val];
		}
		if(val && val[0]){
			dojo.forEach(this._getChildren(), function(child){
				var isSelected = dojo.some(val, function(v){
					return child.option && (v === child.option.value);
				});
				dojo.toggleClass(child.domNode, this.baseClass + "SelectedOption", isSelected);
				dijit.setWaiState(child.domNode, "selected", isSelected);
			}, this);
		}
		this._handleOnChange(this.value);
	},
	
	_getValueFromOpts: function(){
		// summary:
		//		Returns the value of the widget by reading the options for
		//		the selected flag
		var opts = this.getOptions() || [];
		if(!this._multiValue && opts.length){
			// Mirror what a select does - choose the first one
			var opt = dojo.filter(opts, function(i){
				return i.selected;
			})[0];
			if(opt && opt.value){
				return opt.value
			}else{
				opts[0].selected = true;
				return opts[0].value;
			}
		}else if(this._multiValue){
			// Set value to be the sum of all selected
			return dojo.map(dojo.filter(opts, function(i){
				return i.selected;
			}), function(i){
				return i.value;
			}) || [];
		}
		return "";
	},
	
	postMixInProperties: function(){
		this._multiValue = (this.multiple.toLowerCase() === "true");
		this.inherited(arguments);
	},
	
	_fillContent: function(){
		// summary:  
		//		Loads our options and sets up our dropdown correctly.  We 
		//		don't want any content, so we don't call any inherit chain
		//		function.
		var opts = this.options;
		if(!opts){
			opts = this.options = this.srcNodeRef ? dojo.query(">", 
						this.srcNodeRef).map(function(node){
							if(node.getAttribute("type") === "separator"){
								return { value: "", label: "", selected: false, disabled: false };
							}
							return { value: node.getAttribute("value"),
										label: String(node.innerHTML),
										selected: node.getAttribute("selected") || false,
										disabled: node.getAttribute("disabled") || false };
						}, this) : [];
		}
		if(!this.value){
			this.value = this._getValueFromOpts();
		}else if(this._multiValue && typeof this.value == "string"){
			this.value = this.value.split(",");
		}
	},

	postCreate: function(){
		// summary: sets up our event handling that we need for functioning
		//			as a select
		dojo.setSelectable(this.focusNode, false);
		this.inherited(arguments);

		// Make our event connections for updating state
		this.connect(this, "onChange", "_updateSelection");
		this.connect(this, "startup", "_loadChildren");
		
		this._setValueAttr(this.value, null);
	},
	
	_addOptionItem: function(/* dojox.form.__SelectOption */ option){
		// summary:
		//		User-overridable function which, for the given option, adds an 
		//		item to the select.  If the option doesn't have a value, then a 
		//		separator is added in that place.  Make sure to store the option
		//		in the created option widget.
	},
	
	_removeOptionItem: function(/* dojox.form.__SelectOption */ option){
		// summary:
		//		User-overridable function which, for the given option, removes
		//		its item from the select.
	},
	
	_setDisplay: function(/*String or String[]*/ newDisplay){
		// summary: Overridable function which will set the display for the 
		//			widget.  newDisplay is either a string (in the case of 
		//			single selects) or array of strings (in the case of multi-
		//			selects)
	},
	
	_getChildren: function(){
		// summary: Overridable function to return the children that this widget
		//			contains.
		return [];
	},
	
	_getSelectedOptionsAttr: function(){
		// summary: hooks into this.attr to provide a mechanism for getting the
		//			option items for the current value of the widget.
		return this.getOptions(this.attr("value"));
	}

});

}

if(!dojo._hasResource["dojox.form._HasDropDown"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.form._HasDropDown"] = true;
dojo.provide("dojox.form._HasDropDown");



dojo.declare("dojox.form._HasDropDown",
	null,
	{
		//	summary:
		//		Mixin for widgets that need drop down ability.
		//
		//	dropDownNode: DomNode
		//		responds to click events.  "dropDownNode" can be set via
		//		a dojoAttachPoint assignment.  If missing, then either focusNode
		//		or domNode (if focusNode is also missing) will be used.
		dropDownNode: null,
		
		//	popupStateNode: DomNode
		//		the node to set the popupActive class on.  If missing, then 
		//		focusNode or dropDownNode (if focusNode is missing) will be used.
		popupStateNode: null,
		
		//	aroundNode: DomNode
		//		the node to display the popup around.  If missing, then 
		//		domNode will be used.
		aroundNode: null,
		
		//	dropDown: Widget
		//		the widget to display in the popup.  This widget *must* be 
		//		defined before the startup function is called.
		dropDown: null,
		
		//	autoWidth: Boolean
		//		Set to true to make the drop down at least as wide as this 
		//		widget.  Set to false if the drop down should just be its
		//		default width
		autoWidth: true,
		
		//	_stopClickEvents: Boolean
		//		When set to false, the click events will not be stopped, in
		//		case you want to use them in your subwidget
		_stopClickEvents: true,
		
		_onMenuMouseup: function(/*Event*/ e){
			// summary: called with the mouseup event if the mouseup occurred
			//			over the menu.  You can try and use this event in
			//			order to automatically execute your dropdown (as
			//			if it were clicked).  You mightwant to close your menu 
			//			as a part of this function.
		},
		
		_onDropDownMouse: function(/*Event*/ e){
			// summary: callback when the user mouse clicks on menu popup node
			//
			// We handle mouse events using onmousedown in order to allow for
			// selecting via a drag.  So, our click is already handled, unless
			// we are executed via keypress - in which case, this._seenKeydown
			// will be set to true.			
			if(e.type == "click" && !this._seenKeydown){ return; }
			this._seenKeydown = false;
			
			// If we are a mouse event, set up the mouseup handler
			if(e.type == "mousedown"){
				this._docHandler = this.connect(dojo.doc, "onmouseup", "_onDropDownMouseup");
			}
			if(this.disabled || this.readOnly){ return; }
			if(this._stopClickEvents){
				dojo.stopEvent(e);
			}
			this.toggleDropDown();

			// If we are a click, then we'll pretend we did a mouse up
			if(e.type == "click" || e.type == "keypress"){
				this._onDropDownMouseup();
			}
		},

		_onDropDownMouseup: function(/*Event?*/ e){
			// summary: callback when the user lifts their mouse - if we are
			//			over the menu, we execute it, otherwise, we focus our 
			//			dropDown node.  If the event is missing, then we are not
			//			a mouseup event.
			if(e && this._docHandler){
				this.disconnect(this._docHandler);
			}
			var dropDown = this.dropDown, overMenu = false;
			
			if(e && this._opened){
				// Find out if our target is somewhere in our dropdown widget
				var t = e.target;
				while(t && !overMenu){
					if(dojo.hasClass(t, "dijitPopup")){
						overMenu = true;
					}else{
						t = t.parentNode;
					}
				}
				if(overMenu){
					this._onMenuMouseup(e);
					return;
				}
			}
			if(this._opened && dropDown.focus){
				// delay so that we don't steal our own focus.
				window.setTimeout(dojo.hitch(dropDown, "focus"), 1);
			}else{
				dijit.focus(this.focusNode);
			}
		},
		
		_setupDropdown: function(){
			//	summary:
			//		set up nodes and connect our mouse and keypress events
			this.dropDownNode = this.dropDownNode || this.focusNode || this.domNode;
			this.popupStateNode = this.popupStateNode || this.focusNode || this.dropDownNode;
			this.aroundNode = this.aroundNode || this.domNode;
			this.connect(this.dropDownNode, "onmousedown", "_onDropDownMouse");
			this.connect(this.dropDownNode, "onclick", "_onDropDownMouse");
			this.connect(this.dropDownNode, "onkeydown", "_onDropDownKeydown");
			this.connect(this.dropDownNode, "onblur", "_onDropDownBlur");
			this.connect(this.dropDownNode, "onkeypress", "_onKey");	
			
			// If we have a _setStateClass function (which happens when
			// we are a form widget), then we need to connect our open/close
			// functions to it
			if(this._setStateClass){
				this.connect(this, "openDropDown", "_setStateClass");
				this.connect(this, "closeDropDown", "_setStateClass");
			}
		},
		
		postCreate: function(){
			this._setupDropdown();
			this.inherited("postCreate", arguments);
		},
		
		startup: function(){
			dijit.popup.prepare(this.dropDown.domNode);
			this.inherited("startup", arguments);
		},
		
		destroyDescendants: function(){
			if(this.dropDown){
				this.dropDown.destroyRecursive();
				delete this.dropDown;
			}
			this.inherited("destroyDescendants", arguments);
		},

		_onDropDownKeydown: function(/*Event*/ e){
			this._seenKeydown = true;
		},
		
		_onKeyPress: function(/*Event*/ e){
			if(this._opened && e.charOrCode == dojo.keys.ESCAPE && !e.shiftKey && !e.ctrlKey && !e.altKey){
				this.toggleDropDown();
				dojo.stopEvent(e);
				return;
			}
			this.inherited(arguments);
		},

		_onDropDownBlur: function(/*Event*/ e){
			this._seenKeydown = false;
		},

		_onKey: function(/*Event*/ e){
			// summary: callback when the user presses a key on menu popup node
			if(this.disabled || this.readOnly){ return; }
			var d = this.dropDown;
			if(d && this._opened && d.handleKey){
				if(d.handleKey(e) === false){ return; }
			}
			if(d && this._opened && e.keyCode == dojo.keys.ESCAPE){
				this.toggleDropDown();
				return;
			}
			if(e.keyCode == dojo.keys.DOWN_ARROW){
				this._onDropDownMouse(e);
			}
		},

		_onBlur: function(){
			// summary: called magically when focus has shifted away from this widget and it's dropdown
			this.closeDropDown();
			// don't focus on button.  the user has explicitly focused on something else.
			this.inherited("_onBlur", arguments);
		},
		
		isLoaded: function(){
			// summary: returns whether or not the dropdown is loaded.  This can
			//		be overridden in order to force a call to loadDropDown().
			return true;
		},
		
		loadDropDown: function(/* Function */ loadCallback){
			// summary: loads the data for the dropdown, and at some point, calls
			//		the given callback
			loadCallback();
		},

		toggleDropDown: function(){
			// summary: toggle the drop-down widget; if it is up, close it, if not, open it
			if(this.disabled || this.readOnly){ return; }
			this.focus();
			var dropDown = this.dropDown;
			if(!dropDown){ return; }
			if(!this._opened){
				// If we aren't loaded, load it first so there isn't a flicker
				if(!this.isLoaded()){
					this.loadDropDown(dojo.hitch(this, "openDropDown"));
					return;
				}else{
					this.openDropDown();
				}
			}else{
				this.closeDropDown();
			}
		},
		
		openDropDown: function(){
			// summary: opens the dropdown for this widget - it returns the 
			//			return value of dijit.popup.open
			var dropDown = this.dropDown;
			var oldWidth=dropDown.domNode.style.width;
			var self = this;

			var retVal = dijit.popup.open({
				parent: this,
				popup: dropDown,
				around: this.aroundNode,
				orient:
					// TODO: add user-defined positioning option, like in Tooltip.js
					this.isLeftToRight() ? {'BL':'TL', 'BR':'TR', 'TL':'BL', 'TR':'BR'}
					: {'BR':'TR', 'BL':'TL', 'TR':'BR', 'TL':'BL'},
				onExecute: function(){
					self.closeDropDown(true);
				},
				onCancel: function(){
					self.closeDropDown(true);
				},
				onClose: function(){
					dropDown.domNode.style.width = oldWidth;
					dojo.attr(self.popupStateNode, "popupActive", false);
					dojo.removeClass(self.popupStateNode, "dojoxHasDropDownOpen");
					self._opened = false;
					self.state = "";
				}
			});
			if(this.autoWidth && this.domNode.offsetWidth > dropDown.domNode.offsetWidth){
				var adjustNode = null;
				if(!this.isLeftToRight()){
					adjustNode = dropDown.domNode.parentNode;
					var oldRight = adjustNode.offsetLeft + adjustNode.offsetWidth;
				}
				// make menu at least as wide as the node
				if(dropDown.resize){
					dropDown.resize({w: this.domNode.offsetWidth});
				}else{
					dojo.marginBox(dropDown.domNode, {w: this.domNode.offsetWidth});
				}
				if(adjustNode){
					adjustNode.style.left = oldRight - this.domNode.offsetWidth + "px";
				}
			}
			dojo.attr(this.popupStateNode, "popupActive", "true");
			dojo.addClass(self.popupStateNode, "dojoxHasDropDownOpen");
			this._opened=true;
			this.state="Opened";
			if(dropDown.focus){
				dropDown.focus();
			}
			// TODO: set this.checked and call setStateClass(), to affect button look while drop down is shown
			return retVal;
		},
	
		closeDropDown: function(/*Boolean*/ focus){
			// summary: Closes the drop down on this widget
			if(this._opened){
				dijit.popup.close(this.dropDown);
				if(focus){ this.focus(); }
				this._opened = false;
				this.state = "";
			}
		}
		
	}
);

}

if(!dojo._hasResource["dojox.form.DropDownSelect"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.form.DropDownSelect"] = true;
dojo.provide("dojox.form.DropDownSelect");







dojo.declare("dojox.form.DropDownSelect", [dojox.form._FormSelectWidget, dojox.form._HasDropDown], {
	// summary:
	//		This is a "Styleable" select box - it is basically a DropDownButton which
	//		can take as its input a <select>.

	baseClass: "dojoxDropDownSelect",
	
	templateString:"<span class=\"dijit dijitReset dijitLeft dijitInline\"\n\tdojoAttachPoint=\"dropDownNode\"\n\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\"\n\t><span class='dijitReset dijitRight dijitInline'\n\t\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\t\t><table class=\"dojoxDropDownSelectTable\" dojoAttachPoint=\"tableNode\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tbody><tr\n\t\t\t\t><td class=\"dojoxDropDownSelectTableContent\" \n\t\t\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"  dojoAttachPoint=\"containerNode,popupStateNode\" id=\"${id}_label\"></span\n\t\t\t\t></td><td class=\"dojoxDropDownSelectTableButton\" \n\t\t\t\t\t><button class=\"dijitReset dijitStretch dijitButtonContents\" type=\"button\" name=\"${name}\"\n\t\t\t\t\t\tdojoAttachPoint=\"focusNode,titleNode\" waiRole=\"button\" waiState=\"haspopup-true,labelledby-${id}_label\"\n\t\t\t\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\">&thinsp;</span\n\t\t\t\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\" waiRole=\"presentation\">&#9660;</span\n\t\t\t\t\t></button\n\t\t\t\t></td\n\t\t\t></tr></tbody></table\n\t\t></span\n\t></span\n></span>\n",
	
	// attributeMap: Object
	//		Add in our style to be applied to the focus node
	attributeMap: dojo.mixin(dojo.clone(dojox.form._FormSelectWidget.prototype.attributeMap),{style:"tableNode"}),
	
	// required: Boolean
	//		Can be true or false, default is false.
	required: false,

	// state: String
	//		Shows current state (ie, validation result) of input (Normal, Warning, or Error)
	state: "",

	//	tooltipPosition: String[]
	//		See description of dijit.Tooltip.defaultPosition for details on this parameter.
	tooltipPosition: [],

	// emptyLabel: string
	//		What to display in an "empty" dropdown
	emptyLabel: "",
	
	// _isLoaded: boolean
	//		Whether or not we have been loaded
	_isLoaded: false,
	
	// _childrenLoaded: boolean
	//		Whether or not our children have been loaded
	_childrenLoaded: false,
	
	_fillContent: function(){
		// summary:  
		//		Set the value to be the first, or the selected index
		this.inherited(arguments);
		if(this.options.length && !this.value){
			var si = this.srcNodeRef.selectedIndex;
			this.value = this.options[si != -1 ? si : 0].value;
		}
		
		// Create the dropDown widget
		this.dropDown = new dijit.Menu();
		dojo.addClass(this.dropDown.domNode, this.baseClass + "Menu");
	},

	_getMenuItemForOption: function(/* dojox.form.__SelectOption */ option){
		// summary:
		//		For the given option, return the menu item that should be
		//		used to display it.  This can be overridden as needed
		if(!option.value){
			// We are a separator (no label set for it)
			return new dijit.MenuSeparator();
		}else{
			// Just a regular menu option
			var click = dojo.hitch(this, "_setValueAttr", option);
			return new dijit.MenuItem({
				option: option,
				label: option.label,
				onClick: click,
				disabled: option.disabled || false
			});
		}
	},

	_addOptionItem: function(/* dojox.form.__SelectOption */ option){
		// summary:
		//		For the given option, add a option to our dropdown
		//		If the option doesn't have a value, then a separator is added 
		//		in that place.
		this.dropDown.addChild(this._getMenuItemForOption(option));
	},

	_getChildren: function(){ return this.dropDown.getChildren(); },
	
	_loadChildren: function(){
		// summary: 
		//		Resets the menu and the length attribute of the button - and
		//		ensures that the label is appropriately set.
		this.inherited(arguments);
		var len = this.options.length;
		this._isLoaded = false;
		this._childrenLoaded = true;
		
		// Set our length attribute and our value
		if(!this._iReadOnly){
			this.attr("readOnly", (len === 1));
			delete this._iReadOnly;
		}
		if(!this._iDisabled){
			this.attr("disabled", (len === 0));
			delete this._iDisabled;
		}
		this._setValueAttr(this.value);
	},
	
	_setDisplay: function(/*String*/ newDisplay){
		// summary: sets the display for the given value (or values)
		this.containerNode.innerHTML = '<span class=" ' + this.baseClass + 'Label">' +
					(newDisplay || this.emptyLabel || "&nbsp;") +
					'</span>';
		this._layoutHack();
	},

	validate: function(/*Boolean*/ isFocused){
		// summary:
		//		Called by oninit, onblur, and onkeypress.
		// description:
		//		Show missing or invalid messages if appropriate, and highlight textbox field.
		var isValid = this.isValid(isFocused);
		this.state = isValid ? "" : "Error";
		this._setStateClass();
		dijit.setWaiState(this.focusNode, "invalid", isValid ? "false" : "true");
		var message = isValid ? "" : this._missingMsg;
		if(this._message !== message){
			this._message = message;
			dijit.hideTooltip(this.domNode);
			if(message){
				dijit.showTooltip(message, this.domNode, this.tooltipPosition);
			}
		}
		return isValid;		
	},

	isValid: function(/*Boolean*/ isFocused){
		// summary: Whether or not this is a valid value
		return (!this.required || !(/^\s*$/.test(this.value)));
	},
	
	reset: function(){
		// summary: Overridden so that the state will be cleared.
		this.inherited(arguments);
		dijit.hideTooltip(this.domNode);
		this.state = "";
		this._setStateClass();
		delete this._message;
	},

	postMixInProperties: function(){
		// summary: set the missing message
		this.inherited(arguments);
		this._missingMsg = dojo.i18n.getLocalization("dijit.form", "validate", 
									this.lang).missingMessage;
	},
	
	postCreate: function(){
		this.inherited(arguments);
		if(dojo.attr(this.srcNodeRef, "disabled")){
			this.attr("disabled", true);
		}
	},

	startup: function(){
		if(this._started){ return; }

		// the child widget from srcNodeRef is the dropdown widget.  Insert it in the page DOM,
		// make it invisible, and store a reference to pass to the popup code.
		if(!this.dropDown){
			var dropDownNode = dojo.query("[widgetId]", this.dropDownContainer)[0];
			this.dropDown = dijit.byNode(dropDownNode);
			delete this.dropDownContainer;
		}
		this.inherited(arguments);
	},
	
	_onMenuMouseup: function(e){
		// override this to actually "pretend" to do a click on our menu - it will
		// call onExecute - so it will close our popup for us.  For non-menu
		// popups, it will not execute.
		var dropDown = this.dropDown, t = e.target;
		
		if(dropDown.onItemClick){
			var menuItem;
			while(t && !(menuItem = dijit.byNode(t))){
				t = t.parentNode;
			}
			if(menuItem && menuItem.onClick && menuItem.getParent){
				menuItem.getParent().onItemClick(menuItem, e);
			}
		}
		// TODO: how to handle non-menu popups?
	},

	isLoaded: function(){
		return this._isLoaded;
	},
	
	loadDropDown: function(/* Function */ loadCallback){
		// summary: populates the menu
		this._loadChildren();
		this._isLoaded = true;
		loadCallback();
	},
	
	_setReadOnlyAttr: function(value){
		this._iReadOnly = value;
		if(!value && this._childrenLoaded && this.options.length === 1){
			return;
		}
		this.readOnly = value;
	},
	
	_setDisabledAttr: function(value){
		this._iDisabled = value;
		if(!value && this._childrenLoaded && this.options.length === 0){
			return;
		}
		this.inherited(arguments);
	}
});

}

if(!dojo._hasResource["dojo.data.ItemFileReadStore"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.data.ItemFileReadStore"] = true;
dojo.provide("dojo.data.ItemFileReadStore");





dojo.declare("dojo.data.ItemFileReadStore", null,{
	//	summary:
	//		The ItemFileReadStore implements the dojo.data.api.Read API and reads
	//		data from JSON files that have contents in this format --
	//		{ items: [
	//			{ name:'Kermit', color:'green', age:12, friends:['Gonzo', {_reference:{name:'Fozzie Bear'}}]},
	//			{ name:'Fozzie Bear', wears:['hat', 'tie']},
	//			{ name:'Miss Piggy', pets:'Foo-Foo'}
	//		]}
	//		Note that it can also contain an 'identifer' property that specified which attribute on the items 
	//		in the array of items that acts as the unique identifier for that item.
	//
	constructor: function(/* Object */ keywordParameters){
		//	summary: constructor
		//	keywordParameters: {url: String}
		//	keywordParameters: {data: jsonObject}
		//	keywordParameters: {typeMap: object)
		//		The structure of the typeMap object is as follows:
		//		{
		//			type0: function || object,
		//			type1: function || object,
		//			...
		//			typeN: function || object
		//		}
		//		Where if it is a function, it is assumed to be an object constructor that takes the 
		//		value of _value as the initialization parameters.  If it is an object, then it is assumed
		//		to be an object of general form:
		//		{
		//			type: function, //constructor.
		//			deserialize:	function(value) //The function that parses the value and constructs the object defined by type appropriately.
		//		}
	
		this._arrayOfAllItems = [];
		this._arrayOfTopLevelItems = [];
		this._loadFinished = false;
		this._jsonFileUrl = keywordParameters.url;
		this._jsonData = keywordParameters.data;
		this._datatypeMap = keywordParameters.typeMap || {};
		if(!this._datatypeMap['Date']){
			//If no default mapping for dates, then set this as default.
			//We use the dojo.date.stamp here because the ISO format is the 'dojo way'
			//of generically representing dates.
			this._datatypeMap['Date'] = {
											type: Date,
											deserialize: function(value){
												return dojo.date.stamp.fromISOString(value);
											}
										};
		}
		this._features = {'dojo.data.api.Read':true, 'dojo.data.api.Identity':true};
		this._itemsByIdentity = null;
		this._storeRefPropName = "_S";  // Default name for the store reference to attach to every item.
		this._itemNumPropName = "_0"; // Default Item Id for isItem to attach to every item.
		this._rootItemPropName = "_RI"; // Default Item Id for isItem to attach to every item.
		this._reverseRefMap = "_RRM"; // Default attribute for constructing a reverse reference map for use with reference integrity
		this._loadInProgress = false;	//Got to track the initial load to prevent duelling loads of the dataset.
		this._queuedFetches = [];
		if(keywordParameters.urlPreventCache !== undefined){
			this.urlPreventCache = keywordParameters.urlPreventCache?true:false;
		}
		if(keywordParameters.clearOnClose){
			this.clearOnClose = true;
		}
	},
	
	url: "",	// use "" rather than undefined for the benefit of the parser (#3539)

	data: null,	// define this so that the parser can populate it

	typeMap: null, //Define so parser can populate.
	
	//Parameter to allow users to specify if a close call should force a reload or not.
	//By default, it retains the old behavior of not clearing if close is called.  But
	//if set true, the store will be reset to default state.  Note that by doing this,
	//all item handles will become invalid and a new fetch must be issued.
	clearOnClose: false,

	//Parameter to allow specifying if preventCache should be passed to the xhrGet call or not when loading data from a url.  
	//Note this does not mean the store calls the server on each fetch, only that the data load has preventCache set as an option.
	//Added for tracker: #6072
	urlPreventCache: false,  

	_assertIsItem: function(/* item */ item){
		//	summary:
		//		This function tests whether the item passed in is indeed an item in the store.
		//	item: 
		//		The item to test for being contained by the store.
		if(!this.isItem(item)){ 
			throw new Error("dojo.data.ItemFileReadStore: Invalid item argument.");
		}
	},

	_assertIsAttribute: function(/* attribute-name-string */ attribute){
		//	summary:
		//		This function tests whether the item passed in is indeed a valid 'attribute' like type for the store.
		//	attribute: 
		//		The attribute to test for being contained by the store.
		if(typeof attribute !== "string"){ 
			throw new Error("dojo.data.ItemFileReadStore: Invalid attribute argument.");
		}
	},

	getValue: function(	/* item */ item, 
						/* attribute-name-string */ attribute, 
						/* value? */ defaultValue){
		//	summary: 
		//		See dojo.data.api.Read.getValue()
		var values = this.getValues(item, attribute);
		return (values.length > 0)?values[0]:defaultValue; // mixed
	},

	getValues: function(/* item */ item, 
						/* attribute-name-string */ attribute){
		//	summary: 
		//		See dojo.data.api.Read.getValues()

		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
		return item[attribute] || []; // Array
	},

	getAttributes: function(/* item */ item){
		//	summary: 
		//		See dojo.data.api.Read.getAttributes()
		this._assertIsItem(item);
		var attributes = [];
		for(var key in item){
			// Save off only the real item attributes, not the special id marks for O(1) isItem.
			if((key !== this._storeRefPropName) && (key !== this._itemNumPropName) && (key !== this._rootItemPropName) && (key !== this._reverseRefMap)){
				attributes.push(key);
			}
		}
		return attributes; // Array
	},

	hasAttribute: function(	/* item */ item,
							/* attribute-name-string */ attribute) {
		//	summary: 
		//		See dojo.data.api.Read.hasAttribute()
		return this.getValues(item, attribute).length > 0;
	},

	containsValue: function(/* item */ item, 
							/* attribute-name-string */ attribute, 
							/* anything */ value){
		//	summary: 
		//		See dojo.data.api.Read.containsValue()
		var regexp = undefined;
		if(typeof value === "string"){
			regexp = dojo.data.util.filter.patternToRegExp(value, false);
		}
		return this._containsValue(item, attribute, value, regexp); //boolean.
	},

	_containsValue: function(	/* item */ item, 
								/* attribute-name-string */ attribute, 
								/* anything */ value,
								/* RegExp?*/ regexp){
		//	summary: 
		//		Internal function for looking at the values contained by the item.
		//	description: 
		//		Internal function for looking at the values contained by the item.  This 
		//		function allows for denoting if the comparison should be case sensitive for
		//		strings or not (for handling filtering cases where string case should not matter)
		//	
		//	item:
		//		The data item to examine for attribute values.
		//	attribute:
		//		The attribute to inspect.
		//	value:	
		//		The value to match.
		//	regexp:
		//		Optional regular expression generated off value if value was of string type to handle wildcarding.
		//		If present and attribute values are string, then it can be used for comparison instead of 'value'
		return dojo.some(this.getValues(item, attribute), function(possibleValue){
			if(possibleValue !== null && !dojo.isObject(possibleValue) && regexp){
				if(possibleValue.toString().match(regexp)){
					return true; // Boolean
				}
			}else if(value === possibleValue){
				return true; // Boolean
			}
		});
	},

	isItem: function(/* anything */ something){
		//	summary: 
		//		See dojo.data.api.Read.isItem()
		if(something && something[this._storeRefPropName] === this){
			if(this._arrayOfAllItems[something[this._itemNumPropName]] === something){
				return true;
			}
		}
		return false; // Boolean
	},

	isItemLoaded: function(/* anything */ something){
		//	summary: 
		//		See dojo.data.api.Read.isItemLoaded()
		return this.isItem(something); //boolean
	},

	loadItem: function(/* object */ keywordArgs){
		//	summary: 
		//		See dojo.data.api.Read.loadItem()
		this._assertIsItem(keywordArgs.item);
	},

	getFeatures: function(){
		//	summary: 
		//		See dojo.data.api.Read.getFeatures()
		return this._features; //Object
	},

	getLabel: function(/* item */ item){
		//	summary: 
		//		See dojo.data.api.Read.getLabel()
		if(this._labelAttr && this.isItem(item)){
			return this.getValue(item,this._labelAttr); //String
		}
		return undefined; //undefined
	},

	getLabelAttributes: function(/* item */ item){
		//	summary: 
		//		See dojo.data.api.Read.getLabelAttributes()
		if(this._labelAttr){
			return [this._labelAttr]; //array
		}
		return null; //null
	},

	_fetchItems: function(	/* Object */ keywordArgs, 
							/* Function */ findCallback, 
							/* Function */ errorCallback){
		//	summary: 
		//		See dojo.data.util.simpleFetch.fetch()
		var self = this;
		var filter = function(requestArgs, arrayOfItems){
			var items = [];
			if(requestArgs.query){
				var ignoreCase = requestArgs.queryOptions ? requestArgs.queryOptions.ignoreCase : false; 

				//See if there are any string values that can be regexp parsed first to avoid multiple regexp gens on the
				//same value for each item examined.  Much more efficient.
				var regexpList = {};
				for(var key in requestArgs.query){
					var value = requestArgs.query[key];
					if(typeof value === "string"){
						regexpList[key] = dojo.data.util.filter.patternToRegExp(value, ignoreCase);
					}
				}

				for(var i = 0; i < arrayOfItems.length; ++i){
					var match = true;
					var candidateItem = arrayOfItems[i];
					if(candidateItem === null){
						match = false;
					}else{
						for(var key in requestArgs.query) {
							var value = requestArgs.query[key];
							if (!self._containsValue(candidateItem, key, value, regexpList[key])){
								match = false;
							}
						}
					}
					if(match){
						items.push(candidateItem);
					}
				}
				findCallback(items, requestArgs);
			}else{
				// We want a copy to pass back in case the parent wishes to sort the array. 
				// We shouldn't allow resort of the internal list, so that multiple callers 
				// can get lists and sort without affecting each other.  We also need to
				// filter out any null values that have been left as a result of deleteItem()
				// calls in ItemFileWriteStore.
				for(var i = 0; i < arrayOfItems.length; ++i){
					var item = arrayOfItems[i];
					if(item !== null){
						items.push(item);
					}
				}
				findCallback(items, requestArgs);
			}
		};

		if(this._loadFinished){
			filter(keywordArgs, this._getItemsArray(keywordArgs.queryOptions));
		}else{

			if(this._jsonFileUrl){
				//If fetches come in before the loading has finished, but while
				//a load is in progress, we have to defer the fetching to be 
				//invoked in the callback.
				if(this._loadInProgress){
					this._queuedFetches.push({args: keywordArgs, filter: filter});
				}else{
					this._loadInProgress = true;
					var getArgs = {
							url: self._jsonFileUrl, 
							handleAs: "json-comment-optional",
							preventCache: this.urlPreventCache
						};
					var getHandler = dojo.xhrGet(getArgs);
					getHandler.addCallback(function(data){
						try{
							self._getItemsFromLoadedData(data);
							self._loadFinished = true;
							self._loadInProgress = false;
							
							filter(keywordArgs, self._getItemsArray(keywordArgs.queryOptions));
							self._handleQueuedFetches();
						}catch(e){
							self._loadFinished = true;
							self._loadInProgress = false;
							errorCallback(e, keywordArgs);
						}
					});
					getHandler.addErrback(function(error){
						self._loadInProgress = false;
						errorCallback(error, keywordArgs);
					});
				}
			}else if(this._jsonData){
				try{
					this._loadFinished = true;
					this._getItemsFromLoadedData(this._jsonData);
					this._jsonData = null;
					filter(keywordArgs, this._getItemsArray(keywordArgs.queryOptions));
				}catch(e){
					errorCallback(e, keywordArgs);
				}
			}else{
				errorCallback(new Error("dojo.data.ItemFileReadStore: No JSON source data was provided as either URL or a nested Javascript object."), keywordArgs);
			}
		}
	},

	_handleQueuedFetches: function(){
		//	summary: 
		//		Internal function to execute delayed request in the store.
		//Execute any deferred fetches now.
		if (this._queuedFetches.length > 0) {
			for(var i = 0; i < this._queuedFetches.length; i++){
				var fData = this._queuedFetches[i];
				var delayedQuery = fData.args;
				var delayedFilter = fData.filter;
				if(delayedFilter){
					delayedFilter(delayedQuery, this._getItemsArray(delayedQuery.queryOptions)); 
				}else{
					this.fetchItemByIdentity(delayedQuery);
				}
			}
			this._queuedFetches = [];
		}
	},

	_getItemsArray: function(/*object?*/queryOptions){
		//	summary: 
		//		Internal function to determine which list of items to search over.
		//	queryOptions: The query options parameter, if any.
		if(queryOptions && queryOptions.deep) {
			return this._arrayOfAllItems; 
		}
		return this._arrayOfTopLevelItems;
	},

	close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
		 //	summary: 
		 //		See dojo.data.api.Read.close()
		 if(this.clearOnClose && (this._jsonFileUrl !== "")){
			 //Reset all internalsback to default state.  This will force a reload
			 //on next fetch, but only if the data came from a url.  Passed in data
			 //means it should not clear the data.
			 this._arrayOfAllItems = [];
			 this._arrayOfTopLevelItems = [];
			 this._loadFinished = false;
			 this._itemsByIdentity = null;
			 this._loadInProgress = false;
			 this._queuedFetches = [];
		 }
	},

	_getItemsFromLoadedData: function(/* Object */ dataObject){
		//	summary:
		//		Function to parse the loaded data into item format and build the internal items array.
		//	description:
		//		Function to parse the loaded data into item format and build the internal items array.
		//
		//	dataObject:
		//		The JS data object containing the raw data to convery into item format.
		//
		// 	returns: array
		//		Array of items in store item format.
		
		// First, we define a couple little utility functions...
		var addingArrays = false;
		
		function valueIsAnItem(/* anything */ aValue){
			// summary:
			//		Given any sort of value that could be in the raw json data,
			//		return true if we should interpret the value as being an
			//		item itself, rather than a literal value or a reference.
			// example:
			// 	|	false == valueIsAnItem("Kermit");
			// 	|	false == valueIsAnItem(42);
			// 	|	false == valueIsAnItem(new Date());
			// 	|	false == valueIsAnItem({_type:'Date', _value:'May 14, 1802'});
			// 	|	false == valueIsAnItem({_reference:'Kermit'});
			// 	|	true == valueIsAnItem({name:'Kermit', color:'green'});
			// 	|	true == valueIsAnItem({iggy:'pop'});
			// 	|	true == valueIsAnItem({foo:42});
			var isItem = (
				(aValue != null) &&
				(typeof aValue == "object") &&
				(!dojo.isArray(aValue) || addingArrays) &&
				(!dojo.isFunction(aValue)) &&
				(aValue.constructor == Object || dojo.isArray(aValue)) &&
				(typeof aValue._reference == "undefined") && 
				(typeof aValue._type == "undefined") && 
				(typeof aValue._value == "undefined")
			);
			return isItem;
		}
		
		var self = this;
		function addItemAndSubItemsToArrayOfAllItems(/* Item */ anItem){
			self._arrayOfAllItems.push(anItem);
			for(var attribute in anItem){
				var valueForAttribute = anItem[attribute];
				if(valueForAttribute){
					if(dojo.isArray(valueForAttribute)){
						var valueArray = valueForAttribute;
						for(var k = 0; k < valueArray.length; ++k){
							var singleValue = valueArray[k];
							if(valueIsAnItem(singleValue)){
								addItemAndSubItemsToArrayOfAllItems(singleValue);
							}
						}
					}else{
						if(valueIsAnItem(valueForAttribute)){
							addItemAndSubItemsToArrayOfAllItems(valueForAttribute);
						}
					}
				}
			}
		}

		this._labelAttr = dataObject.label;

		// We need to do some transformations to convert the data structure
		// that we read from the file into a format that will be convenient
		// to work with in memory.

		// Step 1: Walk through the object hierarchy and build a list of all items
		var i;
		var item;
		this._arrayOfAllItems = [];
		this._arrayOfTopLevelItems = dataObject.items;

		for(i = 0; i < this._arrayOfTopLevelItems.length; ++i){
			item = this._arrayOfTopLevelItems[i];
			if(dojo.isArray(item)){
				addingArrays = true;
			}
			addItemAndSubItemsToArrayOfAllItems(item);
			item[this._rootItemPropName]=true;
		}

		// Step 2: Walk through all the attribute values of all the items, 
		// and replace single values with arrays.  For example, we change this:
		//		{ name:'Miss Piggy', pets:'Foo-Foo'}
		// into this:
		//		{ name:['Miss Piggy'], pets:['Foo-Foo']}
		// 
		// We also store the attribute names so we can validate our store  
		// reference and item id special properties for the O(1) isItem
		var allAttributeNames = {};
		var key;

		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i];
			for(key in item){
				if (key !== this._rootItemPropName)
				{
					var value = item[key];
					if(value !== null){
						if(!dojo.isArray(value)){
							item[key] = [value];
						}
					}else{
						item[key] = [null];
					}
				}
				allAttributeNames[key]=key;
			}
		}

		// Step 3: Build unique property names to use for the _storeRefPropName and _itemNumPropName
		// This should go really fast, it will generally never even run the loop.
		while(allAttributeNames[this._storeRefPropName]){
			this._storeRefPropName += "_";
		}
		while(allAttributeNames[this._itemNumPropName]){
			this._itemNumPropName += "_";
		}
		while(allAttributeNames[this._reverseRefMap]){
			this._reverseRefMap += "_";
		}

		// Step 4: Some data files specify an optional 'identifier', which is 
		// the name of an attribute that holds the identity of each item. 
		// If this data file specified an identifier attribute, then build a 
		// hash table of items keyed by the identity of the items.
		var arrayOfValues;

		var identifier = dataObject.identifier;
		if(identifier){
			this._itemsByIdentity = {};
			this._features['dojo.data.api.Identity'] = identifier;
			for(i = 0; i < this._arrayOfAllItems.length; ++i){
				item = this._arrayOfAllItems[i];
				arrayOfValues = item[identifier];
				var identity = arrayOfValues[0];
				if(!this._itemsByIdentity[identity]){
					this._itemsByIdentity[identity] = item;
				}else{
					if(this._jsonFileUrl){
						throw new Error("dojo.data.ItemFileReadStore:  The json data as specified by: [" + this._jsonFileUrl + "] is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}else if(this._jsonData){
						throw new Error("dojo.data.ItemFileReadStore:  The json data provided by the creation arguments is malformed.  Items within the list have identifier: [" + identifier + "].  Value collided: [" + identity + "]");
					}
				}
			}
		}else{
			this._features['dojo.data.api.Identity'] = Number;
		}

		// Step 5: Walk through all the items, and set each item's properties 
		// for _storeRefPropName and _itemNumPropName, so that store.isItem() will return true.
		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i];
			item[this._storeRefPropName] = this;
			item[this._itemNumPropName] = i;
		}

		// Step 6: We walk through all the attribute values of all the items,
		// looking for type/value literals and item-references.
		//
		// We replace item-references with pointers to items.  For example, we change:
		//		{ name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
		// into this:
		//		{ name:['Kermit'], friends:[miss_piggy] } 
		// (where miss_piggy is the object representing the 'Miss Piggy' item).
		//
		// We replace type/value pairs with typed-literals.  For example, we change:
		//		{ name:['Nelson Mandela'], born:[{_type:'Date', _value:'July 18, 1918'}] }
		// into this:
		//		{ name:['Kermit'], born:(new Date('July 18, 1918')) } 
		//
		// We also generate the associate map for all items for the O(1) isItem function.
		for(i = 0; i < this._arrayOfAllItems.length; ++i){
			item = this._arrayOfAllItems[i]; // example: { name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
			for(key in item){
				arrayOfValues = item[key]; // example: [{_reference:{name:'Miss Piggy'}}]
				for(var j = 0; j < arrayOfValues.length; ++j) {
					value = arrayOfValues[j]; // example: {_reference:{name:'Miss Piggy'}}
					if(value !== null && typeof value == "object"){
						if(value._type && value._value){
							var type = value._type; // examples: 'Date', 'Color', or 'ComplexNumber'
							var mappingObj = this._datatypeMap[type]; // examples: Date, dojo.Color, foo.math.ComplexNumber, {type: dojo.Color, deserialize(value){ return new dojo.Color(value)}}
							if(!mappingObj){ 
								throw new Error("dojo.data.ItemFileReadStore: in the typeMap constructor arg, no object class was specified for the datatype '" + type + "'");
							}else if(dojo.isFunction(mappingObj)){
								arrayOfValues[j] = new mappingObj(value._value);
							}else if(dojo.isFunction(mappingObj.deserialize)){
								arrayOfValues[j] = mappingObj.deserialize(value._value);
							}else{
								throw new Error("dojo.data.ItemFileReadStore: Value provided in typeMap was neither a constructor, nor a an object with a deserialize function");
							}
						}
						if(value._reference){
							var referenceDescription = value._reference; // example: {name:'Miss Piggy'}
							if(!dojo.isObject(referenceDescription)){
								// example: 'Miss Piggy'
								// from an item like: { name:['Kermit'], friends:[{_reference:'Miss Piggy'}]}
								arrayOfValues[j] = this._itemsByIdentity[referenceDescription];
							}else{
								// example: {name:'Miss Piggy'}
								// from an item like: { name:['Kermit'], friends:[{_reference:{name:'Miss Piggy'}}] }
								for(var k = 0; k < this._arrayOfAllItems.length; ++k){
									var candidateItem = this._arrayOfAllItems[k];
									var found = true;
									for(var refKey in referenceDescription){
										if(candidateItem[refKey] != referenceDescription[refKey]){ 
											found = false; 
										}
									}
									if(found){ 
										arrayOfValues[j] = candidateItem; 
									}
								}
							}
							if(this.referenceIntegrity){
								var refItem = arrayOfValues[j];
								if(this.isItem(refItem)){
									this._addReferenceToMap(refItem, item, key);
								}
							}
						}else if(this.isItem(value)){
							//It's a child item (not one referenced through _reference).  
							//We need to treat this as a referenced item, so it can be cleaned up
							//in a write store easily.
							if(this.referenceIntegrity){
								this._addReferenceToMap(value, item, key);
							}
						}
					}
				}
			}
		}
	},

	_addReferenceToMap: function(/*item*/ refItem, /*item*/ parentItem, /*string*/ attribute){
		 //	summary:
		 //		Method to add an reference map entry for an item and attribute.
		 //	description:
		 //		Method to add an reference map entry for an item and attribute. 		 //
		 //	refItem:
		 //		The item that is referenced.
		 //	parentItem:
		 //		The item that holds the new reference to refItem.
		 //	attribute:
		 //		The attribute on parentItem that contains the new reference.
		 
		 //Stub function, does nothing.  Real processing is in ItemFileWriteStore.
	},

	getIdentity: function(/* item */ item){
		//	summary: 
		//		See dojo.data.api.Identity.getIdentity()
		var identifier = this._features['dojo.data.api.Identity'];
		if(identifier === Number){
			return item[this._itemNumPropName]; // Number
		}else{
			var arrayOfValues = item[identifier];
			if(arrayOfValues){
				return arrayOfValues[0]; // Object || String
			}
		}
		return null; // null
	},

	fetchItemByIdentity: function(/* Object */ keywordArgs){
		//	summary: 
		//		See dojo.data.api.Identity.fetchItemByIdentity()

		// Hasn't loaded yet, we have to trigger the load.
		if(!this._loadFinished){
			var self = this;
			if(this._jsonFileUrl){

				if(this._loadInProgress){
					this._queuedFetches.push({args: keywordArgs});
				}else{
					this._loadInProgress = true;
					var getArgs = {
							url: self._jsonFileUrl, 
							handleAs: "json-comment-optional",
							preventCache: this.urlPreventCache
					};
					var getHandler = dojo.xhrGet(getArgs);
					getHandler.addCallback(function(data){
						var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
						try{
							self._getItemsFromLoadedData(data);
							self._loadFinished = true;
							self._loadInProgress = false;
							var item = self._getItemByIdentity(keywordArgs.identity);
							if(keywordArgs.onItem){
								keywordArgs.onItem.call(scope, item);
							}
							self._handleQueuedFetches();
						}catch(error){
							self._loadInProgress = false;
							if(keywordArgs.onError){
								keywordArgs.onError.call(scope, error);
							}
						}
					});
					getHandler.addErrback(function(error){
						self._loadInProgress = false;
						if(keywordArgs.onError){
							var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
							keywordArgs.onError.call(scope, error);
						}
					});
				}

			}else if(this._jsonData){
				// Passed in data, no need to xhr.
				self._getItemsFromLoadedData(self._jsonData);
				self._jsonData = null;
				self._loadFinished = true;
				var item = self._getItemByIdentity(keywordArgs.identity);
				if(keywordArgs.onItem){
					var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
					keywordArgs.onItem.call(scope, item);
				}
			} 
		}else{
			// Already loaded.  We can just look it up and call back.
			var item = this._getItemByIdentity(keywordArgs.identity);
			if(keywordArgs.onItem){
				var scope =  keywordArgs.scope?keywordArgs.scope:dojo.global;
				keywordArgs.onItem.call(scope, item);
			}
		}
	},

	_getItemByIdentity: function(/* Object */ identity){
		//	summary:
		//		Internal function to look an item up by its identity map.
		var item = null;
		if(this._itemsByIdentity){
			item = this._itemsByIdentity[identity];
		}else{
			item = this._arrayOfAllItems[identity];
		}
		if(item === undefined){
			item = null;
		}
		return item; // Object
	},

	getIdentityAttributes: function(/* item */ item){
		//	summary: 
		//		See dojo.data.api.Identity.getIdentifierAttributes()
		 
		var identifier = this._features['dojo.data.api.Identity'];
		if(identifier === Number){
			// If (identifier === Number) it means getIdentity() just returns
			// an integer item-number for each item.  The dojo.data.api.Identity
			// spec says we need to return null if the identity is not composed 
			// of attributes 
			return null; // null
		}else{
			return [identifier]; // Array
		}
	},
	
	_forceLoad: function(){
		//	summary: 
		//		Internal function to force a load of the store if it hasn't occurred yet.  This is required
		//		for specific functions to work properly.  
		var self = this;
		if(this._jsonFileUrl){
				var getArgs = {
					url: self._jsonFileUrl, 
					handleAs: "json-comment-optional",
					preventCache: this.urlPreventCache,
					sync: true
				};
			var getHandler = dojo.xhrGet(getArgs);
			getHandler.addCallback(function(data){
				try{
					//Check to be sure there wasn't another load going on concurrently 
					//So we don't clobber data that comes in on it.  If there is a load going on
					//then do not save this data.  It will potentially clobber current data.
					//We mainly wanted to sync/wait here.
					//TODO:  Revisit the loading scheme of this store to improve multi-initial
					//request handling.
					if(self._loadInProgress !== true && !self._loadFinished){
						self._getItemsFromLoadedData(data);
						self._loadFinished = true;
					}else if(self._loadInProgress){
						//Okay, we hit an error state we can't recover from.  A forced load occurred
						//while an async load was occurring.  Since we cannot block at this point, the best
						//that can be managed is to throw an error.
						throw new Error("dojo.data.ItemFileReadStore:  Unable to perform a synchronous load, an async load is in progress."); 
					}
				}catch(e){
					console.log(e);
					throw e;
				}
			});
			getHandler.addErrback(function(error){
				throw error;
			});
		}else if(this._jsonData){
			self._getItemsFromLoadedData(self._jsonData);
			self._jsonData = null;
			self._loadFinished = true;
		} 
	}
});
//Mix in the simple fetch implementation to this class.
dojo.extend(dojo.data.ItemFileReadStore,dojo.data.util.simpleFetch);

}

if(!dojo._hasResource["dojox.form.FileInput"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.form.FileInput"] = true;
dojo.provide("dojox.form.FileInput");
dojo.experimental("dojox.form.FileInput"); 


 

dojo.declare("dojox.form.FileInput",
	dijit.form._FormWidget,
	{
	// summary: A styled input type="file"
	//
	// description: A input type="file" form widget, with a button for uploading to be styled via css,
	//	a cancel button to clear selection, and FormWidget mixin to provide standard dijit.form.Form
	//	support (FIXME: maybe not fully implemented) 

	// label: String
	//	the title text of the "Browse" button
	label: "Browse ...",

	// cancelText: String
	//	the title of the "Cancel" button
	cancelText: "Cancel",

	// name: String
	//	ugh, this should be pulled from this.domNode
	name: "uploadFile",

	templateString:"<div class=\"dijitFileInput\">\n\t<input id=\"${id}\" class=\"dijitFileInputReal\" type=\"file\" dojoAttachPoint=\"fileInput\" name=\"${name}\" />\n\t<div class=\"dijitFakeInput\">\n\t\t<input class=\"dijitFileInputVisible\" type=\"text\" dojoAttachPoint=\"focusNode, inputNode\" />\n\t\t<div class=\"dijitInline dijitFileInputText\" dojoAttachPoint=\"titleNode\">${label}</div>\n\t\t<div class=\"dijitInline dijitFileInputButton\" dojoAttachPoint=\"cancelNode\" \n\t\t\tdojoAttachEvent=\"onclick:reset\">${cancelText}</div>\n\t</div>\n</div>\n",
	
	startup: function(){
		// summary: listen for changes on our real file input
		this._listener = this.connect(this.fileInput,"onchange","_matchValue");
		this._keyListener = this.connect(this.fileInput,"onkeyup","_matchValue");
	},

	_matchValue: function(){
		// summary: set the content of the upper input based on the semi-hidden file input
		this.inputNode.value = this.fileInput.value;
		if(this.inputNode.value){
			this.cancelNode.style.visibility = "visible";
			dojo.fadeIn({ node: this.cancelNode, duration:275 }).play();
		}
	},

	setLabel: function(/* String */label,/* String? */cssClass){
		// summary: method to allow use to change button label
		this.titleNode.innerHTML = label;
	},

	reset: function(/* Event */e){
		// summary: on click of cancel button, since we can't clear the input because of
		// 	security reasons, we destroy it, and add a new one in it's place.
		this.disconnect(this._listener);
		this.disconnect(this._keyListener);
		if(this.fileInput){
			this.domNode.removeChild(this.fileInput);
		}
		dojo.fadeOut({ node: this.cancelNode, duration:275 }).play(); 

		// should we use cloneNode()? can we?
		this.fileInput = document.createElement('input');
		// dojo.attr(this.fileInput,{
		//	"type":"file", "id":this.id, "name": this.name	
		//});
		this.fileInput.setAttribute("type","file");
		this.fileInput.setAttribute("id", this.id);
		this.fileInput.setAttribute("name", this.name);
		dojo.addClass(this.fileInput,"dijitFileInputReal");
		this.domNode.appendChild(this.fileInput);

		this._keyListener = this.connect(this.fileInput, "onkeyup", "_matchValue");
		this._listener = this.connect(this.fileInput, "onchange", "_matchValue"); 
		this.inputNode.value = ""; 
	}

});

}

if(!dojo._hasResource["dojo.io.iframe"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.io.iframe"] = true;
dojo.provide("dojo.io.iframe");

/*=====
dojo.declare("dojo.io.iframe.__ioArgs", dojo.__IoArgs, {
	constructor: function(){
		//	summary:
		//		All the properties described in the dojo.__ioArgs type, apply
		//		to this type. The following additional properties are allowed
		//		for dojo.io.iframe.send():
		//	method: String?
		//		The HTTP method to use. "GET" or "POST" are the only supported
		//		values.  It will try to read the value from the form node's
		//		method, then try this argument. If neither one exists, then it
		//		defaults to POST.
		//	handleAs: String?
		//		Specifies what format the result data should be given to the
		//		load/handle callback. Valid values are: text, html, xml, json,
		//		javascript. IMPORTANT: For all values EXCEPT html and xml, The
		//		server response should be an HTML file with a textarea element.
		//		The response data should be inside the textarea element. Using an
		//		HTML document the only reliable, cross-browser way this
		//		transport can know when the response has loaded. For the html
		//		handleAs value, just return a normal HTML document.  NOTE: xml
		//		is now supported with this transport (as of 1.1+); a known issue
		//		is if the XML document in question is malformed, Internet Explorer
		//		will throw an uncatchable error.
		//	content: Object?
		//		If "form" is one of the other args properties, then the content
		//		object properties become hidden form form elements. For
		//		instance, a content object of {name1 : "value1"} is converted
		//		to a hidden form element with a name of "name1" and a value of
		//		"value1". If there is not a "form" property, then the content
		//		object is converted into a name=value&name=value string, by
		//		using dojo.objectToQuery().
		this.method = method;
		this.handleAs = handleAs;
		this.content = content;
	}
});
=====*/

dojo.io.iframe = {
	create: function(/*String*/fname, /*String*/onloadstr, /*String?*/uri){
		//	summary:
		//		Creates a hidden iframe in the page. Used mostly for IO
		//		transports.  You do not need to call this to start a
		//		dojo.io.iframe request. Just call send().
		//	fname: String
		//		The name of the iframe. Used for the name attribute on the
		//		iframe.
		//	onloadstr: String
		//		A string of JavaScript that will be executed when the content
		//		in the iframe loads.
		//	uri: String
		//		The value of the src attribute on the iframe element. If a
		//		value is not given, then dojo/resources/blank.html will be
		//		used.
		if(window[fname]){ return window[fname]; }
		if(window.frames[fname]){ return window.frames[fname]; }
		var cframe = null;
		var turi = uri;
		if(!turi){
			if(dojo.config["useXDomain"] && !dojo.config["dojoBlankHtmlUrl"]){
				console.warn("dojo.io.iframe.create: When using cross-domain Dojo builds,"
					+ " please save dojo/resources/blank.html to your domain and set djConfig.dojoBlankHtmlUrl"
					+ " to the path on your domain to blank.html");
			}
			turi = (dojo.config["dojoBlankHtmlUrl"]||dojo.moduleUrl("dojo", "resources/blank.html"));
		}
		var ifrstr = dojo.isIE ? '<iframe name="'+fname+'" src="'+turi+'" onload="'+onloadstr+'">' : 'iframe';
		cframe = dojo.doc.createElement(ifrstr);
		with(cframe){
			name = fname;
			setAttribute("name", fname);
			id = fname;
		}
		dojo.body().appendChild(cframe);
		window[fname] = cframe;
	
		with(cframe.style){
			if(dojo.isSafari < 3){
				//We can't change the src in Safari 2.0.3 if absolute position. Bizarro.
				position = "absolute";
			}
			left = top = "1px";
			height = width = "1px";
			visibility = "hidden";
		}

		if(!dojo.isIE){
			this.setSrc(cframe, turi, true);
			cframe.onload = new Function(onloadstr);
		}

		return cframe;
	},

	setSrc: function(/*DOMNode*/iframe, /*String*/src, /*Boolean*/replace){
		//summary:
		//		Sets the URL that is loaded in an IFrame. The replace parameter
		//		indicates whether location.replace() should be used when
		//		changing the location of the iframe.
		try{
			if(!replace){
				if(dojo.isSafari){
					iframe.location = src;
				}else{
					frames[iframe.name].location = src;
				}
			}else{
				// Fun with DOM 0 incompatibilities!
				var idoc;
				if(dojo.isIE || dojo.isSafari > 2){
					idoc = iframe.contentWindow.document;
				}else if(dojo.isSafari){
					idoc = iframe.document;
				}else{ //  if(d.isMozilla){
					idoc = iframe.contentWindow;
				}
	
				//For Safari (at least 2.0.3) and Opera, if the iframe
				//has just been created but it doesn't have content
				//yet, then iframe.document may be null. In that case,
				//use iframe.location and return.
				if(!idoc){
					iframe.location = src;
					return;
				}else{
					idoc.location.replace(src);
				}
			}
		}catch(e){ 
			console.debug("dojo.io.iframe.setSrc: ", e); 
		}
	},

	doc: function(/*DOMNode*/iframeNode){
		//summary: Returns the document object associated with the iframe DOM Node argument.
		var doc = iframeNode.contentDocument || // W3
			(
				(
					(iframeNode.name) && (iframeNode.document) && 
					(document.getElementsByTagName("iframe")[iframeNode.name].contentWindow) &&
					(document.getElementsByTagName("iframe")[iframeNode.name].contentWindow.document)
				)
			) ||  // IE
			(
				(iframeNode.name)&&(document.frames[iframeNode.name])&&
				(document.frames[iframeNode.name].document)
			) || null;
		return doc;
	},

	send: function(/*dojo.io.iframe.__ioArgs*/args){
		//summary: function that sends the request to the server.
		//This transport can only process one send() request at a time, so if send() is called
		//multiple times, it will queue up the calls and only process one at a time.
		if(!this["_frame"]){
			this._frame = this.create(this._iframeName, dojo._scopeName + ".io.iframe._iframeOnload();");
		}

		//Set up the deferred.
		var dfd = dojo._ioSetArgs(
			args,
			function(/*Deferred*/dfd){
				//summary: canceller function for dojo._ioSetArgs call.
				dfd.canceled = true;
				dfd.ioArgs._callNext();
			},
			function(/*Deferred*/dfd){
				//summary: okHandler function for dojo._ioSetArgs call.
				var value = null;
				try{
					var ioArgs = dfd.ioArgs;
					var dii = dojo.io.iframe;
					var ifd = dii.doc(dii._frame);
					var handleAs = ioArgs.handleAs;

					//Assign correct value based on handleAs value.
					value = ifd; //html
                    console.debug(value);
					if(handleAs != "html"){
						if(handleAs == "xml"){
							//	FF, Saf 3+ and Opera all seem to be fine with ifd being xml.  We have to
							//	do it manually for IE.  Refs #6334.
							if(dojo.isIE){
								dojo.query("a", dii._frame.contentWindow.document.documentElement).orphan();
								var xmlText=(dii._frame.contentWindow.document).documentElement.innerText;
								xmlText=xmlText.replace(/>\s+</g, "><");

								//	do the manual "find the prefix".
								if(!this._ieXmlDom){
									for(var i=0, a=["MSXML2", "Microsoft", "MSXML", "MSXML3"], l=a.length; i<l; i++){
										try{
											var test=new ActiveXObject(a[i]+".XmlDom");
											this._ieXmlDom=a[i]+".XmlDom";
											break;
										} catch(e){ /* squash it */}
									}
									
									//	recheck to make sure we have XML support.
									if(!this._ieXmlDom){
										throw new Error("dojo.io.iframe.send (return handler): your copy of Internet Explorer does not support XML documents.");
									}
								}

								//	create the document manually
								var _xml=new ActiveXObject(this._ieXmlDom);
								_xml.async=false;
								_xml.loadXML(xmlText);
								value=_xml;
							}
						} else {
							value = ifd.getElementsByTagName("textarea")[0].value; //text
                            
							//if(handleAs == "json"){
								//value = dojo.fromJson(value); //json
							//}else if(handleAs == "javascript"){
								//value = dojo.eval(value); //javascript
							//}
						}
					}
				}catch(e){
					value = e;
				}finally{
					ioArgs._callNext();				
				}
				return value;
			},
			function(/*Error*/error, /*Deferred*/dfd){
				//summary: errHandler function for dojo._ioSetArgs call.
				dfd.ioArgs._hasError = true;
				dfd.ioArgs._callNext();
				return error;
			}
		);

		//Set up a function that will fire the next iframe request. Make sure it only
		//happens once per deferred.
		dfd.ioArgs._callNext = function(){
			if(!this["_calledNext"]){
				this._calledNext = true;
				dojo.io.iframe._currentDfd = null;
				dojo.io.iframe._fireNextRequest();
			}
		}

		this._dfdQueue.push(dfd);
		this._fireNextRequest();
		
		//Add it the IO watch queue, to get things like timeout support.
		dojo._ioWatch(
			dfd,
			function(/*Deferred*/dfd){
				//validCheck
				return !dfd.ioArgs["_hasError"];
			},
			function(dfd){
				//ioCheck
				return (!!dfd.ioArgs["_finished"]);
			},
			function(dfd){
				//resHandle
				if(dfd.ioArgs._finished){
					dfd.callback(dfd);
				}else{
					dfd.errback(new Error("Invalid dojo.io.iframe request state"));
				}
			}
		);

		return dfd;
	},

	_currentDfd: null,
	_dfdQueue: [],
	_iframeName: dojo._scopeName + "IoIframe",

	_fireNextRequest: function(){
		//summary: Internal method used to fire the next request in the bind queue.
		try{
			if((this._currentDfd)||(this._dfdQueue.length == 0)){ return; }
			var dfd = this._currentDfd = this._dfdQueue.shift();
			var ioArgs = dfd.ioArgs;
			var args = ioArgs.args;

			ioArgs._contentToClean = [];
			var fn = dojo.byId(args["form"]);
			var content = args["content"] || {};
			if(fn){
				if(content){
					// if we have things in content, we need to add them to the form
					// before submission
					for(var x in content){
						if(!fn[x]){
							var tn;
							if(dojo.isIE){
								tn = dojo.doc.createElement("<input type='hidden' name='"+x+"'>");
							}else{
								tn = dojo.doc.createElement("input");
								tn.type = "hidden";
								tn.name = x;
							}
							tn.value = content[x];
							fn.appendChild(tn);
							ioArgs._contentToClean.push(x);
						}else{
							fn[x].value = content[x];
						}
					}
				}
				//IE requires going through getAttributeNode instead of just getAttribute in some form cases, 
				//so use it for all.  See #2844
				var actnNode = fn.getAttributeNode("action");
				var mthdNode = fn.getAttributeNode("method");
				var trgtNode = fn.getAttributeNode("target");
				if(args["url"]){
					ioArgs._originalAction = actnNode ? actnNode.value : null;
					if(actnNode){
						actnNode.value = args.url;
					}else{
						fn.setAttribute("action",args.url);
					}
				}
				if(!mthdNode || !mthdNode.value){
					if(mthdNode){
						mthdNode.value= (args["method"]) ? args["method"] : "post";
					}else{
						fn.setAttribute("method", (args["method"]) ? args["method"] : "post");
					}
				}
				ioArgs._originalTarget = trgtNode ? trgtNode.value: null;
				if(trgtNode){
					trgtNode.value = this._iframeName;
				}else{
					fn.setAttribute("target", this._iframeName);
				}
				fn.target = this._iframeName;
				fn.submit();
			}else{
				// otherwise we post a GET string by changing URL location for the
				// iframe
				var tmpUrl = args.url + (args.url.indexOf("?") > -1 ? "&" : "?") + ioArgs.query;
				this.setSrc(this._frame, tmpUrl, true);
			}
		}catch(e){
			dfd.errback(e);
		}
	},

	_iframeOnload: function(){
		var dfd = this._currentDfd;
		if(!dfd){
			this._fireNextRequest();
			return;
		}

		var ioArgs = dfd.ioArgs;
		var args = ioArgs.args;
		var fNode = dojo.byId(args.form);
	
		if(fNode){
			// remove all the hidden content inputs
			var toClean = ioArgs._contentToClean;
			for(var i = 0; i < toClean.length; i++) {
				var key = toClean[i];
				if(dojo.isSafari < 3){
					//In Safari (at least 2.0.3), can't use form[key] syntax to find the node,
					//for nodes that were dynamically added.
					for(var j = 0; j < fNode.childNodes.length; j++){
						var chNode = fNode.childNodes[j];
						if(chNode.name == key){
							dojo._destroyElement(chNode);
							break;
						}
					}
				}else{
					dojo._destroyElement(fNode[key]);
					fNode[key] = null;
				}
			}
	
			// restore original action + target
			if(ioArgs["_originalAction"]){
				fNode.setAttribute("action", ioArgs._originalAction);
			}
			if(ioArgs["_originalTarget"]){
				fNode.setAttribute("target", ioArgs._originalTarget);
				fNode.target = ioArgs._originalTarget;
			}
		}

		ioArgs._finished = true;
	}
}

}

if(!dojo._hasResource["dojo.rpc.RpcService"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.rpc.RpcService"] = true;
dojo.provide("dojo.rpc.RpcService");

dojo.declare("dojo.rpc.RpcService", null, {
	constructor: function(args){
		//summary:
		//Take a string as a url to retrieve an smd or an object that is an smd or partial smd to use
		//as a definition for the service
		//
		//	args: object
		//		Takes a number of properties as kwArgs for defining the service.  It also
		//		accepts a string.  When passed a string, it is treated as a url from
		//		which it should synchronously retrieve an smd file.  Otherwise it is a kwArgs
		//		object.  It accepts serviceUrl, to manually define a url for the rpc service
		//		allowing the rpc system to be used without an smd definition. strictArgChecks
		//		forces the system to verify that the # of arguments provided in a call
		//		matches those defined in the smd.  smdString allows a developer to pass
		//		a jsonString directly, which will be converted into an object or alternatively
		//		smdObject is accepts an smdObject directly.
		//				
		if(args){
			//if the arg is a string, we assume it is a url to retrieve an smd definition from
			if( (dojo.isString(args)) || (args instanceof dojo._Url)){
				if (args instanceof dojo._Url){
					var url = args + "";
				}else{
					url = args;
				}
				var def = dojo.xhrGet({
					url: url,
					handleAs: "json-comment-optional",
					sync: true
				});
				
				def.addCallback(this, "processSmd");
				def.addErrback(function() {
					throw new Error("Unable to load SMD from " + args);
				});

			}else if(args.smdStr){
				this.processSmd(dojo.eval("("+args.smdStr+")"));
			}else{
				// otherwise we assume it's an arguments object with the following
				// (optional) properties:
				//      - serviceUrl
				//      - strictArgChecks
				//      - smdStr
				//      - smdObj

				if(args.serviceUrl){
					this.serviceUrl = args.serviceUrl;
				}

				this.timeout = args.timeout || 3000;

				if("strictArgChecks" in args){
					this.strictArgChecks = args.strictArgChecks;
				}

				this.processSmd(args);
			}
		}
	},

	strictArgChecks: true,
	serviceUrl: "",

	parseResults: function(obj){
		// summary
		// 		parse the results coming back from an rpc request.  this
		// 		base implementation, just returns the full object
		// 		subclasses should parse and only return the actual results
		//	obj: Object
		//		Object that is the return results from an rpc request
		return obj;
	},

	errorCallback: function(/* dojo.Deferred */ deferredRequestHandler){
		// summary:
		//		create callback that calls the Deferres errback method
		//	deferredRequestHandler: Deferred
		//		The deferred object handling a request.
		return function(data){
			deferredRequestHandler.errback(data.message);
		};
	},

	resultCallback: function(/* dojo.Deferred */ deferredRequestHandler){
		// summary:
		// 		create callback that calls the Deferred's callback method
		//	deferredRequestHandler: Deferred
		//		The deferred object handling a request.

		var tf = dojo.hitch(this, 
			function(obj){
				if(obj.error!=null){
					var err;
					if(typeof obj.error == 'object'){
						err = new Error(obj.error.message);
						err.code = obj.error.code;
						err.error = obj.error.error;
					}else{
						err = new Error(obj.error);
					}
					err.id = obj.id;
					err.errorObject = obj;
					deferredRequestHandler.errback(err);
				}else{
					deferredRequestHandler.callback(this.parseResults(obj)); 
				}
			}
		);
		return tf;
	},

	generateMethod: function(/*string*/ method, /*array*/ parameters, /*string*/ url){
		// summary:
		// 		generate the local bind methods for the remote object
		//	method: string
		//		The name of the method we are generating
		//	parameters: array
		//		the array of parameters for this call.
		//	url: string
		//		the service url for this call

		return dojo.hitch(this, function(){
			var deferredRequestHandler = new dojo.Deferred();

			// if params weren't specified, then we can assume it's varargs
			if( (this.strictArgChecks) &&
				(parameters != null) &&
				(arguments.length != parameters.length)
			){
				// put error stuff here, no enough params
				throw new Error("Invalid number of parameters for remote method.");
			}else{
				this.bind(method, dojo._toArray(arguments), deferredRequestHandler, url);
			}

			return deferredRequestHandler;
		});
	},

	processSmd: function(object){
		// summary:
		// 		callback method for reciept of a smd object.  Parse the smd
		// 		and generate functions based on the description
		//	object:
		//		smd object defining this service.

		if(object.methods){
			dojo.forEach(object.methods, function(m){
				if(m && m.name){
					this[m.name] = this.generateMethod(	m.name,
										m.parameters, 
										m.url||m.serviceUrl||m.serviceURL);
					if(!dojo.isFunction(this[m.name])){
						throw new Error("RpcService: Failed to create" + m.name + "()");
						/*console.debug("RpcService: Failed to create", m.name, "()");*/
					}
				}
			}, this);
		}

		this.serviceUrl = object.serviceUrl||object.serviceURL;
		this.required = object.required;
		this.smd = object;
	}
});

}

if(!dojo._hasResource["dojo.rpc.JsonService"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.rpc.JsonService"] = true;
dojo.provide("dojo.rpc.JsonService");


dojo.declare("dojo.rpc.JsonService", dojo.rpc.RpcService, {
		bustCache: false,
		contentType: "application/json-rpc",
		lastSubmissionId: 0,

		callRemote: function(method, params){
			// summary:
			// 		call an arbitrary remote method without requiring it to be
			// 		predefined with SMD
			//	method: string
			//		the name of the remote method you want to call.
			//	params: array
			//		array of parameters to pass to method

			var deferred = new dojo.Deferred();
			this.bind(method, params, deferred);
			return deferred;
		},

		bind: function(method, parameters, deferredRequestHandler, url){
			//summary:
			//		JSON-RPC bind method. Takes remote method, parameters,
			//		deferred, and a url, calls createRequest to make a JSON-RPC
			//		envelope and passes that off with bind.
			//	method: string
			//		The name of the method we are calling
			//	parameters: array
			//		The parameters we are passing off to the method
			//	deferredRequestHandler: deferred
			//		The Deferred object for this particular request

			var def = dojo.rawXhrPost({
				url: url||this.serviceUrl,
				postData: this.createRequest(method, parameters),
				contentType: this.contentType,
				timeout: this.timeout, 
				handleAs: "json-comment-optional"
			});
			def.addCallbacks(this.resultCallback(deferredRequestHandler), this.errorCallback(deferredRequestHandler));
		},

		createRequest: function(method, params){
			// summary:
			//	create a JSON-RPC envelope for the request
			//	method: string
			//		The name of the method we are creating the requst for
			//	params: array
			//		The array of parameters for this request;
			
			var req = { "params": params, "method": method, "id": ++this.lastSubmissionId };
			var data = dojo.toJson(req);
			return data;
		},

		parseResults: function(/*anything*/obj){
			//summary:
			//		parse the result envelope and pass the results back to
			//		the callback function
			//	obj: Object
			//		Object containing envelope of data we recieve from the server

			if(dojo.isObject(obj)){
				if("result" in obj){
					return obj.result;
				}
				if("Result" in obj){
					return obj.Result;
				}
				if("ResultSet" in obj){
					return obj.ResultSet;
				}
			}
			return obj;
		}
	}
);

}

if(!dojo._hasResource["zivios.LdapTreeHandler"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["zivios.LdapTreeHandler"] = true;
/**
 * Copyright (c) 2008 Zivios, LLC.
 *
 * This file is part of Zivios.
 *
 * Zivios is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Zivios is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Zivios.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     Zivios
 * @copyright   Copyright (c) 2008 Zivios, LLC. (http://www.zivios.org)
 * @license     http://www.zivios.org/legal/license
 **/

dojo.provide("zivios.LdapTreeHandler");

dojo.declare("zivios.LdapTreeHandler", null, {
    treedata: null,
           
    constructor: function(){
        this.treedata = new dojo.rpc.JsonService('/rpc/smd/ini/m/openldap/c/Service_Ldap');
    },

    destroy: function(){
        // summary: destroys this object, releasing connections to the store
    },

    getRoot: function(onItem, onError){
        //onItem({type: "DirectoryContainer", root: true, name: "Zivios Directory"});
        this.treedata.getBase().addCallback(function(data) {
            console.debug(data);
            response = dojo.fromJson(data);
                        
            onItem(response);
        }).addErrback(function(data) {
            response = dojo.fromJson(data);
            onError(response);
        });
    },

    mayHaveChildren: function(item){
        re = /Entry$/;
        if (!re.test(item.type)) {
            return true;
        }
        return false;
    },

    loadItem: function(entry, responsepane, treenode) {
        var ddiv = dijit.byId(responsepane);
        
        if (ddiv) {
            dojo.forEach(ddiv.getDescendants(), function(widget){
                widget.destroyRecursive();
                widget.destroy();
            });
        }

        var treenode = dojo.byId(treenode);
        var url  = entry.module + '/' + entry.controller + '/' + entry.action + '/dn/' + escape(encodeURI(entry.key));

        ddiv.attr('content', 'Loading...');
        dojo.xhrGet({
            url: url,
            timeout: 0,
            handleAs: "text",
            headers: {
                XHR_ERROR_HANDLEAS: "text",
            },

            load: dojo.hitch(this, function(response, ioArgs) {
                ddiv.attr('content', response);
                return response;
            }),

            error: function(response, ioArgs) {
                ddiv.attr('content', "An error occurred. Please check system logs.");
                console.error("HTTP status code: ", ioArgs.xhr.status);
                return response;
            }
        });
    },

    getChildren: function(item, onComplete, onError){
        if (item.type == "DirectoryContainer") {
            // root item. Get all basedn entries.
            this.treedata.getRoot().addCallback(function(data) {
                response = dojo.fromJson(data || null);
                onComplete(response);
            }).addErrback(function(data) {
                dojo.byId('exceptiondata').innerHTML 
                    += "<div style=\"margin-top: 5px; padding: 5px; border-bottom: 1px solid #7eabcd;\">"
                    + data + "</div>";
                dijit.byId('ztoolbar.exceptions')._openDropDown();
                onComplete([]);
            });
        } else {
            // get all entries for specified parent node.
            this.treedata.getChildren(item.key).addCallback(function(data) {
                response = dojo.fromJson(data || null);
                onComplete(response);
            }).addErrback(function(data) {
                dojo.byId('exceptiondata').innerHTML 
                    += "<div style=\"margin-top: 5px; padding: 5px; border-bottom: 1px solid #7eabcd;\">"
                    + data + "</div>";
                dijit.byId('ztoolbar.exceptions')._openDropDown();
                onComplete([]);
            });
        }
    },

    getIdentity: function(item){
        return item.key;
    },

    getLabel: function(item){
        return item.name;
    },

    // =======================================================================
    // Write interface
    newItem: function(/* Object? */ args, /*Item?*/ parent){
        // summary
        //            Creates a new item.   See dojo.data.api.Write for details on args.
    },
    pasteItem: function(/*Item*/ childItem, /*Item*/ oldParentItem, /*Item*/ newParentItem, /*Boolean*/ bCopy){
        // summary
        //            Move or copy an item from one parent item to another.
        //            Used in drag & drop.
        //            If oldParentItem is specified and bCopy is false, childItem is removed from oldParentItem.
        //            If newParentItem is specified, childItem is attached to newParentItem.
    },
    // =======================================================================
    // Callbacks
    onChange: function(/*dojo.data.Item*/ item){
        // summary
        //            Callback whenever an item has changed, so that Tree
        //            can update the label, icon, etc.   Note that changes
        //            to an item's children or parent(s) will trigger an
        //            onChildrenChange() so you can ignore those changes here.
    },

    onChildrenChange: function(/*dojo.data.Item*/ parent, /*dojo.data.Item[]*/ newChildrenList){
        // summary
        //            Callback to do notifications about new, updated, or deleted items.
    }
});

}

if(!dojo._hasResource["zivios.core"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["zivios.core"] = true;
/**
 * Copyright (c) 2008-2010 Zivios, LLC.
 *
 * This file is part of Zivios.
 *
 * Zivios is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Zivios is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Zivios.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @package     Zivios
 * @copyright   Copyright (c) 2008-2010 Zivios, LLC. (http://www.zivios.org)
 * @license     http://www.zivios.org/legal/license
 **/

dojo.provide("zivios.core");

(function() {
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    dojo.addOnLoad(function() {
        
        // initialize Zivios tab handler
        zivios.tabs   = new zivios.TabHandler(zivios.baseUrl);

        // initialize clock & toggle primary screen visibility
        zivios.js_clock();
        zivios.hideDiv('preloader');
        zivios.showDiv('zvPrimaryContainer');

        // resize the layout
        dijit.byId('layout').resize();
    });

    dojo.mixin(zivios, {

        loadApp: function(url,ptab,ctab,title,refreshOnLoad) {
            // If the directory service is being loaded,
            // include required handler.
            if (ctab == "zdirectory") {
                
                zivios.treeHandler = new zivios.LdapTreeHandler();
            }
            zivios.tabs.createApplicationTab(zivios.baseUrl,ptab,ctab,url,title,refreshOnLoad);
        },

        redirectUrl: function(url) {
            window.location=url;
        },

        /**
         * Change the display property of a div to "none"
         *
         * @param string div 'div that needs to be "switched off" from display'         
         * @return void
         */
        hideDiv: function(div) {
            var adiv;
            if (null !== (adiv = dojo.byId(div))) {
                dojo.style(adiv, "display", "none");
            }
        },
        
        /**
         * Change the display property of a div to "block"
         *
         * @param string div: 'div that need to "switched on" from display'
         * @return void
         */
        showDiv: function(div) {
            var adiv;
            if (null !== (adiv = dojo.byId(div))) {
                dojo.style(adiv, "display", "block");
            }
        },        

        callRemoteRender: function(data,rdiv) {
            if (undefined === rdiv) {
                console.log("Error: Response div not defined.");
                dojo.byId('exceptiondata').innerHTML += "<div style=\"margin-top: 5px; padding: 5px; border-bottom: 1px solid #7eabcd;\">"
                    + "Callback defined did not specify a target node for data population.</div>";
                dijit.byId('ztoolbar.exceptions')._openDropDown();
            }

            // Call the load page function.
            data = dojo.fromJson(data);
            dojo.byId(rdiv).innerHTML = "<br />please wait...";
            zivios.loadPage(data.loadaction, rdiv);
        },

        callAction: function(url, content, attrSubmit) {

            var attrSubmitLabel = dijit.byId(attrSubmit);
            var hrefspan;

            if (attrSubmitLabel == undefined) {
                var hrefspan = dojo.byId(attrSubmit);
                if (hrefspan == undefined) {
                    alert('Either a attrSubmit of hrefSpan must be defined when using callAction');
                    return;
                } else {
                    hrefspan = hrefspan.innerHTML;
                }
            } else {
                attrSubmitLabel = dijit.byId(attrSubmit).label;
            }


            if (hrefspan == undefined) {
                dijit.byId(attrSubmit).attr('disabled', true);
                dijit.byId(attrSubmit).attr('label', 'Wait...');
            } else {
                dojo.byId(attrSubmit).innerHTML = 'Wait...';
            }            

            dojo.xhrPost({
                url: url,
                content: content,
                timeout: 0,
                headers: {
                    XHR_ERROR_HANDLEAS: "json",
                },

                load: dojo.hitch(this, function(response, ioArgs) {
                    //showLoading.style.display = "none";
                    try {
                        response = dojo.fromJson(response || null);
                        // re-enable the form
                        if (hrefspan == undefined) {
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                        } else {
                            dojo.byId(attrSubmit).innerHTML = hrefspan;
                        }

                        //Check for errors and populate the install log div
                        if (response.sysErr) {
                            dojo.byId('alertdata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px; float:left; width: 40px;\">Error: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.message + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "</div>";

                            dijit.byId('ztoolbar.alerts')._openDropDown();
                            if (hrefspan == undefined) {
                                dijit.byId(attrSubmit).attr('disabled', false);
                                dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                            } else {
                                dojo.byId(attrSubmit).innerHTML = hrefspan;
                            }
                            return response;
                        }

                        // Check for System Exceptions
                        if (response.sysExp) {
                            dojo.byId('exceptiondata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Exception: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.message + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">File: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.file + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Line: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.line + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Trace: </div>" +
                                "<div style=\"padding: 2px; float: left;\">Check Zivios Log.</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "</div>";

                            dijit.byId('ztoolbar.exceptions')._openDropDown();
                            if (hrefspan == undefined) {
                                dijit.byId(attrSubmit).attr('disabled', false);
                                dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                            } else {
                                dojo.byId(attrSubmit).innerHTML = hrefspan;
                            }
                            return response;
                        }

                        // Check for notifications
                        if (response.sysNotify) {
                            dojo.byId('notifydata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px;\">" + response.sysNotify + "</div>" +
                                "</div>";

                            dijit.byId('ztoolbar.notifications')._openDropDown();
                        }

                        // check response for possible callbacks and accompanying arguments.
                        // all callbacks are executed in the order they were registered.
                        if (response.callbacks) {
                            for (var i = 0; i < response.callbacks.length; i++) {
                                var callbackFunc = response.callbacks[i]['func'].toString() + "(";
                                if (response.callbacks[i]['args']) {
                                    var argArray = response.callbacks[i]['args'];
                                    for (var a = 0; a < argArray.length; a++) {
                                        callbackFunc += "'" + argArray[a].toString() + "'";
                                        if (a + 1 < argArray.length) {
                                            callbackFunc += ",";
                                        }
                                    }
                                }
                                callbackFunc += ")";
                                var doCallback = new Function(callbackFunc);
                                doCallback();
                            }
                        }

                        // check for possible div updates
                        if (response.divdata) {
                            for (var d = 0; d < response.divdata.length; d++) {
                                var datadiv = dojo.byId(response.divdata[d]['div']);
                                if (undefined === response.divdata[d]['append']) {
                                    datadiv.innerHTML = response.divdata[d]['content'];
                                } else {
                                    datadiv.innerHTML += response.divdata[d]['content'];
                                }
                            }
                        }

                        return response;

                    } catch (ex) {
                        // The return response was not valid Json.
                        zivios.createErrorDialog(ex.message);
                        if (hrefspan == undefined) {
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                        } else {
                            dojo.byId(attrSubmit).innerHTML = hrefspan;
                        }
                        return response;
                    }
                }),

                // Communication errors are directed to the console (for now)
                error: function (response, ioArgs) {
                    if (response.message) {
                        zivios.createErrorDialog(response.message);
                    }
                    if (hrefspan == undefined) {
                        dijit.byId(attrSubmit).attr('disabled', false);
                        dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                    } else {
                        dojo.byId(attrSubmit).innerHTML = hrefspan;
                    }
                    console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                }
            });
        },

         cpaneAction: function(cpid, url, content, attrSubmit) {

            var attrSubmitLabel = dijit.byId(attrSubmit);
            var hrefspan;

            if (attrSubmitLabel == undefined) {
                var hrefspan = dojo.byId(attrSubmit);
                if (hrefspan == undefined) {
                    alert('Either a attrSubmit of hrefSpan must be defined when using callAction');
                    return;
                } else {
                    hrefspan = hrefspan.innerHTML;
                }
            } else {
                attrSubmitLabel = dijit.byId(attrSubmit).label;
            }


            if (hrefspan == undefined) {
                dijit.byId(attrSubmit).attr('disabled', true);
                dijit.byId(attrSubmit).attr('label', 'Wait...');
            } else {
                dojo.byId(attrSubmit).innerHTML = 'Wait...';
            }            
            
            cp = dijit.byId(cpid);
            cp.attr('content',cp.onDownloadStart());

            dojo.xhrPost({
                url: url,
                content: content,
                timeout: 0,
                headers: {
                    XHR_ERROR_HANDLEAS: "text",
                },

                load: dojo.hitch(this, function(response, ioArgs) {
                    //showLoading.style.display = "none";
                    
                        // re-enable the form
                        if (hrefspan == undefined) {
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                        } else {
                            dojo.byId(attrSubmit).innerHTML = hrefspan;
                        }

                        //Update the content pane with new innerHTML
                        dijit.byId(cpid).attr('content',response);
                        
                }),

                // Communication errors are directed to the console (for now)
                error: function (response, ioArgs) {
                    if (response.message) {
                        zivios.createErrorDialog(response.message);
                    }
                    if (hrefspan == undefined) {
                        dijit.byId(attrSubmit).attr('disabled', false);
                        dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                    } else {
                        dojo.byId(attrSubmit).innerHTML = hrefspan;
                    }
                    console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                }
            });
        },
        
        // Refresh a content pane by div id.
        cpaneRefresh: function (id, href) {

            var cpane = dijit.byId(id) || null;

            if (cpane) {
                if (undefined !== href) {
                    cpane.href=href;
                }
                cpane.refresh();
            }
        },
        
        loadPage: function(url, div, rtimeout, loadingDiv) {

            if (undefined === rtimeout)
                var rtimeout = 0;

            if (undefined !== loadingDiv)
                var showLoading = dojo.byId(loadingDiv);

            if (showLoading)
                showLoading.style.display = "block";

            dojo.xhrGet({
                url: url,
                timeout: rtimeout,

                load: dojo.hitch(this, function(response, ioArgs) {
                    // Check if json object has been returned
                    if (showLoading)
                        showLoading.style.display = "none";
                    try {
                        // If response is JSON, an XHR request resulted in an error.
                        // This function provides only basic rendering.
                        response = dojo.fromJson(response || null);
                        if (response.sysErr) {

                            for (var i = 0; i < response.sysErr.length; i++) {
                                var errItem = response.sysErr[i];
                                dojo.byId('alertdata').innerHTML += "<div style=\"margin-top: 5px; padding: 5px; border-bottom: 1px solid #7eabcd;\">"
                                    + errItem.errmsg + "</div>";
                            } dijit.byId('itoolbar.alerts')._openDropDown();

                            return response;
                        }

                        // Check for System Exceptions
                        if (response.sysExp) {
                            for (var i = 0; i < response.sysExp.length; i++) {
                                var expItem = response.sysExp[i];
                                dojo.byId('exceptiondata').innerHTML += "<div style=\"margin-top: 5px; padding: 5px; border-bottom: 1px solid #7eabcd;\">"
                                    + expItem.expmsg + "</div>";
                            } dijit.byId('itoolbar.exceptions')._openDropDown();

                            return response;
                        }
                    } catch (ex) {
                        dojo.byId(div).innerHTML = response;
                        dojo.parser.parse(div);
                        return response;
                    }
                }),

                error: function(response, ioArgs) {
                    if (showLoading)
                        showLoading.style.display = "none";
                    console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                }
            });
        },

        feedConsole: function(log) {
                this.stopFeed();
                this._intervalId = setInterval(function() {
                var cdata = new dojo.data.ItemFileReadStore({url: "/index/getconsoledata/log/" + log});
                console.log("feedconsole registered.");
                console.log("sending request");
                var request = cdata.fetch({query: {type:"logline"}, onComplete: function(items, request) {
                        console.log("Response received");
                        //dojo.byId("consoleLog").innerHTML = "";

                        if (items.length > 0) {
                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                innerHtml = dojo.byId("consoleLog").innerHTML;
                                newHtml = cdata.getLabel(item);

                                dojo.byId("consoleLog").innerHTML = "";
                                dojo.byId("consoleLog").innerHTML = newHtml + "<br/>" + innerHtml;

                            }
                            this._previousLog = items;
                        } else {
                            dojo.byId("consoleLog").innerHTML = "";
                        }
                    },
                });
            }, 5000);
        },

        stopFeed: function() {
            clearInterval( this._intervalId );
        },

        refreshTreeNode: function (dn) {

            var tree = dijit.byId('ztreedir');

            if (tree !== undefined && tree !== "") {
                tn = tree._itemNodeMap[dn];
                if (tn != null) {
                    arrlength = tn.getChildren().length;
                    console.debug('refreshing dn : '+dn);
                    console.debug(tn);
                    tn.state = 'UNCHECKED';
                    tree._collapseNode(tn);
                    tn.isExpandable = true;
                    tree._expandNode(tn);
                }
            } else {
                return false;
            }
        },

        closeTab: function (thandlerid, tabid) {
            tabhandler = dijit.byId(thandlerid);
            tab = dijit.byId(tabid);
            tabhandler.closeChild(tab);
        },

        selectTab: function (thandlerid, tabid) {
            tabhandler = dijit.byId(thandlerid);
            tab = dijit.byId(tabid);
            tabhandler.selectChild(tab);
        },

        clearDiv: function(divid) {
            dojo.byId(divid).innerHTML = '';
        },

        notifications: function() {
        },

        alerts: function() {
        },

        exceptions: function() {
        },

        doXhrPost: function(formid,url) {
            var attrSubmit = formid + '-submit';
            var attrSubmitLabel = dijit.byId(attrSubmit).attr('label');
            
            dijit.byId(attrSubmit).attr('disabled', true);
            dijit.byId(attrSubmit).attr('label', 'Please wait...');

            //showLoading.style.display = "block";
            dojo.xhrPost({
                url: url,
                form: dojo.byId(formid),
                timeout: 0,
                headers: {
                    XHR_ERROR_HANDLEAS: "json",
                },

                load: dojo.hitch(this, function(response, ioArgs) {
                    //showLoading.style.display = "none";
                    try {
                        response = dojo.fromJson(response || null);
                        // re-enable the form
                        dijit.byId(attrSubmit).attr('disabled', false);
                        dijit.byId(attrSubmit).attr('label', attrSubmitLabel);

                        //Check for errors and populate the install log div
                        if (response.sysErr) {
                            dojo.byId('alertdata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px; float:left; width: 40px;\">Error: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.message + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "</div>";

                            dijit.byId('ztoolbar.alerts')._openDropDown();
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                            return response;
                        }

                        // Check for System Exceptions
                        if (response.sysExp) {
                            dojo.byId('exceptiondata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Exception: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.message + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">File: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.file + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Line: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.line + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Trace: </div>" +
                                "<div style=\"padding: 2px; float: left;\">Check Zivios Log.</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "</div>";

                            dijit.byId('ztoolbar.exceptions')._openDropDown();
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                            return response;
                        }

                        // Check for notifications
                        if (response.sysNotify) {
                            dojo.byId('notifydata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px;\">" + response.sysNotify + "</div>" +
                                "</div>";

                            dijit.byId('ztoolbar.notifications')._openDropDown();
                        }

                        // check response for possible callbacks and accompanying arguments.
                        // all callbacks are executed in the order they were registered.
                        if (response.callbacks) {
                            for (var i = 0; i < response.callbacks.length; i++) {
                                var callbackFunc = response.callbacks[i]['func'].toString() + "(";
                                if (response.callbacks[i]['args']) {
                                    var argArray = response.callbacks[i]['args'];
                                    for (var a = 0; a < argArray.length; a++) {
                                        callbackFunc += "'" + argArray[a].toString() + "'";
                                        if (a + 1 < argArray.length) {
                                            callbackFunc += ",";
                                        }
                                    }
                                }
                                callbackFunc += ")";
                                var doCallback = new Function(callbackFunc);
                                doCallback();
                            }
                        }

                        // check for possible div updates
                        if (response.divdata) {
                            for (var d = 0; d < response.divdata.length; d++) {
                                var datadiv = dojo.byId(response.divdata[d]['div']);
                                if (undefined === response.divdata[d]['append']) {
                                    datadiv.innerHTML = response.divdata[d]['content'];
                                } else {
                                    datadiv.innerHTML += response.divdata[d]['content'];
                                }
                            }
                        }

                        return response;

                    } catch (ex) {
                        // The return response was not valid Json.
                        zivios.createErrorDialog(ex.message);
                        dijit.byId(attrSubmit).attr('disabled', false);
                        dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                        return response;
                    }
                }),

                // Error.
                error: function (response, ioArgs) {
                    if (response.message) {
                        zivios.createErrorDialog(response.message);
                    }
                    dijit.byId(attrSubmit).attr('disabled', false);
                    dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                    console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                }
            });
        },

        formXhrPost: function(formid,url) {
            var form = dijit.byId(formid);
            if (form.isValid()) {
                zivios.doXhrPost(formid,url);
            } else {
                dojo.byId('alertdata').innerHTML += "<div style=\"margin-top: 5px; padding: 5px; border-bottom: 1px solid #7eabcd;\">"
                    + "Missing or invalid entries detected in form.</div>";
                dijit.byId('ztoolbar.alerts')._openDropDown();
            }
        },

        createErrorDialog: function (errorMsg) {
            var dialog = new dijit.Dialog({
                title:   "System Error.",
                content: errorMsg,
            });

            dojo.body().appendChild(dialog.domNode);
            dialog.startup();
            dialog.show();
        },
        
        showTransaction: function (id) {
            var trantab = dijit.byId('transsrvtabs01');
            if (trantab == undefined) {
                //Transaction tab not yet open!
                zivios.loadApp('/transaction/index/id/'+id,
                                            'ztabs','ztransactions',
                                            'Zivios Transactions');
            } else {
                zivios.loadApp('/transaction/transdetail/id/'+id,
                               'transsrvtabs01','transdetail'+id,'Transaction #'+id);
            }
        },
            
        createInfoDialog: function (content,title) {
            var dialog = new dijit.Dialog({
                title:   title,
                content: content,
            });

            dojo.body().appendChild(dialog.domNode);
            dialog.startup();
            dialog.show();
        },
        
        createDialogFromUrl: function (href,title) {
            var dialog = new dijit.Dialog({
                title:   title,
                href: href,
            });

            dojo.body().appendChild(dialog.domNode);
            dialog.startup();
            dialog.show();
            dialog.refresh();
        },
        
		ioIframeGetJson: function (formid,url){
            var attrSubmit = formid + '-submit';
            var attrSubmitLabel = dijit.byId(attrSubmit).attr('label');
            
            dijit.byId(attrSubmit).attr('disabled', true);
            dijit.byId(attrSubmit).attr('label', 'Please wait...');

			var td = dojo.io.iframe.send({
				url: url,
				form: formid,
				method: "post",
				timeoutSeconds: 5,
				preventCache: true,
				handleAs: "json",
				handle: function(res, ioArgs){
                    console.debug("Json recieved:");
                    console.debug(res);
					try {
                        response = dojo.fromJson(res || null);
                        // re-enable the form
                        dijit.byId(attrSubmit).attr('disabled', false);
                        dijit.byId(attrSubmit).attr('label', attrSubmitLabel);

                        //Check for errors and populate the install log div
                        if (response.sysErr) {
                            dojo.byId('alertdata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px; float:left; width: 40px;\">Error: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.message + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "</div>";

                            dijit.byId('ztoolbar.alerts')._openDropDown();
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                            return response;
                        }

                        // Check for System Exceptions
                        if (response.sysExp) {
                            dojo.byId('exceptiondata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Exception: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.message + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">File: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.file + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Line: </div>" +
                                "<div style=\"padding: 2px; float: left;\">" + response.line + "</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "<div style=\"padding: 2px; float:left; width: 70px;\">Trace: </div>" +
                                "<div style=\"padding: 2px; float: left;\">Check Zivios Log.</div>" +
                                "<div style=\"clear: both;\"></div>" +
                                "</div>";

                            dijit.byId('ztoolbar.exceptions')._openDropDown();
                            dijit.byId(attrSubmit).attr('disabled', false);
                            dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                            return response;
                        }

                        // Check for notifications
                        if (response.sysNotify) {
                            dojo.byId('notifydata').innerHTML +=
                                "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                                "<div style=\"padding: 2px;\">" + response.sysNotify + "</div>" +
                                "</div>";

                            dijit.byId('ztoolbar.notifications')._openDropDown();
                        }

                        // check response for possible callbacks and accompanying arguments.
                        // all callbacks are executed in the order they were registered.
                        if (response.callbacks) {
                            for (var i = 0; i < response.callbacks.length; i++) {
                                var callbackFunc = response.callbacks[i]['func'].toString() + "(";
                                if (response.callbacks[i]['args']) {
                                    var argArray = response.callbacks[i]['args'];
                                    for (var a = 0; a < argArray.length; a++) {
                                        callbackFunc += "'" + argArray[a].toString() + "'";
                                        if (a + 1 < argArray.length) {
                                            callbackFunc += ",";
                                        }
                                    }
                                }
                                callbackFunc += ")";
                                var doCallback = new Function(callbackFunc);
                                doCallback();
                            }
                        }

                        // check for possible div updates
                        if (response.divdata) {
                            for (var d = 0; d < response.divdata.length; d++) {
                                var datadiv = dojo.byId(response.divdata[d]['div']);
                                if (undefined === response.divdata[d]['append']) {
                                    datadiv.innerHTML = response.divdata[d]['content'];
                                } else {
                                    datadiv.innerHTML += response.divdata[d]['content'];
                                }
                            }
                        }

                        return response;

                    } catch (ex) {
                        // The return response was not valid Json.
                        zivios.createErrorDialog('From IoFrame Json Function: '+ex.message);
                        dijit.byId(attrSubmit).attr('disabled', false);
                        dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                        return response;
                    }
                },							
				error: function (response,ioArgs) {
                    if (response.message) {
                        zivios.createErrorDialog(response.message);
                    }
                    dijit.byId(attrSubmit).attr('disabled', false);
                    dijit.byId(attrSubmit).attr('label', attrSubmitLabel);
                    console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                }
			});
		},

        /**
         * works off a global div.
         */
        toggleLoading: function() {
            var loading;
            if (null !== (loading = dojo.byId('loadingmsg'))) {
                if (loading.style.display == "block") {
                    zivios.hideDiv('loadingmsg');
                } else {
                    zivios.showDiv('loadingmsg');
                }
            }
        },

        /**
         * perform an xhr post.
         */
        postxhr: function(call, div, content, contentType, returnResultType, showDivsPostLoad, hideDivsPostLoad, 
                          showDivsPreLoad, hideDivsPreLoad, callerId) {
            var url = call;
            var container;
            var dataSend;
            var caller;
            var enableCallerAfterCall = false;
            var isDijit;
            var formContent = '';


            if (undefined === (container = dijit.byId(div))) {
                if (null !== (container = dojo.byId(div))) {
                    isDijit = false;
                } else {
                    if (div == "") {
                        // no div specified for return context loading. Check responseType
                        if (returnResultType != 'json') {
                            alert('Invalid call to function postxhr. Missing data: "div" for requested responseType.');
                            return false;
                        } else {
                            // no div is specified; return context is json. Allow request processing.
                            isDijit = false;
                        }
                    } else {
                        // response div not found by ID; try querying by class.
                        var tdiv = "." + div;
                        if ("" == dojo.query(tdiv)) {
                            alert('Response "div" unavailable. Please check your call params to function.');
                            return false;
                        } else {
                            dojo.query(tdiv).forEach(function(node, index, arr){
                                container = node;
                            });
                        }

                        isDijit = false;
                    }
                }
            } else {
                isDijit = true;
            }

            if (undefined !== (caller = dijit.byId(callerId))) {
                // caller is a dijit
                caller.attr('disabled', true);
                enableCallerAfterCall = true;
            }

            switch (contentType) {
                case "form": 
                    // dojo form
                    formData = dijit.byId(content);

                    if (!formData.validate()) {
                        zivios.flashMessage('Missing or invalid data in form fields.', 'error');

                        if (enableCallerAfterCall) {
                            caller.attr('disabled', false);
                        }

                        return false;
                    }

                    formContent = content;
                    break;

                case "text": 
                    dataSend = content;
                    break;

                case "json": 
                    dataSend = {'data': content};
                    break;

                case "json_encoded": 
                    try {
                        // for json sent via callbacks as arguments;
                        var testJson = dojo.fromJson(content);
                        dataSend = testJson;
                    } catch (e) {
                        dataSend = content;
                    }
                    break;

                default: 
                    // create error object and pass to error Handler. This is a developer
                    // level error. 
                    alert('Error. Unknown contentType.');
                    return;
            }

            

            if (hideDivsPreLoad instanceof Array && hideDivsPreLoad.length > 0) {
                for (ac = 0; ac < hideDivsPreLoad.length; ac++) {
                    zivios.hideDiv(hideDivsPreLoad[ac]);
                }
            }

            if (showDivsPreLoad instanceof Array && showDivsPreLoad.length > 0) {
                for (ac = 0; ac < showDivsPreLoad.length; ac++) {
                    zivios.showDiv(showDivsPreLoad[ac]);
                }
            }

            zivios.toggleLoading();

            dojo.xhrPost({
                url: url,
                form: formContent,
                content: dataSend,
                timeout: 0,
                headers: {
                    XHR_ERROR_HANDLEAS: returnResultType,
                },

                load: dojo.hitch(this, function(response, ioArgs) {
                    zivios.toggleLoading();
                    try {
                        responseTest = dojo.fromJson(response);
                        if (responseTest.sysErr == 1 || responseTest.sysExp == 1) {

                            // system error or exception raised. Pass response object to
                            //zivios.handleErrorDisplay(responseTest, ioArgs);
                            if (responseTest.sysErr == 1) {
                                zivios.flashMessage(responseTest.message, "error");
                            } else {
                                zivios.flashMessage(responseTest.message, "exception");
                            }

                            if (enableCallerAfterCall) {
                                caller.attr('disabled', false);
                            }

                            return;
                        } else {
                            // response is valid json, however, not an error obj.
                            // output request must be json -- continue processing.
                            // @note: we do not override returnType based on this test. 
                            //        returnType is honored regardless of detection.
                        }
                    } catch (e) {
                        // exception caught when force converting string to json.
                        // continue processing request, output rendering must be text.
                    }

                    // scroll to page top
                    scroll(0, 0);

                    // check rendering options.

                    switch (returnResultType) {
                        case "text": case "html":  
                            if (isDijit) {
                                container.attr('content', response);
                            } else {
                                container.innerHTML = response;
                                dojo.parser.parse(container);
                            }

                            break;

                        case "json": 
                            // check for response messages
                            response = dojo.fromJson(response);

                            // Check for notifications
                            if (response.sysNotify) {
                                zivios.flashMessage(response.sysNotify, "notify");
                            }
                            
                            // handle callbacks.
                            if (response.callbacks) {
                                for (var i = 0; i < response.callbacks.length; i++) {
                                    var callbackFunc = response.callbacks[i].func.toString() + "(";
                                    if (response.callbacks[i].args) {
                                        var argArray = response.callbacks[i].args;
                                        for (var a = 0; a < argArray.length; a++) {
                                            if (argArray[a].substring(0,1) == '[') {
                                                // arrays are not encapsulated in single quotes
                                                callbackFunc += argArray[a].toString();
                                            } else {
                                                callbackFunc += "'" + argArray[a].toString() + "'";
                                            }
                                            if (a + 1 < argArray.length) {
                                                callbackFunc += ",";
                                            }
                                        }
                                    }
                                    callbackFunc += ")";
                                    var doCallback = new Function(callbackFunc);
                                    doCallback();
                                }
                            }

                            break;
                    }

                    // hide divs postload
                    if (hideDivsPostLoad instanceof Array && hideDivsPostLoad.length > 0) {
                        for (ac = 0; ac < hideDivsPostLoad.length; ac++) {
                            zivios.hideDiv(hideDivsPostLoad[ac]);
                        }
                    }
                    
                    // show divs postload
                    if (showDivsPostLoad instanceof Array && showDivsPostLoad.length > 0) {
                        for (ac = 0; ac < showDivsPostLoad.length; ac++) {
                            zivios.showDiv(showDivsPostLoad[ac]);
                        }
                    }
                    
                    // ensure the dijit has not been destroyed by a callback
                    if (undefined !== (caller = dijit.byId(callerId))) {
                        if (enableCallerAfterCall) {
                            caller.attr('disabled', false);
                        }
                    }
                }),
    
                error: function (response, ioArgs) {
                    //zivios.handleErrorDisplay(response, ioArgs);
                    zivios.flashMessage(response, "error");
                }
            });
        },

        flashMessage: function (msg, msgType) {

            switch (msgType) {
                case "exception":
                dojo.byId('exceptiondata').innerHTML +=
                   "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                   "<div style=\"padding: 2px; float:left; width: 70px;\">Exception: </div>" +
                   "<div style=\"padding: 2px; float: left;\">" + msg + "</div>" +
                   "<div style=\"clear: both;\"></div>" + 
                   "</div>";

                    dijit.byId('ztoolbar.exceptions')._openDropDown();
                    break;

                case "error":
                   dojo.byId('alertdata').innerHTML +=
                        "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                        "<div style=\"padding: 2px; float:left; width: 40px;\">Error: </div>" +
                        "<div style=\"padding: 2px; float: left;\">" + msg + "</div>" +
                        "<div style=\"clear: both;\"></div>" +
                        "</div>";

                    dijit.byId('ztoolbar.alerts')._openDropDown();
                    break;

                case "notify": 
                    dojo.byId('notifydata').innerHTML +=
                        "<div style=\"margin-top: 10px; padding: 2px; border-bottom: 1px solid #7eabcd;\">" +
                        "<div style=\"padding: 2px;\">" + msg + "</div>" +
                        "</div>";

                    dijit.byId('ztoolbar.notifications')._openDropDown();
                    break;
            }
        },

        
        // Keeping it simple and not integrating with notification / alert / exception
        // system. The handler needs to be isolated first.
        logout: function() {
            dojo.xhrGet ({
                url: '/default/index/logout',
                handleAs: 'json',
                timeout: 0,
                headers: {
                    XHR_ERROR_HANDLEAS: "json",
                },

                load: function (response, ioArgs) {
                    if (response.logout == '1') {
                        // redirect to app root.
                        zivios.redirectUrl(response.url);
                    } else {
                        // logout failed...
                        zivios.createInfoDialog('The logout appears to have failed. Contact a system administrator', 'Logout failed');
                    }

                    return response;
                },

                error: function (response, ioArgs) {
                    if (response.message) {
                        zivios.createErrorDialog('HTTP status code: ' + response.message, 'Error');
                    } else {
                        zivios.createErrorDialog(ioArgs.xhr.status, 'Error');
                    }
                    console.error("HTTP status code: ", ioArgs.xhr.status);
                    return response;
                },
            });
        },

        js_clock:  function() {
            if (dojo.byId('clock_div') == null) {
                return false;
            }
            var clock_time = new Date();
            var clock_hours = clock_time.getHours();
            var clock_minutes = clock_time.getMinutes();
            var clock_seconds = clock_time.getSeconds();
            var clock_suffix = "AM";

            if (clock_hours > 11) {
                clock_suffix = "PM";
                clock_hours = clock_hours - 12;
            }

            if (clock_hours == 0)
                clock_hours = 12;

            if (clock_hours < 10)
                clock_hours = "0" + clock_hours;

            if (clock_minutes < 10)
                clock_minutes = "0" + clock_minutes;

            if (clock_seconds < 10)
                clock_seconds = "0" + clock_seconds;

            var clock_div = document.getElementById('js_clock');
            clock_div.innerHTML = clock_hours + ":" + clock_minutes + ":" +
            clock_seconds + " " + clock_suffix;

            setTimeout("zivios.js_clock()", 1000);
        },
    });
})();


}


dojo.i18n._preloadLocalizations("zivios.nls.core", ["he","nl","tr","no","ko","el","en","en-gb","ROOT","zh-cn","hu","es","fi-fi","pt-br","ca","fi","he-il","xx","ru","it","fr","cs","de-de","fr-fr","it-it","es-es","ja","sk","da","sl","pl","de","sv","pt","pt-pt","nl-nl","zh-tw","ko-kr","ar","en-us","zh","th","ja-jp"]);
