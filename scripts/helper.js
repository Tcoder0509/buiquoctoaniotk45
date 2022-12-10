var channelID = 1713674
var readAPIKey = 'O9TT7RA2YRXYGPT1'
var writeAPIKey = 'PC3Q63NWIIR5Q8EX'

var product1Import = "field1"
var product1ImportId = 1
var product1Export = "field2"
var product1ExportId = 2

var product2Import = "field3"
var product2ImportId = 3
var product2Export = "field4"
var product2ExportId = 4

var product3Import = "field5"
var product3ImportId = 5
var product3Export = "field6"
var product3ExportId = 6


function getSumImportExport(handle, product) {
	
	var fieldImportName, fieldImportId, fieldExportName, fieldExportId
	
	switch (product) {
		case 'product-1':
			fieldImportName = product1Import
			fieldImportId   = product1ImportId
			fieldExportName = product1Export
			fieldExportId   = product1ExportId
			break
		
		case 'product-2':
			fieldImportName = product2Import
			fieldImportId   = product2ImportId
			fieldExportName = product2Export
			fieldExportId   = product2ExportId
			break
		
		case 'product-3':
		fieldImportName = product3Import
		fieldImportId   = product3ImportId
		fieldExportName = product3Export
		fieldExportId   = product3ExportId
		break 	
		
	}
	
	getSumOfField(fieldImportName, fieldImportId)
		.then(sumImport => {
			getSumOfField(fieldExportName, fieldExportId)
				.then(sumExport => {
					handle(sumImport, sumExport)
				})
		})
}

const getSumOfField = async (fieldName, fieldID) => {
	const url = 'https://api.thingspeak.com/channels/' + channelID + '/fields/' + fieldID + '.json?api_key=' + readAPIKey


	const data = JSON.parse(await makeRequest('GET', url))

	var value = 0
	data.feeds.forEach(function(feed) {
		if (feed[fieldName] != null) {
			value = value + parseInt(feed[fieldName])
		}
	})

	return value

}

const getChartData = async (product, IsImport) => {
	
	var fieldName, fieldId
	
	switch (product) {
		case 'product-1':
			fieldName = IsImport ? product1Import : product1Export
			fieldId   = IsImport ? product1ImportId : product1ExportId
			break
		
		case 'product-2':
			fieldName = IsImport ? product2Import : product2Export
			fieldId   = IsImport ? product2ImportId : product2ExportId
			break 
			
		case 'product-3':
		fieldName = IsImport ? product3Import : product3Export
		fieldId   = IsImport ? product3ImportId : product3ExportId
		break 
	}
	
	
	
	const url = 'https://api.thingspeak.com/channels/' + channelID + '/fields/' + fieldId + '.json?api_key=' + readAPIKey
	const data = JSON.parse(await makeRequest('GET', url))
	
		var x = [], y = []
		data.feeds.forEach(function(feed) {
			if (feed[fieldName] != null) {
				y.push(parseInt(feed[fieldName]))
				x.push(feed.created_at)
			}
		})
		
		return {'x':x, 'y':y}
}

const getLastedFieldValue = async (fieldName, fieldID) => {
	const url = 'https://api.thingspeak.com/channels/' + channelID + '/fields/' + fieldID + '/last.json?api_key=' + readAPIKey
	const data = JSON.parse(await makeRequest('GET', url))

	return parseInt(data[fieldName])
}


const setFieldValue = async (fieldName, value) => {
	const url = 'https://api.thingspeak.com/update?api_key=' + writeAPIKey + '&' + fieldName + '=0' + value
	const result = await makeRequest('GET', url)
	return result
}

function setContentWidth() {
	var screenHeight = window.innerHeight;
	var menuHeight = document.querySelector("#menu").clientHeight;
	
	console.log(screenHeight, menuHeight)
	
	document.querySelector('#content').style.height = `${screenHeight-menuHeight}px`;
}

function loadMenu(currentItem) {
	fetch("../menu/menu.html")
		.then(response => response.text())
		.then(text => {
			document.querySelector("#menu").innerHTML = text;

			if (currentItem != "home") {
				var oldClassName = document.querySelector(".item-" + currentItem).className
				document.querySelector(".item-" + currentItem).className = oldClassName + " current-item"
			}
			setTimeout(setContentWidth(), 10000)
			//setContentWidth()
		})
}



function makeRequest(method, url) {
	return new Promise(function(resolve, reject) {
		let xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function() {
			if (this.status >= 200 && this.status < 300) {
				resolve(xhr.responseText);
			} else {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			}
		};
		xhr.onerror = function() {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};
		xhr.send();
	});
}
