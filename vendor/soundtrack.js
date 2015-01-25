var SOUNDTRACK = {
  init: function () {
    this.conductor = new BandJS();
    this.conductor.setTimeSignature(4,4);
    this.conductor.setTempo(120);
    var piano = this.conductor.createInstrument();
    piano.note('quarter', 'A4');/*
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
    this.player.play();
  }

};
