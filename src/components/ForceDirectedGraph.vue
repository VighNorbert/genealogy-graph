<template>
    <div class="legend" v-if="uniqueGroups.length">
        <h6>Legend:</h6>
        <ul>
            <li v-for="group in uniqueGroups" :key="group">
                <span class="legend-circle" :style="{backgroundColor: color(group)}"></span> {{ group }}
            </li>
        </ul>
    </div>
    <div class="map-canvas card" id="force">
    </div>
</template>

<script>
import * as d3 from 'd3';
import * as bootstrap from 'bootstrap';
import * as zoom from 'd3-zoom';
export default {
  name: 'ForceDirectedGraph',
  data() {
    return {
      layout: 'force',
      nodes: null,
      links: null,
      colors: ['#ce3b3d', '#377eb8'],
      isDrag: false,
      simulationRunning: true,
      simulation: null,
      radialCircles: null,
      uniqueGroups: [],
      color: null,
      svg: null,
      root: null
    };
  },
  props: {
    allnodes: Array,
    alllinks: Array,
    selection: String,
    startYearId: Number,
    endYearId: Number,
    linkForceMultiplierInput: String,
    chargeForceMultiplierInput: String,
    radialForceMultiplierInput: String,
    centeringForceMultiplierInput: String,
    radiusInput: String
  },
  computed: {
    zoom() {
      return zoom
          .zoom()
          .scaleExtent([0.25, 8])
          .on("zoom", this.zoomed);
    },
    linkForceMultiplier() {
      return parseFloat(this.linkForceMultiplierInput);
    },
    chargeForceMultiplier() {
      return parseFloat(this.chargeForceMultiplierInput);
    },
    radialForceMultiplier() {
      return parseFloat(this.radialForceMultiplierInput);
    },
    centeringForceMultiplier() {
      return parseFloat(this.centeringForceMultiplierInput);
    },
    radius() {
      return parseFloat(this.radiusInput);
    },
    nodesData() {
      console.log("new nodesData", this.allnodes);
      return this.allnodes;
    },
    linksData() {
      console.log("new linksData", this.alllinks);
      return this.alllinks;
    },
  },
  watch: {
    nodesData() {
      this.updateMap();
      this.simulation.restart().alpha(1).alphaTarget(0);
    },
    selection() {
      if (this.selection !== this.root && this.selection !== 'default') {
        this.switchToRadial(this.selection);
      }
      if (this.selection === 'default') {
        this.switchToForce();
      }
    },
    linkForceMultiplier() {
      this.updateMap();
    },
    chargeForceMultiplier() {
      this.updateMap();
    },
    radialForceMultiplier() {
      this.updateMap();
    },
    centeringForceMultiplier() {
      this.updateMap();
    },
    radius() {
      this.updateMap();
    },
  },
  async mounted() {
    this.uniqueGroups = ['Female', 'Male'];
    this.color = d3.scaleOrdinal(d3.sort(d3.map(this.nodesData, d => d.group)), this.colors);

    this.updateMap();
  },
  emits: ['node-clicked'],
  methods: {
    zoomed(event) {
      this.svg
          .selectAll("g.apply-zoom")
          .attr("transform", event.transform);
    },

    updateMap() {
      document.querySelector(".map-canvas").innerHTML = "";

      this.drawGraph();
    },

    drawGraph() {
      let chart = this.ForceGraph();

      document.querySelector(".map-canvas").appendChild(chart);

      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'hover',
        delay: {show: 300, hide: 0}
      }));
    },

    toggleLayout() {
      if (this.layout === 'force') {
        this.layout = 'radial';
      } else {
        this.layout = 'force';
      }
    },

    createSvg(width, height) {
      this.svg = d3.create("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [-width / 2, -height / 2, width, height])
          .attr("style", "width: 100%; height: 50%;");

      const defs = this.svg.append("defs");
      defs.append("marker")
          .attr("id", "arrow")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -0.5)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("path")
          .attr("fill", "#000")
          .attr("fill-opacity", 0.2)
          .attr("d", "M0,-5L10,0L0,5");

      defs.append("marker")
          .attr("id", "arrow-faded")
          .attr("viewBox", "-5 -6 10 10")
          .attr("refX", 15)
          .attr("refY", -0.5)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("path")
          .attr("fill", "#000")
          .attr("fill-opacity", 0.05)
          .attr("d", "M0,-5L10,0L0,5");

      defs.append("marker")
          .attr("id", "arrow-full")
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -0.5)
          .attr("markerWidth", 5)
          .attr("markerHeight", 5)
          .attr("orient", "auto")
          .append("path")
          .attr("fill", "#000")
          .attr("fill-opacity", 1)
          .attr("d", "M0,-5L10,0L0,5");

      let p = defs.selectAll("pattern")
          .data(this.nodesData)
          .join("pattern")
          .attr("height", "100%")
          .attr("width", "100%")
          .attr("patternContentUnits", "objectBoundingBox");
      p.append("rect")
          .attr("x", "0")
          .attr("y", "0")
          .attr("height", "1")
          .attr("width", "1")
          .attr("fill", d => this.color(d.group));

    },


    ForceGraph() {
      let width = 1200, height = 800;

      const color = d3.scaleOrdinal(d3.sort(d3.map(this.nodesData, d => d.group)), this.colors);

      this.createSvg(width, height);

      this.svg.call(this.zoom);

      this.radialCircles = this.svg.append("g")
          .attr("id", "radial-circles")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
          .attr("stroke-width", 1);

      const links = this.svg.append("g")
          .attr("id", "links")
          .attr("class", "apply-zoom")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .selectAll("path")
          .data(this.linksData)
          .join("path")
          .attr("stroke", "#000")
          .attr("stroke-width", 1);
      this.links = links;

      const nodes = this.svg.append("g")
          .attr("id", "nodes")
          .attr("class", "apply-zoom")
          .attr("stroke", "#000")
          .attr("stroke-width", 1.5)
          .selectAll("circle")
          .data(this.nodesData)
          .join("circle");
      this.nodes = nodes;

      if (this.simulation !== null) {
        this.simulation
            .force("link", null)
            .force("charge", null)
            .force("collide", null)
            .force("radial", null)
            .force("x", null)
            .force("y", null);
      }

      this.simulation = d3.forceSimulation(this.nodesData)
          .force("charge", d3.forceManyBody().strength(-50 * this.chargeForceMultiplier));
      this.simulation
          .on("tick", () => {
            links
                .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x).attr("y2", d => d.target.y)
                .attr("d", linkArc);
            this.simulation.nodes()
                .forEach(d => {
                  if (!this.isDrag) {
                    if (d.code === this.root) {
                      d.fx = 0;
                      d.fy = 0;
                    } else {
                      d.fx = undefined;
                      d.fy = undefined;
                    }
                  }
                  d.x = Math.max(-20 * this.radius, Math.min(20 * this.radius, d.x));
                  d.y = Math.max(-20 * this.radius, Math.min(20 * this.radius, d.y));
                });
            nodes
                .attr("cx", d => d.x).attr("cy", d => d.y);
          });

      this.nodes
          .attr("fill", d => color(d.group))
          .attr("stroke", d => color(d.group))
          .attr("data-bs-toggle", "tooltip").attr("title", d => d.name)
          .attr("r", 5)
          .call(drag(this.simulation))
          .on("click", (event, node) => this.nodeClicked(node.code));

      function linkArc(d) {
        const r = 2 * Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
        return `M${d.source.x},${d.source.y}
                A${r},${r} 0 0,1 ${d.target.x},${d.target.y}`;
      }

      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
          this.isDrag = true;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
          this.isDrag = false;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
      }

      if (this.selection !== 'default') {
        this.switchToRadial(this.selection);
      } else {
        this.switchToForce();
      }

      return Object.assign(this.svg.node(), {scales: {color}});
    },

    switchToForce() {
      this.root = null;
      this.links.attr("stroke-opacity", 0.2)
          .attr("marker-end", `url(${new URL(`#arrow`, location)})`);
      this.radialCircles
          .attr("class", "apply-zoom d-none")
          .data([]);
      this.simulation
          .force("link", null)
          .force("x", null)
          .force("y", null)
          .force("radial", null)
          .force("charge", d3.forceManyBody().strength(-50 * this.chargeForceMultiplier))
          .force("link", d3.forceLink(this.linksData)
              .id(({index: i}) => d3.map(this.nodesData, d => d.code)[i])
              .strength(.1 * this.linkForceMultiplier))
          .force("x", d3.forceX().strength(0.05 * this.centeringForceMultiplier))
          .force("y", d3.forceY().strength(0.05 * this.centeringForceMultiplier));
      this.simulation.restart().alpha(1).alphaTarget(0);
    },

    switchToRadial(nodeCode) {
      this.root = nodeCode;
      let {layers, tree} = this.buildTree(nodeCode);
      this.links
          .attr("stroke-opacity", i => (
                  tree.has(i.source.code) && tree.get(i.source.code).includes(i.target.code)
              ) ? 1 : 0.05
          )
          .attr("marker-end", i => {
            if (
                tree.has(i.source.code) && tree.get(i.source.code).includes(i.target.code)
            ) {
              return `url(${new URL(`#arrow-full`, location)})`;
            }
            return `url(${new URL(`#arrow-faded`, location)})`;
          });
      const radiuses = [...layers.map((d, i) => (i + 1) * this.radius)];

      this.radialCircles
          .attr("class", "apply-zoom")
          .selectAll("circle")
          .data(radiuses)
          .join("circle")
          .attr("r", d => d)
          .attr("x", 0)
          .attr("y", 0)
          .attr("fill", "none");
      this.simulation
          .force("link", null)
          .force("x", null)
          .force("y", null)
          .force("radial", null)
          .force("link", d3.forceLink(this.linksData)
              .id(({index: i}) => d3.map(this.nodesData, d => d.code)[i])
              .strength(link => (
                      tree.has(link.source.code) && tree.get(link.source.code).includes(link.target.code)
                  ) ? 0.2 * this.linkForceMultiplier : 0
              ))
          .force("x", d3.forceX().strength(i => (i.code === nodeCode) ? .5 * this.centeringForceMultiplier : 0))
          .force("y", d3.forceY().strength(i => (i.code === nodeCode) ? .5 * this.centeringForceMultiplier : 0))
          .force("charge", null)
          .force("radial", d3.forceRadial()
              .strength(3 * this.radialForceMultiplier)
              .radius(i => {
                let n = layers.findIndex(e => e.includes(i.code));
                (n === -1) ? n = layers.length : n;
                return n * this.radius;
              }));
      setTimeout(() => {
        this.simulation.force("charge", d3.forceManyBody().strength(-50 * this.chargeForceMultiplier));
      }, 5000);
      this.simulation.restart().alpha(0.7);
    },

    nodeClicked(nodeCode, changeLayout = true) {
      if (changeLayout && (nodeCode === this.root || this.layout === "force")) {
        this.toggleLayout();
      }
      if (this.layout === "force") {
        this.$emit("node-clicked", 'default');
        this.switchToForce();
      } else {
        this.$emit("node-clicked", nodeCode);
        this.switchToRadial(nodeCode);
      }
    },

    getNeighbors(node) {
      let neighbors = [];
      for (let link of this.linksData.map(d => [d.source.code, d.target.code, d.type])) {
        if (link[0] === node && link[2] === 'parent') {
          neighbors.push(link[1]);
        }
      }
      return neighbors;
    },

    buildTree(root) {
      let tree = new Map();
      let layers = [];
      let visited = new Set();
      let queue = [root];
      let currentLayer = 0;
      while (queue.length > 0) {
        let nextQueue = [];
        layers[currentLayer] = [];
        for (let node of queue) {
          visited.add(node);
          layers[currentLayer].push(node);
          for (let neighbor of this.getNeighbors(node)) {
            if (!visited.has(neighbor) && !nextQueue.includes(neighbor) && !queue.includes(neighbor)) {
              if (tree.has(node)) {
                tree.get(node).push(neighbor);
              } else {
                tree.set(node, [neighbor]);
              }
              nextQueue.push(neighbor);
            }
          }
        }
        queue = nextQueue;
        currentLayer++;
      }
      return {
        layers,
        tree
      };
    },
  }
}
</script>

<style>
circle {
    cursor: pointer;
}

.legend {
    position: absolute;
    margin: 16px 32px;
    padding: 16px;
    background-color: #f8f8ffaa;
    box-shadow: 0 0 8px #00000055;
    border-radius: 8px;
}

.legend ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.legend ul .legend-circle {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    border-radius: 50%;
}
</style>
