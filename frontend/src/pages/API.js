const apiCall = (path, method, body, arg) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-type': 'application/json',
      },
    };

    if (method === 'GET') {
      path = path + arg;
    } else {
      options.body = JSON.stringify(body);
    }

    if (localStorage.getItem('token')) {
      options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }

    fetch('http://localhost:5005/' + path, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          reject(data);
        } else {
          resolve(data);
        }
      });
  });
};

export default apiCall;
