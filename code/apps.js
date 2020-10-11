const grid = document.querySelector('.grid')
const healthDisplay = document.querySelector('#health')
const scoreDisplay = document.querySelector('#score')
const highscoreDisplay = document.querySelector('#highscore')
// Specifying the width of the grid.
const width = 15
// If I start harry off as undefined, this could
let ship = 217
let aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]

let aliensPrevious = []
let health = 3
let score = 0
let highscore = 0

healthDisplay.innerHTML = health 
scoreDisplay.innerHTML = score
highscoreDisplay.innerHTML = highscore

const startButton = document.querySelector('#start')
const resetButton = document.querySelector('#reset')
// Keep track of my cells
const cells = []


for (let i = 0; i < width ** 2; i++) {
  // Create an element
  const div = document.createElement('div')
  div.classList.add('cell')
  grid.appendChild(div)
  div.innerHTML = i
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
  } else if (key === 'n') {
    moveLeft()
  } else if (key === 'm') {
    moveRight()
  } else if (key === 'p') {
    moveAliens()
  } 
  // else if (key === 'l') {
  //   playerShoot()
  // }
  
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
    } else moveRight()
      
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

startButton.addEventListener('click', () => {
  startButton.disabled = true
  gameStart()
})

resetButton.addEventListener('click', () => {
  // aliensCurrent.forEach((alien) => {
  //   cells[alien].classList.remove('alien')
  // })
  aliensCurrent = [4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23, 24, 25, 34, 35, 36, 37, 38, 39, 40]
  aliensPrevious = []
  aliensCurrent.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
  startButton.disabled = false
  clearInterval(letsGo)
  clearInterval(generateBombInterval)
  clearInterval(shootInterval)


  health = 3
})

function alienBomb() {
  
  let randomIndex = aliensCurrent[Math.floor(Math.random() * aliensCurrent.length)]
  cells[randomIndex].classList.add('bomb')

  const generateBombInterval = setInterval(() => {
    if (cells[randomIndex].classList.contains('bomb') && aliensCurrent.length !== 0) {
     
      if (cells[randomIndex].classList.contains('bullet')) {
        clearInterval(generateBombInterval)
        console.log('hit')
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
          console.log(health)
        }
        if (cells[randomIndex].classList.contains('bullet')) {
          cells[randomIndex].classList.remove('bomb')
          clearInterval(generateBombInterval)
          console.log('hit')
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
  }, 1000)
}

function gameStart() {
  
  playerShoot()

  const letsGo = setInterval(() => {
    moveAliens()
    // IF ALIENS REACH BOTTOM OF GRID
    if (aliensCurrent[aliensCurrent.length - 1] >= (width * (width - 1))) {
      window.alert(`YOU SUCK!`  + `Final score = ${score}`)
      clearInterval(letsGo)
      clearInterval(dropBombs)
      clearInterval(shootInterval)
    }
    // IF RUN OUT OF LIVES
    if (health < 1) {
      clearInterval(letsGo)
      clearInterval(dropBombs)
      clearInterval(shootInterval)
      window.alert(`YOU SUUUUUUCK \n` + `Final score = ${score}`)
    }
    //IF ALL ALIENS ARE DEAD
    if (aliensCurrent.length === 0) {
      clearInterval(letsGo)
      clearInterval(dropBombs)
      clearInterval(shootInterval)
      window.alert(`YOU WIN\n` + `Final score = ${score}`)
    }
  }, 500)

  const dropBombs = setInterval (() => {
    alienBomb()
  }, 2000)
console.log(health)
}

function playerShoot() {

  document.addEventListener('keypress', (event) => {
    const key = event.key
    if (key === 'l') {
      
   
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
            console.log('bomb')
            cells[bulletIndex].classList.remove('bomb')
          }
        } 
        else {
          clearInterval(shootInterval)
        }
        
      }, 500)
    }
  })
}