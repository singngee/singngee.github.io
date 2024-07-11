document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const container = document.getElementById('game-container');
    const popup = document.getElementById('game-over-popup');
    const popupDefault = document.getElementById('game-over-popup-default');
    const finalScoreElement = document.getElementById('final-score');
    const finalScoreElementDefault = document.getElementById('final-score-default');
    const playAgainButton = document.getElementById('play-again');
    const playAgainButtonDefault = document.getElementById('play-again-default');
    const returnHomeButton = document.getElementById('return-home');
    const returnHomeButtonDefault = document.getElementById('return-home-default');

    returnHomeButton.addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });

    returnHomeButtonDefault.addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });


    let gameEnded = false;

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        container.classList.remove('hidden');
        startGame();
    }, 1920); // timing of animation = css tmgs.

    playAgainButton.addEventListener('click', () => {
        window.location.reload();
    });

    playAgainButtonDefault.addEventListener('click', () => {
        window.location.reload();
    });

   

    function startGame() {
        container.innerHTML = `
            <h1>Save uncle's breakfast from disaster!</h1>
            <div id="gameArea" class="interactive-content">
                <img id="catcher" src="static/cursor.png" alt="Catcher">
            </div>
            <p>Score: <span id="score">0</span></p>
            <div id="lives" class="lives">
                <span class="heart">❤️</span>
                <span class="heart">❤️</span>
                <span class="heart">❤️</span>
            </div>
        `;
        let score = 0;
        let lives = 3;

        const gameArea = document.getElementById('gameArea');
        const catcher = document.getElementById('catcher');

        // images inside gameImgs 
        const images = [
            'kayatoast.png',
            'egg.png',
            'kopi.png',
            'tea.png',
        ];

        function getRandomImage() {
            const randomIndex = Math.floor(Math.random() * images.length);
            return `static/gameImgs/${images[randomIndex]}`;
        }

        const fallingItems = [];
        let fallSpeed = 200; // initial speed of game

        function createFallingItem() {
            if (fallingItems.length < 3 && !gameEnded) {
                const item = document.createElement('img');
                item.src = getRandomImage();
                item.classList.add('falling-item');
                gameArea.appendChild(item);
                fallingItems.push(item);

                item.style.position = 'absolute';
                item.style.left = `${Math.random() * 80}%`;
                item.style.top = '0px';

                let interval = setInterval(() => {
                    if (gameEnded) {
                        clearInterval(interval);
                        return;
                    }

                    item.style.top = `${parseInt(item.style.top) + 40}px`;

                    const itemRect = item.getBoundingClientRect();
                    const catcherRect = catcher.getBoundingClientRect();

                    if (
                        itemRect.bottom >= catcherRect.top &&
                        itemRect.top <= catcherRect.bottom &&
                        itemRect.right >= catcherRect.left &&
                        itemRect.left <= catcherRect.right
                    ) {
                        score += 1;
                        document.getElementById('score').innerText = score;
                        item.src = getRandomImage();
                        item.style.left = `${Math.random() * 80}%`;
                        item.style.top = '0px';
                    }

                    if (parseInt(item.style.top) > gameArea.clientHeight) {
                        clearInterval(interval);
                        gameArea.removeChild(item);
                        fallingItems.splice(fallingItems.indexOf(item), 1);
                        lives -= 1;
                        updateLivesDisplay();

                        if (lives === 0) {
                            gameEnded = true;
                            if (score >= 30) {
                                finalScoreElement.innerText = score;
                                popup.classList.remove('hidden');
                            } else {
                                finalScoreElementDefault.innerText = score;
                                popupDefault.classList.remove('hidden');
                            }
                        }
                    }
                }, fallSpeed);

                gameArea.addEventListener('mousemove', (event) => {
                    const rect = gameArea.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    catcher.style.left = `${x - catcher.offsetWidth / 2}px`;
                });
            }
        }

        function updateLivesDisplay() {
            const livesContainer = document.getElementById('lives');
            livesContainer.innerHTML = '';
            for (let i = 0; i < lives; i++) {
                livesContainer.innerHTML += '<span class="heart">❤️</span>';
            }
        }

        setInterval(() => {
            if (fallSpeed > 50) {
                fallSpeed -= 10; // falling speed 
            }
        }, 5000); // interval duration

        setInterval(createFallingItem, 1000); // item every second
    }
});

