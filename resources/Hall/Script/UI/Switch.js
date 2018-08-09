cc.Class({
    extends: cc.Component,

    properties: {
        switchSlider:cc.Slider,
        switchProgress:cc.ProgressBar
    },

    // use this for initialization
    onLoad: function () {
        this.updateSwitch();
          this.updateProgressBar();
    },
    updateSwitch(){
    	 if (this.switchSlider && this.switchProgress) {
    	 	
    	 	this.switchProgress.progress = this.switchSlider.progress;
    	 	
    	 	 if(this.switchSlider.progress>=0.3){
    	 		this.switchSlider.progress = 1
    	 		this.switchProgress.progress = this.switchSlider.progress;
    	 	 
    	 	}else{
    	 	    this.switchSlider.progress = 0;
    	 	    this.switchProgress.progress = this.switchSlider.progress;
    	 	    
    	 	} 
    	 		
             
           
    }
   },
   updateProgressBar() {
        if (this.switchSlider && this.switchProgress) {
            this.switchProgress.progress = this.switchSlider.progress;
        }
         
    },
    
});
