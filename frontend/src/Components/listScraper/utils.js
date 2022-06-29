import { xor, isEmpty } from 'lodash';

export const getSelectorsFromElements = (titleEl, contentEl) => {
	const { nodeName: tNodeName, className: tClassName } = titleEl;
	const { nodeName: cNodeName, className: cClassName } = contentEl;

	const tSelector =
		tNodeName.toLowerCase() +
		(tClassName ? '.' + tClassName.split(' ').join('.') : '');
	const cSelector =
		cNodeName.toLowerCase() +
		(cClassName ? '.' + cClassName.split(' ').join('.') : '');

	return [tSelector, cSelector];
};

export const areListicleVariablesPresent = (listicleVariable) =>
	isEmpty(
		xor(Object.keys(listicleVariable), [
			'url',
			'titleSelector',
			'contentSelector',
		])
	);

export const consumeArrayOfDocuments = (
	arrayOfDocuments,
	editableListItemsRef,
	setListItems
) => {
	if (arrayOfDocuments) {
		const filteredItems = arrayOfDocuments.filter((doc) => doc.title);
		const itemsDict = {};
		filteredItems.forEach((item, index) => (itemsDict[index] = item));
		editableListItemsRef.current = itemsDict;
		setListItems(filteredItems);
	}
};

export const elementClickLogic = (e, titleElRef, contentElRef) => {
	//REFACTOR: explain which action refer to sandbox?
	if (!titleElRef.current && !contentElRef.current) {
		e.target.style.background = 'lightcoral';
		titleElRef.current = e.target;
	} else if (titleElRef.current && !contentElRef.current) {
		if (titleElRef.current === e.target) {
			//unclick title
			e.target.style.background = '';
			titleElRef.current = undefined;
		} else {
			//click content
			e.target.style.background = 'bisque';
			contentElRef.current = e.target;
		}
	} else if (titleElRef.current && contentElRef.current) {
		if (contentElRef.current === e.target) {
			e.target.style.background = '';
			contentElRef.current = undefined;
		} else if (titleElRef.current === e.target) {
			// do nothing
		} else {
			contentElRef.current.style.background = '';
			e.target.style.background = 'bisque';
			contentElRef.current = e.target;
		}
	}
};
