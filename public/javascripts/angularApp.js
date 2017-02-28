angular.module('todoApp', ['ngRoute'])
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {




		$locationProvider.hashPrefix('');

		$routeProvider.when('/', {
		// templateUrl: '/views/home.ejs'
		templateUrl: 'home.ejs',
		controller: 'IndexCtrl'
		})
		.when('/todos', {
		// templateUrl: '/views/todos.ejs'
		templateUrl: 'todos.ejs',
		controller: 'MainCtrl',
		controllerAs: 'mainCtrl'
		})
		.when('/second', {
		// templateUrl: '/views/second.ejs'
		templateUrl: 'second.ejs',
		controller: 'SecondCtrl'

		})
		.otherwise({redirectTo: '/'});
	}])

	.controller('IndexCtrl', function() {
		console.log("ngRoute: Index");
	})

	.controller('SecondCtrl', function() {
		console.log("ngRoute: Second");
	})	

	.controller('MainCtrl',  ['$http', function($http) {
		console.log("ngRoute: TODO");
		var self= this;
		self.appTitle = "TODO APP";

		// HARD-CODED DATA for earlier dev stages
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

		self.remaining = function() {
			var doneCount = 0;
			angular.forEach(self.items, function(todoObject) {
				if (todoObject.done) doneCount++;
			});
			return doneCount;
		};

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

		self.todoChange = function(item) {
			console.log(item);
			// call code to modify this item in DB

			// data passed must be an JSON Object
			// $http.put('/todos/' + item.id, { done: item.done })
			$http.put('/todos/' + item.id, angular.toJson(item))
			   .then(
			       function(response){
			         // success callback
					if (response.data)
						self.msg = "Put Data Method Executed Successfully!";
			       }, 
			       function(response){
			         // failure callback
			         	self.msg = "error";
			       }
			    );
		};
	}]);