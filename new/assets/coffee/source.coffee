$ ->    
  @iphone   = $(".iphone")
  @view     = $(".view")
  @p        = $(".fadeIn")

  runDrawing = =>
    TweenLite.to(@iphone, 1.2,
      strokeDashoffset: 0
      opacity: 0.6
      ease: Power4.easeIn)
        
    TweenLite.to("h1", 1.4,
      opacity: 1
      paddingTop: 1
      delay: 1.6
      ease: Power4.easeOut)
      
    TweenLite.to(".view", 2,
      opacity: 1
      delay: 1.6
      ease: Power4.easeOut)
      
    TweenLite.to(@iphone, 0.8,
      opacity: 0.2
      delay: 1.2
      ease: Power4.easeIn)
      
    TweenLite.to(@p, 0.8,
      opacity: 1
      delay: 1.2
      ease: Power4.easeIn)
  
  w = $(window).width();
  
  if w >= 704
    runDrawing()
  
  $(window).on resize: ->
    runDrawing()