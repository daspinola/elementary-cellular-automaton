const cellular = (function cellular() {
  let pattern = '';
  let prevRow = '';

  /**
   * Starting point that generates the automaton
   * @param {number} rule - Elementary automaton rule (0-255)
   */
  function create(rule = 30) {
    const area = document.querySelector('.generation-area');
    const binary = ruleBinary.call(this, rule);
    pattern = rulePattern(binary);

    area.appendChild(firstRow.call(this));
    setInterval(() => area.appendChild(nextRow()), this.stepTime)
  }

  /**
   * Convert a rule number to 8-bit binary
   * @param {number} rule - Elementary automaton rule (0-255)
   * @returns {string} 8-bit binary
   */
  function ruleBinary(rule = 0) {
    const missingZero = '0';
    let binary = rule.toString(2);

    while (binary.length < 8) {
      binary = missingZero + binary; 
    }

    return binary
  }

  /**
   * Each bit of the 8-bit binary corresponds to a state
   * @param {string} binary - 8-bit binary
   * @returns {object} with each bit matched to its corresponding state
   * Example for rule 90 - { '111': '0', '110': '1', ...}
   */
  function rulePattern(binary) {
    const states = ['111', '110', '101', '100', '011', '010', '001', '000'];

    return binary
      .split('')
      .reduce( (prev, curr, idx) => {
        const obj = { [states[idx]]: curr };
        return Object.assign({}, prev, obj)
      }, {})
  }

  /**
   * Creates the first row of the automaton
   * @param {string} start - Where to paint the first row cell
   * @returns {object} of the DOM node with the row and respective cells
   */
  function firstRow(start = 'middle') {
    let initialPaint = Math.ceil(this.rowSize/2);
    const row = document.createElement('div');

    if (start === 'start') initialPaint = 1;
    if (start === 'end') initialPaint = this.rowSize;

    for (let i = 1; i <= this.rowSize; i++) {
      if (i === initialPaint) {
        row.appendChild(createCell(initialPaint));
        prevRow += '1';
        continue;
      }

      row.appendChild(createCell());
      prevRow += '0';
    }

    row.classList.add('row');
    return row;
  }

  /**
   * Each new cell must check the previous row nearby cells
   * and match it to the current pattern to generate a new row
   * @returns {object} of the DOM node with the row
   */
  function nextRow() {
    const row = document.createElement('div');
    let currentRow = '';
    
    prevRow
      .split('')
      .forEach((cell, idx, original) => {
        const prevCell = original[idx-1] || '0';
        const nextCell = original[idx+1] || '0';
        const group = prevCell + cell + nextCell;
        const active = pattern[group];
        currentRow += active;

        row.appendChild(createCell(active));
      });

    prevRow = currentRow;
    row.classList.add('row');
    return row;
  }

  /**
   * Creates a cell taking into account the
   * bit state to choose what style to apply
   * @param {string} active - state of the cell to create
   * @returns {object} of the DOM node with the created cell
   */
  function createCell(active = '0') {
    const cell = document.createElement('div');
    const color = active === '0' ? 'white' : 'black';
    cell.classList.add('cell', color)
    return cell;
  }

  return {
    create,
    rowSize: 100,
    stepTime: 100,
  }
})()
