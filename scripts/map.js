class Map{
    
    constructor(container,coordonne,zoom){
        
        this.map= L.map(container).setView(coordonne, zoom);
        this.tileLayers= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        });
        this.tileLayers.addTo(this.map);
        
        
    }    
}