<script setup>
import { ref, computed, onUnmounted } from 'vue'

const activeGame = ref(null) // null, 'memory', 'quiz', 'tictactoe'

// ==================== MEMORY GAME ====================
const memoryCards = ref([])
const memoryFlipped = ref([])
const memoryMatched = ref([])
const memoryMoves = ref(0)
const memoryGameWon = ref(false)

const memoryEmojis = ['🎓', '📚', '✏️', '💡', '🎯', '🏆', '⭐', '🚀']

const initMemoryGame = () => {
  const cards = [...memoryEmojis, ...memoryEmojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, flipped: false }))
  
  memoryCards.value = cards
  memoryFlipped.value = []
  memoryMatched.value = []
  memoryMoves.value = 0
  memoryGameWon.value = false
}

const flipCard = (card) => {
  if (memoryFlipped.value.length === 2) return
  if (memoryFlipped.value.includes(card.id)) return
  if (memoryMatched.value.includes(card.id)) return
  
  memoryFlipped.value.push(card.id)
  
  if (memoryFlipped.value.length === 2) {
    memoryMoves.value++
    const [first, second] = memoryFlipped.value
    const firstCard = memoryCards.value.find(c => c.id === first)
    const secondCard = memoryCards.value.find(c => c.id === second)
    
    if (firstCard.emoji === secondCard.emoji) {
      memoryMatched.value.push(first, second)
      memoryFlipped.value = []
      
      if (memoryMatched.value.length === memoryCards.value.length) {
        memoryGameWon.value = true
      }
    } else {
      setTimeout(() => {
        memoryFlipped.value = []
      }, 1000)
    }
  }
}

const isCardFlipped = (cardId) => {
  return memoryFlipped.value.includes(cardId) || memoryMatched.value.includes(cardId)
}

// ==================== QUIZ GAME ====================
const quizQuestions = [
  {
    question: 'Apa kepanjangan dari BAB dalam skripsi?',
    options: ['Bagian Akhir Buku', 'Bab Adalah Bab', 'Tidak Ada', 'Bab saja'],
    answer: 2
  },
  {
    question: 'Berapa minimal halaman untuk skripsi S1 umumnya?',
    options: ['20 halaman', '40 halaman', '60 halaman', 'Tergantung kampus'],
    answer: 3
  },
  {
    question: 'Apa yang harus ada di BAB 1?',
    options: ['Hasil penelitian', 'Latar belakang', 'Kesimpulan', 'Daftar pustaka'],
    answer: 1
  },
  {
    question: 'Teknik fokus dengan interval 25 menit disebut?',
    options: ['Tomato Timer', 'Pomodoro', 'Focus Mode', 'Deep Work'],
    answer: 1
  },
  {
    question: 'Apa yang sebaiknya dilakukan sebelum bimbingan?',
    options: ['Tidur', 'Main game', 'Siapkan materi', 'Tidak ada'],
    answer: 2
  }
]

const quizCurrentIndex = ref(0)
const quizScore = ref(0)
const quizAnswered = ref(false)
const quizSelectedAnswer = ref(null)
const quizFinished = ref(false)

const initQuizGame = () => {
  quizCurrentIndex.value = 0
  quizScore.value = 0
  quizAnswered.value = false
  quizSelectedAnswer.value = null
  quizFinished.value = false
}

const currentQuestion = computed(() => quizQuestions[quizCurrentIndex.value])

const selectQuizAnswer = (index) => {
  if (quizAnswered.value) return
  quizSelectedAnswer.value = index
  quizAnswered.value = true
  
  if (index === currentQuestion.value.answer) {
    quizScore.value++
  }
}

const nextQuestion = () => {
  if (quizCurrentIndex.value < quizQuestions.length - 1) {
    quizCurrentIndex.value++
    quizAnswered.value = false
    quizSelectedAnswer.value = null
  } else {
    quizFinished.value = true
  }
}

// ==================== TIC TAC TOE ====================
const tttBoard = ref(Array(9).fill(null))
const tttCurrentPlayer = ref('X')
const tttWinner = ref(null)
const tttPlayerScore = ref(0)
const tttComputerScore = ref(0)

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
]

const initTTTGame = () => {
  tttBoard.value = Array(9).fill(null)
  tttCurrentPlayer.value = 'X'
  tttWinner.value = null
}

const checkWinner = (board) => {
  for (const combo of winningCombos) {
    const [a, b, c] = combo
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  return board.every(cell => cell !== null) ? 'draw' : null
}

const makeMove = (index) => {
  if (tttBoard.value[index] || tttWinner.value) return
  
  tttBoard.value[index] = 'X'
  tttWinner.value = checkWinner(tttBoard.value)
  
  if (tttWinner.value === 'X') {
    tttPlayerScore.value++
    return
  }
  
  if (!tttWinner.value) {
    // Computer move
    setTimeout(() => {
      computerMove()
    }, 500)
  }
}

const computerMove = () => {
  const emptyIndexes = tttBoard.value
    .map((cell, index) => cell === null ? index : null)
    .filter(index => index !== null)
  
  if (emptyIndexes.length > 0) {
    const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
    tttBoard.value[randomIndex] = 'O'
    tttWinner.value = checkWinner(tttBoard.value)
    
    if (tttWinner.value === 'O') {
      tttComputerScore.value++
    }
  }
}

// Game selection
const selectGame = (game) => {
  activeGame.value = game
  if (game === 'memory') initMemoryGame()
  if (game === 'quiz') initQuizGame()
  if (game === 'tictactoe') initTTTGame()
}

const backToMenu = () => {
  activeGame.value = null
}
</script>

<template>
  <div class="games-page">
    <!-- Game Menu -->
    <div v-if="!activeGame" class="games-menu">
      <div class="page-header">
        <h2>Mini Games 🎮</h2>
        <p>Istirahat sejenak dengan permainan ringan</p>
      </div>
      
      <div class="games-grid">
        <div class="game-card" @click="selectGame('memory')">
          <div class="game-icon">🧠</div>
          <h3>Memory Match</h3>
          <p>Latih memorimu dengan mencocokkan kartu</p>
        </div>
        
        <div class="game-card" @click="selectGame('quiz')">
          <div class="game-icon">❓</div>
          <h3>Quiz Time</h3>
          <p>Quiz ringan seputar skripsi</p>
        </div>
        
        <div class="game-card" @click="selectGame('tictactoe')">
          <div class="game-icon">⭕</div>
          <h3>Tic Tac Toe</h3>
          <p>Permainan klasik melawan komputer</p>
        </div>
      </div>
    </div>

    <!-- Memory Game -->
    <div v-if="activeGame === 'memory'" class="game-container">
      <div class="game-header">
        <button class="back-btn" @click="backToMenu">← Kembali</button>
        <h2>🧠 Memory Match</h2>
        <div class="game-stats">
          <span>Moves: {{ memoryMoves }}</span>
          <span>Matched: {{ memoryMatched.length / 2 }}/8</span>
        </div>
      </div>
      
      <div class="memory-grid">
        <div 
          v-for="card in memoryCards" 
          :key="card.id"
          :class="['memory-card', { flipped: isCardFlipped(card.id), matched: memoryMatched.includes(card.id) }]"
          @click="flipCard(card)"
        >
          <div class="card-front">?</div>
          <div class="card-back">{{ card.emoji }}</div>
        </div>
      </div>
      
      <div v-if="memoryGameWon" class="game-result">
        <h3>🎉 Selamat!</h3>
        <p>Kamu menyelesaikan dalam {{ memoryMoves }} langkah</p>
        <button class="play-again-btn" @click="initMemoryGame">Main Lagi</button>
      </div>
    </div>

    <!-- Quiz Game -->
    <div v-if="activeGame === 'quiz'" class="game-container">
      <div class="game-header">
        <button class="back-btn" @click="backToMenu">← Kembali</button>
        <h2>❓ Quiz Time</h2>
        <div class="game-stats">
          <span>{{ quizCurrentIndex + 1 }}/{{ quizQuestions.length }}</span>
          <span>Score: {{ quizScore }}</span>
        </div>
      </div>
      
      <div v-if="!quizFinished" class="quiz-container">
        <div class="quiz-question">
          <h3>{{ currentQuestion.question }}</h3>
        </div>
        
        <div class="quiz-options">
          <button 
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :class="[
              'quiz-option',
              { 
                selected: quizSelectedAnswer === index,
                correct: quizAnswered && index === currentQuestion.answer,
                wrong: quizAnswered && quizSelectedAnswer === index && index !== currentQuestion.answer
              }
            ]"
            @click="selectQuizAnswer(index)"
          >
            {{ option }}
          </button>
        </div>
        
        <button 
          v-if="quizAnswered"
          class="next-btn"
          @click="nextQuestion"
        >
          {{ quizCurrentIndex < quizQuestions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil' }}
        </button>
      </div>
      
      <div v-else class="game-result">
        <h3>🏆 Quiz Selesai!</h3>
        <p class="quiz-final-score">Skor: {{ quizScore }}/{{ quizQuestions.length }}</p>
        <p>{{ quizScore >= 4 ? 'Hebat! Kamu paham tentang skripsi!' : 'Yuk belajar lebih lagi!' }}</p>
        <button class="play-again-btn" @click="initQuizGame">Main Lagi</button>
      </div>
    </div>

    <!-- Tic Tac Toe -->
    <div v-if="activeGame === 'tictactoe'" class="game-container">
      <div class="game-header">
        <button class="back-btn" @click="backToMenu">← Kembali</button>
        <h2>⭕ Tic Tac Toe</h2>
        <div class="game-stats">
          <span>Kamu: {{ tttPlayerScore }}</span>
          <span>Komputer: {{ tttComputerScore }}</span>
        </div>
      </div>
      
      <div class="ttt-container">
        <div class="ttt-board">
          <div 
            v-for="(cell, index) in tttBoard" 
            :key="index"
            :class="['ttt-cell', { x: cell === 'X', o: cell === 'O' }]"
            @click="makeMove(index)"
          >
            {{ cell }}
          </div>
        </div>
        
        <div v-if="tttWinner" class="ttt-result">
          <p v-if="tttWinner === 'X'">🎉 Kamu Menang!</p>
          <p v-else-if="tttWinner === 'O'">😅 Komputer Menang</p>
          <p v-else>🤝 Seri!</p>
          <button class="play-again-btn" @click="initTTTGame">Main Lagi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.games-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h2 {
  font-size: 24px;
  margin-bottom: 4px;
}

.page-header p {
  color: var(--text-secondary);
}

/* Games Grid */
.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.game-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-blue);
}

.game-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.game-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.game-card p {
  font-size: 13px;
  color: var(--text-secondary);
}

/* Game Container */
.game-container {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 24px;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 14px;
  cursor: pointer;
}

.game-header h2 {
  flex: 1;
  font-size: 20px;
}

.game-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

/* Memory Game */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.memory-card {
  aspect-ratio: 1;
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.memory-card .card-front,
.memory-card .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  backface-visibility: hidden;
  transition: transform 0.5s;
}

.memory-card .card-front {
  background: linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%);
  color: white;
}

.memory-card .card-back {
  background-color: var(--bg-sidebar);
  transform: rotateY(180deg);
}

.memory-card.flipped .card-front {
  transform: rotateY(180deg);
}

.memory-card.flipped .card-back {
  transform: rotateY(0);
}

.memory-card.matched .card-back {
  background-color: #DCFCE7;
}

/* Quiz Game */
.quiz-container {
  max-width: 500px;
  margin: 0 auto;
}

.quiz-question {
  background-color: var(--bg-sidebar);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-bottom: 24px;
}

.quiz-question h3 {
  font-size: 18px;
  line-height: 1.5;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quiz-option {
  padding: 16px 20px;
  background-color: var(--bg-sidebar);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option:hover {
  border-color: var(--primary-blue);
}

.quiz-option.selected {
  border-color: var(--primary-blue);
  background-color: var(--primary-blue-light);
}

.quiz-option.correct {
  border-color: #22C55E;
  background-color: #DCFCE7;
}

.quiz-option.wrong {
  border-color: #EF4444;
  background-color: #FEE2E2;
}

.next-btn {
  width: 100%;
  padding: 14px;
  margin-top: 24px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

/* Tic Tac Toe */
.ttt-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ttt-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 280px;
}

.ttt-cell {
  aspect-ratio: 1;
  background-color: var(--bg-sidebar);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.ttt-cell:hover {
  background-color: var(--primary-blue-light);
}

.ttt-cell.x {
  color: var(--primary-blue);
}

.ttt-cell.o {
  color: #EF4444;
}

.ttt-result {
  margin-top: 24px;
  text-align: center;
}

.ttt-result p {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* Game Result */
.game-result {
  text-align: center;
  padding: 32px;
}

.game-result h3 {
  font-size: 24px;
  margin-bottom: 8px;
}

.game-result p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.quiz-final-score {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-blue);
}

.play-again-btn {
  padding: 12px 32px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
  
  .memory-grid {
    max-width: 300px;
  }
}
</style>
