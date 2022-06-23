const Listicle = require('../../models/Listicle');

module.exports = {
	Mutation: {
		async submitListicle(_, { url, titleSelector, contentSelector }) {
			try {
				let listicle = await Listicle.findOne({ url });
				if (listicle) {
					listicle.url = url;
					listicle.titleSelector = titleSelector;
					listicle.contentSelector = contentSelector;

					await listicle.save();

					return listicle;
				} else {
					const newListicle = new Listicle({
						url,
						titleSelector,
						contentSelector,
						createdAt: new Date().toISOString(),
					});

					await newListicle.save();
					return newListicle;
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
