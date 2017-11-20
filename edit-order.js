$(document).ready(function(){ 
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
   
   for(var i = 0; i < splitItems.length; i++){
        splitItems[i] = splitItems[i].replace("{", "");
        currItemToParse = splitItems[i].split(",");
        
        overallItemInfo = splitItems[i];
        overallItemInfo = overallItemInfo.substr(1); //remove the first character just incase, wont matter anyway

        currID = getItemID(currItemToParse);
        quantity = getQuantity(currentItems, overallItemInfo);
        specialInstructions = getSpecialInstructions(currItemToParse);
        
        //so use currID to find the proper div container, use it
        //replace the special instructions with the new ones
        //replace the quantity with the new one
        //replace the item total with the new one
        //add specialInstructions to the blacklist to prevent it being used again

   }
});

//this'll add each item into the div of items
function displayItem(itemID){
    //use itemID to get the entire div layout
    //delete the addToOrder button
    //count the number of times that itemID appears, and update the quantity and total with it
    //does so by updateTotals(itemID, quantityOfItems) 
}

function getSpecialInstructions(itemToParse){
    var specialInstruc = "special-instructions:"
    for(var j = 0; j < itemToParse.length; j++){
        if(itemToParse[j].includes("special-instructions:")){
            return itemToParse.substr(specialInstruc.length); //removes special instructions text and returns 
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
}

function reduceQuantity(quantity_element){
    var currQuantity = parseInt($("#quantity-" + quantity_element).text());
    
    if(currQuantity > 0){
        currQuantity--;
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
    $("#total-" + total_element).text("Total: " + itemTotal + "$");

    var changedAmount = itemTotal - prevItemTotal; //Price difference from new total, from previous total

    //Update overall total
    var currentOverallTotal = parseFloat($("#total").text()).toFixed(2); //Current overall total
    var newOverallTotal = parseFloat(Number(currentOverallTotal) 
    + Number(changedAmount)).toFixed(2); //New overall total

    $("#total").text(newOverallTotal);
}
