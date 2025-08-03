document.addEventListener("DOMContentLoaded", () => {
    const participantInput = document.getElementById("participantInput");
    const addParticipantButton = document.getElementById("addParticipantButton");
    const participantList = document.getElementById("participantList");
    const drawButton = document.getElementById("drawButton");
    const winnerDisplay = document.getElementById("winner");
    const fileInput = document.getElementById("fileInput");
    const uploadFileButton = document.getElementById("uploadFileButton");

    let participants = [];

    // Katılımcıları listele
    const renderParticipants = () => {
        participantList.innerHTML = "";
        participants.forEach((participant, index) => {
            const li = document.createElement("li");
            li.className = "participant-item";
            li.innerHTML = `
                <span>${participant}</span>
                <button class="delete-button">Sil</button>
            `;

            li.querySelector(".delete-button").addEventListener("click", () => {
                participants.splice(index, 1);
                renderParticipants();
            });

            participantList.appendChild(li);
        });
    };

    // ✅ Katılımcı ekleme fonksiyonu (Tekrarlı kodu kaldırdık)
    const addParticipant = () => {
        const participantName = participantInput.value.trim();
        if (participantName !== "") {
            participants.push(participantName);
            participantInput.value = "";
            renderParticipants();
        }
    };

    // Ekle Butonu
    addParticipantButton.addEventListener("click", addParticipant);

    // ✅ Enter tuşu ile ekleme
    participantInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addParticipant();
        }
    });

    // ✅ Dosyadan Katılımcı Yükle
    uploadFileButton.addEventListener("click", () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const lines = e.target.result.split("\n").map(line => line.trim()).filter(line => line);
                participants = [...new Set([...participants, ...lines])]; // Tekrar edenleri sil
                renderParticipants();
            };
            reader.readAsText(file);
        }
    });

    // ✅ Konfeti Efekti
    function launchConfetti() {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        })();
    }

    // ✅ Çekiliş Butonu (Heyecan Efekti Eklenmiş)
    drawButton.addEventListener("click", () => {
        if (participants.length === 0) {
            winnerDisplay.textContent = "Katılımcı Yok!";
            return;
        }

        let counter = 0;
        winnerDisplay.style.color = "#ff9800"; // Seçim sırasında turuncu
        winnerDisplay.textContent = "🎁 Seçiliyor...";

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * participants.length);
            winnerDisplay.textContent = `🎁 Seçiliyor: ${participants[randomIndex]}...`;
            counter++;
            if (counter > 20) { // 20 x 150ms ≈ 3 saniye
                clearInterval(interval);
                const finalIndex = Math.floor(Math.random() * participants.length);
                const winner = participants[finalIndex];
                winnerDisplay.textContent = `🎉 Kazanan: ${winner} 🎉`;
                winnerDisplay.style.color = "#28a745"; // ✅ Kazanan yeşil
                launchConfetti();
            }
        }, 150);
    });

    // ✅ Sayfa yenilenince listeyi sıfırla
    window.addEventListener("beforeunload", () => {
        participants = [];
    });

    renderParticipants();
});
