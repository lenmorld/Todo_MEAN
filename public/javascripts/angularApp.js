angular.module('todoApp', [])
	.controller('MainCtrl',  ['$http', function($http) {
		var self= this;

		self.appTitle = "TODO APP";

		// HARD-CODED DATA
		// self.max = 3;
		// self.items = [
		// 	{"id": 1, "title": "learn AngularJS", "priority": 1, "done": true},
		// 	{"id": 2, "title": "learn Node", "priority": 1, "done": false},
		// 	{"id": 3, "title": "integrate Mongo", "priority": 2, "done": false}
		// ];

		self.items = [];

		$http.get('/todos')
			.then(
				function(response) {
					self.items = response.data;
					self.max = self.items.length;
					console.log("sucess");
				},
				function(error) {
					console.error('Error while fetching notes');
				} 
			);

		//
		self.fetchAll = function() {

			$http.get('/todos')
				.then(
					function(response) {
						self.items = response.data;
						self.max = self.items.length;
						console.log("sucess");
					},
					function(error) {
						console.error('Error while fetching notes');
					} 
				);

		};

		// self.remaining = function() {
		// 	var todoCount = 0;
		// 	angular.forEach(self.items, function(todoObject) {
		// 		if (todoObject.done) todoCount++;
		// 	});
		// 	return todoCount;
		// };


		// HARD-CODED

		// self.addNew = function() {
		// 	self.items.push({
		// 		"id": self.max+1,
		// 		"title": self.newItem,
		// 		"priority": 1,
		// 		"done": false
		// 	});

		// 	self.max++;
		// 	self.newItem = '';
		// };



		// call fetchAll here

		self.addNew = function() {

			var newItemObj = {
				"id": self.max+1,
				"title": self.newItem,
				"priority": 1,
				"done": false
			};

			console.log(newItemObj);
			

			$http.post('/todos', newItemObj)	// push to server
				.then(function(data, status) {
					console.log(data);

					// self.items.push(newItemObj);		// also put in-mem on success

					// must reload UI by fetching all todo items again
					self.fetchAll();
				}) 

			self.newItem = '';
		};
	}]);