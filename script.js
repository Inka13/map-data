
      document.addEventListener('DOMContentLoaded',function(){
      req=new XMLHttpRequest();
      req.open("GET",'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json',true);
      req.send();
      req.onload=function(){
        const coords = [];
        json=JSON.parse(req.responseText);
        json.features.forEach(function(d) {
          if(d.geometry) {
            var year = d.properties.year ? d.properties.year.split('-') : ["unknown"];
            coords.push([d.geometry.coordinates[0], d.geometry.coordinates[1], Number(d.properties.mass), d.properties.name, year[0] , d.properties.recclass]);
          }
        });
        var width = '98vw';
        var height = '96vh';
        

      console.log(d3.min(coords, (d) => d[0]));

      var projection = d3.geo.mercator();
      
      var svg = d3.select("body").append("svg")
          .attr("width", width)
          .attr("height", height);
      

      var path = d3.geo.path()
          .projection(projection);
      var g = svg.append("g");
      
      d3.json("https://raw.githubusercontent.com/cszang/dendrobox/master/data/world-110m2.json", function(error, topology) {
          g.selectAll("path")
            .data(topojson.object(topology, topology.objects.countries)
                .geometries)
          .enter()
            .append("path")
            .attr("d", path)
      });

      var tooltip = d3.select("#tooltip");
      svg.selectAll("circle")
                 .data(coords)
                 .enter()
                 .append("circle")
                 .attr('cx', function(d) { return projection([d[0],d[1]])[0] })
                  .attr('cy', function(d) { return projection([d[0],d[1]])[1] })
                 .attr("r", function(d) { 
                  if(d[2]<10000) return 1.5;
                  else if(d[2]<100000) return 3;
                  else if(d[2]<1000000) return 5;
                  else if(d[2]<10000000) return 10;
                  else return 20; })
                 .attr("fill", "rgba(255, 50, 50, 0.8)")
                 .attr("class", "circle")
                 .on("mouseover", (d) => {
              tooltip.style("display", "block");
              tooltip.html(d[3] + ', ' + d[4] + ', class: ' + d[5])
                .style("left", (d3.event.x -15) + "px")
                .style("top", (d3.event.y - 38) + "px");
            })
            .on("mouseout", (d) => {
              tooltip.style("display", "none");
            });
      };
  });
