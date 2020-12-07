
import jQuery from 'jquery'
const $ = jQuery
window.$ = $

const Mail = {

  post: function(data, message) {
    let ok = true
    for (const key in data) {
      data[key] = data[key].trim()
      if (!data[key] || 0 === data[key].length) {
        ok = false
      }
    }
    if (!ok) {
      alert('Please complete all fields')
    } else {
      $.ajax({
          type: 'GET',
          url: 'http://agilesimulations.co.uk/mail.php',
          data: data,
          success: function() {
            alert(message)
          }
      })
    }
  }
}

export default Mail