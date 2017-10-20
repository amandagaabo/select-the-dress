function app () {
  // image uploader
  // Define settings for the uploader
  let CLOUDINARY_PRESET_NAME = 'xki73ahc'
  let CLOUDINARY_RETRIEVE_URL = 'http://res.cloudinary.com/amhprojects/image/upload'
  let CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/amhprojects/image/upload'

  // Define the image uploader

  function buildCloudinaryURL (filename) {
    // Build a Cloudinary URL from a filename
    let urlParts = [CLOUDINARY_RETRIEVE_URL]
    // default to 200x300 px image transformation
    let transform = 'w_200,h_300,c_fill'
    urlParts.push(transform)
    urlParts.push(filename)
    return urlParts.join('/')
  }




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

}

$(app)
