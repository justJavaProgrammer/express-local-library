const BookInstance = require("../models/bookinstance");
const Book = require("../models/book")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
    const allBooks = await BookInstance.find({})
        .sort({title: 1})
        .populate("book")
        .exec();

    res.render("book_instances_list", {title: "Список книг", book_list: allBooks});
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: BookInstance detail: ${req.params.id}`);
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
    const allBooks = await Book.find().exec()

    res.render("bookinstance_form", {
            title: "Створити екземпляр книги",
            book_list: allBooks,
        }
    );
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    // Валідація та санітазація полів
    body("book", "Книга обов'язкова")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body("imprint", "Видавництво обов'язкове")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    body("status").optional({ checkFalsy: true }).escape(),

    body("due_back", "Недійсна дата")
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate(),

    // Обробка запиту після валідації
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if (!errors.isEmpty()) {
            // Отримуємо всі книги для селектора
            const allBooks = await Book.find().exec();

            res.render("bookinstance_form", {
                title: "Створити екземпляр книги",
                books: allBooks,
                bookinstance: bookInstance,
                errors: errors.array(),
            });
            return;
        }

        await bookInstance.save();
        res.redirect(bookInstance.url);
    }),
];
// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update GET");
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: BookInstance update POST");
});
