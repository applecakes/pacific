var ViewModel = function() {
    this.ceilingHeight = ko.observable(3);
    var velocityLookup = {
        '3': 500,
        '4': 600,
        '5': 650,
        '6': 700,
        '7': 750 
    };
    this.velocity = ko.observable(500);
    var computedVelocity = ko.computed(function ()
    {
        var ceilingHeight = Math.floor(this.ceilingHeight());
        var velocity = velocityLookup[ceilingHeight];
        this.velocity(velocity);
    }, this);

    this.area = ko.observable(5);
    this.areaUnit = ko.observable('m2');

    this.energyBtu = ko.observable();
    this.energyCFM = ko.pureComputed(function ()
    {
        var result = this.energyBtu() * 0.00612862008518;
        return isNaN(result) ? '' : Math.round(result); 
    }, this);
    var computedEnergy = ko.computed(function ()
    {
        var area = this.area();
        var multiplier = this.areaUnit() === 'm2' ? 600 : 195;
        this.energyBtu(area * multiplier);
    }, this);
};

ko.bindingHandlers.sliderValue = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var field = valueAccessor();
        $(element).slider().on('slide', function (data)
        {
            field(data.value);
        });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).slider('setValue', ko.unwrap(valueAccessor()));
    },
};
 
ko.applyBindings(new ViewModel());