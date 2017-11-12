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