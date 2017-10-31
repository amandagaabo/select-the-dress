function app () {
  // add dress page
  // disable add dress button click after form submit button is clicked
  $('#add-submit').click(function(event) {
    $(this).attr("disabled", true)
    $('#dress-form').submit()
  })

  // dresses grid page
  // sort and view event handler
  function selectHandler(type, value) {
    //const query = $.deserialize(window.location.search.substr(1))
    const search = window.location.search.substr(1)
    const query = search ? $.deserialize(search) : {}
    query[type] = value
    const urlQuery = $.param(query)
    const pathname = window.location.pathname
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

  // handle dress photo click - go to dress page using dress id
  $('.dress-link').click(function () {
    let dressID = $(this).parent().attr('data-dress-id')
    const pathname = window.location.pathname
    window.location.href = `${pathname}/${dressID}`
  })

  // handle rating heart click - ajax request to update rating
  $('.editable').click(function() {
    const dressID = $(this).parent().attr('data-dress-id')
    const rating = $(this).attr('data-rating')

    $.ajax({
      url: `/dresses/${dressID}/update-rating`,
      type: 'POST',
      data: {rating: `${rating}`},
      success: function(res) {
        location.reload()
      },
      error: function(res, err) {
        console.log(err)
      }
    })
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
    } else {
      selectedDresses += 1
      const dressID = $(this).parent().attr('data-dress-id')
      compareIDs.push(dressID)
      $(this).next().removeClass('hidden')
      $(this).addClass('hidden')
      if (selectedDresses === 2) {
        $('#compare-btn').parent().removeClass('hidden')
        $('#compare-description').addClass('hidden')
      }
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
      if (selectedDresses < 2) {
        $('#compare-btn').parent().addClass('hidden')
        $('#compare-description').removeClass('hidden')
      }
    }
  })

  // setup tooltip hide and show
  function showTooltip() {
    $('.tooltiptext').css('visibility', 'visible')
    $('.tooltiptext').css('opacity', '1')
  }

  function hideTooltip() {
    setTimeout(function() {
      $('.tooltiptext').css('visibility', 'hidden')
      $('.tooltiptext').css('opacity', '0')
    }, 1500)
  }

  // setup copy to clipboard
  let clipboard = new Clipboard('.copy-btn')

  clipboard.on('success', function(e) {
    console.info('Action:', e.action)
    console.info('Text:', e.text)
    console.info('Trigger:', e.trigger)
    showTooltip()
    hideTooltip()
    e.clearSelection()
  })

  clipboard.on('error', function(e) {
      console.error('Action:', e.action)
      console.error('Trigger:', e.trigger)
  })

  // dress page
  // handle thumbnail clicks
  $('#thumbs img').click(function () {
    $('#large-img').attr('src', $(this).attr('src').replace('thumb', 'large'))
    $('#large-img').attr('alt', $(this).attr('alt').replace('thumb', 'large'))
  })

  // handle see all button click
  $('#see-all-btn').click(function(e){
    e.preventDefault()
    let splitURL = window.location.href.split('/')
    // remove current dress id
    splitURL.pop()
    // create path for /dresses
    let newURL = splitURL.join('/')
    console.log(newURL)

    window.location.href = `${newURL}`
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
