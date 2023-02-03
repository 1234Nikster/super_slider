class Widget {
    constructor() {
        this.numbReduce = 6 //с какого слайда уменьшать container__content
        this.body = document.querySelector('body');
        this.widget = document.querySelector('.widget');
        this.containerLists = document.querySelector('.widget__checklist');
        this.allLists = [];
        this.bottomText = document.querySelector('.widget__bottom-text');
        this.count = 0;
        this.data = data;
        this.firstPointX = null;
        this.numberTranslateX = 0;
        this.pressFirstTime = this.pressFirstTime.bind(this);
        this.moveElement = this.moveElement.bind(this);
        this.cancelPressing = this.cancelPressing.bind(this);
        this.spaceLeft = null;
        this.configLists = [];
        this.finalPosXLeft = null;
        this.finalPosXRight = null;
        this.wasInit = false;
        this.firstText = null;
        this.secondText = null;
        this.borderDropAreaX = null;
        this.foundElement = null;
        this.firstPress = null;
        this.beyondSlide = false;
        this.commonMiddle = null;
        this.onWhichSide = null;
    }

    init(numb) {
        if (numb <= switcher.minSliders) return;
        if (numb > switcher.maxSliders) numb = switcher.maxSliders;

        let maxIndex = switcher.maxSliders

        for (numb; numb > 0; numb--) {
            this.createList(maxIndex);
            maxIndex--
        }

        this.widget.addEventListener('pointerdown', this.pressFirstTime)

        this.allLists[0].classList.add('active');

        this.createBotText();
        this.wasInit = true;
        this.commonMiddle = this.allLists[0].getBoundingClientRect().left + this.allLists[0].getBoundingClientRect().width / 2;
    }

    updateArrSliders() {
        this.allLists = Array.from(document.querySelectorAll('.widget__list'));
        if (this.allLists.length === 1) this.allLists[0].classList.add('not__allowed');
        else this.allLists[0] ?.classList.remove('not__allowed');
    }

    createList(zIndex) {
        this.containerLists.append(this.stylesLists(zIndex));
        this.updateArrSliders();
        this.createContentWidget();
    }

    stylesLists(zIndex) {
        const li = document.createElement('li');
        li.className = "widget__list";
        li.style.zIndex = zIndex;
        li.style.transform = 'translateX(0px)';


        const animatedArea = document.createElement('span');
        animatedArea.className = "animated__area";
        animatedArea.addEventListener('mouseenter', () => {
            const isPressed = this.allLists.find(el => el.classList.contains('pressed'));
            if (isPressed) return;

            li.classList.add('aim');
        })
        animatedArea.addEventListener('mouseleave', () => li.classList.remove('aim'))
        li.prepend(animatedArea);

        if (this.allLists.length === 0) {
            this.configLists.push({
                sizeX: 1,
                sizeY: 1,
                zIndex: zIndex
            });
            li.firstElementChild.style.transform = 'scale(1,1)';
            return li;
        } else {
            const prevSizeX = this.allLists[this.allLists.length - 1].firstElementChild.style.transform.replace(/scale\(/g, '').replace(/\)/, '').split(', ')[0];
            const prevSizeY = this.allLists[this.allLists.length - 1].firstElementChild.style.transform.replace(/scale\(/g, '').replace(/\)/, '').split(', ')[1];
            const sizeX = +prevSizeX + 0.08;
            const sizeY = +prevSizeY - 0.05;

            const obj = {
                sizeX,
                sizeY,
                zIndex
            }
            this.configLists.push(obj);
            li.firstElementChild.style.transform = `scale(${sizeX},${sizeY})`;
            return li;
        }
    }

    createContentWidget() {
        if (this.count === this.data.length) this.count = 0;

        const containerContent = document.createElement('span');
        containerContent.className = "container__content";

        const img = document.createElement('img');
        img.src = this.data[this.count].imgUrl;
        containerContent.append(img);

        const spanContainerText = document.createElement('span');
        spanContainerText.className = "widget__container-text";
        containerContent.append(spanContainerText);

        const text = document.createElement('span');
        text.innerText = this.data[this.count].textList;
        text.className = "widget__text";
        spanContainerText.append(text);

        const background = document.createElement('span');
        background.className = "widget__background";
        spanContainerText.append(background);

        const lastSlide = this.allLists[this.allLists.length - 1]
        lastSlide.append(containerContent);

        this.addSizeContentContainer(this.allLists.length - 1, this.numbReduce)

        this.count++;
    }

    createBotText() {
        const firstText = document.createElement('span');
        firstText.className = "first_replacer_text active";
        firstText.innerText = this.data[0].textBottom;
        this.bottomText.prepend(firstText);
        this.firstText = firstText;

        const secondText = document.createElement('span');
        secondText.className = "second_replacer_text";
        this.bottomText.append(secondText);
        this.secondText = secondText;
    }

    changeBotText() {
        //зависит от пути картинок
        const stringPathImg = this.allLists.find(el => el.classList.contains('active')).querySelector('img').src;
        const nameImg = stringPathImg.substring(stringPathImg.indexOf('img'))
        const indexImgData = this.data.findIndex(obj => obj.imgUrl === nameImg)
        //зависит от пути картинок

        if (!this.firstText.classList.contains('active')) {
            this.firstText.innerText = this.data[indexImgData].textBottom;
            if (this.firstText.innerText === this.secondText.innerText) return
            this.firstText.classList.add('active');
            this.secondText.classList.remove('active');
        } else {
            this.secondText.innerText = this.data[indexImgData].textBottom;
            if (this.firstText.innerText === this.secondText.innerText) return
            this.secondText.classList.add('active');
            this.firstText.classList.remove('active');
        }
    }

    pressFirstTime(event) {
        event.preventDefault();

        const dragArea = event.target;

        if (!dragArea.classList.contains('animated__area') || this.allLists.length <= 1 || document.querySelector('.stop-click')) return;

        this.body.classList.add('grabbing');

        const parentElem = dragArea.parentElement;

        parentElem.classList.remove('aim');

        const pointAreaDropX = event.clientX - dragArea.getBoundingClientRect().left;

        parentElem.classList.add('pressed');

        shadowSlide.init(parentElem);

        this.shiftingSlides(parentElem, 'move_apart');

        if (parentElem.classList.contains('active')) this.markSide(parentElem, dragArea, 0, 'central', 'center')
        else if (pointAreaDropX > dragArea.getBoundingClientRect().width / 2) {
            this.markSide(parentElem, dragArea, dragArea.getBoundingClientRect().right - parentElem.getBoundingClientRect().right, 'right_side', 'right center')
        } else this.markSide(parentElem, dragArea, dragArea.getBoundingClientRect().left - parentElem.getBoundingClientRect().left, 'left_side', 'left center')

        this.changeSizeSlide(parentElem, 'firstPress', this.numbReduce)

        this.borderDropAreaX = +this.borderDropAreaX.toFixed(1)

        this.onWhichSide = parentElem.classList.contains('left_side') ? 'onLeft' : 'onRight';

        parentElem.style.transform = `translateX(${this.borderDropAreaX}px) `;

        arrows.tumblerArrows('show', dragArea);

        this.spaceLeft = parentElem.getBoundingClientRect().left;

        this.firstPointX = event.clientX - parentElem.getBoundingClientRect().left - this.borderDropAreaX;

        this.firstPress = true;

        document.addEventListener('pointermove', this.moveElement);
        document.addEventListener('pointerup', this.cancelPressing);
    };

    markSide(parentElem, dragArea, borderDropAreaX, side, transformOrigin) {
        this.borderDropAreaX = borderDropAreaX;
        parentElem.classList.add(side);
        dragArea.style.transformOrigin = transformOrigin;
    }

    cancelPressing() {
        this.pasteSlide();
        this.body.classList.remove('grabbing');
        arrows.tumblerArrows('hidden', null);

        this.firstPress = false;
        this.beyondSlide = false;
        this.onWhichSide = null;
        this.foundElement = null;

        document.removeEventListener('pointermove', this.moveElement);
        document.removeEventListener('pointerup', this.cancelPressing);
    };

    pasteSlide() {
        const pressedSlide = this.allLists.find(el => el.classList.contains('pressed'));
        const antiPressedSlide = this.allLists.find(el => !el.classList.contains('pressed'));
        const containerContent = pressedSlide.firstElementChild.nextElementSibling;
        const shadowSlideElem = document.querySelector('.container__shadow');
        const coordinatesSlide = +pressedSlide.style.transform.replace(/translateX\(/g, '').replace(/px\)/, '');
        const possibleSides = ['right_side', 'left_side', 'central'];
        const classSide = Array.from(pressedSlide.classList).find(el => possibleSides.includes(el));
        const neededClass = classSide === 'right_side' ? 'left_side' :
            classSide === 'central' && this.onWhichSide === 'onLeft' ? 'left_side' :
            'right_side';

        const removeStopClick = (event) => {

            if (event.target !== event.currentTarget) return

            this.widget.classList.remove('stop-click');

            event.currentTarget.removeEventListener('transitionend', removeStopClick);
        }

        const anim = (event) => {

            if (event.target !== event.currentTarget) return

            pressedSlide.classList.remove('smoothness');

            pressedSlide.style.transform = `translateX(0px)`;

            pressedSlide.firstElementChild.style.transformOrigin = '';

            this.shiftingSlides(null, 'bring_it_back');

            shadowSlide.destroy();

            antiPressedSlide.firstElementChild.addEventListener('transitionend', removeStopClick);

            event.currentTarget.removeEventListener('transitionend', anim);
        };

        const paste = () => {

            const index = this.allLists.indexOf(pressedSlide);

            pressedSlide.firstElementChild.style.transform = `scale(${this.configLists[index].sizeX}, ${this.configLists[index].sizeY})`;

            pressedSlide.style.zIndex = shadowSlideElem.style.zIndex;

            this.widget.classList.add('stop-click');

            pressedSlide.classList.add('smoothness');

            pressedSlide.style.transform = `translateX(${this.borderDropAreaX}px)`;

            const element = coordinatesSlide !== this.borderDropAreaX ? pressedSlide : pressedSlide.firstElementChild;

            element.addEventListener('transitionend', anim);
        };

        pressedSlide.classList.remove('pressed', 'right_side', 'left_side', 'central');

        if (classSide === 'central' &&
            pressedSlide.classList.contains('active') ||
            this.onWhichSide === 'onLeft' &&
            classSide === 'left_side' ||
            this.onWhichSide === 'onRight' &&
            classSide === 'right_side') {
            this.changeSizeSlide(pressedSlide, 'ordinaryLastPress', this.numbReduce);
            paste();
            this.changeBotText();
        } else {

            let differenceOrigin = pressedSlide.firstElementChild.getBoundingClientRect().left;

            pressedSlide.firstElementChild.style.transformOrigin = this.onWhichSide === 'onLeft' ? 'left center' : 'right center';

            differenceOrigin -= pressedSlide.firstElementChild.getBoundingClientRect().left;

            pressedSlide.style.transform = `translateX(${coordinatesSlide + differenceOrigin}px)`;

            containerContent.classList.add('sharpness');

            pressedSlide.classList.add(neededClass);

            this.changeSizeSlide(pressedSlide, 'crossingLastPressFirst', this.numbReduce);

            requestAnimationFrame(() => {

                containerContent.classList.remove('sharpness');

                pressedSlide.classList.remove(neededClass);

                this.changeSizeSlide(pressedSlide, 'crossingLastPressSecond', this.numbReduce);

                paste();

                this.changeBotText();
            });
        };
    };

    findDesiredSlide(pressedSlide, whereMove) {
        this.finalPosXRight = pressedSlide.firstElementChild.getBoundingClientRect().right;
        this.finalPosXLeft = pressedSlide.firstElementChild.getBoundingClientRect().left;

        const indexPressedSlide = this.allLists.indexOf(pressedSlide);

        const finalPosX = this.onWhichSide === 'onLeft' ? this.finalPosXRight : this.finalPosXLeft;

        const side = this.onWhichSide === 'onLeft' ? 'left' : 'right';

        const bordersSide = this.allLists.map(el => el.firstElementChild.getBoundingClientRect()[side]);

        const ind = !pressedSlide.classList.contains('active') ? indexPressedSlide - 1 : indexPressedSlide + 1;

        const beyondSlide = this.onWhichSide === 'onRight' ? finalPosX > this.allLists[ind].firstElementChild.getBoundingClientRect()[side] :
            finalPosX < this.allLists[ind].firstElementChild.getBoundingClientRect()[side];

        if (beyondSlide) {
            this.beyondSlide = true;
            arrows.tumblerArrows('hidden', null);
        }

        if (!this.beyondSlide) return;

        const count = whereMove === 'whenMovingDown' ? 1 : 0;

        let indexFindSlide = this.onWhichSide === 'onRight' ? bordersSide.filter(el => el < finalPosX).length + count :
            bordersSide.filter(el => el > finalPosX).length + count;

        let coveredElements = whereMove === 'whenMovingDown' ?
            bordersSide.slice(indexPressedSlide + 1, indexFindSlide) :
            bordersSide.slice(indexFindSlide, indexPressedSlide);

        coveredElements = coveredElements.map(el => bordersSide.indexOf(el)).map(ind => this.allLists[ind]);

        if (coveredElements.length != 0) {

            if (whereMove === 'whenMovingUp') coveredElements.reverse();

            coveredElements.forEach(el => this.shiftingSlides(el, 'move_apart', whereMove));

            this.changeSizeSlide(pressedSlide, 'transition', this.numbReduce);
        };
    };

    changeSizeSlide(pressedSlide, action, numbReduce) {
        const containerContent = pressedSlide.firstElementChild.nextElementSibling;
        const animatedArea = pressedSlide.firstElementChild
        const indSlide = this.allLists.indexOf(pressedSlide);
        const sizeY = this.configLists[indSlide].sizeY;
        let translate = pressedSlide.classList.contains('central') ? `translate(0px, 1px)` :
            pressedSlide.classList.contains('left_side') ? `translate(-66px, 1px)` :
            `translate(66px, 1px)`;
        let scale = null;

        if (action === 'firstPress') scale = indSlide >= numbReduce ? ` scale(${sizeY - 0.05})` : ` scale(${0.65})`;
        else if (action === 'transition') {

            const slideLittle = document.querySelector('.little')

            if (slideLittle) slideLittle.firstElementChild.nextElementSibling.style.transform = '';

            scale = indSlide >= numbReduce ? ` scale(${sizeY - 0.05})` : ` scale(${0.65})`;

        } else if (action === 'ordinaryLastPress') {
            if (indSlide >= numbReduce) {
                translate = `translate(0px, 0px)`;
                scale = ` scale(${sizeY - 0.05})`;
            } else {
                translate = '';
                scale = '';
            }
        } else if (action === 'crossingLastPressFirst') {
            if (indSlide >= numbReduce) scale = ` scale(${sizeY - 0.05})`;
            else scale = ` scale(${0.65})`;
        } else if (action === 'crossingLastPressSecond') {
            if (indSlide >= numbReduce) {
                translate = `translate(0px, 0px)`;
                scale = ` scale(${sizeY - 0.05})`;
            } else {
                translate = '';
                scale = ``;
            }
        }

        containerContent.style.transform = translate + scale;
        if (action === 'firstPress' || action == 'transition') animatedArea.style.transform = `scale(0.7, ${sizeY})`;
    }

    addSizeContentContainer(indSlide, numbReduce) {
        const containerContent = this.allLists[indSlide].firstElementChild.nextElementSibling;
        const sizeY = this.configLists[indSlide].sizeY;
        containerContent.style.transform = indSlide >= numbReduce ? `translate(0px, 0px) scale(${sizeY - 0.05})` : '';
    }

    shiftingSlides(foundElement, whatMove, whereMove) {

        if (whatMove === 'bring_it_back') {

            this.allLists.forEach((el, i) => {

                if (i === 0) el.classList.remove('little');

                el.firstElementChild.style.transform = `scale(${this.configLists[i].sizeX}, ${this.configLists[i].sizeY})`;

                this.addSizeContentContainer(i, this.numbReduce)
            })

        } else if (whatMove === 'move_apart') {

            const indexFoundElement = this.allLists.indexOf(foundElement);

            if (!this.firstPress) { //если первого нажатия не было

                this.allLists.forEach((el, i) => {
                    if (i === 0 && !foundElement.classList.contains('active')) {
                        el.firstElementChild.style.transform = `scale(${this.configLists[0].sizeX - 0.08}, ${this.configLists[0].sizeY + 0.05})`;
                        el.classList.add('little');
                    } else if (i < indexFoundElement) {
                        el.firstElementChild.style.transform = `scale(${this.configLists[i - 1].sizeX}, ${this.configLists[i - 1].sizeY})`;
                    } else if (i === this.allLists.length - 1) {
                        el.firstElementChild.style.transform = `scale(${this.configLists[this.configLists.length - 1].sizeX + 0.08}, ${this.configLists[this.configLists.length - 1].sizeY - 0.05})`;
                    } else if (i > indexFoundElement) {
                        el.firstElementChild.style.transform = `scale(${this.configLists[i + 1].sizeX}, ${this.configLists[i + 1].sizeY})`;
                    }
                })

            } else if (this.firstPress) { //если первое нажатие уже было

                const pressedSlide = this.allLists.find(el => el.classList.contains('pressed'));

                shadowSlide.init(this.allLists[indexFoundElement]);

                const shadowSlideElem = document.querySelector('.container__shadow');

                const zIndexShadowSlide = shadowSlideElem.style.zIndex;

                let count = whereMove === 'whenMovingDown' ? -2 : 2;
                let countSizeX = 0;
                let countSizeY = 0;

                if (whereMove === 'whenMovingDown') {

                    if (pressedSlide.classList.contains('active')) {
                        pressedSlide.classList.remove('active');
                        this.allLists[indexFoundElement].classList.add('active', 'little');
                        count = -1;
                        countSizeX = -0.08;
                        countSizeY = 0.05;
                    }

                }

                if (whereMove === 'whenMovingUp') {

                    if (foundElement.classList.contains('active') && foundElement.classList.contains('little')) {
                        foundElement.classList.remove('active', 'little');
                        pressedSlide.classList.add('active');
                    }

                    if (indexFoundElement === this.allLists.length - 2) {
                        count = 1;
                        countSizeX = 0.08;
                        countSizeY = -0.05;
                    }

                }

                const scaleX = this.configLists[indexFoundElement + count].sizeX + countSizeX;
                const scaleY = this.configLists[indexFoundElement + count].sizeY + countSizeY

                this.allLists[indexFoundElement].firstElementChild.style.transform = `scale(${scaleX}, ${scaleY})`;

                this.allLists[indexFoundElement].style.zIndex = pressedSlide.style.zIndex;

                pressedSlide.style.zIndex = zIndexShadowSlide;

                if (whereMove === 'whenMovingDown') shadowSlideElem.nextElementSibling.after(pressedSlide);
                else if (whereMove === 'whenMovingUp') shadowSlideElem.nextElementSibling.before(pressedSlide);

                const antiPressedSlide = this.allLists.find(el => !el.classList.contains('pressed'));

                this.borderDropAreaX = this.onWhichSide === 'onRight' ? shadowSlideElem.getBoundingClientRect().right - antiPressedSlide.getBoundingClientRect().right :
                    antiPressedSlide.getBoundingClientRect().right - shadowSlideElem.getBoundingClientRect().right;

                this.borderDropAreaX = +this.borderDropAreaX.toFixed(1)

                this.updateArrSliders();
            }
        }
    }

    moveAt(clientX) {
        const pressedSlide = this.allLists.find(el => el.classList.contains('pressed'));
        const takenRight = pressedSlide.classList.contains('right_side') ? pressedSlide : null;
        const takenLeft = pressedSlide.classList.contains('left_side') ? pressedSlide : null;
        const takenTopSlide = pressedSlide.classList.contains('central') ? pressedSlide : null;
        const preTranslate = this.numberTranslateX;

        this.numberTranslateX = (clientX - this.firstPointX - this.spaceLeft);

        const pointMiddleSlide = pressedSlide.firstElementChild.getBoundingClientRect().left + pressedSlide.firstElementChild.getBoundingClientRect().width / 2;

        this.onWhichSide = pointMiddleSlide < this.commonMiddle ? 'onLeft' : 'onRight';

        const whereMove = preTranslate <= this.numberTranslateX && 
        this.onWhichSide === 'onRight' || preTranslate >= this.numberTranslateX && this.onWhichSide === 'onLeft' ? 'whenMovingDown' :
            preTranslate < this.numberTranslateX && this.onWhichSide === 'onLeft' || preTranslate > this.numberTranslateX && this.onWhichSide === 'onRight' ? 'whenMovingUp' : 
            null;

        if (takenRight) {
            if (this.numberTranslateX < this.borderDropAreaX && 
                !takenRight.classList.contains('active') && 
                this.onWhichSide != 'onLeft') {
                    pressedSlide.style.transform = `translateX(${this.borderDropAreaX}px`;
                }
            else pressedSlide.style.transform = `translateX(${this.numberTranslateX}px`;
        } else if (takenLeft) {
            if (this.numberTranslateX > this.borderDropAreaX && 
                !takenLeft.classList.contains('active') && 
                this.onWhichSide != 'onRight') {
                    pressedSlide.style.transform = `translateX(${this.borderDropAreaX}px`;
                }
            else pressedSlide.style.transform = `translateX(${this.numberTranslateX}px`;
        } else if (takenTopSlide) pressedSlide.style.transform = `translateX(${this.numberTranslateX}px`;

        this.findDesiredSlide(pressedSlide, 'whenMovingDown'); // чек на нахождение слайда при передвижении наверх

        this.findDesiredSlide(pressedSlide, whereMove);
    }

    moveElement(event) {
        event.preventDefault();
        this.moveAt(event.clientX, event.clientY);
    }
}

const widget = new Widget();

widget.init(switcher.maxSliders);
switcher.init();