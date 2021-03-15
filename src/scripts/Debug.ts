export class Debug {
    //console.log('%c'+string, `color: ${color};background: #ffaaaa`)
    static get log(/* color = '#ff0000' */) {
        return console.log.bind(window.console, "%c%s", "color: #ffffff; background: #00ff00");
    }

    Log(color = '#ff0000') {
        
    }
}

const testConsole = {
    log: () => {
        return console.log.bind(window.console);
    }
}