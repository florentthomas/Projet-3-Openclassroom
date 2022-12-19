class Canvas{
    
    constructor(){
        this.canvasElt=document.getElementById("canvas");
        this.confirmerResersationBtn=document.getElementById("confirmer");
        this.effacerCanvasBtn=document.getElementById("annuler");
        this.stationInfosElt=document.getElementById("station_infos");   
        this.formElt=document.querySelector("form");    
        this.blocCanvas=document.getElementById("signature"); 
        this.started=false;
        this.ctx=this.canvasElt.getContext("2d");
        this.lastX=null;
        this.lastY=null;
        this.signature=false;
        this.afficherCanvas();
    }

    afficherCanvas(){ //Evenement click sur le bouton pour afficher le canvas
        this.formElt.addEventListener("submit",function(e){
            e.preventDefault();
            
                this.blocCanvas.style.display="block";
                window.scrollTo(0,document.getElementsByTagName("body")[0].scrollHeight);
                this.controleCanvas();
            
        }.bind(this))
    }
    
    controleCanvas(){ // differents evenements lié à la souris dans le canvas
      
        this.canvasElt.addEventListener("mousedown",function(e){

            this.started=true;
            this.drawCanvas(e.pageX -this.canvasElt.offsetLeft,e.pageY -this.canvasElt.offsetTop,false);
        }.bind(this))


        this.canvasElt.addEventListener("mousemove",function(e){

            if(this.started){
                this.drawCanvas(e.pageX -this.canvasElt.offsetLeft,e.pageY -this.canvasElt.offsetTop,true);        
            }
        }.bind(this))


        this.canvasElt.addEventListener("mouseleave",function(e){
            this.started=false;
        }.bind(this))


        this.canvasElt.addEventListener("mouseup",function(e){
            this.started=false;
        }.bind(this))

        this.canvasElt.addEventListener("touchstart",function(e){
            e.preventDefault();
            this.started=true;
            this.drawCanvas(e.touches[0].pageX -this.canvasElt.offsetLeft,e.touches[0].pageY -this.canvasElt.offsetTop,false);
        }.bind(this))

        this.canvasElt.addEventListener("touchmove",function(e){
            e.preventDefault();
            if(this.started){
                this.drawCanvas(e.touches[0].pageX -this.canvasElt.offsetLeft,e.touches[0].pageY -this.canvasElt.offsetTop,true);        
            }
        }.bind(this))


        this.canvasElt.addEventListener("touchend",function(e){
            e.preventDefault();
            this.started=false;
        }.bind(this))


        this.effacerCanvasBtn.addEventListener("click",function(e){
            this.effacer_canvas();
        }.bind(this))



    }

    drawCanvas(x,y,start){ //methode pour dessiner dans le canvas
       
            if (start) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#000000";
                this.ctx.lineWidth = 3;
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(x, y);
                this.ctx.closePath();
                this.ctx.stroke();
                this.signature=true;
            }
            this.lastX = x; this.lastY = y;
        
    }
    
    effacer_canvas(){
        this.ctx.clearRect(0,0,300,150);
        this.signature=false;
    }    
}
                                                             
                                                             


