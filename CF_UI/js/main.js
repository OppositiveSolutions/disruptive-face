var DEFAULT_HASH = 'home';

//setup crossroads
crossroads.addRoute('home{?query}',function(query){
	console.log('lorem '+ query.asadas);
});

crossroads.addRoute('lorem');
crossroads.addRoute('lorem/ipsum');
crossroads.routed.add(console.log, console);
//log all routes

//setup hasher

//only required if you want to set a default value
if (! hasher.getHash()) {
	console.info(hasher.getHash());
	//hasher.setHash(DEFAULT_HASH);
}

function parseHash(newHash, oldHash) {
	// second parameter of crossroads.parse() is the "defaultArguments" and should be an array
	// so we ignore the "oldHash" argument to avoid issues.
	crossroads.parse(newHash);
}

hasher.initialized.add(parseHash);
//parse initial hash
hasher.changed.add(parseHash);
//parse hash changes

hasher.init();
//start listening for hash changes