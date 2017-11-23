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
	$(".draggable").draggable({
		helper: "clone", 
		cursor: "crosshair", 
		revert: "invalid", 
		appendTo: "body",
		start: function(event, ui) {
			$(this).draggable('instance').offset.click = {
	            left: Math.floor(ui.helper.width() / 2),
	            top: Math.floor(ui.helper.height() / 2)
          	}
		}
	})
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

function generateItemDivs() {
	var currentItemIndex = 0;

	var pastItemsRaw = sessionStorage.getItem("past-items");

	if (!pastItemsRaw)
		showNoItemsModal();

	var pastItems = JSON.parse(pastItemsRaw);

	for (var i = 0; i < pastItems.length; i++) {
		console.log(pastItems[i]);
		var newItem = 
			'<div class="draggable food-item" data-price="' + pastItems[i]["price"] + '">' +
				'<p class="item-name">' + pastItems[i]["item-name"] + '</p>' +
				'<p class="item-instructions">' + pastItems[i]["special-instructions"] + '</p>' +
				'<p class="item-price">$' + parseFloat(pastItems[i]["price"], 10).toFixed(2) + '</p>' +
			'</div>';

		$('#initial-container').append(newItem);
	}
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

function deleteLastBill() {
	if (numberOfBills > 1) {
		numberOfBills--;
		$(".last-created-bill").find(".food-item").appendTo("#initial-container");
		$(".last-created-bill").remove();

		if (numberOfBills > 1)
			$("#add-new-bill-button").prev().addClass("last-created-bill");
		
		recalculateBillTotals();
	}
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

function showNoItemsModal() {
    document.getElementById('no-past-items-popup').style.display = "block";
}

function closeCallPaymentModal() {
    $('#call-payment-popup').hide();
}