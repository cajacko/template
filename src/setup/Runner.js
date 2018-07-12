const inquirer = require('inquirer');
const FileManagement = require('./FileManagement');

class Runner extends FileManagement {
  constructor(globalTemplates) {
    super();

    this.currentStep = 'init';
    this.steps = {};
    this.stepsOrder = [
      'preRun',
      'setupFiles',
      'postSetupFiles',
      'preWriteFiles',
      'postWriteFiles',
      'preInstallDependencies',
      'postInstallDependencies',
      'postRun',
    ];

    this.prompt = (questions) => {
      if (Array.isArray(questions)) {
        return inquirer.prompt(questions);
      }

      const question = Object.assign({}, questions);

      question.name = 'answer';

      return inquirer.prompt([question]).then(({ answer }) => answer);
    };

    if (globalTemplates) {
      Object.keys(globalTemplates).forEach((key) => {
        const ClassToInitiate = globalTemplates[key];
        this[key] = new ClassToInitiate(this);

        this.stepsOrder.forEach((step) => {
          if (typeof this[key][step] === 'function') {
            this.add(step, () => this[key][step]());
          }
        });
      });
    }
  }

  set(key, val) {
    this[key] = val;
  }

  get(key) {
    return this[key];
  }

  run() {
    const queue = [];

    this.stepsOrder.forEach((step) => {
      queue.push(() => this.runStep(step));

      switch (step) {
        case 'preWriteFiles':
          queue.push(() => {
            console.log('STEP - Writing files');
            return this.writeFiles();
          });

          break;

        case 'preInstallDependencies':
          queue.push(() => {
            console.log('STEP - Installing dependencies');
            return this.installDependencies();
          });

          break;
        default:
      }
    });

    return this.promiseQueue(queue);
  }

  getStepOrder(step = this.currentStep) {
    if (step === 'init') return 0;

    return this.stepsOrder.indexOf(step) + 1;
  }

  runStep(step) {
    console.log(`STEP - ${step}`);
    this.currentStep = step;

    const queue = [];

    if (this.steps[step]) {
      this.steps[step].forEach((callback) => {
        if (typeof callback !== 'function') return;

        queue.push(() => Promise.resolve(callback()));
      });
    }

    return this.promiseQueue(queue);
  }

  add(step, funcs) {
    if (this.getStepOrder() >= this.getStepOrder(step)) {
      throw new Error(`Can't add another ${step} step, as we're doing that step already, or have already completed it`);
    }

    if (!this.steps[step]) this.steps[step] = [];

    if (Array.isArray(funcs)) {
      this.steps[step] = this.steps[step].concat(funcs);
    } else {
      this.steps[step].push(funcs);
    }
  }
}

module.exports = Runner;
