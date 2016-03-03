/**
 * Slot
 * Created by Eric on 16/3/3.
 */

(function ($) {


    var Slot = function (el, option) {

        this.spinSpeed = option.spinSpeed || 300;
        this.$el = $(el);
        this.$item = this.$el.find(option.item);
        this.result = [];
        this.top = option.top;
        this.startPosition = option.startPosition;
        this.awardPosition = option.awardPosition;
        this.bottom = option.bottom;
        this.loop = option.loop;
        this.slowDownLoop = option.slowDownLoop;
        this._loop = [0, 0, 0];
        this.finishCallback = option.finishCallback;
        this.closeListenServer = false;
        this.finisherCount = 0;
        this.spinLowSpeed = 1000
    };

    Slot.prototype = {

        start: function() {
            var that = this;
            this.result = [];
            this._loop = [0, 0, 0];
            this.finisherCount = 0;
            this.$item.each(function(i) {
                $(this).css('top', that.startPosition[i]);
                that.spin(i);
            });
        },

        spin: function (i) {

            var that = this, spinSpeed;

            if(this._loop[i] > 0) {
                this.$item.eq(i).css('top', option.bottom);
                if(this._loop[i] >= this.loop[i]) {
                    spinSpeed = this.spinLowSpeed;
                } else {
                    spinSpeed = this.spinSpeed;
                }
            } else {
                spinSpeed = this.getSpeed(this.startPosition[i]);
            }

            this.$item.eq(i).animate({top: this.top}, spinSpeed, 'linear', function () {
                that._loop[i] ++;
                that.lowerSpeed(i);
            });

            return this;
        },

        lowerSpeed: function (i) {

            if(this._loop[i] > this.loop[i]) {
                if(!this.result.length) {
                    this.closeListenServer = true;
                    this.generateLoserResult();
                }
                this.finish(i);
            } else {
                this.spin(i);
            }
        },

        getSpeed: function (pos) {

            var ratio = (this.top - pos) / (this.top - this.bottom);
            return this.spinSpeed * ratio;
        },

        finish: function (i) {
            var that = this;
            this.finisherCount ++;
            this.$item.eq(i).css('top', option.bottom).animate({top: this.result[i]}, this.spinLowSpeed, 'linear', function() {
                if(that.finisherCount == 0 && $.isFunction(that.finishCallback)) {
                    that.finishCallback.call(that, that.result);
                }
            });
        },

        setResult: function (result) {
            if(!this.closeListenServer) {
                this.result = result;
            }
        },

        generateLoserResult: function() {
            var awardPosition = this.awardPosition.slice(), that = this;
            this.$item.each(function(i) {
                that.result[i] = (function(min, max) {
                    return awardPosition[Math.floor(Math.random() * (max - min) + min)];
                })(0, awardPosition.length -1);
                var index = awardPosition.indexOf(that.result[i]);
                awardPosition.splice(index, 1);
            });
        }
    };


    $.fn.slot = function (methodOrOptions) {

        return new Slot(this, methodOrOptions);

    };
})(jQuery);
