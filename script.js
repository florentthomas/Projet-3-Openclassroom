
class Map{
    
    constructor(container,coordonne,zoom,url){
        
        this.map= L.map(container).setView(coordonne, zoom);
        this.tileLayers= L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        });
        this.tileLayers.addTo(this.map);
        this.url=url;
        this.createStations();
        
    }

    
    
    get(url){
    
        return new Promise(function(resolve,reject){
      
            let req= new XMLHttpRequest();
            req.open("GET",url,true);

            req.send();

            req.addEventListener("load",function(){

                if(req.status >= 200 && req.status < 400){
                    resolve(req.responseText);
                }else{
                    console.error(req.statusText+" "+req.status);
                    }
                })

            req.addEventListener("error",function(){

                console.error(new Error);
            })
            
        })        
    }
    
    
    getStations(){
    
        return this.get(this.url).then(function(response){
            
            let stations= JSON.parse(response);
            
            return stations;
        })
    }
        
    createStations(station){
        let self=this;
        this.getStations().then(function(stations){
            
            
            for(station of stations){
                let newStation= new Station(station.name,station.address,station.position.lat,station.position.lng,station.available_bikes,station.available_bike_stands,station.status);
      
                self.eventMarker(self.createMarker(newStation),newStation);
                self.canvas(newStation);
            }
            
            
        })
        
     
    }
    
    //nom,adresse,positionLat,positionLng,velo_dispo,place_dispo,status
    eventMarker(marker,stationObject){
        let self=this;
        marker.addEventListener("click",function(){
            
            let signatureElt=document.getElementById("signature");
            signatureElt.style.display="none";
            
            let stationInfosElt=document.getElementById("stationInfos");
            let nomStationElt=document.getElementById("nom_station");
            let adresseStationElt=document.getElementById("adresse_station");
            let veloDisponibleElt=document.getElementById("velo_disponible");
            let placeDisponibleElt=document.getElementById("place_disponible");
            let statusElt=document.getElementById("status");
             
            stationInfosElt.style.display="block";
            
            let nameStationToSplit= stationObject.nom_station;
            let nameStationTab= nameStationToSplit.split("-");
            nomStationElt.textContent=nameStationTab[1];
            
            adresseStationElt.textContent=stationObject.adresse_station;
            
            veloDisponibleElt.textContent="Vélo disponible: ";
            veloDisponibleElt.appendChild(self.colorBikeFree(stationObject.velo_dispo));
            
            placeDisponibleElt.textContent="Stationnement disponible: "+stationObject.place_dispo;
            
            statusElt.textContent=self.textStatus(stationObject.status);
            statusElt.style.color=self.colorStatus(stationObject.status);
            //console.log(self.textStatus(stationObject.status));
            statusElt.style.fontWeight="bold";
            
            sessionStorage.setItem("station",nomStationElt.textContent);
            sessionStorage.setItem("nbrVelo",stationObject.velo_dispo);
            sessionStorage.setItem("status",statusElt.textContent);
            console.log(sessionStorage);
                
        })
    }
    
    createMarker(stationObject){
         
        let markerColor=null;
    
        if(stationObject.velo_dispo === 0){
            markerColor=L.icon({iconUrl:"image/marker_red.png"});
        }else if(stationObject.velo_dispo >= 1 && stationObject.velo_dispo <= 10){
            markerColor=L.icon({iconUrl:"image/marker_orange.png"});
        }else{
            markerColor=L.icon({iconUrl:"image/marker_green.png"});
        }

        let marker=L.marker([stationObject.positionLatStation,stationObject.positionLngStation],{icon:markerColor}).addTo(this.map);
            
        return marker;
    }
    
    
    colorBikeFree(nbrVelo){
        let spanElt=document.createElement("span");
        spanElt.textContent=nbrVelo;
        let color="green";
        
        if(nbrVelo >= 1 && nbrVelo < 10 ){
            color="orange";
        }else if(nbrVelo === 0){
            color="red";
        }
        
        spanElt.style.color=color;
        
        return spanElt;
    }
    
    
    textStatus(status){
        
        let status_station=null;
        
        if(status === "OPEN"){
            status_station="Ouvert";
        }else{
            status_station="Fermé";
        }
        
        return status_station;
    }
    
        
    colorStatus(status){
        
        let color ="green";
        
        if(status === "CLOSED"){
            color="red";
        }
        
        return color;
    }
    
    canvas(stationObject){
        
        let signatureElt=document.getElementById("signature");
        let reserverBtn=document.getElementById("reserver");
        
        reserverBtn.addEventListener("click",function(e){
            
            e.preventDefault();
            
            if(sessionStorage.getItem("nbrVelo") >= 1 && sessionStorage.getItem("status") === "Ouvert"){
                signatureElt.style.display="block";
                console.log(sessionStorage.getItem("nbrVelo"));
            }
            
        })    
    }
    
    
}



class Canvas{
    
    constructor(container,confirmerBtn,annulerBtn,stationInfosElt){
        this.canvasElt=container;
        this.started=false;
        this.draw=false;
        this.ctx=this.canvasElt.getContext("2d");
        this.confirmerBtn=confirmerBtn;
        this.annulerBtn=annulerBtn;
        this.stationInfosElt=stationInfosElt;
        this.posX=null;
        this.posY=null;
        this.X=null;
        this.Y=null;
        this.signe=false;
        
        this.drawCanvas();
    }
    
    
    drawCanvas(){
        
        let self=this;
        
        this.canvasElt.addEventListener("mousedown",function(e){

            self.draw=true;
            self.posX=(e.pageX - self.stationInfosElt.offsetLeft)-self.canvasElt.offsetLeft;
            self.posY=(e.pageY - self.canvasElt.offsetTop)-self.canvasElt.offsetTop;
            
                        
        })

       
        

        this.canvasElt.addEventListener("mousemove",function(e){
            console.log("posX= "+self.posX);
            console.log("posY= "+self.posY);
            
            
            
            
            if(self.draw){
                
                self.X=(e.pageX - self.stationInfosElt.offsetLeft) - self.canvasElt.offsetLeft;
                self.Y=(e.pageY - self.canvasElt.offsetTop)-self.stationInfosElt.offsetTop;
                self.signe=true;
            }

            if (!self.started) {

                self.ctx.beginPath();
                self.ctx.moveTo(self.posX, self.posY);
                self.started = true;
                
            }else{
                self.ctx.lineTo(self.X, self.Y);
                self.ctx.strokeStyle = "#000000";
                self.ctx.lineWidth = 3;
                self.ctx.stroke();
                
            }
            
            self.posX=self.X;
            self.posY=self.Y;
            
        })


        self.canvasElt.addEventListener("mouseup",function(){
            self.started=false;
            self.draw=false;
            
        })


        self.canvasElt.addEventListener("mouseleave",function(){
            self.started=false;
            self.draw=false;
        })
                
                    
                    
        self.annulerBtn.addEventListener("click",function(){
                        
            self.ctx.clearRect(0,0,300,150);
                        
        })
                    
                    
       
                    
        self.confirmerBtn.addEventListener("click",function(){
                        
             if(self.signe === true){
                
                 console.log("reservé");
                console.log(self.signe);
            }else{
                let messageElt=document.getElementById("message");
                messageElt.textContent="Vous devez signer avant de valider la réservation";
                messageElt.style.display="block";
                messageElt.style.color="red";
                
                setTimeout(function(){
                    messageElt.style.display="none";
                },3000);
                console.log(self.signe);
               
            }
    
        })
        
        console.log(self.signe);
        
    }
    
    
    
    
    
  
    
}
                                                             
                                                             
class Reservation{
    
    constructor(nom_station,confirmerBtn){
        
        this.nom_station=nom_station;
        this.confirmerBtn=confirmerBtn;
    }
    
    
    checkReservation(){
        
        
        this.confirmerBtn.addEventListener("click",function(){
            
            if(sessionStorage.getItem("reserve")){
            
            //cas où aucune reservation est en cours
            
            
            }else{
            
                sessionStorage.setItem("reserve",true);
                
                
            
            
            }
            
            
        })
        
    }
    
    reserver(){
        
        resume_confirmationElt.style.display="block";
                        
                       
                        
                        let station_reserveeElt=document.getElementById("station_reservee");
                        
                        station_reserveeElt.textContent=sessionStorage.getItem("station");
                        
                        let minutes="1";
                        let seconds="0";
                        
                        let compteurElt=document.getElementById("compteur");

                        compteurElt.textContent=(minutes+" min "+seconds+" s");


                        let heure_actuelle= new Date();
                        let heure_fin_resersation= new Date();
                        heure_fin_resersation.setMinutes(heure_actuelle.getMinutes()+1);

                            // commencer l'interval ici
                            //let time= dateNow - dateFin;

                        IntervalID=setInterval(chrono,1000);

                        function chrono(){

                            let heure_debut_reservation=new Date();

                            let time = heure_fin_resersation.getTime() - heure_debut_reservation.getTime();

                            minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
                            seconds = Math.floor((time % (1000 * 60)) / 1000);

                            compteurElt.textContent=(minutes+" min "+seconds+" s");

                            if(seconds === 0 && minutes === 0){
                                fin_reservation();
                               
                            }
                         }
                        
                        function fin_reservation(){
                            
                            clearInterval(IntervalID);
                            resume_confirmationElt.textContent="Votre réservation a été annulé";
                            sessionStorage.removeItem("reserve");
                            setTimeout(function(){
                                    
                                resume_confirmationElt.style.display="none";
                            },3000);
                        }
                        
                        
                        let annuler_reservationBtn=document.getElementById("annuler_reservation");
                        
                        annuler_reservationBtn.addEventListener("click",fin_reservation);
        
        
        
    }
    
    
    
}    
            
                                                            
                                                             

let newMap= new Map("map",[45.75922997318365,4.810449037597642],14,"https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=4281ce4825245af2eebdaf1900d0a9d51f71f345");//Instanciation de l'objet newMap

let newCanvas= new Canvas(document.getElementById("canvas"),document.getElementById("confirmer"),document.getElementById("annuler"),document.getElementById("stationInfos"));

// API JCDecaux https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=4281ce4825245af2eebdaf1900d0a9d51f71f345

//Fonction requête HTTP asynchrone
//function get(url){
//    
//    return new Promise(function(resolve,reject){
//        
//        let req= new XMLHttpRequest();
//        
//        req.open("GET",url,true);
//        
//        req.send();
//        
//        req.addEventListener("load",function(){
//            
//            if(req.status >= 200 && req.status < 400){
//                resolve(req.responseText);
//            }else{
//                console.error(req.statusText+" "+req.status);
//            }
//        })
//        
//        req.addEventListener("error",function(){
//            
//            reject(new Error);
//        })
//    })
//    
//}


//fonction qui retourne le resultat de la promesse pour obtenir les stations depuis l'API JCDecaux

//let getStations= function(){
//    
//   
//        return get("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=4281ce4825245af2eebdaf1900d0a9d51f71f345").then(function(response){
//            
//            let stations= JSON.parse(response);
//            
//            return stations;
//        })
//
//    
//} 

//Creation de la classe station
class Station{
    
    constructor(nom,adresse,positionLat,positionLng,velo_dispo,place_dispo,status){
        
        this.nom_station= nom;
        this.adresse_station= adresse;
        this.positionLatStation= positionLat;
        this.positionLngStation= positionLng;
        this.velo_dispo= velo_dispo;
        this.place_dispo= place_dispo;
        this.status= status;
     
    }
    
   
    
}
    
    
//        }).then(function(stations){
//            
//            forEach(function(station){
//        
//            let newStation= new Stations(station.name,station.address,station.position.lat,station.position.lng,station.available_bikes,station.available_bike_stands,station.status);
//
//           //let marker= new MarkerBike(newStation.positionLatStation,newStation.positionLngStation,newMap);
//
//
//            let marker=L.marker([station.position.lat,station.position.lng],{icon:newStation.markerColor()}).addTo(newMap);
//            })
//
//            return {marker,newStation};
//            
//            }).catch(function(e){
//                console.error(e);
//            
//            })
//            
//    }
//        
//    
//    colorBikeFree(nbrVelo){
//        let colorBikeElt=document.createElement("span");
//        colorBikeElt.textContent=this.bikeFree;
//        colorBikeElt.style.fontWeight="bold";
//        colorBikeElt.style.color="green";
//        
//        if(nbrVelo === 0){
//            colorBikeElt.style.color="red";
//        }else if(nbrVelo >= 1 && nbrVelo <= 10){
//            colorBikeElt.style.color="orange";
//        }
//       
//        return colorBikeElt;
//    }
//    
//    colorStatus(){
//        let color="";
//        
//        if(this.status === "OPEN"){
//            color="green";
//        }else{
//            color="red";
//        }
//        
//        return color;
//    }
//    
//    textStatus(){
//        let texte="";
//        
//        if(this.status === "OPEN"){
//            texte="OUVERT";
//        }else{
//            texte="FERME";
//        }
//        
//        return texte;
//    }
//    
//    markerColor(){
//        let marker=null;
//        
//        
//        if(this.bikeFree === 0){
//            marker=L.icon({iconUrl:"image/marker_red.png"});
//        }else if(this.bikeFree >= 1 && this.bikeFree <= 10){
//            marker=L.icon({iconUrl:"image/marker_orange.png"});
//        }else{
//            marker=L.icon({iconUrl:"image/marker_green.png"});
//        }
//
//        
//        return marker;
//    }
//}



//getStations().then(function(stations){
//    
//    
//    
//    stations.forEach(function(station){
//        
//        let newStation= new Stations(station.name,station.address,station.position.lat,station.position.lng,station.available_bikes,station.available_bike_stands,station.status);
//        
//       //let marker= new MarkerBike(newStation.positionLatStation,newStation.positionLngStation,newMap);
//
//       
//        let marker=L.marker([station.position.lat,station.position.lng],{icon:newStation.markerColor()}).addTo(newMap);
//            
//      
        
//        marker.addEventListener("click",function(){
//            
//            //evenement click sur chaque marker pour afficher les infos de la station 
//            
//            let signatureElt=document.getElementById("signature");
//            signatureElt.style.display="none";
//            
//            let stationInfosElt=document.getElementById("stationInfos");
//            let nameStationElt=document.getElementById("nameStation");
//            let addressStationElt=document.getElementById("addressStation");
//            let available_bikesElt=document.getElementById("available_bikes");
//            let available_bike_standsElt=document.getElementById("available_bike_stands");
//            let statusElt=document.getElementById("status");
//
//            stationInfosElt.style.display="block";
//            
//            let nameStationToSplit= newStation.nameStation;
//            let nameStationTab= nameStationToSplit.split("-");
//            nameStationElt.textContent=nameStationTab[1];
//            
//        
//            
//            addressStationElt.textContent=newStation.addressStation;
//            available_bikesElt.textContent="Vélo disponible: ";
//            available_bikesElt.appendChild(newStation.colorBikeFree(newStation.bikeFree));
//         
//            
//            available_bike_standsElt.textContent="Stationnement disponible: "+newStation.bikeStandsFree;
//            statusElt.textContent=newStation.textStatus();
//            statusElt.style.color=newStation.colorStatus();
//            statusElt.style.fontWeight="bold";
//            
//            sessionStorage.setItem("station",nameStationElt.textContent);
//            
//            console.log(sessionStorage);
//            
//            
//            let btnForm=document.getElementById("reserver");
//            
//            if(newStation.bikeFree === 0 || newStation.status==="CLOSE"){
//                
//                btnForm.disabled=true
//            }else{
//                btnForm.disabled=false;
//            }
//            
//            // localStotage pour nom et prénom
//            
//            let firstNameElt=document.getElementById("firstName");
//            let lastNameElt=document.getElementById("lastName");
//                
//          
//            
//            firstNameElt.addEventListener("change",function(){
//                
//            
//                localStorage.setItem("firstName",this.value);
//            });
//            
//            
//            lastNameElt.addEventListener("change",function(){
//                localStorage.setItem("lastName",this.value);
//            })
//            
//            if(localStorage){
//                
//                firstNameElt.value=localStorage.getItem("firstName");
//                lastNameElt.value=localStorage.getItem("lastName");
//            }
//          
//            
//            
//            
//            document.querySelector("form").addEventListener("submit",function(e){
//                
//                e.preventDefault();
//                
//                
//                if(newStation.bikeFree >= 1){
//                     
//                
//                    //Si nbr velo > 1 affichage du canvas pour la signature
//                
//                    signatureElt.style.display="block";
//                    
//                
//                    let canvasElt=document.getElementById("canvas");
//                    let started=false;
//                    let draw=false;
//
//                    let ctx= canvasElt.getContext("2d");
//
//                    
//
//                    canvasElt.addEventListener("mousedown",function(e){
//
//                        draw=true;
//                        let posX=(e.pageX - stationInfosElt.offsetLeft)-canvasElt.offsetLeft;
//                        let posY=(e.pageY - canvasElt.offsetTop);
//
//                        
//                    })
//
//        
//
//                    canvasElt.addEventListener("mousemove",function(e){
//
//                        if(draw){
//
//                            posX=(e.pageX - stationInfosElt.offsetLeft) - canvasElt.offsetLeft;
//                            posY=(e.pageY - canvasElt.offsetTop);
//                            
//                            
//
//                            
//
//                            if (!started) {
//
//                                ctx.beginPath();
//                                ctx.moveTo(posX, posY);
//                                started = true;
//                            } 
//
//                            else {
//                                ctx.lineTo(posX, posY);
//                                ctx.strokeStyle = "#000000";
//                                ctx.lineWidth = 3;
//                                ctx.stroke();
//                            }
//                        }
//
//
//                    })
//
//
//                    canvasElt.addEventListener("mouseup",function(){
//                        started=false;
//                        draw=false;
//                    })
//
//
//                    canvasElt.addEventListener("mouseleave",function(){
//                        started=false;
//                        draw=false;
//                    })
//                
//                    
//                    let cancelElt=document.getElementById("cancel");
//                    
//                    cancelElt.addEventListener("click",function(){
//                        
//                        ctx.clearRect(0,0,300,150);
//                        
//                        
//                    })
//                    
//                    
//                    let confimer_reservationBtn=document.getElementById("confirmer");
//                    let resume_confirmationElt=document.getElementById("resume_confirmation");
//                    
//                    confimer_reservationBtn.addEventListener("click",function(){
//                        
//                        
//                            
//                        sessionStorage.setItem("reserve",1);    
//                        
//                        
//                        
//                       
//                        
//                        resume_confirmationElt.style.display="block";
//                        
//                       
//                        
//                        let station_reserveeElt=document.getElementById("station_reservee");
//                        
//                        station_reserveeElt.textContent=sessionStorage.getItem("station");
//                        
//                        let minutes="1";
//                        let seconds="0";
//                        
//                        let compteurElt=document.getElementById("compteur");
//
//                        compteurElt.textContent=(minutes+" min "+seconds+" s");
//
//
//                        let heure_actuelle= new Date();
//                        let heure_fin_resersation= new Date();
//                        heure_fin_resersation.setMinutes(heure_actuelle.getMinutes()+1);
//
//                            // commencer l'interval ici
//                            //let time= dateNow - dateFin;
//
//                        IntervalID=setInterval(chrono,1000);
//
//                        function chrono(){
//
//                            let heure_debut_reservation=new Date();
//
//                            let time = heure_fin_resersation.getTime() - heure_debut_reservation.getTime();
//
//                            minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
//                            seconds = Math.floor((time % (1000 * 60)) / 1000);
//
//                            compteurElt.textContent=(minutes+" min "+seconds+" s");
//
//                            if(seconds === 0 && minutes === 0){
//                                fin_reservation();
//                               
//                            }
//                         }
//                        
//                        function fin_reservation(){
//                            
//                            clearInterval(IntervalID);
//                            resume_confirmationElt.textContent="Votre réservation a été annulé";
//                            sessionStorage.removeItem("reserve");
//                            setTimeout(function(){
//                                    
//                                resume_confirmationElt.style.display="none";
//                            },3000);
//                        }
//                        
//                        
//                        let annuler_reservationBtn=document.getElementById("annuler_reservation");
//                        
//                        annuler_reservationBtn.addEventListener("click",fin_reservation);
//                        
//                           
//                        
//                        
//                        
//                      
//                        
//                    })
//                    
//                    
//                    
//        
//                    }else{}
//            
//            })
//            
//            
//        
//            
//        })
//            
//            
//            
//        })
//
//            
//            
//
//
//}).catch(function(){
//    
//})
