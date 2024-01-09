<template>
    <nav>
        <h1 class="m-0"><strong>Geneo</strong>Viz</h1>
    </nav>
    <main>
        <svg v-if="!forceSetup" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
             fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16" @click="toggleForceSetup()">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
        </svg>

        <div v-if="forceSetup" id="force-setup">
            <section>
              <div class="d-flex justify-content-between">
                <h2>Setup</h2>
                <button type="button" class="btn-close" @click="toggleForceSetup()"></button>
              </div>
              <div class="row">
                <div class="col-3 d-flex align-items-center">
                  <label for="selection" class="mb-2">
                    GED file
                  </label>
                </div>
                <div class="col-9">
                  <input type="file" id="selection" name="selection" class="form-control mb-2"
                         accept=".ged" @change="loadSelection($event)">
                </div>
              </div>
            </section>

            <h3>Force Multipliers</h3>
            <small>Altering the forces might result in an unstable visualisation.</small>


            <div class="form-group row">
                <div class="col-5">
                    <label for="linkForceScaling">Scaling of Link Force</label>
                </div>
                <div class="col-7">
                    <select id="linkForceScaling" name="linkForceScaling" v-model="linkForceScaling"
                            class="form-select">
                        <option value="equal">All equal</option>
                        <option value="log">Log scaling</option>
                        <option value="log10">Log10 scaling</option>
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-5">
                    <label for="linkForceMultiplier">Link</label>
                    <small>{{ linkForceMultiplier }}x</small>
                </div>
                <div class="col-7">
                    <input type="range" id="linkForceMultiplier" class="form-range"
                           name="linkForceMultiplier" min="0.01" max="10" step="0.01"
                           v-model="linkForceMultiplier">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-5">
                    <label for="chargeForceMultiplier">Charge</label>
                    <small>{{ chargeForceMultiplier }}x</small>
                </div>
                <div class="col-7">
                    <input type="range" id="chargeForceMultiplier" class="form-range"
                           name="chargeForceMultiplier" min="0.01" max="10" step="0.01"
                           v-model="chargeForceMultiplier">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-5">
                    <label for="centeringForceMultiplier">Centering</label>
                    <small>{{ centeringForceMultiplier }}x</small>
                </div>
                <div class="col-7">
                    <input type="range" id="centeringForceMultiplier" class="form-range"
                           name="centeringForceMultiplier" min="0.01" max="10" step="0.01"
                           v-model="centeringForceMultiplier">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-5">
                    <label for="radialForceMultiplier">Radial</label>
                    <small>{{ radialForceMultiplier }}x</small>
                </div>
                <div class="col-7">
                    <input type="range" id="radialForceMultiplier" class="form-range"
                           name="radialForceMultiplier" min="0.01" max="10" step="0.01"
                           v-model="radialForceMultiplier">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-5">
                    <label for="radius">Radius</label>
                    <small>{{ radius }}px</small>
                </div>
                <div class="col-7">
                    <input type="range" id="radius" class="form-range"
                           name="radius" min="50" max="500" step="50"
                           v-model="radius">
                </div>
            </div>
        </div>

        <div>
            <ForceDirectedGraph
                    :allnodes="nodes"
                    :selection="selection"
                    :linkForceMultiplierInput="linkForceMultiplier"
                    :chargeForceMultiplierInput="chargeForceMultiplier"
                    :radialForceMultiplierInput="radialForceMultiplier"
                    :centeringForceMultiplierInput="centeringForceMultiplier"
                    :linkForceScaling="linkForceScaling"
                    :radiusInput="radius"
                    @node-clicked="(code) => selection = code"
            ></ForceDirectedGraph>
        </div>
    </main>

</template>

<script>
import ForceDirectedGraph from "@/components/ForceDirectedGraph.vue";
import { readGedcom } from 'read-gedcom';

export default {
  name: 'VisControls',
  components: {ForceDirectedGraph},
  data() {
    return {
      selection: 'default',
      linkForceScaling: 'log10',
      linkForceMultiplier: '1',
      chargeForceMultiplier: '1',
      radialForceMultiplier: '1',
      centeringForceMultiplier: '1',
      radius: '100',
      forceSetup: false,
      nodes: []
    };
  },
  methods: {
    toggleForceSetup() {
      this.forceSetup = !this.forceSetup;
    },
    loadSelection(event) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        const gedcom = readGedcom(buffer);
        console.log(gedcom.getIndividualRecord());
        this.loadNodes(gedcom);
      };
      reader.readAsArrayBuffer(file);
    },
    loadNodes(gedcom) {
      const findTag = (record, tag) => {
        return record.children.find((c) => c.tag === tag);
      };
      const findEventTag = (record, tag) => {
        let event = findTag(record, tag);
        if (event) {
          return { date: findTag(event, 'DATE')?.value, place: findTag(event, 'PLAC')?.value };
        }
        return null;
      };
      console.log(Object.values( gedcom.getIndividualRecord()));
      this.nodes = Object.values(gedcom.getIndividualRecord())
          .filter((a) => typeof a === 'object')
          .map((record) => {
        let s = findTag(record, 'SEX')?.value;
        return {
          'pointer': record.pointer,
          'name': findTag(record, 'NAME')?.value.replaceAll('/', ''),
          'sex': s === 'M' ? 'Male' : 'Female',
          'id': findTag(record, '_FSFTID')?.value,
          'birth': findEventTag(record, 'BIRT'),
          'christening': findEventTag(record, 'CHR'),
          'death': findEventTag(record, 'DEAT'),
          'burial': findEventTag(record, 'BURI'),
          'group': findTag(record, 'SEX')?.value,
        };
      });
    }
  }
}
</script>

<style>
#force-setup .form-group {
    min-height: 45px;
}

#force-setup {
    width: 500px;
    position: absolute;
    padding: 16px;
    right: 32px;
    margin-top: 16px;
    background-color: #f8f8ffaa;
    box-shadow: 0 0 8px #00000055;
    border-radius: 8px;
}

.bi-gear {
    right: 32px;
    margin-top: 16px;
    position: absolute;
    color: #ccc;
}

.bi-gear:hover {
    cursor: pointer;
    color: black;
}

.form-group div {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
