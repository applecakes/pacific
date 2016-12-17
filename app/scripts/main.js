var Conv = {
    rounding: function (n) {
        var t = 1;
        if (n > 0.000001) {
            if (n < 100) t = 10;
            if (n < 10) t = 100;
            if (n < 0.1) t = 10000;
            if (n < 0.01) t = 100000;
            if (n < 0.001) t = 1000000;
            if (n < 0.0001) t = 10000000;
            if (n < 0.00001) t = 100000000;
            if (n < 0.000001) t = 1000000000;
            if (n < 0.0000001) t = 10000000000;
            if (n < 0.00000001) t = 100000000000;
            if (n < 0.000000001) t = 1000000000000;
            if (n < 0.0000000001) t = 10000000000000;
            if (n < 0.00000000001) t = 100000000000000;
            if (n < 0.000000000001) t = 1000000000000000;
            return Math.round(n * t) / t;
        }
    }
};

var ViewModel = function () {
    var ceilingOptions = {
        3: 500,
        4: 600,
        5: 650,
        6: 700,
        7: 750
    };
    this.ceilingHeight = ko.observable(3);
    this.velocity = ko.observable(500);
    var computedVelocity = ko.computed(function () {
        var ceilingHeight = this.ceilingHeight();
        var option = ceilingOptions[ceilingHeight];
        this.velocity(option || 750);
    }, this);

    this.area = ko.observable(20);

    this.energyBtu = ko.observable();
    this.energyCFM = ko.pureComputed(function () {
        var result = this.energyBtu() / 36;
        return isNaN(result) ? 0 : Math.round(result);
    }, this);
    var computedEnergy = ko.computed(function () {
        var area = this.area();
        var height = this.ceilingHeight();
        this.energyBtu(area * height * 195);
    }, this);

    this.ductSqAreaFt = ko.pureComputed(function () {
        return Math.round(this.energyCFM() / this.velocity() * 100) / 100;
    }, this);

    this.resultUnit = ko.observable('in');
    var resultMultipliers = {
        'in': 12,
        'mm': 304.8
    };
    this.ductSqArea = ko.pureComputed(function () {
        var multiplier = resultMultipliers[this.resultUnit()];
        return Math.round(this.ductSqAreaFt() * multiplier * multiplier);
    }, this);

    this.ductDiameter = ko.pureComputed(function () {
        return Math.round(Math.sqrt(this.ductSqArea() / Math.PI) * 2);
    }, this);

    var ductLengthsIn = [];
    var ductHeightsIn = [8,9,10,11,12,13,14];
    this.ductDimensions = ko.pureComputed(function ()
    {
        var multiplier = resultMultipliers['in'];
        var sqAreaIn = this.ductSqAreaFt() * multiplier * multiplier;
        var resultUnit = this.resultUnit();
        var finalMultiplier = resultUnit === 'in' ? 1 : 25.4;
        var results = ductHeightsIn.map(function (height)
        {
            return Math.ceil(height * finalMultiplier) + " x " 
                + Math.ceil(sqAreaIn / height * finalMultiplier) 
                + " " + resultUnit;
        });
        return results;
    }, this);

    this.frictionRate = ko.pureComputed(function () {
        var q = this.energyCFM();
        var multiplier = resultMultipliers['in'];
        var d = Math.sqrt(this.ductSqAreaFt() * multiplier / Math.PI) * 2;
        return Conv.rounding(0.109136 * Math.pow(q, 1.9) / Math.pow(d, 5.02) / 100);
    }, this);
};

ko.applyBindings(new ViewModel());