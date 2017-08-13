var http = require("http")
var ws = require("nodejs-websocket")
var fs = require("fs")


http.createServer(function (req, res) {
	//fs.createReadStream("index.html").pipe(res)
}).listen(8083)

var runOption = [-1,0,1,2,3,4,5,6]; 
var comment = ["Good Shot", "Missed to field", "Classic Text Book Shot", "Hat trick", " Classical Sot", "Unbelievable miss"];
var Score = Math.floor(Math.random() * 50);
var Over =  Math.floor(Math.random() * 20);
var Ball = Math.floor((Math.random() * 6)+1);

function UpdateScore(){
	var obj;
	
	if(Over == 20 && Ball == 6){
		//reset everything to 0
		Score = 0;
		Over = 0;
		Ball = 1;
		var obj = {"score":Score, "over":Over, "ball":Ball, "comment":"Game Restarting"};
		console.log(JSON.stringify(obj));
		broadcast(JSON.stringify(obj));
	}else{
		var newRun = runOption[Math.floor(Math.random() * runOption.length)];
		
		if(newRun==-1){
			Ball++;
			if(Ball == 7){
				Ball =1;
				Over++;
			}
			var obj = {"score":Score, "over":Over, "ball":Ball, "comment":"Very good catch by mid-on player"};
			console.log(JSON.stringify(obj));
			broadcast(JSON.stringify(obj));
		}else if(newRun==0){
			Score+=newRun;
			Ball++;
			if(Ball == 7){
				Ball =1;
				Over++;
			}
			var obj = {"score":Score, "over":Over, "ball":Ball, "comment":"No Runs Added"};
			console.log(JSON.stringify(obj));
			broadcast(JSON.stringify(obj));
		}else{
			Score+=newRun;
			Ball++;
			if(Ball == 7){
				Ball =1;
				Over++;
			}
			if(newRun == 4 || newRun == 6){
				var obj = {"score":Score, "over":Over, "ball":Ball, "comment":comment[Math.floor(Math.random() * comment.length)]};
			}
			else{
				var temp = "Added "+newRun+" Runs";
				var obj = {"score":Score, "over":Over, "ball":Ball, "comment":temp};
			}
			console.log(JSON.stringify(obj));
			broadcast(JSON.stringify(obj));
		}
	}
}

var repeatFunc;

var server = ws.createServer(function (connection) {
	console.log("Connection established by a Client");
	connection.on("text", function (str) {
		console.log("Msg from client: "+str);
		if (str === "tunein") {
			//console.log("Setinterval func");
			repeatFunc = setInterval(UpdateScore, 2000);
		}else
			console.log("Msg from client cannot be recognized");
	})
	connection.on("close", function () {
		console.log("Client closed the connection");
		clearInterval(repeatFunc);
		broadcast("closed");
	})
})
server.listen(8081)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str);
	})
}
