import {Router} from 'express';
import {existsSync, readFile, stat} from 'fs';

export default (router => {

	const articlesFolder = new URL('../views/article', import.meta.url).pathname;

	router.get("/:year/:month/:title", (req, res, next) => {
		const articlePath = `${req.params.year}/${req.params.month}/${req.params.title}`;
		if (req.params.year.match(/^202[0-2]$/) && req.params.month.match(/^[0-1]\d$/) && existsSync(`${articlesFolder}/${articlePath}.html`)) {
			const metaPath = `${articlesFolder}/${articlePath}.json`;
			const metaData = {
				articlePath: articlePath + ".html"
			};
			const render = () => res.render('article', metaData);
			readFile(metaPath, (err, data) => {
				if (err) render();
				else {
					data = JSON.parse(data);
					Object.assign(metaData, {
						title: data.title ?? req.params.title.replace(/\b\w/g, char => char.toUpperCase()),
						author: data.author ?? "Admin"
					});
					stat(metaPath, (err, stats) => {
						if (err) render();
						else {
							Object.assign(metaData, {
								published: data.published ?? dateToString(stats.birthtime),
								updated: data.updated ?? dateToString(stats.mtime)
							});
							render();
						}
					});
				}
			});
		}
		else next();
	});

	// router.use((req, res) =>
	// 	res.render('404')); // TODO

	return router;

})(Router());

/**
 * @param {Date} date
 * @returns {string}
 */
function dateToString(date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours() + 1}-${date.getMinutes() + 1}`;
}
