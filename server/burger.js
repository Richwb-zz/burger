function renderIndex(res, info){
	console.log("test" + JSON.stringify(info));
	
	res.render('index', { title: 'Express', burgers: info});
}

module.exports.renderIndex = renderIndex;