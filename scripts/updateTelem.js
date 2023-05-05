const telemetry = setInterval(() => {
  fetch('http://168.105.255.185:5000/telemetry', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      $('#batteryPercent').html(`${json.batteryLevel}%`);
      $('#speed').html(`${json.speed} mph`);
      $('#doorStatus').html(`${json.door === 'c' ? 'Closed' : 'Open' }`);
      $('#accelerometer').html(json.accelerometer);
      ('#ebTemp').html(`${json.elecBayTemp}°C`);
    })
    .catch((err) => console.log(err));
}, 2000);