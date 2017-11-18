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
    if($(ingredients_block).is(":visible")){
        $(ingredients_block).hide();
    }
    else {
        $(ingredients_block).show();
    }
}

function showAllergies(allergy_block){
    if($(allergy_block).is(":visible")){
        $(allergy_block).hide();
    }
    else {
        $(allergy_block).show();
    }
}

function addQuantity(quantity_element){
    var currQuantity = parseInt($(quantity_element).text());

    currQuantity++;
    $(quantity_element).text(currQuantity);
}

function reduceQuantity(quantity_element){
    var currQuantity = parseInt($(quantity_element).text());
    
    if(currQuantity > 0){
        currQuantity--;
    }

    $(quantity_element).text(currQuantity);
}