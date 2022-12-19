class Carousel{

    constructor(temps){
      this.controle=document.getElementById("play");
      this.suivant=document.getElementById("next");
      this.precedent=document.getElementById("prev");
      this.images_container=document.getElementsByClassName("slide");
      this.slideIndex=0;
      this.temps=temps;
      this.statut=true;
      this.interval_slide=setInterval(this.showSlidesAuto.bind(this),this.temps);
      this.showSlidesAuto();
      this.link_control();
    }

    showSlidesAuto() {
    
      for (let i = 0; i < this.images_container.length; i++){
        this.images_container[i].style.display = "none";
      }
      
      this.slideIndex++;
      if (this.slideIndex > this.images_container.length) {this.slideIndex = 1}
      this.images_container[this.slideIndex-1].style.display = "block";
    }
    
    slide_control(n){
  
      if (n > this.images_container.length) {this.slideIndex = 1}
      if (n < 1) {this.slideIndex = this.images_container.length}
      for (let i = 0; i < this.images_container.length; i++) {
        this.images_container[i].style.display = "none";
      }
    
      this.images_container[this.slideIndex-1].style.display = "block";
    
    }
  
    link_control(){  
      document.addEventListener("keyup",function(e){
  
        if(e.code === "ArrowLeft"){
            this.slide_control(this.slideIndex-=1);
        }else if(e.code === "ArrowRight"){
            this.slide_control(this.slideIndex+=1);
        }
  
      }.bind(this))
  
  
      this.suivant.addEventListener("click",function(){
        this.slide_control(this.slideIndex+=1);
      }.bind(this))
      
      this.precedent.addEventListener("click",function(){
        this.slide_control(this.slideIndex-=1);
      }.bind(this))
      
      this.controle.addEventListener("click",function(){
  
        let imgElt=document.createElement("img");
  
        if(this.statut){
          clearInterval(this.interval_slide)
          this.statut=false;
          imgElt.src="images/play.png";
          imgElt.alt="lecture";
        }else{
          this.interval_slide=setInterval(this.showSlidesAuto.bind(this),this.temps);
          this.statut=true;
          imgElt.src="images/pause.png";
          imgElt.alt="pause";
        }
  
        this.controle.textContent="";
        this.controle.appendChild(imgElt);
        
      }.bind(this))
    }
  }