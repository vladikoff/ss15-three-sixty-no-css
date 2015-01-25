var SOUNDTRACK = {
  init: function () {
    this.conductor = new BandJS();
    this.conductor.setTimeSignature(4,4);
    this.conductor.setTempo(120);
    var piano = this.conductor.createInstrument();

    piano.note('tripletHalf', 'G4, C4')/*
    piano.note('quarter', 'A4');
    piano.note('quarter', 'C4');
    piano.note('quarter', 'C4').rest('quarter');
    piano.note('quarter', 'D4').rest('quarter');
    piano.note('quarter', 'A4');
    piano.note('quarter', 'A4');

    piano.note('quarter', 'A4');
    piano.note('quarter', 'A4');
    piano.note('quarter', 'F4');
    piano.note('quarter', 'F4');
    piano.note('quarter', 'D4');
    piano.note('quarter', 'A4');
    piano.note('quarter', 'A4');*/

    this.player = this.conductor.finish();
    this.player.play();
  },
  hit: function () {
    var piano = this.conductor.createInstrument();
    piano.note('tripletHalf', 'G4, C4')
    var player = this.conductor.finish();
    player.play();
  },
  select: function () {
    var piano = this.conductor.createInstrument();
    piano.note('eighth', 'A4');
    var player = this.conductor.finish();
    player.play();
  },
  startSomething: function () {
    var piano = this.conductor.createInstrument();
    piano.note('tripletHalf', 'G4, C4')
    var player = this.conductor.finish();
    player.play();
  }

};
