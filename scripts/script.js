const gridController = (() => {
  const board = Array(9).fill(undefined)

  const grid = Array(9)
  for (let i=0; i<9; i++) {
    grid[i] = document.getElementById(`box${i}`)
  }

  const render = () => {
    board.forEach((e, i) => {
      grid[i].textContent = e
    })
  }

  const moves = () => {
    return grid.filter((e, i) => { return !board[i] })
  }

  const move = (i, symbol) => {
    board[i] = symbol
  }

  const getGrid = () => { return grid }

  const winner = () => {
    let win = false
    if (!!board[4]) {
      win = (
        (board[4] == board[1] && board[4] == board[7]) ||
        (board[4] == board[3] && board[4] == board[5]) ||
        (board[4] == board[0] && board[4] == board[8]) ||
        (board[4] == board[2] && board[4] == board[6])
      )
    }
    if (!win && !!board[0]) {
      win = (
        (board[0] == board[1] && board[0] == board[2]) ||
        (board[0] == board[3] && board[0] == board[6])
      )
    }
    if (!win && !!board[8]) {
      win = (
        (board[8] == board[2] && board[8] == board[5]) ||
        (board[8] == board[7] && board[8] == board[6])
      )
    }
    return win
  }

  const draw = () => {
    return board.every(e => !!e)
  }

  const clear = () => { board.fill(undefined) }

  const computerMoves = () => {
    let moves = board.reduce((arr, v, i) => {
      if (!v) {
        arr.push(i)
      }
      return arr
    }, [])
    return moves
  }

  return {
    render,
    moves,
    move,
    getGrid,
    winner,
    draw,
    clear,
    computerMoves
  }

})()

const player = (n, symbol) => {
  const clickable = (e) => {
    gridController.move(parseInt(e.target.id[3]), symbol)
    gameController.clicked()
  }

  const turn = () => {
    gridController.moves().forEach((e) => {
      e.addEventListener('click', clickable)
    })
  }

  const endTurn = () => {
    gridController.getGrid().forEach((e) => {
      e.removeEventListener('click', clickable)
    })
  }

  const username = () => { return n }

  return {
    turn,
    endTurn,
    username
  }
}

const gameController = (() => {
  let player1Turn = true
  const winner = document.getElementById('winner')

  gridController.render()

  let player1 = player('Player 1', 'X')
  let player2 = player('Player 2', 'O')

  player1.turn()

  const clicked = () => {
    gridController.render()
    if(gridController.winner()) {
      if (player1Turn) {
        winner.textContent = `${player1.username()} wins`
        player1.endTurn()
      } else {
        winner.textContent = `${player2.username()} wins`
        player2.endTurn()
      }
    } else if (gridController.draw()) {
      winner.textContent = 'Its a draw'
    } else {
      player1Turn = !player1Turn
      //
      console.log(2, player1Turn)
      if (player1Turn) {
        player2.endTurn()
        player1.turn()
      } else {
        player1.endTurn()
        player2.turn()
      }
    }
  }

  const initialise = (p1, p2) => {
    player1Turn = true

    gridController.clear()
    gridController.render()

    player1 = p1
    player2 = p2

    player1.turn()
    winner.textContent = '\xa0'
  }

  return {
    clicked,
    initialise
  }
})()

const formController = (() => {
  const playerNumber = document.getElementById('player-number')
  const player2Label = document.getElementById('player-2-label')
  const player2Name = document.getElementById('player-2-name')
  const form = document.getElementById('settings')

  playerNumber.addEventListener('change', (e) => {
    if (e.target.value == 'one') {
      player2Label.classList.add('none')
      player2Name.classList.add('none')
      player2Name.disabled = true
    } else {
      player2Label.classList.remove('none')
      player2Name.classList.remove('none')
      player2Name.disabled = false
    }
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    player1 = player(form.elements[1].value, 'X')

    if (playerNumber.value == 'one'){
      player2 = computer()
    } else {
      player2 = player(form.elements[2].value, 'O')
    }
    gameController.initialise(player1, player2)
  })
})()

const computer = () => {
  const turn = () => {
    let moves = gridController.computerMoves()
    gridController.move(moves[Math.floor(Math.random() * moves.length)], 'O')
    gameController.clicked()
  }
  const endTurn = () => { return false }
  const username = () => { return 'Computer' }

  return {
    turn,
    endTurn,
    username
  }
}
