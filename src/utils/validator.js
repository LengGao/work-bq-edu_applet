/**
 * rules: [{ key: 'id', type: 'required' [, regexp: RegExp, validator: (val, key) => { true || false } ] }]
 * message [{ key: 'id', message: '请输入id }]
 */


class Validator {
    constructor(rules = [], messages = []) {
        this.rules = rules
        this.messages = messages
        this.init()
    }
    
    init() {
        this.errorList = []
        this.defaultRule()
    }

    defaultRule() {
        const defaultRules = {
            type: 'required',
            validator: (val, key) => {
                return val.length > 0 && val !== undefined && val !== null
            }
        }

        this.defaultRules = defaultRules
    }
    

    checkFrom(form) {
        const rules = this.rules, errorList = [], messages = this.messages, defaultRules = this.defaultRules
        for(let i = rules.length; i >= 0; i--) {
            let rule = rules[i], key = rule.key, val = form[key], message = messages[key].message, type = rule.type
            if (rules.validator) {
                if (!rules.validator(val, key)) {
                    errorList.push({ key: key, msg: message })
                }
            } else if (rule.regexp) {
                if (!rule.regexp.test(val)) {
                    errorList.push({ key: key, msg: message })
                }
            } else if (type) {
                if(!defaultRules[type].validator(val, key)) {
                    errorList.push({ key: key, msg: message })
                }
            }
        }

        this.errorList = errorList
        return this.showToast()
    }

    showToast() {
        const errorList = this.errorList
        if (errorList.length > 0) {
            let err = errorList[0]
            uni.showToast({ icon: 'none', title: `${err.msg}` })
            console.log("%c from validator:", err.key, err.msg, "color: orange;");
        }
            
    }
}

export default Validator