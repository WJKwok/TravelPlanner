import { gql } from '@apollo/client';

const GET_TRIP = gql`
	query getTrip($tripId: ID!) {
		getTrip(tripId: $tripId) {
			id
			guide {
				id
				categories
			}
			startDate
			dayLists
			categoriesInTrip
			googlePlacesInTrip
			spotsArray {
				id
				guide
				place {
					id
					name
					rating
					location
					hours
					businessStatus
				}
				category
				imgUrl
				content
				date
				eventName
			}
			filteredSpots
			likedSpots
		}
	}
`;

const GET_SPOTS = gql`
	query getSpotsForCategoryInGuide($guideId: ID!, $category: String!) {
		getSpotsForCategoryInGuide(guideId: $guideId, category: $category) {
			id
			guide
			place {
				id
				name
				rating
				location
				businessStatus
				hours
			}
			category
			imgUrl
			content
			eventName
			date
		}
	}
`;

export let retailGetSpotsForCategoryInGuideWasCalled = 0;
export const mocks = [
	{
		request: {
			query: GET_SPOTS,
			variables: {
				guideId: '5ed7aee473e66d73abe88279',
				category: 'Retail',
			},
		},
		result: () => {
			retailGetSpotsForCategoryInGuideWasCalled++;
			return {
				data: {
					getSpotsForCategoryInGuide: [
						{
							__typename: 'Spot',
							id: '5ee1fbf4aa3118be4c682992',
							guide: '5ed7aee473e66d73abe88279',
							place: {
								__typename: 'Place',
								id: 'ChIJFxOhwuNRqEcRZ8DjAJlnyL4',
								name: 'A Kind of Guise Store',
								rating: 4.7,
								location: [52.52759289999999, 13.4042796],
								businessStatus: 'OPERATIONAL',
								hours: [
									'Monday: 12:00 – 7:00 PM',
									'Tuesday: 12:00 – 7:00 PM',
									'Wednesday: 12:00 – 7:00 PM',
									'Thursday: 12:00 – 7:00 PM',
									'Friday: 12:00 – 7:00 PM',
									'Saturday: 12:00 – 6:00 PM',
									'Sunday: Closed',
								],
							},
							category: 'Retail',
							imgUrl:
								'https://i.pinimg.com/originals/40/33/63/40336347d08d5bf83ec1779e48708aea.jpg',
							content:
								'"Our aim is to produce high-quality garments and products," says Yasar Ceviker, co-owner and creative director of 2009-founded Munich-based brand A Kind of Guise.',
							eventName: null,
							date: null,
						},
						{
							__typename: 'Spot',
							id: '5ee1fc71aa3118be4c682993',
							guide: '5ed7aee473e66d73abe88279',
							place: {
								__typename: 'Place',
								id: 'ChIJT8rSqOFRqEcRy4TxoJJHVms',
								name: 'soto store',
								rating: 2.7,
								location: [52.52903619999999, 13.4071098],
								businessStatus: 'CLOSED_TEMPORARILY',
								hours: null,
							},
							category: 'Retail',
							imgUrl:
								'https://www.whatthespots.com/files/stores/_1000x675_crop_center-center_82_line/soto1.png',
							content:
								'This clean, pared-down shop specialises in menswear. Its first location opened in 2010 along Torstrasse (Soto is short for South of Torstrasse) and expanded two years later into a neighbouring space.',
							eventName: null,
							date: null,
						},
						{
							__typename: 'Spot',
							id: '5ee1fd13aa3118be4c682994',
							guide: '5ed7aee473e66d73abe88279',
							place: {
								__typename: 'Place',
								id: 'ChIJczxYH-JRqEcRcYuwsS3XiVM',
								name: 'Herr von Eden',
								rating: 4.8,
								location: [52.5268016, 13.4075217],
								businessStatus: 'OPERATIONAL',
								hours: [
									'Monday: 11:00 AM – 8:00 PM',
									'Tuesday: 11:00 AM – 8:00 PM',
									'Wednesday: 11:00 AM – 8:00 PM',
									'Thursday: 11:00 AM – 8:00 PM',
									'Friday: 11:00 AM – 8:00 PM',
									'Saturday: 11:00 AM – 8:00 PM',
									'Sunday: Closed',
								],
							},
							category: 'Retail',
							imgUrl:
								'https://www.hopit.de/files/2009/09/Screen-shot-2009-09-03-at-00.11.48.png',
							content:
								'Self-taught tailor Bent Angelo Jensen learnt his trade in the secondhand shops of his native Klensburg, a seaside town near the Danish border.',
							eventName: null,
							date: null,
						},
						{
							__typename: 'Spot',
							id: '5ee1fe88aa3118be4c682995',
							guide: '5ed7aee473e66d73abe88279',
							place: {
								__typename: 'Place',
								id: 'ChIJpf-_AkpOqEcRA7if6bcEpZ8',
								name: 'MICHAEL SONTAG SHOP',
								rating: 5,
								location: [52.5021509, 13.4293072],
								businessStatus: 'CLOSED_TEMPORARILY',
								hours: null,
							},
							category: 'Retail',
							imgUrl:
								'https://www.stilinberlin.de/wp/wp-content/uploads/2015/01/stilinberlin-michael-sontag-7717.jpg',
							content:
								'Designer Michael Sontag founded his eponymous label in 2009, straight out of university. Five years later he decided to become his own exclusive retailer and opened his shop.',
							eventName: null,
							date: null,
						},
						{
							__typename: 'Spot',
							id: '5ee20005aa3118be4c682996',
							guide: '5ed7aee473e66d73abe88279',
							place: {
								__typename: 'Place',
								id: 'ChIJuwieQxxOqEcRjDXeqRqYO4U',
								name: 'The Store X Berlin',
								rating: 4.3,
								location: [52.5275752, 13.415801],
								businessStatus: 'OPERATIONAL',
								hours: [
									'Monday: 11:00 AM – 7:00 PM',
									'Tuesday: 11:00 AM – 7:00 PM',
									'Wednesday: 11:00 AM – 7:00 PM',
									'Thursday: 11:00 AM – 7:00 PM',
									'Friday: 11:00 AM – 7:00 PM',
									'Saturday: 11:00 AM – 7:00 PM',
									'Sunday: Closed',
								],
							},
							category: 'Retail',
							imgUrl:
								'https://images.squarespace-cdn.com/content/v1/5734908745bf21dc5c4d0b9b/1464984358582-A6USNGAGUXBES3BO0RG1/ke17ZwdGBToddI8pDm48kG87Sfbgg29A4BYEDq3OXvgUqsxRUqqbr1mOJYKfIPR7UkZTRBG6NkxChUQUS5aT-Lp5QaNWlTZiIJrq5EjDRI9CRW4BPu10St3TBAUQYVKcyZOlQkVGMTxwEhyHcYX83dTVmLpL3WK6u1IaomjxuTHw5Rw-akWXC6WP-Gyt3iet/IMG_9015-2.jpg?format=2500w',
							content:
								'Berlin is remarkably resistant to organised cool. That said, Soho House seems to have won hearts with help from this shop overseen by London-based creative director Alex Eagle',
							eventName: null,
							date: null,
						},
					],
				},
			};
		},
	},
	{
		request: {
			query: GET_TRIP,
			variables: {
				tripId: '5f187e21bef1b67b990678b6',
			},
		},
		result: () => {
			return {
				data: {
					getTrip: {
						__typename: 'Trip',
						id: '5f187e21bef1b67b990678b6',
						guide: {
							__typename: 'Guide',
							id: '5ed7aee473e66d73abe88279',
							categories: ['Retail', 'Restaurant', 'Cafe', 'Museum', 'Event'],
						},
						startDate: '2020-10-27',
						dayLists: [
							['5ee204d9aa3118be4c68299d', 'ChIJ2Uh9Bk5OqEcREoy9N1LxImw'],
							[
								'5f7864e5a1fea03c638ead0b',
								'5ee20257aa3118be4c682999',
								'5ee20639aa3118be4c6829a0',
							],
							['5ee20121aa3118be4c682998'],
						],
						categoriesInTrip: ['Restaurant', 'Museum', 'Event'],
						googlePlacesInTrip: ['ChIJ2Uh9Bk5OqEcREoy9N1LxImw'],
						spotsArray: [
							{
								__typename: 'Spot',
								id: '5ee200a0aa3118be4c682997',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJQ2g8mO9RqEcRpOSC8NXG7io',
									name: 'Katz Orange',
									rating: 4.4,
									location: [52.5314438, 13.3946245],
									hours: [
										'Monday: 5:00 – 11:00 PM',
										'Tuesday: 5:00 – 11:00 PM',
										'Wednesday: 5:00 – 11:00 PM',
										'Thursday: 5:00 – 11:00 PM',
										'Friday: 5:00 – 11:00 PM',
										'Saturday: 5:00 – 11:00 PM',
										'Sunday: 5:00 – 11:00 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Restaurant',
								imgUrl:
									'https://www.top10berlin.de/sites/top10berlin.de/files/styles/juicebox/public/location/slider/2015/07/28/katz_orange_5_r_laura_maria_trumpp_0.jpg?itok=D40FyF1t',
								content:
									'Ludwig Cramer-Klett, a former investment banker from Munich, says the idea for Katz Organe occurred to him while he was in the Amazon with a shaman.',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee20121aa3118be4c682998',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJNdtTjdNRqEcR-n4Xa0Y92G4',
									name: 'Nobelhart & Schmutzig',
									rating: 3.7,
									location: [52.5053369, 13.3904178],
									hours: [
										'Monday: Closed',
										'Tuesday: 6:30 – 10:30 PM',
										'Wednesday: 6:30 – 10:30 PM',
										'Thursday: 6:30 – 10:30 PM',
										'Friday: 6:30 – 10:30 PM',
										'Saturday: 6:30 – 10:30 PM',
										'Sunday: Closed',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Restaurant',
								imgUrl:
									'https://s3-media0.fl.yelpcdn.com/bphoto/-cCsze0Swx3H6ZTW2824Rw/l.jpg',
								content:
									"Berlin chefs have been making a point of celebrating Germany's produce for some years now but nobody has gone as far as Micha Schäfer and Billy Wagner.",
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee20257aa3118be4c682999',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJB_FI3vxRqEcRheAWfledrdA',
									name: 'Standard Serious Pizza',
									rating: 4.3,
									location: [52.53286399999999, 13.4086254],
									hours: [
										'Monday: Closed',
										'Tuesday: 6:00 – 11:30 PM',
										'Wednesday: 6:00 – 11:30 PM',
										'Thursday: 6:00 – 11:30 PM',
										'Friday: 6:00 – 11:30 PM',
										'Saturday: 1:00 – 10:00 PM',
										'Sunday: 1:00 – 10:00 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Restaurant',
								imgUrl:
									'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQwbv_gNtDTYC4woHAWN6C0sdsGTudj-PsaxhHn6iTSOfLsu81t&usqp=CAU',
								content:
									"Standard's minimalist, dark metal-and-wood interior is so carefully designed that you may wonder how serious they are about their pizza. The answer? Very.",
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee202eaaa3118be4c68299a',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJA_naUfxQqEcRJNqdN8hN03c',
									name: 'Paris Bar',
									rating: 3.8,
									location: [52.5053953, 13.3264177],
									hours: null,
									businessStatus: 'OPERATIONAL',
								},
								category: 'Restaurant',
								imgUrl: 'https://www.artberlin.de/files/2012/11/Paris-Bar.jpg',
								content:
									'Damien Hirst and Martin Kippenberger, the legend goes, have both swapped paintings for bouillabaisse here. As with most stories surrounding Paris Bar, it is near-impossible to confirm.',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee20356aa3118be4c68299b',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJ234buONQqEcRRc0eNl1IuYQ',
									name: "Lon Men's Noodle House",
									rating: 4.6,
									location: [52.5063107, 13.316489],
									hours: [
										'Monday: 12:00 – 10:00 PM',
										'Tuesday: Closed',
										'Wednesday: 12:00 – 10:00 PM',
										'Thursday: 12:00 – 10:00 PM',
										'Friday: 12:00 – 10:00 PM',
										'Saturday: 12:00 – 10:00 PM',
										'Sunday: 12:00 – 10:00 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Restaurant',
								imgUrl:
									'https://sattundfroh.de/wp-content/uploads/2017/02/lon-mens-7.jpg',
								content:
									"You wouldn't spend a whole night at this rudimentary Taiwanese spot on Kanstrasse (Berlin's Chinatown) but you can't beat it for quick and hearty meals.",
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee2040daa3118be4c68299c',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJn5FmBuhRqEcRoIq0vXKK2wE',
									name: 'Academy of Arts',
									rating: 4.4,
									location: [52.5154912, 13.3791771],
									hours: null,
									businessStatus: 'OPERATIONAL',
								},
								category: 'Museum',
								imgUrl:
									'https://www.marioff.com/sites/default/files/adk_clubraum_jpg.jpg',
								content:
									'Founded in 1696, the Akademie is one of the oldest cultural institution in Europe. Today it spans two locations (rebuilt on either side of the Berlin Wall, they joined forces after its fall) and is a place for discourse on new emerging trends in everything from architecture, visual art and music, to literature and film.',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee204d9aa3118be4c68299d',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJjxlyGeZRqEcRJMlJ2yFsPVA',
									name: 'KW Institute for Contemporary Art',
									rating: 4.1,
									location: [52.5267583, 13.3949251],
									hours: [
										'Monday: 11:00 AM – 7:00 PM',
										'Tuesday: Closed',
										'Wednesday: 11:00 AM – 7:00 PM',
										'Thursday: 11:00 AM – 9:00 PM',
										'Friday: 11:00 AM – 7:00 PM',
										'Saturday: 11:00 AM – 7:00 PM',
										'Sunday: 11:00 AM – 7:00 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Museum',
								imgUrl:
									'https://universes.art/fileadmin/_processed_/4/0/csm_02_kw_8ec86c9975.jpg',
								content:
									'After the fall of the Berlin Wall this former margarine factory sat derelict on Auguststrasse, one of the main drags in residential Berlin-Mitte.',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee20547aa3118be4c68299e',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJS6_t9aZHqEcRGCiRSnvpm94',
									name: 'East Side Gallery',
									rating: 4.6,
									location: [52.50502239999999, 13.4396952],
									hours: [
										'Monday: Open 24 hours',
										'Tuesday: Open 24 hours',
										'Wednesday: Open 24 hours',
										'Thursday: Open 24 hours',
										'Friday: Open 24 hours',
										'Saturday: Open 24 hours',
										'Sunday: Open 24 hours',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Museum',
								imgUrl:
									'https://www.roadaffair.com/wp-content/uploads/2017/09/east-side-gallery-berlin-germany-shutterstock_221627185.jpg',
								content:
									'The longest remaining part of the Berlin Wall stretches more than 1.3km along the Spree. In 1990, shortly after reunification, some 118 artists from 21 countries brought life to its eastern-facing section.',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee205acaa3118be4c68299f',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJY3sO_sFRqEcRjAP9teULhJA',
									name: 'Boros Foundation',
									rating: 4.4,
									location: [52.52346110000001, 13.384125],
									hours: [
										'Monday: Closed',
										'Tuesday: Closed',
										'Wednesday: Closed',
										'Thursday: Closed',
										'Friday: 3:00 – 6:30 PM',
										'Saturday: 10:00 AM – 6:30 PM',
										'Sunday: 10:00 AM – 6:30 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Museum',
								imgUrl:
									'https://www.sammlung-boros.de/fileadmin/templates/img/fbog.jpg',
								content:
									'In 2003 Christian Boros purchased a gargantuan war bunker built during the Third Reich; in the past it had served as a tropical-fruit storage facility and a techno club.',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5ee20639aa3118be4c6829a0',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJS4MKBSBOqEcRMVSPqUYFOJ0',
									name: 'Pergamonmuseum',
									rating: 4.5,
									location: [52.521183, 13.3969],
									hours: [
										'Monday: 10:00 AM – 6:00 PM',
										'Tuesday: 10:00 AM – 6:00 PM',
										'Wednesday: 10:00 AM – 6:00 PM',
										'Thursday: 10:00 AM – 8:00 PM',
										'Friday: 10:00 AM – 6:00 PM',
										'Saturday: 10:00 AM – 6:00 PM',
										'Sunday: 10:00 AM – 6:00 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Museum',
								imgUrl:
									'https://media2.trover.com/T/53404c25d6bdd411bd000612/fixedw_large_4x.jpg',
								content:
									'The world-famous Pergamon was rebuilt as a three-wing complex in 1930 to house the extensive and breathtaking collections of Greek, Roman and Islamic archaeological treasures',
								date: null,
								eventName: null,
							},
							{
								__typename: 'Spot',
								id: '5f7864e5a1fea03c638ead0b',
								guide: '5ed7aee473e66d73abe88279',
								place: {
									__typename: 'Place',
									id: 'ChIJn17Gi0NOqEcRfHX8oRvU9ms',
									name: 'Berghain | Panorama Bar',
									rating: 3.9,
									location: [52.5110756, 13.4429256],
									hours: [],
									businessStatus: null,
								},
								category: 'Event',
								imgUrl: 'https://i.imgur.com/9bdloso.jpg',
								content:
									'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec libero arcu, hendrerit ut malesuada a, commodo nec elit. Mauris sed ullamcorper sapien, ut scelerisque dolor. Integer laoreet, lacus at semper gravida, turpis libero mollis ligula, a pellentesque libero ipsum in lacus. Sed nulla lectus, vulputate sit amet tellus sed, commodo lobortis felis. Ut id lacus dictum, sollicitudin erat id, iaculis odio. Phasellus sem quam, rhoncus in tristique eget, varius ut enim. Vivamus volutpat enim sit amet cursus interdum. ',
								date: '2020-10-28',
								eventName: 'Techno Party',
							},
							{
								__typename: 'Spot',
								id: 'ChIJ2Uh9Bk5OqEcREoy9N1LxImw',
								guide: 'Searched',
								place: {
									__typename: 'Place',
									id: 'ChIJ2Uh9Bk5OqEcREoy9N1LxImw',
									name: 'Burgermeister Schlesisches Tor',
									rating: 4.7,
									location: [52.5010953, 13.4424637],
									hours: [
										'Monday: 12:00 – 8:00 PM',
										'Tuesday: 12:00 – 8:00 PM',
										'Wednesday: 12:00 – 8:00 PM',
										'Thursday: 12:00 – 8:00 PM',
										'Friday: 12:00 – 8:00 PM',
										'Saturday: 12:00 – 8:00 PM',
										'Sunday: 12:00 – 8:00 PM',
									],
									businessStatus: 'OPERATIONAL',
								},
								category: 'Searched',
								imgUrl: 'https://i.imgur.com/zbBglmB.jpg',
								content: 'hello',
								date: null,
								eventName: null,
							},
						],
						filteredSpots: [
							'5ee200a0aa3118be4c682997',
							'5ee202eaaa3118be4c68299a',
							'5ee20356aa3118be4c68299b',
							'5ee2040daa3118be4c68299c',
							'5ee20547aa3118be4c68299e',
							'5ee205acaa3118be4c68299f',
						],
						likedSpots: [
							'5ee20121aa3118be4c682998',
							'5ee202eaaa3118be4c68299a',
							'5ee2040daa3118be4c68299c',
						],
					},
				},
			};
		},
	},
];
