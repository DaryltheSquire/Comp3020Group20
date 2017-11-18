$(document).ready(function(){ 
    var url_string = window.location.href;
    var url = new URL(url_string);
    var menu = url.searchParams.get("menu");

    showMenu(menu);
});

function showMenu(menu){
    $(".menu-items-dock").hide();
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
     },
	 {
		"id": 2,
		"item-name": "fries",
		"special-instructions": "No salt",
		"price": 200,
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
    */
    
    //must update the side order as well
}