$(function () {

	var DEFAULTS = {
		tick_count : 10,
		x_tick_count : 16,

		top_circle_radius : 6,

		brush_height : 200,

		graph_width : 800,
		graph_height : 500,
		legend_width : 0
	};

	var margin = { top : 20, right : 20, bottom : 50, left : 60 },
		width = DEFAULTS.graph_width - margin.left - margin.right,
		height = DEFAULTS.graph_height - margin.top - margin.bottom;

	var Item = function ( age, dtd, gender, pathologicStage ) {
		this.age = age;
		this.dtd = dtd;
		this.gender = gender;
		this.pathologicalStage = pathologicStage;
	};

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
	var svg = d3.select(".scatter-plot").append("svg")
		.attr("width", width + margin.left + margin.right + DEFAULTS.legend_width)
		.attr("height", height + margin.top + margin.bottom + DEFAULTS.brush_height)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	var STAGES = [
		'I or II NOS',
		'Not available',
		'Stage 0',
		'Stage I',
		'Stage IA',
		'Stage IB',
		'Stage II',
		'Stage IIA',
		'Stage IIB',
		'Stage IIC',
		'Stage III',
		'Stage IIIA',
		'Stage IIIB',
		'Stage IIIC',
		'Stage IS',
		'Stage IV',
		'Stage IVA',
		'Stage IVB',
		'Stage IVC',
		'Stage Tis',
		'Stage X'
	];
	var color20 = d3.scaleOrdinal(d3.schemeCategory20c);

	var data = [];

	d3.tsv("../tcga-cases.tsv", function ( error, dat ) {
		if ( error ) {
			throw error;
		}

		for ( var i = 0; i < dat.length; i++ ) {
			data.push(new Item(+dat[i].case_age_at_diagnosis, +dat[i].case_days_to_death, dat[i].case_gender, dat[i].case_pathologic_stage));
		}


		var xScale = d3.scaleLinear()
			.domain([
				d3.min(data, function ( d ) {
					return d.dtd;
				}),
				d3.max(data, function ( d ) {
					return d.dtd;
				})
			])
			.range([
				0,
				width
			]);

		var yScale = d3.scaleLinear()
			.domain([
				d3.min(data, function ( d ) {
					return d.age;
				}),
				d3.max(data, function ( d ) {
					return d.age;
				})
			])
			.range([
				height,
				0
			]);

		var yAxisGen = d3.axisLeft().scale(yScale);
		var xAxisGen = d3.axisBottom().scale(xScale);

		var yAxis = svg.append('g').attr("class", "y axis");
		var xAxis = svg.append('g').attr("class", "x axis").attr("transform", "translate(0," + height + ")");

		yAxis.call(yAxisGen);
		xAxis.call(xAxisGen);

		// drugaciji shape za gender & drugacija boja za razlicite case_pathologic_stage
		var symbol = d3.symbol();

		var DOT_SHAPE = symbol.type(function ( d ) {

			if ( d.gender === 'MALE' ) {
				return d3.symbolTriangle;
			}

			return d3.symbolCircle;

		});

		svg.selectAll("circle")
			.data(data)
			.enter()
			.append("path")
			.attr('d', DOT_SHAPE)
			.attr("transform", function ( d ) {
				return "translate(" + xScale(d.dtd) + "," + yScale(d.age) + ")";
			})
			.style("stroke", function ( d ) {
				var index = STAGES.indexOf(d.pathologicalStage);
				return color20(index);
			})
			.style("fill", "none");

		svg.append("text")
			.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
			.attr("transform", "translate("+ (-35) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
			.attr('class', 'axis-label')
			.attr('fill', 'white')
			.text("Age at diagnosis");

		svg.append("text")
			.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
			.attr("transform", "translate("+ (width/2) +","+(height+(40))+")")  // centre below axis
			.attr('class', 'axis-label')
			.attr('fill', 'white')
			.text("Days to death");


		console.log("Max age: " + d3.max(data, function ( d ) {
				return d.age;
			}));
		console.log("Min age: " + d3.min(data, function ( d ) {
				return d.age;
			}));
		console.log("Max dtd: " + d3.max(data, function ( d ) {
				return d.dtd;
			}));
		console.log("Min dtd: " + d3.min(data, function ( d ) {
				return d.dtd;
			}))
	});

});
