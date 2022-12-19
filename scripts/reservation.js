class Reservation{
    
    constructor(temps_de_reservation){
        this.minutes=null;
        this.secondes=null;
        this.temps_de_reservation=temps_de_reservation;
        this.stationInfosElt=document.getElementById("station_infos"); 
        this.heure_fin_resersation=null;
        this.resume_confirmationElt=document.getElementById("resume_confirmation");
        this.compteurElt=document.getElementById("compteur");
        this.nom_client=document.getElementById("nom_client");
        this.prenomElt=document.getElementById("prenom");
        this.nomElt=document.getElementById("nom");
        this.station_reserveeElt=document.getElementById("station_reservee");
        this.annuler_reservationBtn=document.getElementById("annuler_reservation");
        this.fin_reservationElt=document.getElementById("fin_reservation");
        this.IntervalID=null;
        this.confirmerResersationBtn=document.getElementById("confirmer");
        this.confirmation();
        this.controleReservation();
        this.enregistrerNomClient();
        this.btnAnnuler();
    }

    controleReservation(){
        //Vérifie si il y a une réservation en cours après rechargement de la page
        if(sessionStorage.getItem("heure_fin_reservation")){
            this.reserver();
        }
    
    }

    confirmation(){ //evenement click sur le bouton pour valider la reservation

        this.confirmerResersationBtn.addEventListener("click",function(){
        
             if(newCanvas.signature === true){
                 if(Number(sessionStorage.getItem("nbr_velo")) >= 1 && sessionStorage.getItem("statut") === "Ouvert"){
                    if(sessionStorage.getItem("reservation")){
                        if(confirm("Voulez-vous annuler votre réservation actuelle?")){//confirmation si reservation en cours
                             this.fin_reservation();  
                             this.heure_fin_reservation= new Date().getTime()+this.temps_de_reservation;
                             sessionStorage.setItem("heure_fin_reservation",this.heure_fin_reservation);
                             this.reserver();
                        }
                    }else{
                         this.heure_fin_reservation= new Date().getTime()+this.temps_de_reservation;
                         sessionStorage.setItem("heure_fin_reservation",this.heure_fin_reservation);
                         this.reserver();
                     }

                 }else{
                        this.messageErreur("Impossible de réserver à cette station");
                 }
               
               
            }else{
                this.messageErreur("Vous devez signer avant de valider la réservation");
            }
        }.bind(this))
    }


    enregistrerNomClient(){
        this.prenomElt.addEventListener("input",function(){
            localStorage.setItem("prenom",this.prenomElt.value);
        }.bind(this))

        this.nomElt.addEventListener("input",function(){
            localStorage.setItem("nom",this.nomElt.value);
        }.bind(this))

        if(localStorage.getItem("prenom") && localStorage.getItem("nom")){
            this.prenomElt.value=localStorage.getItem("prenom");
            this.nomElt.value=localStorage.getItem("nom");
        }
        
    }

    messageErreur(message){
        let messageElt=document.getElementById("message");
        messageElt.textContent=message;
        messageElt.style.display="block";
        messageElt.style.color="red";
        setTimeout(function(){
            messageElt.style.display="none";
        },2000); 
    }


    reserver(){ //Lance la reservation du vélo
   
        sessionStorage.setItem("reservation",true);
        newCanvas.effacer_canvas();
        newCanvas.blocCanvas.style.display="none";
        this.stationInfosElt.style.display="none";
        this.resume_confirmationElt.style.display="block";
                        
        this.station_reserveeElt.textContent="Vous avez réservé à la station: "+sessionStorage.getItem("station");
        this.nom_client.textContent="Vélo reservé au nom de "+localStorage.getItem("prenom")+" "+localStorage.getItem("nom");

        this.compteurElt.textContent="";
          
        this.chrono();
         
    }

    btnAnnuler(){
        this.annuler_reservationBtn.addEventListener("click",this.fin_reservation.bind(this));
    }


    chrono(){ 
   
        this.IntervalID=setInterval(function(){
        let heure_debut_reservation=new Date();

        let time=Number(sessionStorage.getItem("heure_fin_reservation"))-heure_debut_reservation.getTime();
   
        this.minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        this.secondes = Math.floor((time % (1000 * 60)) / 1000);
     
        this.compteurElt.textContent="Temps restant pour récupérer le vélo avant annulation "+(this.minutes+" min "+this.secondes+" s");

        if(time < 0){
          this.fin_reservation();
        }  

        }.bind(this),1000)
          
   }

    fin_reservation(){
  
        clearInterval(this.IntervalID);
        sessionStorage.removeItem("heure_fin_reservation");
        
        sessionStorage.removeItem("reservation");
        
        this.resume_confirmationElt.style.display="none";
     
   }  
}



