var ViewModel = function() {
    this.ceilingOptions = [
        { value: 3, fpm: 500 },
        { value: 4, fpm: 600 },
        { value: 5, fpm: 650 },
        { value: 6, fpm: 700 },
        { value: 7, fpm: 750 }
    ];
    this.ceilingHeight = ko.observable(this.ceilingOptions[0]);
    this.ceilingText = function (item) { return item.value + ' m'; };
    
    this.velocity = ko.observable(500);
    var computedVelocity = ko.computed(function ()
    {
        var ceilingHeight = this.ceilingHeight();
        this.velocity(ceilingHeight.fpm);
    }, this);

    this.area = ko.observable(5);
    this.areaOptions = Array
        .apply(null, {length: 46})
        .map(Number.call, function (item)
        {
            return item + 5;
        });
    this.areaText = function (item) { return item + ' m2'; };

    this.energyBtu = ko.observable();
    this.energyCFM = ko.pureComputed(function ()
    {
        var result = this.energyBtu() * 0.00612862008518;
        return isNaN(result) ? '' : Math.round(result); 
    }, this);
    var computedEnergy = ko.computed(function ()
    {
        var area = this.area();
        var height = this.ceilingHeight().value;
        this.energyBtu(area * height * 195);
    }, this);
};
 
ko.applyBindings(new ViewModel());