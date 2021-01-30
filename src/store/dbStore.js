
function createNewGame(data) {

  const game = data
  game.gameName = data.gameName
  game.gameState = [],
  game.items = [
    {score: 0, item: 'Shaving Mirror', order: 1, reason: 'Critical for signaling'},
    {score: 0, item: '2 Gallon of Oil/Petrol Mixture', order: 2, reason: 'Critical for signaling. The mixture will float on water and could be ignited with the matches. (What the experts don’t say is how you get away from this conflagration or what to do if the wind should push the life raft into the flames!)'},
    {score: 0, item: '5 Gallon Can of Water', order: 3, reason: 'Necessary to replenish fluids lost through perspiration'},
    {score: 0, item: 'One Case of Army Rations', order: 4, reason: 'Basic food intake'},
    {score: 0, item: '20 sq ft of Opaque Plastic', order: 5, reason: 'Can be utilised to collect rain water and provide shelter from the elements'},
    {score: 0, item: '2 Boxes of Chocolate Bars', order: 6, reason: 'Reserve food supply (what were you going to do with that much chocolate?)'},
    {score: 0, item: 'Fishing Kit', order: 7, reason: 'Ranked lower than the chocolate as "a bird in the hand is worth two in the bush" (I don\'t remember birds being on the list?) There is no guarantee you will catch any fish.'},
    {score: 0, item: '15 Feet of Nylon Rope', order: 8, reason: 'Could be used to lash people or equipment together to prevent it being washed overboard'},
    {score: 0, item: 'Floating Seat Cushion', order: 9, reason: 'A life preserver if someone fell overboard'},
    {score: 0, item: 'Shark Repellent', order: 10, reason: 'Enough said'},
    {score: 0, item: 'One Quart of 160% Proof Rum', order: 11, reason: 'Contains 80% alcohol, which is enough to be used as an antiseptic for any injuries, otherwise of little value – would cause dehydration if ingested'},
    {score: 0, item: 'Small Transistor Radio', order: 12, reason: 'Of no use without a transmitter. You would also be out of range of any radio station'},
    {score: 0, item: 'Maps of The Pacific Ocean', order: 13, reason: 'Worthless without navigation equipment. It does not matter where you are but where the rescuers are!'},
    {score: 0, item: 'Mosquito Netting', order: 14, reason: 'There are NO mosquitos in the midpacific ocean. As for fishing with it? – stick to the fishing kit'},
    {score: 0, item: 'Sextant', order: 15, reason: 'Useless without the relevant tables and a chronometer'}
  ],
  game.maxScore = maxScore(game.items.length)
  game.created = new Date().toISOString()
  game.lastaccess = new Date().toISOString()

  return game
}

function maxScore(n) {
  let score = 0
  for (let i = 1; i <= n; i++) {
    score += parseInt(Math.abs(i - (n - i + 1)))
  }
  return score
}

function itemOrder(items, item) {
  for (let i = 0; i < items.length; i++) {
    if (item.item == items[i].item) {
      return i + 1
    }
  }
}
function calculateScore(gameState, items) {
  for (let i = 0; i < items.length; i++) {
    items[i].score = 0
    for (let j = 0; j < gameState.length; j++) {
      items[i].score = items[i].score + itemOrder(gameState[j].items, items[i])
    }
  }
  return items
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

function _loadGame(db, io, data, debugOn) {

  if (debugOn) { console.log('loadGame', data) }

  db.collection('survival').findOne({gameName: data.gameName}, function(err, res) {
    if (err) throw err
    if (res) {
      db.collection('survival').updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()} }, function(err) {
        if (err) throw err
      })
      if (debugOn) { console.log('Loading game \'' + data.gameName + '\'') }
      io.emit('loadGame', res)
    } else {
      const game = createNewGame(data)
      if (debugOn) { console.log('Creating game \'' + data.gameName + '\'') }
      db.collection('survival').insertOne(game, function(err, rec) {
        if (err) throw err
        io.emit('loadGame', game)
      })
    }
  })
}

module.exports = {

  loadGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadGame', data) }

    _loadGame(db, io, data, debugOn)
  },

  restartGame: function(db, io, data, debugOn) {

    if (debugOn) { console.log('restartGame', data) }

    db.collection('survival').deleteMany({gameName: data.gameName}, function(err, res) {
      _loadGame(db, io, data, debugOn)
    })
  },

  addPlayer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('changeName', data) }

    db.collection('survival').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        let found = false
        for (let i = 0; i < gameState.length; i++) {
          if (gameState[i].name.id == data.player.id) {
            found = true
            gameState[i].name.name = data.player.name
          }
        }
        if (!found) {
          gameState.push({name: data.player, items: shuffle(res.items)})
        }
        data.gameState = gameState
        db.collection('survival').updateOne({'_id': res._id}, {$set: {gameState: gameState}}, function(err, ) {
         if (err) throw err
          io.emit('updateGameState', data)
        })
      }
    })
  },

  updateItems: function(db, io, data, debugOn) {

    if (debugOn) { console.log('selectItem', data) }

    db.collection('survival').findOne({gameName: data.gameName}, function(err, res) {
      if (err) throw err
      if (res) {
        const gameState = res.gameState
        for (let i = 0; i < gameState.length; i++) {
          if (gameState[i].name.id == data.player.id) {
            gameState[i].items = data.items
          }
        }
        const items = calculateScore(gameState, res.items)
        data.gameState = gameState
        data.items = items
        db.collection('survival').updateOne({'_id': res._id}, {$set: {gameState: gameState, items: items}}, function(err, ) {
          if (err) throw err
          io.emit('updateGameState', data)
          io.emit('updateItems', data)
        })
      }
    })
  }

}
