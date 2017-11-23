var orderedItems = [];  // Store in ram when page remains loaded.
var orderTotal = 0.00;

function callForHelp() {
    document.getElementById('help-req-popup').style.display = "block";

    setTimeout(function(){
        $('#help-req-popup').hide();
    }, 5000);
}

window.onclick = function(event) {
    if (event.target == document.getElementById('help-req-popup')) {
        $('#help-req-popup').hide();
    }
}

function closeModal() {
    $('#help-req-popup').hide();
}

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
    $("#total-" + total_element).text("Total: $" + total);
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
    /*  add quantity number of those items to the session storage
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
        specialInstructions = $("#special-instruc-" + itemNumber).val().replace("\"", "'");
        price = $("#price-" + itemNumber).text();

        currItem = 
            '{"id": '+ itemNumber + ', "item-name": "' + itemName + '", "special-instructions": "' + specialInstructions + '", "price": ' + price +'}';

        // Add comma before currItem there are already items in the list, for JSON compatibility
        if (!currentItems)
            currentItems = "[]";
        if (currentItems === "[]"){
            currentItems = currentItems.slice(0, -1); // remove the last bracket
            currentItems += currItem + "]"; // add current item then re-add the array end bracket
        }
        else {
            currentItems = currentItems.slice(0, -1);
            currentItems += ", " + currItem + "]";
        }

        if( i == 0 ) {
            addItemToSideOrder( itemName, quantity, price );
        }
    }

    sessionStorage.setItem("current-items", currentItems);

    //Gets the current item, and saves the layout in sessionStorage
    var itemAsHTML = document.getElementById("item-"+itemNumber).outerHTML;

    if( quantity > 0 )
        resetItemAfterOrder(itemNumber);

    sessionStorage.setItem(itemNumber, itemAsHTML);
    //needs a way to update the side order tab
}

function resetItemAfterOrder(itemID){
    $("#special-instruc-" + itemID).val("");
    $("#quantity-" + itemID).text("0");
    $("#total-" + itemID).text("Total: $0.00");
}

function loadItemsToSide() {
    //when document is ready, open up session storage, go through each item and then display it
    var currentItemsRaw = sessionStorage.getItem("current-items");
    if(!currentItemsRaw)
        return;

    var currentItems = JSON.parse(currentItemsRaw);

    var distinctItems = {};

    for (var i = currentItems.length - 1; i >= 0; i--) {
        var itemID = currentItems[i]["id"];
        var itemName = currentItems[i]["item-name"];
        var specialInstructions = currentItems[i]["special-instructions"];
        var price = currentItems[i]["price"];

        var quantKey = itemID + "-" + specialInstructions; //e.g., 1-Hush Puppies, or simply 1- with no instructions

        // Hack, creates new json objects to store original items with no duplicates, instead using quantity values.
        if (!distinctItems[quantKey]) {
            distinctItems[quantKey] = {
                "id": itemID,
                "item-name": itemName,
                "special-instructions": specialInstructions,
                "price": price,
                "quantity": 0
            };
        }

        distinctItems[quantKey]["quantity"]++;
    }

    // Creates an item display for it once all the info is found, as well as updates the overall total
    for (var key in distinctItems) {
        addItemToSideOrder(distinctItems[key]["item-name"], distinctItems[key]["quantity"], distinctItems[key]["price"]);
    }
}

function addItemToSideOrder( name, quantity, price ) {
    var item;
    var added = false;

    var newCost = Number( price * quantity ).toFixed( 2 );

    for( item of orderedItems ) {
        if( item.name == name ) {
            var newTotal = Number( item.total ) + Number( newCost );
            item.quantity = Number( item.quantity ) + Number( quantity );
            item.total = Number( newTotal ).toFixed( 2 );
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

    updateSideTotal( newCost );
}

function orderedItem( name, quantity, price ) {
    var item = { name:name, quantity:quantity, total:price * quantity }
    return item;
}

function updateSideTotal( amountToChangeBy ) {
    orderTotal += Number( amountToChangeBy );
    $( "#side-order-total-amount" ).text( Number( orderTotal ).toFixed( 2 ) );
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
    p3.textContent = "$" + Number( item.total ).toFixed( 2 );

    div.appendChild( p1 );
    div.appendChild( p2 );
    div.appendChild( p3 );
}

function editOrder() {
    window.location.assign("edit-order.html");
}

function submitOrder(){
    //move items from current-items to past-items and then clears current-items
    var currentItemsRaw = sessionStorage.getItem("current-items");

    if(currentItemsRaw){
        var newlyAddedToPastItems = JSON.parse(currentItemsRaw);

        var pastItemsRaw = sessionStorage.getItem("past-items");
        var pastItems = [];

        if (pastItemsRaw)
            pastItems = JSON.parse(pastItemsRaw);

        pastItems = pastItems.concat(newlyAddedToPastItems);

        sessionStorage.setItem("past-items", JSON.stringify(pastItems));
        sessionStorage.setItem("current-items", "");

        //Just set a random thing to check in index, to make the modal popup
        sessionStorage.setItem("placed-order", "1");

        //Navigate back to home page
        window.location.assign("index.html");
    }
}