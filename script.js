let icon = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 233.3 216.2' xml:space='preserve'><path class='st0' d='M186.6,216.6H1.6c0,0,45-52,45-108.5c0-65.5-45-108.5-45-108.5h185c0,0,45,44,45,108.5C231.6,178.6,186.6,216.6,186.6,216.6z'/></svg>";
let elements = [];
let containerWidth, containerHeight;
let intervalFn;

window.onload = function () {
    let interval = 500,
        count = 0,
        maxCount = 50,
        rect = document.body.getBoundingClientRect();

    containerWidth = rect.width;
    containerHeight = rect.height;

    let runner = () => {
        let color = [
                random(0, 255),
                random(0, 255),
                random(0, 255),
            ],
            angle = random(0, 360),
            x = random(0, containerWidth - 40);

        let el = createEl(color, angle, x);
        document.body.append(el);
        elements.push(el);
        count++;
        /*                if(count >= maxCount) {
                            clearInterval(intervalFn);
                            intervalFn = null;
                        }*/
    };

    intervalFn = setInterval(runner, interval);

    document.body.addEventListener('click', function (e) {
        if(e.target.closest('.container')) {
            e.target.closest('.container').remove();
        }
    })

    runner();
    fallDown();
    rotate();
}

function fallDown() {
    let step = 1;
    let counter = 0;
    setInterval(() => {
        elements.forEach((elem, index, elements) => {
            if(!elem.isConnected) {
                delete elements[index];
                return;
            }
            if((counter % elem.dataset.falldownSpeed) !== 0) {
                return;
            }

            let y = elem.getBoundingClientRect().y,
                posY = Math.round(y + step),
                radian = posY / elem.dataset.sinusDelta,
                posX = Math.round(parseInt(elem.dataset.left, 10) + Math.sin(radian) * 60),
                shift;

            if(posX >= containerWidth - 40 || elem.dataset.shiftRight) {
                if(!elem.dataset.shiftRight) {
                    shift = Math.PI - radian;
                    elem.dataset.shiftRight = shift;
                } else {
                    shift = parseFloat(elem.dataset.shiftRight);
                }

                posX = containerWidth - 40 - Math.abs(Math.sin(radian + shift)) * 60;
            } else if(posX < 0  || elem.dataset.shiftLeft) {
                if(!elem.dataset.shiftLeft) {
                    shift = Math.PI - radian;
                    elem.dataset.shiftLeft = shift;
                } else {
                    shift = parseFloat(elem.dataset.shiftLeft);
                }

                posX = Math.abs(Math.sin(radian + shift)) * 60;
            }

            elem.style.top = posY + 'px';
            elem.style.left = posX + 'px';

            if(posY > containerHeight) {
                delete elements[index];
                elem.remove();
            }
        });
        counter++;
    }, 4)
}

function rotate() {
    let counter = 0;
    setInterval(() => {
        elements.forEach((elem, index, elements) => {
            if(elem.isConnected && (counter % elem.dataset.rotateSpeed) === 0) {
                let svgEl = elem.querySelector('svg');
                let match = svgEl.style.transform.match(/(-*\d+)/);
                if(match) {
                    let angle = (parseInt(match[1], 10) + parseInt(elem.dataset.rotateDirection, 10)) % 360;
                    svgEl.style.transform = `rotate(${angle}deg)`;
                }
            }
        });
        counter++;
    }, 1)
}

function createEl(fill = null, angle = null, x = 0, y = 0) {
    let elem = document.createElement('div'),
        svgEl;

    elem.classList.add('container');
    elem.innerHTML = icon;
    svgEl = elem.querySelector('svg');

    if(fill) {
        svgEl.style.fill = `rgb(${fill.join(",")})`;
    }
    if(angle !== null) {
        svgEl.style.transform = `rotate(${angle}deg)`;
        elem.dataset.rotateSpeed = random(1, 10);
        elem.dataset.rotateDirection = [-1, 1][random(0, 1)].toString();
    }

    elem.style.top = (y - 40) +'px';
    elem.style.left = x +'px';
    elem.dataset.left = x.toString();
    elem.dataset.sinusDelta = random(30, 90);
    elem.dataset.falldownSpeed = random(1, 10);

    return elem;
}

const random = (min, max) => Math.round(Math.random() * (max - min)) + min;