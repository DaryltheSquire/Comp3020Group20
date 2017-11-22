/*============================================
payment.js
General scripting for payment.html screen
============================================*/

/*--------------------------------------------
Global page variables
--------------------------------------------*/

var numberOfBills = 1;

/*--------------------------------------------
Document initialization
--------------------------------------------*/
$(document).ready(function(e) {
	generateItemDivs();  

	enableDraggableContainers();
	enableDroppableContainers();

	$("#add-new-bill-button").click(function() {
		createNewBill()
	});

	recalculateBillTotals();
});

/*--------------------------------------------
Payment functions
--------------------------------------------*/

function enableDraggableContainers() {
	$(".draggable").draggable({cursor: "crosshair", revert: "invalid"});
}

function enableDroppableContainers() {
	$(".drop").droppable({ accept: ".draggable", 
		drop: function(event, ui) {
			var dropped = ui.draggable;
			var droppedOn = $(this);
			$(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn);      
			$(this).removeClass("drag-over");
			recalculateBillTotals();
		}, 
		over: function(event, elem) {
			$(this).addClass("drag-over");
		},
		out: function(event, elem) {
			$(this).removeClass("drag-over");
		}
	});
	$(".drop").sortable();
}

//TODO: call this at page load to generate all items
function generateItemDivs() {
	var currentItemIndex = 0;
	// read data from session query
	// create a new div for this and put it in bill 1's container
	// do this for all items in session storage

	var item_template = 
		'<div class="draggable food-item" id="item-1" data-price="200.00">\
			<p class="item-name">Item 1</p>\
			<p class="item-price">$200.00</p>\
		</div>'
}

function createNewBill() {
	numberOfBills++;
	var billId = "bill" + numberOfBills;

	var newBill = 
		'<div class="bill-container last-created-bill" id="bill' + numberOfBills + '">\
			<div class="bill-header">\
				<div class="center-text-in-item">\
					<p class="bill-header-title">Bill ' + numberOfBills + '</p>\
				</div>\
			</div>\
			<div class="item-container drop"></div>\
			<div class="bill-footer center-left-text-in-item">\
				<p class="bill-total-text">Bill ' + numberOfBills + ' total:</p><p class="bill-total-price-value">$0.00</p>\
			</div>\
		</div>'

	if (numberOfBills > 2) {
		var previousBillName = "bill" + (numberOfBills - 1);
		$("#" + previousBillName).removeClass("last-created-bill");
	}

	$("#add-new-bill-button").before(newBill);
	enableDroppableContainers(); //must enable droppable on new items
}

//TODO: allow for deleting the last created bill
function deleteBill() {
	// append any items in this bill back to bill 1

	recalculateBillTotals();

	// add class last-created-bill to the new last element

	// remove the bill div
	numberOfBills--;
}

function recalculateBillTotals() {
	$(".bill-total-price-value").each(function() {
		var billTotal = 0.00;

		$(this).closest(".bill-container").find('.food-item').each(function() {
			var item_price = parseFloat($(this).attr("data-price"));
			billTotal += item_price;
		});

		$(this).text('$' + billTotal.toFixed(2));
	})
}

/*--------------------------------------------
Button click functions
--------------------------------------------*/

function goBack() {
	window.history.back();
}

function callWaiterForPayment() {
    document.getElementById('call-payment-popup').style.display = "block";

    setTimeout(function(){
        $('#call-payment-popup').hide();
    }, 5000);
}

function closeModal() {
    $('#call-payment-popup').hide();
}