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

    //Goes through each item, and parses it for its necessary ID / Instructions / Quantity / Price
    //Afterwards creates an item display for it once all the info is found, as well as updates the overall total
    for(var i = 0; i < splitItems.length; i++){
        splitItems[i] = splitItems[i].replace("{", "");
        currItemToParse = splitItems[i].split(",");
         
        overallItemInfo = splitItems[i];            
        overallItemInfo = overallItemInfo.substr(1); //remove the first character just incase, wont matter anyway
 
        currID = getItemID(currItemToParse);
        
        if(currID != null) {
            quantity = getQuantity(currentItems, overallItemInfo);
            specialInstructions = getSpecialInstructions(currItemToParse);
            price = getPrice(currItemToParse);
            
            displayItem(currID, quantity, specialInstructions, price);

            //add specialInstructions to the blacklist to prevent it being used again
        }
    }
 });
 
//Creates divs per item with the necessary parts
function displayItem(itemID, quantity, specialInstructions, price){
    
    var itemLayout = sessionStorage.getItem(itemID);

    //Adds the specified item ID layout to the order overall
    $(".menu-items-dock").append(itemLayout);

    //delete the addToOrder button (Needs a way to prevent total from bugging out)
    $("#temp-add-to-order").remove();
    $("#temp-add-to-order-button").remove();
    
    //replace the special instructions with the new ones
    $("#special-instruc-" + itemID).val(specialInstructions);

    //replace the quantity with the new one
    $("#quantity-" + itemID).text(quantity);

    var itemTotal = parseFloat(Number(quantity) * Number(price)).toFixed(2);
    $("#total-" + itemID).text("Total: " + itemTotal + "$");

    updateOverallTotal(itemTotal);
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

     updateOverallTotal(changedAmount);
 }
 
 //Updates the total for that specific item
 function updateOverallTotal(amountToChange){
    var currentOverallTotal = parseFloat($("#total").text()).toFixed(2); //Current overall total
    var newOverallTotal = parseFloat(Number(currentOverallTotal) + Number(amountToChange)).toFixed(2); //New overall total

    $("#total").text(newOverallTotal);
}