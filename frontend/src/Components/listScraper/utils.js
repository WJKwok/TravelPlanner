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
