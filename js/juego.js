var balas, malos, fondoJuego, nave, timer = 0, delay = 400,aparecer ;
var puntos, vidas , txtpuntos, txtvidas;
var Iniciar = {
  preload: function() {
    juego.load.image('nave','assets/nave.png');
    juego.load.image('laser','assets/bala.png');
    juego.load.image('malo','assets/asteroide.png');
    juego.load.image('bg','assets/fondo.png');
  },
  create: function() {
    fondoJuego = juego.add.tileSprite(0,0,400,540,'bg');
    nave = juego.add.sprite(40,juego.height / 2,'nave');
    //punto de apoyo en el centro de la nave
    nave.anchor.setTo(0.5);
    //fisicas asrcade del framework
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.enable(nave,true);
    nave.allowRotation = false;

    //crear balas
    balas = juego.add.group();
    balas.enableBody = true;
    balas.setBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(20, "laser");
    balas.setAll('anchor.x',0.5);
    balas.setAll('anchor.y',1);
    balas.setAll('checkWorldBounds',true);
    balas.setAll('outOfBoundsKill',true);

    malos = juego.add.group();
    malos.enableBody = true;
    malos.setBodyType = Phaser.Physics.ARCADE;
    malos.createMultiple(20, "malo");
    malos.setAll('anchor.x',0.5);
    malos.setAll('anchor.y',1);
    malos.setAll('checkWorldBounds',true);
    malos.setAll('outOfBoundsKill',true);

    //generar asteroides
    aparecer = juego.time.events.loop(1500,this.crearEnemigos,this);

    //sistema de puntos
    puntos = 0;
    juego.add.text(20,20,"Score: ",{font: "14px Arial" , fill: "#FFF"});
    txtpuntos = juego.add.text(70,20,"0",{font: "14px Arial" , fill: "#FFF"});

    //sistema de vidas
    vidas = 5;
    juego.add.text(310,20,"Lifes: ",{font: "14px Arial" , fill: "#FFF"});
    txtvidas = juego.add.text(350,20,"5",{font: "14px Arial" , fill: "#FFF"});
  },
  update: function() {
    fondoJuego.tilePosition.x -= 3;
    nave.rotation = juego.physics.arcade.angleToPointer(nave);

    //disparar laser
    if(juego.input.activePointer.isDown)
      this.disparar();

      //colision asteroide laser
      juego.physics.arcade.overlap(balas, malos, this.colision, null, this);

      //colision que quita vidas
      malos.forEachAlive(function (m) {
        if (m.position.x > 10 && m.position.x < 12) {
          vidas --;
          txtvidas.text = vidas;
        }
      });

      //game over?
      if (vidas == 0) {
        juego.state.start('Terminado');
      }

  },
  disparar: function(){
    timer = juego.time.now + delay;
    var bala = balas.getFirstDead();
    
    if (juego.time.now < timer && balas.countDead() > 0) {
      bala.anchor.setTo(0.5);
      bala.reset(nave.x, nave.y);
      bala.rotation = juego.physics.arcade.angleToPointer(bala);
      juego.physics.arcade.moveToPointer(bala,300);
    }
  },
  crearEnemigos: function(){
     var enem = malos.getFirstDead();
     var num = Math.floor(Math.random() * 10 + 1);
     enem.reset(400, num * 55);
     enem.anchor.setTo(0.5);
     enem.body.velocity.x = -100;
     enem.checkWorldBounds = true;
     enem.outOfBoundsKill = true;
  },
  colision: function(bala , malo){
    bala.kill();
    malo.kill();
    puntos++;
    txtpuntos.text = puntos;
  }
};
