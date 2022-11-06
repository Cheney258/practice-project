// @ts-nocheck
const canvas = document.querySelector("canvas"),
toolsBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImg = document.querySelector('.save-img'),
ctx = canvas.getContext('2d')

// 全局默认属性
let prevMouseX,prevMouseY,snapshot
isDrawing = false,
selectedTool = "brush",
brushWidth = 5  // 绘画线的宽度
selectedColor = "#000"

const setCanvasBackground = () => {
  // 设置整个画布的背景为白色，这样在下载是图片的颜色就是白色
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor // 将 fillStyle 改回 selectedColor ,即画笔的颜色
}

window.addEventListener('load', () => {
  // 设置canvas 的宽高
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
  setCanvasBackground()
})

// 工具图形绘画（方形）
const drawRect = (e) => {
  // 如果fillColor未选中，则绘制带有边框的矩形，否则绘制带有背景的矩形
  if(!fillColor.checked){
    // 根据鼠标指针创建圆圈
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY)
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX-e.offsetX, prevMouseY-e.offsetY)
}

// 工具绘图(圆形)
const drawCircle = (e) => {
  ctx.beginPath() // 创建新的路径画圆
  // 根据鼠标指针获取圆的半径
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
  // 根据鼠标指针创建圆
  ctx.arc(prevMouseX,prevMouseY, radius, 0, 2 * Math.PI) 
  // 如果fillColor id选中填充圆，否则绘制边框圆
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

// 工具绘图（三角形）
const drawTriangle = (e) => {
  ctx.beginPath() // 创建新的路径画三角形
  ctx.moveTo(prevMouseX,prevMouseY) // 将三角形移动到鼠标指针
  ctx.lineTo(e.offsetX, e.offsetY)  //通过鼠标指针创建第一条线
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // 画三角形的底线
  ctx.closePath()  // 三角形的闭合路径，因此第三条线自动绘制
  fillColor.checked ? ctx.fill() : ctx.stroke()
}

// 鼠标按下绘画开始
const startDraw = (e) => {
  isDrawing = true
  prevMouseX = e.offsetX  // 将当前mouseX位置传递为prevMouseX
  prevMouseY = e.offsetY  //将当前mouseY位置传递为prevMouseY
  ctx.beginPath() // 重新绘画路线
  ctx.lineWidth = brushWidth
  // 线条颜色
  ctx.strokeStyle = selectedColor
  // 涂满形状颜色
  ctx.fillStyle = selectedColor
  // 复制画布数据并作为快照值传递..这样可以避免拖拽该图像
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// 绘画函数
const drawimg = (e) => {
  if (!isDrawing) return  // 
  ctx.putImageData(snapshot ,0, 0) // 在此画布上添加复制的画布数据

  if(selectedTool==="brush" || selectedTool==="eraser"){
    // 如果选中的是橡皮檫，这设置绘画颜色通过白色覆盖原有的颜色
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
    ctx.lineTo(e.offsetX, e.offsetY)  //根据鼠标指针处理线
    ctx.stroke();  // 用彩色画线/归档线
  }else if(selectedTool==="rectangle"){
    drawRect(e)
  }else if(selectedTool==="circle"){
    drawCircle(e)
  }else{
    drawTriangle(e)
  }
}

// 工具添加监听事件
toolsBtns.forEach(btn=>{
  btn.addEventListener('click', () => {
    // 动态选择选中工具的样式
    document.querySelector(".options .active").classList.remove("active")
    btn.classList.add("active")
    selectedTool = btn.id
    console.log(selectedTool)
  })
})

// 控制线条的粗细
sizeSlider.addEventListener('change',()=> brushWidth = sizeSlider.value)

// 选择绘画的颜色
colorBtns.forEach(btn => {
  btn.addEventListener('click',() => {
    document.querySelector('.options .selected').classList.remove('selected')
    btn.classList.add('selected')
    // 获取颜色的值
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
  })
})

// 颜色选择器
colorPicker.addEventListener('change', () => {
  // 将选取的颜色值从取色器传递到最后一个颜色 btn 背景
  colorPicker.parentElement.style.background = colorPicker.value
  colorPicker.parentElement.click()
})

// 清除按钮
clearCanvas.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setCanvasBackground()
})

// 保存画布为图片
saveImg.addEventListener('click',()=> {
  const link = document.createElement("a")  // 创建一个 a 标签
  link.download = `${Date.now()}.jpg`  // 当前时间作为 img 的名字值输出
  link.href = canvas.toDataURL() // 将canvasData 作为 link 的 href 的值
  link.click() // 点击链接下载image
  // console.log(111)
})

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawimg)
canvas.addEventListener('mouseup', () => isDrawing = false)