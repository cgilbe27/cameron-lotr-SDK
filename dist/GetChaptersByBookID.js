export const GetChaptersByBookID = async (accessToken, baseUrl, id) => {
      var myHeaders = new Headers();
myHeaders.append(`Authorization`, `Bearer ${accessToken}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

return fetch(`${baseUrl}/book/${id}/chapter`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
      }