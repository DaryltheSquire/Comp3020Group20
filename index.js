$(document).ready(function(){ 
    var placed = sessionStorage.getItem("placed-order");

    if(placed != null && placed != ""){
        displayModal();
        sessionStorage.setItem("placed-order", ""); 
    }
});

window.onclick = function(event) {
    if (event.target == document.getElementById('submit-order-popup')) {
        $('#submit-order-popup').hide();
    }
}

function closeModal() {
    $('#submit-order-popup').hide();
}

function displayModal(){
    document.getElementById('submit-order-popup').style.display = "block";

    setTimeout(function(){
        $('#submit-order-popup').hide();
    }, 5000);
}