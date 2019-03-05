(function () {
// ---------step1---------
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
//---------step11---------
  const listCard = document.querySelector('.list-card')
  let detail = true
  let pageNum = 1
// ---------step1---------
  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    displayDataList(data)
    getTotalPages(data) //---step8---
    getPageData(1, data)//---step9---
  }).catch((err) => console.log(err))

  // listen to data panel
// ---------step4---------
  dataPanel.addEventListener('click', (event) => {
  if (event.target.matches('.btn-show-movie')) {
    showMovie(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavoriteItem(event.target.dataset.id)
  }
})
// local storage 裡的 value 是 string type
// 存入 data 時需要呼叫 JSON.stringify(obj)，而取出時需要呼叫 JSON.parse(value)。
// localStorage.getItem('favoriteMovies') 會找不到東西，所以需要建立一個空 Array。 || []
// find 可以依條件檢查 Array，並且回傳第一個符合條件的值。
// 從 HTML 取出的 id 會是 string type，而經過 JSON.parse 之後的 id 會是 number type，所以使用 === 的時候要小心。
// some 則可以依條件檢查 Array 後回傳 boolean。
// ---------step7--------
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

// ---------step13---------
  listCard.addEventListener('click', event => {
    if (event.target.matches('#card')) {
      detail = true
      getPageData(pageNum)
    } else if (event.target.matches('#list')) {
      detail = false
      getPageData(pageNum)
    }
  })
// ---------step2---------
  function displayDataList (data) {
    let htmlContent = ''
    if (detail === true) {  //---step12---
      data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>
            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    }else if (detail === false) {
        data.forEach(function (item, index) {
        htmlContent += `
        <div class="container">
          <div class="row">
            <div class="col-10">
              <h6>${item.title}</h6>
            </div>

            <div class="col-2 card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      })
      }
// ---------step3---------
    dataPanel.innerHTML = htmlContent
  }
// ---------step4---------
  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
// 監聽searchBar Event.preventDefault()
// 搜尋按鈕的事件監聽器
// ---------step6---------
  searchBtn.addEventListener('click', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')

    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    // displayDataList(results)
    getTotalPages(results) //--step10---
    getPageData(1, results) //搜尋結果也要分頁
  })


  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

// 計算總頁數並演算 li.page-item
// ---------step8---------
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

//(頁碼 - 1) * 12 項，再從該位置往後取出 12 筆資料
//我們將起點與終點傳入 slice()，就可以切出陣列中的某一段範圍
//---------step9---------
  let paginationData = []
// 設置一個變數 paginationData，讓 getPageData 擁有固定的資料來源
//getPageData 時有電影資料被傳入，paginationData 會被刷新
//---------step9---------
  function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }



})()
