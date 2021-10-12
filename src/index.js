const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const passport = require('passport');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;
//config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'mi secreto',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
	new passportLocal((username, password, done) => {
		if (username === 'eric' && password === '1234') {
			return done(null, { id: 1, name: 'eric' });
		}
		done(null, false);
	})
);
//serializacion
passport.serializeUser((user, done) => {
	done(null, user.id);
});
//deserializacion
passport.deserializeUser((id, done) => {
	done(null, { id: 1, name: 'eric' });
});
//rutas
app.get(
	'/',
	(req, res, next) => {
		if (req.isAuthenticated()) return next();
	},
	(req, res) => {
		//si ya se registra
		res.send('hola');
		//si no se registra
	}
);

app.get('/login', (req, res) => {
	// mostrar el login
	res.render('login');
});
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
	})
);

//Servidor
app.listen(port, () => console.log(`Escuchando en: http://localhost:${port}`));
