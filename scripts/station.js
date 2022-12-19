


class Station{
    
    constructor(url,map){
        
        this.url=url;
        this.map= map;
        this.signatureElt=document.getElementById("signature");
        this.stationInfosElt=document.getElementById("station_infos");
        this.nomStationElt=document.getElementById("nom_station");
        this.adresseStationElt=document.getElementById("adresse_station");
        this.veloDisponibleElt=document.getElementById("velo_disponible");
        this.placeDisponibleElt=document.getElementById("place_disponible");
        this.statusElt=document.getElementById("status"); 
        this.creerStations();
    }

    get(url){ //promesse qui contient un requête HTTP
    
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
    
                reject(req);
            })
            
        })        
    }
    
    
    getStations(){ //
    
        return this.get(this.url).then(function(response){
            
            let stations= JSON.parse(response);
            console.log(stations);
            return stations;
        })
    }

    
        
    creerStations(station){
   
        this.getStations().then(function(stations){
            
    
            for(let station of stations){
                  
                 //Creation et mis en place des markers sur la carte
                this.evenementMarker(this.creerMarker(station),station);
            }
            
           
        }.bind(this)).catch(function(error){
            console.error(error);
        })
     
         
     
    }

    //selectionne le marker coloré en fonction du nombre de vélo disponible
    creerMarker(station){
         
        let markerColor=null;
    
        if(station.available_bikes === 0){
            markerColor=L.icon({iconUrl:"images/marker_red.png"});
        }else if(station.available_bikes  >= 1 && station.available_bikes  < 10){
            markerColor=L.icon({iconUrl:"images/marker_orange.png"});
        }else{
            markerColor=L.icon({iconUrl:"images/marker_green.png"});
        }
    
        let marker=L.marker([station.position.lat,station.position.lng],{icon:markerColor}).addTo(this.map);
 
       return marker;
    }
 
    
    //Ajoute un evenement click sur chaque marker pour afficher le block d'information de la station 
    evenementMarker(marker,station){
     
        marker.addEventListener("click",function(){

            
            this.stationInfosElt.style.display="block";
            this.nomStationElt.textContent=station.name;
            
            let nomStationSplit= station.name;
            let nomStationTableau= nomStationSplit.split("-");
            this.nomStationElt.textContent=nomStationTableau[1];
            
            this.adresseStationElt.textContent=station.address;
            
           

            this.veloDisponibleElt.textContent="Vélo disponible: ";
            this.veloDisponibleElt.appendChild(this.couleur_velo_dispo(station.available_bikes));
            
            
            this.placeDisponibleElt.textContent="Stationnement disponible: "+station.available_bike_stands;
            
            this.statusElt.textContent=this.traductionStatus(station.status);
            this.statusElt.style.color=this.couleurStatus(station.status);
            this.statusElt.style.fontWeight="bold";
            
            sessionStorage.setItem("station",nomStationTableau[1]);
            sessionStorage.setItem("nbr_velo",station.available_bikes);
            sessionStorage.setItem("statut",this.statusElt.textContent);
            window.scrollTo(0,document.getElementsByTagName("body")[0].scrollHeight);
            console.log(sessionStorage);
                
        }.bind(this))
    }
    
    //creation d'un span qui contient le nombre de velo avec une couleur differente en fonction du nombre de velo
    couleur_velo_dispo(nbrVelo){
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
    
    //traduction du status de la station en français
    traductionStatus(status){
        
        let status_station=null;
        
        if(status === "OPEN"){
            status_station="Ouvert";
        }else{
            status_station="Fermé";
        }
        
        return status_station;
    }
    
    //Selectionne la couleur du status de la station    
    couleurStatus(status){
        
        let color ="green";
        
        if(status === "CLOSED"){
            color="red";
        }
        
        return color;
    }
    
}