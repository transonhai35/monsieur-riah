

$ = document.querySelector.bind(document)
$$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY =  'MONSIEUR-RIAH_PLAYER'

const playlist = $('.playlist');
const nameSong = $('.name_song');
const audio = $('#audio')
const cdImg = $('.cd-img');
const toggleBtn = $('.control_wrap')
const progress = $('#progress')
const cd = $('.cd');
const nextBtn = $('.control_next')
const prevBtn = $('.control_prev')
const randomSong = $('.control_random')
const repeatBtn = $('.control_undo')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig:function(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs:[
        {
            name:'Mùa hè của em',
            singer:'Vũ',
            path:'./assets/music/song1.mp3',
            image:'./assets/img/song1.png'
        },
        {
            name:'Đi qua mùa hạ',
            singer:'Thai Dinh',
            path:'./assets/music/song2.mp3',
            image:'./assets/img/song2.jpg'
        },
        {
            name:'Vi Me Anh Bat Chia Tay',
            singer:'krik ft miu lê',
            path:'./assets/music/song3.mp3',
            image:'./assets/img/song3.jpg'
        },
        {
            name:'Chạy khỏi thế giới này',
            singer:'dalab ft phương ly',
            path:'./assets/music/song4.mp3',
            image:'./assets/img/song4.jpg'
        },
        {
            name:'Hai mươi hai',
            singer:'Amee',
            path:'./assets/music/song5.mp3',
            image:'./assets/img/song5.png'
        },
    ],
    render: function() {
         const htmls = this.songs.map((song,index) => {
            return `
                <div class="playlist_song ${index === this.currentIndex ? 'active': ''}" data-index="${index}"> 
                    <div class="song_img"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="playlist_name">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="song_option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>    
            `
         })
         playlist.innerHTML = htmls.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this,'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },


    handleEvents: function() {

        const cdWidth = cd.offsetWidth;

        //xử lý cd quay / dừng
        cdAnimate = cdImg.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 200000,
            interation: Infinity
        })
        cdAnimate.pause()

        //Xử lí phóng to/ thu nhỏ cd
        document.onscroll = function () {
            const Scrolltop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - Scrolltop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth; 

        }

        //Xử lí khi click play 
        toggleBtn.onclick = function() {
            if(app.isPlaying) {
                audio.pause();
            }
            else{
                audio.play();
            }
        }
            //khi song được play
            audio.onplay = function(){
                app.isPlaying = true;
                toggleBtn.classList.add('play');
                cdAnimate.play();
            };

            //khi song bị pause
            audio.onpause = function(){
            app.isPlaying = false;
            toggleBtn.classList.remove('play');
            cdAnimate.pause();
            };
        
            //khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function(){
              if (audio.duration){

                  const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                  progress.value = progressPercent;
              }
            };
        
            // xử lý khi tua
            progress.onchange = function(e){
                const seekTime = audio.duration / 100 * e.target.value ;
                audio.currentTime = seekTime;
            };

            //khi next bài hát
            nextBtn.onclick = function(){
                if(app.isRandom){
                    app.playRandomSong();
                }else{
                app.nextSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            };

            //khi prev bài hát
            prevBtn.onclick = function(){
                if(app.isRandom){
                    app.playRandomSong();
                }
                else{
                app.prevSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            };

            //randomSong
            randomSong.onclick = function(){
                app.isRandom = !app.isRandom;
                app.setConfig('isRandom',app.isRandom); 
                randomSong.classList.toggle ('active',app.isRandom);
            };

            //repeatSong
            repeatBtn.onclick = function(){
                app.isRepeat = !app.isRepeat;
                app.setConfig('isRepeat',app.isRepeat); 
                repeatBtn.classList.toggle ('active',app.isRepeat);
            };

            //khi audio ended
            audio.onended = function(){
                if (app.isRepeat) {
                    audio.play();
                }
                else{

                    nextBtn.click() 
                }
            };

            //click vao play list
            playlist.onclick = function(e){
                const songNote = e.target.closest('.playlist_song:not(.active)');
                
                if (songNote || e.target.closest('.song_option')){
                    //xu li khi click song
                    if(songNote){
                        app.currentIndex = Number(songNote.dataset.index);
                        app.loadCurrentSong();
                        audio.play();
                        app.render();
                    }
                }
            };
        },
        scrollToActiveSong: function() {
            if(app.currentIndex === 0 || 1) {
                setTimeout(()=> {
                    $('.playlist_song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                })
            }, 500)
            }
            else{ 
            setTimeout(()=> {
                    $('.playlist_song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }, 500)
        }
        },

    loadCurrentSong: function() {
        const heading = $('.name_song');
        const cdThumb = $('.cd-img');

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },
    loadConfig:function() {  
        this.isRandom = this.config.isRandom;
        this.isRandom = this.config.isRepeat;
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
        if (this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function (){
        
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        //gán cấu hình từ confgig vào ứng dụng
        this.loadConfig();
        // hiển thị trạng thái ban đầu
        // $('.control_random').classList.toggle('active',this.randomMusic)
        // $('.control_undo').classList.toggle('active',this.undoMusic)
        
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //lắng nghe / xử lí các sự kiện
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist
        this.render();

        

    }
    
}

app.start()