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

    var itemsAddedBlacklist = [];

    //Goes through each item, and parses it for its necessary ID / Instructions / Quantity / Price
    //Afterwards creates an item display for it once all the info is found, as well as updates the overall total
    for(var i = 0; i < splitItems.length; i++){
        splitItems[i] = splitItems[i].replace("{", "");
        currItemToParse = splitItems[i].split(",");
         
        overallItemInfo = splitItems[i];            
        currID = getItemID(currItemToParse);
        
        if(currID != null) {
            quantity = getQuantity(currentItems, overallItemInfo);
            specialInstructions = getSpecialInstructions(currItemToParse);
            price = getPrice(currItemToParse);
            
            if(!itemsAddedBlacklist.includes("quantity:" + quantity + " " + specialInstructions))
            {
                displayItem(currID, quantity, specialInstructions, price);
                itemsAddedBlacklist.push("quantity:" + quantity + " " + specialInstructions);
            }
        }
        
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
    $("#total-" + newID).text("Total: " + itemTotal + "$");

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

    var item = "{id:" + itemID + ",item-name:" + itemName + ",special-instructions:" + specialInstructions + 
    ",price:" + price + "}";

    return item;
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