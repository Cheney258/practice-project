const minutes = document.querySelector('#minutes')
const seconds = document.querySelector('#seconds')
const start = document.querySelector('#start')
const reset = document.querySelector('#reset')
const over = document.querySelector("#time")
const bTime = document.querySelector('#bTime')
const sTime = document.querySelector('#sTime')

const lTop = document.querySelector('#l_top')
const lBottom = document.querySelector('#l_bottom')
const rTop = document.querySelector('#r_top')
const rBottom = document.querySelector('#r_bottom')

let m = 25  // 分钟
let s = 00  // 秒钟
let break_time = 5

function run() {
  if (start.innerHTML == 'Start') {
    start.innerHTML = 'Pause'
    let count = m * 60 + s
    window.timer = setInterval(() => {
      count = count - 1
      if (count < 0) {
        count = break_time * 60
      }

      m = Math.floor(count / 60) % 60
      s = Math.floor(count) % 60

      minutes.innerHTML = m > 9 ? m : "0" + m
      seconds.innerHTML = s > 9 ? s : "0" + s
    }, 1000);
  } else {
    start.innerHTML = 'Start'
    clearInterval(timer)
  }
}

start.addEventListener('click', run)
reset.addEventListener('click', () => {
  clearInterval(timer)
  start.innerHTML = 'Start'
  m = 25
  s = 0
  break_time = 5

  minutes.innerHTML = m
  seconds.innerHTML = "0" + s
  bTime.innerHTML = break_time
  sTime.innerHTML = m
})

lTop.addEventListener('click', () => {
  if(start.innerHTML == 'Start'){
    m = parseInt(minutes.innerHTML) + 1;
    minutes.innerHTML = m < 10 ? "0"+m : m
    if(s == 0){
      sTime.innerHTML = m
    }else{
      sTime.innerHTML = m + 1
    }
  } 
   
})
lBottom.addEventListener('click', () => { 
  if(start.innerHTML == 'Start'){
    m = parseInt(minutes.innerHTML) - 1 < 0 ? 0 : parseInt(minutes.innerHTML) - 1;
    minutes.innerHTML = m < 10 ? "0" + m : m
    if(s == 0){
      sTime.innerHTML = m
    }else{
      sTime.innerHTML = m + 1
    }
      
  } 
})
rTop.addEventListener('click', () => { 
  if(start.innerHTML == 'Start'){ 
    break_time = parseInt(bTime.innerHTML) + 1; 
    bTime.innerHTML =  break_time
  } 
})
rBottom.addEventListener('click', () => { 
  if(start.innerHTML == 'Start'){
    break_time = parseInt(bTime.innerHTML) - 1 < 1 ? 1 : parseInt(bTime.innerHTML) - 1;
    bTime.innerHTML = break_time   
  } 
})
