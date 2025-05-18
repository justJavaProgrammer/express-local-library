const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");
const Author = require("../models/author");


exports.genre_list = asyncHandler(async (req, res, next) => {
    const genres = await Genre.find().sort({family_name: 1}).exec();

    res.render("genre_list", {
        title: "Список жанрів",
        genre_list: genres,
    });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
    const [genre, booksInGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Book.find({genre: req.params.id}, "title summary").exec(),
    ]);
    if (genre === null) {
        const err = new Error("Жанр не знайдено");
        err.status = 404;
        return next(err);
    }

    res.render("genre_detail", {
        title: "Деталі жанру",
        genre: genre,
        genre_books: booksInGenre,
    });
});

exports.genre_create_get = (req, res, next) => {
    res.render("genre_form", {title: "Створити жанр"});
};

exports.genre_create_post = [
    body("name")
        .trim()
        .isLength({min: 3})
        .escape()
        .withMessage("Ім'я жанра повинно бути вказано."),

    asyncHandler(async (req, res, next) => {
        // Витягнення помилок валідації з запиту.
        const errors = validationResult(req);

        // Створення об'єкта автора з екранованими та обрізаними даними
        const genre = new Genre({
            name: req.body.name,
        });

        if (errors.isEmpty()) {
            const foundGenre = await Genre.findOne({name: genre.name})
                .collation({ locale: "en", strength: 2 })
                .exec()

            if (foundGenre) {
                res.redirect(foundGenre.url);
                return;
            }
            console.log(genre)

            await genre.save();
            res.redirect(genre.url);
            return;
        }

        res.render("genre_form", {
            title: "Створити жанр",
            genre: genre,
            errors: errors.array(),
        });
    }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre delete GET");
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre delete POST");
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update GET");
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Genre update POST");
});
