"use strict";var Conv={rounding:function(t){var e=1;if(t>1e-6)return t<100&&(e=10),t<10&&(e=100),t<.1&&(e=1e4),t<.01&&(e=1e5),t<.001&&(e=1e6),t<1e-4&&(e=1e7),t<1e-5&&(e=1e8),t<1e-6&&(e=1e9),t<1e-7&&(e=1e10),t<1e-8&&(e=1e11),t<1e-9&&(e=1e12),t<1e-10&&(e=1e13),t<1e-11&&(e=1e14),t<1e-12&&(e=1e15),Math.round(t*e)/e}},ViewModel=function(){var t={3:500,4:600,5:650,6:700,7:750};this.ceilingHeight=ko.observable(3),this.velocity=ko.observable(500);ko.computed(function(){var e=this.ceilingHeight(),i=t[e];this.velocity(i||750)},this);this.area=ko.observable(20),this.energyBtu=ko.observable(),this.energyCFM=ko.pureComputed(function(){var t=this.energyBtu()/36;return isNaN(t)?0:Math.round(t)},this);ko.computed(function(){var t=this.area(),e=this.ceilingHeight();this.energyBtu(t*e*195)},this);this.ductSqAreaFt=ko.pureComputed(function(){return Math.round(this.energyCFM()/this.velocity()*100)/100},this),this.resultUnit=ko.observable("in");var e={in:12,mm:304.8};this.ductSqArea=ko.pureComputed(function(){var t=e[this.resultUnit()];return Math.round(this.ductSqAreaFt()*t*t)},this),this.ductDiameter=ko.pureComputed(function(){return Math.round(2*Math.sqrt(this.ductSqArea()/Math.PI))},this);var i=[8,9,10,11,12,13,14];this.ductDimensions=ko.pureComputed(function(){var t=e.in,r=this.ductSqAreaFt()*t*t,n=this.resultUnit(),o="in"===n?1:25.4,u=i.map(function(t){return Math.ceil(t*o)+" x "+Math.ceil(r/t*o)+" "+n});return u},this),this.frictionRate=ko.pureComputed(function(){var t=this.energyCFM(),i=e.in,r=2*Math.sqrt(this.ductSqAreaFt()*i/Math.PI);return Conv.rounding(.109136*Math.pow(t,1.9)/Math.pow(r,5.02)/100)},this)};ko.applyBindings(new ViewModel);