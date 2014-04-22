
widgets = require("sdk/widget")
URL = require('sdk/url').URL
tabs = require('sdk/tabs')
data = require("sdk/self").data 
storage = require("sdk/simple-storage").storage 

sha1 = require('./sha1.js').sha1
irc = require('./_irc.js') 

# Histories
storage.messagesHistory ?= {}
storage.privateMessagesHistory ?= {}

# Set the 'old' flag for the messages in histories
# Todo : no need to set it all at once, we could do it when served.
for chan,list of storage.messagesHistory
  for m in list
    m.old = 'true'
for user,list of storage.privateMessagesHistory
  for m in list
    m.old = 'true'

pmUsers = ['Resonance-bot']
currentPmUser = 'Resonance-bot'
mutedUsers = storage.mutedUsers ? []

# IRC client init
currentNick = storage.nick ? 'Resonance-dev' 
client = new irc.Client('chat.freenode.net', currentNick, {
      debug: true,
})

# Error handling
client.addListener 'error', (message) ->
  emitToAllWorkers('error', message.command+message.args.join(' '))
  console.error('ERROR:', message.command, message.args.join(' '))
# Catch the connection event
client.addListener 'registered', (message) ->
  client.connected = true

# When the client receives a message.
client.addListener 'message', (from, to, message) ->
  # If it is not a private message.
  if to != currentNick
    # It goes to the corresponding chan / worker.
    workers[to].emit('message',from,to,message)
    # Save in history.
    storage.messagesHistory[to] ?= []
    storage.messagesHistory[to].push( {'author':from, 'message': message } )

# When the client receives a private message, it goes to every worker, thus to every tab.
client.addListener 'pm', (from,message) ->
  # If it is a announce from the bot.
  if from == 'Resonance-bot' and message.match(/^announce /)
    message = message.replace('announce ','')
    emitToAllWorkers('announce',message)
  # If it is a topPages from the bot.
  else if from == 'Resonance-bot' and message.match(/^topPages /)
    message = message.replace('topPages ','')
    emitToAllWorkers('topPages', message)
  # If it is a regular pm.
  else
    if not( from in pmUsers)
        pmUsers.push(from)
        emitToAllWorkers('pmUsers', pmUsers)
    # Save in history.
    storage.privateMessagesHistory[from] ?= []
    storage.privateMessagesHistory[from].push( {'author':from, 'message':message} )
    if from == currentPmUser
      emitToAllWorkers('privateMessage', from, currentNick, message)
     
# The part event is also triggered when the client leaves a channel, thus creating an error because the worker does no longer exist.
client.addListener 'part', (chan,nick) ->
    if nick isnt currentNick
      workers[chan].emit('part',chan,nick)

# Used to simply pass events from the client to the app.
# tofix : should be properly implemented using arguments.
# WARNING : it won't work if the chan isn't the first argument of the event !
passEvent = (eventName) ->
  client.addListener eventName, (chan,a,b,c,d,e,f,g,h,i) ->
    # workers[chan] may have been deleted if the client has left the chan
    # todo : How to remove listeners once the chan has been left ?
    workers[chan].emit(eventName,chan,a,b,c,d,e,f,g,h,i) if workers[chan]?

passEvent('names')
passEvent('join')

emitToAllWorkers = (eventName, a,b,c,d,e,f,g,h,i) ->
  for own chan, worker of workers
        worker.emit(eventName, a,b,c,d,e,f,g,h,i)

# Need to find a better way for both of theses var...
workers = {}
class Channel
  constructor: (chan,worker) ->    
    @chan = chan
    @linkedWorkers = [worker]
  addWorker: (worker) ->    
    @linkedWorkers.push(worker)
  removeWorker: (worker) ->
    @linkedWorkers = (w for w in @linkedWorkers when w isnt worker)
  # todo : use arguments, bitch !
  emit: (eventName, a,b,c,d,e,f,g,h,i) ->
    for w in @linkedWorkers
      w.port.emit(eventName,a,b,c,d,e,f,g,h,i)
  hasWorkers: () ->
    @linkedWorkers.length > 0
  numWorkers: () ->
    @linkedWorkers.length


# Listen to events from the browser
tabs.on 'ready', (tab) ->
  # If a page was displayed.
  if tab.chan?
    previousChan = tab.chan
    # Get the binded worker.
    # todo : le worker attaché est il le même pour un même tab ?!
    previousWorker = tab.worker
    # Remove it from the list of workers linked to the chan.
    workers[previousChan].removeWorker(previousWorker)
    # Leave the previous chan if there are no more workers binded to it.
    if not workers[previousChan].hasWorkers()
      client.part(previousChan)
      delete workers[previousChan]
  
  # Generate the chan name for the page.
  chan = '#'+sha1(tab.url+tab.title).toString() 
  # Save it.
  tab.chan = chan
  # Join the new chan.
  client.join(chan)
  # Request a list of users.
  client.send('NAMES',chan) 

  # Tell the admin-bot about it.
  client.say('Resonance-bot','enter '+tab.url+' '+chan)
  
  # Inject the application code into the page.
  worker = tab.attach({
      contentScriptFile:[
          data.url("lib/jquery.js"),
          data.url("lib/angular.min.js"),
          data.url("content-built.js"),
          data.url("controllers/app.js"),
          data.url("controllers/ResonanceController.js"),
          data.url("controllers/IrcController.js"),
          data.url("controllers/MessagesController.js"),
          data.url("controllers/UsersController.js"),
          data.url("controllers/TopPagesController.js"),
          data.url("controllers/SettingsController.js"),
          data.url("controllers/PrivateMessagesController.js"),
          data.url("controllers/PrivateUsersController.js"),
          # USED FOR TESTS ONLY
          data.url("tests.js"),
      ]})
  # Save the linked worker.
  tab.worker = worker

  # Save which worker is in charge for wich channel.
  # todo : clean the list when leaving chan
  # tofix : 2 onglets avec la même page ?
  if workers[chan]?
    workers[chan].addWorker(worker)
  else workers[chan] = new Channel(chan, worker)  

  # Send the application some init values.
  worker.port.emit('appSize',storage.appSize ? '100')
  worker.port.emit('chan',chan)
  worker.port.emit('requestMutedUsers',mutedUsers)
  worker.port.emit('nick',currentNick)
  worker.port.emit('messagesHistory', storage.messagesHistory[chan] ? [])
  worker.port.emit('pmUsers',pmUsers)
  storage.privateMessagesHistory[currentPmUser] ?= []
  worker.port.emit('pmUser',currentPmUser, storage.privateMessagesHistory[currentPmUser])
  # todo : 
  # client.send('name',chan)
  

  # Listen for the application telling the client to say something.
  worker.port.on 'say', (to, message) ->
      client.say(to,message)
      # Tell back the application that the message has been said.
      workers[to].emit('message',currentNick,to,message)
      # Save in history.
      storage.messagesHistory[to] ?= []
      storage.messagesHistory[to].push( {'author':currentNick, 'message': message } )

  worker.port.on 'privateMessage', (user, message) ->
    client.say(user,message)
    # Save in history.
    storage.privateMessagesHistory[user] ?= []
    storage.privateMessagesHistory[user].push( {'author':currentNick, 'message':message} )
    emitToAllWorkers('privateMessage', currentNick, user, message)

  # Listen for the application asking for the top pages.
  worker.port.on 'getTopPages', () ->
    # Ask the bot for top tapes.
    client.say('Resonance-bot','ask')

  worker.port.on 'startPmUser', (user) ->
    currentPmUser = user
    if not( user in pmUsers)
      pmUsers.push(user)
      emitToAllWorkers('pmUsers', pmUsers)
    # Save in history.
    storage.privateMessagesHistory[user] ?= []
    emitToAllWorkers('pmUser', currentPmUser, storage.privateMessagesHistory[user])

  worker.port.on "newNick", (nick) ->
    #todo : sanitize !
    storage.nick = nick 
    currentNick = nick 
    #todo : nickserv alerts
    worker.port.emit('message','Resonance',currentNick,'Your new nick will be saved and available as soon as you restart firefox.')
  
  # stock the current muted Users
  worker.port.on "updateMutedUsers", (mutedUsers) ->
    storage.mutedUsers = mutedUsers
  
  worker.port.on "newAppSize", (height) ->
    #todo : sanitize !
    storage.appSize = height

  # USED FOR TESTS ONLY
  worker.port.on 'test', (response) ->
    testPortReplies[response] = true


tabs.on 'close', (tab) ->    
  # Unlink the worker 
  workers[tab.chan].removeWorker(tab.worker)  
  # Check for the remaining workers linked to the same chan.
  if not workers[tab.chan].hasWorkers()    
    # Part from the chan.
    client.part(tab.chan)
    # Deletes the chan entry.
    delete workers[tab.chan]


# Tests
setTimeout = require('sdk/timers').setTimeout
class Tests
  constructor: () ->
    @tests = []
    @rootTests = []
  # test is an object with the following properties :
  # name
  # executeAfter
  # delay
  # check()
  add: (test) ->
    test.followers = []
    @tests.push(test)
    if not (test.previous in (t.name for t in @tests))
      @rootTests.push(test)
    else
      prevTest = (t for t in @tests when t.name == test.previous)[0]
      @follow(test,prevTest)
  follow: (follower, firstTest) ->
    firstTest.followers.push(follower)
    
  run: () ->
    for test in @rootTests
      @assert(test)

  assert: (test) =>
    # prereq are not really tests, but just some actions which are prerequired for the next test
    result = '\n\t\tFAILED.\n'
    if test.check()
      result = 'Passed.'
    if not (test.prereq?)
      console.log('[[ TESTS ]] '+test.name+' : '+result)
    assert = @assert
    for next in test.followers
      do (next) ->
        setTimeout( (()-> assert(next) ),next.delay)

tests = new Tests()

tests.add(
  'name' : 'Addon started',
  'previous' : '',
  'delay' : 0
  'check' : () -> true
)
tests.add(
  'name' : 'Storage available',
  'previous' : '',
  'delay' : 0
  'check' : () -> storage?
)
tests.add(
  'name' : 'Client connected in less than 20s',
  'previous' : 'Addon started',
  'delay' : 20000
  'check' : () -> client.connected
)

testPortReplies = {}
# This test is added while it is not really a test, just to open the page.
# I just can't find another way to wait to the tab to become active
tests.add(
  'prereq' : true,
  'name' : 'Open sebsauvage.net',
  'previous' : 'Addon started',
  'delay' : 1000
  'check' : () ->
    tabs.open('sebsauvage.net')
    
)
tests.add(
  'prereq' : true,
  'name' : 'sebsauvage.net is open',
  'previous' : 'Open sebsauvage.net',
  'delay' : 20000
  'check' : () ->
    tabs.activeTab.url ==  'http://sebsauvage.net/'
)

testChan = ''

tests.add(
  'name' : 'tab.chan is correctly defined for sebsauvage',
  'previous' : 'sebsauvage.net is open',
  'delay' : 500
  'check' : () ->
    testChan = '#'+sha1(tabs.activeTab.url+tabs.activeTab.title).toString()
    tabs.activeTab.chan ==  testChan
)

tests.add(
  'prereq':true,
  'name' : 'Test port communication with the tab of sebsauvage',
  'previous' : 'sebsauvage.net is open',
  'delay' : 500
  'check' : () ->
    workers[testChan].emit('test','Test port communication')
)
tests.add(
  'name' : 'workers[chan] allow communication with the correct tab for sebsauvage ',
  'previous' : 'Test port communication with the tab of sebsauvage',
  'delay' : 1000
  'check' : () -> 
    testPortReplies['Test port communication : sebsauvage.net']
    
)
tests.add(
  'prereq' : true
  'name' : 'ask app display',
  'previous' : 'sebsauvage.net is open',
  'delay' : 1000
  'check' : () ->
    workers[testChan].emit('test','Test app display')
)
tests.add(
  'name' : 'The app is displayed',
  'previous' : 'ask app display',
  'delay' : 1000
  'check' : () ->
    testPortReplies['Test app display : true']
)
# It can't find a way to run several instances of irc client...
# An external bot (Resonance-test) is used to simulate incoming messages.
# It is controlled by irc via private messages using the commands :
# /msg Resonance-test join #chan
# /msg Resonance-test say #chan message
testBot = 'Resonance-test'

tests.add(
  'name' : 'Connected to the corresponding chan',
  'previous' : 'sebsauvage.net is open',
  'delay' : 1000
  'check' : () ->
    testChan = '#'+sha1(tabs.activeTab.url+tabs.activeTab.title).toString()
    # Tell the test bot to join the same chan
    client.say(testBot,'join '+testChan)
    for chan of client.chans
      if chan is testChan
        return true
    return false
)
date = new Date()
date = date.toString()
tests.add(
  'prereq' : true,
  'name' : 'Send a message in the chan with the testing bot',
  'previous' : 'Connected to the corresponding chan',
  'delay' : 2000
  'check' : () ->
    client.say( testBot, 'say '+testChan+' '+date)
)
tests.add(
  'name' : 'Receive a message and save it in history',
  'previous' : 'Send a message in the chan with the testing bot',
  'delay' : 4000
  'check' : () ->
    okAuthor = (storage.messagesHistory[testChan][storage.messagesHistory[testChan].length-1].author == 'Resonance-test')
    okMessage = (storage.messagesHistory[testChan][storage.messagesHistory[testChan].length-1].message == date)
    ( okAuthor and okMessage )
)



tests.run()