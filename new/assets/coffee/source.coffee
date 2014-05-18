$ ->
  @iphone   = $(".iphone")
  @view     = $(".view")
  @p        = $(".fadeIn")
  @share    = $(".share")

  runDrawing = =>
    TweenLite.to(@iphone, 1.2,
      strokeDashoffset: 0
      opacity: 0.4
      ease: Power4.easeIn)

    TweenLite.to(".view", 2,
      opacity: 1
      delay: 1.1
      ease: Power4.easeOut)

    TweenLite.to(@iphone, 1.2,
      opacity: 0.2
      delay: 1
      ease: Power4.easeOut)

    TweenLite.to("h1", 1.5,
      opacity: 1
      paddingTop: 1
      delay: 1.5
      ease: Power4.easeOut)

    TweenLite.to(@p, 0.4,
      opacity: 1
      delay: 1.7
      ease: Power4.easeIn)

    TweenLite.to(@share, 0.4,
      opacity: 1
      delay: 1.7
      ease: Power4.easeIn)

  w = $(window).width();

  if w >= 704
    runDrawing()

  $(window).on resize: ->
    runDrawing()