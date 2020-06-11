const body = document.querySelector('body');
let defaultBackground = window.getComputedStyle(body, null).backgroundColor;
const bgImage = document.body.style.backgroundImage;

if(!document.querySelector('body')) {
    alert ('the script does not work, missing body');
};

class CreateElements {
    constructor() {
        this.buttonBlock = document.createElement('div');
        this.colorPicker = document.createElement('input');
        this.clear = document.createElement('div');
        this.scale = localStorage.getItem('scale') || 1;
        this.color = localStorage.getItem('color') || '#ffffff';

        this.buttonBlock.addEventListener('click', (event) => this.onScaleChange(event));
        this.colorPicker.addEventListener('input', (event) => this.onColorChange(event));
        this.clear.addEventListener('click', () => this.reset());
    }

    onScaleChange(event) {
        const body = document.querySelector('body');
        let value;                     

        if (event) {
            this.scale = +event.target.value.replace(/x/g, '');
        }

        const recursy = (element) => {
            element.childNodes.forEach(node => {
                if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {

                    if (!node.parentNode.getAttribute('data-fontSize')) {
                        value = window.getComputedStyle(node.parentNode, null).fontSize;                                              
                        node.parentNode.setAttribute('data-fontSize', +value.replace(/\D+/g, ''));                        
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fontSize') * this.scale + String(value.replace(/\d+/g, ''));
                    } else {                 
                        value = window.getComputedStyle(node.parentNode, null).fontSize;                                
                        node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fontSize') * this.scale + String(value.replace(/\d+/g, ''));
                    }

                } else {
                    recursy(node);
                }
            })
        };

        recursy(body);

        localStorage.setItem('scale', this.scale);        
    }

    onColorChange(event) {
        const body = document.querySelector('body');
        document.body.style.backgroundImage = '';
        body.style.backgroundColor = event.target.value;
        localStorage.setItem('color', event.target.value);
    }

    setBackgroundColor() {
        const body = document.querySelector('body');
        body.style.backgroundColor = this.color;
        this.colorPicker.value = this.color;
    }
    
    reset() {
        localStorage.clear();
        this.scale = 1;
        this.backgroundImage = bgImage;
        this.color = defaultBackground;
        this.setBackgroundColor();
        this.onScaleChange();
    }
}

class Render extends CreateElements {
    render() {                
        this.setBackgroundColor();
        this.onScaleChange();

        let scaleInputSmall = document.createElement('input'),
            scaleInputMedium = document.createElement('input'),
            panel = document.createElement('div');

        panel.append(this.buttonBlock, this.colorPicker, this.clear);
        
        
        scaleInputSmall.setAttribute('type', 'button');
        scaleInputSmall.setAttribute('value', '1x');
        scaleInputSmall.setAttribute('style','display: block; width: 40px; height: 40px; border: 1px solid rgba(0,0,0, .2); border-radius: 4px; font-size: 18px;');
        scaleInputMedium.setAttribute('type', 'button');
        scaleInputMedium.setAttribute('style','display: block; width: 40px; height: 40px; border: 1px solid rgba(0,0,0, .2); border-radius: 4px; font-size: 18px;');
        scaleInputMedium.setAttribute('value', '1.5x');
        this.colorPicker.setAttribute('type', 'color');
        this.colorPicker.setAttribute('value', '#ffffff');
        this.colorPicker.setAttribute('style','width: 40px; height: 40px;');
        this.buttonBlock.setAttribute('style','display: flex; justify-content: space-around; align-items: center; width: 100px; height: 40px;');
        panel.setAttribute('style', 'display: flex; justify-content: space-around; align-items: center; position: fixed; top: 10px; right: 0; border: 1px solid rgba(0,0,0, .2); box-shadow: 0 0 20px rgba(0,0,0, .5); width: 300px; height: 60px; background-color: #fff;')
        this.clear.innerHTML = '&times';
        this.clear.setAttribute('style', 'font-size: 20px; cursor: pointer;');        

        this.buttonBlock.append(scaleInputSmall, scaleInputMedium);        
        document.querySelector('body').append(panel);        
    }
}

const render = new Render;
render.render();

