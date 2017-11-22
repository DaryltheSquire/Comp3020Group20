$(document).ready(function(){ 
    var url_string = window.location.href;
    var url = new URL(url_string);
    var menu = url.searchParams.get("menu");
    document.title = menu;

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
        specialInstructions = $("#special-instruc-" + itemNumber).val();
        price = $("#price-" + itemNumber).text();

        currItem = 
            '{"id": '+ itemNumber + ', "item-name": "' + itemName + '", "special-instructions": "' + specialInstructions + '", "price": ' + price +'}';

        // Add comma before currItem there are already items in the list, for JSON compatibility
        if (currentItems === "[]"){
            currentItems = currentItems.slice(0, -1); // remove the last bracket
            currentItems += currItem + "]"; // add current item then re-add the array end bracket
        }
        else {
            currentItems = currentItems.slice(0, -1);
            currentItems += ", " + currItem + "]";
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