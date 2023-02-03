class Arrows {
    constructor() {
        this.rightArrows = document.querySelector('.arrows__right');
        this.leftArrows = document.querySelector('.arrows__left');
        this.possibleSides = ['right_side', 'left_side', 'central'];
        this.neededSide = null;
        this.positionRightArrow = null;
        this.positionLeftArrow = null;
        this.listActiveArrows = [];
    }

    tumblerArrows(action, dragArea) {

        if (action === 'show') {
            const howMuchToMove = 20; //насколько сдвинуть стрелочку от края анимируемой зоны слайда
            this.positionRightArrow = widget.widget.offsetWidth - (widget.widget.getBoundingClientRect().right - dragArea.getBoundingClientRect().right) + howMuchToMove;
            this.positionLeftArrow = (dragArea.getBoundingClientRect().left - widget.widget.getBoundingClientRect().left) - howMuchToMove;
            this.neededSide = Array.from(widget.allLists.find(el => el.classList.contains('pressed')).classList).find(el => this.possibleSides.includes(el));

            if (this.neededSide === 'right_side') this.listActiveArrows.push(this.rightArrows);
            else if (this.neededSide === 'left_side') this.listActiveArrows.push(this.leftArrows);
            else if (this.neededSide === 'central') this.listActiveArrows.push(this.rightArrows, this.leftArrows);

            this.activateArrow(this.listActiveArrows);

        } else if (action === 'hidden') this.disablingArrow(this.listActiveArrows)
    }

    activateArrow(listActiveArrows) {
        listActiveArrows.forEach(el => {
            el.style.transform = `translateX(${el === this.rightArrows ? this.positionRightArrow : this.positionLeftArrow}px)`;
            el.classList.add('show');
            el.querySelectorAll('span').forEach(span => span.classList.add('active'));
        })
    }

    disablingArrow(listActiveArrows) {
        listActiveArrows.forEach(el => {
            el.classList.remove('show')
            el.addEventListener('transitionend', (event) => {
                if (event.target !== el) return;
                el.querySelectorAll('span').forEach(span => span.classList.remove('active'));
            }, {
                once: true
            })
        })
        this.listActiveArrows.length = 0;
    }
}

const arrows = new Arrows();