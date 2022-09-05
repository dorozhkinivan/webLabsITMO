export class Animation{
    constructor(clickableStatus) {
        this.#clickableStatus = clickableStatus
    }
    #clickableStatus
    #completed = []
    #queue = []
    #animationIsRunning = false
    #runningToDefault = false
    getAnimationIsRunning = ()=>{
        return this.#animationIsRunning;
    }

    addMicroAnimation = ({actionAfterMicroAnimationStatus = 'normal', actionBeforeMicroAnimationStatus = 'normal',actionAfterAndBeforeReversedStatus = true ,elementId = null, property = 0, difference = 0, speed = -1, toDefaultStatus = 'no', statusClickableAfter = null, isReturnableMicroAnimation = true, beforeMicroAnimation = ()=>{}, afterMicroAnimation = ()=>{}} = {})=>{
        this.#queue.push({elementId, property, difference, speed, toDefaultStatus, statusClickableAfter, isReturnableMicroAnimation, beforeMicroAnimation, afterMicroAnimation, actionAfterMicroAnimationStatus, actionBeforeMicroAnimationStatus, actionAfterAndBeforeReversedStatus})
        if (!this.#animationIsRunning){
            this.#animationIsRunning = true;
            const haveMicroAnimation = this.#microAnimationFetch()
            if (haveMicroAnimation !== null)
                this.#execute(haveMicroAnimation)
        }
    }


    #endOfMicroAnimation = (afterMicroAnimation, element, code, end, clickableStatus) => {
        eval(code + ' = end.toString() + "px"')
        afterMicroAnimation()
        const microAnimation = this.#microAnimationFetch();
        if(clickableStatus !== null)
            this.#clickableStatus.status = clickableStatus
        if (microAnimation === null){
            this.#animationIsRunning = false;
            return;
        }
            this.#execute(microAnimation)
    }

    #microAnimationFetch = ()=>{
        let microAnimation;
        if (!this.#runningToDefault) {
            if (this.#queue.length === 0 || (this.#queue[0].toDefaultStatus === "action" && this.#completed.length === 0))
                return null;
            if (this.#queue[0].toDefaultStatus === "no" || (this.#completed.length === 0 && this.#queue[0].toDefaultStatus === "before")) {
                microAnimation = this.#queue[0];
                if (microAnimation.isReturnableMicroAnimation)
                    this.#completed.unshift(microAnimation)
                this.#queue.shift()
                return microAnimation;
            }
            this.#runningToDefault = true;
            if (this.#queue[0].toDefaultStatus === "action")
                this.#queue.shift()
            microAnimation = this.#completed[0]
            this.#completed.shift()
            return microAnimation;
        }
        else {
            if (this.#completed.length === 0){
                this.#runningToDefault = false;
                if (this.#queue.length !== 0){
                    microAnimation = this.#queue[0]
                    this.#queue.shift()
                    return microAnimation;
                }
                return null;
            }
            microAnimation = this.#completed[0]
            this.#completed.shift()
            return microAnimation;
        }

    }

    #execute = (microAnimation) => {
        let afterAction = ()=>{};
        if (this.#runningToDefault){
            if (microAnimation.actionAfterAndBeforeReversedStatus) {
                if (microAnimation.actionAfterMicroAnimationStatus === 'normal' || microAnimation.actionAfterMicroAnimationStatus === 'back')
                    microAnimation.afterMicroAnimation()
                if (microAnimation.actionBeforeMicroAnimationStatus === 'normal' || microAnimation.actionBeforeMicroAnimationStatus === 'back')
                    afterAction = microAnimation.beforeMicroAnimation
            }
            else {
                if (microAnimation.actionBeforeMicroAnimationStatus === 'normal' || microAnimation.actionBeforeMicroAnimationStatus === 'back')
                    microAnimation.beforeMicroAnimation()
                if (microAnimation.actionAfterMicroAnimationStatus === 'normal' || microAnimation.actionAfterMicroAnimationStatus === 'back')
                    afterAction = microAnimation.afterMicroAnimation
            }
        }
        else{
            if (microAnimation.actionBeforeMicroAnimationStatus === 'normal' || microAnimation.actionBeforeMicroAnimationStatus === 'forward')
                microAnimation.beforeMicroAnimation()
            if (microAnimation.actionAfterMicroAnimationStatus === 'normal' || microAnimation.actionAfterMicroAnimationStatus === 'forward')
                afterAction = microAnimation.afterMicroAnimation
        }

        if (!this.#runningToDefault && microAnimation.isReturnableMicroAnimation)
            microAnimation.statusClickableBefore = this.#clickableStatus.status;
        let code = ''
        const element = document.getElementById(microAnimation.elementId)

        switch (microAnimation.property)
        {
            case 'bottom':
                code = 'element.style.marginBottom'
                break
            case 'right':
                code = 'element.style.marginRight'
                break
            case 'left':
                code = 'element.style.marginLeft'
                break
            case 'top':
                code = 'element.style.marginTop'
                break
            default:
                throw new Error('no key')
        }
        let now = Number(eval(code).split("px")[0])
        let end = now
        end += this.#runningToDefault ? -microAnimation.difference : microAnimation.difference;
        const direction = now > end;
        const speed = microAnimation.speed
        if (speed === -1){
            this.#endOfMicroAnimation(afterAction, element, code, end,this.#runningToDefault ? microAnimation.statusClickableBefore : microAnimation.statusClickableAfter)
            return;
        }
        const timerReq = setInterval(()=>{
            if (now > end && now - end > speed && direction === true){
                now -= speed;
                eval(code + ' = now.toString() + "px"')
            }
            else if (now < end && end - now > speed && direction === false){
                now += speed;
                eval(code + ' = now.toString() + "px"')
            }
            else {
                clearInterval(timerReq);
                this.#endOfMicroAnimation(afterAction, element, code, end, this.#runningToDefault ? microAnimation.statusClickableBefore : microAnimation.statusClickableAfter)
            }
        }, 15)
    }
}