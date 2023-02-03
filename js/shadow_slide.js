class ShadowSlide {

    init(slide) {
        this.destroy()

        const containerShadow = document.createElement('div');
        containerShadow.className = "container__shadow";
        containerShadow.style.width =  slide.offsetWidth + 'px';
        containerShadow.style.height = slide.offsetHeight + 'px';

        const indexSlide = widget.allLists.indexOf(slide)

        containerShadow.style.transform = `scale(${widget.configLists[indexSlide].sizeX}, ${widget.configLists[indexSlide].sizeY})`;

        slide.before(containerShadow);

        containerShadow.style.zIndex = slide.style.zIndex;

        if (slide.classList.contains('active')) containerShadow.style.opacity = 0.7
    }

    destroy() {
        const existShadowSlide = document.querySelector('.container__shadow');

        if (existShadowSlide) existShadowSlide.remove();
    }
}

const shadowSlide = new ShadowSlide();