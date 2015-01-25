var SOUNDTRACK = {
  init: function () {
    var conductor = new BandJS();
    conductor.setTimeSignature(4,4);
    conductor.setTempo(120);
    var piano = conductor.createInstrument();
    piano.note('quarter', 'A4');
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
    piano.note('quarter', 'A4');

    this.player = conductor.finish();
    this.player.play();
  },
  hit: function () {
    this.player.play();
  }

};
