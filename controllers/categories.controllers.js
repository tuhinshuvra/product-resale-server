const categoryies = [
    { id: 1, name: "Ashit Kumar" },
    { id: 2, name: "Bellal Shah" },
    { id: 3, name: "Chinmay Rana" },
    { id: 4, name: "Depok Ghorami" },
    { id: 5, name: "Emran Hossain" },
];

module.exports.getAllCategories = (req, res, next) => {
    const { limit, page } = req.query;
    console.log(limit, page);
    res.json(categoryies.slice(0, limit));
}

module.exports.getCategoriesDetails = (req, res, next) => {
    const { id } = req.params;

    const result = categoryies.find((cat) => cat.id == id)
    res.send(result);
}

module.exports.saveACategory = (req, res) => {
    console.log(req.body);
    categoryies.push(req.body)
    res.send('New category created Successfully!')
}

module.exports.updateACategory = (req, res) => {
    res.send('The category updated')
}

module.exports.deleteACategory = (req, res) => {
    res.send('The category deleted')
}
