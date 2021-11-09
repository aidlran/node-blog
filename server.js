import Express from 'express';

import routes from "./routes/index.js";

const root = new URL('.', import.meta.url).pathname;

export default (srv => {
	srv.disable('x-powered-by');
	srv.set('view engine', 'ejs');
	srv.set('views', root + 'views');
	srv.use(Express.static(root + "public"));
	srv.use(routes);
	return srv;
})(Express());
