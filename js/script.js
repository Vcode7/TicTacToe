 const socket = io('https://tttgameserver.herokuapp.com');
  
const MAIN = document.querySelector('.main')
const JOIN = document.querySelector('.join')
const GAME = document.querySelector('.game')
const CREATE = document.querySelector('.create')
const PLAYER1 = document.querySelector('.player1')
const PLAYER2 = document.querySelector('.player2')
const NTG = document.querySelector('.ntg')
const WAITINGTEXT = document.querySelector('.waitingtext')
const STARTBTN = document.querySelector('.startbtn')
const GCD = document.querySelector('.gcd')
const JOINCODE = document.querySelector('.joincode')
const JOINBTN = document.querySelector('.joinbtn')
const STARTER = document.querySelector('.numstart')
const OPPIMG = document.querySelector('.player1img')
const OPPNAME = document.querySelector('.oppname')
const YOURIMG = document.querySelector('.player2img')
const YOURNAME = document.querySelector('.yourname')
const RESULTSCREEN = document.querySelector('.resultscreen')
const RESULT = document.querySelector('.result')
const PLAYAGAIN = document.querySelector('.playagain')
const REQTOPLAY = document.querySelector('.requesttoplay')
const BLOCK = document.querySelector('.block')
const bckmusic = new Audio('../res/bck.mp3');
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const cells = document.querySelectorAll('[d-cell]')
socket.emit('joined')
let playerdata;
//"""""USER NAME"""""
let NAME;

let username = localStorage.getItem('username')

if (username == null) {
  NAME = prompt('Enter Your Name')
  localStorage.setItem('username', NAME)
}
else {
  NAME = username;
}
bckmusic.loop = true;


//"""""CREATE GAME"""""


function createnewroom() {
  CREATE.style.display = 'flex'
  MAIN.style.display = 'none'
  PLAYER1.innerHTML = NAME
  socket.emit('newGame', NAME)
}


//"""""JOIN GAME"""""


JOINBTN.addEventListener('click', () => {
  MAIN.style.display = 'none'
  JOIN.style.display = 'flex'
})


function joinroom() {
  let roomcode = JOINCODE.value;
  socket.emit('joinGame', roomcode, NAME)
  JOINCODE.value = '';
}
//"""""START GAME"""""

function gamestart() {
  socket.emit('startgame')
}

function startGame() {
  
  RESULTSCREEN.style.display = 'none'
  PLAYAGAIN.style.display = 'none'
  CREATE.style.display = 'none'
  REQTOPLAY.style.display = 'none'
  GAME.style.display = 'flex'
  YOURIMG.classList.remove('rounding')
  OPPIMG.classList.remove('rounding')
  
  if (NAME == playerdata.playerone) {
    YOURNAME.innerHTML = playerdata.playerone;
    OPPNAME.innerHTML = playerdata.playertwo;
    YOURIMG.classList.add('rounding')
    
  } else {
    YOURNAME.innerHTML = playerdata.playertwo;
    OPPNAME.innerHTML = playerdata.playerone;
    OPPIMG.classList.add('rounding')
  }
  
  cells.forEach(cell => {
    cell.classList.remove('x')
    cell.classList.remove('o')
    cell.addEventListener('click', handleClick, { once: true })
  })
  counting();
}

function counting() {
  BLOCK.style.display = 'block'
  STARTER.style.display = 'block'
  STARTER.innerHTML = 1;

  setTimeout(() => {
    STARTER.innerHTML = 2;
    
  }, 1000);
  setTimeout(() => {
    STARTER.innerHTML = 3;
    
  }, 2000 );
  setTimeout(() => {
    STARTER.innerHTML = 'Start';
    
  }, 3000);
  setTimeout(() => {
    STARTER.style.display = 'none'
    
    if(NAME == playerdata.playerone){
      BLOCK.style.display = 'none'
    }
  }, 4100);
}
//"""""FUNCTION OF GAME"""""

function handleClick(e) {
  const cell = e.target
  if (NAME == playerdata.playerone) {
    cell.classList.add('x')
    currentClass = 'x'
    cellid = cell.id
    socket.emit('code', cellid, currentClass)
    BLOCK.style.display = 'block';
    YOURIMG.classList.remove('rounding')
  }
  else {
    cell.classList.add('o')
    currentClass = 'o'
    cellid = cell.id
    socket.emit('code', cellid, currentClass)
    BLOCK.style.display = 'block';
    YOURIMG.classList.remove('rounding')
  }
  if (checkWin(currentClass)) {
    win()
  }
  else if (isDraw()) {
    socket.emit('draw')
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass)
    })
  })
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains('x') || cell.classList.contains('o')
  })
}

function handleinit(data) {
  JOIN.style.display = 'none'
  NTG.style.display = 'none'
  bckmusic.play()
  GCD.style.display = 'none'
  CREATE.style.display = 'flex'
  PLAYER2.style.display = 'block'
  PLAYER1.innerHTML = data.playerone;
  PLAYER2.innerHTML = data.playertwo;
  if (NAME == data.playerone) {
    STARTBTN.style.display = 'block'
  }
  else {
    WAITINGTEXT.style.display = 'block'
  }
  playerdata = data;
}

function handlecode(plc, oc) {
  cells.forEach(cell => {
    cellid = cell.id
    if (cellid == plc) {
      cell.classList.add(oc)
      cell.removeEventListener('click', handleClick)
    }
    BLOCK.style.display = 'none'
  });
}
//"""""SOCKET ON CONNECTION"""""


socket.on('gameCode', roomname => {
  GCD.innerHTML = `Your Room code is ${roomname}`
})
let out = 0;
socket.on('win',()=>{  
  out = 1
  if (GAME.style.display == 'flex') {
    setTimeout(() => {
      if (out==1) {
        win()
      }
    }, 7000);
  } else {
    
  }
})

socket.on('join',()=>{
  out = 0;
})
socket.on('Youloss',loss)

socket.on('gameStart', startGame)

socket.on('gamedraw',draw)

socket.on('reject',()=>{
	PLAYAGAIN.innerHTML = 'Request not accepted'
})

socket.on('rtp',()=>{
  RESULT.style.display = 'none'
  REQTOPLAY.style.display = 'flex'
})

socket.on('init', handleinit)

socket.on('unknow', () => {
  alert('Your code is wrong or room is not there')

})

socket.on('roomfull', () => {
  alert('room is full')
})

socket.on('oppcode', handlecode)

socket.on('next', oc => {
  YOURIMG.classList.remove('rounding')
  OPPIMG.classList.remove('rounding')
  if (NAME == playerdata.playerone) {
    if (oc == 'o') {
      YOURIMG.classList.add('rounding')
    }

    else {
      OPPIMG.classList.add('rounding')
    }
  }
  else {
    if (oc == 'x') {
      YOURIMG.classList.add('rounding')
    }

    else {
      OPPIMG.classList.add('rounding')
    }
  }
})


//"""""RESULT OF GAME"""""

function win() {
  RESULTSCREEN.style.display = 'block'
  RESULT.style.display = 'flex'
  socket.emit('loss')
  RESULT.innerHTML = `
   YOU HAVE WON THE GAME
   <button class="playagainbtn" onclick="playagain()">play again</button>  `
}

function loss() {
  RESULTSCREEN.style.display = 'block'
  RESULT.style.display = 'flex'
  RESULT.innerHTML = `
   YOU HAVE LOSS THE GAME
   <button class="playagainbtn" onclick="playagain()">play again</button>  `
}
function draw() {
  RESULTSCREEN.style.display = 'block'
  RESULT.style.display = 'flex'
  RESULT.innerHTML = `
   GAME DRAW
   <button class="playagainbtn" onclick="playagain()">play again</button>  `
}

//"""""PLAY AGAIN"""""

function playagain() {
  RESULT.style.display = 'none'
  PLAYAGAIN.style.display = 'flex'
  socket.emit('requesttpa')
}

function gameover() {
  socket.emit('gameover')
  window.location.reload()
}
function requestrejected() {
  socket.emit('rejected')
}

bckmusic.play()

