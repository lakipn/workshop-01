$(function () {

	var DEFAULTS = {
		tick_count : 10,
		x_tick_count : 16,

		top_circle_radius : 6,

		brush_height : 200,

		graph_width : 800,
		graph_height : 500
		legend_width: 0
	};

	var margin = { top : 20, right : 20, bottom : 50, left : 60 },
		width = DEFAULTS.graph_width - margin.left - margin.right,
		height = DEFAULTS.graph_height - margin.top - margin.bottom;

	var item = function(age, dtd) {
		this.age = age;
		this.dtd = dtd;
	};

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin

    var svg = d3.select(".scatter-plot").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + DEFAULTS.brush_height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

	var data = [];
	d3.tsv("../tcga-cases.tsv", function(error, dat) {
		if(error) {
			throw error;
		}

		for(var i = 0; i < dat.length; i++) {
			data.push(new item(+dat[i].case_age_at_diagnosis, +dat[i].case_days_to_death));
		}
	});



});
