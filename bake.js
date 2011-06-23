var stalker = require('stalker');
var spawn = require('child_process').spawn;
var sys = require('sys');
var fs = require('fs');

var exec = function(command, params) {
	var subprocess = spawn(command, params);
	
	subprocess.stdout.on('data', function(data) {
		sys.print(data.asciiSlice(0, data.length));
	});
	
	subprocess.stderr.on('data', function(data) {
		sys.print(data.asciiSlice(0, data.length));
	});
};


var baker = function(input_path, output_path) {
	stalker.watch(input_path, function(err, file_path) {
		if(err) {
			console.log('Error: ' + err);
			
			return;
		}
		
		var extension = file_path.split('.').pop();
		
		if(extension !== 'less')
			return;
			
		var compile = function() {
			var new_file_path = file_path.replace(input_path, output_path).replace(/^.*\\/, '').replace(/\.[^\.]*$/, '.css');
			console.log('less - compiled ' + new_file_path);
			exec('lessc', [file_path, new_file_path]);
		};
		
		compile();
		
		fs.watchFile(file_path, function(curr, prev) {
			compile();
		});
	});
};

baker(__dirname + '/source/theme.less', __dirname + '/build/theme.css');