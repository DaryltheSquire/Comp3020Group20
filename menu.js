// I will need to store the items in the session storage eventually.
// Just do that and then load the array when the page is loaded, store the array when the page is changed.

// Change it to not load the info at all? Just place it in the side order?

// var elementHtml = element.outerHTML; to get the entire string representation of the element.

var orderedItems = [];

$(document).ready(function(){ 
    var url_string = window.location.href;
    var url = new URL(url_string);
    var menu = url.searchParams.get("menu");
    document.title = menu;

    loadItemsToSide();

    showMenu(menu);
});

function showMenu(menu){
    $(".menu-items-dock").hide();
    $("#title-main").text(menu);
    menu = menu.toLowerCase();
    $("#" + menu).show();
}

function showIngredients(ingredients_block){
    if($("#ingredients-" + ingredients_block).is(":visible")){
        $("#ingredients-" + ingredients_block).hide();
    }
    else {
        $("#ingredients-" + ingredients_block).show();
    }
}

function showAllergies(allergy_block){
    if($("#allergies-" + allergy_block).is(":visible")){
        $("#allergies-" + allergy_block).hide();
    }
    else {
        $("#allergies-" + allergy_block).show();
    }
}

function addQuantity(quantity_element){
    var currQuantity = parseInt($("#quantity-" + quantity_element).text());

    currQuantity++;
    $("#quantity-" + quantity_element).text(currQuantity);

    updateTotal(quantity_element, currQuantity);
}

function reduceQuantity(quantity_element){
    var currQuantity = parseInt($("#quantity-" + quantity_element).text());
    
    if(currQuantity > 0){
        currQuantity--;
    }

    $("#quantity-" + quantity_element).text(currQuantity);
    updateTotal(quantity_element, currQuantity);
}

function updateTotal(total_element, quantity){
    var total = parseFloat(quantity * parseFloat($("#price-" + total_element).text())).toFixed(2);
    $("#total-" + total_element).text("Total: " + total + "$");
}

/* Cookies format:
    past-items= [
     {
		"id": 1,
		"item-name": "hamburger",
		"special-instructions": "",
		"price": 200,
     }
	 {
		"id": 2,
		"item-name": "fries",
		"special-instructions": "No salt",
		"price": 200
	 }
    ]
    each new item removes the ], adds a ", " then the new items with a ] ending
*/
function addToOrder(itemNumber){
    /*  add quantity number of those items to the cookies
        id is itemNumber
        item-name is gotten by $("#name-" + itemNumber)
        special-instructions is by $("#special-instruc-" + itemNumber)
        price is by $("#price-" + itemNumber)
        quantity is by $("#quantity-" + itemNumber)
    */
    
    var currentItems = sessionStorage.getItem("current-items");
    var itemName;
    var specialInstructions;
    var price;
    var quantity = $("#quantity-" + itemNumber).text();
    var currItem;

    if(currentItems == null){
        currentItems = "[]";
    }

    for(var i = 0; i < quantity; i++){
        itemName = $("#name-" + itemNumber).text();
        specialInstructions = $("#special-instruc-" + itemNumber).val();
        price = $("#price-" + itemNumber).text();

        currItem = "{id:" + itemNumber + ",item-name:" + itemName + ",special-instructions:" + specialInstructions + 
        ",price:" + price + "}";

        if(currentItems === "[]"){
            currentItems = currentItems.slice(0, -1);
            currentItems += currItem + "]";
        }
        else {
            currentItems = currentItems.slice(0, -1);
            currentItems += currItem + "]";
        }

        if( i == 0 ) {
            addItemToSideOrder( itemName, quantity, price );
        }
    }

    sessionStorage.setItem("current-items", currentItems);

    //Gets the current item, and saves the layout in sessionStorage
    var itemAsHTML = document.getElementById("item-"+itemNumber).outerHTML;

    resetItemAfterOrder(itemNumber);

    sessionStorage.setItem(itemNumber, itemAsHTML);
    //needs a way to update the side order tab
}

function resetItemAfterOrder(itemID){
    $("#special-instruc-" + itemID).val("");
    $("#quantity-" + itemID).text("0");
    $("#total-" + itemID).text("Total: 0.00$");
}

var orderedItems = [];

function loadItemsToSide() {
    //when document is ready, open up session storage, go through each item and then display it
    var currentItems = sessionStorage.getItem("current-items");
    currentItems = currentItems.replace("[", "");
    currentItems = currentItems.replace("]", "");

    var splitItems = currentItems.split("}");
    var currItemToParse;
    var currID;
    var quantity;
    var overallItemInfo;
    var specialInstructions;
    var itemName;

    var itemsAddedBlacklist = [];

    //Goes through each item, and parses it for its necessary ID / Instructions / Quantity / Price
    //Afterwards creates an item display for it once all the info is found, as well as updates the overall total
    for(var i = 0; i < splitItems.length; i++){
        splitItems[i] = splitItems[i].replace("{", "");
        currItemToParse = splitItems[i].split(",");
         
        overallItemInfo = splitItems[i];            
        currID = getItemID(currItemToParse);
        
        if(currID != null) {
            itemName = getItemName( currItemToParse );
            quantity = getQuantity(currentItems, overallItemInfo);
            specialInstructions = getSpecialInstructions(currItemToParse);
            price = getPrice(currItemToParse);
            
            if(!itemsAddedBlacklist.includes("quantity:" + quantity + " " + specialInstructions))
            {
                addItemToSideOrder(itemName, quantity, price);
                itemsAddedBlacklist.push("quantity:" + quantity + " " + specialInstructions);
            }
        }
        
    }
}

function getItemName( itemToParse ) {
    var itemName = "item-name:";
    for( var i = 0; i < itemToParse.length; i++ ) {
        if( itemToParse[i].includes( itemName ) ) {
            return itemToParse[i].substr( itemName.length )
        }
    }
}

function getPrice(itemToParse){
    for(var j = 0; j < itemToParse.length; j++){
        if(itemToParse[j].includes("price:")){
            return itemToParse[j].replace("price:", ""); 
        }
    }
}

 function getSpecialInstructions(itemToParse){
     var specialInstruc = "special-instructions:"
     for(var j = 0; j < itemToParse.length; j++){
         if(itemToParse[j].includes("special-instructions:")){
             return itemToParse[j].substr(specialInstruc.length); //removes special instructions text and returns 
         }
     }
 }
 
 function getQuantity(currentItems, itemInfo){
     var tempQuantityCheck = currentItems.split(itemInfo);
     
     return tempQuantityCheck.length - 1;
 }

//Parses the item for an ID
function getItemID(itemToParse){
    for(var j = 0; j < itemToParse.length; j++){
        if(itemToParse[j].includes("id:")){
            tempID = itemToParse[j].split(":");
            tempID = tempID[1].replace(",", "");

            return tempID; //ID of the item
        }
    }
}

function addItemToSideOrder( name, quantity, price ) {
    var item;
    var added = false;

    for( item of orderedItems ) {
        if( item.name == name ) {
            item.quantity = Number( item.quantity ) + Number( quantity );
            item.total = Number( item.total ) + Number( price * quantity );
            added = true;
            updateItemInDisplay( item );
            break;
        }
    }

    if( !added ) {
        item = orderedItem( name, quantity, price );  
        addItemToDisplay( item );
        orderedItems.push( item );
    }

    updateTotal();
}

function orderedItem( name, quantity, price ) {
    var item = { name:name, quantity:quantity, total:price * quantity }
    return item;
}

function updateTotal( amountToChangeBy ) {

}

function updateItemInDisplay( item ) {
    var p2_id = "side-order-item-quantity_" + item.name;
    var p3_id = "side-order-item-cost_" + item.name;
    var p2 = document.getElementById( p2_id ).textContent = "X" + item.quantity;

    var p3 = document.getElementById( p3_id ).textContent = "$" + item.total;
}

function addItemToDisplay( item ) {
    var div_id = "side-order-item_" + item.name;
    var p1_id = "side-order-item-name_" + item.name;
    var p2_id = "side-order-item-quantity_" + item.name;
    var p3_id = "side-order-item-cost_" + item.name;

    var div = document.createElement("div");
    div.id = div_id;
    div.className = "side-order-item";

    var parent = document.getElementsByClassName( "side-order-items-block" );
    parent[0].appendChild( div );

    var p1 = document.createElement("P");
    p1.id = p1_id;
    p1.className = "side-order-item-name";
    p1.textContent = item.name;

    var p2 = document.createElement("P");
    p2.id = p2_id;
    p2.className = "side-order-item-quantity";
    p2.textContent = "X" + item.quantity;

    var p3 = document.createElement("P");
    p3.id = p3_id;
    p3.className = "side-order-item-cost";
    p3.textContent = "$" + item.total;

    div.appendChild( p1 );
    div.appendChild( p2 );
    div.appendChild( p3 );
}

function refreshDisplay() {
 
}
