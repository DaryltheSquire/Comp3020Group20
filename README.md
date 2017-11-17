# Comp3020Group20
Project for HCI Group #20

## Internal Notes
### Feedback to be implemented
- instead of + symbol, have explcit "add another bill", show something to say that things can be dragged there
- split bill - enter quantity 
- back button to get back to main menu
- add more sections and have bettern naming for the sections
- paying for order should have its own button on all screens (persistent)
- order is always on the right side of the screen when in the menu, or even in the main menu grid screen? 
- breadcrumbs for navigation
- get food items for menu (like scrub some data from somewhere or make fake food items)

### Feedback to be discussed
- payment (?)
- have buttons/tabs for navigation rather than the side menu (?)
- some sort of button to submit order (?)
	- big button or reminder after timeout
	- should return to the main menu grid after the order is submitted
- how to style / make the side order tab look / display

### Advanced feedback to be considered later
- editing order from side panel

# Meeting Notes (Nov. 17)

- welcome: done
- menu: almost done - just need to have data and pictures added, 
	- big items and small items
		- only use expanded view, allergies and info will be hidden, there's a button that will show it
		- write up why we didn't go with the expanded view
			- creates confusing display because items shuffled around
			- realized it took longer to use with both small and big views
			- the layout we came up with for expanded views was harder to use in a website, when we originally envisioned the use of this project on a tablet-like device
- data structure for storing items in the cookie

```
items: [
	{
		"id": 1,
		"item-name": "hamburger",
		"special-instructions": "",
		"price": 200,
	},
	{
		"id": 2,
		"item-name": "fries",
		"special-instructions": "No salt",
		"price": 200,
	}
]
```

- payment screen: not done, needs to have layout done and then javascript functionality done.
- current order screen: not done, still needs javascript functionality that renders items that are in the cookie.
- write-up: just need to add any bugs that exist, and a project description.
	- project description: how the prototype was built, and major features exposed, any screenshots of the interface, showcase what we're proud of and the strengths of the system.
