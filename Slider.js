class Slider {
  constructor(container) {
    this.duration = parseInt(container.dataset.duration) || 2000; // transition duration
    this.container = container; // Container div (parent div)
    this.carousel = container.querySelector(".carousel"); // carousel list
    this.arrowButtons = container.querySelectorAll(".icons"); // slides arrows
    this.firstCardWidth = this.carousel.querySelector(".slide").offsetWidth; // width of the card
    this.init();
    this.carouselChildren = [...this.carousel.children]; // slides
    this.isDragging = false; // is dragging check
    this.startX;
    this.startScrollLeft;
    this.timeoutId;
    this.cardPerView = Math.round(
      this.carousel.offsetWidth / this.firstCardWidth
    );
    // Event Listeners
    this.carousel.addEventListener("mousedown", this.dragStart);
    this.carousel.addEventListener("mousemove", this.dragging);
    this.carousel.addEventListener("mouseup", this.dragStop);
    this.carousel.addEventListener("scroll", this.InfinityScroll);
    this.container.addEventListener("mouseenter", () =>
      clearTimeout(this.timeoutId)
    );
    // Auto play
    this.container.addEventListener("mouseleave", this.autoPlay);
    this.autoPlay();
    this.dots;
    this.currentSlide = 0;
    this.currentDot = 0;
    console.log(this.currentSlide);
  }
  init() {
    let slideList = this.container.querySelectorAll(".slide");
    this.dots = [];
    const dotsContainer = this.container.querySelector(".dots");
    slideList.forEach((slide) => {
      slide.innerHTML = new Slide(slide).init();
      let dot = document.createElement("div");
      dot.classList.add("dot");
      this.dots.push(dot);
      dotsContainer.appendChild(dot);
    });
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.slideNavigation(index));
    });

    /**
     * Handle arrows clicking
     */
    this.arrowButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.carousel.scrollLeft +=
          btn.id === "left" ? -this.firstCardWidth : this.firstCardWidth;
        this.currentSlide += btn.id === "left" ? -1 : 1;
        console.log(this.currentSlide);
      });
    });

    // this.carouselChildren = [...this.carousel.children];
    // insert copies of the first few cards to the end of carousel for infinite scrolling
    // this.carouselChildren.slice(0, this.cardPerView).forEach((card) => {
    //   this.carousel.insertAdjacentHTML("beforeend", card.outerHTML);
    // });
    // this.carouselChildren
    //   .slice(-this.cardPerView)
    //   .reverse()
    //   .forEach((card) => {
    //     this.carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    //   });
  }
  /**
   * @function dragStart
   * @description this function apply when the mouse is down to enable the scrolling
   * @param e target event
   */
  dragStart = (e) => {
    this.isDragging = true;
    this.carousel.classList.add("dragging");
    this.startX = e.pageX;
    this.startScrollLeft = this.carousel.scrollLeft;
    console.log(e.target);
  };
  /**
   * @function dragging
   * @description this function apply when the mouse is move and calculate the carousel scrolling
   * @param e
   */
  dragging = (e) => {
    if (!this.isDragging) return;
    this.carousel.scrollLeft = this.startScrollLeft - (e.pageX - this.startX);
  };
  /**
   * @function dragStop
   * @description this function apply when the mouse is up to stop the dragging
   */
  dragStop = () => {
    this.isDragging = false;
    this.carousel.classList.remove("dragging");
  };
  InfinityScroll = () => {
    // if the carousel is at the beginning, scroll to the end
    if (this.carousel.scrollLeft === 0) {
      this.carousel.classList.add("no-transition");
      this.carousel.scrollLeft =
        this.carousel.scrollWidth -
        this.carouselChildren.length * this.carousel.offsetWidth;
      this.carousel.classList.remove("no-transition");
      this.currentSlide += 1;
      console.log(this.currentSlide);
    }
    // if the carousel is at the end, scroll to the beginning
    else if (
      Math.ceil(this.carousel.scrollLeft) ===
      this.carousel.scrollWidth - this.carousel.offsetWidth
    ) {
      this.carousel.classList.add("no-transition");
      this.carousel.scrollLeft = this.carousel.offsetWidth;
      this.carousel.classList.remove("no-transition");
      this.currentSlide += 1;
      console.log(this.currentSlide);
    }

    // Clear existing timeout and start autoplay if ouse is not hovering over carousel
    clearTimeout(this.timeoutId);
    if (!this.container.matches(":hover")) this.autoPlay();
  };
  autoPlay = () => {
    this.timeoutId = setTimeout(
      () => (this.carousel.scrollLeft += this.firstCardWidth),
      this.duration
    );
  };
  slideNavigation = (index) => {
    index < 0
      ? (this.currentDot = this.carouselChildren.length - 1)
      : index >= this.carouselChildren.length
      ? (this.currentDot = 0)
      : (this.currentDot = index);
  };
}

class Slide {
  constructor(element) {
    this.description = element.dataset.description;
    this.imageurl = element.dataset.imageurl;
    this.name = element.dataset.name;
    this.title = element.dataset.title;
    this.init();
  }
  init() {
    return `
    <p>${this.description}</p>
    <img src="${this.imageurl}" alt="pic" class="image" draggable="false" />
    <div class="details">
        <p class="name">${this.name}</p>
        <p class="job-title">${this.title}</p>
    </div>
    <button class="cv-button">View CV Sample</button>
    `;
  }
}

const Slides = document.querySelectorAll(".container");
Slides.forEach((slide) => {
  let sl = new Slider(slide);
});
