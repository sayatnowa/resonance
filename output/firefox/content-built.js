// ==UserScript==
// @name HelloWorld
// @include http://*
// @include https://*
// @require jquery.js
// @require angular.min.js
// @require app.js
// @require maincontroller.js
// @const irc = require('./_irc');
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
#resonance div#toppages{\
	position:fixed;\
	width:20%;\
	height:20%;\
	max-height:20%;\
}\
#resonance div#friendlist{\
	left:10px;\
	max-height:100%;\
}\
#resonance div#chat{\
	position:fixed;\
	width:55%;\
	height:20%;\
	max-height:20%;\
	left:calc(21% + 10px);\
	border: 1px solid;\
	\
}\
#resonance div#friends,\
#resonance div#history{\
	overflow:auto;\
	//transform:rotateX(180deg);\
	//-ms-transform:rotateX(180deg); /* IE 9 */\
	//-webkit-transform:rotateX(180deg); /* Safari and Chrome */\
	max-height:calc(100% - 25px);\
	height:100%;\
    	font-size:11;\
}\
#resonance div#toppages{\
	right:10px;\
	overflow:auto;\
}\
\
\
#resonance div#submit{\
	height:25px;\
	position:fixed;\
	bottom:5px;\
}\
li #resonance{\
	border-bottom : 1px groove ;\
	margin : 3px;\
}\
#new #resonance{\
	background-color: #FFFFFF;\
	border: 1px solid;\
	width: calc(98% - 2px);\
}\
#resonance ul{\
	max-width:100%;\
}\
.Flipped, .Flipped .Content\
{\
}	\
\
</style>\
<div ng-app='todoApp' ng-controller='MainController'>\
    <div id='friendlist' ng-controller='FriendController'>\
    	<div id='friends'>    \
			<ul ng-repeat='friend in list'>\
                {{friend}}\
            </ul>\
		</div>\
    	<div id='submit'><form ng-submit='addNew()'>\
            <input id='new' type='text' ng-model='friend' />\
		</form></div>\
    </div>\
	<div id='chat'>\
        <div id='history'>\
                <ul ng-repeat='msg in resonance'>\
                    {{msg}}\
                </ul>\
            	<br>\
        </div>\
    	<div id='submit'>\
			<table><tr><td>\
       			<input id='pseudo' type='text' value={{pseudo}} ng-model='pseudo' />\
       		</td><td><form ng-submit='addNew()'>\
          			<input id='new' type='text'  ng-model='message' />\
       			</form>\
			</td></tr></table>\
		</div>\
	</div>\
    <div id='toppages' ng-controller='PagesController'>\
        <table><tr>\
		Some good pages\
		</tr><tr>\
		</tr>\
		</table>\
    </div>\
</div>\
\
";

document.getElementById("resonance").innerHTML = content ;
