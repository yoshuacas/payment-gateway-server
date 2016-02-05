module.exports = function(Callback) {


	Callback.observe('before save', function filterProperties(ctx, next) {
		console.log("BEFORE SAVE");
		console.log (ctx.instance);
		
	  next();
	});


};
