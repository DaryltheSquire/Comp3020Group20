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

    if (event.target == document.getElementById('help-req-popup')) {
        $('#help-req-popup').hide();
    }
}

function closeModal() {
    $('#submit-order-popup').hide();
    $('#help-req-popup').hide();
}

function displayModal(){
    document.getElementById('submit-order-popup').style.display = "block";

    setTimeout(function(){
        $('#submit-order-popup').hide();
    }, 5000);
}

function payForOrderScreen(){
    window.location.assign("payment.html");
}

function callForHelp() {
    document.getElementById('help-req-popup').style.display = "block";

    setTimeout(function(){
        $('#help-req-popup').hide();
    }, 5000);
}