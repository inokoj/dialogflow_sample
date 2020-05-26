//
// 時間と人数を聞くレストラン予約受付の Fulfillment
//

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
	const agent = new WebhookClient({ request, response });
	console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
	console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

	function check(agent){
		
		// 現在の発話からパラメータを取得
		var time = request.body.queryResult.parameters["date-time"];
		time.replace('に', '');
		var num_people = request.body.queryResult.parameters["num-people"];

		//　1発話前に時間が指定されていれば取り出す
		if (agent.getContext('time')){
			time = agent.getContext('time').parameters.val;
		}

		//　1発話前に人数が指定されていれば取り出す
		if(agent.getContext('num_people')){
			num_people = agent.getContext('num_people').parameters.val;
		}

		// 時間と人数の両方が揃った場合
		if(XXXXX && XXXXX){
			agent.add(XXXXX);
		}

		// 時間が指定されていない場合
		else if(! XXXXX){
			agent.add(XXXXX);
			
			// 人数の情報があれば保持
			if(XXXXX){
				agent.setContext({ name: 'num_people', lifespan: 1, parameters: { val: num_people}});
			}
		}

		// 人数が指定されていない場合
		else if(! XXXXX){
			agent.add(XXXXX);
			
			// 時間の情報があれば保持
			if(XXXXX){
				agent.setContext({ name: 'time', lifespan: 1, parameters: { val: time}});
			}
		}

		else{
			agent.add('すみません。もう一度、丁寧にお願いします。');
		}
	}

	// Run the proper function handler based on the matched Dialogflow intent name
	let intentMap = new Map();
	intentMap.set('Greeting', check);
	agent.handleRequest(intentMap);
});
