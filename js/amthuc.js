// 2. BỘ LỌC VÀ THAY ĐỔI MÓN ĂN
const filterBtns = document.querySelectorAll('.filter-btn');
const foodCards = document.querySelectorAll('.food-card');
let currentFilter = null;
let changeInterval = null;

function shuffleCards(array) {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function showCards(cards) {
    foodCards.forEach(card => card.style.display = 'none');
    cards.forEach(card => card.style.display = 'block');
}

function showInitialHint() {
    const categories = Array.from(filterBtns).map(btn => btn.getAttribute('data-filter'));
    const selectedCards = [];

    categories.forEach(category => {
        const categoryCards = shuffleCards(Array.from(foodCards).filter(card => card.getAttribute('data-category') === category));
        selectedCards.push(...categoryCards.slice(0, 2));
    });

    showCards(selectedCards);
}

function showAllInCategory(category) {
    const filtered = Array.from(foodCards).filter(card => card.getAttribute('data-category') === category);
    showCards(filtered);
}

function swapTwoCards(category) {
    let categoryCards = Array.from(foodCards);
    if (category) {
        categoryCards = categoryCards.filter(card => card.getAttribute('data-category') === category);
    }

    const visibleCards = categoryCards.filter(card => card.style.display === 'block');
    const hiddenCards = categoryCards.filter(card => card.style.display === 'none');

    if (visibleCards.length >= 2 && hiddenCards.length >= 2) {
        const toHide = visibleCards.sort(() => 0.5 - Math.random()).slice(0, 2);
        const toShow = hiddenCards.sort(() => 0.5 - Math.random()).slice(0, 2);

        // Fade out các thẻ cũ
        toHide.forEach(card => card.classList.add('fade-out'));

        // Sau 0.2s, ẩn thẻ cũ và hiện thẻ mới
        setTimeout(() => {
            toHide.forEach(card => {
                card.style.display = 'none';
                card.classList.remove('fade-out');
            });

            toShow.forEach(card => {
                card.style.display = 'block';
                card.classList.add('fade-in');
            });

            // Sau khi fade-in xong, loại bỏ class
            setTimeout(() => {
                toShow.forEach(card => card.classList.remove('fade-in'));
            }, 400);
        }, 200);
    }
}

if (filterBtns.length > 0 && foodCards.length > 0) {
    showInitialHint();
    changeInterval = setInterval(() => swapTwoCards(null), 5000);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isAlreadyActive = btn.classList.contains('active');

            filterBtns.forEach(b => b.classList.remove('active'));

            if (isAlreadyActive) {
                currentFilter = null;
                showInitialHint();

                if (changeInterval) clearInterval(changeInterval);
                changeInterval = setInterval(() => {
                    swapTwoCards(null);
                }, 5000);
                return;
            }

            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            showAllInCategory(currentFilter);

            if (changeInterval) clearInterval(changeInterval);
            changeInterval = setInterval(() => {
                swapTwoCards(currentFilter);
            }, 5000);
        });
    });
}

// 3. HỆ THỐNG TÍNH TOÁN KHOẢNG GIÁ ĐỘNG (ESTIMATOR)
const checkboxes = document.querySelectorAll('.food-checkbox');
const peopleCountInput = document.getElementById('people-count');
const calculateBtn = document.getElementById('calculate-btn');
const totalMinDisplay = document.getElementById('total-min');
const totalMaxDisplay = document.getElementById('total-max');
const perMinDisplay = document.getElementById('per-min');
const perMaxDisplay = document.getElementById('per-max');

function calculatePrice() {
    let totalMin = 0;
    let totalMax = 0;

    checkboxes.forEach(cb => {
        if (cb.checked) {
            let minVal = parseInt(cb.getAttribute('data-min'));
            let maxVal = parseInt(cb.getAttribute('data-max'));

            totalMin += minVal;
            totalMax += maxVal;
        }
    });

    let peopleCount = parseInt(peopleCountInput.value) || 1;
    if (peopleCount < 1) peopleCount = 1;

    let perMin = totalMin / peopleCount;
    let perMax = totalMax / peopleCount;

    if (totalMinDisplay && totalMaxDisplay) {
        totalMinDisplay.innerText = Math.round(totalMin).toLocaleString('vi-VN') + ' VNĐ';
        totalMaxDisplay.innerText = Math.round(totalMax).toLocaleString('vi-VN') + ' VNĐ';
    }

    if (perMinDisplay && perMaxDisplay) {
        perMinDisplay.innerText = Math.round(perMin).toLocaleString('vi-VN') + ' VNĐ';
        perMaxDisplay.innerText = Math.round(perMax).toLocaleString('vi-VN') + ' VNĐ';
    }
}

if (calculateBtn) {
    calculateBtn.addEventListener('click', calculatePrice);
}

// Tính ban đầu
calculatePrice();

// ===== ACTIVE MENU TỰ ĐỘNG =====
function highlightActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentFile = window.location.pathname.split('/').pop() || 'index.htm';

    navLinks.forEach(link => {
        link.classList.remove('active');
        const hrefFile = link.getAttribute('href').split('/').pop();
        if (hrefFile === currentFile || (currentFile === '' && hrefFile === 'index.htm')) {
            link.classList.add('active');
        }
    });
}

highlightActiveNav();


// ===== CHUYỂN TRANG MƯỢT (CHỈ CONTENT) =====
const content = document.getElementById('page-content');

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {

        if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (content) {
                content.classList.add('fade-out');
            }

            setTimeout(() => {
                window.location.href = href;
            }, 450);
        }
    });
});