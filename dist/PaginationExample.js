export const PaginationExample = async (accessToken, baseUrl, limit, pageNumber) => {
      var myHeaders = new Headers();
myHeaders.append(`Authorization`, `Bearer ${accessToken}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

return fetch(`${baseUrl}/character?limit=${limit}&page=${pageNumber}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
      }