class Slider {
  constructor(container) {
    // The constructor function is called when an object is created using this class.
    // It takes a 'container' parameter, which is the parent div element.

    // 'duration' represents the transition duration for the carousel. It is obtained from the 'data-duration' attribute of the container element.
    // If the attribute is not present or cannot be parsed as an integer, a default value of 2000 milliseconds (2 seconds) is used.
    this.duration = parseInt(container.dataset.duration) || 2000;

    // 'container' is the parent div element that contains the carousel.
    this.container = container;

    // 'carousel' is the carousel list element.
    this.carousel = container.querySelector(".carousel");

    // 'arrowButtons' represents the slide arrows.
    this.arrowButtons = container.querySelectorAll(".icons");

    // 'firstCardWidth' represents the width of the first slide card in the carousel.
    this.firstCardWidth = this.carousel.querySelector(".slide").offsetWidth;

    // 'init' is a method that initializes the carousel.
    this.init();

    // 'carouselChildren' is an array containing all the child elements (slides) of the carousel.
    this.carouselChildren = [...this.carousel.children];

    // 'isDragging' is a boolean flag that indicates whether the user is currently dragging the carousel.
    this.isDragging = false;
    // 'startX' and 'startScrollLeft' are variables that store the initial position of the mouse pointer and the initial scroll position of the carousel, respectively.
    this.startX;
    this.startScrollLeft;

    // 'timeoutId' is a variable used to store the ID of a timeout function.
    this.timeoutId;

    // 'cardPerView' represents the number of slide cards visible in the carousel at a time.
    this.cardPerView = Math.round(
      this.carousel.offsetWidth / this.firstCardWidth
    );
    // Event Listeners
    this.carousel.addEventListener("mousedown", this.dragStart);
    this.carousel.addEventListener("mousemove", this.dragging);
    this.carousel.addEventListener("mouseup", this.dragStop);
    this.carousel.addEventListener("scroll", this.InfinityScroll);

    // It clears the timeoutId, which cancels the automatic scrolling.
    this.container.addEventListener("mouseenter", () =>
      clearTimeout(this.timeoutId)
    );

    // Auto play
    this.container.addEventListener("mouseleave", () => this.autoPlay());
    // this.autoPlay();

    this.draggingDirection;
    this.dots;
    this.currentSlide = 0;
    this.currentDot = 0;
  }

  /**
   * @function init
   * @description The init() method is responsible for initializing the carousel by performing several tasks.
   */
  init() {
    this.autoPlay();
    // Step 1: Slide Initialization and Pagination Dots Creation
    // - Query all slide elements within the container using the class selector ".slide".
    let slideList = this.container.querySelectorAll(".slide");

    // - Initialize an empty array to store the pagination dots.
    this.dots = [];

    // - Query the dots container element using the class selector ".dots".
    const dotsContainer = this.container.querySelector(".dots");

    // - Iterate over each slide element using forEach, passing the slide and its index as parameters.
    slideList.forEach((slide, index) => {
      // - Create a new instance of the Slide class, passing the slide element and its index to the constructor
      slide.innerHTML = new Slide(slide, index).init();

      // - If the dots container element exists:
      if (dotsContainer) {
        // - Create a new <div> element to represent a pagination dot.
        let dot = document.createElement("div");
        // - Add the class "dot" to the dot element.
        dot.classList.add("dot");
        // - Add the dot element to the dots array.
        this.dots.push(dot);
        // - Append the dot element to the dots container.
        dotsContainer.appendChild(dot);
      }
    });

    // Step 2: Set the active class for the first pagination dot
    // - Add the class "active" to the first pagination dot.

    dotsContainer &&
      this.container.querySelectorAll(".dots .dot")[0].classList.add("active");

    // Step 3: Add click event listeners to pagination dots
    dotsContainer &&
      // - Iterate over each dot element in the dots array using forEach, passing the dot and its index as parameters.
      this.dots.forEach((dot, index) => {
        // - Inside the event listener, call the slideNavigation() method, passing the index of the clicked dot.
        dot.addEventListener("click", () => this.slideNavigation(index));
      });

    // Step 4: Handle arrow button clicks
    // - Iterate over each arrow button element in the arrowButtons array using forEach.
    this.arrowButtons.forEach((btn) => {
      // - Add a click event listener to the button element.
      btn.addEventListener("click", () => {
        // - Determine the scroll direction based on the button's id ("left" or "right").
        // - Adjust the carousel scrollLeft property to scroll the carousel in the corresponding direction.

        if (
          this.currentSlide + 2 > this.carouselChildren.length &&
          btn.id == "right"
        ) {
          this.carousel.scrollLeft = 0;
          // - Update the currentSlide index to the first slide.
          this.currentSlide = 0;
        } else if (this.currentSlide - 1 < 0 && btn.id == "left") {
          this.carousel.scrollLeft = this.carousel.scrollWidth;
          // - Update the currentSlide index to the last slide.
          this.currentSlide = this.carouselChildren.length - 1;
        } else {
          this.carousel.scrollLeft +=
            btn.id === "left" ? -this.firstCardWidth : this.firstCardWidth;
          // - Update the currentSlide index accordingly.
          this.currentSlide += btn.id === "left" ? -1 : 1;
        }

        // - Remove the "active" class from the currently active pagination dot.
        this.container
          .querySelector(".dots .active")
          ?.classList.remove("active");
        dotsContainer &&
          // - Add the "active" class to the pagination dot corresponding to the updated currentSlide index.
          this.container
            .querySelectorAll(".dots .dot")
            [this.currentSlide]?.classList.add("active");
      });
    });
  }
  /**
   * @function dragStart
   * @description this function apply when the mouse is down to enable the scrolling
   * @param e event
   */
  dragStart = (e) => {
    // Step 1: Set Dragging Flag to true and Apply CSS Class
    this.isDragging = true;
    // - Add the "dragging" CSS class to the carousel element to visually indicate the dragging state.
    this.carousel.classList.add("dragging");

    // Step 2: Store Initial Mouse Position and Scroll Position
    // - Store the initial horizontal position of the mouse pointer relative to the document in the startX variable.
    this.startX = e.pageX;
    // - Store the initial scrollLeft value of the carousel in the startScrollLeft variable.
    this.startScrollLeft = this.carousel.scrollLeft;
  };
  /**
   * @function dragging
   * @description this function apply when the mouse is move and calculate the carousel scrolling
   * @param e event
   */
  dragging = (e) => {
    // - Check if the isDragging flag is true, indicating that the user is currently dragging the carousel.
    if (!this.isDragging) return;

    const deltaX = e.pageX - this.startX;
    if (deltaX > 0) {
      // User is dragging to the right
      this.draggingDirection = true;
    } else if (deltaX < 0) {
      // User is dragging to the left
      this.draggingDirection = false;
    }
    // - Calculate the new scrollLeft value of the carousel based on the initial scroll position (startScrollLeft),
    //  the current horizontal position of the mouse pointer (e.pageX), and the initial mouse position (startX).
    if (
      this.startScrollLeft - deltaX > this.carousel.scrollWidth ||
      this.startScrollLeft - deltaX < 0
    ) {
      this.isDragging = false;
    } else this.carousel.scrollLeft = this.startScrollLeft - deltaX;
  };
  /**
   * @function dragStop
   * @description this function apply when the mouse is up to stop the dragging
   */
  dragStop = () => {
    // Step 1: Set Dragging Flag to false and Apply CSS Class
    this.isDragging = false;
    // - Remove the "dragging" CSS class to the carousel element to visually indicate the stop dragging state.
    if (this.currentSlide - 1 < 0 && this.draggingDirection) {
      this.slideNavigation(4);
      this.currentSlide = 4;
    } else if (
      this.currentSlide + 2 > this.carouselChildren.length &&
      !this.draggingDirection
    ) {
      this.slideNavigation(0);
      this.currentSlide = 0;
    } else {
      this.draggingDirection
        ? (this.currentSlide -= 1)
        : (this.currentSlide += 1);
    }

    this.container.querySelector(".dots .active")?.classList.remove("active");
    this.container
      .querySelectorAll(".dots .dot")
      [this.currentSlide]?.classList.add("active");
    this.carousel.classList.remove("dragging");
  };

  /**
   * @function InfinityScroll
   * @descriptionThe InfinityScroll method is responsible for handling the infinite scrolling behavior of the carousel.
   */
  InfinityScroll = () => {
    // Step 1: Check if Carousel is at the End
    if (this.currentSlide + 2 > this.carouselChildren.length) {
      //  - Add the "no-transition" CSS class to the carousel to temporarily disable any transition effects.
      this.carousel.classList.add("no-transition");
      //   - Set the scrollLeft property of the carousel to scroll to the end of the carousel.
      this.slideNavigation(this.carouselChildren.length - 1);
      this.currentSlide = this.carouselChildren.length - 1;
      // - Remove the "no-transition" CSS class to re-enable transition effects.
      this.carousel.classList.remove("no-transition");
      setTimeout(() => {
        this.carousel.classList.add("no-transition");
        this.slideNavigation(0);
        this.currentSlide = 0;
        this.carousel.classList.remove("no-transition");
      }, this.duration);
    }
    // - Increment the currentSlide index by 1, indicating that the visible slide has shifted to the next slide.
    // Step 2: Check if Carousel is at the start
    // - Check if the scrollLeft property of the carousel, rounded to the nearest whole number using Math.ceil(),is equal to the difference between the scrollWidth and the offsetWidth of the carousel.
    else if (this.currentSlide - 1 < 0) {
      // - Add the "no-transition" CSS class to the carousel to temporarily disable any transition effects.
      this.carousel.classList.add("no-transition");
      // - Set the scrollLeft property of the carousel to scroll to the beginning of the carousel,
      // which is equal to the offsetWidth of the carousel.
      this.slideNavigation(0);
      this.currentSlide = 0;
      // - Remove the "no-transition" CSS class to re-enable transition effects.
      this.carousel.classList.remove("no-transition");
    }

    // Step 3: Clear Existing Timeout and Start Autoplay
    clearTimeout(this.timeoutId);
    // - If the container is not being hovered over, call the autoPlay() method to start autoplay.
    //   This allows the carousel to automatically scroll to the next slide when not being interacted with.
    if (!this.carousel.matches(":hover")) this.autoPlay();
  };

  /**
   * @function autoPlay
   * @description  The autoPlay method is responsible for automatically scrolling the carousel to the next slide at a specified duration.
   */
  autoPlay = () => {
    // Step 1: Set Timeout
    // - Use the setTimeout() function to create a timeout and store the returned ID in the timeoutId variable.
    // - Inside the timeout function:
    //   - Adjust the scrollLeft property of the carousel to scroll to the next slide.
    //     The scrollLeft value is incremented by the width of the first card (this.firstCardWidth).
    //     This causes the carousel to scroll horizontally to the next slide.
    // - The duration for the setTimeout is specified by the this.duration property, which represents the transition duration for the carousel.
    this.timeoutId = setTimeout(() => {
      this.carousel.scrollLeft += this.firstCardWidth;

      // update the current slide index
      this.currentSlide += 1;
      this.container.querySelector(".dots .active")?.classList.remove("active");
      this.container
        .querySelectorAll(".dots .dot")
        [this.currentSlide]?.classList.add("active");
    }, this.duration);
    // this.timeoutId = setTimeout(
    //   () => (this.carousel.scrollLeft += this.firstCardWidth),
    //   this.duration
    // );
  };

  slideNavigation = (index) => {
    // The slideRight method is called to navigate the carousel to the right.

    // Step 1: Calculate Scroll Position
    // - The new scroll position represents the position to which the carousel should be scrolled to show the slide at the given index.
    let temp =
      this.carousel.scrollWidth -
      (this.carouselChildren.length - index) * this.carousel.offsetWidth;

    // Step 2: Update Current Slide Index
    // - Increment the currentSlide index by the value of the index parameter.
    // - This ensures that the currentSlide index reflects the updated slide after navigation.
    this.currentSlide = index;

    // Step 3: Scroll to the New Position
    // - Check if the new scroll position (temp) is within valid bounds.
    // - If it is within bounds, update the scrollLeft property of the carousel to scroll to the new position (temp).
    // - Remove the "active" class from the currently active pagination dot.
    // - Add the "active" class to the pagination dot corresponding to the updated index.

    this.carousel.scrollLeft = temp;
    this.container.querySelector(".dots .active")?.classList.remove("active");
    this.container
      .querySelectorAll(".dots .dot")
      [index]?.classList.add("active");
  };
}

class Slide {
  constructor(element, index) {
    // The Slide class represents a single slide in the carousel.

    // description: The description of the slide obtained from the 'data-description' attribute.
    this.description = element.dataset.description;
    // imageurl: The URL of the slide image obtained from the 'data-imageurl' attribute.
    this.imageurl = element.dataset.imageurl;
    // name: The name of the slide obtained from the 'data-name' attribute.
    this.name = element.dataset.name;
    // title: The job title of the slide obtained from the 'data-title' attribute.
    this.title = element.dataset.title;
    // index: The index of the slide passed as a parameter to the constructor.
    this.index = index;
    this.init();
  }
  init() {
    // The init() method generates the HTML structure for the slide and returns it as a string.
    return `
    <p>${this.description}</p>
    <img src="${this.imageurl}" alt="pic" class="image" draggable="false" />
    <div class="details">
        <p class="name">${this.name}</p>
        <p class="job-title">${this.title}</p>
    </div>
    <button class="cv-button" disabled>View CV Sample</button>
    ${this.index}
    `;
  }
}

// Step 1: Retrieve Slide Containers
// - Query all elements with the class "container" to select the slide containers.
const Slides = document.querySelectorAll(".container");

// Step 2: Create Slide Instances
// - Iterate over each slide container using forEach.
// - Create a new instance of the Slide class for each slide container, passing the container element as a parameter.
//   This initializes and sets up each individual slide.
Slides.forEach((slide) => {
  let sl = new Slider(slide);
});
