const socket = io();

// Check if browser location is enabled
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (err) => {
        console.log(err);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    });
}

// Initialize the map and set it to an initial view
const map = L.map("map").setView([0, 0], 16);

// Add map layout to the frontend
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "CodeStreetMap"
}).addTo(map);

const marker = {};

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }else{
        marker[id] = L.marker([latitude, longitude]).addTo(map)
    }
});

socket.on("user-disconnected", (id)=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
})