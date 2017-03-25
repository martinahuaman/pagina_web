var Writer;
!function() {
    function e(e, t) {
        for (var n in t) e[n] || (e[n] = t[n])
    }

    function t(e) {
        for (var t = [], n = e.length, i = 0; n > i; i++) t.push(e[i]);
        return t
    }
    Writer = function(t) {
        this.options = "undefined" == typeof t ? {} : t, e(this.options, n), this.writerTimeout = null, this.deleteTimeout = null, this.commandIndex = -1, this.$writer = $(".writer"), this.command = this.$writer.data("writer-command") || this.options.command, this.speed = this.$writer.data("writer-speed") || this.options.speed, this.speeds = {
            veryfast: 30,
            fast: 100,
            slow: 750
        }, this.$writer.length && this.initialize()
    };
    var n = {
        command: "gem install braintree",
        speed: "fast",
        deleteWait: 2e3,
        newCommandWait: 500,
        deleteSpeed: 75
    };
    Writer.prototype.initialize = function() {
        var e = this.$writer.text();
        this.commandIsArray() && this.setupWritingCycle(), e.length ? this.handlePrepopulatedText(e) : (this.reset(), this.write())
    }, Writer.prototype.commandIsArray = function() {
        return "[object Array]" === Object.prototype.toString.call(this.command) ? !0 : /^\[('|").+('|")\,.*\]$/.test(this.command) ? (this.command = JSON.parse(this.command.replace(/'/g, '"')), !0) : !1
    }, Writer.prototype.setupWritingCycle = function() {
        this.commands = this.command, this.commandStore = t(this.commands)
    }, Writer.prototype.getRandomDuration = function(e) {
        return e = "undefined" == typeof e ? this.speeds[this.speed] : e, Math.floor(Math.random() * e)
    }, Writer.prototype.getRandomIndex = function() {
        return Math.floor(Math.random() * this.commands.length)
    }, Writer.prototype.write = function() {
        this.commands ? this.selectNewCommand() : this.writeCommand()
    }, Writer.prototype.handlePrepopulatedText = function(e) {
        var t = this;
        this.assignPrepopulatedTextToIndex(e), this.deleteTimeout = setTimeout(function() {
            t.deleteCommand(e)
        }, this.options.deleteWait)
    }, Writer.prototype.assignPrepopulatedTextToIndex = function(e) {
        var t = $.inArray(e, this.commands); - 1 !== t && (this.commandIndex = t)
    }, Writer.prototype.selectNewCommand = function() {
        return this.commandIndex = this.getRandomIndex(), this.command === this.commands[this.commandIndex] ? (this.selectNewCommand(), !1) : (this.command = this.commands[this.commandIndex], this.writeCommand(), void 0)
    }, Writer.prototype.reset = function() {
        this.$writer.html(" "), clearTimeout(this.writerTimeout)
    }, Writer.prototype.writeCommand = function(e) {
        clearTimeout(this.writerTimeout), e = e || 0;
        var t = this;
        this.writerTimeout = setTimeout(function() {
            e < t.command.length ? t.handleIncompleteCommand(e) : t.handleCompleteCommand()
        }, t.getRandomDuration())
    }, Writer.prototype.handleIncompleteCommand = function(e) {
        this.$writer.text(this.command.substring(0, e + 1)), e++, this.writeCommand(e)
    }, Writer.prototype.handleCompleteCommand = function() {
        if (!this.commands) return !1;
        var e = this;
        this.deleteTimeout = setTimeout(function() {
            e.deleteCommand(e.command)
        }, this.options.deleteWait)
    }, Writer.prototype.deleteCommand = function(e) {
        clearTimeout(this.deleteTimeout);
        var t = this;
        this.deleteTimeout = setTimeout(function() {
            e.length > 0 ? t.handleRemainingCommand(e) : t.handleDeletedCommand()
        }, t.getRandomDuration(t.options.deleteSpeed))
    }, Writer.prototype.handleRemainingCommand = function(e) {
        var t = e.substring(0, e.length - 1);
        this.$writer.text(t), this.deleteCommand(t)
    }, Writer.prototype.handleDeletedCommand = function() {
        var e = this;
        this.writerTimeout = setTimeout(function() {
            return e.commands ? (e.deleteCommandAtCurrentIndex(), e.repopulateCommands(), e.write(), void 0) : (e.write(), !1)
        }, this.options.newCommandWait)
    }, Writer.prototype.deleteCommandAtCurrentIndex = function() {
        return -1 === this.commandIndex ? !1 : (this.commands.splice(this.commandIndex, 1), void 0)
    }, Writer.prototype.repopulateCommands = function() {
        return this.commands.length > 0 ? !1 : (this.commands = t(this.commandStore), void 0)
    }
}();


$(document).ready(function() {
    new Writer
});
