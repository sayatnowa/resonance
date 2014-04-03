// ==UserScript==
// @name HelloWorld
// @include http://*
// @include https://*
// @require jquery.js
// @require angular.min.js
// @require app.js
// @require maincontroller.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for Opera and IE

var SIZE = '100px';

var app = $(document.createElement('div')).attr({
    id: 'app',
}).css({
    position: 'fixed',
    bottom: '0px',
    height: SIZE,
    width: '100%',
    background: 'white',
    'z-index': '10000'
}).text('Hello, world.')
.appendTo(document.body);

var content = "\
<style>\
    #app {\
        border:0px;\
        margin:0px;\
    }\
    li {\
        border-bottom : 1px groove ;\
        margin : 3px;\
    }\
    button {\
        float : right;\
    }\
    #new {\
        background-color: #FFFFFF;\
        border: 5px solid;\
        width: 100%;\
    }\
</style>\
	<div id='content' ng-app='todoApp' ng-controller='MainController'>\
    	<div id='chat' style='width:70%;float:right;'>\
    		<ul>\
        		<li ng-repeat='todo in todos'>\
              		{{todo}}\
            		<button ng-click='del(todo)'>X</button>\
       	 		</li>\
    		</ul>\
    		<br>\
    		<form ng-submit='addNew()'>\
        		<input id='new' type='text' ng-model='newTodo' />\
    		</form>\
		</div>\
    	<div id='loggedin' style='width:20%;float:left;'>\
			friend list\
    		<br>\
			here a friend\
    		<br>\
			and another\
    		<br>\
		</div>\
    	<div id='hot pages' style='width:10%;float:left;'>\
			list of hot pages
		</div>\
 	</div>\
";

document.getElementById("app").innerHTML = content ;
