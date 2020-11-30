var Terminado = {
  preload: function(){

  },
  create: function(){
    juego.add.text(400,230,"GAME OVER",{font: "50px Arial" , fill: "#FFF"});
    juego.state.backgroundColor = "#962813";
    if(confirm('Continue?'))
      juego.state.start('Iniciar');
  }
}
