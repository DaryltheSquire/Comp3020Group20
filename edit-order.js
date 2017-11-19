$(document).ready(function(){ 
   //when document is ready, open up session storage, go through each item and then display it
   
});

//this'll add each item into the div of items
function displayItem(itemID){
    //use itemID to get the entire div layout
    //delete the addToOrder button
    //count the number of times that itemID appears, and update the quantity and total with it
    //does so by updateTotals(itemID, quantityOfItems) 
}

//counts the number of times the itemID appears in the current order for quantity
function countQuantityOfItem(itemID){
    var quantity = 0;

    return quantity;
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
