const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const playlist = $('.playlist')
const cd = $('.cd');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: 'Counting Stars',
      singer: 'OneRepublic',
      path: './assests/music/Counting Stars - OneRepublic.mp3',
      image: './assests/img/countingStars.jpg'
    },
    {
      name: 'Dành cho em',
      singer: 'Hòang Tôn',
      path: './assests/music/Danh Cho Em - Hoang Ton.mp3',
      image: './assests/img/DanhChoEm.jpg'
    },
    {
      name: 'Thunder',
      singer: 'Imagine Dragons',
      path: './assests/music/Thunder - Imagine Dragons.mp3',
      image: './assests/img/thunder.jpg'
    },
    {
      name: 'TutuCover',
      singer: 'Camilo PedroCapo',
      path: './assests/music/TutuCamiloPedroCapoCover-AlmaZarza-7057941.mp3',
      image: './assests/img/tutu.jpg'
    },
    {
      name: 'Khuất lối',
      singer: 'Orinn Remix',
      path: './assests/music/KhuatLoiOrinnRemix-HKray-8497598.mp3',
      image: './assests/img/khuatLoi.jpg'
    },
    {
      name: 'Rude',
      singer: 'Magic',
      path: './assests/music/Rude - Magic_.mp3',
      image: './assests/img/rude.jpg'
    },
    {
      name: 'Cool For The Summer',
      singer: 'Demi Lovato',
      path: './assests/music/Cool For The Summer - Demi Lovato.mp3',
      image: './assests/img/coolforsummer.jpg'
    },
    {
      name: 'Nevada',
      singer: 'Vicetone',
      path: './assests/music/Nevada - Vicetone_ Cozi Zuehlsdorff.mp3',
      image: './assests/img/Nevada.jpg'
    },
    {
      name: 'Everything I Need',
      singer: 'Skylar Grey',
      path: './assests/music/Everything I Need - Skylar Grey.mp3',
      image: './assests/img/everythingINeed.jpg'
    },
    {
      name: 'Lắng nghe mùa xuân về',
      singer: 'Hồng Nhung, Bằng Kiều',
      path: './assests/music/Lang Nghe Mua Xuan Ve - Hong Nhung_ Bang.mp3',
      image: './assests/img/LangNgheMuaXuanVe.jpg'
    },
    {
      name: 'Chuyện cũ bỏ qua',
      singer: 'Remix',
      path: './assests/music/Chuyen Cu Bo Qua Remix_ - Duyn203_ HuyLe.mp3',
      image: './assests/img/ChuyenCuMinhBoQua.jpg'
    },
    {
      name: 'Kì vọng sai lầm',
      singer: 'Tăng Phúc',
      path: './assests/music/KyVongSaiLam-TangPhucNguyenDinhVuYunoBigBoi-7976473.mp3',
      image: './assests/img/KiVongSaiLam.jpg'
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index='${index}'>
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    });
    playlist.innerHTML = htmls.join('');
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lí CD quay CD và dừng CD
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause();

    // Xử lí, phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    // Xử lí khi click play nhạc 
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        _this.isPlaying = false;
        audio.pause();
        player.classList.remove('playing');
        cdThumbAnimate.pause();
      } else {
        _this.isPlaying = true;
        audio.play();
        player.classList.add('playing');
        cdThumbAnimate.play();
      }
    }

    // Khi tiến độ bài hát thay đổi 
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const currentProgress = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = currentProgress;
      }
    }

    // Xử lí khi tua song 
    progress.onchange = function (e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }

    // Xử lí khi next song 
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      player.classList.add('playing');
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    // Xử lí khi prev song 
    prevBtn.onclick = function (e) {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      player.classList.add('playing');
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }

    // Xử lí khi bật random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle('active', _this.isRandom) //isRandom true thì add class active
    }

    // Xử lí phát lặp lại một bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle('active', _this.isRepeat) //isRandom true thì add class active

    }

    // Xử lí next song khi phát hết bài
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click();
      }
    }

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest('.option')) {
        // Xử lí khi các click vào song 
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong();
          _this.render();
          audio.play();
          player.classList.add('playing');
          cdThumbAnimate.play();
        }

        // Xử lí khi click vào option song
        if (e.target.closest('.option')) {

        }
      }
    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 300)
  },
  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Định nghĩa các thuộc tính cho Object 
    this.defineProperties()

    // Lắng nghe / xử lí các sự kiện DOM
    this.handleEvent()

    // Tải thông tin bài hát đầu tiên lên UI
    this.loadCurrentSong()

    // Render playlist
    this.render()
  }
}

app.start();
