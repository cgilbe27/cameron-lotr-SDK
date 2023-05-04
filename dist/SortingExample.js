export const SortingExample = async (accessToken, baseUrl, sortingExample) => {
      var myHeaders = new Headers();
myHeaders.append(`Authorization`, `Bearer ${accessToken}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

return fetch(`${baseUrl}/chapter?sort=${sortingExample}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
      }