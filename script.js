// --- Oyun Değişkenleri ---
let currentQuestion = {};
let score = 0;
let level = 1;
let questionCount = 0; // Seviye atlamak için soru sayacı

// DOM Elementleri
const questionCard = document.getElementById('question-card');
const answerOptionsDiv = document.getElementById('answer-options');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const feedbackDiv = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');

// --- Yardımcı Fonksiyonlar ---

/** Rastgele bir tam sayı üretir. [min, max] aralığı dahil. */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Sayı dizisini karıştırır. */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- Oyun Mantığı ---

/** Yeni bir üslü sayı sorusu oluşturur. */
function generateQuestion(currentLevel) {
    let base, exponent; // Taban ve Üs

    if (currentLevel < 3) {
        // Kolay Seviye: Taban <= 5, Üs <= 3, 10'un kuvvetleri
        if (Math.random() < 0.3) { // %30 10'un kuvveti
            base = 10;
            exponent = getRandomInt(1, 4);
        } else {
            base = getRandomInt(2, 5);
            exponent = getRandomInt(2, 3);
        }
    } else {
        // Orta/Zor Seviye: Taban <= 10, Üs <= 3, Karesi/Küpü, 0/1'in kuvvetleri
        if (Math.random() < 0.2) { // %20 0 veya 1
            base = Math.random() < 0.5 ? 1 : getRandomInt(2, 10);
            exponent = base === 1 ? getRandomInt(5, 15) : 0; // 1^n veya n^0
        } else {
            base = getRandomInt(2, 10);
            exponent = getRandomInt(2, 3);
        }
    }

    // Değer hesaplama
    const correctAnswer = Math.pow(base, exponent);

    // Sorunun HTML gösterimi (Örn: 3² veya 3 x 3 x 3)
    let questionText = `${base}<sup>${exponent}</sup>`; 
    
    // Basit bir tekrarlı çarpım sorusu da ekleyebiliriz (seviye 1 için)
    if (level === 1 && Math.random() < 0.5) {
        let factors = [];
        for (let i = 0; i < exponent; i++) {
            factors.push(base);
        }
        questionText = factors.join(' × ');
    }

    // Yanlış cevapları oluşturma
    let options = [correctAnswer];
    while (options.length < 4) {
        let wrongAnswer = correctAnswer + getRandomInt(-10, 10);
        if (wrongAnswer < 0) wrongAnswer = getRandomInt(1, 10); // Negatif cevap olmasın

        // Aynı cevap ya da 0^0 olmasın
        if (!options.includes(wrongAnswer) && wrongAnswer !== 0 && wrongAnswer !== 1) {
            options.push(wrongAnswer);
        }
    }

    shuffleArray(options);

    return {
        question: questionText,
        answer: correctAnswer,
        options: options
    };
}

/** Oyunu başlatır veya bir sonraki soruya geçer. */
function loadNewQuestion() {
    currentQuestion = generateQuestion(level);
    
    // Ekranı temizle
    questionCard.innerHTML = currentQuestion.question;
    answerOptionsDiv.innerHTML = '';
    feedbackDiv.textContent = '';
    nextButton.classList.add('hidden');

    // Cevap butonlarını oluştur
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('answer-button');
        button.addEventListener('click', () => checkAnswer(option, button));
        answerOptionsDiv.appendChild(button);
    });

    // Butonları tekrar aktif hale getir
    document.querySelectorAll('.answer-button').forEach(btn => btn.disabled = false);
}

/** Kullanıcının cevabını kontrol eder. */
function checkAnswer(selectedAnswer, button) {
    // Tüm butonları devre dışı bırak
    document.querySelectorAll('.answer-button').forEach(btn => btn.disabled = true);

    if (selectedAnswer === currentQuestion.answer) {
        button.classList.add('correct');
        feedbackDiv.textContent = '✅ Harika! Doğru Cevap!';
        score += 10;
        questionCount++;
    } else {
        button.classList.add('wrong');
        feedbackDiv.textContent = `❌ Yanlış! Doğru cevap: ${currentQuestion.answer}`;
    }

    updateScoreAndLevel();
    nextButton.classList.remove('hidden');

    // Yanlış cevapta doğru cevabı işaretle (öğrenme amaçlı)
    if (selectedAnswer !== currentQuestion.answer) {
        document.querySelectorAll('.answer-button').forEach(btn => {
            if (parseInt(btn.textContent) === currentQuestion.answer) {
                btn.classList.add('correct');
            }
        });
    }
}

/** Skor ve seviyeyi günceller. */
function updateScoreAndLevel() {
    scoreDisplay.textContent = `Puan: ${score}`;
    
    // Her 5 soruda bir seviye atlama
    if (questionCount > 0 && questionCount % 5 === 0) {
        level++;
        levelDisplay.textContent = `Seviye: ${level}`;
        questionCount = 0; // Sayacı sıfırla
        
        // Seviye atlama bildirimi (isteğe bağlı)
        alert(`🎉 Tebrikler! Seviye ${level}'e geçtin! Sorular biraz zorlaşıyor.`);
    }
}

// --- Olay Dinleyicileri ---
nextButton.addEventListener('click', loadNewQuestion);

// --- Başlangıç ---
document.addEventListener('DOMContentLoaded', loadNewQuestion);