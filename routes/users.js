// users.js
// Routes to CRUD users.

var User = require('../models/user');

/**
 * GET ALL /users
 */
exports.list = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.render('user-list', {
            users: users
        });
    });
};

/**
 * Load Form Add
 */
exports.add = function (req, res, next) {
    User.getAll(function (err, users) {
        if (err) return next(err);
        res.render('users', {
            users: users
        });
    });
};

/**
 * POST /users
 */
exports.create = function (req, res, next) {
    User.create({
        name: req.body['name'],
        place: req.body['place'],
        date: req.body['date']
    }, function (err, user) {
        if (err) return next(err);
        res.redirect('/users/' + user.id);
    });
};

/**
 * GET /users/:id
 */
exports.show = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
        user.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('user', {
                user: user,
                following: following,
                others: others
            });
        });
    });
};

/**
 * POST /users/:id
 */
exports.edit = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.name = req.body['name'];
        user.save(function (err) {
            if (err) return next(err);
            res.redirect('/users/' + user.id);
        });
    });
};

/**
 * DELETE /users/:id
 */
exports.del = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        user.del(function (err) {
            if (err) return next(err);
            res.redirect('/users/list');
        });
    });
};

/**
 * POST /users/:id/follow
 */
exports.follow = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        User.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};

/**
 * POST /users/:id/unfollow
 */
exports.unfollow = function (req, res, next) {
    User.get(req.params.id, function (err, user) {
        if (err) return next(err);
        User.get(req.body.user.id, function (err, other) {
            if (err) return next(err);
            user.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/users/' + user.id);
            });
        });
    });
};


/**
 * Load Form Search
 */
exports.loadFormSearch = function (req, res, next) {
        res.render('search',{
        	users : ''
        });
};


/**
 * GET Friend of Friend
 */
exports.search = function (req, res, next) {
	var data = [];
	var string_message = "Data Pertemanan yang anda cari tidak ada";
	User.getFoF({
	        name: req.body['name'],
	        friend: req.body['friend']
	}, function (err, users) {
    		//res.json(users[0]._node);	
    		//res.json(users);	
    	//res.json(users.length);
    	if(users.length >= 1) {data = users} else {data.message = string_message};
        if (err) return next(err);
        res.render('search', {
           users: data
        });
    });
};