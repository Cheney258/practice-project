// @ts-nocheck
const movieSelect = document.querySelector('#movie')
const seats = document.querySelectorAll('.row .seat:not(.occupied)')
const container = document.querySelector('.container')
const count = document.querySelector('#count')
const total = document.querySelector('#total')

populateUI()
// 电影票的单价
let ticketPrice = movieSelect.value

// 将选中的电影信息存贮到localStorage中
function setMovieData(movieIndex, moviePrice){
  localStorage.setItem('SelectedMoviePrice',moviePrice)
  localStorage.setItem('SelectedMovieIndex',movieIndex)
}

// 更新total 和 count
function updateSelectedCount(){
  const selectedSeats = document.querySelectorAll('.row .seat.selected')

  // 实际上是为每一个座位设置了index
  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat))

  localStorage.setItem('selectedSeats',JSON.stringify(seatsIndex))

  const selectedSeatsCount = selectedSeats.length

  count.innerText = selectedSeatsCount
  total.innerText = selectedSeatsCount * ticketPrice

  setMovieData(movieSelect.selectedIndex, movieSelect.value)
}

// 将localStorage中的数据渲染到界面
function populateUI(){
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'))
  
  if (selectedSeats !==null && selectedSeats.length > 0){
    seats.forEach((seat,index) => {
      if(selectedSeats.indexOf(index) > -1){
        seat.classList.add("selected")
      }
    })
  }

  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex')

  if(selectedMovieIndex !==null){
    movieSelect.selectedIndex = selectedMovieIndex
  }
}

// 电影选中事件
movieSelect.addEventListener('change', e => {
  ticketPrice = +e.target.value
  setMovieData(e.target.selectedIndex, e.target.value)
  updateSelectedCount()
})

// 座位点击事件
container.addEventListener('click', e => {
  // 确定元素中是否包含指定的类名，返回值为true 、false；
  if(e.target.classList.contains('seat') && !e.target.classList.contains('occopied')){
    e.target.classList.toggle('selected')  //如果classList中存在给定的值，删除它，否则，添加它；

    updateSelectedCount()
  }
})

updateSelectedCount()