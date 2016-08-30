import runner from './runner';
import rules from '../examples/01_simple/rules.json';
import tasks from '../examples/01_simple/input.json';


tasks.forEach(task => runner(rules, task, 1));
