/*============================================
payment.js
General scripting for payment.html screen
============================================*/

$(document).ready(function(e) {
	generateItemDivs();  
	$(".draggable").draggable({cursor: "crosshair", revert: "invalid"});

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
});

function generateItemDivs() {
	return 0;
}