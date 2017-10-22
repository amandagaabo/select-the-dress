function app () {
  // disable add dress button click after form is submitted
  $('#dress-form').submit(function() {
    $(this).find("button[type='submit']").prop('disabled',true);
  })

  // handle delete dress button click
  $('#delete-btn').click(function (event) {
    event.preventDefault()
    let confirmDelete = confirm('Are you sure you want to delete this dress?')
      if (confirmDelete) {
        let deleteID = $(this).attr('data-dress-id')
        let reqURL = `/dresses/${deleteID}/delete`
        $.ajax({
          url: reqURL,
          type: 'POST',
          success: function(res) {
           window.location.href = '/dresses'
          },
          error: function(res, err) {
            console.log(err)
          }
        })
      }
  })

  // go to dress page using dress id
  $('.dress-box').click(function () {
    let dressID = $(this).attr('data-dress-id')
    console.log(dressID)
    window.location.href = `/dresses/${dressID}`
  })

  // dress page thumbnails
  $('#thumbs img').click(function () {
    $('#large-img').attr('src', $(this).attr('src').replace('thumb', 'large'))
    $('#large-img').attr('alt', $(this).attr('alt').replace('thumb', 'large'))
  })

  // sort and view event handler
  function selectHandler(type, value) {
    let query = $.deserialize(window.location.search.substr(1))
    query[type] = value
    let urlQuery = $.param(query)
    let pathname = window.location.pathname
    window.location.href = `${pathname}?${urlQuery}`
  }
  // sort
  $('#sort-by').change(function() {
    let value = $(this).val()
    selectHandler('sort', value)
  })

  // view
  $('#view').change(function() {
    let value = $(this).val()
    selectHandler('view', value)
  })

}

$(app)
