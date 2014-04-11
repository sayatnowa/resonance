var SIZE = '100px';

var app = $(document.createElement('div')).attr({
    id: 'resonance_container',
}).css({
    position: 'fixed',
    bottom: '0px',
    height: SIZE,
    width: '100%',
    background: 'white',
    'z-index': '9999999999999999999999999999999999999999999999' //tofix
})
.appendTo(document.body);

$('body').css('margin-bottom',SIZE)

/***************************************************************************/
/* The following will get generated from :
/*          resonance.html
/*          resonance.css
/* Just run the build.sh script.
/***************************************************************************/
var content = "\
<style>\
resonance {\
    height: 100% ;\
    width: 100% ;\
}\
resonance * {\
    border : 0px;\
    padding : 0px;\
    margin : 0px;\
}\
\
messages > ul {background: blue}\
controls {background: red}\
users {background: green}\
\
.flex\
   {\
      /* flexbox setup */\
      display: -webkit-flex;\
      display: flex;\
   }\
.row\
    {\
        -webkit-flex-direction: row;\
        flex-direction: row;\
    }\
.column\
    {\
    -webkit-flex-flow: column;\
            flex-flow: column;\
            flex-direction: column;\
    }\
#resonance_left {\
    -webkit-flex: 1 6 80%;\
    flex: 1 6 80%;\
    -webkit-order: 1;\
    order: 1;\
}\
#resonance_left > * {\
    height: 100% ;\
}\
#resonance_right {\
    -webkit-flex: 1 6 20%;\
    flex: 1 6 20%;\
    -webkit-order: 2;\
    order: 2;\
}\
controls{\
    -webkit-flex: 1 6 20%;\
    flex: 1 6 20%;\
    -webkit-order: 1;\
    order: 1;\
}\
users{\
    -webkit-flex: 1 6 80%;\
    flex: 1 6 80%;\
    -webkit-order: 2;\
    order: 2;\
}\
messages > ul {\
    -webkit-flex: 1 6 80%;\
    flex: 1 6 80%;\
    -webkit-order: 1;\
    order: 1;\
}\
messages > form {\
    -webkit-flex: 1 6 20%;\
    flex: 1 6 20%;\
    -webkit-order: 2;\
    order: 2;\
}\
input {\
    width: 100% ;\
    height: 100% ;\
}\
</style>\
<resonance ng-app='resonance' ng-controller='ResonanceController' class='flex row'>\
    <div id='resonance_left'>\
        <messages ng-controller='MessagesController' ng-show='display==1' class='flex column'>\
            <ul class='list'>\
                <li ng-repeat='message in messages track by $index'>\
                      {{message}}\
                </li>\
            </ul>\
            <form ng-submit='submitNewMessage()'>\
                <input type='text' ng-model='newMessage'/>\
            </form>\
        </messages>\
        <settings ng-show='display==2'>\
            settings\
       </settings>\
\
    </div>\
    <div id='resonance_right' class='flex column'>\
        <controls>\
            <button ng-click='display=(display==2)?1:2'>settings</button>\
        </controls>\
        <users ng-controller='UsersController'>\
            <ul class='list'>\
                <li ng-repeat='user in users track by $index'>\
                      {{user}}\
                </li>\
            </ul>\
        </users>\
    </div>\
</resonance>\
\
  \
";

document.getElementById("resonance_container").innerHTML = content ;