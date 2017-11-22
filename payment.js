/*============================================
payment.js
General scripting for payment.html screen
============================================*/

/*--------------------------------------------
Global page variables
--------------------------------------------*/

var numberOfBills = 1;

$(document).ready(function(e) {
	generateItemDivs();  

	enableDraggableContainers();
	enableDroppableContainers();

	$("#add-new-bill-button").click(function(event) {
		var newBill = createNewBill();
		$("#add-new-bill-button").before(newBill);
		enableDroppableContainers(); //must enable droppable on new items
	});
});

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

function generateItemDivs() {
	var currentItemIndex = 0;
	// read data from session query

	// create a new div for this and put it in bill 1's container
	
}

function createNewBill() {
	// generates a new layout that will hold the new bill container
	numberOfBills++;

	var template_billContainer = 
		'<div class="bill-container" id="bill-' + numberOfBills + '">\
			<div class="bill-header">\
				<div class="center-text-in-item">\
					<p class="bill-header-title">Bill ' + numberOfBills + '</p>\
				</div>\
			</div>\
			<div class="item-container drop"></div>\
			<div class="bill-footer">\
				<div class="center-left-text-in-item">\
					<p class="bill-total-text">Bill ' + numberOfBills + ' total:</p><p id="bill-total-' + numberOfBills + '"></p>\
				</div>\
			</div>\
		</div>\
		'
	return template_billContainer;
}

function deleteBill() {
	// add any items in this bill back to bill 1

	// recalculate any totals

	// remove the bill div
}