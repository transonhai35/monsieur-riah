

$ = document.querySelector.bind(document)
$$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playlist = $('.playlist');
const nameSong = $('.name_song');
const audio = $('#audio')
const cdImg = $('.cd-img');
const toggleBtn = $('.control_wrap')
const progress = $('#progress')
const cd = $('.cd');
const nextSong = $('.control_next')
const prevSong = $('.control_prev')
const randomSong = $('.control_random')
const undoSong = $('.control_undo')


const app = {
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
        }
    ],
    render: function() {
         const htmls = this.songs.map(song => {
            return `
                <div class="song"> 
                    <div class="thumb"
                        style="background-image: url('${song.image}')>
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
         })
         $('.playlist').innerHTML = htmls.join('')
    },

    start: function() {
        this.render();
    }
    
}

app.start()