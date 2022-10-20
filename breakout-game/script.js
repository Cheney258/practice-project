const canvas = document.querySelector('#canvas')
const rules = document.getElementById('rules');
const rulesBtn = document.querySelector('#rules-btn')
const closeBtn = document.querySelector('#close-btn')
const ctx = canvas.getContext('2d')

let score = 0

const brickRowCount = 9
const brickColumnCount = 5
const delay = 500

// 攻击球初始化
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true
};

// 移动拍初始化
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
}

// 砖信息初始化
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

// 创建砖墙,计算每一块的位置x,y
const bricks = []
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = []
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
    bricks[i][j] = { x, y, ...brickInfo }
  }
}

// 将球画在canvas
function drawBall() {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
  ctx.fillStyle = ball.visible ? "#0095dd" : "transparent"
  ctx.fill()
  ctx.closePath()
}

// 将移动拍画在canvas
function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
  ctx.fillStyle = paddle.visible ? "#0095dd" : "transparent"
  ctx.fill()
  ctx.closePath()
}

// 记录分数的函数
function drawScore() {
  ctx.font = '20px Arial'
  ctx.fillText(`分数：${score}`, canvas.width - 100, 30)
}

// 将砖画在canvas上
function drawBticks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath()
      ctx.rect(brick.x, brick.y, brick.w, brick.h)
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent"
      ctx.fill()
      ctx.closePath()
    })
  })
}

// 移动拍在画布上移动
function movePaddle() {
  paddle.x += paddle.dx

  // 墙的方向
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w
  }

  if (paddle.x < 0) {
    paddle.x = 0
  }
}

// 小球移动
function moveBall() {
  ball.x += ball.dx
  ball.y += ball.dy

  // 左右移动
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1
  }

  // 上下移动
  if (ball.y + ball.size > canvas.width || ball.y - ball.size < 0) {
    ball.dy *= -1
  }

  // 与拍板的碰撞
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed
  }

  // 与砖的碰撞
  bricks.forEach(cloumn => {
    cloumn.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1
          brick.visible = false

          increaseScore()
        }
      }
    })
  })

  // 碰到地面的墙  —— 失败
  if (ball.y + ball.size > canvas.height) {
    showAllBricks()
    score = 0
  }
}

// 分数累计
function increaseScore() {
  score++

  if (score % (brickColumnCount * brickRowCount) === 0) {

    ball.visible = false
    paddle.visible = false

    // 0.5s后重新开始游戏
    setTimeout(() => {
      showAllBricks()
      score = 0
      paddle.x = canvas.width / 2 - 40
      paddle.y = canvas.height - 20
      ball.x = canvas.width / 2
      ball.y = canvas.height / 2
      ball.visible = true
      paddle.visible = true
    }, delay)
  }
}

// 重新画全部砖块
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      brick.visible = true
    })
  })
}

// 将所有的对象画在画布上
function draw() {
  // 开始前先清空画布
  ctx.clearRect(0, 0, canvas?.clientWidth, canvas.height)

  drawBall()
  drawPaddle()
  drawScore()
  drawBticks()
}

// 每次加载前更新
function update() {
  movePaddle()  // 拍板移动
  moveBall()  // 小球移动

  draw()

  requestAnimationFrame(update);
}

update()

function keyDown(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    paddle.dx = paddle.speed
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    paddle.dx = -paddle.speed
  }
}

function keyUp(e) {
  if (
    e.key == 'Right' || 
    e.key == 'ArrowRight' || 
    e.key == 'Left' || 
    e.key == 'ArrowLeft'
    ) {
    paddle.dx = 0
  }
}

// 键盘按键事件
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

rulesBtn.addEventListener('click', () => rules.classList.add('show'))
closeBtn.addEventListener('click', () => rules.classList.remove('show'))

