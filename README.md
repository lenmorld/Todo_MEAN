# TODO APP using MEAN

## now LIVE at http://52.44.44.181:3000/#/todos
## thanks to AWS credits for the hosting =)

- [x] MEAN stack working
- [x] get all items
- [x] post an item 
- [x] modify state of an item
- [ ] modify an item
- [x] users, posting by different authors
- [x] auth, login/out, register

ANGULAR
$http.put format, data must be JSON object like {login: "login", password: "password"}
if its a variable, must convert to JSON like this using angular.toJson
$http.put('/todos/' + item.id, angular.toJson(item))

more complete example of PUT
http://tutlane.com/tutorial/angularjs/angularjs-http-put-method-http-put-with-parameters-example


MONGOOSE
find, findOne, findById
http://mongoosejs.com/docs/api.html#model_Model.find


NODE.JS
router redirect after PUT using 303 (vs POST using default 302)
http://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put


crypto - pbkdf2() for hashing
JWT - for generating tokens
Passport - provides auth using password, Github, FB, etc


EXPRESS guide on redirection
https://expressjs.com/en/4x/api.html#res.redirect

EXPRESS guides on routes
https://expressjs.com/en/guide/routing.html


ngRoute + Express4
struggled for 4 days to make it work, bec of the 404 error
it seemed that Angular ngRoute's $routeProvider can't find the views folder which is clearly there
and/or ngRoute and Express was stepping on each other's foot in taking the URL
fix was to let Express serve 'views' folder and $routeProvider finally ended up seeing it 
still not 100% confident about the fix though but at least basic security concerns
are hanled by the otherwise route in Angular

http://stackoverflow.com/questions/25663598/how-to-redirect-to-another-page-in-routeprovider-in-resolve-condition
http://stackoverflow.com/questions/18256106/cancel-route-and-redirect-to-other-route-without-displaying-the-original-content


- Added auth factory and NavCtrl and AuthCtrl
auth token attached to HTTP headers - for now only Adding Post

- added alert for changing status(check) only when not logged in
