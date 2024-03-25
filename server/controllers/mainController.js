//GET homepage

exports.homepage = async(req, res) => {
    const locals = {
        title: "Find Your Notes",
        description: "NodeJS Note App"
    };

    res.render('index', {
        locals,
        layout: '../views/layout/front_page'
    });
}

// GET about
exports.about = async(req, res) => {
    const locals = {
        title: "About - Find Your Notes",
        description: "NodeJS Note App"
    };

    res.render('about', locals);
}