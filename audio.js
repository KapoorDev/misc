var player = $('#audio')[0];

var playState = false;

var percentage;
var bufferedPercentage;
var currentSong = 0;

var volume;
var muted = false;

var btn_PLAY;
var btn_MUTE;

// could be via ajax
var playList = [
  [
   "Last Trail",
   "Stan Williams",
    "https://archive.org/download/StanWilliamsLastTrail/StanWilliamsLastTrail.mp3"
  ],
  [
   "Suckerpunch",
   "MDK",
   "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=54e6caf2d1028a1fb14f60032f520262&id=2041891725&stream=1&ts=1391748967.0"
  ],
  [
   "Jelly Castle",
   "MDK",
   "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=04886228b11fd150d9400439878a7624&id=2597796554&stream=1&ts=1391748967.0"
  ],
  [
   "So what",
   "Pegboard Nerd", "http://popplers5.bandcamp.com/download/track?enc=mp3-128&fsig=691a0b7027616bdf7ddca083089b927a&id=2048317149&stream=1&ts=1395945959.0&nl=1"
  ]
];

player.volume = .5;

function playSong(songId) {
  if(songId) {
    player.src = playList[songId][2];
  } else {
    nextSong();
  }
  player.play();
}

function pauseSong() {
  playState = false;
  player.pause();
}

function switchPlayState(btn) {
  if(player.src == "") player.src = playList[currentSong][2];
  btn_PLAY = btn != undefined ? btn : btn_PLAY;
  if(playState) {
    $(btn_PLAY).addClass('paused');
    $(btn_PLAY).removeClass('playing');
    player.pause();
    playState = 0;
  } else {
    $(btn_PLAY).addClass('playing');
    $(btn_PLAY).removeClass('paused');
    player.play();
    playState++;
  }
}

function nextSong() {
  currentSong++;
  if(currentSong > playList.length-1) currentSong = 0;
  player.src = playList[currentSong][2];
  playSong();
}

function previousSong() {
  currentSong--;
  if(currentSong < 0) currentSong = playList.length-1;
  player.src = playList[currentSong][2];
  playSong();
}

$(player).on('timeupdate', function() {
  percentage = (player.currentTime / player.duration) * 100;
  //console.log(percentage);
  $('.progress-bar.music-progress').css('left', percentage+"%");
  if(percentage >= 100) {
    $('.progress-bar.music-progress').css('left', 0);
    $(btn_PLAY).addClass('paused');
    $(btn_PLAY).removeClass('playing');
    playState = false;
  }
  updateDetails(false);
});

$(player).on('progress', function() {
  bufferedPercentage = (player.buffered.end(0) / player.duration) * 100;
  bufferedPercentage = bufferedPercentage < 50 ? bufferedPercentage - percentage : bufferedPercentage;
  //console.log(bufferedPercentage);
  $('.progress-bar.music-buffered').css('left', bufferedPercentage+"%");
});

$(player).on('ended', function() {
 nextSong(); 
});

$(player).on('durationchange', function() {
  updateDetails(true);
});

$(player).on('play', function() {
  $(btn_PLAY).addClass('playing');
  $(btn_PLAY).removeClass('paused');
  playState = true;
});

function resetButtons() {
  $('.progress-bar.music-music').css('left', 0);
  $('.progress-bar.music-buffered').css('left', 0);
}

function switchVol(btn) {
  btn_MUTE = btn;
  if(muted) {
    muted = false;
    player.volume = volume;
    $('.mute-button').addClass('vol-big');
    $('.mute-button').removeClass('vol-low');
  } else {
    muted = true;
    volume = player.volume;
    $('.mute-button').addClass('vol-low');
    $('.mute-button').removeClass('vol-big');
    player.volume = 0;
  }
}

function convertToTime(input) {
  var totalSec = input;
  var minutes = parseInt( totalSec / 60 ) % 60;
  var seconds = parseInt(totalSec % 60) + 00;
  return((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds));
}

function updateDetails(animate) {
  if(animate) $('.song-details>h3,.song-details>p').css("opacity", 0);
  $('.song-details>h3').html("<span style=\"opacity: .3;\">#"+(currentSong+1)+"</span> "+playList[currentSong][0]);
    $('.song-details>p.song-length').html("<span class=\"full-length\">"+convertToTime(player.duration)+"</span> <span class=\"current-length\">"+convertToTime(player.currentTime)+"</span>");
    $('.song-details>p.song-artist').html("by <a href=\"www.google.de/#q="+playList[currentSong][1]+"\">"+playList[currentSong][1]+"</a>");
  
    if(animate) $('.song-details>h3,.song-details>p').animate({
      opacity: 1
    }, 750);
}

$('#music-volume').change(function() {
    $('#music-vol-value').show();
    player.volume = $(this).val() / 1000;
    $('#music-vol-value').html(parseInt(player.volume*100)+"%");
});

$('#music-volume').mouseup(function() {
    $('#music-vol-value').html(parseInt(player.volume*100)+"%").delay(1000).fadeOut();
});

function togglePlaylist() {
  viewPlaylist();
}

function viewPlaylist() {
  $.each(playList, function(i, playListItem) {
    $('.player-playlist').append('<li onclick="playSong('+i+');"><span class="playlist-artist">'+playListItem[1]+'</span> &ndash; <span class="playlist-title">'+playListItem[0]+'</span></li>');
  });
}
