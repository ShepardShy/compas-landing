export function getNearCoords(fromPoint, toCoords, n) {
	const sortedByLengthCoords = [...toCoords[0]].sort((a, b) => {
		const lengthA = window.ymaps.coordSystem.geo.getDistance(fromPoint, a);
		const lengthB = window.ymaps.coordSystem.geo.getDistance(fromPoint, b);
		return lengthA - lengthB;
	});

	return sortedByLengthCoords.slice(0, n);
}

export async function getMinLengthRoute(fromPoint, toCoords) {
	const nearCoords = getNearCoords(fromPoint, toCoords, 24);

	let minRoute = await window.ymaps.route([nearCoords[0], fromPoint]);
	let minLength = minRoute.getLength();

	const promises = nearCoords.map(el => window.ymaps.route([el, fromPoint]));
	const routes = await Promise.all(promises);

	routes.forEach(route => {
		const routeLength = route.getLength();
		if (routeLength < minLength) {
			minLength = routeLength;
			minRoute = route;
		}
	});
	return minRoute;
}
