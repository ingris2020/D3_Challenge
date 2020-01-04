function makeResponsive() {
    //Remove and replace with new
    var svgArea = d3.select("body").select("svg");
    
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }    
    // set the dimensions and margins of the graph
    var svgWidth = 800;
    var svgHeight = 500;
    
    var margin = {top: 20, right: 40, bottom: 40, left: 50};
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //Read the data
    d3.csv("data.csv").then(function(workData) {
        //parse data
        workData.forEach(function(data) {
            data.id = data.id;
            data.state = data.state;
            data.abbr = data.abbr;
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.healthcare = +data.healthcare;
            data.healthcareLow = +data.healthcareLow;
            data.healthcareHigh = +data.healthcareHigh;
            data.obesity = +data.obesity;
            data.obesityLow = +data.obesityLow;
            data.obesityHigh = +data.obesityHigh;
            data.smokes = +data.smokes;
            data.smokesLow = +data.smokesLow;
            data.smokesHigh = +data.smokesHigh;
            
            console.log(data.abbr);
        }); console.log(workData);
    
        //Scale functions
        var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(workData, d => d.poverty)])
        .range([4, width]);
        
        var yLinearScale = d3.scaleLinear()
          .domain([4, d3.max(workData, d => d.healthcare)])
          .range([height, 4]);
        
        //Axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);  
        
        //Append Axes to chart
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
    
        chartGroup.append("g")
          .call(leftAxis);
        
        var theCircles = svg.selectAll("g theCircles")
        //Create Circles
        //var circlesGroup = chartGroup.selectAll("circle")
        .data(workData)
        .enter();

        theCircles
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".8")
        
       theCircles
        .append("text")
        .text(function(d) {return d.abbr;})
        .attr("text-anchor", "middle")
        .style("font", "10px arial")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", ".5em")
        .attr("class", "abbr")
        .attr("fill", "white");
    
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([70, -60])
          .html(function(d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
          });
    
        //Add tooltip in the chart
        chartGroup.call(toolTip);
        
        //Event listeners 
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
          })
    
          // onmouseout event
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
          
        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 45 + margin.top + 30)
          .attr("x", 0 - (height / 2.0))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Lacks Healthcare (%)");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("In Poverty (%)");
       
    }).catch(function(error) {
        console.log(error);
    }); 
    
    }
    
    // When the browser loads, makeResponsive() is called.
    makeResponsive();
    
    // When the browser window is resized, makeResponsive() is called.
    d3.select(window).on("resize", makeResponsive);
    
        
    
    