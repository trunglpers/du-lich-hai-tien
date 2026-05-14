// ============================================
// QUẢN LÝ PHÒNG ĐẶT
// ============================================

let currentBookingToCancel = null;
let currentBookingToEdit = null;
let selectedRoomType = null;
let selectedRestaurant = null;
let currentBookingType = 'hotel'; // Loại booking hiện tại (hotel hoặc restaurant)
let currentSlide = 0;

let roomPrices = {
    "Phòng Deluxe": 3000000,
    "Phòng Suite": 3300000,
    "Phòng Double": 500000,
    "Phòng Twin": 800000,
    "Phòng Premium": 600000,
    "Phòng View biển": 2200000
};

let restaurantPrices = {
    "Nhà hàng phong cách châu âu Paracel Resort Hải Tiến": 500000,
    "Nhà hàng Thanh Bình": 150000,
    "Nhà hàng S - Hải Tiến": 200000,
    "Nhà hàng Marissa Hotel & Spa": 500000,
    "Nhà hàng tại Hải Tiến Resort": 300000,
    "Nhà hàng Trọng Tình": 150000
};

// ============================================
// CAROUSEL LOGIC
// ============================================
function changeSlide(index) {
    currentSlide = index;
    updateSlideDisplay();
}

function updateSlideDisplay() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (indicators[index]) indicators[index].classList.remove('active');
    });

    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
}

// Auto slide every 5 seconds
setInterval(() => {
    const totalSlides = document.querySelectorAll('.slide').length;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlideDisplay();
}, 5000);

// ============================================
// SWITCH BOOKING TYPE
// ============================================
function switchBookingType(type, event) {
    currentBookingType = type;

    // Cập nhật active button
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Ẩn/hiện section gallery
    if (type === 'hotel') {
        document.querySelector('.rooms-gallery').style.display = 'block';
        document.querySelector('.restaurants-gallery').style.display = 'none';
    } else {
        document.querySelector('.rooms-gallery').style.display = 'none';
        document.querySelector('.restaurants-gallery').style.display = 'block';
    }

    // Cập nhật hiển thị danh sách
    updateBookingsDisplay();
}

// ============================================
// HÀM TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toastNotification');
    toast.textContent = message;
    toast.className = `toast-notification show ${type}`;

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.classList.remove('show', 'hide', type);
        }, 300);
    }, 3000);
}

// ============================================
// HÀM QUẢN LÝ BOOKING
// ============================================
function getBookings() {
    const bookings = localStorage.getItem('hotelBookings');
    return bookings ? JSON.parse(bookings) : [];
}

function getRestaurantBookings() {
    const bookings = localStorage.getItem('restaurantBookings');
    return bookings ? JSON.parse(bookings) : [];
}

function saveBookings(bookings) {
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
    updateBookingsDisplay();
}

function saveRestaurantBookings(bookings) {
    localStorage.setItem('restaurantBookings', JSON.stringify(bookings));
    updateBookingsDisplay();
}

// Hàm cập nhật hiển thị danh sách đặt phòng
function updateBookingsDisplay() {
    const bookingsList = document.getElementById('bookingsList');
    let bookings = [];
    let typeLabel = '';

    if (currentBookingType === 'hotel') {
        bookings = getBookings();
        typeLabel = 'khách sạn';
    } else {
        bookings = getRestaurantBookings();
        typeLabel = 'nhà hàng';
    }

    // Cập nhật số liệu thống kê
    document.getElementById('totalBookings').textContent = bookings.length;

    // Đếm đặt phòng hôm nay
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => new Date(b.bookingDate).toDateString() === today);
    document.getElementById('todayBookings').textContent = todayBookings.length;

    // Nếu không có đặt phòng
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <p style="text-align: center; color: #999; padding: 30px 20px; grid-column: 1/-1; margin: 0;">
                Bạn chưa đặt ${typeLabel} nào. <a href="#${currentBookingType === 'hotel' ? 'rooms' : 'restaurants'}" style="color: #c0392b; text-decoration: none; font-weight: bold;">Đặt ngay</a>
            </p>
        `;
        return;
    }

    // Hiển thị danh sách đặt phòng
    bookingsList.innerHTML = bookings.map((booking, index) => {
        const bookingDate = new Date(booking.bookingDate);
        const dateStr = bookingDate.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let priceInfo = '';
        if (currentBookingType === 'hotel') {
            const hotelPriceValue = roomPrices[booking.roomType] || 0;
            const hotelPrice = hotelPriceValue
                ? `${hotelPriceValue.toLocaleString('vi-VN')} VND/đêm`
                : 'Liên hệ';
            const checkIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : '';
            const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : '';
            priceInfo = `<div class="booking-info">
                <strong>Giá:</strong>
                <p>${hotelPrice}</p>
                <strong>Ngày nhận phòng:</strong>
                <p>${checkIn}</p>
                <strong>Ngày trả phòng:</strong>
                <p>${checkOut}</p>
            </div>`;
        } else {
            const price = booking.price || restaurantPrices[booking.restaurantName] || 0;
            const formattedPrice = price.toLocaleString('vi-VN') + ' VND';
            const restaurantDate = booking.restaurantDate ? new Date(booking.restaurantDate).toLocaleDateString('vi-VN') : '';
            priceInfo = `<div class="booking-info">
                <strong>Giá:</strong>
                <p>${formattedPrice}/người</p>
                <strong>Ngày đặt:</strong>
                <p>${restaurantDate}</p>
                <strong>Số khách:</strong>
                <p>${booking.guests} người</p>
                <strong>Giờ đặt:</strong>
                <p>${booking.time}</p>
            </div>`;
        }

        const title = currentBookingType === 'hotel' ? `✓ ${booking.roomType}` : `✓ ${booking.restaurantName}`;

        return `
            <div class="booking-item">
                <div class="booking-header">
                    <h3>${title}</h3>
                    <p class="booking-date">Đặt ${dateStr}</p>
                </div>
                <div id="bookingDetails-${currentBookingType}-${index}" class="booking-details" style="display:none; background:#fff;">
                    <div class="booking-info">
                        <strong>Khách hàng:</strong>
                        <p>${booking.customerName}</p>
                        <strong>Email:</strong>
                        <p>${booking.email}</p>
                        <strong>Số đt:</strong>
                        <p>${booking.phone}</p>
                        ${priceInfo}
                    </div>
                </div>
                <div class="booking-actions">
                    <button type="button" class="btn-detail" onclick="toggleBookingDetails('${currentBookingType}', ${index})">Xem chi tiết</button>
                    <button class="btn-edit" onclick="openEditModal(${index})">Chỉnh sửa</button>
                    <button class="btn-delete" onclick="openCancelModal(${index})">Hủy</button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// TOGGLE CHI TIẾT BOOKING
// ============================================
function toggleBookingDetails(type, index) {
    const details = document.getElementById(`bookingDetails-${type}-${index}`);
    if (!details) return;
    const button = details.nextElementSibling ? details.nextElementSibling.querySelector('.btn-detail') : null;
    const visible = details.style.display === 'block';
    details.style.display = visible ? 'none' : 'block';
    if (button) {
        button.textContent = visible ? 'Xem chi tiết' : 'Thu gọn';
    }
}

// ============================================
// CHỈNH SỬA THÔNG TIN ĐẶT PHÒNG
// ============================================
function openEditModal(index) {
    const bookings = currentBookingType === 'hotel' ? getBookings() : getRestaurantBookings();
    const booking = bookings[index];
    currentBookingToEdit = index;

    const itemName = currentBookingType === 'hotel' ? booking.roomType : booking.restaurantName;
    document.getElementById('editRoomName').textContent = currentBookingType === 'hotel' ? `Phòng: ${itemName}` : `Nhà hàng: ${itemName}`;
    document.getElementById('editFullname').value = booking.customerName;
    document.getElementById('editPhone').value = booking.phone;
    document.getElementById('editEmail').value = booking.email;
    document.getElementById('editCity').value = booking.city || '';

    const hotelDates = document.getElementById('hotelEditDates');
    const restaurantDate = document.getElementById('restaurantEditDate');
    const editCheckIn = document.getElementById('editCheckInDate');
    const editCheckOut = document.getElementById('editCheckOutDate');
    const editRestaurant = document.getElementById('editRestaurantDate');

    if (currentBookingType === 'hotel') {
        hotelDates.style.display = 'flex';
        restaurantDate.style.display = 'none';
        editCheckIn.value = booking.checkInDate || '';
        editCheckOut.value = booking.checkOutDate || '';
        editRestaurant.value = '';
    } else {
        hotelDates.style.display = 'none';
        restaurantDate.style.display = 'block';
        editCheckIn.value = '';
        editCheckOut.value = '';
        editRestaurant.value = booking.restaurantDate || '';
    }

    document.getElementById('editBookingModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editBookingModal').style.display = 'none';
    currentBookingToEdit = null;
}

function saveEditedBooking() {
    if (currentBookingToEdit === null) return;

    // Hiển thị confirm modal
    document.getElementById('confirmSaveModal').style.display = 'flex';
}

// ============================================
// HỦY ĐẶT PHÒNG
// ============================================
function openCancelModal(index) {
    const bookings = currentBookingType === 'hotel' ? getBookings() : getRestaurantBookings();
    const booking = bookings[index];
    currentBookingToCancel = index;

    const itemName = currentBookingType === 'hotel' ? booking.roomType : booking.restaurantName;
    const hotelPriceValue = currentBookingType === 'hotel' ? (roomPrices[booking.roomType] || 0) : 0;
    const price = currentBookingType === 'hotel'
        ? (hotelPriceValue ? `${hotelPriceValue.toLocaleString('vi-VN')} VND/đêm` : 'Liên hệ')
        : `${restaurantPrices[booking.restaurantName].toLocaleString('vi-VN')} VND/người`;

    let bookingDetails = `
        <strong style="font-size: 1.1em;">${itemName}</strong><br>
        Khách hàng: ${booking.customerName}<br>
        Giá: ${price}`;

    if (currentBookingType === 'hotel') {
        const checkIn = booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString('vi-VN') : '';
        const checkOut = booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString('vi-VN') : '';
        bookingDetails += `<br>Nhận phòng: ${checkIn}<br>Trả phòng: ${checkOut}`;
    } else {
        const restaurantDate = booking.restaurantDate ? new Date(booking.restaurantDate).toLocaleDateString('vi-VN') : '';
        bookingDetails += `<br>Ngày đặt: ${restaurantDate}<br>Giờ đặt: ${booking.time}`;
    }

    document.getElementById('cancelBookingInfo').innerHTML = bookingDetails;
    document.getElementById('manageBookingModal').style.display = 'flex';
}

function closeManageModal() {
    document.getElementById('manageBookingModal').style.display = 'none';
    currentBookingToCancel = null;
}

function confirmCancelBooking() {
    if (currentBookingToCancel === null) return;

    const isHotel = currentBookingType === 'hotel';
    const bookings = isHotel ? getBookings() : getRestaurantBookings();
    const canceledBooking = bookings[currentBookingToCancel];

    const itemName = isHotel ? canceledBooking.roomType : canceledBooking.restaurantName;

    bookings.splice(currentBookingToCancel, 1);

    if (isHotel) {
        saveBookings(bookings);
    } else {
        saveRestaurantBookings(bookings);
    }

    closeManageModal();
    showToast(`✓ Bạn đã hủy ${itemName} thành công!`, 'success');
}

// ============================================
// HÀM MỞ FORM ĐẶT PHÒNG
// ============================================
function openForm(roomType = null) {
    selectedRoomType = roomType;
    document.getElementById("bookingModal").style.display = "flex";

}

function closeForm() {
    document.getElementById("bookingModal").style.display = "none";
}

function openRestaurantForm(restaurantName = null) {
    selectedRestaurant = restaurantName;
    document.getElementById("restaurantModal").style.display = "flex";
}

function closeRestaurantForm() {
    document.getElementById("restaurantModal").style.display = "none";
}

// ============================================
// XỬ LÝ SỰ KIỆN GỬI FORM KHÁCH SẠN
// ============================================
if (document.getElementById('bookingForm')) {
    document.getElementById('bookingForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const email = document.getElementById('email').value;
        const name = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;

        // Kiểm tra dữ liệu
        if (!name || !email || !phone || !checkInDate || !checkOutDate) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
            return;
        }

        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            showToast('Ngày trả phòng phải lớn hơn ngày nhận phòng!', 'error');
            return;
        }

        // Trạng thái đang xử lý
        submitBtn.innerText = "ĐANG XỬ LÝ...";
        submitBtn.disabled = true;

        // Mô phỏng quá trình gửi
        setTimeout(() => {
            // Lấy tên phòng từ form hoặc giá trị mặc định
            const roomType = selectedRoomType || "Phòng Deluxe";

            // Tạo object đặt phòng
            const newBooking = {
                id: Date.now(),
                customerName: name,
                email: email,
                phone: phone,
                city: city,
                roomType: roomType,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            };

            // Lưu vào danh sách
            const bookings = getBookings();
            bookings.push(newBooking);
            saveBookings(bookings);

            // Thông báo thành công
            showToast(`✓ Bạn đã đặt ${roomType} thành công!`, 'success');

            // Reset form
            this.reset();
            closeForm();
            submitBtn.innerText = "XÁC NHẬN ĐẶT NGAY";
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ============================================
// XỬ LÝ SỰ KIỆN GỬI FORM NHÀ HÀNG
// ============================================
if (document.getElementById('restaurantForm')) {
    document.getElementById('restaurantForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('restSubmitBtn');
        const name = document.getElementById('restFullname').value;
        const phone = document.getElementById('restPhone').value;
        const email = document.getElementById('restEmail').value;
        const guests = document.getElementById('restGuests').value;
        const restDate = document.getElementById('restDate').value;
        const time = document.getElementById('restTime').value;
        const notes = document.getElementById('restNotes').value;

        // Kiểm tra dữ liệu
        if (!name || !phone || !email || !guests || !restDate || !time) {
            showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
            return;
        }

        // Trạng thái đang xử lý
        submitBtn.innerText = "ĐANG XỬ LÝ...";
        submitBtn.disabled = true;

        // Mô phỏng quá trình gửi
        setTimeout(() => {
            const restaurantName = selectedRestaurant || "Nhà hàng phong cách châu âu Paracel Resort Hải Tiến";
            const price = restaurantPrices[restaurantName] || 50;

            // Tạo object đặt nhà hàng
            const newBooking = {
                id: Date.now(),
                customerName: name,
                email: email,
                phone: phone,
                restaurantName: restaurantName,
                price: price,
                guests: guests,
                restaurantDate: restDate,
                time: time,
                notes: notes,
                bookingDate: new Date().toISOString(),
                status: 'confirmed'
            };

            // Lưu vào danh sách
            const bookings = getRestaurantBookings();
            bookings.push(newBooking);
            saveRestaurantBookings(bookings);

            // Thông báo thành công
            showToast(`✓ Bạn đã đặt bàn ${restaurantName} thành công!`, 'success');

            // Reset form
            this.reset();
            closeRestaurantForm();
            submitBtn.innerText = "XÁC NHẬN ĐẶT BÀN";
            submitBtn.disabled = false;
        }, 1500);
    });

    // Xử lý form chỉnh sửa
    document.getElementById('editBookingForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveEditedBooking();
    });
}

const todayISO = new Date().toISOString().split('T')[0];
const checkInInput = document.getElementById('checkInDate');
const checkOutInput = document.getElementById('checkOutDate');
const restDateInput = document.getElementById('restDate');
if (checkInInput) {
    checkInInput.min = todayISO;
}
if (checkOutInput) {
    checkOutInput.min = todayISO;
    if (checkInInput) {
        checkInInput.addEventListener('change', function () {
            const selected = new Date(this.value);
            selected.setDate(selected.getDate() + 1);
            const nextDay = selected.toISOString().split('T')[0];
            checkOutInput.min = nextDay;
            if (checkOutInput.value && checkOutInput.value <= this.value) {
                checkOutInput.value = '';
            }
        });
    }
}
if (restDateInput) {
    restDateInput.min = todayISO;
}

// ============================================
// ĐÓNG MODAL KHI NHẤN RA NGOÀI
// ============================================
window.addEventListener('click', function (event) {
    const modal = document.getElementById("bookingModal");
    const restaurantModal = document.getElementById("restaurantModal");
    const manageModal = document.getElementById("manageBookingModal");
    const editModal = document.getElementById("editBookingModal");

    if (modal && event.target === modal) {
        closeForm();
    }

    if (restaurantModal && event.target === restaurantModal) {
        closeRestaurantForm();
    }

    if (manageModal && event.target === manageModal) {
        closeManageModal();
    }

    if (editModal && event.target === editModal) {
        closeEditModal();
    }
});

// ============================================
// ĐÓNG MODAL KHI NHẤN PHÍM ESC
// ============================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeForm();
        closeRestaurantForm();
        closeManageModal();
        closeEditModal();
    }
});

// ============================================
// HÀM LỌC PHÒNG
// ============================================
function filterRoomType(type, event) {
    // Cập nhật active button trong phần phòng
    const roomSelectors = document.querySelectorAll('.rooms-gallery .type-btn');
    roomSelectors.forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Lọc room cards
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        if (type === 'all') {
            card.classList.remove('hidden');
        } else {
            const cardType = card.getAttribute('data-room-type');
            if (cardType === type) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// ============================================
// HÀM LỌC NHÀ HÀNG
// ============================================
function filterRestaurantType(type, event) {
    // Cập nhật active button trong phần nhà hàng
    const restaurantSelectors = document.querySelectorAll('.restaurants-gallery .type-btn');
    restaurantSelectors.forEach(btn => {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // Lọc restaurant cards
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    restaurantCards.forEach(card => {
        if (type === 'all') {
            card.classList.remove('hidden');
        } else {
            const cardType = card.getAttribute('data-restaurant-type');
            if (cardType === type) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// ============================================
// KHỞI TẠO KHI TẢI TRANG
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Hiển thị section khách sạn mặc định
    document.querySelector('.rooms-gallery').style.display = 'block';
    document.querySelector('.restaurants-gallery').style.display = 'none';

    updateBookingsDisplay();
    updateSlideDisplay();
});

// ============================================
// XỬ LÝ MODAL XÁC NHẬN LƯU THAY ĐỔI
// ============================================
function closeConfirmModal() {
    document.getElementById('confirmSaveModal').style.display = 'none';
}

function confirmSaveBooking() {
    if (currentBookingToEdit === null) return;

    const isHotel = currentBookingType === 'hotel';
    const bookings = isHotel ? getBookings() : getRestaurantBookings();
    const booking = bookings[currentBookingToEdit];

    // Cập nhật thông tin
    booking.customerName = document.getElementById('editFullname').value;
    booking.phone = document.getElementById('editPhone').value;
    booking.email = document.getElementById('editEmail').value;
    booking.city = document.getElementById('editCity').value;

    if (isHotel) {
        const editedCheckIn = document.getElementById('editCheckInDate').value;
        const editedCheckOut = document.getElementById('editCheckOutDate').value;
        if (!editedCheckIn || !editedCheckOut || new Date(editedCheckOut) <= new Date(editedCheckIn)) {
            showToast('Ngày trả phòng phải lớn hơn ngày nhận phòng!', 'error');
            return;
        }
        booking.checkInDate = editedCheckIn;
        booking.checkOutDate = editedCheckOut;
        saveBookings(bookings);
    } else {
        const editedRestaurantDate = document.getElementById('editRestaurantDate').value;
        if (!editedRestaurantDate) {
            showToast('Vui lòng chọn ngày đặt bàn!', 'error');
            return;
        }
        booking.restaurantDate = editedRestaurantDate;
        saveRestaurantBookings(bookings);
    }

    closeConfirmModal();
    closeEditModal();
    showToast('✓ Bạn đã cập nhật thông tin thành công!', 'success');
}

// ============================================
// ĐÓNG MODAL CONFIRM KHI NHẤN NÚT X HOẶC OUTSIDE
// ============================================
document.addEventListener('click', function (event) {
    const confirmModal = document.getElementById("confirmSaveModal");

    if (confirmModal && event.target === confirmModal) {
        closeConfirmModal();
    }
});

// Đóng modal confirm khi nhấn ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeConfirmModal();
    }
});

// Highlight active navigation link
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

// ===== TRANSITION CHỈ CONTENT =====
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