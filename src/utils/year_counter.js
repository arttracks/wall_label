class YearCounter {

  constructor(startYear, updateCallback) {
    this.startYear = startYear;
    this.currentYear = startYear-1;
    this.timeoutId = null;
    this.endYear = new Date().getFullYear();
    this.updateCallback = updateCallback;
  }

  onStart() {
    this._countUp();
  }

  onExit() {
    clearTimeout(this.timeoutId);
  }

  reset() {
    this.onExit();
    this.currentYear = this.startYear-1;
    this.onStart();
  }


  // Private methods
  //----------------------------------------------------------------------------
  _countUp() {
    this.timeoutId = setTimeout(this._incrementYear.bind(this), 100)
  }

  _incrementYear() {
    this.currentYear += 1;
    if (this.currentYear < this.endYear) {
      this._countUp();
    }
    this.updateCallback(this.currentYear);
  }

}

export default YearCounter
