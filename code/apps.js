const grid = document.querySelector('.grid')

// Specifying the width of the grid.
const width = 9
// If I start harry off as undefined, this could
let ship = 75
let aliensCurrent = [2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24]
let aliensPrevious = []
let health = 3

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
  if (key === 'a' && (ship > 72)) {
    cells[ship].classList.remove('ship')
    ship -= 1
    cells[ship].classList.add('ship')
  } else if (key === 's' && (ship < 80)) {
    cells[ship].classList.remove('ship')
    ship +=1
    cells[ship].classList.add('ship')
  } else if (key === 'n') {
    moveLeft()
  } else if (key === 'm') {
    moveRight()
  } else if (key === 'p') {
    moveAliens()
  } else if (key === 'l') {
    playerShoot()
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
    } else if (distanceRight === 8 && aliensCurrent[0] - 1 === aliensPrevious[0]) {
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
  console.log(aliensCurrent)
  aliensCurrent.forEach((alien) => {
    cells[alien].classList.remove('alien')
  })
  aliensCurrent = [2, 3, 4, 5, 6, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24]
  aliensPrevious = []
  aliensCurrent.forEach((alien) => {
    cells[alien].classList.add('alien')
  })
  startButton.disabled = false
  clearInterval(letsGo)
  health = 3
})

function alienBomb() {
  let randomIndex = aliensCurrent[Math.floor(Math.random() * aliensCurrent.length)]
  cells[randomIndex].classList.add('bomb')
  
  
  const generateBombInterval = setInterval(() => {
    
    cells[randomIndex].classList.remove('bomb')
    randomIndex += width
    cells[randomIndex].classList.add('bomb')
    
    if (randomIndex >= (width * (width - 1))) {
      cells[randomIndex].classList.remove('bomb')
      clearInterval(generateBombInterval)
    }
    if (cells[randomIndex].classList.contains('ship')) {
      health = health - 1
      console.log(health)
    }
    if (health < 1) {
      clearInterval(generateBombInterval)
    }
  }, 1000)
}

function gameStart() {
  
  const letsGo = setInterval(() => {
    moveAliens()
    
    if (aliensCurrent[aliensCurrent.length - 1] >= (width * (width - 1))) {
      window.alert('YOU SUCK!')
      clearInterval(letsGo)
    }
    if (health < 1) {
      clearInterval(letsGo)
    }
  }, 2000)
  const dropBombs = setInterval (() => {
    alienBomb()
    if (health < 1) {
      clearInterval(dropBombs)
    }
  }, 2000)
console.log(health)
}

function playerShoot() {
  let bulletIndex = ship - width
  cells[bulletIndex].classList.add('bullet')
  
  const shootInterval = setInterval(() => {
    cells[bulletIndex].classList.remove('bullet')
    bulletIndex = bulletIndex - width
    cells[bulletIndex].classList.add('bullet')
    if (bulletIndex < width) {
  
      clearInterval(shootInterval)
      cells[bulletIndex].classList.remove('bullet')
    }
    if (cells[bulletIndex].classList.contains('alien')) {
      console.log('bang')
      clearInterval(shootInterval)
      cells[bulletIndex].classList.remove('bullet', 'alien')
      const alienIndex = aliensCurrent.indexOf(bulletIndex)
      alienRemoved = aliensCurrent.splice(alienIndex, 1)
      console.log(aliensCurrent)
      

    }
  }, 200)
}