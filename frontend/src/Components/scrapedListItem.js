import React, { useState } from 'react';

export const ScrapedListItem = ({ name, content }) => {
	const [itemName, setItemName] = useState(name);

	return (
		<div>
			<input value={itemName} onChange={(e) => setItemName(e.target.value)} />
			<p>{content}</p>
		</div>
	);
};
