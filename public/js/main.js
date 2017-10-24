function app () {
  // add dress page
  // disable add dress button click after form is submitted
  $('#dress-form').submit(function() {
    $(this).find("button[type='submit']").prop('disabled', 'disabled')
  })


  // dresses grid page
  // handle dress photo click - go to dress page using dress id
  $('.dress-img').click(function () {
    let dressID = $(this).parent().attr('data-dress-id')
    window.location.href = `/dresses/${dressID}`
  })

  // sort and view event handler
  function selectHandler(type, value) {
    let query = $.deserialize(window.location.search.substr(1))
    query[type] = value
    let urlQuery = $.param(query)
    let pathname = window.location.pathname
    window.location.href = `${pathname}?${urlQuery}`
  }
  // sort - set value and run function
  $('#sort-by').change(function() {
    let value = $(this).val()
    selectHandler('sort', value)
  })

  // view - set value and run function
  $('#view').change(function() {
    let value = $(this).val()
    selectHandler('view', value)
  })

  // setup initial compare variables
  let selectedDresses = 0
  let compareIDs = []

  // handle main compare button click
  $('#compare-btn').click(function (event) {
    event.preventDefault()
    if (selectedDresses === 2) {
      let idA = compareIDs[0]
      let idB = compareIDs[1]
      let pathname = window.location.pathname
      window.location.href = `${pathname}/compare?dressA=${idA}&dressB=${idB}`
    } else {
      alert('select two dresses to compare')
    }
  })

  // handle add to compare clicks
  $('.add-compare').click( function(event) {
    event.preventDefault()
    if (selectedDresses >= 2) {
      alert('only two dresses can be compared at one time')
    }
    else {
      selectedDresses += 1
      const dressID = $(this).parent().attr('data-dress-id')
      compareIDs.push(dressID)
      $(this).next().removeClass('hidden')
      $(this).addClass('hidden')
    }
  })

  // handle remove from compare clicks
  $('.remove-compare').click( function(event) {
    event.preventDefault()
    if (selectedDresses > 0) {
      selectedDresses -= 1
      const dressID = $(this).parent().attr('data-dress-id')
      const index = compareIDs.indexOf(dressID)
      compareIDs.splice(index, 1)
      $(this).addClass('hidden')
      $(this).prev().removeClass('hidden')
    }
  })

  // dress page
  // handle thumbnail clicks
  $('#thumbs img').click(function () {
    $('#large-img').attr('src', $(this).attr('src').replace('thumb', 'large'))
    $('#large-img').attr('alt', $(this).attr('alt').replace('thumb', 'large'))
  })

  // edit dress page
  // handle delete dress button click - prevent defalut then ajax post request
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

}

$(app)
