const grid = document.querySelector('.grid')
const healthDisplay = document.querySelector('#health')
const scoreDisplay = document.querySelector('#score')
// const highscoreDisplay = document.querySelector('#highscore')
const waveDisplay = document.querySelector('#wave')
const gameScreen = document.querySelector('.gameScreen')
const gameOverScreen = document.querySelector('.gameOver')
const startScreen = document.querySelector('.startScreen')
const finalScore = document.querySelector('#finalScore')
const playerName = document.querySelector('#playerName')
const nextWaveBox = document.querySelector('.nextWave')
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
let shootDelay
let newName

localStorage.clear()
// scoreboard
let playerScores = []
const shootAudio = new Audio('sounds/shoot.wav')
const explosionAudio = new Audio('sounds/explosion.wav')
const invaderKilledAudio = new Audio('sounds/invaderkilled.wav')
const gamePlayAudio = new Audio('sounds/spaceinvaders1.mpeg')

const scoresList = document.querySelector('ol')
const finalScoreList = document.querySelector('.highscoreBoard')
const newGame = document.querySelector('#newgame')

//HIDE SCREENS
gameScreen.style.display = 'none'
gameOverScreen.style.display = 'none'


// IF NO LOCAL STORAGE
if (localStorage.getItem('scores') !== null) {
  playerScores = JSON.parse(localStorage.getItem('scores'))
  orderAndDisplayScores()
}

newGame.addEventListener('click', () => {
  // newName = prompt('By what name are you known?')
  newName = playerName.value
  console.log(newName)
  gameScreen.style.display = 'flex'
  startScreen.style.display = 'none'
})

function addHighscore() {

  const newScore = score
  const player = { name: newName, score: newScore }
  const orderedArray = playerScores.sort((playerA, playerB) => playerB.score - playerA.score)
  if (localStorage.getItem('scores') !== null && playerScores.length === 3) {
    const oldHighScore = playerScores[2].score
    if (newScore > oldHighScore) {
      orderedArray.pop()
      orderedArray.push(player)
      playerScores = orderedArray
    }
  } else {
  playerScores.push(player)
  }
  // Always do JSON.stringify when putting ARRAYS or
  // OBJECTS into localStorage
  if (localStorage) {
    localStorage.setItem('scores', JSON.stringify(playerScores))
  
  orderAndDisplayScores()
}
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
  finalScoreList.innerHTML = array.join('')
}

healthDisplay.innerHTML = health 
scoreDisplay.innerHTML = score
// highscoreDisplay.innerHTML = highscore
waveDisplay.innerHTML = wave

// const startButton = document.querySelector('#start')
// const resetButton = document.querySelector('#reset')
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
  if ((key === 'a' || key === 'A') && (ship > ((width ** 2) - width))) {
    cells[ship].classList.remove('ship')
    ship -= 1
    cells[ship].classList.add('ship')
  } else if ((key === 's' || key === 'S') && (ship < ((width ** 2) - 1))) {
    cells[ship].classList.remove('ship')
    ship +=1
    cells[ship].classList.add('ship')
  } 
})

function moveAliens() {
  
  let distanceLeft = width
  let distanceRight = 0

  for (let i = 0; i < aliensCurrent.length; i++) {
    if (aliensCurrent[i] % width < distanceLeft) {
    
      distanceLeft = aliensCurrent[i] % width
    }
  }
  if (aliensCurrent[0] < aliensPrevious[0] || distanceLeft === 0) {
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
      aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x - 1)
    } else if (distanceLeft === 0 && aliensCurrent[0] < aliensPrevious[0]) {
      aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x + width)
    } else {
      moveRight()
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
      aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x + 1)
    } else if (distanceRight === width - 1 && aliensCurrent[0] - 1 === aliensPrevious[0]) {
      aliensPrevious = aliensCurrent
      aliensCurrent = aliensCurrent.map(x => x + width)
    } else moveLeft()
  
    aliensCurrent.forEach((alien) => {
      cells[alien].classList.add('alien')
    })
  }
}

newGame.addEventListener('click', () => {
  startGame()
  
})

function startGame() {
  // startButton.disabled = true
  reset = 1
  let intervalMultiplier = ((10 - ((wave - 1) * 2)) / 10)
  console.log(intervalMultiplier)
  
  gameStart(intervalMultiplier)
  playerShoot(intervalMultiplier)
  reset = 1
}
// resetButton.addEventListener('click', () => {
//   resetGame()
// })

function resetGame() {
  for (let i = 0; i < width ** 2; i++) {
    cells[i].classList.remove('alien', 'bullet', 'bomb')
  }
  
  aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]
  aliensPrevious = []
  aliensCurrent.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
  // startButton.disabled = false
  health = 3
  healthDisplay.innerHTML = health
  score = 0
  scoreDisplay.innerHTML = score
  reset = 0
  wave = 1
  waveDisplay.innerHTML = wave
}

function alienBomb(intervalMultiplier) {

  let exposedAliens = []
  let intervalLength = (100 * intervalMultiplier)

  for (let i = 0; i < aliensCurrent.length; i++){
    if (!(aliensCurrent.includes(aliensCurrent[i] + width) || aliensCurrent.includes(aliensCurrent[i] + (width * 2)))) {
      exposedAliens.push(aliensCurrent[i])
    } 
  }
  
  let randomIndex = (exposedAliens[Math.floor(Math.random() * exposedAliens.length)]) + width
  cells[randomIndex].classList.add('bomb')

  const generateBombInterval = setInterval(() => {
    // if (aliensCurrent[aliensCurrent.length - 1] >= (width * (width - 1))) {
    //   clearInterval(generateBombInterval)
    // }
    if (cells[randomIndex].classList.contains('bomb') && aliensCurrent.length !== 0 && reset !== 0 && aliensCurrent[aliensCurrent.length - 1] < (width * (width - 1))) {
     
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
  
  gamePlayAudio.play()

  
  const moveInterval = (400 * intervalMultiplier)
  console.log(moveInterval)
  const dropInterval = (1600 * intervalMultiplier)

  const letsGo = setInterval(() => {
    if (reset === 0) {
      clearInterval(letsGo)
    }
    else {
      moveAliens()
      // IF ALIENS REACH BOTTOM OF GRID
      if (aliensCurrent[aliensCurrent.length - 1] >= (width * (width - 1))) {
        addHighscore()
        clearInterval(letsGo)
        clearInterval(dropBombs)
        // clearInterval(generateBombInterval)
        gameOver()
        // window.alert(`YOU SUCK! \n`  + `Final score = ${score}`)
        
        // clearInterval(shootInterval)
      }
      // IF RUN OUT OF LIVES
      if (health < 1) {
        clearInterval(letsGo)
        clearInterval(dropBombs)
        addHighscore()
        explosionAudio.play()
        setTimeout(() => {
          gameOver()
        }, 2000)
        
        // clearInterval(shootInterval)
        // window.alert(`YOU SUUUUUUCK \n` + `Final score = ${score}`)
      }
      //IF ALL ALIENS ARE DEAD
      if (aliensCurrent.length === 0) {
        clearInterval(letsGo)
        clearInterval(dropBombs)
        addHighscore()
        // clearInterval(shootInterval)
        // window.alert(`YOU WIN\n` + `Final score = ${score}`)
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
  const intervalLength = (100 * intervalMultiplier)

  document.addEventListener('keypress', (event) => {
    const key = event.key
    if ((key === 'l'  || key === 'L') && shootDelay !== false) {
      shootAudio.play()
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
            invaderKilledAudio.play()
            cells[bulletIndex].classList.remove('bullet', 'alien')
            cells[bulletIndex].classList.add('explosion')
            setTimeout(() => {
              cells[bulletIndex].classList.remove('explosion')
            }, 100)
            const alienIndex = aliensCurrent.indexOf(bulletIndex)
            aliensCurrent.splice(alienIndex, 1)
            aliensPrevious.splice(alienIndex, 1)
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
      
      setTimeout(() => {
        return shootDelay = true
      }, 500)
      return shootDelay = false
    }
  })
}

function nextWave() {
  
  for (let i = 0; i < width ** 2; i++) {
    cells[i].classList.remove('alien', 'bullet', 'bomb')
  }
  grid.style.display = 'none'
  nextWaveBox.style.display = 'flex'
  let i = 3
  
  const countdownTimer = setInterval(() => {
    if (i > 0) {
      console.log(i)
      document.querySelector('#timer').innerHTML = i
      i--
    } else clearInterval(countdownTimer)
  }, 1000)
  document.querySelector('#timer').innerHTML = ''
  setTimeout(() => {
    // startButton.disabled = false
    nextWaveBox.style.display = 'none'
    grid.style.display = 'flex'
    aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]
    aliensPrevious = []
    
    aliensCurrent.forEach((alien) => {
      cells[alien].classList.add('alien')
      
    })
    startGame()
  }, 4000)
  // startButton.disabled = false
 
  health = 3
  healthDisplay.innerHTML = health
  // score = score
  reset = 0
  waveDisplay.innerHTML = wave

}

function gameOver() {
  console.log(score)
  // orderAndDisplayScores()
  gameScreen.style.display = 'none'
  gameOverScreen.style.display = 'flex'
  finalScore.innerHTML = `${score}`
  resetGame()
  setTimeout(() => {
    gameOverScreen.style.display = 'none'
    startScreen.style.display = 'flex'
  }, 10000)
}

function countdown() {
  let i = 3
  const countdownTimer = setInterval(() => {
    if (i > 0) {
      document.querySelector.innerHTML = i
      i--
    } else clearInterval(countdownTimer)
  }, 1000)
}