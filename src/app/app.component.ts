import { Component, ViewChild, ViewChildren, AfterViewInit, ElementRef, 
	HostListener, Input, EventEmitter, Output, SimpleChange } from '@angular/core';
import { TJsonViewerComponent } from './t-json-viewer.component/t-json-viewer.component';
import { element } from 'protractor';
import { TJsonViewerSourceComponent } from './t-json-viewer-source.component/t-json-viewer-source.component';
import * as _ from 'lodash';
import { OnChanges } from '@angular/core';

declare var $:any;
declare var jsPlumb:any;
let mappings: any; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent  {

  title = 'app works!';
  bob = 33; 
  asset;
  cdm;
  mapped;
  clicked :boolean = false; 

  checkCollapse(e) {
		// console.log("Clicked");
		// console.log(e);
		// this.clicked = true; 
		// console.log(this.clicked)
  	}

   //Aangeroepen nadat de visuele mapping klaar is. Genereert een preview. 
	runMapping(connections: any) {
		
	    let cdm = this.cdm; 
		
		let mapping = cdm; 
		let input = this.asset;
		
		let connectionArray = [];

	   	let rex = /(\w+):/
		//let rex2 = /\w+:(.*)/
		console.log(connections);

		//Eerst de mapped connections in een nette array zetten...
		connections.forEach(element => {
			
			let connection = {};
			let sourceText = element.source.parentElement.innerText;
			let sourceKey = sourceText.match(rex)[1];
			let targetText = element.target.parentElement.innerText; 
			let targetKey = targetText.match(rex)[1]; 

			connection[targetKey] = sourceKey;
			connectionArray.push(connection);

			console.log(connectionArray);
		});
 
		
			Object.keys(mapping).forEach((key) => {
				if(_.find(connectionArray, key)) {
					console.log("Key " + key + " komt erin voor!");
					//Dan nu de bijbehorende (lookup)value pakken in de collectie. 
					let lookupKey = _.find(connectionArray, key)[key]; 
					//console.log("Lookup key is: "  + JSON.stringify(lookupKey));

					console.log(input);
					//Nu de bijbehorende waarde opzoeken in de source JSON, input
					let lookupValue = input[lookupKey];
					console.log("Lookup value is: " + lookupValue);
					//console.log(this.mapped);
					// console.log(input);
					// //this.mapped[key] = input[key];
					// console.log(input[key]);
					mapping[key] = lookupValue; 
					
			}
			
			this.mapped = mapping;
			
			//this.mapped[key] = "bob" ;
			console.log(this.mapped); 
		}); 

   }
   
  ngAfterViewInit() {	

			let me = this;
			let instance: any;

			jsPlumb.ready(function() {
				
				instance = jsPlumb.getInstance({
                Connector : [ "Bezier", { curviness: 75} ],
                Container :"parentcontainer",
                PaintStyle : {
                    strokeWidth: 3,
                    stroke : "grey",
                },
                // HoverPaintStyle : {
                //     strokeWidth: 3,
                //     stroke: "black",
                //     outlineWidth: 3,
                //     cssClass:"myClass",
                //     outlineStroke: "white"
                // },
				HoverPaintStyle:{ stroke:"red" },
                EndpointStyle : { radius:7, fill: "#567567"  },
				// Overlays:[
				// 	["Custom", {
				// 	create:function(component) {
				// 		return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");                
				// 	},
				// 	location:0.7,
				// 	id:"customOverlay"
				// 	}]
				// ]
				
                //,[ "Label", { label:"Connect To", id:"label", cssClass:"aLabel" }]
            });

			//Pak de Run knop en genereer alle connections zodra erop geklikt wordt. 
			$("#runbutton").click(function(){
					
					let connections = instance.getConnections();
					me.runMapping(connections); 
					// mappings = instance.getConnections(); 
					// console.log(mappings);
				
			});

			instance.bind("connection", function(connection) {
				console.log(connection);
					if(connection.source.parentElement.style.backgroundColor = "#3f3f3f") {
						connection.source.style.backgroundColor =  "#3f3f3f";
						connection.target.style.backgroundColor =  "#3f3f3f";
						connection.source.parentElement.style.backgroundColor = "#3f3f3f";
						connection.target.parentElement.style.backgroundColor = "#3f3f3f";
						connection.target.style.backgroundColor = "green";
					} 

					console.log(connection.target);
					$(connection.target.childNodes).remove();
					//$(connection.source.childNodes).remove();
					$(connection.target).append('<span class="glyphicon glyphicon-ok"></span>');
					function clearConnection(connection) {
						console.log("clear connection");
						instance.detach(connection);
					}	
					
			});

			instance.bind("connectionDetached", function(connection) {
				connection.source.parentElement.style.backgroundColor = "";
				connection.target.style.backgroundColor = "#3f3f3f";
				$(connection.target.childNodes).remove();
				$(connection.target).append('<span class="badge-dark">+</span>');
			})
		

			// $(".item__key").click(function() { 
			// 	console.log("Clicked clicked clicked!");
			// 	 var currentConnections = instance.getConnections();
			// 	console.log(currentConnections);
			// 	// currentConnections.forEach(element => {
			// 	// 	console.log(element);
			// 	// });
					
			// 	// for (let connection of currentConnections) {

			// 	// 	if(connection.source.offsetTop === 0) {

			// 	// 		connection.setVisible(false);
			// 	// 		console.log(connection.id);
			// 	// 	} else {
			// 	// 		connection.setVisible(true);
			// 	// 	}

			// 	// }

			// 	// // Nu alles nog een keer refreshen
			// 	// instance.repaintEverything();
			// });

			var elements = document.getElementsByClassName("badge-dark-source");
			
			for (var i = 0 ; i < elements.length; i++) {
				elements[i].parentElement.addEventListener('click', (e)=>{

				let currentConnections = instance.getConnections();
				console.log(currentConnections);
					
				for (let connection of currentConnections) {

					if(connection.source.offsetTop === 0) {

						connection.setVisible(false);
						console.log(connection.id);
					} else {
						connection.setVisible(true);
					}
				}

				// Nu alles nog een keer refreshen
				instance.repaintEverything();
				});
			}
			
			

			$(".badge-dark-source").hover(function(){
					$(this).css("background-color", "#567567");
					$(this).css( 'cursor', 'pointer' );
				}, function(){
					$(this).css("background-color", "");
			});

			$(".item__title").hover(function(){
					$(this).css("background-color", "#567567");
					// $(this).css( 'cursor', 'pointer' );
				}, function(){
					$(this).css("background-color", "");
			});



			document.addEventListener('scroll', (e)=>{

				let currentConnections2 = instance.getConnections();
					
				for (let connection of currentConnections2) {
					//Kleur veranderen van de connections 
					// if(connection.source.parentElement.style.backgroundColor = "#3f3f3f") {
					// 	connection.source.parentElement.style.backgroundColor = "#3f3f3f";
					// 	connection.target.parentElement.style.bbackgroundColor = "#3f3f3f";
					// } 

					if(connection.source.offsetTop === 0) {

						connection.setVisible(false);
						console.log(connection.id);
					} else {
						connection.setVisible(true);
					}

					//console.log(connection.source.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
					//console.log(connection.source.parentElement.parentElement.className);
					//connection.source.parentElement.parentElement
					// let parent = connection.source.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
					// if(parent.className.includes("is-opened-false")) {
					// 	console.log("Connection is dichtgeklapt, need to redraw line");
					// 	// console.log(connection);
					// 	//instance.connect({source:parent, target:connection.target});
					// 	connection.source = parent;
					// 	//instance.detach(connection);
					// 	//instance.addEndpoint(connection.source, connection.target);
					// 	//instance.toggleVisible(connection);
					// 	instance.connect({
					// 		source: connection.source,
					// 		target: connection.target,
					// 		anchor: "Right"
					// 	}); 

					// 	console.log(instance.getConnections());
					// 	//instance.repaint(connection.id);
					// } else if (parent.className.includes("is-opened-true")) {
					// 		console.log("Connection is opengeklapt, need to redraw line");
					// 		instance.connect({
					// 			source: connection.source,
					// 			target: connection.target,
					// 			anchor: "Right"
					// 		});

					// }
				}

				// Nu alles nog een keer refreshen
				instance.repaintEverything();
			}, true);

		
			//jsPlumb.addEndpoint(me.testEl.nativeElement);
			
			 instance.makeSource($(".badge-dark-source"), {
			      anchor:"Right"
					
		    });   

               //p.makeTarget($(".json-string"), {
		     instance.makeTarget($(".badge-dark"), {
                anchor:"Left"
                //endpoint:[ "Rectangle", { width:10, height:8 } ]
		    });	  

		

		}); 
	}

	

  ngOnInit() {

	this.mapped = {}; 
	
	this.cdm = 
		{	
		"brandProductId": "",
		"manufacturer": "",
		"sku": "",
		"name": "",
		"description": "",
		"priceExcl": "",
		"priceIncl": "",
		"categories": [
			{
			"brandCategoryId": "",
			"name": ""
			},
			{
			"brandCategoryId": "",
			"name": ""
			}
		],
		"images": [{
			"url": ""
		}, {
			"url": ""
		}],
		"options": [{
			"name": "",
			"values": [
				"",
				"",
				"",
				""
			]
		}],
		"variants": [{
			"brandProductId": "",
			"manufacturer": "",
			"sku": "",
			"name": "",
			"description": "",
			"priceExcl": "",
			"priceIncl": "",
			"optionValues": {
				"size": "",
				"color": "",
				"collection": ""
				}
			}]
		}

    this.asset = {
	"brandID": "5e8ab45b-2b2f-48f3-85ef-6cb8312b7731",
	"externalID": "3002",
	"productType": "Configurable",
	"importData": {
		"product": {
			"id": 3002,
			"name": "Minidress bicolor",
			"slug": "minidress",
			"permalink": "http://www.zizafashion.it/shop/minidress/",
			"date_created": "2015-04-15T04:33:00",
			"date_modified": "2016-07-21T18:59:25",
			"type": "variable",
			"status": "publish",
			"featured": false,
			"catalog_visibility": "visible",
			"description": "<p>Un capo passe-partout, con manica corta raglan e scollatura rotonda, realizzato in tessuto leggero e piacevole sulla pelle, 90% viscosa 10% elastam, declinato in versione bicolor.<br />\nModello easy, adatto a ogni fisicità.<br />\nPortabilissimo in ogni occasione del quotidiano, adatto per look più sportivi, come per abbinamenti casual chic.</p>\n<p>Versione bicolor: corda/nero</p>\n",
			"short_description": "<p>Un capo passe-partout, con manica corta raglan e scollatura rotonda.</p>\n",
			"sku": "DR_BICTN",
			"price": "33",
			"regular_price": "",
			"sale_price": "",
			"date_on_sale_from": "",
			"date_on_sale_to": "",
			"price_html": "<del><span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&euro;</span>&nbsp;55,00</span></del> <ins><span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&euro;</span>&nbsp;33,00</span></ins>",
			"on_sale": true,
			"purchasable": true,
			"total_sales": 1,
			"virtual": false,
			"downloadable": false,
			"downloads": [],
			"download_limit": -1,
			"download_expiry": -1,
			"download_type": "standard",
			"external_url": "",
			"button_text": "",
			"tax_status": "taxable",
			"tax_class": "",
			"manage_stock": false,
			"stock_quantity": null,
			"in_stock": true,
			"backorders": "no",
			"backorders_allowed": false,
			"backordered": false,
			"sold_individually": false,
			"weight": "",
			"dimensions": {
				"length": "",
				"width": "",
				"height": ""
			},
			"shipping_required": true,
			"shipping_taxable": true,
			"shipping_class": "",
			"shipping_class_id": 0,
			"reviews_allowed": false,
			"average_rating": "0.00",
			"rating_count": 0,
			"related_ids": [2847,
			2851,
			3004,
			2845,
			2842],
			"upsell_ids": [],
			"cross_sell_ids": [],
			"parent_id": 0,
			"purchase_note": "",
			"categories": [{
				"id": 53,
				"name": "[:it]Minidress[:en]Mini dress[:]",
				"slug": "mini-dress"
			},
			{
				"id": 75,
				"name": "[:it]Outlet[:en]Outlet[:]",
				"slug": "outlet"
			}],
			"tags": [],
			"images": [{
				"id": 2995,
				"date_created": "2015-04-15T04:29:50",
				"date_modified": "2015-04-15T04:29:50",
				"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
				"name": "IMG_0503_ok",
				"alt": "",
				"position": 0
			},
			{
				"id": 2992,
				"date_created": "2015-04-15T04:29:45",
				"date_modified": "2015-04-15T04:29:45",
				"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0502-_ok.jpg",
				"name": "IMG_0502-_ok",
				"alt": "",
				"position": 1
			}],
			"attributes": [{
				"id": 0,
				"name": "Taglia",
				"position": 0,
				"visible": true,
				"variation": true,
				"options": ["Small",
				"Medium",
				"Large",
				"Extralarge"]
			}],
			"default_attributes": [{
				"id": 0,
				"name": "taglia",
				"option": "small"
			}],
			"variations": [{
				"id": 3028,
				"date_created": "2015-04-15T11:01:09",
				"date_modified": "2015-04-15T11:01:09",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Small",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 2,
				"in_stock": true,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Small"
				}]
			},
			{
				"id": 3029,
				"date_created": "2015-04-15T11:01:28",
				"date_modified": "2015-04-15T11:01:28",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Large",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 0,
				"in_stock": false,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Large"
				}]
			},
			{
				"id": 3030,
				"date_created": "2015-04-15T11:05:56",
				"date_modified": "2015-04-15T11:05:56",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Medium",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 3,
				"in_stock": true,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Medium"
				}]
			},
			{
				"id": 3031,
				"date_created": "2015-04-15T11:08:02",
				"date_modified": "2015-04-15T11:08:02",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Extralarge",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 0,
				"in_stock": false,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Extralarge"
				}]
			}],
			"grouped_products": [],
			"menu_order": 0,
			"_links": {
				"self": [{
					"href": "http://www.zizafashion.it/wp-json/wc/v1/products/3002"
				}],
				"collection": [{
					"href": "http://www.zizafashion.it/wp-json/wc/v1/products"
				}]
			}
		},
		"attributeLookup": [{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Black",
			"id": 37,
			"slug": "black"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Blu royal/fantasia",
			"id": 69,
			"slug": "blu-royalfantasia"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Blue",
			"id": 38,
			"slug": "blue"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Green",
			"id": 39,
			"slug": "green"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Grey",
			"id": 41,
			"slug": "grey"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Red",
			"id": 46,
			"slug": "red"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "Verde/fantasia",
			"id": 70,
			"slug": "verdefantasia"
		},
		{
			"groupName": "Colors",
			"groupID": 2,
			"name": "White",
			"id": 36,
			"slug": "white"
		},
		{
			"groupName": "Size",
			"groupID": 1,
			"name": "L",
			"id": 32,
			"slug": "l"
		},
		{
			"groupName": "Size",
			"groupID": 1,
			"name": "M",
			"id": 31,
			"slug": "m"
		},
		{
			"groupName": "Size",
			"groupID": 1,
			"name": "S",
			"id": 34,
			"slug": "s"
		},
		{
			"groupName": "Size",
			"groupID": 1,
			"name": "XL",
			"id": 33,
			"slug": "xl"
		},
		{
			"groupName": "Size",
			"groupID": 1,
			"name": "XS",
			"id": 35,
			"slug": "xs"
		}]
	},
	"active": true,
	"categoriesExternalID": ["53",
	"75"],
	"variations": [{
		"brandID": "5e8ab45b-2b2f-48f3-85ef-6cb8312b7731",
		"externalID": "3028",
		"productType": "Simple",
		"importData": {
			"product": {
				"id": 3028,
				"date_created": "2015-04-15T11:01:09",
				"date_modified": "2015-04-15T11:01:09",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Small",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 2,
				"in_stock": true,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Small"
				}]
			},
			"attributeLookup": [{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Black",
				"id": 37,
				"slug": "black"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blu royal/fantasia",
				"id": 69,
				"slug": "blu-royalfantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blue",
				"id": 38,
				"slug": "blue"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Green",
				"id": 39,
				"slug": "green"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Grey",
				"id": 41,
				"slug": "grey"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Red",
				"id": 46,
				"slug": "red"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Verde/fantasia",
				"id": 70,
				"slug": "verdefantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "White",
				"id": 36,
				"slug": "white"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "L",
				"id": 32,
				"slug": "l"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "M",
				"id": 31,
				"slug": "m"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "S",
				"id": 34,
				"slug": "s"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XL",
				"id": 33,
				"slug": "xl"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XS",
				"id": 35,
				"slug": "xs"
			}]
		},
		"active": false
	},
	{
		"brandID": "5e8ab45b-2b2f-48f3-85ef-6cb8312b7731",
		"externalID": "3029",
		"productType": "Simple",
		"importData": {
			"product": {
				"id": 3029,
				"date_created": "2015-04-15T11:01:28",
				"date_modified": "2015-04-15T11:01:28",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Large",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 0,
				"in_stock": false,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Large"
				}]
			},
			"attributeLookup": [{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Black",
				"id": 37,
				"slug": "black"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blu royal/fantasia",
				"id": 69,
				"slug": "blu-royalfantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blue",
				"id": 38,
				"slug": "blue"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Green",
				"id": 39,
				"slug": "green"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Grey",
				"id": 41,
				"slug": "grey"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Red",
				"id": 46,
				"slug": "red"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Verde/fantasia",
				"id": 70,
				"slug": "verdefantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "White",
				"id": 36,
				"slug": "white"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "L",
				"id": 32,
				"slug": "l"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "M",
				"id": 31,
				"slug": "m"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "S",
				"id": 34,
				"slug": "s"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XL",
				"id": 33,
				"slug": "xl"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XS",
				"id": 35,
				"slug": "xs"
			}]
		},
		"active": false
	},
	{
		"brandID": "5e8ab45b-2b2f-48f3-85ef-6cb8312b7731",
		"externalID": "3030",
		"productType": "Simple",
		"importData": {
			"product": {
				"id": 3030,
				"date_created": "2015-04-15T11:05:56",
				"date_modified": "2015-04-15T11:05:56",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Medium",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 3,
				"in_stock": true,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Medium"
				}]
			},
			"attributeLookup": [{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Black",
				"id": 37,
				"slug": "black"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blu royal/fantasia",
				"id": 69,
				"slug": "blu-royalfantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blue",
				"id": 38,
				"slug": "blue"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Green",
				"id": 39,
				"slug": "green"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Grey",
				"id": 41,
				"slug": "grey"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Red",
				"id": 46,
				"slug": "red"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Verde/fantasia",
				"id": 70,
				"slug": "verdefantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "White",
				"id": 36,
				"slug": "white"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "L",
				"id": 32,
				"slug": "l"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "M",
				"id": 31,
				"slug": "m"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "S",
				"id": 34,
				"slug": "s"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XL",
				"id": 33,
				"slug": "xl"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XS",
				"id": 35,
				"slug": "xs"
			}]
		},
		"active": false
	},
	{
		"brandID": "5e8ab45b-2b2f-48f3-85ef-6cb8312b7731",
		"externalID": "3031",
		"productType": "Simple",
		"importData": {
			"product": {
				"id": 3031,
				"date_created": "2015-04-15T11:08:02",
				"date_modified": "2015-04-15T11:08:02",
				"permalink": "http://www.zizafashion.it/shop/minidress/?attribute_taglia=Extralarge",
				"sku": "DR_BICTN",
				"price": "33",
				"regular_price": "55",
				"sale_price": "33",
				"date_on_sale_from": "",
				"date_on_sale_to": "",
				"on_sale": true,
				"purchasable": true,
				"visible": true,
				"virtual": false,
				"downloadable": false,
				"downloads": [],
				"download_limit": -1,
				"download_expiry": -1,
				"tax_status": "taxable",
				"tax_class": "",
				"manage_stock": true,
				"stock_quantity": 0,
				"in_stock": false,
				"backorders": "no",
				"backorders_allowed": false,
				"backordered": false,
				"weight": "",
				"dimensions": {
					"length": "",
					"width": "",
					"height": ""
				},
				"shipping_class": "",
				"shipping_class_id": 0,
				"image": [{
					"id": 2995,
					"date_created": "2015-04-15T04:29:50",
					"date_modified": "2015-04-15T04:29:50",
					"src": "http://www.zizafashion.it/wp-content/uploads/2015/04/IMG_0503_ok.jpg",
					"name": "IMG_0503_ok",
					"alt": "",
					"position": 0
				}],
				"attributes": [{
					"id": 0,
					"name": "taglia",
					"option": "Extralarge"
				}]
			},
			"attributeLookup": [{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Black",
				"id": 37,
				"slug": "black"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blu royal/fantasia",
				"id": 69,
				"slug": "blu-royalfantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Blue",
				"id": 38,
				"slug": "blue"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Green",
				"id": 39,
				"slug": "green"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Grey",
				"id": 41,
				"slug": "grey"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Red",
				"id": 46,
				"slug": "red"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "Verde/fantasia",
				"id": 70,
				"slug": "verdefantasia"
			},
			{
				"groupName": "Colors",
				"groupID": 2,
				"name": "White",
				"id": 36,
				"slug": "white"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "L",
				"id": 32,
				"slug": "l"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "M",
				"id": 31,
				"slug": "m"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "S",
				"id": 34,
				"slug": "s"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XL",
				"id": 33,
				"slug": "xl"
			},
			{
				"groupName": "Size",
				"groupID": 1,
				"name": "XS",
				"id": 35,
				"slug": "xs"
			}]
		},
		"active": false
	}]
	}
  }
}
