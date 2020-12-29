export const currentlySelectedChips = (categoryChips) => {
	let selectedChips = [];
	for (var i = 0; i < categoryChips.length; i++) {
		if (categoryChips[i].clicked) {
			selectedChips.push(categoryChips[i].label);
		}
	}
	return selectedChips;
};
