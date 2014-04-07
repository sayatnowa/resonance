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
    id: 'resonance',
})
.appendTo(document.body);

/***************************************************************************/
/* The following will get generated from :
/*          resonance.html
/*          resonance.css
/* Just run the build.sh script.
/***************************************************************************/
var content = "\
<style>\#resonance {\
    border:0px;\
    margin:0px;\
    clear:both;\
}\
div#resonance {\
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
#resonance div#friendlist,\
#resonance div#chat,\
#resonance div#toppages{\
	position:fixed;\
	width:32%;\
	height:20%;\
	max-height:20%;\
}\
#resonance div#friendlist{\
	left:10px;\
	max-height:100%;\
}\
#resonance div#chat{\
	left:calc(33% + 10px);\
}\
#resonance div#friends,\
#resonance div#history{\
	overflow:auto;\
	max-height:calc(100% - 35px);\
	height:100%;\
}\
#resonance div#toppages{\
	left:calc(66% + 20px);\
	overflow:auto;\
}\
#resonance div#submit{\
	height:30px;\
	position:fixed;\
	bottom:2px;\
}\
li #resonance{\
    border-bottom : 1px groove ;\
    margin : 3px;\
}\
button #resonance{\
    float : right;\
}\
#new #resonance{\
    background-color: #FFFFFF;\
    border: 1px solid;\
    width: calc(98% - 2px);\
}\
#resonance ul{\
	max-width:100%;\
}\
\
</style>\
<div ng-app='todoApp' ng-controller='MainController'>\
    <div id='friendlist' ng-controller='FriendController'>\
        <div id='friends'>    \
	<ul ng-repeat='friend in list'>\
                {{friend}}\
            </ul>\
	</div>\
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

document.getElementById("resonance").innerHTML = content ;
