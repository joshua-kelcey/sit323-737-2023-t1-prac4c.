// running the program
node ./program.js

// while its running in the first terminal, create a second powershell terminal in visual studio console. then run the Invoke-RestMethod within that
Invoke-RestMethod -Uri http://localhost:3040/add?n1=2"&"n2=10 -Method Get -Headers @{"Content-Type"="application/json"}

//alternatively, go to a browser and access the localhost
http://localhost:3040/add?n1=2&n2=10

// Invoke-RestMethod -Uri http://localhost:3000/ -Method Get -Headers @{"Content-Type"="application/json"}
// Invoke-RestMethod -Uri http://localhost:3000/users -Method Get -Headers @{"Content-Type"="application/json"}
// Invoke-RestMethod -Uri http://localhost:3000/users/1 -Method Get -Headers @{"Content-Type"="application/json"}       
// Invoke-RestMethod -Uri http://localhost:3000/users -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"id": 4, "name": "Jane"}'
// Invoke-RestMethod -Uri http://localhost:3000/users/1 -Method Put -Headers @{"Content-Type"="application/json"} -Body '{"id":1,"name":"doona"}'
// Invoke-RestMethod -Uri http://localhost:3000/users/1 -Method Delete
