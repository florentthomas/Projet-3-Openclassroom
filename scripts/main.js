                                                                                                                      
let newSlide= new Carousel(5000);

let newMap= new Map("map",[45.75922997318365,4.810449037597642],14);

let newStation= new Station("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=4281ce4825245af2eebdaf1900d0a9d51f71f345",newMap.map);

let newCanvas= new Canvas();

let newReservation= new Reservation(1200000);
