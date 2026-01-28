let index = 0;
const slides = document.querySelectorAll('.slide');

function showSlide() {
    slides.forEach(slide => slide.classList.remove('active'));

    slides[index].classList.add('active');
    index = (index + 1) % slides.length;  // Loop back to first slide
}

setInterval(showSlide, 3000);  // Change every 3 seconds
