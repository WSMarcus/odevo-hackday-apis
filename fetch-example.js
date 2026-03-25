fetch("YOUR URL goes here")
  .then((response) => {
    return response.json()
  })
  .then((json) => {
    console.log(json)
  })