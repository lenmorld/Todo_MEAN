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
		.when('/login', {
			templateUrl: 'login.ejs',
			controller: 'AuthCtrl',

			/* ui-router
			  onEnter: ['$state', 'auth', function($state, auth){
			    if(auth.isLoggedIn()){
			      $state.go('home');
			    }
			  }]
			*/

			resolve: {
					// might have to add $location or $window to deps in cannot reference from auth
				  onEnter: ['auth', '$location', function(auth, $location){
				    if(auth.isLoggedIn()){
				      // $state.go('home');
				      $location.path( "/" );
				    }
				  }]	
			}
		})


		.when('/register', {
			templateUrl: 'register.ejs',
			controller: 'AuthCtrl',

			// onEnter function
			/* ui-router
			  onEnter: ['$state', 'auth', function($state, auth){
			    if(auth.isLoggedIn()){
			      $state.go('home');
			    }
			  }]
			*/

			resolve: {
				  onEnter: ['auth', '$location', function(auth, $location){
				    if(auth.isLoggedIn()){
				      // $state.go('home');
				      $location.path( "/" );
				    }
				  }]	
			}
		})
		.otherwise({redirectTo: '/'});
	}])

	.factory('auth', ['$http', '$window', function($http, $window) {
		// $window needed for localStorage

		var auth = {};

		auth.saveToken = function (token){
		  console.log("save token", token);
		  $window.localStorage['todo-token'] = token;
		};

		auth.getToken = function (){
		  console.log("get token", $window.localStorage['todo-token']);
		  return $window.localStorage['todo-token'];
		};

		auth.isLoggedIn = function(){
		  var token = auth.getToken();

		  // if token exists check payload if expired, otherwise assume user logged out
		  if(token){
		    var payload = JSON.parse($window.atob(token.split('.')[1]));

		    return payload.exp > Date.now() / 1000;
		  } else {
		    return false;
		  }
		};

		// use /register and /login routes created before

		auth.register = function(user){
		  return $http.post('/register', user).success(function(data){
		    auth.saveToken(data.token);
		  });
		};

		auth.logIn = function(user){

		  console.log("auth logIN: ", user);	
		  return $http.post('/login', user).success(function(data){
		    auth.saveToken(data.token);
		  });
		};

		return auth;
	}])

	// auth Controller
	.controller('AuthCtrl', [
	'$scope',
	'$location',
	'auth',
	function($scope, $location, auth){
	  $scope.user = {};			// init user

	  // scope functions that calls auth factory
	  $scope.register = function(){
	    auth.register($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      // $state.go('home');

	      // equiv in ngRouter
	      $location.path( "/" );
	    });
	  };

	  $scope.logIn = function(){
	    auth.logIn($scope.user).error(function(error){
	      $scope.error = error;
	    }).then(function(){
	      // $state.go('home');
	      $location.path( "/" );

	    });
	  };
	}])

	.controller('NavCtrl', [
		'$scope',
		'auth',
		function($scope, auth){
		  $scope.isLoggedIn = auth.isLoggedIn;
		  $scope.currentUser = auth.currentUser;
		  $scope.logOut = auth.logOut;
		}]
	)

	.controller('IndexCtrl', function() {
		console.log("ngRoute: Index");
	})

	.controller('SecondCtrl', function() {
		console.log("ngRoute: Second");
	})	

	.controller('MainCtrl',  ['$http', 'auth', function($http, auth) {
		console.log("ngRoute: TODO");
		var self= this;
		self.appTitle = "TODO APP";

		self.isLoggedIn = auth.isLoggedIn;			// expose isLoggedIn to scope

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
			
			$http.post('/todos', newItemObj, 
					{ headers: {Authorization: 'Bearer '+ auth.getToken()} }			// auth
				)	// push to server
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
			$http.put('/todos/' + item.id, angular.toJson(item), 
				{ headers: {Authorization: 'Bearer '+ auth.getToken()} }				// auth
				)
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