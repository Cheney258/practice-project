// @ts-nocheck
const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

  // 搜索菜单、fetch 拉取信息
  function searchMeal(e) {
    e.preventDefault();

    // 每次重新搜索前先清空上一次的菜单
    single_mealEl.innerHTML = '';

    // 搜索关键字
    const term = search.value

    // 检查是否为空
    if(term.trim()){
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
          // console.log(data,11)
          resultHeading.innerHTML = `<h2>关于'${term}'搜索结果如下：</h2>`

          if(data.meals === null){
            resultHeading.innerHTML =`<p>找不到相关信息。请重新输入！</p>`
          }else{
            mealsEl.innerHTML = data.meals
              .map(meal => `
              <div class='meal'>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>
              `
              ).join('');
          }
        })

        // 渲染完成后删除搜索框的关键字
        search.value = ''
    }else{
      alert('请输入关键字进行搜索！')
    }
  }

  // 点击某一菜单时，通过ID搜索菜单详细信息
  function getMealById(mealID){
    console.log(mealID)
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then(res => res.json())
      .then(data => {
        console.log('meal:',data)
        const meal = data.meals[0]

        // 将其添加到页面中
        addMealToDOM(meal)
      })
  }

  // 拉去随机菜单信息
  function getRandomMeal(){
    // 先清除信息展示区的内容
    mealsEl.innerHTML = ''
    resultHeading.innerHTML = ''

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0]

        addMealToDOM(meal)
      })
  }

function addMealToDOM(meal){
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]){
      console.log(11)
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      )
    }else{
      break
    }
  }

  // 渲染信息
  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>成分</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  console.log(ingredients)
}

// 事件监听
submit.addEventListener('submit', searchMeal)
random.addEventListener('click', getRandomMeal)

mealsEl.addEventListener('click', e =>{
  const mealInfo = e.path.find(item=>{
    if(item.classList){
      return item.classList.contains('meal-info')
    }else {
      return false
    }
  })

  if(mealInfo){
    const mealID = mealInfo.getAttribute('data-mealid')
    getMealById(mealID)
  }
})