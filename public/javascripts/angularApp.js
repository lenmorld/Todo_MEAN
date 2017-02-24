angular.module('todoApp', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/', {
			// HERE WE LOAD THE TODO LIST

			// templateUrl : '/views/home.ejs',
			template: '<div>HOME {{ mainCtrl.message }}</div>',
			controller : 'MainCtrl',
			controllerAs: 'mainCtrl'
		})

		.when('/about', {
            // templateUrl : '/views/about.html',
            template: '<div>ABOUT {{ aboutController.message }}</div>',
            controller  : 'aboutController'
		})


		.when('/contact', {
            // templateUrl : '/views/contact.html',
            template: '<div>CONTACT {{ contactController.message }}</div>',
            controller  : 'contactController'
		})

		.otherwise({
            redirectTo: '/'
        });

		//TODO: add /login and /register here
	}]) 


	.controller('aboutController', function() {
			var self= this;
	        self.message = 'Look! I am an about page.';
	    })

	.controller('contactController', function() {
			var self= this;
	        self.message = 'Contact us! JK. This is just a demo.';
	    }) 


	.controller('MainCtrl',  ['$http', function($http) {
		var self= this;

		self.message = "MAIN CTRL";
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
	}])
	// $window for localStorage
	.factory('auth', ['$http', '$window', function($http, $window) {

		var auth = {};

		auth.saveToken = function() {
			$window.localStorage['todo-list'] = token;
		};

		auth.getToken = function() {
			return $window.localStorage['todo-list'];
		};

		auth.isLoggedIn = function() {
			var token = auth.getToken();

			if(token) {
				// if token exists, check payload if token has expired
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now() / 1000;
			}
			else {	// otherwise, we asusme user logged out
				return false;
			}
		};

		auth.currentUser = function(){
		  if(auth.isLoggedIn()){
		    var token = auth.getToken();
		    var payload = JSON.parse($window.atob(token.split('.')[1]));

		    return payload.username;
		  }
		};

		auth.register = function(user){
		  return $http.post('/register', user).success(function(data){
		    auth.saveToken(data.token);
		  });
		};

		auth.logIn = function(user){
		  return $http.post('/login', user).success(function(data){
		    auth.saveToken(data.token);
		  });
		};

		auth.logOut = function(){
		  $window.localStorage.removeItem('flapper-news-token');
		};

		return auth;
	}])

	.controller('AuthCtrl', [
		'$scope',
		'$state',
		'auth',

		function($scope, $state, auth){
		  $scope.user = {};				// init user for form

		  // $scope.register and $scope.logIn calls auth register and login

		  $scope.register = function(){
			    auth.register($scope.user).error(function(error){
			      	$scope.error = error;
			    }).then(function(){
			      	// $state.go('home');				// TODO: change this to equiv 
			    });
		  };

		  $scope.logIn = function(){
			    auth.logIn($scope.user).error(function(error){
			      	$scope.error = error;
			    }).then(function(){
			      	// $state.go('home');				// TODO: change this to equiv 
			    });
		  };
		}])


	;