class RequestBody {
  /**
   * @type {{
   *   flow: string | number,
   *   temperature: string | number,
   *   solenoid: string | number
   *  }}
   */
  _body = {};

  /**
   *
   * @param {string | number} flow
   * @param {string | number} temperature
   * @param {string | number} solenoid
   */
  constructor(flow = undefined, temperature = undefined, solenoid = undefined) {
    this._body.flow = flow;
    this._body.temperature = temperature;
    this._body.solenoid = solenoid;
  }

  set body(body) {
    this._body = body;
  }

  get body() {
    return this._body;
  }

  set flow(flow) {
    this._body.flow = flow;
  }

  get flow() {
    return this._body.flow;
  }

  set temperature(temperature) {
    this._body.temperature = temperature;
  }

  get temperature() {
    return this._body.temperature;
  }

  set solenoid(solenoid) {
    this._body.solenoid = solenoid;
  }

  get solenoid() {
    return this._body.solenoid;
  }
}

module.exports = RequestBody;
