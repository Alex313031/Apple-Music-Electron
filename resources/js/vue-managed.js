var _vues = {
    instances: [],
    killVue(id) {
        let self = this
        this.instances = this.instances.filter((instance) => {
            if (instance["_amID"] != id) {
                console.warn("Found vue")
                console.warn("Destroying Vue")
                instance.$destroy()
            }else{
                return instance
            }
        })
    },
    gc() {
        var needsGC = this.instances.every((val, i, arr) => val == undefined)
        if (needsGC) {
            this.instances = []
        }
    },
    killAll() {
        // Kill all Vue instances
        this.instances.forEach((instance) => {
            instance.$destroy()
            instance = null
        })
        this.instances = []
    }
};

class AMEModal {
    constructor({
                    content = "",
                    OnCreate = () => {
                    },
                    OnClose = () => {
                    }
                }) {
        this.content = content
        this.OnClose = OnClose
        this.OnCreate = OnCreate
        this.modal = this.create()
        this.VueModel = null
    }

    create() {
        let self = this
        var backdrop = document.createElement("div")
        var modalWin = document.createElement("div")
        var modalCloseBtn = document.createElement("button")
        var modalContent = document.createElement("div")
        backdrop.classList.add("ameModal-Backdrop")
        modalWin.classList.add("ameModal")
        modalCloseBtn.classList.add("ameModal-Close")
        modalCloseBtn.innerHTML = ("Close")
        modalCloseBtn.addEventListener("click", () => {
            self.close()
            backdrop.remove()
        })
        setInnerHTML(modalContent, this.content)
        modalWin.appendChild(modalCloseBtn)
        modalWin.appendChild(modalContent)
        backdrop.appendChild(modalWin)
        document.body.appendChild(backdrop)
        this.OnCreate()
        return backdrop
    }

    close() {
        if (this.VueModel != null) {
            _vues.killVue(this.VueModel._amID)
        }
        this.OnClose()
        this.modal.remove()
    }

    OnCreate() {

    }

    OnClose() {

    }
};

class AMEVue {
    constructor(options = {}) {
        var configured = {
            unmounted() {
            },
            beforeUnmount() {
            },
            deactivated() {
            }
        }
        var options = Object.assign(configured, options)
        var newVue = new Vue(options)
        newVue._amID = this.getID()
        _vues.instances.push(newVue)
        return newVue
    }

    getID() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4())
    }
};