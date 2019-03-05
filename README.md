# Movie List-API
A simple web application for movie fanatic

## Features
- listing movies from movie api
- searching movies by title
- add movies to your favorite list
- manage your favorite list

### Searching
type the title of the movies in search bar
### Favorite List
In index page, press the `+` button on the movie to keep it into favorite list.
You can checkout the favorite list in `favorite.html`
press `x` to remove it from favorite list


### Step1-Axios抓取API&自定義連結
```javascript=
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  
  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    displayDataList(data)
  }).catch((err) => console.log(err))
```

### Step2-設立HtmlContent方法，傳入電影資料
```javascript=
    function displayDataList (data) {
    let htmlContent = ''
    if (detail === true) {  //---step12---
      data.forEach(function (item, index) {
      htmlContent += `<div>...</div>`}
    else if (detail === false) {
      data.forEach(function (item, index) {
      htmlContent += `...`
      })
    dataPanel.innerHTML = htmlContent
      }}
```

### Step3-設立每一筆電影方法(id)
* 定義modalxxx，Axios抓每一筆電影資料
* xxxxmodal.textContent = data.xxxx
* xxxxmodal.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`

```javascript=
    function showMovie (id) {
    const modalTitle = document.getElementById('show-movie-title')
    
    const url = INDEX_URL + id
    console.log(url)
    
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)
    
    modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
```


### Step4-監聽data panel
* addEventListener('click', (event)=>{})
* event.target.matches('.btn')
* showMovie(event.target.dataset.id)

```javascript=
    dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-movie')) {
    showMovie(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavoriteItem(event.target.dataset.id)
  }
})
```

### Step5-搜尋按鈕的事件監聽器
### (preventDefault、RegExp、data.filter)
* event.preventDefault()
* const regex = new RegExp(searchInput.value, 'i')
* let results = []
* results = data.filter(movie => movie.title.match(regex))

```javascript=
  const searchBtn = document.getElementById('submit-search')
  
  searchBtn.addEventListener('click', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })
  
```

### Step6-取得頁碼總數getTotalPages
* 最小整數（電影資料長度/12頁）或者 1
* 迴圈(頁數長度){帶入+=HTML}
* 回傳pagination

```javascript=
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  
  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
```

### Step7-取得按下的頁碼getPageData (pageNum, data)
* data-page=(event.target.dataset.page)
* 條件符合tagName==='A'

```javascript=
  let pageNum = 1
  let paginationData = []
  
  function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }
```

### Step8-監聽pagination，按下連結取得id.page
* data-page=(event.target.dataset.page)
* 條件符合tagName==='A'

```javascript=
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })
```

### Step9-加入最愛電影方法
* JSON.parse呼叫/JSON.stringify取出
* local storage(keys是)(value是字串)
* localStorage.getItem/setItem
* data.find找到值回傳1
* alert("${...}...")
```javascript=
  function addFavoriteItem (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//從電影總表中找出 id 符合條件的電影物件
  const movie = data.find(item => item.id === Number(id))

//判斷是否清單中已有相同的電影，如果沒有則會新增
  if (list.some(item => item.id === Number(id))) {
    alert(`${movie.title} is already in your favorite list.`)
  } else {
    list.push(movie)
    alert(`Added ${movie.title} to your favorite list!`)
  }
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
```

### Step10-更改卡片清單模式，監聽icon物件
* #card/#list
* listCard.addEventListener

```javascript=
    let detail = true
    const listCard = document.querySelector('.list-card')
    listCard.addEventListener('click', event => {
    if (event.target.matches('#card')) {
      detail = true
      getPageData(pageNum)
    } else if (event.target.matches('#list')) {
      detail = false
      getPageData(pageNum)
    }
    })
```
 [bootstrap-Search bar](https://getbootstrap.com/docs/4.1/components/forms/#inline-forms)
 |
 [bootstrap-Cards](https://getbootstrap.com/docs/4.1/components/card/)
 |
 [bootstrap-Modal component](https://getbootstrap.com/docs/4.1/components/modal/)
