const cv = document.querySelector<HTMLCanvasElement>('#cv')!;
const ctx = cv.getContext('2d')!;

cv.height = window.innerHeight;
cv.width = window.innerWidth;

class SymbolEl {
    private characters: string;
    private text: string;

    constructor(
        public x: number, 
        public y: number, 
        public cvHeight: number, 
        public fontSize: number,
    ) {
        this.text = '';
        this.characters = `アカサタナハマヤャラワガザダバパピビヂジギヰリミヒニチシキィイウゥクスツヌフムユュルグ
        ズヅブプペベデゼゲレメヘネテセケェエオォヴコソトノッンホモヨョロヲゴゾドポ。、ヾヽー・0123456789!@#$%^&*)([]`
    }

    draw(context: CanvasRenderingContext2D) {
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
        
        if(this.y * this.fontSize > this.cvHeight && Math.random() > 0.95) {
            this.y = 0;
            return;
        }

        this.y += 1;
    }
}

class Matrix {
    protected fontSize: number;
    protected symbols: SymbolEl[];
    protected COL_WIDTH: number;

    constructor(
        public cvWidth: number, 
        public cvHeight: number,
    ) {
        this.fontSize = 25;
        this.COL_WIDTH = this.cvWidth / this.fontSize;
        this.symbols = [];
        this.init();
    }
    
    private init(): void {
        for(let i = 0; i < this.COL_WIDTH; i++) {
            this.symbols[i] = new SymbolEl(i, 0, this.cvHeight, this.fontSize);
        }
    }

    get getFontSize(): number { return this.fontSize }

    get getSymbolArray(): SymbolEl[] { return this.symbols }

    resize(width: number, height: number): void {
        this.cvWidth = width;
        this.cvHeight = height;
        this.COL_WIDTH = this.cvWidth / this.fontSize;
        this.symbols = [];
        this.init();
    }
}

const matrixEffect = new Matrix(cv.width, cv.height);
let lastTime = 0;
const fps = 25;
const nextFrame = 1000 / fps;
let timer = 0;

function addGradient(
    clr1: string, 
    clr2: string, 
    clr3: string
): CanvasGradient {
    const my_gradient = ctx.createLinearGradient(0, 0, 0, cv.height);
    my_gradient.addColorStop(0, clr1);
    my_gradient.addColorStop(0.4, clr2);
    my_gradient.addColorStop(0.7, clr3);
    return my_gradient;
}

function animate(timeStamp: number): void {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (timer > nextFrame) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, cv.width, cv.height);
        const gradient = addGradient('#64d86b', '#5ec986', '#6e7598')
        ctx.fillStyle = gradient;
        ctx.textAlign = 'center';
        ctx.font = `${matrixEffect.getFontSize}px monospace`;
        matrixEffect.getSymbolArray.forEach(item => item.draw(ctx));
        timer = 0;
    } else {
        timer += deltaTime;
    }

    window.requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    cv.height = window.innerHeight;
    cv.width = window.innerWidth;
    
    matrixEffect.resize(cv.width, cv.height);
})

animate(0);