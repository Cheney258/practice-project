const btns = document.querySelectorAll('button')
const inputValue = document.querySelector('input')

// 正则判断每个按键的innerHTML 是否为数值或点

const reg = /^[0-9.]$/
const arr = ['%','+','-','x','/','=']
let num1 = 0
let num2 = 0
let count = 0

btns.forEach(item => {


  if (reg.test(item.innerHTML)) {
    item.addEventListener('click', () => {
      inputValue.value += item.innerHTML
    })
  }

  switch (item.innerHTML) {
    case 'C':  // 清空
      item.addEventListener('click', () => {
        inputValue.value = ''
        num1 = ''
        num2 = ''
      })
      break;

    case '+/-':   // 正负
      item.addEventListener('click', () => {
        if (inputValue.value)
          inputValue.value = parseFloat(inputValue.value) * - 1
      })
      break;
    case '%':  // 求余
      item.addEventListener('click',() => clickOperator(item))
      break;
    case '/':
      item.addEventListener('click',() => clickOperator(item))
      break;
    case 'x':
      item.addEventListener('click',() => clickOperator(item))
      break;
    case '-':
      item.addEventListener('click',() => clickOperator(item))
      break;
    case '+':
      item.addEventListener('click',() => clickOperator(item))
      break;
    case '=':
      item.addEventListener('click', () => {
        if (inputValue.value && !(arr.some(i => i == inputValue.value.slice(inputValue.value.length-1)))) {
          // inputValue.value +=item.innerHTML

          // console.log(inputValue.value)
          let numArr = []
          let oprArr = []
          let temArr = inputValue.value.split('')
          // console.log(temArr)

          temArr.forEach((item,index,temArr) => {
            if(isNaN(item)){
              oprArr.push({opr:item,index})
            }            
          })
          
          numArr.push(inputValue.value.slice(0,oprArr[0].index))

          for (let i = 1; i <= oprArr.length-1; i++) {
            numArr.push(inputValue.value.slice(oprArr[i-1].index+1,oprArr[i].index))
          }

          numArr.push(inputValue.value.slice(oprArr[oprArr.length-1].index+1))
          
          oprArr.forEach(item => {
            if(numArr.length>1){
              count = operation(item.opr,numArr[0],numArr[1])
              numArr.splice(0,2,count)
            }  
          })
          inputValue.value = count

        }
      })
      break;
  }
})


// 运算结果函数
function operation (operator,num1,num2){
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  let result = 0
  if(operator == '%'){
    result = num1 % num2 
  }else if(operator == '+'){
    result = num1 + num2
  }else if(operator == '-'){
    result = num1 - num2
  }else if(operator == 'x'){
    result = num1 * num2
  }else{
    if(num2==0){
      inputValue.value = 'NaN'
    }
    result = num1 / num2
  }
  return result
}

// 点击运算符处理的函数
function clickOperator(item){
  if (inputValue.value && !(arr.some(i => i == inputValue.value.slice(inputValue.value.length-1)))) {
    // num1 = parseFloat(inputValue.value) 
    inputValue.value += item.innerHTML
  }
}