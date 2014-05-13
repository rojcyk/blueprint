$ ->
  @iphone   = $(".iphone")
  @p   = $("p")
  @rotate = $(".rotate")
	
  TweenLite.to(@iphone, 2,
    	strokeDashoffset: 0
    	opacity: 0.7
    	ease: Power4.easeIn)
    	
  TweenLite.to("h1", 1.4,
    opacity: 1
    paddingTop: 0
    delay:2
    ease: Power4.easeOut)
    
  TweenLite.to(".screen", 2,
	  opacity: 1
	  delay: 3
	  ease: Power4.easeOut)
	  
  TweenLite.to(@iphone, 1.2,
    opacity: 0.4
    delay: 2.2
    ease: Power4.easeIn)
    
  TweenLite.to(@p, 1.4,
    opacity: 1
    paddingTop: 0
    delay:2.4
    ease: Power4.easeOut)
    
  TweenMax.to(".symbol", 2,
    rotation:"360deg"
    transformOrigin:"50% 126"
    repeat: -1
    ease: Linear.easeNone)
	
  TweenLite.to(".button", 1.4,
	  opacity: 1
	  delay: 2.4
	  ease: Power4.easeOut)