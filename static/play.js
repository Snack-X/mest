(function() {
  let $player;

  function resizeVideo() {
    let width = $(window).width();
    let height = $(window).height();

    let playerWidth = width;
    let playerHeight = height;

    if(width / 16 * 9 > height) {
      playerWidth = height / 9 * 16;
    }
    else {
      playerHeight = width / 16 * 9;
    }

    $player.width(playerWidth);
    $player.height(playerHeight);
    $player.css("margin-top", (height - playerHeight) / 2);
  }

  function onLoad() {
    $player = $(".player-inner");
    $(window).resize(resizeVideo);
    resizeVideo();
  }

  $(onLoad);
})();
