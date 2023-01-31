import { HttpGet } from '/js/iuf.js'

export default {
    name: 'AjaxSelect',
    props: ['name', 'modelValue', 'id', 'label', 'url', 'required', 'disabled', 'multiple'],
    emits: ['update:modelValue'],
    data() {
        return {
            debug: false,
            options: []
        }
    },
    async mounted() {
        try {
            this.options = await HttpGet(this.url);
        }
        catch (error) {
            console.error("Ajax call failed for select box: " + error);
        }
    },
    template: `
    <div class="rvt-flex">
        <div class="rvt-grow-1 rvt-items-center rvt-m-right-sm">
            <label class="rvt-label" :for="name">{{label}}</label>
        </div>
        <div class="rvt-items-center">
        </div>
    </div>

    <select v-model="modelValue"
            ref="selectedItem"
            @change="$emit('update:modelValue', $event.target.value)"
            :name="name"
            :id="id"
            :required="required ? true : null"
            :disabled=disabled  
            :multiple=multiple
            class="rvt-select">
            <option v-for="(value, key) in options" :value="key">{{ value }}</option>
    </select>

    <div v-if="debug">
        <h4>JSON for ajax-select</h4>

        <pre class="iuf-code">
{{options}}
        </pre>

        <h4>Model Value</h4>
        <pre class="iuf-code">
{{modelValue}}
        </pre>
    </div>
    `
};