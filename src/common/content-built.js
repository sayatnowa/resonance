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

var app = $(document.createElement('div')).attr({
    id: 'app',
}).text('Hello, world.')
.appendTo(document.body);

/***************************************************************************/
/* The following will get generated from :
/*          resonance.html
/*          resonance.css
/* Just run the build.sh script.
/***************************************************************************/
var content = "\
<style>\#app {\
    border:0px;\
    margin:0px;\
    clear:both;\
}\
div#app {\
	border: 3px solid;\
	width: calc(100% - 6px);\
	height : 20%;\
	position : fixed;\
	bottom : 0px;\
	z-index:100000000;\
	background-color:white;\
	opacity:0.8;\
	filter:alpha(opacity=50); /* IE */\
	-moz-opacity:0.5; /* Mozilla */\
	-khtml-opacity: 0.5; /* Safari */\
}\
div#friendlist,div#chat,div#toppages{\
	width:33%;\
	float:left;\
}\
div#friendlist{}\
div#chat{}\
div#toppages{}\
li {\
    border-bottom : 1px groove ;\
    margin : 3px;\
}\
button {\
    float : right;\
}\
#new {\
    background-color: #FFFFFF;\
    border: 1px solid;\
    width: calc(98% - 2px);\
}\
\
</style>\
<div id='resonance' ng-app='todoApp' ng-controller='MainController'>\
    <div id='friendlist' ng-controller='FriendController'>\
            <ul ng-repeat='friend in list'>\
                {{friend}}\
            </ul>\
            <form ng-submit='addNew()'>\
                <input id='new' type='text' ng-model='friend' />\
                </form>\
    </div>\
    <div id='chat'>\
        <div id='history'>\
                <ul ng-repeat='msg in resonance'>\
                    {{pseudo}} : {{msg}}\
                </ul>\
            <br>\
        </div>\
        <div id='submit'>\
            <form ng-submit='addNew()'>\
                <input id='new' type='text' ng-model='message' />\
            </form>\
        </div>\
    </div>\
    <div id='toppages'>\
        Some good pages\
    </div>\
</div>\
\
";

document.getElementById("app").innerHTML = content ;
