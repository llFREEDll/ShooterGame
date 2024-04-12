let bala, malos, fondoJuego, nave, velocidad = -100, contador = 0, delay = 400, aparecer;
let windowWith = window.innerWidth * 0.99, WindowHeight = window.innerHeight * 0.97;
let puntos, vidas, txtpuntos, txtvidas;
let target = 0;
let ROTATION_SPEED = 1 * Math.PI; // radians per second
class Iniciar extends Phaser.Scene {
  constructor(...args) {
    super({ key: 'Iniciar', ...args })
  }
  preload() {
    this.load.image('nave', './assets/nave.png');
    this.load.image('laser', './assets/bala.png');
    this.load.image('malo', './assets/asteroide.png');
    this.load.image('bg', './assets/bg.jpg');
  }
  create() {
    fondoJuego = this.add.tileSprite(windowWith/2, WindowHeight/2, windowWith, WindowHeight, "bg");
    nave = this.add.sprite(40, WindowHeight / 2, 'nave');
    bala = this.physics.add.sprite(40, WindowHeight / 2, 'laser');
    bala.visible = false;
    bala.setCollideWorldBounds(true);
    bala.body.setAllowGravity(false);
    this.input.on('pointermove', function (pointer) {
      target = Phaser.Math.Angle.BetweenPoints(nave, pointer);
    });
    this.input.on('pointerdown', this.pointerdown, this);

    malos = this.physics.add.group({
      key: 'malo',
      repeat: 19,
      allowGravity: false,
      collideWorldBounds: true,
      visible: false
    });

    //generar asteroides
    aparecer = this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: this.crearEnemigos,
      callbackScope: this
    });

    //sistema de puntos
    puntos = 0;
    this.add.text(20, 20, "Score: ", { font: "3rem Arial", fill: "#FFF" });
    txtpuntos = this.add.text(170, 20, "0", { font: "3rem Arial", fill: "#FFF" });

    //sistema de vidas
    vidas = 5;
    this.add.text(310, 20, "Lifes: ", { font: "3rem Arial", fill: "#FFF" });
    txtvidas = this.add.text(440, 20, "5", { font: "3rem Arial", fill: "#FFF" });
  }
  update() {
    fondoJuego.tilePositionX += 1;
    nave.rotation = target;
    nave.rotation = Phaser.Math.Angle.RotateTo(
      nave.rotation,
      target,
      ROTATION_SPEED * 0.001
    );

    //colision asteroide laser
    this.physics.add.overlap(bala, malos, this.colision, null, this);

    // //colision que quita vidas
    malos.children.iterate(function (child) {
      if (child.visible && child.x == 25) {
        vidas--;
        txtvidas.text = vidas;
        child.visible = false;
        child.x = windowWith - 40
        child.y = WindowHeight / 2
      }
    });

    // //game over?
    if (vidas == 0) {
      this.scene.start('Terminado');
    }

  }
  pointerdown(pointer) {
    //Se agrega esto para que en celulares cambie la rotacion
    // de la nave con los clics
    target = Phaser.Math.Angle.BetweenPoints(nave, pointer);
    nave.rotation = Phaser.Math.Angle.RotateTo(
      nave.rotation,
      target,
      ROTATION_SPEED * 0.001
    );
    bala.enableBody(true, 40, WindowHeight / 2, true, true);
    bala.rotation = target;
    //Agregar el disparar hace que se mas fluido
    // y que no se repita como en el update

    bala.x = 40
    bala.y = WindowHeight / 2
    this.physics.moveTo(bala, pointer.x, pointer.y, 300);
  }
  crearEnemigos() {
    let enem = malos.getChildren()[contador];
    let num = Math.floor(Math.random() * (WindowHeight - 40) + 1);
    enem.enableBody(true, windowWith - 40, num, true, true);
    enem.body.velocity.x = velocidad;

    contador++;
    if (contador >= malos.getLength()) {
      contador = 0;
      velocidad -= 50

    }
  }
  colision(bala, malo) {
    if (malo.visible) {
      puntos++;
      txtpuntos.text = puntos;
    }
    // bala.visible = false;
    // bala.x = 40
    // bala.y = WindowHeight / 2
    bala.disableBody(true, true);
    malo.disableBody(true, true);
    // malo.visible = false;
    // malo.x = windowWith - 40
    // malo.y = WindowHeight / 2
  }
};

class Terminado extends Phaser.Scene {
  constructor(...args) {
    super({ key: 'Terminado', ...args })
  }
  preload() {

  }
  create() {
    this.add.text(400, 230, "GAME OVER", { font: "50px Arial", fill: "#FFF" });
    // this.state.backgroundColor = "#962813";
    if (confirm('Continue?'))
      this.scene.start('Iniciar');
  }
}
const config = {
  type: Phaser.AUTO,
  width: windowWith,
  height: WindowHeight,
  scene: [Iniciar, Terminado],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  }
};

const game = new Phaser.Game(config);