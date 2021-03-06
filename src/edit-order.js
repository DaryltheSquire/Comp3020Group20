$(document).ready(function(){ 
    // when document is ready, open up session storage, go through each item and then display it
    // if session storage doesn't have current items, don't do anything. (or, display message?)
    var currentItemsRawData = sessionStorage.getItem("current-items");

    if (!currentItemsRawData)
        return;
    
    var currentItems = JSON.parse(currentItemsRawData);

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
        displayItem(distinctItems[key]["id"], distinctItems[key]["quantity"], distinctItems[key]["special-instructions"], distinctItems[key]["price"]);        
    }
});
 
var nextID = 1;

//Creates divs per item with the necessary parts
function displayItem(itemID, quantity, specialInstructions, price){
    var itemLayout = sessionStorage.getItem(itemID);

    //Replace all ID's in the div with the updated version
    var newID = nextID + "_" + itemID;

    //Replace all ID's in the div with the updated version
    itemLayout = itemLayout.replace("price-" + itemID, "price-" + newID);
    itemLayout = itemLayout.replace("name-" + itemID, "name-" + newID);
    itemLayout = itemLayout.replace("item-" + itemID, "item-" + newID);
    itemLayout = itemLayout.replace("ingredients-" + itemID, "ingredients-" + newID);
    itemLayout = itemLayout.replace("showAllergies('" + itemID + "')", "showAllergies('" + newID + "')");
    itemLayout = itemLayout.replace("allergies-" + itemID, "allergies-" + newID);
    itemLayout = itemLayout.replace("showIngredients('" + itemID + "')", "showIngredients('"  + newID + "')");
    itemLayout = itemLayout.replace("special-instruc-" + itemID, "special-instruc-" + newID);
    itemLayout = itemLayout.replace("reduceQuantity('" + itemID + "')", "reduceQuantity('" + newID + "')");
    itemLayout = itemLayout.replace("addQuantity('" + itemID + "')", "addQuantity('" + newID + "')");
    itemLayout = itemLayout.replace("quantity-" + itemID, "quantity-" + newID);
    itemLayout = itemLayout.replace("total-" + itemID, "total-" + newID);
    itemLayout = itemLayout.replace("temp-add-to-order", "temp-add-to-order-" + newID);
    nextID++;

    //Adds the specified item ID layout to the order overall
    $(".menu-items-dock").append(itemLayout);

    //delete (just hides it to not break the layout) the addToOrder button  
    document.getElementById("temp-add-to-order-" + newID).style.visibility = "hidden";
    
    //replace the special instructions with the new ones
    $("#special-instruc-" + newID).val(specialInstructions);

    //replace the quantity with the new one
    $("#quantity-" + newID).text(quantity);

    var itemTotal = parseFloat(Number(quantity) * Number(price)).toFixed(2);
    $("#total-" + newID).text("Total: $" + itemTotal);

    updateOverallTotal(itemTotal);
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
 
    updateTotals(quantity_element, currQuantity);

    //also needs to add one of the items to sessionstorage
    var currentOrder = sessionStorage.getItem("current-items"); //overall items
    var itemID = findActualIDOf(quantity_element); //standard ID
    var itemToAdd = createObjectOfItem(itemID, quantity_element); //item that gets added

    currentOrder = currentOrder.replace("]", itemToAdd + "]");
    sessionStorage.setItem("current-items", currentOrder);
}

function findActualIDOf(id){
    var normalID = "";
    var split = id.split("_");

    if(split.length == 1){
        return split[0];
    }
    else if(split.length >= 2){
        return split[1];
    }

    return id;
}

function createObjectOfItem(itemID, itemEditOrderID){
    var itemName = $("#name-" + itemEditOrderID).text();
    var specialInstructions = $("#special-instruc-" + itemEditOrderID).val();
    var price = $("#price-" + itemEditOrderID).text();

    return ', {"id": '+ itemID + ', "item-name": "' + itemName + '", "special-instructions": "' + specialInstructions + '", "price": ' + price +'}';
}

function reduceQuantity(quantity_element){
    var currQuantity = parseInt($("#quantity-" + quantity_element).text());
    
    if(currQuantity > 0){
        currQuantity--;
        //also needs to delete one of the items from sessionstorage
        var currentOrder = sessionStorage.getItem("current-items");
        var itemID = findActualIDOf(quantity_element); //standard ID
        var itemToAdd = createObjectOfItem(itemID, quantity_element); //item that gets added
    
        currentOrder = currentOrder.replace(itemToAdd, "");
        sessionStorage.setItem("current-items", currentOrder);
    }

    $("#quantity-" + quantity_element).text(currQuantity);
    updateTotals(quantity_element, currQuantity);
}
 
//Updates the total for that specific item
function updateTotals(total_element, quantity){
    var prevItemTotal = $("#total-" + total_element).text();
    prevItemTotal = prevItemTotal.replace("Total: ", "");
    prevItemTotal = prevItemTotal.replace("$", "");
    prevItemTotal = parseFloat(prevItemTotal).toFixed(2);

    //Update item total
    var itemTotal = parseFloat(quantity * parseFloat($("#price-" + total_element).text())).toFixed(2);
    $("#total-" + total_element).text("Total: $" + itemTotal);

    var changedAmount = itemTotal - prevItemTotal; //Price difference from new total, from previous total
    updateOverallTotal(changedAmount);
}
 
//Updates the total for that specific item
function updateOverallTotal(amountToChange){
   var currentOverallTotal = parseFloat($("#total").text()).toFixed(2); //Current overall total
   var newOverallTotal = parseFloat(Number(currentOverallTotal) + Number(amountToChange)).toFixed(2); //New overall total
   
   $("#total").text(newOverallTotal);
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