function sa_gagalulas() {
    Swal.fire("Error", "Kamu sudah pernah mengulas Gym ini sebelumnya!", "error").then(() => {
        window.location.href = "/maps";
    })
  }
  function sa_berhasilulas() {
    Swal.fire("Mantap", "Berhasil Ulas!", "success").then(() => {
      window.location.href = "/maps";
    });
  }


        // Inisialisasi peta dengan batas wilayah Pekanbaru
        var map = L.map('map', {
            center: [0.533, 101.45],  // Titik pusat Pekanbaru
            zoom: 13,
            // maxBounds: [
            //     [0.583, 101.341],  // Barat Laut
            //     [0.471, 101.501]   // Tenggara
            // ],
            // maxBoundsViscosity: 1.0  // Mengunci peta di dalam batas
        });
    L.tileLayer(`https://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`, {
        maxZoom: 18,
        // attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
    }).addTo(map);

    var markers = []; // Array to store gym markers
    var gymData = []; // Array to store gym data

    function enableDragScroll(cardview) {
        let isDown = false;
        let startX;
        let scrollLeft;

        cardview.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - cardview.offsetLeft;
            scrollLeft = cardview.scrollLeft;
            cardview.style.cursor = 'grabbing';
        });
        cardview.addEventListener('mouseleave', () => {
            isDown = false;
            cardview.style.cursor = 'grab';
        });
        cardview.addEventListener('mouseup', () => {
            isDown = false;
            cardview.style.cursor = 'grab';
        });
        cardview.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - cardview.offsetLeft;
            const walk = (x - startX) * 2;
            cardview.scrollLeft = scrollLeft - walk;
        });
    }


    
    function toggleDropdown(event) {
        const dropdown = event.target.nextElementSibling;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }

    function searchGym() {
        const searchTerm = document.getElementById('search-bar').value.toLowerCase();
        const foundGym = gymData.find(gym => gym.nama.toLowerCase().includes(searchTerm));

        if (foundGym) {
            map.setView([foundGym.latitude, foundGym.longitude], 15);
            markers.forEach(marker => {
                if (marker.getPopup().getContent().includes(foundGym.nama)) {
                    marker.openPopup();
                } else {
                    marker.closePopup();
                }
            });
        }
    }

    function showReviews(gym) {
        // URL endpoint untuk mengambil data ulasan berdasarkan nama gym
        const url = `/ambilgym?nama=${encodeURIComponent(gym.nama)}`;
    
        // Ambil data gym dari server
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Gym tidak ditemukan");
                }
                return response.json();
            })
            .then(data => {
                // Ubah judul modal sesuai dengan nama gym
                document.getElementById('reviewsModalLabel').innerText = `Ulasan untuk ${data.nama}`;
                
                // Buat konten ulasan berdasarkan respons
                const reviewsContent = data.ulasan.map(review => `
                    <div class="review-item">
                    
                        <div class="review-author"><img class="review-foto" src="static/uploads/fotoprofile/${review.foto}">${review.nama}</div>
                        <div class="review-stars">${'★'.repeat(review.bintang)}${'☆'.repeat(5 - review.bintang)}</div>
                        <p>${review.komentar}</p>
                    </div>
                `).join('');
    
                // Tampilkan ulasan di modal
                document.getElementById('reviewsContent').innerHTML = reviewsContent || '<p>Belum ada ulasan</p>';
                
                // Tampilkan modal
                const reviewsModal = new bootstrap.Modal(document.getElementById('reviewsModal'));
                reviewsModal.show();
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById('reviewsContent').innerHTML = '<p>Terjadi kesalahan, tidak bisa mengambil ulasan.</p>';
            });
    }
    

    function showWriteReviewModal() {
        console.log("PPP")
        const writeReviewModal = new bootstrap.Modal(document.getElementById('writeReviewModal'));
        writeReviewModal.show();
    }

    // Function to handle the review submission
    function submitReview(event) {
        event.preventDefault();

        const form = document.getElementById("reviewForm");
        const formData = new FormData(form);
    
        fetch("/maps", { method: "POST", body: formData })
          .then((hasil) => hasil.json())
          .then((hasiljson) => {
            if (hasiljson.status == "berhasilulas") {
              sa_berhasilulas();
            } else {
              sa_gagalulas();
            }
          })
          .catch((error) => "Error ", error);
      }

    fetch('/datamaps')
        .then(response => response.json())
        .then(data => {
            gymData = data; // Save data for searching later
            
            data.forEach(gym => {
                var marker = L.marker([gym.latitude, gym.longitude]).addTo(map);
                marker._icon.classList.add("gschange");

                const photoUrls = gym.foto.map(foto => `static/uploads/fotogym/${foto}`);
                const rating = gym.ulasan.reduce((sum, u) => sum + Number(u.bintang), 0) / gym.ulasan.length || 0;
                const reviewCount = gym.ulasan.length;

                const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
                const today = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
                const startIndex = daysOfWeek.indexOf(today);
                const orderedDays = [...daysOfWeek.slice(startIndex), ...daysOfWeek.slice(0, startIndex)]
                    .map(day => ({ day, buka: gym.buka[day], tutup: gym.tutup[day] }));

                var popupContent = `
                    <div class="popup-content">
                        <div class="cardview" id="cardview-${gym.nama}">
                            ${photoUrls.map(url => `
                                <div class="card">
                                    <img src="${url}" alt="Gym Photo">
                                </div>
                            `).join('')}
                        </div>
                        <h3>${gym.nama}</h3>
                        <div class="rating">
                            <span>${rating.toFixed(1)}</span>
                            <div class="stars">
                                ${Array.from({ length: 5 }, (_, i) =>
                                    `<span>${i < Math.round(rating) ? '★' : '☆'}</span>`
                                ).join('')}
                            </div>
                            
                        </div>
                        <span class="review-count">Jumlah ulasan: ${reviewCount}</span>
                        <p><strong>Telepon:</strong> ${gym.telepon}</p>
                        <p><strong>Alamat:</strong> ${gym.alamat}</p>
                        <p><strong>Fasilitas:</strong> ${gym.fasilitas}</p>
                        <div class="opening-hours-container">
                            <div class="opening-hours-summary" onclick="toggleDropdown(event)">
                                <span>Jam:</span><span class="status-open"> Buka</span>
                                <span class="dot">·</span> Tutup pukul ${orderedDays[0].tutup}
                                <span>▼</span>
                            </div>
                            <div class="opening-hours-dropdown">
                                <ul>
                                    ${orderedDays.map(({ day, buka, tutup }) => `
                                        <li>
                                            <span>${day}</span>
                                            <span>${buka} - ${tutup}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        <button class="btn btn-secondary rounded-3 mt-2" onclick='showReviews(${JSON.stringify(gym)})'>Lihat Ulasan</button>
                    </div>
                `;
                var popupContent2 = `
                <div class="popup-content">
                    <div class="cardview" id="cardview-lanjut">
                        ${photoUrls.map(url => `
                            <div class="card">
                                <img src="${url}" alt="Gym Photo">
                            </div>
                        `).join('')}
                    </div>
                    <h3>${gym.nama}</h3>
                    <div class="rating">
                        <span>${rating.toFixed(1)}</span>
                        <div class="stars">
                            ${Array.from({ length: 5 }, (_, i) =>
                                `<span>${i < Math.round(rating) ? '★' : '☆'}</span>`
                            ).join('')}
                        </div>
                        </div>
                        <span class="review-count">Jumlah ulasan: ${reviewCount}</span>
                    <p><strong>Telepon:</strong> ${gym.telepon}</p>
                    <p><strong>Alamat:</strong> ${gym.alamat}</p>
                    <p><strong>Fasilitas:</strong> ${gym.fasilitas}</p>
                    <div class="opening-hours-container">
                        <div class="opening-hours-summary" onclick="toggleDropdown(event)">
                            <span>Jam:</span><span class="status-open"> Buka</span>
                            <span class="dot">·</span> Tutup pukul ${orderedDays[0].tutup}
                            <span>▼</span>
                        </div>
                        <div class="opening-hours-dropdown">
                            <ul>
                                ${orderedDays.map(({ day, buka, tutup }) => `
                                    <li>
                                        <span>${day}</span>
                                        <span>${buka} - ${tutup}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    <button class="btn btn-secondary rounded-3 mt-2" onclick='showReviews(${JSON.stringify(gym)})'>Lihat Ulasan</button>
                </div>
            `;
            marker.bindPopup(popupContent);
            markers.push(marker);
            
            hideGymDetails(popupContent2);

                marker.on("popupopen", () => {
                    const cardview = document.getElementById(`cardview-${gym.nama}`);
                    enableDragScroll(cardview);
                    showGymDetails(popupContent2);
                    const cardview2 = document.getElementById(`cardview-lanjut`);
                    enableDragScroll(cardview2);
                });
                marker.on("popupclose", () => {
                    const cardview = document.getElementById(`cardview-${gym.nama}`);
                    enableDragScroll(cardview);
                    hideGymDetails(popupContent2);
                    const cardview2 = document.getElementById(`cardview-lanjut`);
                    enableDragScroll(cardview2);
                });

            });
        })
        .catch(error => console.error('Error loading data:', error));

        function viewOnMap(gymName) {
            // Ambil gym yang sesuai dari data yang tersedia
            fetch('/datamaps')
                .then(response => response.json())
                .then(data => {
                    const selectedGym = data.find(gym => gym.nama === gymName);
                    if (selectedGym) {
                        // Posisikan dan zoom ke lokasi gym dengan animasi smooth
                        const gymLatLng = [parseFloat(selectedGym.latitude)+0.01, parseFloat(selectedGym.longitude)];
                        map.flyTo(gymLatLng, 15, { animate: true, duration: 1.5 }); // Animasi pan dan zoom
        
                        // Temukan dan buka popup untuk marker gym yang sesuai
                        markers.forEach(marker => {
                            if (marker.getPopup().getContent().includes(selectedGym.nama)) {
                                marker.openPopup();
                            } else {
                                marker.closePopup();
                            }
                        });
                    } else {
                        console.error("Gym tidak ditemukan dalam data.");
                    }
                })
                .catch(error => console.error("Error:", error));
        }





        function showGymDetails(content) {
            const gymDetails = document.getElementById("gymDetails");
            const mapContainer = document.getElementById("mapContainer");
    
            // Populate gym details
            gymDetails.innerHTML = content;
    
            // Display gym details with animation and reduce map width on large screens
            gymDetails.classList.add("show");
            mapContainer.classList.replace("col-12", "col-lg-9");
        }
    
        function hideGymDetails() {
            const gymDetails = document.getElementById("gymDetails");
            const mapContainer = document.getElementById("mapContainer");

            // Hide gym details with animation and set map to full width
            gymDetails.classList.remove("show");
            mapContainer.classList.replace("col-lg-9", "col-12");
        }