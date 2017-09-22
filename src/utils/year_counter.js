class YearCounter {

  constructor(startYear, speed, updateCallback) {
    this.startYear = startYear;
    this.speed = speed;
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

  pause() {
    clearTimeout(this.timeoutId);
  }
  unpause() {
    this._countUp()
  }

  setYear(year) {
    this.onExit();
    this.currentYear = year;
    this.onStart();
    this.updateCallback(this.currentYear);
  }


  // Private methods
  //----------------------------------------------------------------------------
  _countUp() {
    this.timeoutId = setTimeout(this._incrementYear.bind(this), this.speed*1000)
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
