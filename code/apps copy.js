const grid = document.querySelector('.grid')
const healthDisplay = document.querySelector('#health')
const scoreDisplay = document.querySelector('#score')
const highscoreDisplay = document.querySelector('#highscore')
const waveDisplay = document.querySelector('#wave')
// Specifying the width of the grid.
const width = 15

let ship = 217
let aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]

let aliensPrevious = []
let health = 3
let score = 0
let highscore = 0
let reset = 1
let wave = 1
let shootDelay = true
let newName

// localStorage.clear()
// scoreboard
let playerScores = []

const scoresList = document.querySelector('ol')
const newGame = document.querySelector('#newgame')

// IF NO LOCAL STORAGE
if (localStorage !== null) {
  playerScores = JSON.parse(localStorage.getItem('scores'))
  orderAndDisplayScores()
}

newGame.addEventListener('click', () => {
  newName = prompt('By what name are you known?')
})

function addHighscore() {
  const newScore = score
  const player = { name: newName, score: newScore }
  playerScores.push(player)
  // Always do JSON.stringify when putting ARRAYS or
  // OBJECTS into localStorage
  if (localStorage) {
    localStorage.setItem('scores', JSON.stringify(playerScores))
  }
  orderAndDisplayScores()
}

function orderAndDisplayScores() {
  // Take the scores
  const array = playerScores
    // Sort then in descending order
    .sort((playerA, playerB) => playerB.score - playerA.score)
    // Map them into an array of html strings
    .map(player => {
      return `<li>
        ${player.name}: ${player.score} POINTS
      </li>`
    })
  // Turn them back into a string, and overwrite the html of my scoreslist
  scoresList.innerHTML = array.join('')
}

healthDisplay.innerHTML = health 
scoreDisplay.innerHTML = score
highscoreDisplay.innerHTML = highscore
waveDisplay.innerHTML = wave

const startButton = document.querySelector('#start')
const resetButton = document.querySelector('#reset')
// Keep track of my cells
const cells = []


for (let i = 0; i < width ** 2; i++) {
  // Create an element
  const div = document.createElement('div')
  div.classList.add('cell')
  grid.appendChild(div)
  // div.innerHTML = i
  // Push the div to my array of cells
  cells.push(div)
 
}

cells[ship].classList.add('ship')

aliensCurrent.forEach((alien) => {
  cells[alien].classList.add('alien')
})


document.addEventListener('keypress', (event) => {
const key = event.key
  if (key === 'a' && (ship > 210)) {
    cells[ship].classList.remove('ship')
    ship -= 1
    cells[ship].classList.add('ship')
  } else if (key === 's' && (ship < 224)) {
    cells[ship].classList.remove('ship')
    ship +=1
    cells[ship].classList.add('ship')
  } 
  // else if (key === 'n') {
  //   moveLeft()
  // } else if (key === 'm') {
  //   moveRight()
  // } else if (key === 'p') {
  //   moveAliens()
  // } 
  // else if (key === 'l') {
  //   playerShoot()
  // }
  
})

function moveAliens() {
  
  let distanceLeft = width
  let distanceRight = 0
  let movement = 'right'

  for (let i = 0; i < aliensCurrent.length; i++) {
    if (aliensCurrent[i] % width < distanceLeft) {
    
      distanceLeft = aliensCurrent[i] % width
    }
  }
  if (movement === 'left' || movement === 'left down' || distanceLeft === 0) {
    moveLeft()
  } else {
    moveRight()
  }
  function moveLeft() {
    let distanceLeft = width
  
    aliensCurrent.forEach((alien) => {
      cells[alien].classList.remove('alien')
    })
    for (let i = 0; i < aliensCurrent.length; i++) {
      if (aliensCurrent[i] % width < distanceLeft) {
        distanceLeft = aliensCurrent[i] % width
      }
    }
  
    if (distanceLeft > 0) {
      // aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x - 1)
    } else if (distanceLeft === 0 && movement === 'left') {
      // aliensPrevious = aliensCurrent
      // movement = 'left down'
      aliensCurrent = aliensCurrent.map(x => x + width)
      return movement = 'left down'
    } else {
      moveRight()
      return movement = 'right'
      
    }
    aliensCurrent.forEach((alien) => {
      cells[alien].classList.add('alien')
    })
  
  }
  function moveRight () {
    let distanceRight = 0
  
    aliensCurrent.forEach((alien) => {
      cells[alien].classList.remove('alien')
    })
    for (let i = 0; i < aliensCurrent.length; i++) {
    
      if (aliensCurrent[i] % width > distanceRight) {
        distanceRight = aliensCurrent[i] % width
      }
    }
  
    if (distanceRight < width - 1) {
      // aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x + 1)
    } else if (distanceRight === width - 1 && movement === 'right') {
      // aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x + width)
      return movement = 'right down'
      
    } else {
      moveLeft()
      return movement = 'left'
      
    }
    aliensCurrent.forEach((alien) => {
      cells[alien].classList.add('alien')
    })
  }
}

startButton.addEventListener('click', () => {
  startButton.disabled = true
  reset = 1
  console.log(wave)
  let intervalMultiplier = ((10 - ((wave - 1) * 2)) / 10)
  console.log(intervalMultiplier)
  gameStart(intervalMultiplier)
  playerShoot(intervalMultiplier)
  reset = 1
})

resetButton.addEventListener('click', () => {
  
  for (let i = 0; i < width ** 2; i++) {
    cells[i].classList.remove('alien', 'bullet', 'bomb')
  }
  
  aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]
  aliensPrevious = []
  aliensCurrent.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
  startButton.disabled = false
  health = 3
  healthDisplay.innerHTML = health
  score = 0
  scoreDisplay.innerHTML = score
  reset = 0
  wave = 1
  waveDisplay.innerHTML = wave
})

function alienBomb(intervalMultiplier) {

  let exposedAliens = []
  let intervalLength = (500 * intervalMultiplier)

  for (let i = 0; i < aliensCurrent.length; i++){
    if (!(aliensCurrent.includes(aliensCurrent[i] + width) || aliensCurrent.includes(aliensCurrent[i] + (width * 2)))) {
      exposedAliens.push(aliensCurrent[i])
    } 
  }
  
  let randomIndex = (exposedAliens[Math.floor(Math.random() * exposedAliens.length)]) + width
  cells[randomIndex].classList.add('bomb')

  const generateBombInterval = setInterval(() => {
  
    if (cells[randomIndex].classList.contains('bomb') && aliensCurrent.length !== 0 && reset !== 0) {
     
      if (cells[randomIndex].classList.contains('bullet')) {
        clearInterval(generateBombInterval)
        cells[randomIndex].classList.remove('bullet')

      } else {
        cells[randomIndex].classList.remove('bomb')
        randomIndex += width
        cells[randomIndex].classList.add('bomb')
        
        if (randomIndex >= (width * (width - 1))) {
          cells[randomIndex].classList.remove('bomb')
          clearInterval(generateBombInterval)
        }
        if (cells[randomIndex].classList.contains('ship')) {
          health = health - 1
          healthDisplay.innerHTML = health 
        }
        if (cells[randomIndex].classList.contains('bullet')) {
          cells[randomIndex].classList.remove('bomb')
          clearInterval(generateBombInterval)
          cells[randomIndex].classList.remove('bullet')
        }
        if (health < 1) {
          clearInterval(generateBombInterval)
        }
      }
    }
    else {
      clearInterval(generateBombInterval)
    }
  }, intervalLength)
}

function gameStart(intervalMultiplier) {

  const moveInterval = (500 * intervalMultiplier)
  console.log(moveInterval)
  const dropInterval = (2000 * intervalMultiplier)

  const letsGo = setInterval(() => {
    if (reset === 0) {
      clearInterval(letsGo)
    }
    else {
      moveAliens()
      // IF ALIENS REACH BOTTOM OF GRID
      if (aliensCurrent[aliensCurrent.length - 1] >= (width * (width - 1))) {
        window.alert(`YOU SUCK! \n`  + `Final score = ${score}`)
        addHighscore()
        clearInterval(letsGo)
        clearInterval(dropBombs)
        // clearInterval(shootInterval)
      }
      // IF RUN OUT OF LIVES
      if (health < 1) {
        clearInterval(letsGo)
        clearInterval(dropBombs)
        // clearInterval(shootInterval)
        window.alert(`YOU SUUUUUUCK \n` + `Final score = ${score}`)
      }
      //IF ALL ALIENS ARE DEAD
      if (aliensCurrent.length === 0) {
        clearInterval(letsGo)
        clearInterval(dropBombs)
        // clearInterval(shootInterval)
        window.alert(`YOU WIN\n` + `Final score = ${score}`)
        wave = wave + 1
        nextWave()
        return wave
        // wave = wav
      }
      if (reset === 0) {
        clearInterval(letsGo)
        clearInterval(dropBombs)
      }
    }
  }, moveInterval)

  const dropBombs = setInterval (() => {
    
    if (reset === 0) {
      clearInterval(dropBombs)
    }
    else alienBomb(intervalMultiplier)
  }, dropInterval)

}

function playerShoot(intervalMultiplier) {
  const intervalLength = (500 * intervalMultiplier)

  document.addEventListener('keypress', (event) => {
    const key = event.key
    if (key === 'l' && shootDelay) {
      
      shootDelay = false
      setTimeout(() => {
        shootDelay = true
      }, 200)

      let bulletIndex = ship - width
      cells[bulletIndex].classList.add('bullet')
      
      const shootInterval = setInterval(() => {
        
        if (cells[bulletIndex].classList.contains('bullet')) {

          if (cells[bulletIndex].classList.contains('bomb')) {
            clearInterval(shootInterval)
            cells[bulletIndex].classList.remove('bullet')
          } else {
            cells[bulletIndex].classList.remove('bullet')
            bulletIndex = bulletIndex - width
            cells[bulletIndex].classList.add('bullet')
          }
          if (bulletIndex < width) {
            clearInterval(shootInterval)
            cells[bulletIndex].classList.remove('bullet')
          }
          if (cells[bulletIndex].classList.contains('alien')) {
            clearInterval(shootInterval)
            cells[bulletIndex].classList.remove('bullet', 'alien')
            const alienIndex = aliensCurrent.indexOf(bulletIndex)
            const alienRemoved = aliensCurrent.splice(alienIndex, 1)
            score = score + 100
            scoreDisplay.innerHTML = score
          }
          if (cells[bulletIndex].classList.contains('bomb')) {
            cells[bulletIndex].classList.remove('bullet')
            clearInterval(shootInterval)
            cells[bulletIndex].classList.remove('bomb')
          }
        } 
        else {
          clearInterval(shootInterval)
        }
        
      }, intervalLength)
    }
  })
}

function nextWave() {
  for (let i = 0; i < width ** 2; i++) {
    cells[i].classList.remove('alien', 'bullet', 'bomb')
  }
  
  aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]
  aliensPrevious = []
  aliensCurrent.forEach((alien) => {
    cells[alien].classList.add('alien')
  })

  startButton.disabled = false
 
  health = 3
  healthDisplay.innerHTML = health
  // score = score
  reset = 0
  waveDisplay.innerHTML = wave
}